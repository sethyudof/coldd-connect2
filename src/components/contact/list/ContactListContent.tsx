import { TableBody } from "@/components/ui/table";
import { ContactTableRow } from "../ContactTableRow";

interface ContactListContentProps {
  groupedContacts: Array<{
    contact: any;
    categories: Array<{
      id: string;
      title: string;
      color: string;
    }>;
  }>;
  categories: Record<string, { title: string; color: string }>;
  editingContact: any;
  handleStartEdit: (columnId: string, contact: any) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  setEditingContact: (contact: any) => void;
  onContactDeleted: () => void;
}

export const ContactListContent = ({
  groupedContacts,
  categories,
  editingContact,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  setEditingContact,
  onContactDeleted
}: ContactListContentProps) => {
  console.log('ContactListContent - Rendering with contacts:', groupedContacts);
  
  return (
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
          onDelete={onContactDeleted}
        />
      ))}
    </TableBody>
  );
};