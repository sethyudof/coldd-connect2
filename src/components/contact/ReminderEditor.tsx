import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ReminderEditorProps {
  interval: string;
  unit: 'days' | 'weeks' | 'months' | 'years';
  date: Date | undefined;
  notificationsEnabled?: boolean;
  notificationPhone?: string;
  onIntervalChange: (value: string) => void;
  onUnitChange: (value: 'days' | 'weeks' | 'months' | 'years') => void;
  onDateChange: (date: Date | undefined) => void;
  onNotificationsEnabledChange?: (enabled: boolean) => void;
  onNotificationPhoneChange?: (phone: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ReminderEditor = ({
  interval,
  unit,
  date,
  notificationsEnabled = false,
  notificationPhone = '',
  onIntervalChange,
  onUnitChange,
  onDateChange,
  onNotificationsEnabledChange,
  onNotificationPhoneChange,
  onSave,
  onCancel,
}: ReminderEditorProps) => {
  return (
    <div className="mt-2 space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={interval}
          onChange={(e) => onIntervalChange(e.target.value)}
          className="w-20"
          min="1"
        />
        <Select value={unit} onValueChange={onUnitChange}>
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
      
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {date ? format(date, 'PP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={onNotificationsEnabledChange}
          />
          <Label htmlFor="notifications">Enable SMS Reminders</Label>
        </div>

        {notificationsEnabled && (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number for SMS</Label>
            <Input
              id="phone"
              type="tel"
              value={notificationPhone}
              onChange={(e) => onNotificationPhoneChange?.(e.target.value)}
              placeholder="+1234567890"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};