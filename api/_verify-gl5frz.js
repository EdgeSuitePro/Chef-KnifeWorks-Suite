import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Supabase environment is not configured.' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      public_code,
      status,
      source,
      scheduled_date,
      arrival_window,
      estimated_item_count,
      customer_notes,
      clients!inner(name, email, phone)
    `)
    .eq('public_code', 'GL5FRZ')
    .maybeSingle();

  if (error) {
    console.error('Verification query failed', error);
    return res.status(500).json({ error: 'Verification query failed.' });
  }

  if (!data) {
    return res.status(404).json({ found: false });
  }

  return res.status(200).json({
    found: true,
    reservation: {
      public_code: data.public_code,
      status: data.status,
      source: data.source,
      scheduled_date: data.scheduled_date,
      arrival_window: data.arrival_window,
      estimated_item_count: data.estimated_item_count,
      customer_notes: data.customer_notes,
      customer_name: data.clients?.name ?? null,
      customer_email_present: Boolean(data.clients?.email),
      customer_phone_present: Boolean(data.clients?.phone),
    },
  });
}
