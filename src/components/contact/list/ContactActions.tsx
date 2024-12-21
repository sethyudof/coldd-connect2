import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { DeleteContactDialog } from "./DeleteContactDialog";

interface ContactActionsProps {
  isEditing: boolean;
  contactName: string;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ContactActions = ({ 
  isEditing, 
  contactName,
  onSave, 
  onCancel, 
  onEdit, 
  onDelete 
}: ContactActionsProps) => {
  return (
    <div className="flex space-x-2">
      {isEditing ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            className="h-8 w-8"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
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
            onClick={onEdit}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteContactDialog
            contactName={contactName}
            onConfirm={onDelete}
          />
        </>
      )}
    </div>
  );
};