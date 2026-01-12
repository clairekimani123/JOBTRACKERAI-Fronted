import api from './api';
import type { Application, CreateApplicationRequest, ApplicationStats } from '../types';
export const applicationsService = {
  // Get all applications
  getAll: async (): Promise<Application[]> => {
    const response = await api.get<Application[]>('/api/applications/');
    return response.data;
  },

  // Get single application
  getById: async (id: number): Promise<Application> => {
    const response = await api.get<Application>(`/api/applications/${id}`);
    return response.data;
  },

  // Create application
  create: async (data: CreateApplicationRequest): Promise<Application> => {
    const response = await api.post<Application>('/api/applications/', data);
    return response.data;
  },

  // Update application
  update: async (id: number, data: Partial<CreateApplicationRequest>): Promise<Application> => {
    const response = await api.put<Application>(`/api/applications/${id}`, data);
    return response.data;
  },

  // Delete application
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/applications/${id}`);
  },

  // Get stats
  getStats: async (): Promise<ApplicationStats> => {
    const response = await api.get<ApplicationStats>('/api/applications/stats/summary');
    return response.data;
  },
};

export default applicationsService;