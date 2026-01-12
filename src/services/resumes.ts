import api from './api';
import type { Resume } from '../types';

export const resumesService = {
  // Get all resumes
  getAll: async (): Promise<Resume[]> => {
    const response = await api.get<Resume[]>('/api/resumes/');
    return response.data;
  },

  // Get single resume
  getById: async (id: number): Promise<Resume> => {
    const response = await api.get<Resume>(`/api/resumes/${id}`);
    return response.data;
  },

  // Upload resume
  upload: async (file: File): Promise<Resume> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<Resume>('/api/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete resume
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/resumes/${id}`);
  },
};

export default resumesService;