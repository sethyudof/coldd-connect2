import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDark, toggleTheme }) => {
  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-primary"
      />
      <Moon className="h-4 w-4" />
    </div>
  );
};