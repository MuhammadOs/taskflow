import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  icon: React.ReactNode;
  headerBg: string;
  borderColor: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const columns: ColumnConfig[] = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
      headerBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      borderColor: 'border-amber-500/30',
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      icon: <Clock className="w-4 h-4 text-indigo-400" />,
      headerBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      borderColor: 'border-indigo-500/30',
    },
    {
      id: 'done',
      title: 'Done',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      headerBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      borderColor: 'border-emerald-500/30',
    },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => {
      if (status === 'todo') return t.status === 'todo' || t.status === 'pending';
      if (status === 'done') return t.status === 'done' || t.status === 'completed';
      return t.status === status;
    });
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== targetStatus) {
      onStatusChange(task, targetStatus);
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const isTarget = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`bg-slate-900/60 border rounded-2xl p-4 min-h-[450px] flex flex-col space-y-4 transition-all ${
              isTarget ? `${column.borderColor} bg-slate-900/90 ring-2 ring-indigo-500/20` : 'border-slate-800'
            }`}
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-xl border ${column.headerBg}`}>
              <div className="flex items-center gap-2">
                {column.icon}
                <span className="text-xs font-bold uppercase tracking-wider">{column.title}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-950/60 text-xs font-bold">
                {columnTasks.length}
              </span>
            </div>

            {/* Column Tasks Container */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[700px] pr-1">
              {columnTasks.length === 0 ? (
                <div className="h-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                  Drag tasks here
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    className="cursor-grab active:cursor-grabbing transform transition-transform hover:-translate-y-0.5"
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
