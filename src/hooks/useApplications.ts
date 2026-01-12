import { useState, useEffect } from 'react';
import { applicationsService } from '../services/applications';
import type { Application, ApplicationStats } from '../types';
export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationsService.getAll();
      setApplications(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await applicationsService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const createApplication = async (data: any) => {
    const newApp = await applicationsService.create(data);
    setApplications([newApp, ...applications]);
    return newApp;
  };

  const updateApplication = async (id: number, data: any) => {
    const updated = await applicationsService.update(id, data);
    setApplications(applications.map(app => app.id === id ? updated : app));
    return updated;
  };

  const deleteApplication = async (id: number) => {
    await applicationsService.delete(id);
    setApplications(applications.filter(app => app.id !== id));
  };

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  return {
    applications,
    stats,
    loading,
    error,
    refetch: fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
  };
};