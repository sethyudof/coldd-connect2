import { Card } from "@/components/ui/card";
import { ContactCard } from "./ContactCard";
import { Droppable } from "@hello-pangea/dnd";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";

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

  // Filter out contacts that are already in this list
  const availableContacts = allContacts.filter(
    contact => !contacts.some(existing => existing.id === contact.id)
  );

  return (
    <div className="w-80 mx-2">
      <div className="flex justify-between items-center mb-4">
        <h2 
          className="font-semibold px-2 py-1 rounded"
          style={{ backgroundColor: color, color: 'white' }}
        >
          {title}
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Contact to {title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px] mt-4">
              <div className="space-y-2">
                {availableContacts.map((contact) => (
                  <Button
                    key={contact.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      if (onAddContact) {
                        onAddContact(contact.id);
                        setIsOpen(false);
                      }
                    }}
                  >
                    {contact.name}
                    {contact.email && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({contact.email})
                      </span>
                    )}
                  </Button>
                ))}
                {availableContacts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No contacts available to add
                  </p>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
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