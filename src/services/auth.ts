import api from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';
export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  // Register user
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/api/auth/register', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/users/me');
    return response.data;
  },

  // Store token
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Remove token
  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export default authService;