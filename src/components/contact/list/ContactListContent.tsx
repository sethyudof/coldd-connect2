import { Table, TableBody } from "@/components/ui/table";
import { ContactListHeader } from "./ContactListHeader";
import { ContactTableRow } from "../ContactTableRow";
import { Contact, ContactsState } from "../ColumnsContainer";

export interface ContactListContentProps {
  contacts: ContactsState;
  allContacts: Contact[];
  categories: Record<string, { title: string; color: string }>;
  onUpdateContact: (columnId: string, contactId: string, updates: Partial<Contact>) => void;
}

export const ContactListContent = ({
  contacts,
  allContacts,
  categories,
  onUpdateContact,
}: ContactListContentProps) => {
  return (
    <Table>
      <ContactListHeader />
      <TableBody>
        {allContacts.map((contact) => (
          <ContactTableRow
            key={contact.id}
            contact={contact}
            categories={categories}
            onUpdateContact={onUpdateContact}
          />
        ))}
      </TableBody>
    </Table>
  );
};