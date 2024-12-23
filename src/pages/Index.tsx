import { ColumnsContainer } from "@/components/contact/ColumnsContainer";
import { Header } from "@/components/layout/Header";
import { useContacts, COLDD_COLUMNS } from "@/hooks/useContacts";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
  const {
    contacts,
    allContacts,
    handleAddContact,
    handleUpdateContact,
    setContacts,
  } = useContacts();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        onAddContact={handleAddContact}
        contacts={contacts}
        allContacts={allContacts}
        categories={COLDD_COLUMNS}
        onUpdateContact={handleUpdateContact}
      />
      
      <main className="flex-1 min-h-0 p-8 pt-20">
        <ColumnsContainer
          contacts={contacts}
          categories={COLDD_COLUMNS}
          allContacts={allContacts}
          onUpdateContacts={setContacts}
          onUpdateContact={handleUpdateContact}
        />
      </main>
    </div>
  );
};

export default Index;