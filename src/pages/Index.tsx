import { useState } from "react";
import { AddContactDialog } from "@/components/contact/AddContactDialog";
import { ColumnsContainer } from "@/components/contact/ColumnsContainer";
import { useToast } from "@/components/ui/use-toast";

const COLDD_COLUMNS = {
  coffee: { title: "Coffee", color: "#8B4513" },
  outing: { title: "Outing", color: "#2F855A" },
  lunch: { title: "Lunch", color: "#DD6B20" },
  dinner: { title: "Dinner", color: "#C53030" },
  drinks: { title: "Drinks", color: "#2B6CB0" },
};

// Sample data with updated types
const initialContacts = {
  coffee: [
    { 
      id: "1", 
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890", 
      reminderInterval: 3,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
    { 
      id: "2", 
      name: "Jane Smith",
      email: "",
      phone: "", 
      reminderInterval: 2,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
  ],
  outing: [
    { 
      id: "3", 
      name: "Mike Johnson",
      email: "",
      phone: "", 
      reminderInterval: 1,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
  ],
  lunch: [],
  dinner: [
    { 
      id: "4", 
      name: "Sarah Williams",
      email: "",
      phone: "", 
      reminderInterval: 2,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
  ],
  drinks: [],
};

const Index = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const { toast } = useToast();

  const handleAddContact = (newContact: {
    name: string;
    email: string;
    phone: string;
    category: string;
    reminderInterval: string;
    reminderUnit: 'days' | 'weeks' | 'months' | 'years';
  }) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const contactToAdd = {
      id: newId,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      reminderInterval: parseInt(newContact.reminderInterval),
      reminderUnit: newContact.reminderUnit,
      startDate: new Date(),
    };

    setContacts(prev => ({
      ...prev,
      [newContact.category]: [...prev[newContact.category as keyof typeof prev], contactToAdd],
    }));

    toast({
      title: "Contact added",
      description: `${contactToAdd.name} has been added to ${COLDD_COLUMNS[newContact.category as keyof typeof COLDD_COLUMNS].title}`,
    });
  };

  const handleUpdateContact = (columnId: string, contactId: string, updates: any) => {
    const updatedContacts = {
      ...contacts,
      [columnId]: contacts[columnId as keyof typeof contacts].map(contact =>
        contact.id === contactId
          ? { ...contact, ...updates }
          : contact
      )
    };
    
    setContacts(updatedContacts);
    
    toast({
      title: "Contact updated",
      description: "Reminder settings have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">COLDD Contact</h1>
          <AddContactDialog 
            onAddContact={handleAddContact}
            categories={COLDD_COLUMNS}
          />
        </div>
        
        <ColumnsContainer
          contacts={contacts}
          categories={COLDD_COLUMNS}
          onUpdateContacts={setContacts}
          onUpdateContact={handleUpdateContact}
        />
      </div>
    </div>
  );
};

export default Index;