import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, CircleSlash, Trash2 } from "lucide-react";
import { ContactEditForm } from "./ContactEditForm";
import { ContactInfo } from "./ContactInfo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  categories,
  editingContact,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  setEditingContact,
  contactCategories,
  onDelete
}: ContactTableRowProps) => {
  const isEditing = editingContact?.contactId === contact.id;
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      // Delete from contact_categories first due to foreign key constraint
      const { error: categoryError } = await supabase
        .from('contact_categories')
        .delete()
        .eq('contact_id', contact.id);

      if (categoryError) throw categoryError;

      // Then delete the contact
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
        <div className="flex flex-wrap gap-2">
          {contactCategories.map((category) => (
            <div
              key={category.id}
              className="px-2 py-1 rounded text-white inline-block"
              style={{ backgroundColor: category.color }}
            >
              {category.title}
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell>
        {!isEditing && contact.reminderInterval && (
          <div>
            Every {contact.reminderInterval} {contact.reminderUnit}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
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
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStartEdit(columnId, contact)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-8 w-8 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};