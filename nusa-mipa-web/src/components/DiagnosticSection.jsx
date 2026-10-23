import React from 'react';
import { Target, CheckCircle2, AlertOctagon, TrendingUp, ShieldCheck, Zap, Laptop, BookOpen, UserCheck, Layers, FileCheck, Lightbulb, FileText } from 'lucide-react';

export default function DiagnosticSection({ selectedDistrict, onNavigateToSimulator, onOpenBrief }) {
  if (!selectedDistrict) return null;

  const ipo = selectedDistrict.ipo_dimensions;

  // Radar Chart helper coordinates (6 dimensions, scale 0 - 100)
  const dims = [
    { key: 'numerasi', label: '1. Numerasi MIPA', val: ipo.numerasi },
    { key: 'literasi', label: '2. Literasi Membaca', val: ipo.literasi },
    { key: 'kualitas_pembelajaran', label: '3. Pedagogi (D.1)', val: ipo.kualitas_pembelajaran },
    { key: 'iklim_sekolah', label: '4. Iklim Sekolah', val: ipo.iklim_sekolah },
    { key: 'sdm_guru', label: '5. SDM & Guru', val: ipo.sdm_guru },
    { key: 'tik_sarpras', label: '6. TIK & Sarpras', val: ipo.tik_sarpras }
  ];

  // National Benchmark values (Cluster 1 average)
  const benchVals = [68.1, 74.8, 94.4, 99.8, 63.4, 97.4];

  const centerX = 160;
  const centerY = 140;
  const radius = 95;

  const getCoordinates = (value, index, total = 6) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  };

  const districtPoints = dims.map((d, i) => {
    const { x, y } = getCoordinates(d.val, i);
    return `${x},${y}`;
  }).join(' ');

  const benchPoints = benchVals.map((v, i) => {
    const { x, y } = getCoordinates(v, i);
    return `${x},${y}`;
  }).join(' ');

  // SVG grid rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <section id="diagnostic-section" style={{ padding: '16px 0 32px 0' }}>
      <div className="container">
        {/* Module Header */}
        <div className="bento-card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                <Layers size={13} /> Modul 2: Diagnosis Preskriptif Lokal
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                Profil 6 Dimensi IPO & Atribusi Akar Masalah (XAI SHAP)
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Daerah Terpilih: <b>{selectedDistrict.nama_kabupaten_kota}</b> ({selectedDistrict.nama_provinsi})
              </span>
              <span className={`badge badge-cluster-${selectedDistrict.cluster_id}`}>
                {selectedDistrict.cluster_tag}
              </span>
            </div>
          </div>
        </div>

        {/* 3-Column Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1fr) minmax(320px, 1.2fr)',
          gap: '16px'
        }}>
          {/* Column 1: SVG Radar Chart */}
          <div className="bento-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <b style={{ fontSize: '13px', color: '#0F172A' }}>Radar 6 Dimensi IPO</b>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Skala 0 - 100</span>
            </div>

            {/* SVG Radar */}
            <svg width="320" height="270" viewBox="0 0 320 270">
              {/* Background circular/polygonal rings */}
              {rings.map((factor, rIdx) => {
                const ringPoints = dims.map((_, i) => {
                  const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                  const x = centerX + (radius * factor) * Math.cos(angle);
                  const y = centerY + (radius * factor) * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polygon
                    key={rIdx}
                    points={ringPoints}
                    fill={rIdx % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Axis lines */}
              {dims.map((_, i) => {
                const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                return <line key={i} x1={centerX} y1={centerY} x2={x} y2={y} stroke="#CBD5E1" strokeWidth="1" />;
              })}

              {/* Benchmark Series (Green Dashed) */}
              <polygon points={benchPoints} fill="rgba(16, 185, 129, 0.08)" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4,4" />

              {/* District Series (Blue Solid) */}
              <polygon points={districtPoints} fill="rgba(37, 99, 235, 0.2)" stroke="#2563EB" strokeWidth="2.5" />

              {/* Data points */}
              {dims.map((d, i) => {
                const { x, y } = getCoordinates(d.val, i);
                return <circle key={i} cx={x} cy={y} r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />;
              })}

              {/* Dimension Labels */}
              {dims.map((d, i) => {
                const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                const lx = centerX + (radius + 20) * Math.cos(angle);
                const ly = centerY + (radius + 14) * Math.sin(angle);
                const isRight = Math.cos(angle) > 0.1;
                const isLeft = Math.cos(angle) < -0.1;
                const anchor = isRight ? 'start' : (isLeft ? 'end' : 'middle');

                return (
                  <text key={i} x={lx} y={ly} fontSize="10" fontWeight="700" textAnchor={anchor} fill="#475569">
                    {d.label} ({d.val})
                  </text>
                );
              })}
            </svg>

            {/* Radar Legend */}
            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '3px', background: '#2563EB', borderRadius: '2px' }}></span>
                <span><b>{selectedDistrict.nama_kabupaten_kota}</b></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '3px', background: '#10B981', borderTop: '2px dashed #10B981' }}></span>
                <span style={{ color: '#059669' }}>Benchmark Nasional (Kluster 1)</span>
              </div>
            </div>
          </div>

          {/* Column 2: TreeSHAP Policy Drivers (Top Drivers vs Penalties) */}
          <div className="bento-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <b style={{ fontSize: '13px', color: '#0F172A' }}>Atribusi TreeSHAP Lokal</b>
                <span className="badge badge-blue" style={{ fontSize: '10px' }}>Marginal Points</span>
              </div>

              {/* Positive Drivers */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <CheckCircle2 size={13} /> Tuas Pendorong Terbesar:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '8px 10px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#065F46' }}>
                      <span>Kualitas Pembelajaran (D.1)</span>
                      <span>+3.24 pt</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#047857' }}>Aktivasi kognitif guru & manajemen kelas</div>
                  </div>

                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '8px 10px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#065F46' }}>
                      <span>Elektrifikasi Sekolah (X2)</span>
                      <span>+1.95 pt</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#047857' }}>Akses daya untuk komputer dan laboratorium</div>
                  </div>
                </div>
              </div>

              {/* Bottleneck Penalties */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#E11D48', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <AlertOctagon size={13} /> Hambatan Kritis Daerah:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '8px', padding: '8px 10px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#9F1239' }}>
                      <span>{selectedDistrict.recommendation.primary_bottleneck}</span>
                      <span>Penalti Pokok</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#BE123C' }}>Akar masalah utama pembatas kapasitas numerasi</div>
                  </div>

                  <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '8px', padding: '8px 10px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#9F1239' }}>
                      <span>{selectedDistrict.recommendation.secondary_bottleneck}</span>
                      <span>Penalti Sekunder</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#BE123C' }}>Hambatan penunjang efektivitas instruksional</div>
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '11px', color: '#64748B', marginTop: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lightbulb size={13} color="#475569" style={{ flexShrink: 0 }} />
              <i>Model membuktikan bahwa mengeliminasi dua penalti di atas memberikan daya ungkit numerasi hingga 80%.</i>
            </p>
          </div>

          {/* Column 3: Prescriptive Policy Blueprint Card (Matching Table 7) */}
          <div className="bento-card" style={{ padding: '20px', background: 'linear-gradient(135deg, #FFFFFF, #F0FDF4)', borderColor: '#BBF7D0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge" style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' }}>
                  <FileCheck size={12} /> Rekomendasi Preskriptif Table 7
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A' }}>
                  Target 2026
                </span>
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                {selectedDistrict.recommendation.prescriptive_action}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>Target Satuan Pendidikan:</span>
                  <b style={{ color: '#0F172A' }}>Seluruh Jenjang (SD - SMA/SMK)</b>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>Skor Awal (Baseline):</span>
                  <b style={{ color: '#475569' }}>{selectedDistrict.recommendation.baseline_y} Poin</b>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>Proyeksi Skenario E:</span>
                  <b style={{ color: '#16A34A' }}>{selectedDistrict.recommendation.simulated_y} Poin</b>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', fontWeight: 800 }}>
                  <span style={{ color: '#15803D' }}>Potensi Peningkatan (Δ Y):</span>
                  <span style={{ color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>
                    +{selectedDistrict.recommendation.delta_y} Poin
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.5, background: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <b>Kanal Pendanaan:</b> Alokasi Dana Alokasi Khusus (DAK Fisik & Non-Fisik) serta kemitraan Program Guru Penggerak BBPMP Provinsi {selectedDistrict.nama_provinsi}.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={() => onOpenBrief && onOpenBrief(selectedDistrict)}
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '11.5px', padding: '9px 10px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                title={`Unduh Dokumen Policy Brief Resmi untuk ${selectedDistrict.nama_kabupaten_kota}`}
              >
                <FileText size={14} color="#2563EB" />
                <span>Cetak Policy Brief</span>
              </button>
              <button
                onClick={onNavigateToSimulator}
                className="btn btn-primary"
                style={{ flex: 1.2, fontSize: '11.5px', padding: '9px 12px', background: '#16A34A', borderColor: '#15803D' }}
              >
                Uji di Simulator →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
