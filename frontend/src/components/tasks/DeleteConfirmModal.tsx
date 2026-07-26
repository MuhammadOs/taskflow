import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { taskApi } from '../../api/taskApi';
import { Task } from '../../types';
import { useToast } from '../../context/ToastContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast('Task deleted successfully', 'info');
      onClose();
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to delete task', 'error');
    },
  });

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete Task</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete "<span className="text-slate-200 font-medium">{task.title}</span>"?
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
          This action cannot be undone. This task will be permanently removed from your account.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteMutation.mutate(task._id)}
            disabled={deleteMutation.isPending}
            className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
