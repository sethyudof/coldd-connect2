import { Button } from "@/components/ui/button";

interface PricingTierProps {
  name: string;
  description: string;
  price: string;
  interval: string;
  priceId: string;
  onSubscribe: (priceId: string) => void;
}

export const PricingTier = ({
  name,
  description,
  price,
  interval,
  priceId,
  onSubscribe,
}: PricingTierProps) => {
  console.log(`PricingTier rendered for ${name} with priceId:`, priceId);
  
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
      <Button 
        className="w-full" 
        onClick={() => {
          console.log('Subscribe button clicked with priceId:', priceId);
          onSubscribe(priceId);
        }}
        disabled={!priceId}
      >
        {priceId ? 'Upgrade Now' : 'Price configuration missing'}
      </Button>
    </div>
  );
};