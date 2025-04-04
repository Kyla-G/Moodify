import React, { createContext, useContext, useState } from "react";

const themes = {
  dark: {
    background: "#000000",
    text: "#FFFFFF",
    calendarBg: "#1A1A1A",
    buttonBg: "#FF6B35",
    dimmedText: "#545454",
    name: "Default"
  },
  blue: {
    background: "#000000",
    text: "#FFFFFF",
    calendarBg: "#1A1A1A",
    buttonBg: "#3498DB",
    dimmedText: "#545454",
    name: "Blue"
  },
  yellow: {
    background: "#000000", 
    text: "#FFFFFF",
    calendarBg: "#1A1A1A",
    buttonBg: "#F1C40F",
    dimmedText: "#545454",
    name: "Yellow"
  },
  pink: {
    background: "#000000",
    text: "#FFFFFF",
    calendarBg: "#1A1A1A",
    buttonBg: "#E84393",
    dimmedText: "#545454",
    name: "Pink"
  },
  light: {
    background: "#FFFFFF",
    text: "#000000",
    calendarBg: "#F0F0F0",
    buttonBg: "#FF6B35",
    dimmedText: "#A0A0A0",
    name: "Light"
  }
};

const ThemeContext = createContext({
  theme: themes.dark,
  setThemeName: (themeName: string) => {},
  availableThemes: themes
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(themes.dark);

  const setThemeName = (themeName: string) => {
    const newTheme = themes[themeName.toLowerCase()];
    if (newTheme) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeName, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
