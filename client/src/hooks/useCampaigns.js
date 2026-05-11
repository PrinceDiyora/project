import { useApp } from '../context/AppContext';

export function useCampaigns() {
  const { campaigns, loading, offline, fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } = useApp();
  return { campaigns, loading, offline, fetchCampaigns, createCampaign, updateCampaign, deleteCampaign };
}
