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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReminderEditor } from "./ReminderEditor";
import { useState } from "react";

interface ContactListDialogProps {
  contacts: ContactsState;
  categories: Record<string, { title: string; color: string }>;
  onUpdateContact: (columnId: string, contactId: string, updates: any) => void;
}

export const ContactListDialog = ({ contacts, categories, onUpdateContact }: ContactListDialogProps) => {
  const [editingContact, setEditingContact] = useState<{
    columnId: string;
    contactId: string;
    interval: string;
    unit: 'days' | 'weeks' | 'months' | 'years';
    date?: Date;
  } | null>(null);

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

  const handleSave = () => {
    if (!editingContact) return;

    onUpdateContact(editingContact.columnId, editingContact.contactId, {
      reminderInterval: parseInt(editingContact.interval),
      reminderUnit: editingContact.unit,
      startDate: editingContact.date,
    });

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
                <TableHead>Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>List</TableHead>
                <TableHead>Reminder Interval</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getAllContacts().map(({ contact, columnId, columnTitle }) => (
                <TableRow key={`${columnId}-${contact.id}`}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>
                    {contact.email && <div>{contact.email}</div>}
                    {contact.phone && <div>{contact.phone}</div>}
                  </TableCell>
                  <TableCell>
                    <div
                      className="px-2 py-1 rounded text-white inline-block"
                      style={{ backgroundColor: categories[columnId].color }}
                    >
                      {columnTitle}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingContact?.contactId === contact.id ? (
                      <ReminderEditor
                        interval={editingContact.interval}
                        unit={editingContact.unit}
                        date={editingContact.date}
                        onIntervalChange={(value) => 
                          setEditingContact(prev => prev ? { ...prev, interval: value } : null)
                        }
                        onUnitChange={(value) => 
                          setEditingContact(prev => prev ? { ...prev, unit: value } : null)
                        }
                        onDateChange={(date) => 
                          setEditingContact(prev => prev ? { ...prev, date } : null)
                        }
                        onSave={handleSave}
                        onCancel={() => setEditingContact(null)}
                      />
                    ) : (
                      <div>
                        Every {contact.reminderInterval} {contact.reminderUnit}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => setEditingContact({
                            columnId,
                            contactId: contact.id,
                            interval: contact.reminderInterval?.toString() || "",
                            unit: contact.reminderUnit || 'months',
                            date: contact.startDate,
                          })}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {/* Add additional actions here if needed */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};