import api from './api';
import type { AIAnalysis } from '../types';

interface AIMatchRequest {
  application_id: number;
  resume_id: number;
}

export const aiService = {
  // Run AI match analysis
  runMatch: async (data: AIMatchRequest): Promise<AIAnalysis> => {
    const response = await api.post<AIAnalysis>('/api/ai/match', data);
    return response.data;
  },

  // Get AI analysis history
  getHistory: async (): Promise<AIAnalysis[]> => {
    const response = await api.get<AIAnalysis[]>('/api/ai/history');
    return response.data;
  },

  // Get ranked applications
  getRankings: async (): Promise<any[]> => {
    const response = await api.get('/api/ai/rankings');
    return response.data;
  },
};

export default aiService;