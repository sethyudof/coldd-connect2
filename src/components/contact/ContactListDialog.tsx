import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, Pencil, X, Check } from "lucide-react";
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
                  <TableCell>
                    {editingContact?.contactId === contact.id ? (
                      <Input
                        value={editingContact.name}
                        onChange={(e) => setEditingContact(prev => 
                          prev ? { ...prev, name: e.target.value } : null
                        )}
                        className="w-full"
                      />
                    ) : (
                      contact.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingContact?.contactId === contact.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editingContact.email || ''}
                          onChange={(e) => setEditingContact(prev => 
                            prev ? { ...prev, email: e.target.value } : null
                          )}
                          placeholder="Email"
                          className="w-full"
                        />
                        <Input
                          value={editingContact.phone || ''}
                          onChange={(e) => setEditingContact(prev => 
                            prev ? { ...prev, phone: e.target.value } : null
                          )}
                          placeholder="Phone"
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <>
                        {contact.email && <div>{contact.email}</div>}
                        {contact.phone && <div>{contact.phone}</div>}
                      </>
                    )}
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
                        interval={editingContact.interval || ''}
                        unit={editingContact.unit || 'months'}
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
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <div>
                        Every {contact.reminderInterval} {contact.reminderUnit}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingContact?.contactId === contact.id ? (
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSaveEdit}
                          className="h-8 w-8"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancelEdit}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(columnId, contact)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
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