import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PricingTier } from "./PricingTier";

const PRICING_TIERS = [
  {
    name: "Basic",
    description: "Perfect for individuals and small teams",
    monthly: {
      priceId: import.meta.env.VITE_STRIPE_TIER1_MONTHLY_PRICE_ID,
      price: "$3.99",
    },
    annual: {
      priceId: import.meta.env.VITE_STRIPE_TIER1_ANNUAL_PRICE_ID,
      price: "$35.99",
    },
  },
  {
    name: "Pro",
    description: "Advanced features for power users",
    monthly: {
      priceId: import.meta.env.VITE_STRIPE_TIER2_MONTHLY_PRICE_ID,
      price: "$6.99",
    },
    annual: {
      priceId: import.meta.env.VITE_STRIPE_TIER2_ANNUAL_PRICE_ID,
      price: "$62.99",
    },
  },
];

export const PricingDialog = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (priceId: string) => {
    try {
      if (!priceId) {
        console.error('No priceId provided to handleSubscribe');
        toast({
          title: "Error",
          description: "Invalid price configuration",
          variant: "destructive",
        });
        return;
      }

      console.log('Starting subscription process with priceId:', priceId);
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
        body: { priceId: priceId },
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
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CreditCard className="h-4 w-4" />
          Upgrade to Pro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg">
            <Button
              variant={isAnnual ? "outline" : "default"}
              size="sm"
              onClick={() => setIsAnnual(false)}
              className="transition-colors"
            >
              Monthly
            </Button>
            <Button
              variant={isAnnual ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAnnual(true)}
              className="transition-colors"
            >
              Annual (Save 25%)
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {PRICING_TIERS.map((tier) => (
            <PricingTier
              key={tier.name}
              name={tier.name}
              description={tier.description}
              price={isAnnual ? tier.annual.price : tier.monthly.price}
              interval={isAnnual ? "/year" : "/month"}
              onSubscribe={() =>
                handleSubscribe(
                  isAnnual ? tier.annual.priceId : tier.monthly.priceId
                )
              }
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};