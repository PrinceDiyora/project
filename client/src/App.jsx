import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import CampaignList from './pages/CampaignList';
import CampaignDetail from './pages/CampaignDetail';
import Workload from './pages/Workload';
import ClientDashboard from './pages/ClientDashboard';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/campaigns" replace />} />
          <Route path="/campaigns" element={<Layout><CampaignList /></Layout>} />
          <Route path="/campaigns/:id" element={<Layout><CampaignDetail /></Layout>} />
          <Route path="/workload" element={<Layout><Workload /></Layout>} />
          <Route path="/client/:clientName" element={<ClientDashboard />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
