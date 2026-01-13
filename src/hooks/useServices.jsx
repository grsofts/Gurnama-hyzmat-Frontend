import { useState, useEffect, useMemo } from 'react';
import hyzmatService from '../api/hyzmat.service';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await hyzmatService.getServices();
      setServices(data);
    } catch (err) {
      console.error("Ошибка загрузки", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, []);

  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    return services.filter(item => 
      !term || 
      item.name?.toLowerCase().includes(term) || 
      item.title?.toLowerCase().includes(term)
    );
  }, [services, search]);

  return { services, loading, search, setSearch, filteredData, loadServices };
};