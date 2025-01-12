import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Initializing Supabase client with:', {
  url: SUPABASE_URL ? 'URL present' : 'URL missing',
  key: SUPABASE_PUBLISHABLE_KEY ? 'Key present' : 'Key missing'
});

export const supabase = createClient<Database>(
  SUPABASE_URL || "https://pwwnencvpofrwnqilznb.supabase.co",
  SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3d25lbmN2cG9mcnducWlsem5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NDExNzAsImV4cCI6MjA1MDMxNzE3MH0.6tBlLzhVws6yILKWuKctkhagw0tRQDINN6XilwHL0pw"
);