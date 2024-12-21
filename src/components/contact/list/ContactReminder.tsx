import React from 'react';

interface ContactReminderProps {
  interval?: number;
  unit?: string;
}

export const ContactReminder = ({ interval, unit }: ContactReminderProps) => {
  if (!interval || !unit) {
    return null;
  }

  return (
    <div className="text-sm text-gray-600">
      Every {interval} {unit}
    </div>
  );
};