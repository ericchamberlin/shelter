import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://jitavvtztqzisbynuqfv.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppdGF2dnR6dHF6aXNieW51cWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MDIzMTAsImV4cCI6MjA1ODk3ODMxMH0.npB9mGfa6BfDHHtgeuQglF5dNJ8quHC0jcAZWdZZuY8";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anon key. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your environment, or update the fallback values in supabaseClient.js.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
