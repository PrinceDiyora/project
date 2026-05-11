import React from 'react';
import { capacityColor } from '../utils/helpers';

export default function ProgressBar({ value = 0, max = 100, showLabel = true, colorOverride }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = colorOverride || (pct > 85 ? 'bg-rose-500' : pct >= 60 ? 'bg-amber-500' : pct >= 30 ? 'bg-indigo-500' : 'bg-slate-600');

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-400 w-8 text-right tabular-nums">{pct}%</span>
      )}
    </div>
  );
}

export function CapacityBar({ used, capacity }) {
  const pct = capacity > 0 ? Math.min(100, Math.round((used / capacity) * 100)) : 0;
  const color = capacityColor(pct);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-300 tabular-nums">{used}/{capacity}</span>
    </div>
  );
}
