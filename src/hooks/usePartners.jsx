import { useState, useEffect, useMemo } from 'react';
import partnerService from '../api/partner.service';

export const usePartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await partnerService.getPartners();
      setPartners(data);
    } catch (err) {
      console.error("Ошибка загрузки", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPartners(); }, []);

  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    return partners.filter(item => 
      !term || 
      item.name?.toLowerCase().includes(term)
    );
  }, [partners, search]);

  return { partners, loading, search, setSearch, filteredData, loadPartners };
};