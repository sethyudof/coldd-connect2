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
  // Convert hex color to RGB for gradient manipulation
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(color);
  const gradientStyle = rgb ? {
    background: `linear-gradient(135deg, 
      rgba(${rgb.r},${rgb.g},${rgb.b},0.95) 0%,
      rgba(${rgb.r},${rgb.g},${rgb.b},0.85) 50%,
      rgba(${rgb.r},${rgb.g},${rgb.b},0.75) 100%)`,
    boxShadow: `
      inset 0 2px 4px rgba(255,255,255,0.3),
      inset 0 -2px 4px rgba(0,0,0,0.2),
      0 2px 8px rgba(0,0,0,0.1)
    `,
  } : {};

  return (
    <div 
      className={`w-full rounded-t-lg backdrop-blur-sm ${className}`}
      style={{ 
        ...gradientStyle,
        borderBottom: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      <div className="flex justify-between items-center w-full px-4 py-3">
        <h2 className="font-semibold text-white tracking-wide text-shadow">
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