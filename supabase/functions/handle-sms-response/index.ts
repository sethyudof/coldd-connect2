import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const messageBody = formData.get('Body')?.toString() || '';
    const fromPhone = formData.get('From')?.toString() || '';

    console.log('Received SMS response:', { messageBody, fromPhone });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find the contact by phone number
    const { data: contacts, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('notification_phone', fromPhone)
      .single();

    if (contactError || !contacts) {
      console.error('Error finding contact:', contactError);
      return new Response(
        JSON.stringify({ error: 'Contact not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to parse the snooze duration using GPT
    let snoozeInterval: number | undefined;
    let snoozeUnit: 'days' | 'weeks' | 'months' | 'years' | undefined;

    // First try simple keyword matching
    const lowercaseMessage = messageBody.toLowerCase();
    if (lowercaseMessage.includes('1 week')) {
      snoozeInterval = 1;
      snoozeUnit = 'weeks';
    } else if (lowercaseMessage.includes('2 weeks')) {
      snoozeInterval = 2;
      snoozeUnit = 'weeks';
    } else if (lowercaseMessage.includes('1 month')) {
      snoozeInterval = 1;
      snoozeUnit = 'months';
    } else if (lowercaseMessage.includes('1 day')) {
      snoozeInterval = 1;
      snoozeUnit = 'days';
    } else {
      // If no simple match, use GPT to parse the natural language
      try {
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Extract snooze duration from user message. 
                         Return JSON with interval (number) and unit (days/weeks/months/years).
                         Example: {"interval": 2, "unit": "weeks"}
                         If unable to parse, return {"error": "Could not parse duration"}`
              },
              {
                role: 'user',
                content: messageBody
              }
            ],
          }),
        });

        const data = await gptResponse.json();
        const parsedResponse = JSON.parse(data.choices[0].message.content);
        
        if (!parsedResponse.error) {
          snoozeInterval = parsedResponse.interval;
          snoozeUnit = parsedResponse.unit;
        }
      } catch (error) {
        console.error('Error parsing with GPT:', error);
      }
    }

    if (!snoozeInterval || !snoozeUnit) {
      // Send help message if we couldn't parse the duration
      const helpMessage = 'Sorry, I couldn\'t understand that duration. Try saying something like "snooze for 2 weeks" or "remind me in 1 month"';
      
      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: fromPhone,
            From: TWILIO_PHONE_NUMBER,
            Body: helpMessage,
          }),
        }
      );

      return new Response(
        JSON.stringify({ message: 'Sent help message' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate new start date based on current date and snooze duration
    const currentDate = new Date();
    let newStartDate = new Date();
    
    switch (snoozeUnit) {
      case 'days':
        newStartDate.setDate(currentDate.getDate() - snoozeInterval);
        break;
      case 'weeks':
        newStartDate.setDate(currentDate.getDate() - (snoozeInterval * 7));
        break;
      case 'months':
        newStartDate.setMonth(currentDate.getMonth() - snoozeInterval);
        break;
      case 'years':
        newStartDate.setFullYear(currentDate.getFullYear() - snoozeInterval);
        break;
    }

    // Update the contact's start date
    const { error: updateError } = await supabase
      .from('contacts')
      .update({ start_date: newStartDate.toISOString() })
      .eq('id', contacts.id);

    if (updateError) {
      console.error('Error updating contact:', updateError);
      throw updateError;
    }

    // Send confirmation message
    const confirmationMessage = `Got it! I've snoozed the reminder for ${snoozeInterval} ${snoozeInterval === 1 ? snoozeUnit.slice(0, -1) : snoozeUnit}`;
    
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: fromPhone,
          From: TWILIO_PHONE_NUMBER,
          Body: confirmationMessage,
        }),
      }
    );

    return new Response(
      JSON.stringify({ message: 'Successfully snoozed reminder' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error handling SMS response:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});