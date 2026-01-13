import { useState, useEffect, useMemo } from 'react';
import bannersService from '../api/banners.service';

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await bannersService.getBanners();
      setBanners(data);
    } catch (err) {
      console.error("Ошибка загрузки", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBanners(); }, []);

  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    return banners.filter(item => 
      !term || 
      item.name?.toLowerCase().includes(term) || 
      item.title?.toLowerCase().includes(term)
    );
  }, [banners, search]);

  return { banners, loading, search, setSearch, filteredData, loadBanners };
};