import React, { useEffect, useState } from 'react';
import { apiFetch, capacityColor, capacityTextColor, LS } from '../utils/helpers';
import { SEED_TEAM } from '../utils/seed';
import Avatar from '../components/Avatar';
import { CapacityBar } from '../components/ProgressBar';
import { PriorityBadge } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { Users, AlertTriangle } from 'lucide-react';

export default function Workload() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/team')
      .then(data => { setMembers(data); LS.set('team', data); })
      .catch(() => setMembers(LS.get('team', SEED_TEAM)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const overloaded = members.filter(m => m.taskCount / m.capacity > 0.85).length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Team Workload</h1>
          <p className="text-sm text-slate-500 mt-0.5">{members.length} team members · active task distribution</p>
        </div>
        {overloaded > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-900/30 border border-rose-800/50 text-rose-400 text-xs font-semibold">
            <AlertTriangle size={13} />
            {overloaded} member{overloaded > 1 ? 's' : ''} at capacity
          </div>
        )}
      </div>

      {members.length === 0 && (
        <EmptyState title="No team members" description="Team data unavailable." />
      )}

      {/* Member cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {members.map(member => {
          const pct = member.capacity > 0 ? Math.round((member.taskCount / member.capacity) * 100) : 0;
          const textColor = capacityTextColor(pct);

          return (
            <div key={member.id} className="glass-card overflow-hidden hover:border-slate-700 transition-all duration-200">
              {/* Card header */}
              <div className="px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar initials={member.avatarInitials} name={member.name} size="lg" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-100">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                  <div className={`ml-auto text-right`}>
                    <p className={`text-xl font-bold ${textColor}`}>{pct}%</p>
                    <p className="text-xs text-slate-500">capacity</p>
                  </div>
                </div>
                <CapacityBar used={member.taskCount} capacity={member.capacity} />
              </div>

              {/* Task list */}
              <div className="px-5 py-3 space-y-2.5 max-h-64 overflow-y-auto">
                {(!member.tasks || member.tasks.length === 0) ? (
                  <div className="flex items-center gap-2 py-4 justify-center text-slate-500 text-sm">
                    <Users size={14} /> No active tasks
                  </div>
                ) : (
                  member.tasks.map(task => (
                    <div key={task.id} className="flex items-start gap-3 py-2 border-b border-slate-800/50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300 truncate font-medium">{task.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{task.campaignTitle}</p>
                      </div>
                      <PriorityBadge priority={task.priority} />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
