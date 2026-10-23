import React from 'react';
import { Compass, Layers, Award, Sliders, BarChart2, Home } from 'lucide-react';
import NusaMipaLogo from './NusaMipaLogo';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenResearch, 
  onReturnToLanding 
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.04)',
      minHeight: '64px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        width: '100%',
        paddingTop: '8px',
        paddingBottom: '8px'
      }}>
        {/* 1. Official Brand Logo & AMLI Badge */}
        <div 
          onClick={onReturnToLanding}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            flexShrink: 0,
            cursor: onReturnToLanding ? 'pointer' : 'default'
          }}
          title={onReturnToLanding ? "Kembali ke Beranda / Landing Page NUSA-MIPA" : "NUSA-MIPA Platform"}
        >
          <NusaMipaLogo height={32} showSubtitle={false} />
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            background: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE',
            padding: '3px 8px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap'
          }}>
            DIMAS-TI 2026
          </span>
        </div>

        {/* 2. Unified Segmented Navigation Pills (Center) - Never Shrinks, Never Clips */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          background: '#F1F5F9',
          padding: '4px',
          borderRadius: '9999px',
          gap: '2px',
          border: '1px solid #E2E8F0',
          flexShrink: 0
        }}>
          {onReturnToLanding && (
            <button
              onClick={onReturnToLanding}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '9999px',
                background: 'transparent',
                color: '#475569',
                border: '1px solid transparent',
                whiteSpace: 'nowrap'
              }}
              title="Kembali ke Landing Page Utama"
            >
              <Home size={14} color="#64748B" />
              Beranda
            </button>
          )}

          <button
            onClick={() => setActiveTab('spatial')}
            className="btn"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: activeTab === 'spatial' ? 700 : 600,
              borderRadius: '9999px',
              background: activeTab === 'spatial' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'spatial' ? '#1D4ED8' : '#475569',
              boxShadow: activeTab === 'spatial' ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none',
              border: activeTab === 'spatial' ? '1px solid #E2E8F0' : '1px solid transparent',
              whiteSpace: 'nowrap'
            }}
          >
            <Compass size={14} color={activeTab === 'spatial' ? '#2563EB' : '#64748B'} />
            Peta Spasial
          </button>

          <button
            onClick={() => setActiveTab('diagnostic')}
            className="btn"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: activeTab === 'diagnostic' ? 700 : 600,
              borderRadius: '9999px',
              background: activeTab === 'diagnostic' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'diagnostic' ? '#1D4ED8' : '#475569',
              boxShadow: activeTab === 'diagnostic' ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none',
              border: activeTab === 'diagnostic' ? '1px solid #E2E8F0' : '1px solid transparent',
              whiteSpace: 'nowrap'
            }}
          >
            <Layers size={14} color={activeTab === 'diagnostic' ? '#2563EB' : '#64748B'} />
            Diagnosis XAI
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className="btn"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: activeTab === 'simulator' ? 700 : 600,
              borderRadius: '9999px',
              background: activeTab === 'simulator' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'simulator' ? '#1D4ED8' : '#475569',
              boxShadow: activeTab === 'simulator' ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none',
              border: activeTab === 'simulator' ? '1px solid #E2E8F0' : '1px solid transparent',
              whiteSpace: 'nowrap'
            }}
          >
            <Sliders size={14} color={activeTab === 'simulator' ? '#2563EB' : '#64748B'} />
            Simulator What-If
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className="btn"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: activeTab === 'table' ? 700 : 600,
              borderRadius: '9999px',
              background: activeTab === 'table' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'table' ? '#1D4ED8' : '#475569',
              boxShadow: activeTab === 'table' ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none',
              border: activeTab === 'table' ? '1px solid #E2E8F0' : '1px solid transparent',
              whiteSpace: 'nowrap'
            }}
          >
            <BarChart2 size={14} color={activeTab === 'table' ? '#2563EB' : '#64748B'} />
            Data 514 Daerah
          </button>
        </nav>

        {/* 3. Action Buttons (Right) - Uncluttered, Prominent & High Visibility */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={onOpenResearch}
            className="btn"
            style={{ 
              fontSize: '12.5px', 
              fontWeight: 700, 
              padding: '7px 14px', 
              borderRadius: '8px', 
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #CBD5E1',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
            title="Buka Bukti Ekonometrika MGWR, Benchmark 11 Machine Learning & 14 Gambar Publikasi"
          >
            <Award size={15} color="#2563EB" />
            <span>Bukti Riset &amp; Model</span>
          </button>
        </div>
      </div>
    </header>
  );
}
