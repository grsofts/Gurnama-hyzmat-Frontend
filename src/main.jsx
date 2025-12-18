import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './auth/AuthContext';
import App from './App.jsx'
import { ConfigProvider } from 'antd';

import { ThemeProvider, useTheme } from "./theme/ThemeContext";

import { BrowserRouter } from 'react-router-dom'


// eslint-disable-next-line react-refresh/only-export-components
const Root = () => {
  const { antdThemeConfig } = useTheme();

  return (
    <ConfigProvider theme={antdThemeConfig}>
      <App />
    </ConfigProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Root />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
