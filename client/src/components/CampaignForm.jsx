import React, { useState } from 'react';
import { STATUSES } from '../utils/helpers';
import { SEED_TEAM } from '../utils/seed';
import { useApp } from '../context/AppContext';

const EMPTY = { title: '', clientName: '', owner: '', status: 'Planning', deadline: '', progress: 0, tags: '' };

export default function CampaignForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Create Campaign' }) {
  const { teamMembers } = useApp();
  const members = teamMembers.length ? teamMembers : SEED_TEAM;
  const [form, setForm] = useState({ ...EMPTY, ...initial, tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags || '') });
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      progress: parseInt(form.progress, 10) || 0,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    await onSubmit(payload);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Campaign Title</label>
          <input className="input" required value={form.title} onChange={set('title')} placeholder="e.g. Spring Product Launch" />
        </div>
        <div>
          <label className="label">Client Name</label>
          <input className="input" required value={form.clientName} onChange={set('clientName')} placeholder="e.g. NovaBrew Coffee" />
        </div>
        <div>
          <label className="label">Owner</label>
          <select className="select" required value={form.owner} onChange={set('owner')}>
            <option value="">Select owner…</option>
            {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="select" value={form.status} onChange={set('status')}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Deadline</label>
          <input className="input" type="date" required value={form.deadline} onChange={set('deadline')} />
        </div>
        <div>
          <label className="label">Progress (%)</label>
          <input className="input" type="number" min="0" max="100" value={form.progress} onChange={set('progress')} />
        </div>
        <div>
          <label className="label">Tags <span className="normal-case font-normal text-slate-500">(comma-separated)</span></label>
          <input className="input" value={form.tags} onChange={set('tags')} placeholder="Social Media, Email, PR" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
