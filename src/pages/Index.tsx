import { useEffect, useState } from "react";
import { AddContactDialog } from "@/components/contact/AddContactDialog";
import { ColumnsContainer, Contact, ContactsState } from "@/components/contact/ColumnsContainer";
import { ContactListDialog } from "@/components/contact/ContactListDialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const COLDD_COLUMNS = {
  coffee: { title: "Coffee", color: "#8B4513" },
  outing: { title: "Outing", color: "#2F855A" },
  lunch: { title: "Lunch", color: "#DD6B20" },
  dinner: { title: "Dinner", color: "#C53030" },
  drinks: { title: "Drinks", color: "#2B6CB0" },
};

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
  const [isDark, setIsDark] = useState(true); // Default to dark mode
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const { data: contactsData, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      console.log('Fetching contacts for user:', user.id);
      
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id);
      
      if (contactsError) throw contactsError;
      console.log('Fetched contacts:', contacts);

      const { data: categoryRelations, error: categoriesError } = await supabase
        .from('contact_categories')
        .select('*');
      
      if (categoriesError) throw categoriesError;
      console.log('Fetched category relations:', categoryRelations);

      return { contacts, categoryRelations };
    },
  });

  useEffect(() => {
    if (contactsData) {
      const { contacts: fetchedContacts, categoryRelations } = contactsData;
      
      const allContactsList = fetchedContacts.map((contact: any) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        image: contact.image,
        reminderInterval: contact.reminder_interval,
        reminderUnit: contact.reminder_unit,
        startDate: contact.start_date ? new Date(contact.start_date) : undefined,
      }));

      console.log('Transformed all contacts:', allContactsList);

      setAllContacts(allContactsList);

      const transformedContacts: ContactsState = {
        coffee: [],
        outing: [],
        lunch: [],
        dinner: [],
        drinks: [],
      };

      categoryRelations.forEach((relation: any) => {
        const contact = allContactsList.find(c => c.id === relation.contact_id);
        if (contact && transformedContacts[relation.category_id as keyof ContactsState]) {
          transformedContacts[relation.category_id as keyof ContactsState].push(contact);
        }
      });

      console.log('Transformed categorized contacts:', transformedContacts);
      setContacts(transformedContacts);
    }
  }, [contactsData]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  const handleAddContact = async (newContact: {
    name: string;
    email: string;
    phone: string;
    category: string;
    reminderInterval: string;
    reminderUnit: 'days' | 'weeks' | 'months' | 'years';
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const contactToAdd: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      reminderInterval: parseInt(newContact.reminderInterval),
      reminderUnit: newContact.reminderUnit,
      startDate: new Date(),
      user_id: user.id,
    };

    setAllContacts(prev => [...prev, contactToAdd]);

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
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={isDark}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary"
                />
                <Moon className="h-4 w-4" />
              </div>
              <AddContactDialog 
                onAddContact={handleAddContact}
                categories={COLDD_COLUMNS}
              />
              <ContactListDialog
                contacts={contacts}
                allContacts={allContacts}
                categories={COLDD_COLUMNS}
                onUpdateContact={handleUpdateContact}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
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
