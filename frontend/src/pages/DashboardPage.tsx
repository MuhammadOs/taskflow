import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { TaskStats } from '../components/tasks/TaskStats';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFiltersBar } from '../components/tasks/TaskFiltersBar';
import { TaskModal } from '../components/tasks/TaskModal';
import { DeleteConfirmModal } from '../components/tasks/DeleteConfirmModal';
import { taskApi } from '../api/taskApi';
import { Task, TaskFilters, TaskStatus } from '../types';

export const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Filter & Search state
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: 'all',
    priority: 'all',
  });

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Fetch tasks query with reactive filters
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskApi.getTasks(filters),
  });

  // Quick Status change mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskApi.updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const tasks: Task[] = data?.data.tasks || [];

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleQuickStatusChange = (task: Task, newStatus: TaskStatus) => {
    statusMutation.mutate({ id: task._id, status: newStatus });
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: 'all', priority: 'all' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Task Dashboard <Sparkles className="w-5 h-5 text-indigo-400" />
            </h2>
            <p className="text-xs text-slate-400">Manage and track your tasks in real time</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>

        {/* Statistics Bar */}
        <TaskStats tasks={tasks} />

        {/* Search & Filter Bar */}
        <TaskFiltersBar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Task Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300">
              Your Tasks ({tasks.length})
            </h3>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-xs">Fetching your task list...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
              Failed to load tasks: {(error as Error)?.message || 'Server connection error'}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && tasks.length === 0 && (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white">
                {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                  ? 'No tasks match your filters'
                  : 'No tasks created yet'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                  ? 'Try adjusting your search keyword or clearing the filters above.'
                  : 'Get started by clicking the "Create Task" button to add your first task.'}
              </p>
              {(filters.search || filters.status !== 'all' || filters.priority !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-xl transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Task Grid */}
          {!isLoading && !isError && tasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                  onStatusChange={handleQuickStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        task={taskToDelete}
      />
    </div>
  );
};
