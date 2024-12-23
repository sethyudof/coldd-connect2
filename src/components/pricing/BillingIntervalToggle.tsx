import { Button } from "@/components/ui/button";

interface BillingIntervalToggleProps {
  isAnnual: boolean;
  onChange: (isAnnual: boolean) => void;
}

export const BillingIntervalToggle = ({
  isAnnual,
  onChange,
}: BillingIntervalToggleProps) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg">
        <Button
          variant={isAnnual ? "outline" : "default"}
          size="sm"
          onClick={() => onChange(false)}
          className="transition-colors"
        >
          Monthly
        </Button>
        <Button
          variant={isAnnual ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(true)}
          className="transition-colors"
        >
          Annual (Save 25%)
        </Button>
      </div>
    </div>
  );
};