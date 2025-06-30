// components/ThemeSwitcher.tsx
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Switch } from "@heroui/react";
import { MoonIcon } from "./Icons/MoonIcon";
import { SunIcon } from "./Icons/SunIcon";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme === 'light' ? 'light' : 'black');
    }
  
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const newTheme = e.newValue || 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme === 'light' ? 'light' : 'black');
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setTheme]);

  if (!mounted) return null;

  const handleChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    if(newTheme === 'light') {
        document.documentElement.setAttribute("data-theme", "light");

    }else if(newTheme === 'dark') {
        document.documentElement.setAttribute("data-theme", "black");
    }
    localStorage.setItem('theme', newTheme); // Store theme in localStorage
  };

  return (
    <div>
      <Switch
        isSelected={theme == 'dark'}
        size="md"
        color="secondary"
        thumbIcon={({ isSelected, className }) =>
          !isSelected ? (
            <SunIcon className={className} />
          ) : (
            <MoonIcon className={className} />
          )
        }
        onChange={(e) => handleChange(e.target.checked)}
      />
    </div>
  );
};