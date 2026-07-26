import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  status: z.enum(['todo', 'pending', 'in-progress', 'completed', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
