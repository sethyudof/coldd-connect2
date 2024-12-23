import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContactForm } from "./dialog/ContactForm";

interface AddContactDialogProps {
  onAddContact: (newContact: {
    name: string;
    email: string;
    phone: string;
    category: string;
    reminderInterval: string;
    reminderUnit: 'days' | 'weeks' | 'months' | 'years';
  }) => void;
  categories: Record<string, { title: string; color: string }>;
}

export const AddContactDialog = ({ onAddContact, categories }: AddContactDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-dialog="add-contact">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <ContactForm onSubmit={onAddContact} categories={categories} />
      </DialogContent>
    </Dialog>
  );
};