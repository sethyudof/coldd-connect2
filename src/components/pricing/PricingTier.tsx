import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingTierProps {
  name: string;
  description: string;
  features: string[];
  price: string;
  interval: string;
  priceId: string;
  onSubscribe: (priceId: string) => void;
}

export const PricingTier = ({
  name,
  description,
  features,
  price,
  interval,
  priceId,
  onSubscribe,
}: PricingTierProps) => {
  console.log(`PricingTier ${name} rendering with priceId:`, priceId);

  const handleSubscribe = () => {
    console.log(`Attempting to subscribe to ${name} tier with priceId:`, priceId);
    onSubscribe(priceId);
  };

  const isDisabled = !priceId;
  if (isDisabled) {
    console.log(`${name} tier button is disabled due to missing priceId`);
  }

  return (
    <div className="border rounded-lg p-6 space-y-4 hover:border-primary transition-colors">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="text-3xl font-bold">
        {price}
        <span className="text-sm font-normal text-muted-foreground">
          {interval}
        </span>
      </div>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
      <Button 
        className="w-full" 
        onClick={handleSubscribe}
        disabled={isDisabled}
      >
        {isDisabled ? 'Price Not Configured' : 'Upgrade Now'}
      </Button>
    </div>
  );
};