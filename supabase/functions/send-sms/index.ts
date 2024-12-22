import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for due reminders
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('notifications_enabled', true)
      .not('notification_phone', 'is', null);

    if (contactsError) throw contactsError;

    console.log('Found contacts to check:', contacts.length);

    const now = new Date();
    const remindersToSend = contacts.filter(contact => {
      if (!contact.start_date || !contact.reminder_interval || !contact.reminder_unit) return false;

      const startDate = new Date(contact.start_date);
      let nextReminder = new Date(startDate);

      switch (contact.reminder_unit) {
        case 'days':
          nextReminder.setDate(startDate.getDate() + contact.reminder_interval);
          break;
        case 'weeks':
          nextReminder.setDate(startDate.getDate() + (contact.reminder_interval * 7));
          break;
        case 'months':
          nextReminder.setMonth(startDate.getMonth() + contact.reminder_interval);
          break;
        case 'years':
          nextReminder.setFullYear(startDate.getFullYear() + contact.reminder_interval);
          break;
      }

      return now >= nextReminder;
    });

    console.log('Found reminders to send:', remindersToSend.length);

    // Send SMS for each due reminder
    for (const contact of remindersToSend) {
      const message = `Reminder: It's time to connect with ${contact.name}!`;
      
      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: contact.notification_phone,
            From: TWILIO_PHONE_NUMBER,
            Body: message,
          }),
        }
      );

      const twilioData = await twilioResponse.json();
      console.log('Twilio response for', contact.name, ':', twilioData);

      // Update the start date for the next reminder period
      const { error: updateError } = await supabase
        .from('contacts')
        .update({ start_date: new Date().toISOString() })
        .eq('id', contact.id);

      if (updateError) {
        console.error('Error updating contact start date:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${remindersToSend.length} reminders`,
        processed: remindersToSend.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error processing reminders:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});