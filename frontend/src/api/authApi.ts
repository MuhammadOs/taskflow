import axiosClient from './axiosClient';
import { AuthResponse, User } from '../types';

export const authApi = {
  register: async (data: Record<string, string>): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: Record<string, string>): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<{ status: string; data: { user: User } }> => {
    const response = await axiosClient.get<{ status: string; data: { user: User } }>('/auth/me');
    return response.data;
  },
};
