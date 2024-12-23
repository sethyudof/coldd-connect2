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
        {allContacts.map((contact) => {
          const columnId = Object.keys(contacts).find(id => 
            contacts[id].contacts.some(c => c.id === contact.id)
          ) || '';
          
          return (
            <ContactTableRow
              key={contact.id}
              contact={contact}
              columnId={columnId}
              categories={categories}
              editingContact={null}
              handleStartEdit={() => {}}
              handleSaveEdit={() => {}}
              handleCancelEdit={() => {}}
              setEditingContact={() => {}}
              contactCategories={[]}
              onDelete={() => {}}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};