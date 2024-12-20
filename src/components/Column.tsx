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
    image?: string;
    reminderInterval?: number;
    nextReminder?: Date;
  }>;
}

export const Column = ({ id, title, color, contacts }: ColumnProps) => {
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
                <ContactCard key={contact.id} contact={contact} />
              ))}
              {provided.placeholder}
            </Card>
          </div>
        )}
      </Droppable>
    </div>
  );
};