import { DragDropContext } from "@hello-pangea/dnd";
import { Column } from "../Column";
import { useToast } from "@/components/ui/use-toast";

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  reminderInterval?: number;
  reminderUnit?: 'days' | 'weeks' | 'months' | 'years';
  nextReminder?: Date;
  startDate?: Date;
  user_id?: string;  // Added this field to match the database schema
}

export type ContactsState = {
  coffee: Contact[];
  outing: Contact[];
  lunch: Contact[];
  dinner: Contact[];
  drinks: Contact[];
}

interface ColumnsContainerProps {
  contacts: ContactsState;
  categories: Record<string, { title: string; color: string }>;
  allContacts: Contact[];
  onUpdateContacts: (newContacts: ContactsState) => void;
  onUpdateContact: (columnId: string, contactId: string, updates: Partial<Contact>) => void;
}

export const ColumnsContainer = ({ 
  contacts, 
  categories,
  allContacts,
  onUpdateContacts, 
  onUpdateContact 
}: ColumnsContainerProps) => {
  const { toast } = useToast();

  const handleDragEnd = (result: any) => {
    console.log("Drag ended:", result);
    
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const column = [...contacts[source.droppableId as keyof ContactsState]];
      const [removed] = column.splice(source.index, 1);
      column.splice(destination.index, 0, removed);
      
      onUpdateContacts({
        ...contacts,
        [source.droppableId]: column,
      } as ContactsState);
    } else {
      // Moving between columns
      const sourceColumn = [...contacts[source.droppableId as keyof ContactsState]];
      const destColumn = [...contacts[destination.droppableId as keyof ContactsState]];
      const [removed] = sourceColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, removed);
      
      onUpdateContacts({
        ...contacts,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      } as ContactsState);

      toast({
        title: "Contact moved!",
        description: `${removed.name} moved to ${categories[destination.droppableId].title}`,
      });
    }
  };

  const handleAddContact = (columnId: string, contactId: string) => {
    const contactToAdd = allContacts.find(c => c.id === contactId);
    if (!contactToAdd) return;

    const updatedContacts = {
      ...contacts,
      [columnId]: [...contacts[columnId as keyof ContactsState], {
        ...contactToAdd,
        reminderInterval: 1,
        reminderUnit: 'months' as const,
        startDate: new Date(),
      }]
    };

    onUpdateContacts(updatedContacts as ContactsState);
    
    toast({
      title: "Contact added!",
      description: `${contactToAdd.name} added to ${categories[columnId].title}`,
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto pb-4">
        {Object.entries(categories).map(([id, { title, color }]) => (
          <Column
            key={id}
            id={id}
            title={title}
            color={color}
            contacts={contacts[id as keyof ContactsState]}
            allContacts={allContacts}
            onUpdateContact={(contactId, updates) => 
              onUpdateContact(id, contactId, updates)
            }
            onAddContact={(contactId) => handleAddContact(id, contactId)}
          />
        ))}
      </div>
    </DragDropContext>
  );
};