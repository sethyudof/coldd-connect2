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

  const availableContacts = allContacts.filter(
    contact => !contacts.some(existing => existing.id === contact.id)
  );

  return (
    <div className="w-80 mx-2 h-full">
      <div className="fixed w-80">
        <div 
          className="flex justify-between items-center pb-4 w-full"
          style={{ 
            backgroundColor: `${color}80`, // 80 adds 50% opacity in hex
            backdropFilter: 'blur(8px)',
          }}
        >
          <h2 
            className="font-semibold px-2 py-1 ml-2"
            style={{ color: 'white' }}
          >
            {title}
          </h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-white/80">
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
      </div>
      <div className="pt-16"> {/* Add padding to account for fixed header */}
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