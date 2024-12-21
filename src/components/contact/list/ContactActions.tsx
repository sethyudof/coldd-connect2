import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Trash2 } from "lucide-react";

interface ContactActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ContactActions = ({ 
  isEditing, 
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
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};