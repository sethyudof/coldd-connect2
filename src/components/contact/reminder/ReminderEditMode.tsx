import { Button } from "@/components/ui/button";
import { ReminderEditor } from "../ReminderEditor";

interface ReminderEditModeProps {
  interval: string;
  unit: 'days' | 'weeks' | 'months' | 'years';
  date?: Date;
  notificationsEnabled: boolean;
  notificationPhone: string;
  onIntervalChange: (value: string) => void;
  onUnitChange: (value: 'days' | 'weeks' | 'months' | 'years') => void;
  onDateChange: (date: Date | undefined) => void;
  onNotificationsEnabledChange: (enabled: boolean) => void;
  onNotificationPhoneChange: (phone: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ReminderEditMode = ({
  interval,
  unit,
  date,
  notificationsEnabled,
  notificationPhone,
  onIntervalChange,
  onUnitChange,
  onDateChange,
  onNotificationsEnabledChange,
  onNotificationPhoneChange,
  onSave,
  onCancel
}: ReminderEditModeProps) => {
  return (
    <ReminderEditor
      interval={interval}
      unit={unit}
      date={date}
      notificationsEnabled={notificationsEnabled}
      notificationPhone={notificationPhone}
      onIntervalChange={onIntervalChange}
      onUnitChange={onUnitChange}
      onDateChange={onDateChange}
      onNotificationsEnabledChange={onNotificationsEnabledChange}
      onNotificationPhoneChange={onNotificationPhoneChange}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};