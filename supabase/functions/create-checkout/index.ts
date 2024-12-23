import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  try {
    console.log('Received request:', req.method, req.url);
    
    const body = await req.json();
    console.log('Request body:', body);
    
    if (!body?.priceId) {
      console.error('No priceId in request body:', body);
      throw new Error('No price ID provided')
    }

    console.log('Processing checkout with priceId:', body.priceId);

    // Get the user from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user?.email) {
      console.error('Error getting user:', userError);
      throw new Error('No user found')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Log Stripe configuration
    console.log('Stripe configuration:', {
      hasSecretKey: !!Deno.env.get('STRIPE_SECRET_KEY'),
      priceId: body.priceId
    });

    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    let customer_id = undefined
    if (customers.data.length > 0) {
      customer_id = customers.data[0].id
    }

    console.log('Creating payment session...')
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      customer_email: customer_id ? undefined : user.email,
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/`,
      cancel_url: `${req.headers.get('origin')}/`,
    })

    console.log('Payment session created:', session.id)
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating payment session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})