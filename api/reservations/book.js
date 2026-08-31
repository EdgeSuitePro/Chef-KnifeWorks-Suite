import { createClient } from '@supabase/supabase-js';

const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
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
  if (!customer?.name || !customer?.email || !customer?.phone || !reservation?.id || !reservation?.selectedDate || !reservation?.selectedSlot) {
    return json(res, 400, { success: false, error: 'Missing required reservation details.' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  try {
    const normalizedEmail = String(customer.email).trim().toLowerCase();
    const normalizedPhone = String(customer.phone).trim();

    const { data: existingCustomer, error: lookupError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (lookupError) throw lookupError;

    let customerId = existingCustomer?.id;
    if (!customerId) {
      customerId = crypto.randomUUID();
      const { error: customerError } = await supabase.from('customers').insert({
        id: customerId,
        name: String(customer.name).trim(),
        email: normalizedEmail,
        phone: normalizedPhone
      });
      if (customerError) throw customerError;
    } else {
      const { error: customerUpdateError } = await supabase
        .from('customers')
        .update({ name: String(customer.name).trim(), phone: normalizedPhone })
        .eq('id', customerId);
      if (customerUpdateError) throw customerUpdateError;
    }

    const { error: reservationError } = await supabase.from('reservations').insert({
      id: reservation.id,
      customer_id: customerId,
      drop_off_date: reservation.selectedDate,
      drop_off_time: reservation.selectedSlot,
      pickup_date: reservation.pickupDate || null,
      knife_quantity: reservation.knifeQty || 'Not provided',
      notes: reservation.notes || '',
      status: 'booked',
      source: reservation.source || 'ckw-website'
    });

    if (reservationError) throw reservationError;

    return json(res, 201, { success: true, reservationId: reservation.id });
  } catch (error) {
    console.error('Reservation booking failed:', error);
    return json(res, 500, { success: false, error: 'We could not save this reservation.' });
  }
}
