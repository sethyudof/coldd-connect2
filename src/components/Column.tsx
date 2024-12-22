import { Card } from "@/components/ui/card";
import { ContactCard } from "./ContactCard";
import { Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import { ColumnHeader } from "./column/ColumnHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const availableContacts = allContacts.filter(
    contact => !contacts.some(existing => existing.id === contact.id)
  );

  const handleAddContact = async (contactId: string) => {
    try {
      console.log('Adding contact to category:', { contactId, categoryId: id });
      
      const { error: categoryError } = await supabase
        .from('contact_categories')
        .insert([{
          contact_id: contactId,
          category_id: id
        }]);

      if (categoryError) throw categoryError;

      const { error: contactError } = await supabase
        .from('contacts')
        .update({
          reminder_interval: 1,
          reminder_unit: 'months',
          start_date: new Date().toISOString()
        })
        .eq('id', contactId);

      if (contactError) throw contactError;

      await queryClient.invalidateQueries({ queryKey: ['contacts'] });
      
      if (onAddContact) {
        onAddContact(contactId);
      }

      setIsOpen(false);
      toast({
        title: "Contact added",
        description: `Contact has been added to ${title}`,
      });
    } catch (error) {
      console.error('Error adding contact to category:', error);
      toast({
        title: "Error",
        description: "Failed to add contact to category",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 min-w-[280px] max-w-[400px] mx-2 flex flex-col">
      <div className="sticky top-0 z-50 bg-background">
        <ColumnHeader
          title={title}
          color={color}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          availableContacts={availableContacts}
          onAddContact={handleAddContact}
        />
      </div>
      <div className="mt-4">
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
