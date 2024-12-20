import { Card } from "@/components/ui/card";
import { ContactCard } from "./ContactCard";
import { Droppable } from "@hello-pangea/dnd";

interface ColumnProps {
  id: string;
  title: string;
  color: string;
  contacts: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    image?: string;
    reminderInterval?: number;
    reminderUnit?: 'days' | 'weeks' | 'months' | 'years';
    nextReminder?: Date;
    startDate?: Date;
  }>;
  onUpdateContact?: (contactId: string, updates: Partial<ColumnProps['contacts'][0]>) => void;
}

export const Column = ({ id, title, color, contacts, onUpdateContact }: ColumnProps) => {
  return (
    <div className="w-80 mx-2">
      <h2 
        className="font-semibold mb-4 px-2 py-1 rounded"
        style={{ backgroundColor: color, color: 'white' }}
      >
        {title}
      </h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            <Card className="p-2 bg-gray-50">
              {contacts.map((contact, index) => (
                <ContactCard 
                  key={contact.id} 
                  contact={contact} 
                  index={index}
                  onUpdate={onUpdateContact}
                />
              ))}
              {provided.placeholder}
            </Card>
          </div>
        )}
      </Droppable>
    </div>
  );
};