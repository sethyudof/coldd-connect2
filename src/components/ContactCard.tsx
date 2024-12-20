import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Edit2, Check, X } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, addWeeks, addMonths, addYears, differenceInMilliseconds } from "date-fns";
import { Progress } from "@/components/ui/progress";

interface ContactCardProps {
  contact: {
    id: string;
    name: string;
    image?: string;
    reminderInterval?: number;
    reminderUnit?: 'days' | 'weeks' | 'months' | 'years';
    nextReminder?: Date;
    startDate?: Date;
  };
  index: number;
  onUpdate?: (id: string, updates: Partial<ContactCardProps['contact']>) => void;
}

export const ContactCard = ({ contact, index, onUpdate }: ContactCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [interval, setInterval] = useState(contact.reminderInterval?.toString() || "");
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'years'>(contact.reminderUnit || 'months');
  const [date, setDate] = useState<Date | undefined>(contact.startDate || new Date());

  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const calculateProgress = () => {
    console.log("Calculating progress for:", contact.name);
    console.log("Start date:", contact.startDate);
    console.log("Reminder interval:", contact.reminderInterval);
    console.log("Reminder unit:", contact.reminderUnit);
    
    if (!contact.startDate || !contact.reminderInterval) {
      console.log("Missing required data, returning 0");
      return 0;
    }

    const now = new Date();
    let nextDate;
    
    switch (contact.reminderUnit) {
      case 'days':
        nextDate = addDays(new Date(contact.startDate), contact.reminderInterval);
        break;
      case 'weeks':
        nextDate = addWeeks(new Date(contact.startDate), contact.reminderInterval);
        break;
      case 'years':
        nextDate = addYears(new Date(contact.startDate), contact.reminderInterval);
        break;
      case 'months':
      default:
        nextDate = addMonths(new Date(contact.startDate), contact.reminderInterval);
    }

    const totalDuration = differenceInMilliseconds(nextDate, new Date(contact.startDate));
    const elapsed = differenceInMilliseconds(now, new Date(contact.startDate));
    
    const progress = (elapsed / totalDuration) * 100;
    console.log("Total duration:", totalDuration);
    console.log("Elapsed time:", elapsed);
    console.log("Calculated progress:", progress);
    
    return Math.min(Math.max(progress, 0), 100);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(contact.id, {
        reminderInterval: parseInt(interval),
        reminderUnit: unit,
        startDate: date,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInterval(contact.reminderInterval?.toString() || "");
    setUnit(contact.reminderUnit || 'months');
    setDate(contact.startDate || new Date());
    setIsEditing(false);
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
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={contact.image} alt={contact.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{contact.name}</h3>
                {!isEditing ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      {contact.reminderInterval && (
                        <>
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Every {contact.reminderInterval} {contact.reminderUnit || 'months'}</span>
                        </>
                      )}
                    </div>
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
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                        className="w-20"
                        min="1"
                      />
                      <Select value={unit} onValueChange={(value: any) => setUnit(value)}>
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
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={handleSave}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {contact.reminderInterval && contact.startDate && (
              <div className="absolute bottom-0 left-0 right-0 h-2">
                <Progress 
                  value={calculateProgress()} 
                  className="rounded-none"
                  style={{
                    backgroundColor: '#f3f4f6',
                    '--progress-background': '#ef4444',
                  } as any}
                />
              </div>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
};