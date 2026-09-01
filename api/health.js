import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ ok: false, database: 'not-configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await supabase
      .from('businesses')
      .select('id,slug,name')
      .eq('slug', 'chef-knifeworks')
      .maybeSingle();

    if (error) throw error;

    return res.status(200).json({
      ok: Boolean(data),
      database: data ? 'connected' : 'business-not-found',
      business: data ? { slug: data.slug, name: data.name } : null
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({ ok: false, database: 'error' });
  }
}
