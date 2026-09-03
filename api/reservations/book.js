import { createHash, randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { buildBookingConfirmation } from '../rdcom/booking-confirmation.js';
import { sendTransactionalEmail } from '../rdcom/send-transactional-email.js';

const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const normalizePhone = (value) => String(value || '').replace(/\D/g, '');
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const firstNameFrom = (name) => String(name || '').trim().split(/\s+/)[0] || null;
const hashToken = (token) => createHash('sha256').update(token).digest('hex');
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
const slotMap = {
  '8–9 AM': { stored: '08:00-09:00', daypart: 'morning' },
  '9–10 AM': { stored: '09:00-10:00', daypart: 'morning' },
  '10–11 AM': { stored: '10:00-11:00', daypart: 'morning' },
  '11 AM–12 PM': { stored: '11:00-12:00', daypart: 'morning' },
  '12–1 PM': { stored: '12:00-13:00', daypart: 'midday' },
  '1–2 PM': { stored: '13:00-14:00', daypart: 'midday' },
  '2–3 PM': { stored: '14:00-15:00', daypart: 'midday' },
  '3–4 PM': { stored: '15:00-16:00', daypart: 'midday' },
  '4–5 PM': { stored: '16:00-17:00', daypart: 'evening' },
  '5–6 PM': { stored: '17:00-18:00', daypart: 'evening' },
  '6–7 PM': { stored: '18:00-19:00', daypart: 'evening' },
  '7–8 PM': { stored: '19:00-20:00', daypart: 'evening' }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { success: false, error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return json(res, 503, { success: false, error: 'Booking storage is not configured yet.' });
  }

  const { customer, reservation } = req.body || {};
  const estimatedItemCount = Number.parseInt(reservation?.estimatedItemCount, 10);
  const arrivalWindow = reservation?.arrivalWindow;
  const slot = slotMap[reservation?.selectedSlot];
  const customerName = String(customer?.name || '').trim();
  const normalizedPhone = normalizePhone(customer?.phone);
  const normalizedEmail = normalizeEmail(customer?.email);

  if (
    customerName.length < 2 ||
    !validEmail(normalizedEmail) ||
    normalizedPhone.length < 10 ||
    !reservation?.id ||
    !validDate(reservation?.selectedDate) ||
    !['morning', 'midday', 'evening'].includes(arrivalWindow) ||
    !slot ||
    slot.daypart !== arrivalWindow ||
    !Number.isInteger(estimatedItemCount) ||
    estimatedItemCount < 1 ||
    estimatedItemCount > 100
  ) {
    return json(res, 400, { success: false, error: 'Please check your reservation details and try again.' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  try {
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', 'chef-knifeworks')
      .eq('active', true)
      .single();

    if (businessError || !business?.id) {
      throw businessError || new Error('Chef KnifeWorks business record not found.');
    }

    const { data: existingClient, error: clientLookupError } = await supabase
      .from('clients')
      .select('id')
      .eq('business_id', business.id)
      .eq('normalized_phone', normalizedPhone)
      .maybeSingle();

    if (clientLookupError) throw clientLookupError;

    let clientId = existingClient?.id;
    const clientValues = {
      business_id: business.id,
      name: customerName,
      first_name: firstNameFrom(customerName),
      email: normalizedEmail,
      normalized_email: normalizedEmail,
      phone: String(customer.phone).trim(),
      normalized_phone: normalizedPhone,
      service_message_consent_at: new Date().toISOString()
    };

    if (!clientId) {
      const { data: createdClient, error: clientCreateError } = await supabase
        .from('clients')
        .insert(clientValues)
        .select('id')
        .single();
      if (clientCreateError) throw clientCreateError;
      clientId = createdClient.id;
    } else {
      const { error: clientUpdateError } = await supabase
        .from('clients')
        .update(clientValues)
        .eq('id', clientId)
        .eq('business_id', business.id);
      if (clientUpdateError) throw clientUpdateError;
    }

    const orderPass = randomBytes(24).toString('base64url');
    const { data: createdOrder, error: workOrderError } = await supabase
      .from('work_orders')
      .insert({
        business_id: business.id,
        client_id: clientId,
        public_code: reservation.id,
        access_token_hash: hashToken(orderPass),
        status: 'booked',
        source: 'ckw-website',
        scheduled_date: reservation.selectedDate,
        arrival_window: arrivalWindow,
        arrival_slot: slot.stored,
        estimated_item_count: estimatedItemCount,
        customer_notes: reservation.notes || null
      })
      .select('id, public_code')
      .single();

    if (workOrderError) throw workOrderError;

    const { error: eventError } = await supabase.from('work_order_events').insert({
      business_id: business.id,
      work_order_id: createdOrder.id,
      event_type: 'booked',
      to_status: 'booked',
      actor_type: 'customer',
      note: 'Booked from chefknifeworks.com/appointments',
      metadata: { source: 'ckw-website', arrival_slot: slot.stored }
    });

    if (eventError) console.error('Work order event logging failed:', eventError);

    let confirmationEmail = 'not_configured';
    if (process.env.RDCOM_ACCOUNT_CODE && process.env.RDCOM_API_TOKEN && process.env.RDCOM_SENDER_EMAIL) {
      try {
        const message = buildBookingConfirmation({
          customerName,
          scheduledDate: reservation.selectedDate,
          arrivalSlot: slot.stored,
          estimatedItemCount
        });
        await sendTransactionalEmail({
          to: normalizedEmail,
          subject: message.subject,
          html: message.html,
          text: message.text
        });
        confirmationEmail = 'sent';
      } catch (messageError) {
        confirmationEmail = 'failed';
        console.error('RDcom booking confirmation failed:', {
          message: messageError?.message,
          status: messageError?.status || null
        });
      }
    }

    return json(res, 201, {
      success: true,
      reservationId: createdOrder.public_code,
      orderPass,
      confirmationEmail
    });
  } catch (error) {
    console.error('Reservation booking failed:', error);
    return json(res, 500, { success: false, error: 'We could not save this reservation.' });
  }
}
