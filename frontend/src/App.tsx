import React from 'react';
import { CheckSquare, Server, Layers } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="max-w-xl w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-2">
          <CheckSquare className="w-8 h-8" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            TaskFlow
          </h1>
          <p className="text-slate-400 text-sm">
            MERN Stack Task Management System initialized with TypeScript, Vite & Express.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left pt-2">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
            <Server className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Backend API</p>
              <p className="text-sm font-semibold text-emerald-400">Ready on :5000</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
            <Layers className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Frontend App</p>
              <p className="text-sm font-semibold text-indigo-400">Vite + TS + Tailwind</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-500">
          Milestone 1 Completed: Project Scaffold & Environment Setup
        </div>
      </div>
    </div>
  );
}

export default App;
