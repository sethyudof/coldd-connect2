import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { ContactsState } from "./ColumnsContainer";
import { Table, TableHeader } from "@/components/ui/table";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ContactListHeader } from "./list/ContactListHeader";
import { ContactListContent } from "./list/ContactListContent";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContactListDialogProps {
  contacts: ContactsState;
  allContacts: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    image?: string;
    reminderInterval?: number;
    reminderUnit?: 'days' | 'weeks' | 'months' | 'years';
    startDate?: Date;
  }>;
  categories: Record<string, { title: string; color: string }>;
  onUpdateContact: (columnId: string, contactId: string, updates: any) => void;
}

export const ContactListDialog = ({ 
  contacts, 
  allContacts,
  categories, 
  onUpdateContact 
}: ContactListDialogProps) => {
  const [editingContact, setEditingContact] = useState<any | null>(null);
  const queryClient = useQueryClient();

  console.log('ContactListDialog - Initial contacts:', contacts);
  console.log('ContactListDialog - All contacts:', allContacts);
  console.log('ContactListDialog - Categories:', categories);

  // Create a map to store contacts and their categories
  const contactMap = new Map();
  
  // Initialize map with all contacts
  allContacts.forEach(contact => {
    contactMap.set(contact.id, {
      contact,
      categories: []
    });
  });

  // Add category information for each contact
  Object.entries(contacts).forEach(([columnId, columnContacts]) => {
    columnContacts.forEach(contact => {
      const existingEntry = contactMap.get(contact.id);
      if (existingEntry) {
        console.log(`Adding category ${columnId} to contact ${contact.name}:`, {
          id: columnId,
          title: categories[columnId].title,
          color: categories[columnId].color
        });
        existingEntry.categories.push({
          id: columnId,
          title: categories[columnId].title,
          color: categories[columnId].color
        });
      }
    });
  });

  // Convert map to array and sort by name
  const groupedContacts = Array.from(contactMap.values())
    .sort((a, b) => a.contact.name.localeCompare(b.contact.name));

  console.log('ContactListDialog - Grouped contacts with categories:', groupedContacts);

  const handleStartEdit = (columnId: string, contact: typeof allContacts[0]) => {
    setEditingContact({
      columnId,
      contactId: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      interval: contact.reminderInterval?.toString(),
      unit: contact.reminderUnit,
      date: contact.startDate,
    });
  };

  const handleSaveEdit = () => {
    if (!editingContact) return;

    onUpdateContact(editingContact.columnId, editingContact.contactId, {
      name: editingContact.name,
      email: editingContact.email,
      phone: editingContact.phone,
      reminderInterval: editingContact.interval ? parseInt(editingContact.interval) : undefined,
      reminderUnit: editingContact.unit,
      startDate: editingContact.date,
    });

    setEditingContact(null);
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleContactDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['contacts'] });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-4">
          <List className="mr-2 h-4 w-4" />
          Contact List
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Contact List</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-8rem)]">
          <div className="mt-4">
            <Table>
              <TableHeader>
                <ContactListHeader />
              </TableHeader>
              <ContactListContent
                groupedContacts={groupedContacts}
                categories={categories}
                editingContact={editingContact}
                handleStartEdit={handleStartEdit}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                setEditingContact={setEditingContact}
                onContactDeleted={handleContactDeleted}
              />
            </Table>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};