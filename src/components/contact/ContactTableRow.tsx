import { TableCell, TableRow } from "@/components/ui/table";
import { CircleSlash } from "lucide-react";
import { ContactEditForm } from "./ContactEditForm";
import { ContactInfo } from "./ContactInfo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ContactCategories } from "./list/ContactCategories";
import { ContactReminder } from "./list/ContactReminder";
import { ContactActions } from "./list/ContactActions";

interface ContactTableRowProps {
  contact: any;
  columnId: string;
  categories: Record<string, { title: string; color: string }>;
  editingContact: any;
  handleStartEdit: (columnId: string, contact: any) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  setEditingContact: (contact: any) => void;
  contactCategories: Array<{
    id: string;
    title: string;
    color: string;
  }>;
  onDelete: () => void;
}

export const ContactTableRow = ({
  contact,
  columnId,
  editingContact,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  contactCategories,
  onDelete
}: ContactTableRowProps) => {
  const isEditing = editingContact?.contactId === contact.id;
  const { toast } = useToast();

  console.log('Contact categories for', contact.name, ':', contactCategories);

  const handleDelete = async () => {
    try {
      const { error: categoryError } = await supabase
        .from('contact_categories')
        .delete()
        .eq('contact_id', contact.id);

      if (categoryError) throw categoryError;

      const { error: contactError } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contact.id);

      if (contactError) throw contactError;

      onDelete();
      toast({
        title: "Contact deleted",
        description: `${contact.name} has been removed from your contacts.`
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive"
      });
    }
  };

  return (
    <TableRow key={`${columnId}-${contact.id}`}>
      <TableCell>
        <div className="flex items-center gap-2">
          {contactCategories.length === 0 && (
            <CircleSlash className="h-4 w-4 text-red-500" />
          )}
          {isEditing ? (
            <ContactEditForm
              editingContact={editingContact}
              setEditingContact={setEditingContact}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <ContactInfo
              name={contact.name}
              email={contact.email}
              phone={contact.phone}
              image={contact.image}
            />
          )}
        </div>
      </TableCell>
      <TableCell>
        <ContactCategories categories={contactCategories} />
      </TableCell>
      <TableCell>
        <ContactReminder
          interval={contact.reminderInterval}
          unit={contact.reminderUnit}
        />
      </TableCell>
      <TableCell>
        <ContactActions
          isEditing={isEditing}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onEdit={() => handleStartEdit(columnId, contact)}
          onDelete={handleDelete}
        />
      </TableCell>
    </TableRow>
  );
};