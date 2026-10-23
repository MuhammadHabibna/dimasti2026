import React, { useState } from 'react';
import { X, Award, CheckCircle2, ShieldAlert, ShieldCheck, Cpu, BarChart3, Image as ImageIcon, ExternalLink, Workflow } from 'lucide-react';

export default function ResearchModal({ isOpen, onClose, initialSubTab = 'flowchart' }) {
  if (!isOpen) return null;

  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab, isOpen]);

  const figuresList = [
    { id: 'fig1', name: 'Fig. 1: Distribusi & Disparitas Provinsi', file: 'fig1_eda_distributions_and_provincial_boxplots.png' },
    { id: 'fig2', name: 'Fig. 2: Matriks Korelasi & Moran Scatter', file: 'fig2_correlation_heatmap_and_spatial_moran.png' },
    { id: 'fig3', name: 'Fig. 3: Audit Multikolinieritas VIF & MGWR', file: 'fig3_vif_and_quasi_constant_diagnostic.png' },
    { id: 'fig4', name: 'Fig. 4: Benchmark 5 Algoritma Klaster', file: 'fig4_clustering_multi_algorithm_benchmark.png' },
    { id: 'fig5', name: 'Fig. 5: Peta Spasial Kluster Indonesia', file: 'fig5_spatial_clusters_indonesia_map.png' },
    { id: 'fig6', name: 'Fig. 6: Profil Standar IPO Radar', file: 'fig6_standardized_ipo_profile_radar.png' },
    { id: 'fig7', name: 'Fig. 7: Trajektori Learning Loss Transisi', file: 'fig7_cross_level_learning_loss_trajectory.png' },
    { id: 'fig8', name: 'Fig. 8: Benchmark Regresi Spasial OLS-MGWR', file: 'fig8_spatial_regression_benchmark_cases.png' },
    { id: 'fig9', name: 'Fig. 9: Peta Sebaran Parameter Lokal MGWR', file: 'fig9_mgwr_local_parameter_maps.png' },
    { id: 'fig10', name: 'Fig. 10: Benchmark 11 Model ML Non-Linier', file: 'fig10_ml_11models_cv_benchmark.png' },
    { id: 'fig11', name: 'Fig. 11: Uji Ketahanan Model (Robustness)', file: 'fig11_model_robustness_and_sensitivity_audit.png' },
    { id: 'fig12', name: 'Fig. 12: TreeSHAP Global Policy Drivers', file: 'fig12_treeshap_global_and_beeswarm.png' },
    { id: 'fig13', name: 'Fig. 13: TreeSHAP Kluster-Kondisional', file: 'fig13_treeshap_cluster_conditional_and_waterfalls.png' },
    { id: 'fig14', name: 'Fig. 14: Bukti Eliminasi Confounding Bias', file: 'fig14_counterfactual_whatif_policy_simulation.png' },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '960px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-color)',
          background: '#F8FAFC',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
              <Award size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                Basis Bukti Ilmiah & Evaluasi Model NUSA-MIPA
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Verifikasi Empiris: Ekonometrika Spasial, Machine Learning Dual-CV, dan Uji Ketahanan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ border: 'none', background: '#F1F5F9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Sub-tab Navigation */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-color)', 
          background: '#FFFFFF', 
          padding: '2px 24px 0 24px', 
          gap: '8px', 
          overflowX: 'auto',
          flexShrink: 0 
        }}>
          <button
            onClick={() => setActiveSubTab('flowchart')}
            style={{
              padding: '12px 14px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              background: 'transparent',
              color: activeSubTab === 'flowchart' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'flowchart' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Flowchart Riset (Landscape)
          </button>
          <button
            onClick={() => setActiveSubTab('mgwr')}
            style={{
              padding: '12px 14px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              background: 'transparent',
              color: activeSubTab === 'mgwr' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'mgwr' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Ablasi MGWR & Singularitas
          </button>
          <button
            onClick={() => setActiveSubTab('ml')}
            style={{
              padding: '12px 14px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              background: 'transparent',
              color: activeSubTab === 'ml' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'ml' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Benchmark 11 ML (Dual CV)
          </button>
          <button
            onClick={() => setActiveSubTab('robustness')}
            style={{
              padding: '12px 14px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              background: 'transparent',
              color: activeSubTab === 'robustness' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'robustness' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Uji Ketahanan (Noise & Jackknife)
          </button>
          <button
            onClick={() => setActiveSubTab('figures')}
            style={{
              padding: '12px 14px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              background: 'transparent',
              color: activeSubTab === 'figures' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'figures' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Galeri 14 Figur Publikasi (300 DPI)
          </button>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, fontSize: '13px', lineHeight: 1.6 }}>
          {activeSubTab === 'flowchart' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                    Bagan Alir (Flowchart) Metodologi Penelitian NUSA-MIPA 2026
                  </h4>
                  <p style={{ color: '#64748B', fontSize: '12px' }}>
                    Alur Kerja Komprehensif Berorientasi Dampak (Hulu ke Hilir): Data Dapodik &amp; Sulingjar → Spatial EDA → Tipologi IPO → MGWR → Monotonic ML → Policy Simulator
                  </p>
                </div>
                <a
                  href="/flowchart_penelitian_nusa_mipa.html"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ fontSize: '11px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <ExternalLink size={13} /> Buka Versi Full-Screen
                </a>
              </div>

              {/* 5-Phase Horizontal Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '10px',
                marginBottom: '18px'
              }}>
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase' }}>Fase 1: Data Contract</div>
                  <b style={{ display: 'block', fontSize: '12px', color: '#0F172A', margin: '4px 0' }}>Akuisisi &amp; Integritas</b>
                  <p style={{ fontSize: '10.5px', color: '#475569', lineHeight: 1.4 }}>
                    Dapodik, Rapor Pendidikan, dan Sulingjar 2025. 2.056 baris definitif (514 kab/kota × 4 jenjang). 0 missing values.
                  </p>
                </div>

                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase' }}>Fase 2: Geospasial</div>
                  <b style={{ display: 'block', fontSize: '12px', color: '#0F172A', margin: '4px 0' }}>Spatial EDA &amp; Tipologi</b>
                  <p style={{ fontSize: '10.5px', color: '#475569', lineHeight: 1.4 }}>
                    Moran's I (+0.624 SD, Vocational Paradox SMK +0.063), Learning Loss transisi SMP-SMA (-6.86 pt), dan K-Means 3 Klaster IPO.
                  </p>
                </div>

                <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#7E22CE', textTransform: 'uppercase' }}>Fase 3: Ekonometrika</div>
                  <b style={{ display: 'block', fontSize: '12px', color: '#0F172A', margin: '4px 0' }}>MGWR Multiskala</b>
                  <p style={{ fontSize: '10.5px', color: '#475569', lineHeight: 1.4 }}>
                    Audit VIF &amp; eliminasi singularitas lokal (CN &gt;10⁹ → 4.12). Case 4 Composite R² = 0.766, Spatial OOF = 0.767, residu lenyap.
                  </p>
                </div>

                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>Fase 4: Machine Learning</div>
                  <b style={{ display: 'block', fontSize: '12px', color: '#0F172A', margin: '4px 0' }}>Dual Spatial CV &amp; XAI</b>
                  <p style={{ fontSize: '10.5px', color: '#475569', lineHeight: 1.4 }}>
                    5-Fold GroupKFold &amp; 38-Fold LOPO. Monotonic LightGBM (R² = 0.642). Atribusi TreeSHAP: Pedagogi (+3.24 pt), Listrik (+1.95 pt).
                  </p>
                </div>

                <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>Fase 5: Preskriptif</div>
                  <b style={{ display: 'block', fontSize: '12px', color: '#0F172A', margin: '4px 0' }}>Simulasi &amp; Kebijakan</b>
                  <p style={{ fontSize: '10.5px', color: '#475569', lineHeight: 1.4 }}>
                    Uji ketahanan noise ±10% &amp; Jackknife 30%. Simulator What-If bebas bias perkotaan (Skenario E: +6.63 pt). Policy Brief untuk RKPD.
                  </p>
                </div>
              </div>

              {/* Direct Embed of Flowchart Diagram */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <iframe
                  src="/flowchart_penelitian_nusa_mipa.html"
                  title="Flowchart Metodologi Penelitian"
                  style={{
                    width: '100%',
                    height: '460px',
                    border: 'none',
                    borderRadius: '8px',
                    background: '#FFFFFF'
                  }}
                />
              </div>
            </div>
          )}

          {activeSubTab === 'mgwr' && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Mengatasi Ledakan Condition Number MGWR (&gt;10⁹ → 4.12)
              </h4>
              <p style={{ color: '#475569', marginBottom: '14px' }}>
                Pada model awal, variabel iklim Sulingjar (kebinekaan, inklusivitas) memiliki ragam lokal 0.00 di &gt;18% tetangga, memicu ledakan matriks lokal <code>(XᵀWᵢX)⁻¹</code>. Dengan memformulasikan <b>12 Tuas Kebijakan Ortogonal (Case 3 &amp; 4)</b>, kondisi singularitas berhasil dieliminasi total:
              </p>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '16px' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', color: '#334155', fontWeight: 700 }}>
                    <th style={{ padding: '8px 10px' }}>Jenjang</th>
                    <th style={{ padding: '8px 10px' }}>Estimator</th>
                    <th style={{ padding: '8px 10px' }}>In-Sample R²</th>
                    <th style={{ padding: '8px 10px' }}>Adj. R²</th>
                    <th style={{ padding: '8px 10px' }}>AICc</th>
                    <th style={{ padding: '8px 10px' }}>Resid Moran I</th>
                    <th style={{ padding: '8px 10px' }}>Spatial OOF R²</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>SD</td>
                    <td style={{ padding: '8px 10px' }}>MGWR (Case 3)</td>
                    <td style={{ padding: '8px 10px' }}>0.6417</td>
                    <td style={{ padding: '8px 10px' }}>0.6324</td>
                    <td style={{ padding: '8px 10px' }}>3692.57</td>
                    <td style={{ padding: '8px 10px', color: '#059669' }}>-0.0184</td>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>0.6430</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>SMP</td>
                    <td style={{ padding: '8px 10px' }}>MGWR (Case 3)</td>
                    <td style={{ padding: '8px 10px' }}>0.6198</td>
                    <td style={{ padding: '8px 10px' }}>0.6100</td>
                    <td style={{ padding: '8px 10px' }}>3760.62</td>
                    <td style={{ padding: '8px 10px', color: '#059669' }}>-0.0198</td>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>0.5965</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>SMA</td>
                    <td style={{ padding: '8px 10px' }}>MGWR (Case 3)</td>
                    <td style={{ padding: '8px 10px' }}>0.5245</td>
                    <td style={{ padding: '8px 10px' }}>0.5122</td>
                    <td style={{ padding: '8px 10px' }}>3743.03</td>
                    <td style={{ padding: '8px 10px', color: '#059669' }}>-0.0365</td>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>0.5738</td>
                  </tr>
                  <tr style={{ background: '#ECFDF5', fontWeight: 700 }}>
                    <td style={{ padding: '8px 10px' }}>ALL</td>
                    <td style={{ padding: '8px 10px' }}>MGWR Case 4 Composite (N=514)</td>
                    <td style={{ padding: '8px 10px' }}>0.7659</td>
                    <td style={{ padding: '8px 10px' }}>0.7598</td>
                    <td style={{ padding: '8px 10px' }}>3118.79</td>
                    <td style={{ padding: '8px 10px', color: '#059669' }}>-0.0109</td>
                    <td style={{ padding: '8px 10px', color: '#059669' }}>0.7665</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}>
                <b>Kesimpulan Spasial:</b> Residu spasial Moran's I turun dari +0.6237 menjadi -0.0109 (lenyap), membuktikan pola geospasial telah diserap sempurna oleh model. 100% Kabupaten kini memiliki tuas kebijakan yang signifikan secara lokal (|t| &gt; 1.96).
              </div>
            </div>
          )}

          {activeSubTab === 'ml' && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} color="#0F172A" />
                <span>Benchmark 11 Machine Learning (Tanpa Proxy Literasi)</span>
              </h4>
              <p style={{ color: '#475569', marginBottom: '14px' }}>
                Seluruh model dievaluasi murni pada instrumen kebijakan Dapodik &amp; Sulingjar (Case 2: 19 Fitur) di bawah <b>5-Fold District GroupKFold CV</b> dan <b>38-Fold Leave-One-Province-Out (LOPO) Spatial CV</b>:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '14px' }}>
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1D4ED8' }}>MODEL USULAN: MONOTONIC LIGHTGBM</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#1E40AF', marginTop: '2px' }}>R² = 0.6416 (LOPO 0.5726)</div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                    Mengunci arah gradien monotonik sehingga simulasi de-crowding rombel bernilai positif (+0.346 pt).
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>BASELINE: OLS GLOBAL</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#64748B', marginTop: '2px' }}>R² = 0.5014 (LOPO 0.4660)</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                    Gagal menangkap Vocational Paradox di SMK (R² SMK negatif: -0.2866).
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'robustness' && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#0F172A" />
                <span>Uji Ketahanan Model Terhadap Derau &amp; Subsampling</span>
              </h4>
              <p style={{ color: '#475569', marginBottom: '14px' }}>
                Membuktikan kepada dewan juri bahwa temuan NUSA-MIPA bukan kebetulan statistik (*statistical fluke*):
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px' }}>
                  <b>1. Perturbasi Noise Gaussian ±10%:</b>
                  <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                    Prediksi model mempertahankan korelasi peringkat Spearman ρ = <b>0.9793</b> dan Fidelity R² = <b>0.9575</b>. Model sangat tahan terhadap galat survei instrumen.
                  </p>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px' }}>
                  <b>2. Resampling Spasial Jackknife (Drop 30% Kabupaten):</b>
                  <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                    Penarikan acak 30% kabupaten menghasilkan OOF R² = <b>0.6389 ± 0.022</b> dengan koefisien variasi stabilitas hanya <b>3.49%</b>.
                  </p>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px' }}>
                  <b>3. Sensitivitas Matriks Bobot Spasial (k=4 s.d. 20):</b>
                  <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                    Nilai p-value Moran's I konsisten p = 0.005 di seluruh variasi k tetangga.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'figures' && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={16} color="#0F172A" />
                <span>Katalog 14 Gambar Publikasi (Standar IEEE 300 DPI)</span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px', marginTop: '12px' }}>
                {figuresList.map(fig => (
                  <div key={fig.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px', overflow: 'hidden' }}>
                    <img
                      src={`/figures/${fig.file}`}
                      alt={fig.name}
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                    />
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', marginTop: '6px' }}>
                      {fig.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ fontSize: '12px' }}>
            Tutup Panel Riset
          </button>
        </div>
      </div>
    </div>
  );
}
