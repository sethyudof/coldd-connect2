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
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ContactTableRow } from "./ContactTableRow";
import { useQueryClient } from "@tanstack/react-query";

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

  console.log('ContactListDialog - all contacts:', allContacts);
  console.log('ContactListDialog - categorized contacts:', contacts);

  // Create a map of all contacts with their categories
  const contactMap = new Map();
  
  // First, add all contacts to the map (this ensures uncategorized contacts are included)
  allContacts.forEach(contact => {
    contactMap.set(contact.id, {
      contact,
      categories: []
    });
  });

  // Then add category information for categorized contacts
  Object.entries(contacts).forEach(([columnId, columnContacts]) => {
    columnContacts.forEach(contact => {
      const existingEntry = contactMap.get(contact.id);
      if (existingEntry) {
        existingEntry.categories.push({
          id: columnId,
          title: categories[columnId].title,
          color: categories[columnId].color
        });
      }
    });
  });

  console.log('ContactListDialog - contact map:', Array.from(contactMap.values()));

  // Convert map to array
  const groupedContacts = Array.from(contactMap.values());

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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Contact List</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact Details</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Reminder</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedContacts.map(({ contact, categories: contactCategories }) => (
                <ContactTableRow
                  key={contact.id}
                  contact={contact}
                  columnId={contactCategories[0]?.id || ''}
                  categories={categories}
                  editingContact={editingContact}
                  handleStartEdit={handleStartEdit}
                  handleSaveEdit={handleSaveEdit}
                  handleCancelEdit={handleCancelEdit}
                  setEditingContact={setEditingContact}
                  contactCategories={contactCategories}
                  onDelete={handleContactDeleted}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};