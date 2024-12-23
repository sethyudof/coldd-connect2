import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Column } from "../Column";

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
  user_id?: string;
}

export type ContactsState = {
  [key: string]: Contact[];
};

interface ColumnsContainerProps {
  contacts: ContactsState;
  categories: Record<string, { title: string; color: string }>;
  allContacts: Contact[];
  onUpdateContacts?: (contacts: ContactsState) => void;
  onUpdateContact?: (columnId: string, contactId: string, updates: Partial<Contact>) => void;
}

export const ColumnsContainer = ({
  contacts,
  categories,
  allContacts,
  onUpdateContacts,
  onUpdateContact,
}: ColumnsContainerProps) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = contacts[source.droppableId] || [];
    const destColumn = contacts[destination.droppableId] || [];
    const draggedContact = sourceColumn.find(contact => contact.id === draggableId);

    if (!draggedContact) return;

    const newSourceColumn = [...sourceColumn];
    newSourceColumn.splice(source.index, 1);

    const newDestColumn = [...destColumn];
    newDestColumn.splice(destination.index, 0, draggedContact);

    const newContacts = {
      ...contacts,
      [source.droppableId]: newSourceColumn,
      [destination.droppableId]: newDestColumn,
    };

    if (onUpdateContacts) {
      onUpdateContacts(newContacts);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto overflow-y-hidden">
        {Object.entries(categories).map(([id, { title, color }]) => (
          <Column
            key={id}
            id={id}
            title={title}
            color={color}
            contacts={contacts[id] || []}
            allContacts={allContacts}
            onUpdateContact={(contactId, updates) => {
              if (onUpdateContact) {
                onUpdateContact(id, contactId, updates);
              }
            }}
          />
        ))}
      </div>
    </DragDropContext>
  );
};