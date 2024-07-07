// components/ThemeSwitcher.tsx
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { MoonIcon } from "./Icons/MoonIcon";
import { SunIcon } from "./Icons/SunIcon";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Sync theme change across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        setTheme(e.newValue || 'light');
        if(e.newValue === 'light') {
            document.documentElement.setAttribute("data-theme", "light");

        }else if(e.newValue === 'dark') {
            document.documentElement.setAttribute("data-theme", "black");
        }
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
