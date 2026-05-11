import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch, formatDate, isOverdue, LS } from '../utils/helpers';
import { SEED_CAMPAIGNS, SEED_TASKS } from '../utils/seed';
import { StatusBadge } from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import { CheckCircle2, Circle, ArrowLeft, RefreshCcw, Building2 } from 'lucide-react';

export default function ClientDashboard() {
  const { clientName } = useParams();
  const decoded = decodeURIComponent(clientName);
  const [campaigns, setCampaigns] = useState([]);
  const [tasksByCampaign, setTasksByCampaign] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      try {
        const all = await apiFetch('/campaigns');
        LS.set('campaigns', all);
        const client = all.filter(c => c.clientName === decoded);
        setCampaigns(client);

        const taskMap = {};
        await Promise.all(client.map(async c => {
          try {
            const t = await apiFetch(`/campaigns/${c.id}/tasks`);
            taskMap[c.id] = t;
          } catch {
            taskMap[c.id] = LS.get(`tasks_${c.id}`, SEED_TASKS.filter(t => t.campaignId === c.id));
          }
        }));
        setTasksByCampaign(taskMap);
      } catch {
        const all = LS.get('campaigns', SEED_CAMPAIGNS);
        const client = all.filter(c => c.clientName === decoded);
        setCampaigns(client);
        const taskMap = {};
        client.forEach(c => {
          taskMap[c.id] = LS.get(`tasks_${c.id}`, SEED_TASKS.filter(t => t.campaignId === c.id));
        });
        setTasksByCampaign(taskMap);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [decoded]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Clean portal header */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">{decoded}</h1>
              <p className="text-xs text-slate-500">Client Project Portal</p>
            </div>
          </div>
          <Link to="/campaigns" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft size={14} /> Back to Agency View
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8 space-y-6">
        {/* Last updated */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <RefreshCcw size={11} />
          Last updated: {formatDate(lastUpdated.toISOString())}
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Building2 size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-base font-medium text-slate-500">No campaigns found for {decoded}</p>
          </div>
        ) : (
          campaigns.map(campaign => {
            const tasks = tasksByCampaign[campaign.id] || [];
            const done = tasks.filter(t => t.status === 'Done');
            const active = tasks.filter(t => t.status !== 'Done');

            return (
              <div key={campaign.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Campaign header */}
                <div className="px-6 py-5 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-800">{campaign.title}</h2>
                      <div className="flex items-center gap-2 mt-1.5">
                        <StatusBadge status={campaign.status} />
                        <span className={`text-xs ${isOverdue(campaign.deadline) && campaign.status !== 'Delivered' ? 'text-rose-500 font-semibold' : 'text-slate-400'}`}>
                          Due {formatDate(campaign.deadline)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800">{campaign.progress}%</p>
                      <p className="text-xs text-slate-400">complete</p>
                    </div>
                  </div>
                  <ProgressBar value={campaign.progress} colorOverride="bg-indigo-500" />
                </div>

                {/* Deliverables */}
                <div className="px-6 py-4">
                  {tasks.length === 0 ? (
                    <p className="text-sm text-slate-400 py-2 text-center">No deliverables added yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {/* Done tasks */}
                      {done.map(t => (
                        <div key={t.id} className="flex items-center gap-2.5 py-1.5">
                          <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-slate-400 line-through">{t.title}</span>
                        </div>
                      ))}
                      {/* Active tasks */}
                      {active.map(t => (
                        <div key={t.id} className="flex items-center gap-2.5 py-1.5">
                          <Circle size={15} className="text-slate-300 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{t.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
