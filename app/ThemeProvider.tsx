"use client";

import { Theme } from "@radix-ui/themes";
import { createContext, useContext, useEffect, useState } from "react";

type Appearance = "light" | "dark";

const ThemeContext = createContext({
  appearance: "dark" as Appearance,
  toggleTheme: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appearance, setAppearance] = useState<Appearance>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Appearance;
    if (saved) setAppearance(saved);
  }, []);

  const toggleTheme = () => {
    const next = appearance === "light" ? "dark" : "light";
    setAppearance(next);
    localStorage.setItem("theme", next);
  };

  return (
    <ThemeContext.Provider value={{ appearance, toggleTheme }}>
      <Theme accentColor="purple" appearance={appearance}>
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}
