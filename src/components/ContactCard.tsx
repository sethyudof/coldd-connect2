import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

interface ContactCardProps {
  contact: {
    id: string;
    name: string;
    image?: string;
    reminderInterval?: number;
    nextReminder?: Date;
  };
  index: number;
}

export const ContactCard = ({ contact, index }: ContactCardProps) => {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Draggable draggableId={contact.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="p-4 mb-2 cursor-move hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={contact.image} alt={contact.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{contact.name}</h3>
                {contact.reminderInterval && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Every {contact.reminderInterval} months</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};