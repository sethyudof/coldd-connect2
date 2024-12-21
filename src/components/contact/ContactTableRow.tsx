import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ContactEditForm } from "./ContactEditForm";

interface ContactTableRowProps {
  contact: any;
  columnId: string;
  columnTitle: string;
  categories: Record<string, { title: string; color: string }>;
  editingContact: any;
  handleStartEdit: (columnId: string, contact: any) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  setEditingContact: (contact: any) => void;
}

export const ContactTableRow = ({
  contact,
  columnId,
  columnTitle,
  categories,
  editingContact,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  setEditingContact
}: ContactTableRowProps) => {
  const isEditing = editingContact?.contactId === contact.id;

  return (
    <TableRow key={`${columnId}-${contact.id}`}>
      <TableCell>
        {isEditing ? (
          <ContactEditForm
            editingContact={editingContact}
            setEditingContact={setEditingContact}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        ) : (
          contact.name
        )}
      </TableCell>
      <TableCell>
        {!isEditing && (
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
        {!isEditing && (
          <div>
            Every {contact.reminderInterval} {contact.reminderUnit}
          </div>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
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
  );
};