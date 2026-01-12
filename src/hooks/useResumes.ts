import { useState, useEffect } from 'react';
import { resumesService } from '../services/resumes';
import type { Resume } from '../types';

export const useResumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await resumesService.getAll();
      setResumes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async (file: File) => {
    const newResume = await resumesService.upload(file);
    setResumes([newResume, ...resumes]);
    return newResume;
  };

  const deleteResume = async (id: number) => {
    await resumesService.delete(id);
    setResumes(resumes.filter(resume => resume.id !== id));
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return {
    resumes,
    loading,
    error,
    refetch: fetchResumes,
    uploadResume,
    deleteResume,
  };
};