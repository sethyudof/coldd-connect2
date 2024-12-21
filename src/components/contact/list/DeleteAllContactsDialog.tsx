import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DeleteAllContactsDialogProps {
  onConfirm: () => void;
}

export const DeleteAllContactsDialog = ({ onConfirm }: DeleteAllContactsDialogProps) => {
  const [isSecondConfirmOpen, setIsSecondConfirmOpen] = useState(false);
  const { toast } = useToast();

  const handleFirstConfirm = () => {
    setIsSecondConfirmOpen(true);
  };

  const handleSecondConfirm = async () => {
    try {
      console.log('Starting deletion of all contacts...');
      
      // First delete all contact_categories entries
      const { error: categoriesError } = await supabase
        .from('contact_categories')
        .delete()
        .not('contact_id', 'is', 'null'); // This will match all non-null rows

      if (categoriesError) {
        console.error('Error deleting contact categories:', categoriesError);
        throw categoriesError;
      }

      console.log('Successfully deleted all contact categories');

      // Then delete all contacts
      const { error: contactsError } = await supabase
        .from('contacts')
        .delete()
        .not('id', 'is', 'null'); // This will match all non-null rows

      if (contactsError) {
        console.error('Error deleting contacts:', contactsError);
        throw contactsError;
      }

      console.log('Successfully deleted all contacts');

      onConfirm();
      setIsSecondConfirmOpen(false);
      
      toast({
        title: "All contacts deleted",
        description: "Your contact list has been cleared.",
      });
    } catch (error) {
      console.error('Error deleting all contacts:', error);
      toast({
        title: "Error",
        description: "Failed to delete all contacts",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="ml-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All Contacts
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Contacts?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all your contacts. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFirstConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isSecondConfirmOpen} onOpenChange={setIsSecondConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete ALL your contacts and their associated data.
              This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep my contacts</AlertDialogCancel>
            <AlertDialogAction onClick={handleSecondConfirm}>
              Yes, delete everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};