import React, { createContext, useContext, useState, useEffect } from "react";
import { theme as antdTheme } from "antd";
// import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const antdThemeConfig = {
    algorithm: isDark
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: "#019de8",
      fontFamily: 'Rubik, sans-serif',
      colorBgContainer: isDark ? "#1f1f1f" : "#fff",   // фон контейнеров
      colorBgElevated: isDark ? "#2a2a2a" : "#fff",    // фон карточек, Dropdown и т.д.
      colorText: isDark ? "#e5e5e5" : "#000",          // основной текст
      colorTextSecondary: isDark ? "#bfbfbf" : "#6c6c6c", // второстепенный текст
      colorBorderSecondary: isDark ? "#3a3a3a" : "#d9d9d9", // бордеры
    },
  };

  


  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, antdThemeConfig }}>
        {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
