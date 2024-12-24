import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Starting create-checkout function');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    const { priceId, returnUrl } = requestData;
    console.log('Request payload:', { priceId, returnUrl });

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured');
      throw new Error('Stripe configuration error');
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
    const userId = payload.sub;
    const userEmail = payload.email;

    if (!userId || !userEmail) {
      console.error('Invalid token payload:', { userId, userEmail });
      throw new Error('Invalid authentication token');
    }

    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${returnUrl || req.headers.get('origin')}/`,
      cancel_url: `${returnUrl || req.headers.get('origin')}/`,
      metadata: {
        user_id: userId,
      },
    });

    console.log('Checkout session created:', session.id);
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
    console.error('Error in create-checkout function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = error instanceof Error && error.message === 'Authentication required' ? 401 : 500;
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: statusCode,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});