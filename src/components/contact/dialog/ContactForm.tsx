import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ContactFormProps {
  onSubmit: (contact: {
    name: string;
    email: string;
    phone: string;
    category: string;
    reminderInterval: string;
    reminderUnit: 'days' | 'weeks' | 'months' | 'years';
  }) => void;
  categories: Record<string, { title: string; color: string }>;
}

export const ContactForm = ({ onSubmit, categories }: ContactFormProps) => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    reminderInterval: "1",
    reminderUnit: "months" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name.trim()) return;
    onSubmit(contact);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={contact.name}
          onChange={(e) => setContact(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter contact name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email (optional)</Label>
        <Input
          id="email"
          type="email"
          value={contact.email}
          onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
          placeholder="Enter email address"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          type="tel"
          value={contact.phone}
          onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="Enter phone number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category (optional)</Label>
        <Select
          value={contact.category}
          onValueChange={(value) => setContact(prev => ({ ...prev, category: value }))}
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
      <Button type="submit" className="w-full">
        Add Contact
      </Button>
    </form>
  );
};