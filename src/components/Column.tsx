import { Card } from "@/components/ui/card";
import { ContactCard } from "./ContactCard";
import { Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import { ColumnHeader } from "./column/ColumnHeader";

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
  allContacts: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
  }>;
  onUpdateContact?: (contactId: string, updates: Partial<ColumnProps['contacts'][0]>) => void;
  onAddContact?: (contactId: string) => void;
}

export const Column = ({ 
  id, 
  title, 
  color, 
  contacts, 
  allContacts,
  onUpdateContact,
  onAddContact 
}: ColumnProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const availableContacts = allContacts.filter(
    contact => !contacts.some(existing => existing.id === contact.id)
  );

  return (
    <div className="flex-1 min-w-[280px] max-w-[400px] mx-2 h-full">
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-sm">
        <ColumnHeader
          title={title}
          color={color}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          availableContacts={availableContacts}
          onAddContact={onAddContact}
        />
      </div>
      <div className="pt-16">
        <Droppable droppableId={id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="min-h-[calc(100vh-8rem)]"
            >
              <Card className="p-2 bg-gray-50 dark:bg-gray-800">
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
    </div>
  );
};