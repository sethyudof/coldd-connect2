import { AddContactDialog } from "./AddContactDialog";

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
  return (
    <div 
      className={`w-full rounded-t-lg ${className}`}
      style={{ 
        backgroundColor: `${color}80`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex justify-between items-center w-full px-4 py-3">
        <h2 className="font-semibold text-white">
          {title}
        </h2>
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