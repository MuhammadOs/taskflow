export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
}

export interface TasksResponse {
  status: string;
  results: number;
  data: {
    tasks: Task[];
  };
}

export interface SingleTaskResponse {
  status: string;
  data: {
    task: Task;
  };
}

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ApiError {
  status: string;
  message?: string;
  errors?: Array<{ msg: string; path?: string }>;
}
