import { useState, useEffect, useCallback } from 'react';
import { apiFetch, LS } from '../utils/helpers';
import { SEED_TASKS } from '../utils/seed';

export function useTasks(campaignId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const lsKey = `tasks_${campaignId}`;

  const fetchTasks = useCallback(async () => {
    if (!campaignId) { setTasks([]); setLoading(false); return; }
    try {
      const data = await apiFetch(`/campaigns/${campaignId}/tasks`);
      setTasks(data);
      LS.set(lsKey, data);
    } catch {
      const cached = LS.get(lsKey, SEED_TASKS.filter(t => t.campaignId === campaignId));
      setTasks(cached);
    } finally {
      setLoading(false);
    }
  }, [campaignId, lsKey]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = useCallback(async (payload) => {
    try {
      const created = await apiFetch(`/campaigns/${campaignId}/tasks`, { method: 'POST', body: payload });
      setTasks(prev => {
        const next = [...prev, created];
        LS.set(lsKey, next);
        return next;
      });
      return created;
    } catch {
      const created = { ...payload, id: 'local-' + Date.now(), campaignId, createdAt: new Date().toISOString() };
      setTasks(prev => {
        const next = [...prev, created];
        LS.set(lsKey, next);
        return next;
      });
      return created;
    }
  }, [campaignId, lsKey]);

  const updateTask = useCallback(async (id, payload) => {
    try {
      const updated = await apiFetch(`/tasks/${id}`, { method: 'PUT', body: payload });
      setTasks(prev => {
        const next = prev.map(t => t.id === id ? updated : t);
        LS.set(lsKey, next);
        return next;
      });
      return updated;
    } catch {
      setTasks(prev => {
        const next = prev.map(t => t.id === id ? { ...t, ...payload } : t);
        LS.set(lsKey, next);
        return next;
      });
    }
  }, [lsKey]);

  const deleteTask = useCallback(async (id) => {
    try { await apiFetch(`/tasks/${id}`, { method: 'DELETE' }); } catch { /* offline */ }
    setTasks(prev => {
      const next = prev.filter(t => t.id !== id);
      LS.set(lsKey, next);
      return next;
    });
  }, [lsKey]);

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask };
}
