import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, MapPin, Layers, AlertTriangle, ArrowRight, TrendingUp, Filter, Target, FileText } from 'lucide-react';

export default function SpatialExplorer({
  districtsData,
  selectedDistrictKey,
  setSelectedDistrictKey,
  onNavigateToDiagnostic,
  onNavigateToSimulator,
  onOpenBrief
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const geojsonLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [activeLevel, setActiveLevel] = useState('ALL'); // ALL, SD, SMP, SMA, SMK
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('ALL'); // ALL, 1, 2, 3
  const [mapDisplayMode, setMapDisplayMode] = useState('polygon'); // 'polygon' (GeoJSON) or 'centroid' (Dots)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [geojsonRaw, setGeojsonRaw] = useState(null);
  const [basemapType, setBasemapType] = useState('esri'); // esri, osm, topo

  const districtList = Object.entries(districtsData || {});
  const currentDistrict = districtsData ? districtsData[selectedDistrictKey] : null;

  // 1. Fetch Enriched GeoJSON once
  useEffect(() => {
    fetch('/data/indonesia_kabupaten_enriched.geojson')
      .then(res => res.json())
      .then(data => {
        setGeojsonRaw(data);
      })
      .catch(err => {
        console.error('Failed to load GeoJSON:', err);
      });
  }, []);

  // 2. Initialize Leaflet Map & Manage Tile Layers
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      const map = L.map(mapRef.current, {
        center: [-2.0, 118.0],
        zoom: 5,
        minZoom: 4,
        maxZoom: 14,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstance.current = map;
    }

    const map = mapInstance.current;

    // FORCIBLY PURGE all existing TileLayers to completely remove any old CartoDB watermark tiles
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Select clean, watermark-free basemap
    let layerUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    let attr = '&copy; Esri Canvas &copy; OpenStreetMap';
    let maxZoom = 16;

    if (basemapType === 'osm') {
      layerUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      attr = '&copy; OpenStreetMap contributors';
      maxZoom = 19;
    } else if (basemapType === 'topo') {
      layerUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      attr = '&copy; Esri Topographic';
      maxZoom = 18;
    }

    const newTile = L.tileLayer(layerUrl, {
      attribution: attr,
      maxZoom: maxZoom
    });
    newTile.addTo(map);

    return () => {
      // Cleanup on component unmount
    };
  }, [basemapType]);

  // 3. Render / Update GeoJSON Polygons or Centroid Dots
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    // Clear existing layers
    if (geojsonLayerRef.current) {
      geojsonLayerRef.current.remove();
      geojsonLayerRef.current = null;
    }
    if (markersLayerRef.current) {
      markersLayerRef.current.remove();
      markersLayerRef.current = null;
    }

    // MODE A: GeoJSON Boundary Polygons (User Request: "biar ga titik2 aja")
    if (mapDisplayMode === 'polygon' && geojsonRaw) {
      const geoLayer = L.geoJSON(geojsonRaw, {
        filter: (feature) => {
          if (selectedClusterFilter === 'ALL') return true;
          return feature.properties.cluster_id === Number(selectedClusterFilter);
        },
        style: (feature) => {
          const props = feature.properties;
          const isSelected = props.district_key === selectedDistrictKey;
          const baseColor = props.cluster_color || '#F59E0B';

          return {
            fillColor: baseColor,
            fillOpacity: isSelected ? 0.92 : 0.68,
            color: isSelected ? '#0F172A' : '#FFFFFF',
            weight: isSelected ? 2.5 : 0.8,
            dashArray: isSelected ? '' : '1'
          };
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties;
          const score = props[`numerasi_${activeLevel}`] || props.numerasi_ALL;

          // Tooltip on hover
          const tooltipContent = `
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; min-width: 140px;">
              <b style="color: #0F172A; font-size: 13px;">${props.nama_kabupaten_kota}</b>
              <div style="color: #64748B; font-size: 11px; margin-bottom: 4px;">Provinsi ${props.nama_provinsi}</div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 2px;">
                <span>Numerasi ${activeLevel}:</span>
                <b style="color: #2563EB;">${score}</b>
              </div>
              <div style="font-size: 10px; font-weight: 700; color: ${props.cluster_color};">
                ● ${props.cluster_tag}
              </div>
            </div>
          `;
          layer.bindTooltip(tooltipContent, { className: 'custom-leaflet-tooltip', sticky: true });

          // Mouse interactions
          layer.on({
            mouseover: (e) => {
              const l = e.target;
              if (props.district_key !== selectedDistrictKey) {
                l.setStyle({
                  fillOpacity: 0.88,
                  weight: 2,
                  color: '#2563EB'
                });
              }
              l.bringToFront();
            },
            mouseout: (e) => {
              geoLayer.resetStyle(e.target);
            },
            click: (e) => {
              if (props.district_key) {
                setSelectedDistrictKey(props.district_key);
              }
              map.fitBounds(e.target.getBounds(), { maxZoom: 8, padding: [20, 20] });
            }
          });
        }
      }).addTo(map);

      geojsonLayerRef.current = geoLayer;
    }
    // MODE B: Centroid Markers (Dots fallback)
    else if (mapDisplayMode === 'centroid' && districtsData) {
      const markersGroup = L.layerGroup();

      districtList.forEach(([key, d]) => {
        if (selectedClusterFilter !== 'ALL' && d.cluster_id !== Number(selectedClusterFilter)) {
          return;
        }

        let score = d.ipo_dimensions.numerasi;
        if (activeLevel !== 'ALL' && d.levels[activeLevel]) {
          score = d.levels[activeLevel].numerasi_score;
        }

        const isSelected = key === selectedDistrictKey;
        const color = d.cluster_color;

        const marker = L.circleMarker([d.latitude, d.longitude], {
          radius: isSelected ? 9 : 6,
          fillColor: color,
          color: isSelected ? '#0F172A' : '#FFFFFF',
          weight: isSelected ? 3 : 1.5,
          opacity: 1,
          fillOpacity: 0.85
        });

        marker.bindTooltip(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px;">
            <b>${d.nama_kabupaten_kota}</b> (${d.nama_provinsi})<br/>
            <span>Numerasi ${activeLevel}: <b>${score}</b></span>
          </div>
        `, { sticky: true });

        marker.on('click', () => {
          setSelectedDistrictKey(key);
        });

        markersGroup.addLayer(marker);
      });

      markersGroup.addTo(map);
      markersLayerRef.current = markersGroup;
    }
  }, [geojsonRaw, districtsData, selectedClusterFilter, activeLevel, selectedDistrictKey, mapDisplayMode]);

  // Handle Search autocomplete
  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const qLower = q.toLowerCase();
    const filtered = districtList
      .filter(([k, d]) => d.nama_kabupaten_kota.toLowerCase().includes(qLower) || d.nama_provinsi.toLowerCase().includes(qLower))
      .slice(0, 5);
    setSearchResults(filtered);
  };

  const handleSelectSearchResult = (key, d) => {
    setSelectedDistrictKey(key);
    setSearchQuery('');
    setSearchResults([]);
    if (mapInstance.current) {
      mapInstance.current.flyTo([d.latitude, d.longitude], 8, { duration: 1.2 });
    }
  };

  return (
    <section id="spatial-explorer" style={{ padding: '8px 0 28px 0' }}>
      <div className="container">
        {/* Sleek Unified Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '14px',
          padding: '8px 16px',
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Left: Mode Switcher + Level Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Display Mode Pill */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '9999px', border: '1px solid #E2E8F0' }}>
              <button
                onClick={() => setMapDisplayMode('polygon')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  background: mapDisplayMode === 'polygon' ? '#2563EB' : 'transparent',
                  color: mapDisplayMode === 'polygon' ? '#FFFFFF' : '#475569',
                  boxShadow: mapDisplayMode === 'polygon' ? '0 1px 4px rgba(37, 99, 235, 0.25)' : 'none'
                }}
                title="Tampilkan Poligon Batas Wilayah GeoJSON"
              >
                <Layers size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '5px' }} />
                Poligon Batas (GeoJSON)
              </button>
              <button
                onClick={() => setMapDisplayMode('centroid')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  background: mapDisplayMode === 'centroid' ? '#2563EB' : 'transparent',
                  color: mapDisplayMode === 'centroid' ? '#FFFFFF' : '#475569',
                  boxShadow: mapDisplayMode === 'centroid' ? '0 1px 4px rgba(37, 99, 235, 0.25)' : 'none'
                }}
                title="Tampilkan Titik Centroid Wilayah"
              >
                <MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '5px' }} />
                Titik Centroid
              </button>
            </div>

            <div style={{ width: '1px', height: '18px', background: '#CBD5E1' }} />

            {/* Jenjang Switcher */}
            <div style={{ display: 'flex', background: '#F8FAFC', padding: '3px', borderRadius: '9999px', gap: '2px', border: '1px solid #E2E8F0' }}>
              {['ALL', 'SD', 'SMP', 'SMA', 'SMK'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  style={{
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: activeLevel === lvl ? 700 : 600,
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    background: activeLevel === lvl ? '#0F172A' : 'transparent',
                    color: activeLevel === lvl ? '#FFFFFF' : '#64748B'
                  }}
                >
                  {lvl === 'ALL' ? 'Semua Jenjang' : lvl}
                </button>
              ))}
            </div>

            <div style={{ width: '1px', height: '18px', background: '#CBD5E1' }} />

            {/* Basemap Style Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#F8FAFC',
              padding: '2px 8px',
              borderRadius: '9999px',
              border: '1px solid #E2E8F0',
              fontSize: '11px'
            }} title="Pilih Gaya Peta Latar Belakang (Bebas Watermark)">
              <span style={{ color: '#64748B', fontWeight: 600 }}>Basemap:</span>
              <select
                value={basemapType}
                onChange={(e) => setBasemapType(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#1E293B',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="esri">Esri Canvas (Minimalis Abu-Abu)</option>
                <option value="osm">OpenStreetMap (Standar)</option>
                <option value="topo">Esri Topografi</option>
              </select>
            </div>
          </div>

          {/* Right: Cluster Filters + Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setSelectedClusterFilter('ALL')}
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  border: '1px solid #CBD5E1',
                  background: selectedClusterFilter === 'ALL' ? '#E2E8F0' : '#FFFFFF',
                  fontWeight: 600,
                  color: '#334155'
                }}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedClusterFilter('1')}
                className="badge badge-cluster-1"
                style={{ cursor: 'pointer', opacity: selectedClusterFilter === '1' || selectedClusterFilter === 'ALL' ? 1 : 0.4 }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block', marginRight: '5px' }}></span>
                Kluster 1 (184)
              </button>
              <button
                onClick={() => setSelectedClusterFilter('2')}
                className="badge badge-cluster-2"
                style={{ cursor: 'pointer', opacity: selectedClusterFilter === '2' || selectedClusterFilter === 'ALL' ? 1 : 0.4 }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block', marginRight: '5px' }}></span>
                Kluster 2 (283)
              </button>
              <button
                onClick={() => setSelectedClusterFilter('3')}
                className="badge badge-cluster-3"
                style={{ cursor: 'pointer', opacity: selectedClusterFilter === '3' || selectedClusterFilter === 'ALL' ? 1 : 0.4 }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E11D48', display: 'inline-block', marginRight: '5px' }}></span>
                Kluster 3 (47)
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '9999px', padding: '4px 10px', gap: '6px' }}>
                <Search size={13} color="#64748B" />
                <input
                  type="text"
                  placeholder="Cari kab/kota..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', width: '120px', color: '#0F172A' }}
                />
              </div>
              {searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '32px',
                  right: 0,
                  width: '230px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 2000,
                  overflow: 'hidden'
                }}>
                  {searchResults.map(([k, d]) => (
                    <div
                      key={k}
                      onClick={() => handleSelectSearchResult(k, d)}
                      style={{ padding: '8px 12px', fontSize: '11px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <b style={{ color: '#0F172A' }}>{d.nama_kabupaten_kota}</b>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{d.nama_provinsi} · {d.cluster_tag}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Split Grid: Left Choropleth Map (65%) | Right District Inspector (35%) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(340px, 1.2fr)',
          gap: '16px'
        }}>
          {/* Left: Leaflet Map Container with GeoJSON Boundaries */}
          <div className="bento-card" style={{ padding: 0, height: '540px', position: 'relative', overflow: 'hidden' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
            
            {/* Map Legend Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              zIndex: 1000,
              fontSize: '11px',
              lineHeight: 1.6
            }}>
              <b style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Batas Poligon &amp; Tipologi IPO:
              </b>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10B981' }}></span>
                <span><b>Kluster 1:</b> Benchmark Nasional (184 Daerah)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#F59E0B' }}></span>
                <span><b>Kluster 2:</b> Paradoks Sarpras (283 Daerah)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#E11D48' }}></span>
                <span><b>Kluster 3:</b> Prioritas Afirmasi 3T (47 Daerah)</span>
              </div>
            </div>
          </div>

          {/* Right: District Inspector Card */}
          <div className="bento-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {currentDistrict ? (
              <>
                <div>
                  {/* District Header & Type Badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={15} color="#2563EB" />
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {currentDistrict.nama_kabupaten_kota}
                        </h3>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '21px' }}>
                        Provinsi {currentDistrict.nama_provinsi} · {currentDistrict.is_kota ? 'Kawasan Perkotaan (Urban)' : 'Wilayah Kabupaten'}
                      </p>
                    </div>
                    <span className={`badge badge-cluster-${currentDistrict.cluster_id}`}>
                      {currentDistrict.cluster_tag}
                    </span>
                  </div>

                  {/* 4 Levels Numeracy Score Tiles */}
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                      Capaian Numerasi 4 Jenjang (Rapor 2025):
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {['SD', 'SMP', 'SMA', 'SMK'].map((lvl) => {
                        const score = currentDistrict.levels[lvl]?.numerasi_score || 0;
                        const label = currentDistrict.levels[lvl]?.numerasi_label || 'Sedang';
                        return (
                          <div key={lvl} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>{lvl}</div>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: score >= 60 ? '#059669' : (score >= 45 ? '#D97706' : '#E11D48') }}>
                              {score}
                            </div>
                            <div style={{ fontSize: '9px', fontWeight: 600, color: '#94A3B8' }}>{label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Learning Loss Trajectory Card */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {currentDistrict.learning_loss.is_severe_loss ? (
                          <AlertTriangle size={14} color="#E11D48" />
                        ) : (
                          <TrendingUp size={14} color="#059669" />
                        )}
                        Trajektori Transisi MIPA:
                      </span>
                      <span className={`badge ${currentDistrict.learning_loss.is_severe_loss ? 'badge-cluster-3' : 'badge-cluster-1'}`} style={{ fontSize: '10px' }}>
                        {currentDistrict.learning_loss.loss_badge}
                      </span>
                    </div>

                    {/* SVG Trajectory Line */}
                    <div style={{ width: '100%', height: '70px', position: 'relative', marginTop: '6px' }}>
                      <svg width="100%" height="70" viewBox="0 0 320 70">
                        <line x1="40" y1="45" x2="120" y2="20" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3,3" />
                        <line x1="120" y1="20" x2="200" y2="40" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3,3" />
                        <line x1="200" y1="40" x2="280" y2="48" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3,3" />

                        <circle cx="40" cy="45" r="5" fill="#2563EB" />
                        <text x="40" y="62" fontSize="9" fontWeight="700" textAnchor="middle" fill="#64748B">SD ({currentDistrict.levels.SD?.numerasi_score})</text>

                        <circle cx="120" cy="20" r="5" fill="#10B981" />
                        <text x="120" y="12" fontSize="9" fontWeight="700" textAnchor="middle" fill="#059669">SMP ({currentDistrict.levels.SMP?.numerasi_score})</text>

                        <circle cx="200" cy="40" r="5" fill="#F59E0B" />
                        <text x="200" y="32" fontSize="9" fontWeight="700" textAnchor="middle" fill="#D97706">SMA ({currentDistrict.levels.SMA?.numerasi_score})</text>

                        <circle cx="280" cy="48" r="5" fill="#E11D48" />
                        <text x="280" y="65" fontSize="9" fontWeight="700" textAnchor="middle" fill="#E11D48">SMK ({currentDistrict.levels.SMK?.numerasi_score})</text>
                      </svg>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', borderTop: '1px solid #E2E8F0', paddingTop: '6px', marginTop: '4px' }}>
                      <span>Akselerasi SD ke SMP: <b>{currentDistrict.learning_loss.sd_to_smp > 0 ? `+${currentDistrict.learning_loss.sd_to_smp}` : currentDistrict.learning_loss.sd_to_smp} pt</b></span>
                      <span>Drop SMP ke SMA: <b style={{ color: currentDistrict.learning_loss.smp_to_sma < 0 ? '#E11D48' : '#059669' }}>{currentDistrict.learning_loss.smp_to_sma} pt</b></span>
                    </div>
                  </div>

                  {/* Primary Recommendation Sneak Peek */}
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#1D4ED8', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Target size={13} color="#1D4ED8" />
                      <span>Aksi Kebijakan Prioritas (Table 7):</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                      {currentDistrict.recommendation.prescriptive_action}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                      Kendala Utama: <b>{currentDistrict.recommendation.primary_bottleneck}</b>
                    </div>
                  </div>

                  {/* Dynamic One-Page Policy Brief Generator Feature */}
                  <button
                    onClick={() => onOpenBrief && onOpenBrief(currentDistrict)}
                    className="btn"
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      border: '1px solid #BFDBFE',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 1px 2px rgba(29, 78, 216, 0.05)',
                      cursor: 'pointer'
                    }}
                    title={`Lihat dan cetak dokumen resmi Policy Brief untuk ${currentDistrict.nama_kabupaten_kota}`}
                  >
                    <FileText size={14} color="#2563EB" />
                    <span>Cetak Policy Brief ({currentDistrict.nama_kabupaten_kota})</span>
                  </button>
                </div>

                {/* Quick Action Navigation Footer */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    onClick={onNavigateToDiagnostic}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '11px', padding: '8px 10px' }}
                  >
                    Buka Radar IPO &amp; XAI
                  </button>
                  <button
                    onClick={onNavigateToSimulator}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '11px', padding: '8px 10px' }}
                  >
                    Simulasi What-If
                    <ArrowRight size={13} />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                <MapPin size={32} color="#94A3B8" style={{ marginBottom: '8px' }} />
                <p>Klik salah satu wilayah pada peta untuk memunculkan profil lengkap.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
