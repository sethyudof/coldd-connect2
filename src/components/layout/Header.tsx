import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { PricingDialog } from "@/components/pricing/PricingDialog";
import { BrandLogo } from "@/components/common/BrandLogo";
import { AddContactDialog } from "@/components/contact/AddContactDialog";
import { ContactListDialog } from "@/components/contact/ContactListDialog";
import { Contact, ContactsState } from "@/components/contact/ColumnsContainer";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  onAddContact: (newContact: {
    name: string;
    email: string;
    phone: string;
    category: string;
    reminderInterval: string;
    reminderUnit: 'days' | 'weeks' | 'months' | 'years';
  }) => void;
  contacts: ContactsState;
  allContacts: Contact[];
  categories: Record<string, { title: string; color: string }>;
  onUpdateContact: (columnId: string, contactId: string, updates: Partial<Contact>) => void;
}

export const Header = ({
  isDark,
  toggleTheme,
  onAddContact,
  contacts,
  allContacts,
  categories,
  onUpdateContact,
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <PricingDialog />
            <DarkModeToggle isDark={isDark} toggleTheme={toggleTheme} />
            <AddContactDialog onAddContact={onAddContact} categories={categories} />
            <ContactListDialog
              contacts={contacts}
              allContacts={allContacts}
              categories={categories}
              onUpdateContact={onUpdateContact}
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
  );
};