import { AddContactDialog } from "./AddContactDialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ColumnHeaderProps {
  title: string;
  color: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  availableContacts: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  onAddContact?: (contactId: string) => void;
  className?: string;
}

export const ColumnHeader = ({
  title,
  color,
  isOpen,
  setIsOpen,
  availableContacts,
  onAddContact,
  className = "",
}: ColumnHeaderProps) => {
  // Convert hex to rgba for gradient overlay
  const getRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div 
      className={`w-full rounded-xl shadow-lg ${className}`}
      style={{ 
        background: `linear-gradient(135deg, ${getRGBA(color, 0.9)} 0%, ${getRGBA(color, 0.7)} 100%)`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex justify-between items-center w-full px-4 py-3">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-white text-lg tracking-tight">
            {title}
          </h2>
          <div className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white/90">
            {availableContacts.length}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 hover:text-white"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add contact to {title}</span>
        </Button>
        <AddContactDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={title}
          availableContacts={availableContacts}
          onAddContact={onAddContact}
        />
      </div>
    </div>
  );
};