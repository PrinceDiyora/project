import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch, LS } from '../utils/helpers';
import { SEED_CAMPAIGNS, SEED_TEAM } from '../utils/seed';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  // ── Campaigns ────────────────────────────────────────────
  const fetchCampaigns = useCallback(async () => {
    try {
      const data = await apiFetch('/campaigns');
      setCampaigns(data);
      LS.set('campaigns', data);
      setOffline(false);
    } catch {
      const cached = LS.get('campaigns', SEED_CAMPAIGNS);
      setCampaigns(cached);
      setOffline(true);
    }
  }, []);

  const createCampaign = useCallback(async (payload) => {
    try {
      const created = await apiFetch('/campaigns', { method: 'POST', body: payload });
      setCampaigns(prev => {
        const next = [...prev, created];
        LS.set('campaigns', next);
        return next;
      });
      return created;
    } catch {
      const created = { ...payload, id: 'local-' + Date.now(), createdAt: new Date().toISOString() };
      setCampaigns(prev => {
        const next = [...prev, created];
        LS.set('campaigns', next);
        return next;
      });
      return created;
    }
  }, []);

  const updateCampaign = useCallback(async (id, payload) => {
    try {
      const updated = await apiFetch(`/campaigns/${id}`, { method: 'PUT', body: payload });
      setCampaigns(prev => {
        const next = prev.map(c => c.id === id ? updated : c);
        LS.set('campaigns', next);
        return next;
      });
      return updated;
    } catch {
      setCampaigns(prev => {
        const next = prev.map(c => c.id === id ? { ...c, ...payload } : c);
        LS.set('campaigns', next);
        return next;
      });
    }
  }, []);

  const deleteCampaign = useCallback(async (id) => {
    try {
      await apiFetch(`/campaigns/${id}`, { method: 'DELETE' });
    } catch { /* offline */ }
    setCampaigns(prev => {
      const next = prev.filter(c => c.id !== id);
      LS.set('campaigns', next);
      return next;
    });
  }, []);

  // ── Team ────────────────────────────────────────────────
  const fetchTeam = useCallback(async () => {
    try {
      const data = await apiFetch('/team');
      setTeamMembers(data);
      LS.set('team', data);
    } catch {
      const cached = LS.get('team', SEED_TEAM);
      setTeamMembers(cached);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchCampaigns(), fetchTeam()]).finally(() => setLoading(false));
  }, [fetchCampaigns, fetchTeam]);

  return (
    <AppContext.Provider value={{
      campaigns, teamMembers, loading, offline,
      fetchCampaigns, createCampaign, updateCampaign, deleteCampaign,
      fetchTeam,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
