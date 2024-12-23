import { Check } from "lucide-react";

export const TrialFeatures = () => (
  <>
    <p className="text-center text-muted-foreground mb-6">
      Start your 7-day free trial today
    </p>
    <div className="space-y-2 mb-6">
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-primary" />
        <span className="text-sm">Unlimited contacts</span>
      </div>
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-primary" />
        <span className="text-sm">Smart reminders</span>
      </div>
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-primary" />
        <span className="text-sm">Contact categorization</span>
      </div>
    </div>
    <div className="text-center text-sm text-muted-foreground mb-6">
      Plans start at $3.99/month after trial
    </div>
  </>
);