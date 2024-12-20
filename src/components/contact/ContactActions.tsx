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
    <div className="flex gap-2 mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRenew}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Renew
      </Button>
      
      <Popover open={isSnoozeOpen} onOpenChange={setIsSnoozeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
          >
            <Timer className="h-4 w-4 mr-1" />
            Snooze
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