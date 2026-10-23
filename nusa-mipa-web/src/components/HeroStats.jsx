import React from 'react';
import { Database, TrendingUp, Globe2, Target, CheckCircle2 } from 'lucide-react';

export default function HeroStats({ summary }) {
  if (!summary) return null;

  return (
    <section style={{ paddingTop: '20px', paddingBottom: '12px' }}>
      <div className="container">
        {/* Executive Banner Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '16px'
        }}>
          <div style={{ maxWidth: '860px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              lineHeight: 1.25
            }}>
              Pusat Intelijen Spasial &amp; Simulator Preskriptif Numerasi Menuju Education 5.0
            </h1>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px', lineHeight: 1.5 }}>
              Mendiagnosis 2.056 unit observasi pendidikan (514 kab/kota × 4 jenjang), mengungkap anomali <i>vocational paradox</i>, dan menguji dampak intervensi anggaran daerah secara preskriptif bebas bias perdesaan-perkotaan.
            </p>
          </div>

          {/* Quick Scope Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            padding: '8px 14px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
            <div style={{ fontSize: '12px', color: '#334155' }}>
              Cakupan: <b>514 Kab/Kota (38 Provinsi)</b>
            </div>
          </div>
        </div>

        {/* 4 Bento KPI Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '14px'
        }}>
          {/* Card 1: Observasi Master Data */}
          <div className="bento-card" style={{ padding: '16px 18px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
                Master Observasi
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                <Database size={15} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#0F172A' }}>
                2.056
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '1px 6px', borderRadius: '4px' }}>
                100% Definitif
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
              514 Daerah × 4 Jenjang (SD, SMP, SMA, SMK) bebas tebakan imputasi.
            </p>
          </div>

          {/* Card 2: Disparitas Jawa vs Luar Jawa */}
          <div className="bento-card" style={{ padding: '16px 18px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
                Disparitas Pulau
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                <TrendingUp size={15} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#D97706' }}>
                +15.85
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', background: '#FEF3C7', padding: '1px 6px', borderRadius: '4px' }}>
                Gap SD Jawa
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
              Jawa (65.45) vs Luar Jawa (49.60). Menyempit drastis di SMK (+0.35 pt).
            </p>
          </div>

          {/* Card 3: Autokorelasi Spasial Moran's I */}
          <div className="bento-card" style={{ padding: '16px 18px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
                Hukum Tobler Geografi
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                <Globe2 size={15} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#059669' }}>
                +0.624
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#065F46', background: '#D1FAE5', padding: '1px 6px', borderRadius: '4px' }}>
                p = 0.005
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
              Dependensi spasial masif di SD-SMA. SMK membuktikan <i>Vocational Paradox</i>.
            </p>
          </div>

          {/* Card 4: Potensi Skenario E */}
          <div className="bento-card" style={{ padding: '16px 18px', background: '#FFFFFF', border: '1px solid #BFDBFE' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.04em' }}>
                Potensi Skenario E
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                <Target size={15} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#2563EB' }}>
                +6.63
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                97.3% Positif
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
              Lonjakan tertinggi di Kluster 2 Paradoks (+7.42 pt) dan 3T (+6.19 pt).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
