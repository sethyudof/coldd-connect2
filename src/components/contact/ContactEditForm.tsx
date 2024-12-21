import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { ReminderEditor } from "./ReminderEditor";

interface ContactEditFormProps {
  editingContact: {
    name: string;
    email?: string;
    phone?: string;
    interval?: string;
    unit?: 'days' | 'weeks' | 'months' | 'years';
    date?: Date;
  };
  setEditingContact: (contact: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ContactEditForm = ({
  editingContact,
  setEditingContact,
  onSave,
  onCancel
}: ContactEditFormProps) => {
  return (
    <>
      <Input
        value={editingContact.name}
        onChange={(e) => setEditingContact(prev => 
          prev ? { ...prev, name: e.target.value } : null
        )}
        className="w-full"
      />
      <div className="space-y-2">
        <Input
          value={editingContact.email || ''}
          onChange={(e) => setEditingContact(prev => 
            prev ? { ...prev, email: e.target.value } : null
          )}
          placeholder="Email"
          className="w-full"
        />
        <Input
          value={editingContact.phone || ''}
          onChange={(e) => setEditingContact(prev => 
            prev ? { ...prev, phone: e.target.value } : null
          )}
          placeholder="Phone"
          className="w-full"
        />
      </div>
      <ReminderEditor
        interval={editingContact.interval || ''}
        unit={editingContact.unit || 'months'}
        date={editingContact.date}
        onIntervalChange={(value) => 
          setEditingContact(prev => prev ? { ...prev, interval: value } : null)
        }
        onUnitChange={(value) => 
          setEditingContact(prev => prev ? { ...prev, unit: value } : null)
        }
        onDateChange={(date) => 
          setEditingContact(prev => prev ? { ...prev, date } : null)
        }
        onSave={onSave}
        onCancel={onCancel}
      />
    </>
  );
};