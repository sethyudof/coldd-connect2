import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VcfImport } from "./dialog/VcfImport";
import { ContactForm } from "./dialog/ContactForm";

interface AddContactDialogProps {
  onAddContact: (contact: {
    name: string;
    email: string;
    phone: string;
    category?: string;
    reminderInterval?: string;
    reminderUnit?: 'days' | 'weeks' | 'months' | 'years';
  }) => void;
  categories: Record<string, { title: string; color: string }>;
}

export const AddContactDialog = ({ onAddContact, categories }: AddContactDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleAddContact = async (newContact: {
    name: string;
    email: string;
    phone: string;
    category: string;
    reminderInterval: string;
    reminderUnit: 'days' | 'weeks' | 'months' | 'years';
  }) => {
    if (!newContact.name.trim()) return;
    
    const { data: contactData, error: contactError } = await supabase
      .from('contacts')
      .insert([{
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone,
      }])
      .select()
      .single();

    if (contactError) {
      console.error('Error adding contact:', contactError);
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive",
      });
      return;
    }

    if (newContact.category && contactData) {
      const { error: categoryError } = await supabase
        .from('contact_categories')
        .insert([{
          contact_id: contactData.id,
          category_id: newContact.category,
        }]);

      if (categoryError) {
        console.error('Error adding category relation:', categoryError);
      }
    }
    
    onAddContact(newContact);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <VcfImport onSuccess={() => setOpen(false)} />
          <ContactForm
            onSubmit={handleAddContact}
            categories={categories}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};