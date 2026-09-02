import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const hashToken = (token) => createHash('sha256').update(String(token || '')).digest('hex');
const allowedInstructions = new Set([
  'Broken tip',
  'Chips / edge damage',
  'Repair needed',
  'Japanese / high-end knife',
  'Whetstone sharpening only'
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { success: false, error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return json(res, 503, { success: false, error: 'Reservation storage is not configured yet.' });
  }

  const { reservationId, orderPass, instructions, other } = req.body || {};
  const cleanId = String(reservationId || '').trim().toUpperCase();
  const cleanPass = String(orderPass || '').trim();
  const selected = Array.isArray(instructions)
    ? [...new Set(instructions.map(value => String(value || '').trim()).filter(value => allowedInstructions.has(value)))]
    : [];
  const cleanOther = String(other || '').trim().slice(0, 800);

  if (!cleanId || !cleanPass || (selected.length === 0 && !cleanOther)) {
    return json(res, 400, { success: false, error: 'Please choose an instruction or add a note.' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  try {
    const { data: order, error: lookupError } = await supabase
      .from('work_orders')
      .select('id, business_id')
      .eq('public_code', cleanId)
      .eq('access_token_hash', hashToken(cleanPass))
      .single();

    if (lookupError || !order?.id) {
      return json(res, 404, { success: false, error: 'We could not match these instructions to your reservation.' });
    }

    const parts = [...selected];
    if (cleanOther) parts.push(`Other: ${cleanOther}`);
    const note = parts.join('; ');

    const { error: updateError } = await supabase
      .from('work_orders')
      .update({ customer_notes: note })
      .eq('id', order.id)
      .eq('business_id', order.business_id);

    if (updateError) throw updateError;

    return json(res, 200, { success: true });
  } catch (error) {
    console.error('Reservation instruction update failed:', error);
    return json(res, 500, { success: false, error: 'We could not save your instructions.' });
  }
}
