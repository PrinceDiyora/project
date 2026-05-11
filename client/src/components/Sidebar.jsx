import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV = [
  { to: '/campaigns', label: 'Campaigns', icon: Briefcase },
  { to: '/workload',  label: 'Workload',  icon: Users },
];

export default function Sidebar() {
  const { offline } = useApp();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100 leading-none">Agency PM</p>
            <p className="text-xs text-slate-500 mt-0.5">Marketing Studio</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
               ${isActive
                 ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-700/40'
                 : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                        ${offline ? 'bg-amber-900/30 text-amber-400' : 'bg-emerald-900/20 text-emerald-400'}`}>
          {offline ? <WifiOff size={12} /> : <Wifi size={12} />}
          {offline ? 'Offline — cached data' : 'API Connected'}
        </div>
      </div>
    </aside>
  );
}
