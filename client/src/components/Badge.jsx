import React from 'react';
import { STATUS_COLORS, PRIORITY_COLORS, TASK_STATUS_COLORS } from '../utils/helpers';

export function StatusBadge({ status }) {
  const cls = STATUS_COLORS[status] || 'bg-slate-700 text-slate-300';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cls = PRIORITY_COLORS[priority] || 'bg-slate-700 text-slate-300';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {priority}
    </span>
  );
}

export function TaskStatusBadge({ status }) {
  const cls = TASK_STATUS_COLORS[status] || 'bg-slate-700 text-slate-300';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  );
}

export function Tag({ label }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                     bg-slate-800 text-slate-400 border border-slate-700">
      {label}
    </span>
  );
}
