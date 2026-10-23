import React from 'react';
import { X, Printer, CheckCircle, AlertTriangle, FileText, MapPin, Building, ShieldCheck } from 'lucide-react';

export default function PolicyBriefModal({ isOpen, onClose, district }) {
  if (!isOpen || !district) return null;

  const handlePrint = () => {
    window.print();
  };

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
        borderRadius: '16px',
        maxWidth: '820px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        {/* Actions Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          borderBottom: '1px solid var(--border-color)',
          background: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
            <FileText size={16} color="#2563EB" />
            Dokumen Kebijakan Resmi (One-Page District Policy Brief)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
              <Printer size={14} /> Cetak / Unduh PDF
            </button>
            <button
              onClick={onClose}
              style={{ border: 'none', background: '#F1F5F9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Policy Brief Sheet */}
        <div id="printable-brief" style={{
          padding: '36px',
          overflowY: 'auto',
          flex: 1,
          fontFamily: 'var(--font-sans)',
          color: '#0F172A',
          lineHeight: 1.5,
          background: '#FFFFFF'
        }}>
          {/* Header Lembaga */}
          <div style={{ borderBottom: '2px solid #0F172A', paddingBottom: '14px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#0F172A' }}>
                  LEMBAR REKOMENDASI PRESRIKTIF NUMERASI DAERAH
                </h2>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                  Platform Analitik NUSA-MIPA · Kolaborasi FMIPA UNESA &amp; AMLI 2026
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB' }}>Tahun Rujukan: 2025/2026</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Dokumen ID: {district.nama_kabupaten_kota.toUpperCase().replace(/\s+/g, '_')}_MIPA26</div>
              </div>
            </div>
          </div>

          {/* District Profile Box */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px 18px', marginBottom: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Nama Wilayah:</span>
                <b style={{ fontSize: '14px', color: '#0F172A' }}>{district.nama_kabupaten_kota}</b>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Provinsi:</span>
                <b>{district.nama_provinsi}</b>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Klasifikasi IPO:</span>
                <span className={`badge badge-cluster-${district.cluster_id}`} style={{ fontSize: '10px' }}>
                  {district.cluster_tag}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Skor Numerasi & Learning Loss */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#1E293B', marginBottom: '8px', borderLeft: '3px solid #2563EB', paddingLeft: '8px' }}>
              1. Evaluasi Capaian Numerasi &amp; Risiko Learning Loss
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
              {['SD', 'SMP', 'SMA', 'SMK'].map(lvl => (
                <div key={lvl} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B' }}>Jenjang {lvl}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{district.levels[lvl]?.numerasi_score}</div>
                  <div style={{ fontSize: '9px', color: '#94A3B8' }}>{district.levels[lvl]?.numerasi_label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#475569' }}>
              <b>Analisis Transisi:</b> Terjadi delta SD ke SMP sebesar <b>{district.learning_loss.sd_to_smp > 0 ? `+${district.learning_loss.sd_to_smp}` : district.learning_loss.sd_to_smp} pt</b>, dan penurunan SMP ke SMA sebesar <b style={{ color: district.learning_loss.smp_to_sma < 0 ? '#E11D48' : '#059669' }}>{district.learning_loss.smp_to_sma} pt</b> (Status: <i>{district.learning_loss.loss_badge}</i>).
            </p>
          </div>

          {/* Section 2: Diagnosis Akar Masalah */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#1E293B', marginBottom: '8px', borderLeft: '3px solid #F59E0B', paddingLeft: '8px' }}>
              2. Diagnosis Faktor Pembatas (TreeSHAP Feature Attribution)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '11px' }}>
              <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontWeight: 700, color: '#9F1239' }}>● Bottleneck Utama:</span>
                <div style={{ fontWeight: 800, fontSize: '12px', color: '#881337', marginTop: '2px' }}>{district.recommendation.primary_bottleneck}</div>
                <div style={{ color: '#BE123C', marginTop: '2px' }}>Faktor penyebab penalti kapasitas terbesar pada numerasi.</div>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontWeight: 700, color: '#92400E' }}>● Bottleneck Sekunder:</span>
                <div style={{ fontWeight: 800, fontSize: '12px', color: '#78350F', marginTop: '2px' }}>{district.recommendation.secondary_bottleneck}</div>
                <div style={{ color: '#B45309', marginTop: '2px' }}>Kendala penunjang iklim dan efisiensi belajar murid.</div>
              </div>
            </div>
          </div>

          {/* Section 3: Rencana Aksi Preskriptif */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#1E293B', marginBottom: '8px', borderLeft: '3px solid #10B981', paddingLeft: '8px' }}>
              3. Rencana Aksi Preskriptif &amp; Alokasi Anggaran (Tabel 7)
            </h4>
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#065F46', marginBottom: '4px' }}>
                {district.recommendation.prescriptive_action}
              </div>
              <div style={{ fontSize: '11px', color: '#047857', marginBottom: '8px' }}>
                Skor Awal: <b>{district.recommendation.baseline_y}</b> → Proyeksi Intervensi Skenario E: <b>{district.recommendation.simulated_y}</b> (Kenaikan Potensial: <b>+{district.recommendation.delta_y} Poin</b>).
              </div>
              <div style={{ fontSize: '11px', color: '#065F46', lineHeight: 1.5 }}>
                <b>Rekomendasi Pemda / Bappeda:</b> Prioritaskan penganggaran DAK Fisik/Non-Fisik untuk intervensi ini pada Rencana Kerja Pemerintah Daerah (RKPD) tahun anggaran berjalan guna menutup jurang disparitas mutu pendidikan.
              </div>
            </div>
          </div>

          {/* Sign-off footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '16px', fontSize: '10px', color: '#64748B' }}>
            <div>
              Dicetak otomatis melalui platform <b>NUSA-MIPA</b><br />
              Divisi Penambangan Data — DIMAS-TI AMLI 2026
            </div>
            <div style={{ textAlign: 'right' }}>
              <b>Tim Peneliti NUSA-MIPA UNESA</b><br />
              Universitas Negeri Surabaya
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
