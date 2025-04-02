import React, { createContext, useContext, useState } from "react";

const themes = {
  light: {
    background: "#FFFFFF",
    text: "#000000",
    calendarBg: "#F0F0F0",
    buttonBg: "#FF6B35",
    dimmedText: "#A0A0A0",
  },
  dark: {
    background: "#000000",
    text: "#FFFFFF",
    calendarBg: "#1A1A1A",
    buttonBg: "#FF6B35",
    dimmedText: "#545454",
  },
};

const ThemeContext = createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(themes.dark);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === themes.dark ? themes.light : themes.dark));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
