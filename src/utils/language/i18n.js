import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from '../../locales/ru.json'
import tm from '../../locales/tm.json'

const savedLang = localStorage.getItem('lang') || 'ru';

i18n
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: "tm",
    supportedLngs: ['ru', 'tm'],
    resources:{
        ru: { translation:ru},
        tm: { translation:tm},
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
