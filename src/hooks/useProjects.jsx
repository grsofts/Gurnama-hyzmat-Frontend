import { useState, useEffect, useMemo } from 'react';
import projectService from '../api/project.service';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Ошибка загрузки", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    return projects.filter(item => 
      !term || 
      item.title?.toLowerCase().includes(term)|| 
      item.short_desc?.toLowerCase().includes(term)
    );
  }, [projects, search]);

  return { projects, loading, search, setSearch, filteredData, loadProjects };
};