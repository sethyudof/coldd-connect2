import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Column } from "@/components/Column";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const COLDD_COLUMNS = {
  coffee: { title: "Coffee", color: "#8B4513" },
  outing: { title: "Outing", color: "#2F855A" },
  lunch: { title: "Lunch", color: "#DD6B20" },
  dinner: { title: "Dinner", color: "#C53030" },
  drinks: { title: "Drinks", color: "#2B6CB0" },
};

// Sample data with updated types
const initialContacts = {
  coffee: [
    { 
      id: "1", 
      name: "John Doe", 
      reminderInterval: 3,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
    { 
      id: "2", 
      name: "Jane Smith", 
      reminderInterval: 2,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
  ],
  outing: [
    { 
      id: "3", 
      name: "Mike Johnson", 
      reminderInterval: 1,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
  ],
  lunch: [],
  dinner: [
    { 
      id: "4", 
      name: "Sarah Williams", 
      reminderInterval: 2,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
  ],
  drinks: [],
};

const Index = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const { toast } = useToast();

  const handleDragEnd = (result: any) => {
    console.log("Drag ended:", result);
    
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const column = [...contacts[source.droppableId as keyof typeof contacts]];
      const [removed] = column.splice(source.index, 1);
      column.splice(destination.index, 0, removed);
      
      setContacts({
        ...contacts,
        [source.droppableId]: column,
      });
    } else {
      // Moving between columns
      const sourceColumn = [...contacts[source.droppableId as keyof typeof contacts]];
      const destColumn = [...contacts[destination.droppableId as keyof typeof contacts]];
      const [removed] = sourceColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, removed);
      
      setContacts({
        ...contacts,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });

      toast({
        title: "Contact moved!",
        description: `${removed.name} moved to ${COLDD_COLUMNS[destination.droppableId as keyof typeof COLDD_COLUMNS].title}`,
      });
    }
  };

  const handleUpdateContact = (columnId: keyof typeof contacts, contactId: string, updates: Partial<typeof contacts[keyof typeof contacts][0]>) => {
    const updatedContacts = {
      ...contacts,
      [columnId]: contacts[columnId].map(contact =>
        contact.id === contactId
          ? { ...contact, ...updates }
          : contact
      )
    };
    
    setContacts(updatedContacts);
    
    toast({
      title: "Contact updated",
      description: "Reminder settings have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">COLDD Contact</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex overflow-x-auto pb-4">
            {Object.entries(COLDD_COLUMNS).map(([id, { title, color }]) => (
              <Column
                key={id}
                id={id}
                title={title}
                color={color}
                contacts={contacts[id as keyof typeof contacts]}
                onUpdateContact={(contactId, updates) => 
                  handleUpdateContact(id as keyof typeof contacts, contactId, updates)
                }
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Index;