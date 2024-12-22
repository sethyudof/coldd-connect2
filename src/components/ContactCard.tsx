import { Card } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactProgressBar } from "./contact/ContactProgressBar";
import { ContactActions } from "./contact/ContactActions";
import { ContactInfo } from "./contact/ContactInfo";
import { ReminderDisplay } from "./contact/reminder/ReminderDisplay";
import { ReminderEditMode } from "./contact/reminder/ReminderEditMode";
import { useReminderCalculation } from "@/hooks/useReminderCalculation";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

interface ContactCardProps {
  contact: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    image?: string;
    reminderInterval?: number;
    reminderUnit?: 'days' | 'weeks' | 'months' | 'years';
    nextReminder?: Date;
    startDate?: Date;
    notificationsEnabled?: boolean;
    notificationPhone?: string;
  };
  index: number;
  onUpdate?: (id: string, updates: Partial<ContactCardProps['contact']>) => void;
}

export const ContactCard = ({ contact, index, onUpdate }: ContactCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [interval, setInterval] = useState(contact.reminderInterval?.toString() || "");
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'years'>(contact.reminderUnit || 'months');
  const [date, setDate] = useState<Date | undefined>(contact.startDate || new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(contact.notificationsEnabled || false);
  const [notificationPhone, setNotificationPhone] = useState(contact.notificationPhone || '');

  const { calculateProgress } = useReminderCalculation(contact);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(contact.id, {
        reminderInterval: parseInt(interval),
        reminderUnit: unit,
        startDate: date,
        notificationsEnabled,
        notificationPhone: notificationsEnabled ? notificationPhone : null,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInterval(contact.reminderInterval?.toString() || "");
    setUnit(contact.reminderUnit || 'months');
    setDate(contact.startDate || new Date());
    setNotificationsEnabled(contact.notificationsEnabled || false);
    setNotificationPhone(contact.notificationPhone || '');
    setIsEditing(false);
  };

  const handleRenew = () => {
    if (onUpdate) {
      onUpdate(contact.id, {
        startDate: new Date(),
      });
    }
  };

  const handleSnooze = (snoozeInterval: number, snoozeUnit: 'days' | 'weeks' | 'months' | 'years') => {
    if (!contact.startDate || !contact.reminderInterval || !onUpdate) return;

    let newStartDate = new Date(contact.startDate);
    switch (snoozeUnit) {
      case 'days':
        newStartDate = addDays(newStartDate, -snoozeInterval);
        break;
      case 'weeks':
        newStartDate = addWeeks(newStartDate, -snoozeInterval);
        break;
      case 'months':
        newStartDate = addMonths(newStartDate, -snoozeInterval);
        break;
      case 'years':
        newStartDate = addYears(newStartDate, -snoozeInterval);
        break;
    }

    onUpdate(contact.id, {
      startDate: newStartDate,
    });
  };

  return (
    <Draggable draggableId={contact.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="p-4 mb-2 cursor-move hover:shadow-md transition-shadow relative">
            <ContactInfo
              name={contact.name}
              image={contact.image}
              email={contact.email}
              phone={contact.phone}
            />
            
            {!isEditing ? (
              <div className="flex items-center justify-between mt-2">
                <ReminderDisplay
                  interval={contact.reminderInterval}
                  unit={contact.reminderUnit}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <ReminderEditMode
                interval={interval}
                unit={unit}
                date={date}
                notificationsEnabled={notificationsEnabled}
                notificationPhone={notificationPhone}
                onIntervalChange={setInterval}
                onUnitChange={setUnit}
                onDateChange={setDate}
                onNotificationsEnabledChange={setNotificationsEnabled}
                onNotificationPhoneChange={setNotificationPhone}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
            
            {!isEditing && (
              <ContactActions
                onRenew={handleRenew}
                onSnooze={handleSnooze}
              />
            )}
            
            {contact.reminderInterval && contact.startDate && (
              <ContactProgressBar progress={calculateProgress()} />
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
};