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
}

export const ColumnHeader = ({
  title,
  color,
  isOpen,
  setIsOpen,
  availableContacts,
  onAddContact,
}: ColumnHeaderProps) => {
  return (
    <div className="fixed w-[inherit] z-50 max-w-[400px]">
      <div 
        className="flex justify-between items-center pb-4 w-full px-4"
        style={{ 
          backgroundColor: `${color}80`,
          backdropFilter: 'blur(8px)',
        }}
      >
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