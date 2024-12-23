import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Contact, ContactsState } from "@/components/contact/ColumnsContainer";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AccountDialog } from "@/components/account/AccountDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Plus, List, Star } from "lucide-react";

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
            <DarkModeToggle isDark={isDark} toggleTheme={toggleTheme} />
            <AccountDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Actions <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="gap-2"
                  onClick={() => {
                    const dialog = document.querySelector('[data-dialog="pricing"]');
                    if (dialog) {
                      (dialog as HTMLElement).click();
                    }
                  }}
                >
                  <Star className="h-4 w-4" />
                  Upgrade to Pro
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2"
                  onClick={() => {
                    const dialog = document.querySelector('[data-dialog="add-contact"]');
                    if (dialog) {
                      (dialog as HTMLElement).click();
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Contact
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2"
                  onClick={() => {
                    const dialog = document.querySelector('[data-dialog="contact-list"]');
                    if (dialog) {
                      (dialog as HTMLElement).click();
                    }
                  }}
                >
                  <List className="h-4 w-4" />
                  Contact List
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="hidden">
        <PricingDialog />
        <AddContactDialog onAddContact={onAddContact} categories={categories} />
        <ContactListDialog
          contacts={contacts}
          allContacts={allContacts}
          categories={categories}
          onUpdateContact={onUpdateContact}
        />
      </div>
    </div>
  );
};

// Import these at the top of the file
import { PricingDialog } from "@/components/pricing/PricingDialog";
import { AddContactDialog } from "@/components/contact/AddContactDialog";
import { ContactListDialog } from "@/components/contact/ContactListDialog";