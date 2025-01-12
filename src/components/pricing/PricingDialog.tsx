import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { PricingTier } from "./PricingTier";
import { BillingIntervalToggle } from "./BillingIntervalToggle";
import { useSubscription } from "@/hooks/useSubscription";
import { PRICING_TIERS } from "@/config/pricing";
import { toast } from "sonner";

export const PricingDialog = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [open, setOpen] = useState(false);
  const { handleSubscribe } = useSubscription();

  const handleSubscription = async (priceId: string) => {
    try {
      if (!priceId) {
        console.error('No priceId provided');
        toast.error("Configuration Error", {
          description: "Invalid price configuration. Please contact support.",
        });
        return;
      }
      
      console.log('Starting subscription process with priceId:', priceId);
      await handleSubscribe(priceId);
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Subscription Error", {
        description: "Failed to start subscription process. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-dialog="pricing">
          <CreditCard className="h-4 w-4" />
          Upgrade to Pro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your needs. All plans include our core features.
          </DialogDescription>
        </DialogHeader>
        <BillingIntervalToggle isAnnual={isAnnual} onChange={setIsAnnual} />
        <div className="grid md:grid-cols-2 gap-4">
          {PRICING_TIERS.map((tier) => {
            const currentPriceId = isAnnual ? tier.annual.priceId : tier.monthly.priceId;
            console.log(`Rendering ${tier.name} with price ID:`, currentPriceId);
            
            return (
              <PricingTier
                key={tier.name}
                name={tier.name}
                description={tier.description}
                features={tier.features}
                price={isAnnual ? tier.annual.price : tier.monthly.price}
                interval={isAnnual ? "/year" : "/month"}
                priceId={currentPriceId}
                onSubscribe={handleSubscription}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};