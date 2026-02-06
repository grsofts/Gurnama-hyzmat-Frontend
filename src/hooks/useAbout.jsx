import { useState, useEffect } from 'react';
import settingService from '../api/setting.service';

export const useAbout = () => {
  const [about, setAbout] = useState({});
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const data = await settingService.getAbout();
      setAbout(data);
    } catch (err) {
      console.error("Ошибка загрузки", err);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await settingService.getContacts();
      setContacts(data);
    } catch (err) {
      console.error("Ошибка загрузки", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadAbout(); 
    loadContacts();
  }, []);


  return { about, loading, loadAbout, contacts, loadContacts};
};