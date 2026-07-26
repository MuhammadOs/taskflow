import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Loader2, X } from 'lucide-react';
import { taskSchema, TaskInput } from '../../schemas/taskSchemas';
import { taskApi } from '../../api/taskApi';
import { Task } from '../../types';
import { useToast } from '../../context/ToastContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const isEditing = !!taskToEdit;

  const [datePart, setDatePart] = useState<string>('');
  const [timePart, setTimePart] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      let dStr = '';
      let tStr = '';
      if (taskToEdit.dueDate) {
        const d = new Date(taskToEdit.dueDate);
        dStr = d.toISOString().split('T')[0];
        tStr = d.toTimeString().slice(0, 5);
      }

      setDatePart(dStr);
      setTimePart(tStr);

      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        dueDate: taskToEdit.dueDate || '',
      });
    } else {
      setDatePart('');
      setTimePart('');
      reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [taskToEdit, reset, isOpen]);

  // Keep hidden dueDate field updated when datePart or timePart changes
  useEffect(() => {
    if (datePart) {
      const combined = timePart ? `${datePart}T${timePart}` : `${datePart}T23:59`;
      setValue('dueDate', combined);
    } else {
      setValue('dueDate', '');
    }
  }, [datePart, timePart, setValue]);

  const taskMutation = useMutation({
    mutationFn: (data: TaskInput) => {
      if (isEditing && taskToEdit) {
        return taskApi.updateTask(taskToEdit._id, data);
      }
      return taskApi.createTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast(isEditing ? 'Task updated successfully' : 'Task created successfully', 'success');
      onClose();
      reset();
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to save task', 'error');
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: TaskInput) => {
    taskMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Task Title *</label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g. Implement Auth UI"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Provide context or details about this task..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Status & Priority Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Status</label>
              <select
                {...register('status')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Priority</label>
              <select
                {...register('priority')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date & Due Time Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Set Due Date & Time</span>
              <span className="text-[11px] text-slate-500 font-normal">Optional</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Date Input */}
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="date"
                  value={datePart}
                  onChange={(e) => setDatePart(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Time Input */}
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="time"
                  value={timePart}
                  onChange={(e) => setTimePart(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={taskMutation.isPending}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {taskMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
