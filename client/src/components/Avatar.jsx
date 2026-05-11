import React from 'react';

const AVATAR_COLORS = [
  'bg-indigo-600', 'bg-violet-600', 'bg-rose-600',
  'bg-emerald-600', 'bg-amber-600', 'bg-sky-600',
];

function colorFor(initials) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function Avatar({ initials, name, size = 'md' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' };
  return (
    <div
      title={name}
      className={`${sizes[size]} ${colorFor(initials || 'XX')} rounded-full flex items-center justify-center
                  font-bold text-white ring-2 ring-slate-900 flex-shrink-0`}
    >
      {initials || '??'}
    </div>
  );
}
