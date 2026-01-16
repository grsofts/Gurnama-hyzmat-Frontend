import { useState, useEffect, useMemo } from 'react';
import certService from '../api/certificate.service';

export const useCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await certService.getCertificates();
      setCertificates(data);
    } catch (err) {
      console.error("Ошибка загрузки", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCertificates(); }, []);

  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    return certificates.filter(item => 
      !term || 
      item.name?.toLowerCase().includes(term)
    );
  }, [certificates, search]);

  return { certificates, loading, search, setSearch, filteredData, loadCertificates };
};