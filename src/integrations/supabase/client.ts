// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pwwnencvpofrwnqilznb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3d25lbmN2cG9mcnducWlsem5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NDExNzAsImV4cCI6MjA1MDMxNzE3MH0.6tBlLzhVws6yILKWuKctkhagw0tRQDINN6XilwHL0pw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);