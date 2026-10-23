import React, { useState, useMemo } from 'react';
import NusaMipaLogo from './NusaMipaLogo';
import { 
  Compass, ArrowUpRight, Database, Layers, Sliders, BarChart3, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Award, FileText, 
  Code, ChevronDown, Sparkles, AlertTriangle, TrendingUp, Cpu, 
  MapPin, HelpCircle, Activity, ExternalLink
} from 'lucide-react';

export default function LandingPage({ 
  districtsData, 
  nationalSummary, 
  onOpenDashboard, 
  onOpenResearch, 
  onOpenBrief 
}) {
  const districtList = useMemo(() => {
    return Object.entries(districtsData || {}).map(([key, data]) => ({
      key,
      name: data.nama_kabupaten_kota,
      province: data.nama_provinsi,
      clusterId: data.cluster_id,
      clusterTag: data.cluster_tag,
      clusterColor: data.cluster_color,
      levels: data.levels,
      ipo: data.ipo_dimensions,
      learningLoss: data.learning_loss
    }));
  }, [districtsData]);

  // Section 4 Quick Simulator State
  const defaultDistrict = districtList.find(d => d.name.includes('Sidoarjo')) || districtList[0] || {};
  const [selectedDistrictKey, setSelectedDistrictKey] = useState(defaultDistrict.key || '');
  const [selectedLevel, setSelectedLevel] = useState('SMP');
  const [modelType, setModelType] = useState('monotonic'); // 'monotonic' vs 'unconstrained'
  const [selectedScenario, setSelectedScenario] = useState('E'); // A, B, C, D, E

  const activeDistrict = districtsData?.[selectedDistrictKey] || defaultDistrict;
  const levelData = activeDistrict?.levels?.[selectedLevel] || {};

  // Projected delta Y calculation based on PRD specifications
  const projectedImpact = useMemo(() => {
    const isMonotonic = modelType === 'monotonic';
    const cluster = activeDistrict?.cluster_id || 1;

    if (selectedScenario === 'A') {
      return {
        delta: cluster === 3 ? '+0.508' : '+0.049',
        isPositive: true,
        desc: 'Intervensi Pedagogi (D.1 +12 poin) di Ruang Kelas'
      };
    } else if (selectedScenario === 'B') {
      if (isMonotonic) {
        return {
          delta: '+0.717',
          isPositive: true,
          desc: 'Pengurangan Kepadatan Kelas (-5 Siswa/Rombel) Bebas Confounding'
        };
      } else {
        return {
          delta: '-0.257',
          isPositive: false,
          desc: 'Peringatan: Terjebak Urban Confounding (mengurangi kelas diprediksi menurunkan skor!)'
        };
      }
    } else if (selectedScenario === 'C') {
      if (isMonotonic) {
        return {
          delta: '+1.281',
          isPositive: true,
          desc: 'Pemerataan Guru Bersertifikasi (+15%) & Reduksi STR (-3)'
        };
      } else {
        return {
          delta: '-0.084',
          isPositive: false,
          desc: 'Peringatan: Model standar gagal menangkap arah kausalitas sertifikasi guru!'
        };
      }
    } else if (selectedScenario === 'D') {
      return {
        delta: cluster === 2 ? '+5.995' : '+4.903',
        isPositive: true,
        desc: 'Afirmasi Sarpras Fisik, Elektrifikasi & Internet ≥ 98%'
      };
    } else {
      // Skenario E: Paket Terpadu Education 5.0
      let d = '+6.800';
      if (cluster === 2) d = '+7.606';
      if (cluster === 3) d = '+6.313';
      if (cluster === 1) d = '+6.086';
      return {
        delta: d,
        isPositive: true,
        desc: 'Paket Terpadu Education 5.0 (Integrasi Skenario A+B+C+D)'
      };
    }
  }, [modelType, selectedScenario, activeDistrict]);

  const handleDeepLinkToDashboard = () => {
    onOpenDashboard({
      tab: 'diagnostic',
      districtKey: selectedDistrictKey,
      level: selectedLevel,
      scenario: selectedScenario
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF8F5',
      color: '#141413',
      fontFamily: 'var(--font-sans)',
      overflowX: 'hidden'
    }}>
      {/* =========================================================================
          SECTION 1: Minimalist Sticky Navbar
          ========================================================================= */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(250, 248, 245, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E1D8',
        transition: 'all 0.2s ease'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
          gap: '16px'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <NusaMipaLogo height={32} showSubtitle={false} />
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              background: '#DCFCE7',
              color: '#15803D',
              border: '1px solid #BBF7D0',
              padding: '3px 9px',
              borderRadius: '9999px',
              letterSpacing: '0.04em'
            }}>
              UNESA • DIMAS-TI 2026
            </span>
          </div>

          {/* Anchor Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }} className="hidden md:flex">
            <a href="#latar-belakang" style={{ fontSize: '12px', fontWeight: 700, color: '#52525B', textDecoration: 'none', letterSpacing: '0.03em' }}>
              LATAR BELAKANG
            </a>
            <a href="#inovasi-metode" style={{ fontSize: '12px', fontWeight: 700, color: '#52525B', textDecoration: 'none', letterSpacing: '0.03em' }}>
              INOVASI METODE
            </a>
            <a href="#cek-daerah" style={{ fontSize: '12px', fontWeight: 700, color: '#52525B', textDecoration: 'none', letterSpacing: '0.03em' }}>
              CEK DAERAH
            </a>
            <a href="#temuan-utama" style={{ fontSize: '12px', fontWeight: 700, color: '#52525B', textDecoration: 'none', letterSpacing: '0.03em' }}>
              TEMUAN UTAMA
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onOpenResearch('flowchart')}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid #D4CEBF',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#141413',
                transition: 'all 0.2s'
              }}
              title="Lihat Bukti Riset & Metodologi"
            >
              <FileText size={16} />
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid #D4CEBF',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#141413',
                textDecoration: 'none'
              }}
              title="Repositori GitHub Riset"
            >
              <Code size={16} />
            </a>

            <button
              onClick={() => onOpenDashboard({ tab: 'spatial' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#141413',
                color: '#FAF8F5',
                padding: '10px 20px',
                borderRadius: '9999px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(20, 20, 19, 0.15)',
                transition: 'transform 0.15s ease'
              }}
            >
              <span>BUKA DASHBOARD</span>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowUpRight size={13} color="#FFFFFF" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SECTION 2: Editorial Hero Section & Trust Strip
          ========================================================================= */}
      <section style={{
        paddingTop: '64px',
        paddingBottom: '48px',
        background: 'linear-gradient(180deg, #FAF8F5 0%, #F3E9D7 80%, #FAF8F5 100%)',
        position: 'relative'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '1040px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E2D9C8',
            borderRadius: '9999px',
            padding: '4px 14px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#15803D',
            marginBottom: '24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }}></span>
            <span>DATA MINING DIMAS-TI 2026 · FMIPA UNIVERSITAS NEGERI SURABAYA</span>
          </div>

          {/* Giant Display Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 68px)',
            fontWeight: 800,
            color: '#141413',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '24px'
          }}>
            Data{' '}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              border: '2px solid #E4DFD5',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              verticalAlign: 'middle',
              margin: '0 8px',
              fontSize: 'clamp(14px, 2vw, 22px)',
              fontWeight: 700,
              color: '#141413',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563EB' }} title="Klaster 1 Benchmark" />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D97706' }} title="Klaster 2 Paradoks" />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EA580C' }} title="Klaster 3 Afirmasi 3T" />
              <span style={{ fontSize: '13px', color: '#52525B', marginLeft: '4px', whiteSpace: 'nowrap' }}>3 Klaster · 514 Daerah</span>
            </span>{' '}
            MIPA.
            <br />
            Menuju Education 5.0.
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)',
            color: '#52525B',
            lineHeight: 1.6,
            maxWidth: '780px',
            margin: '0 auto 36px auto'
          }}>
            Platform Sistem Cerdas Pemetaan Spasial-Klaster, Ekonometrika Multiskala (MGWR), dan Simulator Kebijakan Preskriptif Berbasis Explainable AI untuk 514 Kabupaten/Kota di Indonesia.
          </p>

          {/* Dual Action Buttons (CTA) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '56px'
          }}>
            <button
              onClick={() => onOpenDashboard({ tab: 'simulator', scenario: 'E' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#22C55E',
                color: '#FFFFFF',
                padding: '14px 30px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(34, 197, 94, 0.35)',
                transition: 'all 0.2s'
              }}
            >
              <span>JALANKAN SIMULATOR</span>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowUpRight size={14} color="#FFFFFF" />
              </div>
            </button>

            <button
              onClick={() => onOpenDashboard({ tab: 'spatial' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#FFFFFF',
                color: '#141413',
                padding: '14px 28px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 700,
                border: '1.5px solid #D4CEBF',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s'
              }}
            >
              <span>EKSPLORASI PETA 514 DAERAH</span>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#F4F1EA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowUpRight size={14} color="#141413" />
              </div>
            </button>
          </div>

          {/* Bottom Divider Trust Strip */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2D9C8',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#141413' }}>
              <Database size={15} color="#22C55E" />
              <span>CAKUPAN RISET: 2.056 UNIT (0% MISSING)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', color: '#52525B', fontSize: '11px', fontWeight: 600 }}>
              <span style={{ background: '#F4F1EA', padding: '3px 8px', borderRadius: '6px' }}>DAPODIK 2025</span>
              <span>•</span>
              <span style={{ background: '#F4F1EA', padding: '3px 8px', borderRadius: '6px' }}>RAPOR PENDIDIKAN (SULINGJAR)</span>
              <span>•</span>
              <span style={{ background: '#F4F1EA', padding: '3px 8px', borderRadius: '6px' }}>MGWR (R² 0,763)</span>
              <span>•</span>
              <span style={{ background: '#F4F1EA', padding: '3px 8px', borderRadius: '6px' }}>MONOTONIC LGBM (R² 0,642)</span>
            </div>

            <a href="#inovasi-metode" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#15803D', fontWeight: 700, textDecoration: 'none' }}>
              <span>GULIR KE BAWAH</span>
              <span>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 3-Column Bento Grid "Tiga Pilar Inovasi NUSA-MIPA"
          ========================================================================= */}
      <section id="inovasi-metode" style={{ padding: '80px 0', backgroundColor: '#FAF8F5' }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
            <div style={{
              display: 'inline-block',
              background: '#DCFCE7',
              color: '#15803D',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '9999px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Arsitektur Metodologi
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              fontWeight: 800,
              color: '#141413',
              lineHeight: 1.25,
              marginBottom: '14px'
            }}>
              Mengatasi Bias Spasial dan Pembaur Perkotaan Secara Menyeluruh
            </h2>
            <button
              onClick={() => onOpenResearch('flowchart')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#22C55E',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>LIHAT DIAGRAM ALIR METODE</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          {/* 3-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '24px'
          }}>
            {/* Card 1: Tipologi IPO */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px 28px',
              border: '1px solid #E8E4DA',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                  marginBottom: '20px'
                }}>
                  <Layers size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#141413', marginBottom: '10px' }}>
                  Pemetaan Tipologi IPO &amp; Transisi Jenjang
                </h3>
                <p style={{ fontSize: '13px', color: '#52525B', lineHeight: 1.6, marginBottom: '20px' }}>
                  Mengonsolidasikan 2.056 unit (SD, SMP, SMA, SMK) ke dalam 3 klaster kebijakan dengan K-Means serta mengungkap fenomena transition learning loss (-6,86 poin ke SMA dan -8,79 poin ke SMK).
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid #F1EFEA'
              }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '3px 8px', borderRadius: '6px' }}>
                    #Moran: 0,624
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#52525B', background: '#F4F1EA', padding: '3px 8px', borderRadius: '6px' }}>
                    #3KlasterIPO
                  </span>
                </div>
                <button
                  onClick={() => onOpenDashboard({ tab: 'spatial' })}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#FAF8F5',
                    border: '1px solid #D4CEBF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#141413'
                  }}
                  title="Buka Peta Spasial"
                >
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>

            {/* Card 2: MGWR Bebas Singuler */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px 28px',
              border: '1px solid #E8E4DA',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#F0FDF4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16A34A',
                  marginBottom: '20px'
                }}>
                  <Compass size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#141413', marginBottom: '10px' }}>
                  Ekonometrika Spasial MGWR Bebas Singuler
                </h3>
                <p style={{ fontSize: '13px', color: '#52525B', lineHeight: 1.6, marginBottom: '20px' }}>
                  Menyaring fitur kuasi-konstan menjadi 12 tuas ortogonal untuk menekan condition number lokal dari &gt;10⁹ menjadi 4,12, membedakan tuas berskala nasional (kj=480) dan regional (kj=85..200).
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid #F1EFEA'
              }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '3px 8px', borderRadius: '6px' }}>
                    #Comp R²: 0,766
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#52525B', background: '#F4F1EA', padding: '3px 8px', borderRadius: '6px' }}>
                    #OOF R²: 0,767
                  </span>
                </div>
                <button
                  onClick={() => onOpenResearch('mgwr')}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#FAF8F5',
                    border: '1px solid #D4CEBF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#141413'
                  }}
                  title="Buka Lab MGWR"
                >
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>

            {/* Card 3: Monotonic LightGBM */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px 28px',
              border: '1px solid #E8E4DA',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                  marginBottom: '20px'
                }}>
                  <Sliders size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#141413', marginBottom: '10px' }}>
                  Monotonic LightGBM &amp; TreeSHAP Simulator
                </h3>
                <p style={{ fontSize: '13px', color: '#52525B', lineHeight: 1.6, marginBottom: '20px' }}>
                  Mengunci arah turunan parsial berbasis domain (∂Ŷ/∂X ≥ 0) agar simulasi intervensi bebas dari urban confounding, dilengkapi atribusi TreeSHAP spesifik per klaster wilayah.
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid #F1EFEA'
              }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '3px 8px', borderRadius: '6px' }}>
                    #Spearman: 0,979
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#52525B', background: '#F4F1EA', padding: '3px 8px', borderRadius: '6px' }}>
                    #WhatIfEngine
                  </span>
                </div>
                <button
                  onClick={() => onOpenDashboard({ tab: 'simulator' })}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#FAF8F5',
                    border: '1px solid #D4CEBF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#141413'
                  }}
                  title="Buka Simulator What-If"
                >
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Interactive Glassmorphism Banner & Quick Simulator Widget
          ========================================================================= */}
      <section id="cek-daerah" style={{ padding: '40px 0 80px 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)',
            borderRadius: '32px',
            padding: ' clamp(24px, 4vw, 44px)',
            color: '#FAF8F5',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'center'
            }}>
              {/* Left Column: Interactive Form Controls */}
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#4ADE80',
                  marginBottom: '16px'
                }}>
                  <Activity size={12} />
                  <span>WIDGET INTERAKTIF DAERAH</span>
                </div>

                <h2 style={{
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  fontWeight: 800,
                  lineHeight: 1.25,
                  marginBottom: '12px',
                  color: '#FFFFFF'
                }}>
                  Cek Diagnostik &amp; Simulasi Cepat Daerah Anda
                </h2>
                <p style={{ fontSize: '13px', color: '#A1A1AA', lineHeight: 1.5, marginBottom: '24px' }}>
                  Pilih kabupaten/kota dan buktikan keunggulan model Monotonic LightGBM dibanding model regresi standar yang terjebak bias perkotaan.
                </p>

                {/* Input 1: Dropdown Daerah */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#D4D4D8', marginBottom: '6px' }}>
                    1. PILIH KABUPATEN / KOTA (514 DAERAH):
                  </label>
                  <select
                    value={selectedDistrictKey}
                    onChange={(e) => setSelectedDistrictKey(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                      fontWeight: 600
                    }}
                  >
                    {districtList.map(d => (
                      <option key={d.key} value={d.key} style={{ background: '#18181B', color: '#FFFFFF' }}>
                        {d.name} ({d.province})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input 2: Segmented Pill Toggle Jenjang */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#D4D4D8', marginBottom: '6px' }}>
                    2. PILIH JENJANG PENDIDIKAN:
                  </label>
                  <div style={{
                    display: 'inline-flex',
                    background: 'rgba(255, 255, 255, 0.06)',
                    padding: '4px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    gap: '4px'
                  }}>
                    {['SD', 'SMP', 'SMA', 'SMK'].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedLevel(lvl)}
                        style={{
                          padding: '6px 16px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: selectedLevel === lvl ? '#22C55E' : 'transparent',
                          color: selectedLevel === lvl ? '#FFFFFF' : '#A1A1AA',
                          transition: 'all 0.15s'
                        }}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input 3: Model Toggle */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#D4D4D8', marginBottom: '6px' }}>
                    3. PILIH ENGINE PREDIKSI:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setModelType('monotonic')}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: modelType === 'monotonic' ? '1.5px solid #22C55E' : '1px solid rgba(255,255,255,0.1)',
                        background: modelType === 'monotonic' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.04)',
                        color: modelType === 'monotonic' ? '#4ADE80' : '#A1A1AA',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Monotonic LightGBM (Usulan NUSA-MIPA)</span>
                    </button>

                    <button
                      onClick={() => setModelType('unconstrained')}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: modelType === 'unconstrained' ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
                        background: modelType === 'unconstrained' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.04)',
                        color: modelType === 'unconstrained' ? '#F87171' : '#A1A1AA',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <AlertTriangle size={13} />
                      <span>Model Standar (Bias Urban)</span>
                    </button>
                  </div>
                </div>

                {/* Input 4: Preset 5 Skenario */}
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#D4D4D8', marginBottom: '8px' }}>
                    4. PILIH PRESET SKENARIO INTERVENSI:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      { id: 'A', name: 'A: Pedagogi' },
                      { id: 'B', name: 'B: Rombel -5' },
                      { id: 'C', name: 'C: Guru & STR' },
                      { id: 'D', name: 'D: Sarpras ≥98%' },
                      { id: 'E', name: 'E: Paket Edu 5.0' }
                    ].map(sc => (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedScenario(sc.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: selectedScenario === sc.id ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                          color: selectedScenario === sc.id ? '#141413' : '#D4D4D8',
                          border: selectedScenario === sc.id ? '1px solid #FFFFFF' : '1px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.15s'
                        }}
                      >
                        {sc.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Instant Live Preview Card */}
              <div>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '28px',
                  color: '#141413',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
                }}>
                  {/* District Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#71717A', textTransform: 'uppercase' }}>
                        Pratinjau Hasil Wilayah
                      </span>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#141413', marginTop: '2px' }}>
                        {activeDistrict.name}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#52525B' }}>
                        Provinsi {activeDistrict.province} · Jenjang {selectedLevel}
                      </p>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: activeDistrict.clusterId === 1 ? '#ECFDF5' : (activeDistrict.clusterId === 2 ? '#FFFBEB' : '#FEF2F2'),
                      color: activeDistrict.clusterId === 1 ? '#047857' : (activeDistrict.clusterId === 2 ? '#B45309' : '#B91C1C'),
                      border: `1px solid ${activeDistrict.clusterColor}`
                    }}>
                      {activeDistrict.clusterTag}
                    </span>
                  </div>

                  {/* Key Stats Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    marginBottom: '16px',
                    padding: '14px',
                    background: '#FAF8F5',
                    borderRadius: '16px',
                    border: '1px solid #EAE6DC'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#71717A', fontWeight: 600 }}>Skor Numerasi Aktual</div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#141413', marginTop: '2px' }}>
                        {levelData.numerasi_score || activeDistrict.ipo?.numerasi || 50.0}
                        <span style={{ fontSize: '12px', color: '#71717A', fontWeight: 500 }}> / 100</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: '#71717A', fontWeight: 600 }}>Akar Masalah (SHAP)</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#DC2626', marginTop: '6px' }}>
                        {activeDistrict.clusterId === 3 ? 'Keamanan & Sarpras Dasar' : (activeDistrict.clusterId === 2 ? 'Kualitas Guru & Ruang Kelas' : 'Beban Kurikulum')}
                      </div>
                    </div>
                  </div>

                  {/* Projected Impact Box */}
                  <div style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: projectedImpact.isPositive ? '#F0FDF4' : '#FEF2F2',
                    border: projectedImpact.isPositive ? '1px solid #BBF7D0' : '1px solid #FECACA',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: projectedImpact.isPositive ? '#166534' : '#991B1B' }}>
                        Estimasi Kenaikan Skor (ΔŶ Skenario {selectedScenario}):
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '22px',
                        fontWeight: 800,
                        color: projectedImpact.isPositive ? '#15803D' : '#DC2626'
                      }}>
                        {projectedImpact.delta} poin
                      </span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: projectedImpact.isPositive ? '#166534' : '#991B1B', margin: 0, lineHeight: 1.4 }}>
                      {projectedImpact.desc}
                    </p>
                  </div>

                  {/* Deep Link Action Button */}
                  <button
                    onClick={handleDeepLinkToDashboard}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: '#22C55E',
                      color: '#FFFFFF',
                      padding: '14px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>BUKA ANALISIS LENGKAP DAERAH INI DI DASHBOARD</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: 4-Column Visual Cards "Sorotan Temuan Empiris Nasional"
          ========================================================================= */}
      <section id="temuan-utama" style={{ padding: '40px 0 80px 0', backgroundColor: '#FAF8F5' }}>
        <div className="container">
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                background: '#DCFCE7',
                color: '#15803D',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '9999px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}>
                Bukti Empiris 2025
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3.2vw, 34px)',
                fontWeight: 800,
                color: '#141413',
                lineHeight: 1.25
              }}>
                Empat Temuan Kunci untuk Perencanaan Berbasis Data (PBD)
              </h2>
            </div>

            <button
              onClick={() => onOpenDashboard({ tab: 'table' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                border: '1.5px solid #D4CEBF',
                padding: '10px 20px',
                borderRadius: '9999px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#141413',
                cursor: 'pointer'
              }}
            >
              <span>LIHAT MATRIKS 2.056 UNIT</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* 4 Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {/* Card 1: 3 Tipologi */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #E8E4DA',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  height: '42px',
                  borderRadius: '10px',
                  background: 'linear-gradient(90deg, #10B981 48%, #F59E0B 46%, #E11D48 6%)',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}>
                  48% Maju • 46% Paradoks • 6% 3T
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#141413', marginBottom: '8px' }}>
                  Jurang Spasial &amp; 3 Tipologi Nasional
                </h3>
                <p style={{ fontSize: '12.5px', color: '#52525B', lineHeight: 1.5 }}>
                  Memetakan Klaster 1 Benchmark (48,1%; skor 63,57), Klaster 2 Paradoks Sarpras (46,1%; skor 53,27), dan Klaster 3 Afirmasi 3T (5,8%; skor 38,29) dengan gap Jawa vs Luar Jawa mencapai +15,85 poin di SD.
                </p>
              </div>

              <button
                onClick={() => onOpenDashboard({ tab: 'spatial' })}
                style={{
                  marginTop: '18px',
                  background: 'none',
                  border: 'none',
                  color: '#22C55E',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <span>Eksplorasi Peta Klaster</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

            {/* Card 2: Learning Loss */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #E8E4DA',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  height: '42px',
                  borderRadius: '10px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1D4ED8',
                  fontSize: '11.5px',
                  fontWeight: 800
                }}>
                  SMP 63,9 → SMA 57,1 (-6,86 Poin)
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#141413', marginBottom: '8px' }}>
                  Fenomena Transition Learning Loss
                </h3>
                <p style={{ fontSize: '12.5px', color: '#52525B', lineHeight: 1.5 }}>
                  Numerasi melonjak +10,62 poin dari SD ke SMP, namun merosot tajam -6,86 poin saat memasuki SMA (melanda 78,2% daerah) dan anjlok -8,79 poin pada jenjang SMK akibat jam praktik bengkel.
                </p>
              </div>

              <button
                onClick={() => onOpenDashboard({ tab: 'spatial' })}
                style={{
                  marginTop: '18px',
                  background: 'none',
                  border: 'none',
                  color: '#22C55E',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <span>Inspeksi Grafik Transisi</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

            {/* Card 3: Keamanan 3T */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #E8E4DA',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  height: '42px',
                  borderRadius: '10px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B91C1C',
                  fontSize: '11.5px',
                  fontWeight: 800
                }}>
                  Sensitivitas Keamanan 3T: 3,10 Poin (4x)
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#141413', marginBottom: '8px' }}>
                  Sensitivitas Iklim Keamanan di 3T
                </h3>
                <p style={{ fontSize: '12.5px', color: '#52525B', lineHeight: 1.5 }}>
                  Di Klaster 3 (Afirmasi 3T), sensitivitas Iklim Keamanan D.4 melonjak hampir 4x lipat (3,10 poin) dan Kebinekaan D.8 melonjak 7x lipat (2,31 poin) membuktikan pentingnya rasa aman sebelum kurikulum digital.
                </p>
              </div>

              <button
                onClick={() => onOpenDashboard({ tab: 'diagnostic' })}
                style={{
                  marginTop: '18px',
                  background: 'none',
                  border: 'none',
                  color: '#22C55E',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <span>Lihat Diagnostik XAI 3T</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

            {/* Card 4: Paradoks SMK */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #E8E4DA',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  height: '42px',
                  borderRadius: '10px',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B45309',
                  fontSize: '11.5px',
                  fontWeight: 800
                }}>
                  Moran's I SMK: 0,0625 (Sebaran Acak)
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#141413', marginBottom: '8px' }}>
                  Anomali Paradoks Vokasi SMK
                </h3>
                <p style={{ fontSize: '12.5px', color: '#52525B', lineHeight: 1.5 }}>
                  Autokorelasi spasial jenjang SMK runtuh mendekati sebaran acak (Moran's I = 0,0625), membuktikan bahwa mutu vokasi tidak mengikuti jarak geografis, melainkan aglomerasi industri dan kemitraan lokal.
                </p>
              </div>

              <button
                onClick={() => onOpenDashboard({ tab: 'diagnostic' })}
                style={{
                  marginTop: '18px',
                  background: 'none',
                  border: 'none',
                  color: '#22C55E',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <span>Analisis Paradoks SMK</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: Footer & Kredibilitas Tim Peneliti
          ========================================================================= */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E1D8',
        padding: '60px 0 32px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '36px',
            marginBottom: '48px'
          }}>
            {/* Col 1: Affiliation */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <NusaMipaLogo height={32} showSubtitle={false} />
                <span style={{ fontSize: '10px', fontWeight: 700, background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '6px' }}>
                  VERSION 5.0
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#52525B', lineHeight: 1.6, marginBottom: '16px' }}>
                Sistem Pendukung Keputusan Spasial &amp; Simulator Preskriptif Numerasi Menuju Education 5.0.
              </p>
              <div style={{ fontSize: '12px', color: '#71717A' }}>
                <b>Tim Peneliti Sains Data, FMIPA Universitas Negeri Surabaya:</b>
                <div style={{ marginTop: '4px', color: '#141413', fontWeight: 600 }}>
                  Horasio Nissi Immanuel · Muhammad Habib Nur Aiman · Ulfa Siti Nuraini
                </div>
                <div style={{ color: '#71717A', marginTop: '4px', fontSize: '11.5px' }}>
                  Divisi Penambangan Data (Data Mining) — DIMAS-TI AMLI 2026 (Universitas Negeri Gorontalo)
                </div>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#141413', marginBottom: '14px' }}>
                Tautan Cepat &amp; Dokumen
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <li>
                  <button
                    onClick={() => onOpenDashboard({ tab: 'spatial' })}
                    style={{ background: 'none', border: 'none', padding: 0, color: '#52525B', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
                  >
                    Buka Dashboard Peta Spasial ↗
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenDashboard({ tab: 'simulator' })}
                    style={{ background: 'none', border: 'none', padding: 0, color: '#52525B', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
                  >
                    Simulator Kebijakan What-If ↗
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenResearch('flowchart')}
                    style={{ background: 'none', border: 'none', padding: 0, color: '#52525B', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
                  >
                    Bagan Alir Metodologi (Landscape) ↗
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenResearch('mgwr')}
                    style={{ background: 'none', border: 'none', padding: 0, color: '#52525B', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
                  >
                    Bukti Ekonometrika MGWR &amp; ML ↗
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Institutional Trust */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#141413', marginBottom: '14px' }}>
                Integritas &amp; Sumber Data
              </h4>
              <p style={{ fontSize: '12px', color: '#52525B', lineHeight: 1.6, marginBottom: '14px' }}>
                Diverifikasi terhadap 2.056 unit data resmi Kemendikbudristek RI (Dapodikdasmen, Rapor Pendidikan, Sulingjar 2025) dan Laporan PISA 2025 OECD.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', background: '#FAF8F5', border: '1px solid #E2D9C8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                  0% Missing Values
                </span>
                <span style={{ fontSize: '11px', background: '#FAF8F5', border: '1px solid #E2D9C8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                  Dual Spatial CV
                </span>
                <span style={{ fontSize: '11px', background: '#FAF8F5', border: '1px solid #E2D9C8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                  TreeSHAP XAI
                </span>
              </div>
            </div>
          </div>

          {/* Copyright Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: '1px solid #F1EFEA',
            fontSize: '11.5px',
            color: '#71717A',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              © 2026 Tim NUSA-MIPA · FMIPA Universitas Negeri Surabaya. Seluruh hak cipta dilindungi.
            </div>
            <div>
              Dikembangkan untuk Kompetisi DIMAS-TI AMLI 2026 (Universitas Negeri Gorontalo)
            </div>
          </div>
        </div>

        {/* Massive Transparent Watermark */}
        <div style={{
          position: 'absolute',
          bottom: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(54px, 12vw, 130px)',
          fontWeight: 900,
          color: 'rgba(20, 20, 19, 0.03)',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 1,
          fontFamily: 'var(--font-display)'
        }}>
          NUSA-MIPA 5.0
        </div>
      </footer>
    </div>
  );
}
