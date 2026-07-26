import React from 'react';
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onStatusChange?: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">High Priority</span>;
      case 'medium':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Med Priority</span>;
      case 'low':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">Low Priority</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
      case 'done':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Done
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case 'todo':
      case 'pending':
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3 h-3" /> To Do
          </span>
        );
    }
  };

  const formatCreatedTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const dateFormatted = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const isOverdue = d.getTime() < Date.now() && task.status !== 'done' && task.status !== 'completed';

    return {
      text: dateFormatted,
      isOverdue,
    };
  };

  const dueDateInfo = formatDueDate(task.dueDate);
  const isTaskCompleted = task.status === 'completed' || task.status === 'done';

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Badges */}
        <div className="flex items-center justify-between gap-2">
          {getStatusBadge(task.status)}
          {getPriorityBadge(task.priority)}
        </div>

        {/* Title */}
        <h3 className={`text-base font-semibold text-white tracking-tight ${isTaskCompleted ? 'line-through text-slate-400' : ''}`}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Date & Time Section */}
      <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center justify-between gap-2">
          {/* Due Date Badge */}
          {dueDateInfo ? (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium border ${
                dueDateInfo.isOverdue
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
              }`}
            >
              {dueDateInfo.isOverdue ? (
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              )}
              <span>{dueDateInfo.isOverdue ? `Overdue: ${dueDateInfo.text}` : `Due: ${dueDateInfo.text}`}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium bg-slate-800/60 text-slate-400 border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>No Due Date</span>
            </div>
          )}

          {/* Created Time Badge */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Created {formatCreatedTime(task.createdAt)}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {onStatusChange && !isTaskCompleted && (
            <button
              onClick={() => onStatusChange(task, 'done')}
              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer"
              title="Mark as Done"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
