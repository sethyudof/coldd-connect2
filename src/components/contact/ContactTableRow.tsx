import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, CircleSlash } from "lucide-react";
import { ContactEditForm } from "./ContactEditForm";
import { ContactInfo } from "./ContactInfo";

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
  contactCategories
}: ContactTableRowProps) => {
  const isEditing = editingContact?.contactId === contact.id;

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