// Android WhatsApp CRM - API & Supabase Client Configuration

import { createClient } from '@supabase/supabase-js';

// Base backend URL for WhatsApp endpoints
export const BACKEND_BASE_URL = 'https://bazara.in'; // Or local development IP

export const SUPABASE_URL = 'https://vkmjrqkptqgtyqfhzrqx.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbWpycWtwdHFndHlxZmh6cnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzY4NTYsImV4cCI6MjA1NjgxMjg1Nn0.8aA54k9iLwz6l-844_ZzB9hF-e0P8f1gU4uR4pW3z-g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
