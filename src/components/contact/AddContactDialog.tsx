import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Upload } from "lucide-react";
import { useState } from "react";
import { parseVCF } from "@/utils/vcfParser";
import { useToast } from "@/hooks/use-toast";

interface AddContactDialogProps {
  onAddContact: (contact: {
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
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    category: "coffee",
    reminderInterval: "1",
    reminderUnit: "months" as 'days' | 'weeks' | 'months' | 'years',
  });

  const handleAddContact = () => {
    if (!newContact.name.trim()) return;
    
    onAddContact(newContact);
    
    setNewContact({
      name: "",
      email: "",
      phone: "",
      category: "coffee",
      reminderInterval: "1",
      reminderUnit: "months",
    });
    
    setOpen(false); // Close dialog after adding contact
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log('Processing VCF file:', file.name);
      const vcfContacts = await parseVCF(file);
      
      if (vcfContacts.length > 0) {
        // If multiple contacts, add them all and close dialog
        if (vcfContacts.length > 1) {
          vcfContacts.forEach(contact => {
            if (contact.name) {
              onAddContact({
                name: contact.name,
                email: contact.email || '',
                phone: contact.phone || '',
                category: newContact.category,
                reminderInterval: newContact.reminderInterval,
                reminderUnit: newContact.reminderUnit,
              });
            }
          });
          setOpen(false);
          toast({
            title: "Contacts imported",
            description: `${vcfContacts.length} contacts successfully imported`,
          });
        } else {
          // Single contact - populate form
          const contact = vcfContacts[0];
          setNewContact(prev => ({
            ...prev,
            name: contact.name || '',
            email: contact.email || '',
            phone: contact.phone || '',
          }));
          toast({
            title: "Contact imported",
            description: "VCF file successfully imported",
          });
        }
      } else {
        toast({
          title: "Import failed",
          description: "Could not find contact information in the VCF file",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing VCF file:', error);
      toast({
        title: "Import failed",
        description: "Error processing VCF file",
        variant: "destructive",
      });
    }
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
          <div className="space-y-2">
            <Label htmlFor="vcf-upload">Import VCF File (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="vcf-upload"
                type="file"
                accept=".vcf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('vcf-upload')?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload VCF File
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter contact name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newContact.category}
              onValueChange={(value) => setNewContact(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categories).map(([id, { title }]) => (
                  <SelectItem key={id} value={id}>{title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="interval">Reminder Interval</Label>
              <Input
                id="interval"
                type="number"
                min="1"
                value={newContact.reminderInterval}
                onChange={(e) => setNewContact(prev => ({ ...prev, reminderInterval: e.target.value }))}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={newContact.reminderUnit}
                onValueChange={(value: 'days' | 'weeks' | 'months' | 'years') => 
                  setNewContact(prev => ({ ...prev, reminderUnit: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddContact} className="w-full">
            Add Contact
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};