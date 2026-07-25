import React from 'react';
import { AlertCircle, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { Task } from '../../types';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
          <ListTodo className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Total Tasks</p>
          <p className="text-xl font-bold text-white">{total}</p>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Pending</p>
          <p className="text-xl font-bold text-white">{pending}</p>
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">In Progress</p>
          <p className="text-xl font-bold text-white">{inProgress}</p>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Completed</p>
          <p className="text-xl font-bold text-white">{completed}</p>
        </div>
      </div>
    </div>
  );
};
