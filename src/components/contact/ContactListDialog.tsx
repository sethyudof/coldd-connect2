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

interface ContactListDialogProps {
  contacts: ContactsState;
  categories: Record<string, { title: string; color: string }>;
  onUpdateContact: (columnId: string, contactId: string, updates: any) => void;
}

interface EditingContact {
  columnId: string;
  contactId: string;
  name: string;
  email?: string;
  phone?: string;
  interval?: string;
  unit?: 'days' | 'weeks' | 'months' | 'years';
  date?: Date;
}

export const ContactListDialog = ({ contacts, categories, onUpdateContact }: ContactListDialogProps) => {
  const [editingContact, setEditingContact] = useState<EditingContact | null>(null);

  const getAllContacts = () => {
    const allContacts: Array<{
      contact: typeof contacts[keyof typeof contacts][0];
      columnId: string;
      columnTitle: string;
    }> = [];

    Object.entries(contacts).forEach(([columnId, columnContacts]) => {
      columnContacts.forEach(contact => {
        allContacts.push({
          contact,
          columnId,
          columnTitle: categories[columnId].title,
        });
      });
    });

    return allContacts;
  };

  const handleStartEdit = (columnId: string, contact: typeof contacts[keyof typeof contacts][0]) => {
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
                <TableHead>Category</TableHead>
                <TableHead>Reminder</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getAllContacts().map(({ contact, columnId, columnTitle }) => (
                <ContactTableRow
                  key={`${columnId}-${contact.id}`}
                  contact={contact}
                  columnId={columnId}
                  columnTitle={columnTitle}
                  categories={categories}
                  editingContact={editingContact}
                  handleStartEdit={handleStartEdit}
                  handleSaveEdit={handleSaveEdit}
                  handleCancelEdit={handleCancelEdit}
                  setEditingContact={setEditingContact}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};