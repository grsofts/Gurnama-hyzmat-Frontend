import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/tk';
import { LanguageContext } from './LanguageContext';

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ru');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    dayjs.locale(lang === 'ru' ? 'ru' : 'tk');
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};