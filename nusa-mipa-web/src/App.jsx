import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroStats from './components/HeroStats';
import SpatialExplorer from './components/SpatialExplorer';
import DiagnosticSection from './components/DiagnosticSection';
import WhatIfSimulator from './components/WhatIfSimulator';
import NationalTable from './components/NationalTable';
import ResearchModal from './components/ResearchModal';
import PolicyBriefModal from './components/PolicyBriefModal';
import LandingPage from './components/LandingPage';

import districtsData from './data/districts_master.json';
import nationalSummary from './data/national_summary.json';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [activeTab, setActiveTab] = useState('spatial'); // spatial, diagnostic, simulator, table
  const [researchSubTab, setResearchSubTab] = useState('flowchart');
  
  // Default selected district: Kab. Sidoarjo (Jawa Timur) or first available
  const initialKeys = Object.keys(districtsData);
  const defaultKey = initialKeys.find(k => k.includes('Sidoarjo')) || initialKeys[0];
  const [selectedDistrictKey, setSelectedDistrictKey] = useState(defaultKey);

  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  const currentDistrict = districtsData[selectedDistrictKey] || districtsData[initialKeys[0]];

  // Support URL Parameters for deep-linking
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const tabParam = params.get('tab');
      const kabParam = params.get('kab') || params.get('id');

      if (viewParam === 'dashboard' || tabParam) {
        setCurrentView('dashboard');
        if (tabParam) {
          if (tabParam === 'spatial-map') setActiveTab('spatial');
          else if (tabParam === 'mgwr-lab') {
            setActiveTab('spatial');
            setResearchSubTab('mgwr');
            setIsResearchOpen(true);
          } else if (tabParam === 'pbd-matrix') setActiveTab('table');
          else setActiveTab(tabParam);
        }
      }

      if (kabParam) {
        const match = initialKeys.find(k => k.toLowerCase().includes(kabParam.toLowerCase()));
        if (match) setSelectedDistrictKey(match);
      }
    } catch (e) {
      console.warn('URL parsing notice:', e);
    }
  }, []);

  const handleOpenDashboard = ({ tab = 'spatial', districtKey, scenario, level } = {}) => {
    setCurrentView('dashboard');
    if (tab === 'spatial-map') setActiveTab('spatial');
    else if (tab === 'mgwr-lab') {
      setActiveTab('spatial');
      setResearchSubTab('mgwr');
      setIsResearchOpen(true);
    } else if (tab === 'pbd-matrix') setActiveTab('table');
    else setActiveTab(tab);

    if (districtKey) setSelectedDistrictKey(districtKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenResearchWithSubtab = (subTab = 'flowchart') => {
    setResearchSubTab(subTab);
    setIsResearchOpen(true);
  };

  const handleSelectAndExplore = (key) => {
    setSelectedDistrictKey(key);
    setActiveTab('spatial');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleNavigateToDiagnostic = () => {
    setActiveTab('diagnostic');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleNavigateToSimulator = () => {
    setActiveTab('simulator');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {currentView === 'landing' ? (
        /* ==================== VIEW 1: EXECUTIVE LANDING PAGE ==================== */
        <LandingPage
          districtsData={districtsData}
          nationalSummary={nationalSummary}
          onOpenDashboard={handleOpenDashboard}
          onOpenResearch={handleOpenResearchWithSubtab}
          onOpenBrief={() => setIsBriefOpen(true)}
        />
      ) : (
        /* ==================== VIEW 2: MAIN WORKBENCH DASHBOARD ==================== */
        <>
          {/* 1. Global Navigation Bar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenResearch={() => handleOpenResearchWithSubtab('flowchart')}
            onReturnToLanding={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* 2. Hero KPI Stats Banner */}
          <HeroStats summary={nationalSummary} />

          {/* 3. Dynamic Tab Content */}
          <main style={{ flex: 1 }}>
            {activeTab === 'spatial' && (
              <SpatialExplorer
                districtsData={districtsData}
                selectedDistrictKey={selectedDistrictKey}
                setSelectedDistrictKey={setSelectedDistrictKey}
                onNavigateToDiagnostic={handleNavigateToDiagnostic}
                onNavigateToSimulator={handleNavigateToSimulator}
                onOpenBrief={() => setIsBriefOpen(true)}
              />
            )}

            {activeTab === 'diagnostic' && (
              <DiagnosticSection
                selectedDistrict={currentDistrict}
                onNavigateToSimulator={handleNavigateToSimulator}
                onOpenBrief={() => setIsBriefOpen(true)}
              />
            )}

            {activeTab === 'simulator' && (
              <WhatIfSimulator
                selectedDistrict={currentDistrict}
                scenariosList={nationalSummary.scenarios_performance}
              />
            )}

            {activeTab === 'table' && (
              <NationalTable
                districtsData={districtsData}
                selectedDistrictKey={selectedDistrictKey}
                setSelectedDistrictKey={setSelectedDistrictKey}
                onSelectAndExplore={handleSelectAndExplore}
                onOpenBrief={(key) => {
                  if (key) setSelectedDistrictKey(key);
                  setIsBriefOpen(true);
                }}
              />
            )}
          </main>

          {/* 4. Global Footer */}
          <footer style={{
            background: '#FFFFFF',
            borderTop: '1px solid var(--border-color)',
            padding: '24px 0',
            marginTop: '32px',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <b style={{ color: 'var(--text-primary)' }}>NUSA-MIPA Platform</b> · Spatial Decision Support System &amp; Prescriptive Numeracy Simulator
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
                  Divisi Penambangan Data (Data Mining) — DIMAS-TI AMLI 2026 (Universitas Negeri Gorontalo)
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button 
                  onClick={() => {
                    setCurrentView('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                >
                  Kembali ke Beranda
                </button>
                <span>·</span>
                <button onClick={() => handleOpenResearchWithSubtab('flowchart')} style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  Bukti Ekonometrika &amp; Machine Learning
                </button>
                <span>·</span>
                <span>Universitas Negeri Surabaya (UNESA)</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Shared Modals accessible from both Landing Page and Dashboard */}
      <ResearchModal
        isOpen={isResearchOpen}
        onClose={() => setIsResearchOpen(false)}
        initialSubTab={researchSubTab}
      />

      <PolicyBriefModal
        isOpen={isBriefOpen}
        onClose={() => setIsBriefOpen(false)}
        district={currentDistrict}
      />
    </div>
  );
}
