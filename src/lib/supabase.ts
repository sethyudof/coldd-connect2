import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      contact_categories (*)
    `);
  
  if (error) throw error;
  return data;
};

export const updateContact = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

export const createContact = async (contact: any) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact]);
  
  if (error) throw error;
  return data;
};

export const deleteContact = async (id: string) => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};