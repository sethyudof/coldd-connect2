import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Column } from "@/components/Column";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      email: "john@example.com",
      phone: "123-456-7890", 
      reminderInterval: 3,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
    { 
      id: "2", 
      name: "Jane Smith",
      email: "",
      phone: "", 
      reminderInterval: 2,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
  ],
  outing: [
    { 
      id: "3", 
      name: "Mike Johnson",
      email: "",
      phone: "", 
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
      email: "",
      phone: "", 
      reminderInterval: 2,
      reminderUnit: 'months' as const,
      startDate: new Date(),
    },
  ],
  drinks: [],
};

const Index = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    category: "coffee",
    reminderInterval: "1",
    reminderUnit: "months" as "days" | "weeks" | "months" | "years", // Updated type assertion
  });
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

  const handleAddContact = () => {
    if (!newContact.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const contactToAdd = {
      id: newId,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      reminderInterval: parseInt(newContact.reminderInterval),
      reminderUnit: newContact.reminderUnit,
      startDate: new Date(),
    };

    setContacts(prev => ({
      ...prev,
      [newContact.category]: [...prev[newContact.category as keyof typeof contacts], contactToAdd],
    }));

    setNewContact({
      name: "",
      email: "",
      phone: "",
      category: "coffee",
      reminderInterval: "1",
      reminderUnit: "months",
    });

    toast({
      title: "Contact added",
      description: `${contactToAdd.name} has been added to ${COLDD_COLUMNS[newContact.category as keyof typeof COLDD_COLUMNS].title}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">COLDD Contact</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newContact.category}
                    onValueChange={(value) => setNewContact(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COLDD_COLUMNS).map(([id, { title }]) => (
                        <SelectItem key={id} value={id}>{title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="interval">Reminder Interval</Label>
                    <Input
                      id="interval"
                      type="number"
                      min="1"
                      value={newContact.reminderInterval}
                      onChange={(e) => setNewContact(prev => ({ ...prev, reminderInterval: e.target.value }))}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newContact.reminderUnit}
                      onValueChange={(value: 'days' | 'weeks' | 'months' | 'years') => 
                        setNewContact(prev => ({ ...prev, reminderUnit: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddContact} className="w-full">
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
