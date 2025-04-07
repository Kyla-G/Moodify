import React, { createContext, useContext, useState } from "react";

const themes = {
  dark: {
    background: "#000000",
    text: "#FFFFFF",
    dimmedText: "#545454",
    calendarBg: "#1A1A1A",
    buttonBg: "#FF6B35",
    accent1: "#F77F00",
    accent2: "#F6C49E",
    accent3: "#D62828",
    accent4: "#E0E0E0",
    name: "Default"
  },
  blue: {
    background: "#000000",
    text: "#FFFFFF",
    dimmedText: "#545454",
    calendarBg: "#1A1A1A",
    accent2: "#ffe700", // Baby Blue
    accent1: "#74ee15", // Lighter Baby Blue
    accent3: "#f000ff", // Soft Light Blue
    buttonBg: "#4deeea", // Moderate Blue
    accent4: "#001eff", // Sky Blue
    name: "Blue"
  },
  yellow: {
    background: "#000000",
    text: "#FFFFFF",
    dimmedText: "#545454",
    calendarBg: "#1A1A1A",
    buttonBg: "#5fa55a", // Mustard Yellow
    accent1: "#01b4bc", // Bright Yellow
    accent2: "#f6d51f", // Pale Yellow
    accent3: "#fa8925", // Golden Yellow
    accent4: "#fa5457", // Canary Yellow
    name: "Yellow"
  },
  pink: {
    background: "#000000",
    text: "#FFFFFF",
    dimmedText: "#545454",
    calendarBg: "#1A1A1A",
    accent3: "#0d0b33", // Cool-toned Pastel Pink
    accent1: "#4c2f6f", // Soft Lavender Pink
    buttonBg: "#c266a7", // Light Cool Pink
    accent2: "#52489f", // Cool Periwinkle
    accent4: "#e7c8e7", // Very Light Cool Pink
    name: "Pink"
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
