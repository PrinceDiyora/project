import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Calendar, User } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import { useTasks } from '../hooks/useTasks';
import { StatusBadge, PriorityBadge, TaskStatusBadge, Tag } from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import CampaignForm from '../components/CampaignForm';
import EmptyState from '../components/EmptyState';
import { formatDate, isOverdue, TASK_STATUSES, countByStatus } from '../utils/helpers';
import { SEED_TEAM } from '../utils/seed';

export default function CampaignDetail() {
  const { id } = useParams();
  const { campaigns, updateCampaign } = useCampaigns();
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks(id);
  const campaign = campaigns.find(c => c.id === id);

  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditCampaign, setShowEditCampaign] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  if (!campaign) return (
    <div className="p-6 animate-fade-in">
      <Link to="/campaigns" className="btn-ghost mb-4 inline-flex"><ArrowLeft size={14} /> Back</Link>
      <p className="text-slate-400">Campaign not found.</p>
    </div>
  );

  const statusCounts = countByStatus(tasks);

  const handleAddTask = async (data) => {
    await createTask(data);
    setShowAddTask(false);
  };

  const handleEditTask = async (data) => {
    await updateTask(editingTask.id, data);
    setEditingTask(null);
  };

  const handleStatusChange = async (task, newStatus) => {
    await updateTask(task.id, { ...task, status: newStatus });
  };

  const handleEditCampaign = async (data) => {
    await updateCampaign(id, data);
    setShowEditCampaign(false);
  };

  const tags = Array.isArray(campaign.tags) ? campaign.tags : [];

  // Get avatar initials from team
  function getInitials(name) {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Back */}
      <Link to="/campaigns" className="btn-ghost inline-flex text-sm">
        <ArrowLeft size={14} /> Back to Campaigns
      </Link>

      {/* Campaign Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-slate-100">{campaign.title}</h1>
              <StatusBadge status={campaign.status} />
            </div>
            <p className="text-slate-400 mt-1">{campaign.clientName}</p>
          </div>
          <button onClick={() => setShowEditCampaign(true)} className="btn-ghost flex-shrink-0">
            <Pencil size={14} /> Edit
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Owner</p>
            <div className="flex items-center gap-2">
              <Avatar initials={getInitials(campaign.owner)} name={campaign.owner} size="sm" />
              <span className="text-sm text-slate-300">{campaign.owner}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Deadline</p>
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className={isOverdue(campaign.deadline) && campaign.status !== 'Delivered' ? 'text-rose-400' : 'text-slate-500'} />
              <span className={`text-sm ${isOverdue(campaign.deadline) && campaign.status !== 'Delivered' ? 'text-rose-400 font-semibold' : 'text-slate-300'}`}>
                {formatDate(campaign.deadline)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Tags</p>
            <div className="flex gap-1 flex-wrap">{tags.map(t => <Tag key={t} label={t} />)}</div>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Progress</p>
            <ProgressBar value={campaign.progress} colorOverride="bg-indigo-500" />
          </div>
        </div>
      </div>

      {/* Task Status Summary */}
      <div className="grid grid-cols-4 gap-3">
        {TASK_STATUSES.map(s => (
          <div key={s} className="glass-card px-4 py-3 text-center">
            <p className="text-2xl font-bold text-slate-100">{statusCounts[s] || 0}</p>
            <TaskStatusBadge status={s} />
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300">Tasks <span className="text-slate-500 ml-1">({tasks.length})</span></h2>
          <button id="add-task-btn" onClick={() => setShowAddTask(true)} className="btn-primary py-1.5 text-xs">
            <Plus size={13} /> Add Task
          </button>
        </div>

        {tasksLoading && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!tasksLoading && tasks.length === 0 && (
          <EmptyState title="No tasks yet" description="Add tasks to track campaign deliverables."
            action={<button onClick={() => setShowAddTask(true)} className="btn-primary"><Plus size={14} />Add Task</button>}
          />
        )}

        {!tasksLoading && tasks.length > 0 && (
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="table-header">Task</th>
                <th className="table-header">Assignee</th>
                <th className="table-header">Priority</th>
                <th className="table-header">Due Date</th>
                <th className="table-header">Status</th>
                <th className="table-header w-16"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="table-row">
                  <td className="table-cell">
                    <p className="font-medium text-slate-200">{task.title}</p>
                    {task.description && <p className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{task.description}</p>}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar initials={getInitials(task.assignee)} name={task.assignee} size="sm" />
                      <span className="text-slate-300 text-xs">{task.assignee.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="table-cell"><PriorityBadge priority={task.priority} /></td>
                  <td className={`table-cell text-xs ${isOverdue(task.dueDate) && task.status !== 'Done' ? 'text-rose-400' : 'text-slate-400'}`}>
                    {formatDate(task.dueDate)}
                  </td>
                  <td className="table-cell">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300
                                 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      {TASK_STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingTask(task)} className="btn-ghost p-1.5" title="Edit task">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="btn-ghost p-1.5 hover:text-rose-400" title="Delete task">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="Add Task">
        <TaskForm onSubmit={handleAddTask} onCancel={() => setShowAddTask(false)} />
      </Modal>

      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        {editingTask && (
          <TaskForm initial={editingTask} onSubmit={handleEditTask} onCancel={() => setEditingTask(null)} submitLabel="Save Changes" />
        )}
      </Modal>

      <Modal isOpen={showEditCampaign} onClose={() => setShowEditCampaign(false)} title="Edit Campaign" size="lg">
        <CampaignForm
          initial={campaign}
          onSubmit={handleEditCampaign}
          onCancel={() => setShowEditCampaign(false)}
          submitLabel="Save Changes"
        />
      </Modal>
    </div>
  );
}
