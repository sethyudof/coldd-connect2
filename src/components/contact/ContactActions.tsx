import { Button } from "@/components/ui/button";
import { RefreshCw, Timer } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ContactActionsProps {
  onRenew: () => void;
  onSnooze: (interval: number, unit: 'days' | 'weeks' | 'months' | 'years') => void;
}

export const ContactActions = ({ onRenew, onSnooze }: ContactActionsProps) => {
  const [isSnoozeOpen, setIsSnoozeOpen] = useState(false);
  const [snoozeInterval, setSnoozeInterval] = useState("");
  const [snoozeUnit, setSnoozeUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');

  const handleSnooze = () => {
    const interval = parseInt(snoozeInterval);
    if (interval > 0) {
      onSnooze(interval, snoozeUnit);
      setIsSnoozeOpen(false);
      setSnoozeInterval("");
    }
  };

  return (
    <div className="flex gap-2 mt-2 justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={onRenew}
        className="h-8 w-8 text-primary hover:text-primary/80"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      
      <Popover open={isSnoozeOpen} onOpenChange={setIsSnoozeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:text-primary/80"
          >
            <Timer className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col gap-4">
            <h4 className="font-medium">Delay reminder by:</h4>
            <div className="flex gap-2">
              <Input
                type="number"
                value={snoozeInterval}
                onChange={(e) => setSnoozeInterval(e.target.value)}
                className="w-20"
                min="1"
              />
              <Select value={snoozeUnit} onValueChange={(value: any) => setSnoozeUnit(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" onClick={handleSnooze}>
              Confirm
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};