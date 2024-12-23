import { useState, useEffect } from "react";

export const useTheme = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  return { isDark, toggleTheme };
};