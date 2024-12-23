import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const { toast } = useToast();

  const handleSubscribe = async (priceId: string) => {
    try {
      console.log('Starting subscription process with priceId:', priceId);
      
      if (!priceId) {
        console.error('No priceId provided to handleSubscribe');
        toast({
          title: "Error",
          description: "Invalid price configuration. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No session found');
        toast({
          title: "Error",
          description: "You must be logged in to subscribe",
          variant: "destructive",
        });
        return;
      }

      console.log('Calling create-checkout function with priceId:', priceId);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error from create-checkout:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to checkout URL:', data.url);
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleSubscribe };
};