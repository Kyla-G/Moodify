import React, { createContext, useContext, useState } from "react";

const themes = {
  autumn: {
    background: "#000000",
    text: "#FFFFFF",
    dimmedText: "#545454",
    calendarBg: "#1A1A1A",
    buttonBg: "#FF6B35",
    accent1: "#F77F00",
    accent2: "#F6C49E",
    accent3: "#D62828",
    accent4: "#E0E0E0",
    name: "Autumn"
  },
  spring: {
    background: "#000000",
    text: "#FFFFFF",
    dimmedText: "#545454",
    calendarBg: "#1A1A1A",
    buttonBg: "#ffbc48", // yellow
    accent1: "#a2b973", // green
    accent2: "#ff6780", // pink
    accent3: "#b85c78", // dull pink
    accent4: "#776c8e", // purple
    name: "Spring"
  },
  winter: {
    background: "#000000",
    text: "#FFFFFF",
    dimmedText: "#545454",
    calendarBg: "#1A1A1A",
    buttonBg: "#b3e220", // light green
    accent1: "#6ad23d", // green
    accent2: "#19ad6b", // sage green
    accent3: "#197b7a", // dark teal
    accent4: "#2b57b8", // blue
    name: "Winter"
  },
  summer: {
    background: "#000000",
    text: "#FFFFFF",
    dimmedText: "#545454",
    calendarBg: "#1A1A1A",
    buttonBg: "#f6d51f", // Pink
    accent1: "#fa8925", // Deep purple
    accent2: "#5fa55a", // Blue-purple
    accent3: "#01b4bc", // Dark blue
    accent4: "#fa5457", // Light pink
    name: "Summer"
  },
  light: {
    background: "#FFFFFF",
    text: "#000000",
    dimmedText: "#A0A0A0",
    calendarBg: "#F0F0F0",
    buttonBg: "#FF6B35",
    accent1: "#F77F00",
    accent2: "#F6C49E",
    accent3: "#D62828",
    accent4: "#E0E0E0",
    name: "Light"
  }
};

const ThemeContext = createContext({
  theme: themes.autumn,
  setThemeName: (themeName: string) => {},
  availableThemes: themes
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(themes.autumn);

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