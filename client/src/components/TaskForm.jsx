import React, { useState } from 'react';
import { PRIORITIES, TASK_STATUSES } from '../utils/helpers';
import { SEED_TEAM } from '../utils/seed';
import { useApp } from '../context/AppContext';

const EMPTY = { title: '', assignee: '', dueDate: '', priority: 'Medium', status: 'Todo', description: '' };

export default function TaskForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Add Task' }) {
  const { teamMembers } = useApp();
  const members = teamMembers.length ? teamMembers : SEED_TEAM;
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Task Title</label>
        <input className="input" required value={form.title} onChange={set('title')} placeholder="e.g. Write landing page copy" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Assignee</label>
          <select className="select" required value={form.assignee} onChange={set('assignee')}>
            <option value="">Select…</option>
            {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Due Date</label>
          <input className="input" type="date" required value={form.dueDate} onChange={set('dueDate')} />
        </div>
        <div>
          <label className="label">Priority</label>
          <select className="select" value={form.priority} onChange={set('priority')}>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="select" value={form.status} onChange={set('status')}>
            {TASK_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none h-20" value={form.description} onChange={set('description')} placeholder="Optional task description…" />
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
