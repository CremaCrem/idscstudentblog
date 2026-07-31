import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';
import { apiClient } from './apiClient';

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<AuthResponse>('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get<AuthResponse>('/auth/me');
    return response.data;
  }
};
