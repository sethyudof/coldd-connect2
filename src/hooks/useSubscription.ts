import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const handleSubscribe = async (priceId: string) => {
    try {
      console.log('Starting subscription process with priceId:', priceId);
      
      if (!priceId) {
        console.error('No priceId provided');
        toast.error("Configuration Error", {
          description: "No price ID provided for subscription",
          duration: 5000,
        });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session found');
        toast.error("Authentication Required", {
          description: "Please sign in to subscribe",
          duration: 5000,
        });
        return;
      }

      console.log('Creating checkout session for user:', session.user.id);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          priceId,
          returnUrl: window.location.origin 
        },
      });

      if (error) {
        console.error('Error from create-checkout:', error);
        throw error;
      }

      if (!data?.url) {
        console.error('No checkout URL received');
        throw new Error('Failed to create checkout session - no URL returned');
      }

      console.log('Redirecting to checkout URL:', data.url);
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error("Subscription Error", {
        description: error.message || "Failed to start checkout process",
        duration: 5000,
      });
    }
  };

  return { handleSubscribe };
};