import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddContactDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  availableContacts: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  onAddContact?: (contactId: string) => void;
}

export const AddContactDialog = ({
  isOpen,
  setIsOpen,
  title,
  availableContacts,
  onAddContact,
}: AddContactDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-white hover:bg-white/20"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact to {title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] mt-4">
          <div className="space-y-2">
            {availableContacts.map((contact) => (
              <Button
                key={contact.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (onAddContact) {
                    onAddContact(contact.id);
                    setIsOpen(false);
                  }
                }}
              >
                {contact.name}
                {contact.email && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({contact.email})
                  </span>
                )}
              </Button>
            ))}
            {availableContacts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No contacts available to add
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};