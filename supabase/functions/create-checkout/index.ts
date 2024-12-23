import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Log the start of the function execution
    console.log('Starting create-checkout function execution');

    const { priceId, returnUrl } = await req.json();
    console.log('Request payload:', { priceId, returnUrl });

    if (!priceId) {
      console.error('No price ID provided in request');
      throw new Error('No price ID provided');
    }

    // Initialize Stripe with detailed error logging
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY environment variable is not set');
      throw new Error('Stripe configuration error: Missing API key');
    }

    console.log('Initializing Stripe client');
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Validate that the price exists in Stripe
    console.log('Validating price ID:', priceId);
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log('Price validated successfully:', price.id);
    } catch (error) {
      console.error('Error validating price:', error);
      throw new Error(`Invalid price ID: ${error.message}`);
    }

    // Initialize Supabase client
    console.log('Initializing Supabase client');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Supabase configuration error');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get user information
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('Authentication required');
    }

    console.log('Getting user information');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user?.email) {
      console.error('Error getting user:', userError);
      throw new Error('User not found');
    }

    console.log('Looking up customer with email:', user.email);
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });

    let customer_id = undefined;
    if (customers.data.length > 0) {
      customer_id = customers.data[0].id;
      console.log('Found existing customer:', customer_id);
    }

    console.log('Creating checkout session');
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      customer_email: customer_id ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${returnUrl}/`,
      cancel_url: `${returnUrl}/`,
    });

    console.log('Checkout session created successfully:', session.id);
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-checkout:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});