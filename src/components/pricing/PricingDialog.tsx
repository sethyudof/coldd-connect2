import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to subscribe",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          trial_period_days: 7,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
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
              variant={isAnnual ? "ghost" : "secondary"}
              size="sm"
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </Button>
            <Button
              variant={isAnnual ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setIsAnnual(true)}
            >
              Annual (Save 17%)
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className="border rounded-lg p-6 space-y-4 hover:border-primary transition-colors"
            >
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
              <div className="text-3xl font-bold">
                {isAnnual ? tier.annual.price : tier.monthly.price}
                <span className="text-sm font-normal text-muted-foreground">
                  {isAnnual ? "/year" : "/month"}
                </span>
              </div>
              <Button
                className="w-full"
                onClick={() =>
                  handleSubscribe(
                    isAnnual ? tier.annual.priceId : tier.monthly.priceId
                  )
                }
              >
                Start 7-day Free Trial
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};