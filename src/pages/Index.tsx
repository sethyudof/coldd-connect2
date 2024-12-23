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
    <div className="min-h-screen bg-background text-foreground">
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        onAddContact={handleAddContact}
        contacts={contacts}
        allContacts={allContacts}
        categories={COLDD_COLUMNS}
        onUpdateContact={handleUpdateContact}
      />
      
      <div className="pt-20 pb-4 px-8 h-[calc(100vh-1rem)]">
        <div className="h-full">
          <ColumnsContainer
            contacts={contacts}
            categories={COLDD_COLUMNS}
            allContacts={allContacts}
            onUpdateContacts={setContacts}
            onUpdateContact={handleUpdateContact}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;