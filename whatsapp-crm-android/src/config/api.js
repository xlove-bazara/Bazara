// Android WhatsApp CRM - API & Supabase Client Configuration

import { createClient } from '@supabase/supabase-js';

// Base backend URL for WhatsApp endpoints
export const BACKEND_BASE_URL = 'https://www.bazara.in';

export const SUPABASE_URL = 'https://zhwdaimprkmqljjwrbpk.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_eDWmwO-eoswzD8cdjudEJQ_ie4y7w9v';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
