import { Clock } from "lucide-react";

interface ReminderDisplayProps {
  interval?: number;
  unit?: 'days' | 'weeks' | 'months' | 'years';
}

const getPluralizedUnit = (interval: number, unit: string): string => {
  if (interval === 1) {
    return unit.endsWith('s') ? unit.slice(0, -1) : unit;
  }
  return unit;
};

export const ReminderDisplay = ({ interval, unit }: ReminderDisplayProps) => {
  if (!interval || !unit) return null;

  return (
    <div className="flex items-center text-sm text-gray-500">
      <Clock className="w-4 h-4 mr-1" />
      <span>Every {interval} {getPluralizedUnit(interval, unit)}</span>
    </div>
  );
};