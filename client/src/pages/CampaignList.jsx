import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, List, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import { StatusBadge, Tag } from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import CampaignForm from '../components/CampaignForm';
import EmptyState from '../components/EmptyState';
import { formatDate, isOverdue, STATUSES } from '../utils/helpers';

const ALL = 'All';

export default function CampaignList() {
  const { campaigns, loading, createCampaign, deleteCampaign } = useCampaigns();
  const [view, setView] = useState('table');
  const [filterStatus, setFilterStatus] = useState(ALL);
  const [sortField, setSortField] = useState('deadline');
  const [sortDir, setSortDir] = useState('asc');
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    let list = filterStatus === ALL ? campaigns : campaigns.filter(c => c.status === filterStatus);
    list = [...list].sort((a, b) => {
      const va = a[sortField] || '';
      const vb = b[sortField] || '';
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [campaigns, filterStatus, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={12} className="inline ml-1" /> : <ChevronDown size={12} className="inline ml-1" />;
  };

  const handleCreate = async (data) => {
    await createCampaign(data);
    setShowModal(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Campaigns</h1>
          <p className="text-sm text-slate-500 mt-0.5">{campaigns.length} campaigns across {[...new Set(campaigns.map(c => c.clientName))].length} clients</p>
        </div>
        <button id="new-campaign-btn" onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={15} /> New Campaign
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status filter */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {[ALL, ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150
                          ${filterStatus === s ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-100'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button id="table-view-btn" onClick={() => setView('table')} className={`p-1.5 rounded-md transition-colors ${view === 'table' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`} title="Table view">
            <List size={14} />
          </button>
          <button id="card-view-btn" onClick={() => setView('cards')} className={`p-1.5 rounded-md transition-colors ${view === 'cards' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`} title="Card view">
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <EmptyState
          title="No campaigns found"
          description={filterStatus !== ALL ? `No campaigns with status "${filterStatus}".` : 'Create your first campaign to get started.'}
          action={<button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={14} />New Campaign</button>}
        />
      )}

      {/* Table view */}
      {filtered.length > 0 && view === 'table' && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-slate-800 bg-slate-900/50">
              <tr>
                <th className="table-header">Client / Campaign</th>
                <th className="table-header cursor-pointer select-none" onClick={() => toggleSort('owner')}>
                  Owner <SortIcon field="owner" />
                </th>
                <th className="table-header">Status</th>
                <th className="table-header cursor-pointer select-none" onClick={() => toggleSort('deadline')}>
                  Deadline <SortIcon field="deadline" />
                </th>
                <th className="table-header w-36">Progress</th>
                <th className="table-header">Tags</th>
                <th className="table-header w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="table-row">
                  <td className="table-cell">
                    <Link to={`/campaigns/${c.id}`} className="hover:text-indigo-400 transition-colors">
                      <p className="font-semibold text-slate-100">{c.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{c.clientName}</p>
                    </Link>
                  </td>
                  <td className="table-cell text-slate-300">{c.owner}</td>
                  <td className="table-cell"><StatusBadge status={c.status} /></td>
                  <td className={`table-cell ${isOverdue(c.deadline) && c.status !== 'Delivered' ? 'text-rose-400' : ''}`}>
                    {formatDate(c.deadline)}
                  </td>
                  <td className="table-cell w-36"><ProgressBar value={c.progress} /></td>
                  <td className="table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {(Array.isArray(c.tags) ? c.tags : []).slice(0, 2).map(t => <Tag key={t} label={t} />)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/client/${encodeURIComponent(c.clientName)}`}
                        className="text-slate-500 hover:text-indigo-400 transition-colors"
                        title="View Client Portal"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Card view */}
      {filtered.length > 0 && view === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="glass-card p-5 hover:border-slate-700 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link to={`/campaigns/${c.id}`} className="text-base font-semibold text-slate-100 hover:text-indigo-400 transition-colors">
                    {c.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{c.clientName}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Owner: <span className="text-slate-300">{c.owner}</span></span>
                  <span className={isOverdue(c.deadline) && c.status !== 'Delivered' ? 'text-rose-400' : ''}>
                    {formatDate(c.deadline)}
                  </span>
                </div>
                <ProgressBar value={c.progress} />
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-1 flex-wrap">
                    {(Array.isArray(c.tags) ? c.tags : []).map(t => <Tag key={t} label={t} />)}
                  </div>
                  <Link to={`/client/${encodeURIComponent(c.clientName)}`} className="text-slate-500 hover:text-indigo-400 transition-colors" title="Client Portal">
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Campaign Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Campaign" size="lg">
        <CampaignForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}
