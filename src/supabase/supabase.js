import { createClient } from '@supabase/supabase-js'

// Project ID will be auto-injected during deployment or use the provided one
const SUPABASE_URL = 'https://wwgyzsmolqesvuhxmhvp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Z3l6c21vbHFlc3Z1aHhtaHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjUzMDMsImV4cCI6MjA3OTIwMTMwM30.DM_84DhWR0n2Ghyyezw9kRoFU5VdNarViwsAUAtOcyw'

if(!SUPABASE_URL || !SUPABASE_ANON_KEY ){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})