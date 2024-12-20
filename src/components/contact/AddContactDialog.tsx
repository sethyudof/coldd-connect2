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
import { PlusCircle } from "lucide-react";
import { useState } from "react";

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
  };

  return (
    <Dialog>
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