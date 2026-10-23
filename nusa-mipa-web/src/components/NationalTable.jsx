import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, ArrowRight, FileText } from 'lucide-react';

export default function NationalTable({ districtsData, selectedDistrictKey, setSelectedDistrictKey, onSelectAndExplore, onOpenBrief }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCluster, setFilterCluster] = useState('ALL');
  const [filterProv, setFilterProv] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('numerasi');
  const [sortAsc, setSortAsc] = useState(false);

  const pageSize = 12;

  const rawList = Object.entries(districtsData || {}).map(([key, d]) => ({
    key,
    ...d
  }));

  // Extract unique provinces
  const provinces = useMemo(() => {
    const setP = new Set(rawList.map(d => d.nama_provinsi));
    return Array.from(setP).sort();
  }, [rawList]);

  // Filtered & Sorted
  const filteredList = useMemo(() => {
    return rawList.filter(d => {
      const matchSearch = d.nama_kabupaten_kota.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.nama_provinsi.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCluster = filterCluster === 'ALL' || d.cluster_id === Number(filterCluster);
      const matchProv = filterProv === 'ALL' || d.nama_provinsi === filterProv;
      return matchSearch && matchCluster && matchProv;
    }).sort((a, b) => {
      let valA = sortField === 'numerasi' ? a.ipo_dimensions.numerasi : a.levels[sortField]?.numerasi_score || 0;
      let valB = sortField === 'numerasi' ? b.ipo_dimensions.numerasi : b.levels[sortField]?.numerasi_score || 0;
      if (sortAsc) return valA - valB;
      return valB - valA;
    });
  }, [rawList, searchTerm, filterCluster, filterProv, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <section id="national-table-section" style={{ padding: '16px 0 32px 0' }}>
      <div className="container">
        {/* Module Header */}
        <div className="bento-card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                <Filter size={13} /> Modul 4: Database Komparatif Nasional
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                Benchmarking 514 Kabupaten/Kota & Matriks Tindakan Preskriptif
              </h2>
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Province Filter */}
              <select
                value={filterProv}
                onChange={(e) => { setFilterProv(e.target.value); setCurrentPage(1); }}
                style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid #CBD5E1', fontSize: '12px', background: '#FFFFFF', color: '#0F172A', outline: 'none' }}
              >
                <option value="ALL">Semua 38 Provinsi</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              {/* Cluster Filter */}
              <select
                value={filterCluster}
                onChange={(e) => { setFilterCluster(e.target.value); setCurrentPage(1); }}
                style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid #CBD5E1', fontSize: '12px', background: '#FFFFFF', color: '#0F172A', outline: 'none' }}
              >
                <option value="ALL">Semua 3 Klaster</option>
                <option value="1">Kluster 1: Benchmark (184)</option>
                <option value="2">Kluster 2: Paradoks (283)</option>
                <option value="3">Kluster 3: 3T (47)</option>
              </select>

              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: '5px 10px', gap: '6px' }}>
                <Search size={14} color="#64748B" />
                <input
                  type="text"
                  placeholder="Cari daerah..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', width: '130px', color: '#0F172A' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bento-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '12px 16px' }}>Kabupaten / Kota</th>
                  <th style={{ padding: '12px 16px' }}>Provinsi</th>
                  <th style={{ padding: '12px 16px' }}>Klaster IPO</th>
                  <th
                    onClick={() => handleSort('numerasi')}
                    style={{ padding: '12px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Rerata Numerasi <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('SD')}
                    style={{ padding: '12px 12px', cursor: 'pointer' }}
                  >
                    SD
                  </th>
                  <th
                    onClick={() => handleSort('SMP')}
                    style={{ padding: '12px 12px', cursor: 'pointer' }}
                  >
                    SMP
                  </th>
                  <th
                    onClick={() => handleSort('SMA')}
                    style={{ padding: '12px 12px', cursor: 'pointer' }}
                  >
                    SMA
                  </th>
                  <th style={{ padding: '12px 16px' }}>Status Transisi</th>
                  <th style={{ padding: '12px 16px' }}>Aksi Preskriptif (Table 7)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((d) => {
                  const isSelected = d.key === selectedDistrictKey;
                  return (
                    <tr
                      key={d.key}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        background: isSelected ? '#EFF6FF' : 'transparent',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>
                        {d.nama_kabupaten_kota}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>
                        {d.nama_provinsi}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge badge-cluster-${d.cluster_id}`} style={{ fontSize: '10px' }}>
                          {d.cluster_tag}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: d.ipo_dimensions.numerasi >= 60 ? '#059669' : (d.ipo_dimensions.numerasi >= 45 ? '#D97706' : '#E11D48') }}>
                        {d.ipo_dimensions.numerasi}
                      </td>
                      <td style={{ padding: '12px 12px', color: '#334155' }}>
                        {d.levels.SD?.numerasi_score}
                      </td>
                      <td style={{ padding: '12px 12px', color: '#334155' }}>
                        {d.levels.SMP?.numerasi_score}
                      </td>
                      <td style={{ padding: '12px 12px', color: '#334155' }}>
                        {d.levels.SMA?.numerasi_score}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: d.learning_loss.is_severe_loss ? '#E11D48' : '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {d.learning_loss.is_severe_loss ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                          {d.learning_loss.loss_badge}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#1E293B', fontWeight: 600, maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={d.recommendation.prescriptive_action}>
                        {d.recommendation.prescriptive_action}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button
                            onClick={() => onSelectAndExplore(d.key)}
                            className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                            title="Buka Peta Spasial &amp; Diagnosis Daerah Ini"
                          >
                            Pilih Daerah
                          </button>
                          <button
                            onClick={() => onOpenBrief && onOpenBrief(d.key)}
                            className="btn btn-secondary"
                            style={{ fontSize: '11px', padding: '4px 8px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#1D4ED8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title={`Cetak Dokumen Resmi Policy Brief untuk ${d.nama_kabupaten_kota}`}
                          >
                            <FileText size={12} color="#2563EB" />
                            <span>Brief</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', fontSize: '12px' }}>
            <span style={{ color: '#64748B' }}>
              Menampilkan {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredList.length)} dari <b>{filteredList.length} Kabupaten/Kota</b>
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={14} /> Sebelumnya
              </button>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Selanjutnya <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
