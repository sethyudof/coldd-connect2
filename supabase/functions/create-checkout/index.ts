import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Parse request body
    const body = await req.text();
    console.log('Raw request body:', body);
    
    const { priceId, returnUrl } = JSON.parse(body);
    console.log('Processing checkout request with:', { priceId, returnUrl });

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not found in environment');
      throw new Error('Stripe configuration error');
    }

    // Get the actual Stripe price IDs from environment
    const tier1MonthlyPriceId = Deno.env.get('STRIPE_TIER1_MONTHLY_PRICE_ID');
    const tier1AnnualPriceId = Deno.env.get('STRIPE_TIER1_ANNUAL_PRICE_ID');
    const tier2MonthlyPriceId = Deno.env.get('STRIPE_TIER2_MONTHLY_PRICE_ID');
    const tier2AnnualPriceId = Deno.env.get('STRIPE_TIER2_ANNUAL_PRICE_ID');

    console.log('Available Stripe price IDs:', {
      tier1Monthly: tier1MonthlyPriceId,
      tier1Annual: tier1AnnualPriceId,
      tier2Monthly: tier2MonthlyPriceId,
      tier2Annual: tier2AnnualPriceId,
      receivedPriceId: priceId
    });

    // Validate priceId against available options
    const validPriceIds = [
      tier1MonthlyPriceId,
      tier1AnnualPriceId,
      tier2MonthlyPriceId,
      tier2AnnualPriceId
    ].filter(Boolean); // Remove any undefined values

    if (!validPriceIds.includes(priceId)) {
      console.error('Invalid price ID provided:', priceId);
      console.log('Valid price IDs are:', validPriceIds);
      throw new Error(`Invalid price ID. Received: ${priceId}`);
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get auth user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('Authentication required');
    }

    // Extract JWT token and decode payload
    const token = authHeader.replace('Bearer ', '');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    console.log('Token payload:', { 
      sub: payload.sub ? 'present' : 'missing',
      email: payload.email ? 'present' : 'missing'
    });

    const userId = payload.sub;
    const userEmail = payload.email;

    if (!userId || !userEmail) {
      console.error('Invalid token payload:', { userId, userEmail });
      throw new Error('Invalid authentication token');
    }

    console.log('Creating Stripe checkout session with:', {
      customerEmail: userEmail,
      priceId: priceId,
      userId: userId,
      returnUrl: returnUrl
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [{ 
        price: priceId,
        quantity: 1 
      }],
      mode: 'subscription',
      success_url: `${returnUrl || req.headers.get('origin')}/`,
      cancel_url: `${returnUrl || req.headers.get('origin')}/`,
      metadata: {
        user_id: userId,
      },
    });

    console.log('Checkout session created successfully:', { 
      sessionId: session.id,
      url: session.url 
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: error.type,
      raw: error.raw,
      statusCode: error.statusCode,
      requestId: error.requestId
    });

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.raw || error.stack
      }),
      { 
        status: error.statusCode || 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});