import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { Contact, ContactsState } from "./ColumnsContainer";
import { ContactListContent } from "./list/ContactListContent";

interface ContactListDialogProps {
  contacts: ContactsState;
  allContacts: Contact[];
  categories: Record<string, { title: string; color: string }>;
  onUpdateContact: (columnId: string, contactId: string, updates: Partial<Contact>) => void;
}

export const ContactListDialog = ({
  contacts,
  allContacts,
  categories,
  onUpdateContact,
}: ContactListDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-dialog="contact-list">
          <List className="h-4 w-4" />
          Contact List
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Contact List</DialogTitle>
        </DialogHeader>
        <ContactListContent
          contacts={contacts}
          allContacts={allContacts}
          categories={categories}
          onUpdateContact={onUpdateContact}
        />
      </DialogContent>
    </Dialog>
  );
};