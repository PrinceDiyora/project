// Date formatting
export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isOverdue(iso) {
  if (!iso) return false;
  return new Date(iso) < new Date() && new Date(iso).toDateString() !== new Date().toDateString();
}

export function daysUntil(iso) {
  const diff = new Date(iso) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Status color maps
export const STATUS_COLORS = {
  'Planning':    'bg-slate-700/60 text-slate-300 border-slate-600',
  'In Progress': 'bg-indigo-900/60 text-indigo-300 border-indigo-700',
  'Review':      'bg-amber-900/60 text-amber-300 border-amber-700',
  'Delivered':   'bg-emerald-900/60 text-emerald-300 border-emerald-700',
};

export const PRIORITY_COLORS = {
  'Low':      'bg-slate-700/60 text-slate-300 border-slate-600',
  'Medium':   'bg-amber-900/60 text-amber-300 border-amber-700',
  'High':     'bg-orange-900/60 text-orange-300 border-orange-700',
  'Critical': 'bg-rose-900/60 text-rose-300 border-rose-700',
};

export const TASK_STATUS_COLORS = {
  'Todo':        'bg-slate-700/60 text-slate-300 border-slate-600',
  'In Progress': 'bg-indigo-900/60 text-indigo-300 border-indigo-700',
  'Review':      'bg-amber-900/60 text-amber-300 border-amber-700',
  'Done':        'bg-emerald-900/60 text-emerald-300 border-emerald-700',
};

export const STATUSES = ['Planning', 'In Progress', 'Review', 'Delivered'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
export const TASK_STATUSES = ['Todo', 'In Progress', 'Review', 'Done'];

// Capacity bar color
export function capacityColor(pct) {
  if (pct > 85) return 'bg-rose-500';
  if (pct >= 60) return 'bg-amber-500';
  return 'bg-emerald-500';
}

export function capacityTextColor(pct) {
  if (pct > 85) return 'text-rose-400';
  if (pct >= 60) return 'text-amber-400';
  return 'text-emerald-400';
}

// API helper with localStorage fallback
const API = '/api';

export async function apiFetch(path, options = {}) {
  const res = await fetch(API + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// localStorage helpers
export const LS = {
  get: (key, fallback) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
  },
};

// Generate unique ID (for offline mode)
export function genId() {
  return 'local-' + Math.random().toString(36).slice(2, 9);
}

// Count tasks by status
export function countByStatus(tasks) {
  return TASK_STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter(t => t.status === s).length;
    return acc;
  }, {});
}
