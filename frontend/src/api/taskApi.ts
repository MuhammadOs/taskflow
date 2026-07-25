import axiosClient from './axiosClient';
import { TasksResponse, SingleTaskResponse, TaskFilters, Task } from '../types';

export const taskApi = {
  getTasks: async (filters?: TaskFilters): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.order) params.append('order', filters.order);

    const response = await axiosClient.get<TasksResponse>(`/tasks?${params.toString()}`);
    return response.data;
  },

  getTaskById: async (id: string): Promise<SingleTaskResponse> => {
    const response = await axiosClient.get<SingleTaskResponse>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: Partial<Task>): Promise<SingleTaskResponse> => {
    const response = await axiosClient.post<SingleTaskResponse>('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: string, taskData: Partial<Task>): Promise<SingleTaskResponse> => {
    const response = await axiosClient.put<SingleTaskResponse>(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await axiosClient.delete<{ status: string; message: string }>(`/tasks/${id}`);
    return response.data;
  },
};
