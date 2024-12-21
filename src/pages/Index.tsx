import { useEffect, useState } from "react";
import { AddContactDialog } from "@/components/contact/AddContactDialog";
import { ColumnsContainer, Contact, ContactsState } from "@/components/contact/ColumnsContainer";
import { ContactListDialog } from "@/components/contact/ContactListDialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/lib/supabase";

const COLDD_COLUMNS = {
  coffee: { title: "Coffee", color: "#8B4513" },
  outing: { title: "Outing", color: "#2F855A" },
  lunch: { title: "Lunch", color: "#DD6B20" },
  dinner: { title: "Dinner", color: "#C53030" },
  drinks: { title: "Drinks", color: "#2B6CB0" },
};

// Sample data with updated types
const initialContacts: ContactsState = {
  coffee: [],
  outing: [],
  lunch: [],
  dinner: [],
  drinks: [],
};

const Index = () => {
  const [contacts, setContacts] = useState<ContactsState>(initialContacts);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const { toast } = useToast();

  // Add query for fetching contacts
  const { data: contactsData, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });

  useEffect(() => {
    if (contactsData) {
      // Transform the data into the format expected by the UI
      const transformedContacts: ContactsState = {
        coffee: [],
        outing: [],
        lunch: [],
        dinner: [],
        drinks: [],
      };

      const allContactsList: Contact[] = [];

      contactsData.forEach((contact: any) => {
        const baseContact = {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          image: contact.image,
          reminderInterval: contact.reminder_interval,
          reminderUnit: contact.reminder_unit,
          startDate: contact.start_date ? new Date(contact.start_date) : undefined,
        };

        // Add to all contacts list if not already present
        if (!allContactsList.some(c => c.id === contact.id)) {
          allContactsList.push(baseContact);
        }

        // Add to each category the contact belongs to
        contact.contact_categories.forEach((category: any) => {
          if (transformedContacts[category.category_name as keyof ContactsState]) {
            transformedContacts[category.category_name as keyof ContactsState].push(baseContact);
          }
        });
      });

      setContacts(transformedContacts);
      setAllContacts(allContactsList);
    }
  }, [contactsData]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    
    if (isDark) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
  };

  const handleAddContact = (newContact: {
    name: string;
    email: string;
    phone: string;
    category: string;
    reminderInterval: string;
    reminderUnit: 'days' | 'weeks' | 'months' | 'years';
  }) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const contactToAdd: Contact = {
      id: newId,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      reminderInterval: parseInt(newContact.reminderInterval),
      reminderUnit: newContact.reminderUnit,
      startDate: new Date(),
    };

    // Add to allContacts
    setAllContacts(prev => [...prev, contactToAdd]);

    // Add to specific category
    setContacts(prev => ({
      ...prev,
      [newContact.category]: [...prev[newContact.category as keyof ContactsState], contactToAdd],
    }));

    toast({
      title: "Contact added",
      description: `${contactToAdd.name} has been added to ${COLDD_COLUMNS[newContact.category as keyof typeof COLDD_COLUMNS].title}`,
    });
  };

  const handleUpdateContact = (columnId: string, contactId: string, updates: Partial<Contact>) => {
    const updatedContacts = {
      ...contacts,
      [columnId]: contacts[columnId as keyof ContactsState].map(contact =>
        contact.id === contactId
          ? { ...contact, ...updates }
          : contact
      )
    };
    
    setContacts(updatedContacts as ContactsState);
    
    toast({
      title: "Contact updated",
      description: "Reminder settings have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">COLDD Contact</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <AddContactDialog 
                onAddContact={handleAddContact}
                categories={COLDD_COLUMNS}
              />
              <ContactListDialog
                contacts={contacts}
                categories={COLDD_COLUMNS}
                onUpdateContact={handleUpdateContact}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 pt-24">
        <ColumnsContainer
          contacts={contacts}
          categories={COLDD_COLUMNS}
          allContacts={allContacts}
          onUpdateContacts={setContacts}
          onUpdateContact={handleUpdateContact}
        />
      </div>
    </div>
  );
};

export default Index;
