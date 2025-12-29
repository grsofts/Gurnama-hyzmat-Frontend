import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './auth/AuthContext';
import App from './App.jsx'
import ruRU from 'antd/locale/ru_RU';
import tkTK from 'antd/locale/tk_TK';
import { ConfigProvider } from 'antd';
import { ThemeProvider, useTheme } from "./theme/ThemeContext";

import { BrowserRouter } from 'react-router-dom'
import "./utils/language/i18n.js";
import { LanguageProvider } from './utils/language/LanguageProvider.jsx';
import { useLanguage } from './utils/language/useLanguage.js';
// eslint-disable-next-line react-refresh/only-export-components
const Root = () => {
  const { antdThemeConfig } = useTheme();
  const { lang } = useLanguage();

  return (
    <ConfigProvider theme={antdThemeConfig} locale={lang === 'ru' ? ruRU : tkTK}>
      <App />
    </ConfigProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <Root />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
