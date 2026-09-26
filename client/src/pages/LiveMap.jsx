import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Filter, 
  RotateCcw, 
  Layers, 
  MapPin, 
  ShieldAlert, 
  Flame, 
  Droplet, 
  Hammer, 
  Zap, 
  Trash2,
  ChevronRight,
  Info
} from 'lucide-react';
import { api } from '../services/api';

export default function LiveMap({ onSelectComplaint }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [filterTaluk, setFilterTaluk] = useState('all');
  const [filterPrecision, setFilterPrecision] = useState('all');
  const [taluks, setTaluks] = useState([
    'Annur', 'Anaimalai', 'Coimbatore North', 'Coimbatore South',
    'Kinathukadavu', 'Madukkarai', 'Mettupalayam', 'Perur',
    'Pollachi', 'Sulur', 'Valparai'
  ]);

  // Load complaints and departments
  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getComplaints({
        category: filterCategory,
        priority: filterPriority,
        departmentId: filterDepartment,
        status: filterStatus,
        area: filterArea,
        taluk: filterTaluk,
        precision: filterPrecision
      }),
      api.getDepartments(),
      api.getTaluks().catch(() => [])
    ]).then(([comps, depts, fetchedTaluks]) => {
      setComplaints(comps);
      setDepartments(depts);
      if (fetchedTaluks && fetchedTaluks.length > 0) {
        setTaluks(fetchedTaluks);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [filterCategory, filterPriority, filterDepartment, filterStatus, filterArea, filterTaluk, filterPrecision]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on Coimbatore (Lat: 11.0168, Lng: 76.9558)
    const map = L.map(mapContainerRef.current, {
      center: [11.0183, 76.9724],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    // Clean Dark-Styled OpenStreetMap Tile Provider
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers on Leaflet Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    complaints.forEach((c) => {
      // Must have valid coordinates
      if (!c.latitude || !c.longitude) return;

      const priority = c.priority || 'normal';
      let pinColor = '#00e599'; // normal
      let glowClass = '';

      if (priority === 'emergency') {
        pinColor = '#ff3366';
        glowClass = 'pulse-emergency';
      } else if (priority === 'high') {
        pinColor = '#ff9900';
      } else if (priority === 'medium') {
        pinColor = '#ffb703';
      }

      if (c.status === 'resolved') {
        pinColor = '#00e599';
      }

      // Precision badge colors
      const precision = c.location_precision || 'AREA';
      let precisionColor = '#3b82f6';
      if (precision === 'EXACT') precisionColor = '#00e599';
      else if (precision === 'STREET') precisionColor = '#00f0ff';
      else if (precision === 'NEAR_LANDMARK') precisionColor = '#c084fc';
      else if (precision === 'APPROXIMATE') precisionColor = '#ffb703';

      // Custom Glowing Control-Room Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="
            position: relative;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: ${pinColor};
            border: 2px solid #FFFFFF;
            box-shadow: 0 0 16px ${pinColor};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${priority === 'emergency' ? `
              <div style="
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                border: 2px solid #ff3366;
                animation: radar-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
              "></div>
            ` : ''}
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #06090E;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([c.latitude, c.longitude], { icon: customIcon });

      // Interactive Popup content with Coimbatore Location Intelligence details
      const popupHtml = `
        <div style="padding: 12px; font-family: 'Inter', sans-serif; min-width: 260px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="font-family: 'JetBrains Mono', monospace; color: #00f0ff; font-size: 13px;">${c.id}</strong>
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: 700; text-transform: uppercase; background: ${pinColor}22; color: ${pinColor}; border: 1px solid ${pinColor}55;">
              ${c.priority} Priority
            </span>
          </div>

          <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
            <span style="font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${precisionColor}22; color: ${precisionColor}; border: 1px solid ${precisionColor}55;">
              PRECISION: ${precision}
            </span>
            ${c.taluk ? `<span style="font-size: 9px; color: #94A3B8; background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px;">Taluk: ${c.taluk}</span>` : ''}
          </div>

          <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-bottom: 6px;">
            ${c.category}
          </div>

          <div style="font-size: 12px; color: #F1F5F9; margin-bottom: 4px;">
            📍 <strong>${c.canonical_location_name || c.area_name || 'Coimbatore Area'}</strong>
          </div>

          ${c.street ? `<div style="font-size: 11px; color: #94A3B8; margin-bottom: 3px;">🛣️ Street/Road: <span style="color: #FFFFFF; font-weight: 600;">${c.street}</span></div>` : ''}
          ${c.landmark ? `<div style="font-size: 11px; color: #c084fc; margin-bottom: 4px; background: rgba(192,132,252,0.1); padding: 3px 6px; border-radius: 4px; border-left: 2px solid #c084fc;">🚩 Landmark: <strong style="color: #FFFFFF;">${c.landmark.toLowerCase().startsWith('near') ? c.landmark : `Near ${c.landmark}`}</strong></div>` : ''}

          <div style="font-size: 11px; color: #94A3B8; margin-bottom: 10px;">
            🏢 Dept: <strong>${c.department_name || 'Municipal Operations'}</strong>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
            <span style="font-size: 11px; text-transform: capitalize; color: #CBD5E1;">
              Status: <strong>${c.status.replace('_', ' ')}</strong>
            </span>
            <button id="btn-inspect-${c.id}" style="
              background: #00f0ff;
              color: #06090E;
              border: none;
              padding: 4px 10px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
            ">Inspect</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-${c.id}`);
        if (btn) {
          btn.onclick = () => onSelectComplaint(c.id);
        }
      });

      marker.addTo(layer);
    });
  }, [complaints]);

  const resetFilters = () => {
    setFilterCategory('all');
    setFilterPriority('all');
    setFilterDepartment('all');
    setFilterStatus('all');
    setFilterArea('all');
    setFilterTaluk('all');
    setFilterPrecision('all');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)', position: 'relative' }}>
      
      {/* Map Filter Control Bar */}
      <div style={{
        backgroundColor: 'var(--bg-deep)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan)', fontSize: '13px', fontWeight: 600 }}>
            <Filter size={15} />
            <span>Map Filters:</span>
          </div>

          {/* Category Filter */}
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 10px' }}
          >
            <option value="all">All Categories</option>
            <option value="Damaged Road">Damaged Road</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Electricity Issue">Electricity Issue</option>
            <option value="Garbage/Sanitation">Garbage/Sanitation</option>
            <option value="Accident">Accident</option>
            <option value="Theft">Theft</option>
            <option value="Fire">Fire</option>
            <option value="Other Civic Issue">Other Civic Issue</option>
          </select>

          {/* Priority Filter */}
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 10px' }}
          >
            <option value="all">All Priorities</option>
            <option value="emergency">🔴 Emergency</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="normal">🟢 Normal</option>
          </select>

          {/* Department Filter */}
          <select 
            value={filterDepartment} 
            onChange={(e) => setFilterDepartment(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 10px' }}
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 10px' }}
          >
            <option value="all">All Statuses</option>
            <option value="received">Received</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Area Filter */}
          <select 
            value={filterArea} 
            onChange={(e) => setFilterArea(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 10px' }}
          >
            <option value="all">All Zones / Areas</option>
            <option value="Saravanampatti">Saravanampatti</option>
            <option value="Gandhipuram">Gandhipuram</option>
            <option value="RS Puram">RS Puram</option>
            <option value="Peelamedu">Peelamedu</option>
            <option value="Ukkadam">Ukkadam</option>
            <option value="Singanallur">Singanallur</option>
          </select>

          {/* Taluk Filter */}
          <select 
            value={filterTaluk} 
            onChange={(e) => setFilterTaluk(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 10px' }}
          >
            <option value="all">All Taluks ({taluks.length})</option>
            {taluks.map(t => (
              <option key={t} value={t}>{t} Taluk</option>
            ))}
          </select>

          {/* Location Precision Filter */}
          <select 
            value={filterPrecision} 
            onChange={(e) => setFilterPrecision(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 10px' }}
          >
            <option value="all">All Precisions</option>
            <option value="EXACT">🎯 EXACT (Street + Landmark)</option>
            <option value="STREET">🛣️ STREET (Road level)</option>
            <option value="NEAR_LANDMARK">🚩 NEAR_LANDMARK (Landmark ref)</option>
            <option value="AREA">📍 AREA (Locality / Village)</option>
            <option value="APPROXIMATE">🌐 APPROXIMATE</option>
          </select>

          <button 
            className="btn-secondary"
            onClick={resetFilters}
            style={{ padding: '6px 10px', fontSize: '11px' }}
            title="Reset all filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>

        {/* Counter Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            Showing <strong className="mono" style={{ color: 'var(--cyan)' }}>{complaints.length}</strong> Coimbatore Incidents
          </div>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div 
        ref={mapContainerRef} 
        style={{ flex: 1, width: '100%', position: 'relative' }} 
      />

      {/* Floating Control-Room Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-card)',
        borderRadius: '10px',
        padding: '12px 18px',
        backdropFilter: 'blur(12px)',
        boxShadow: 'var(--shadow-popup)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '11px'
      }}>
        <div style={{ fontWeight: 700, color: '#fff', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.04em' }}>
          Priority & Location Precision
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-indicator" style={{ width: '8px', height: '8px' }}></span>
          <span style={{ color: 'var(--emergency)', fontWeight: 600 }}>Emergency (Accident / Fire / Live Wire)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)', display: 'inline-block' }}></span>
          <span style={{ color: 'var(--warning)' }}>High / Medium (Main Road / Water Leak)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
          <span style={{ color: 'var(--success)' }}>Normal / Resolved (Closed issues)</span>
        </div>
        
        {/* Precision Legend Badges */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '2px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: '#00e59922', color: '#00e599', border: '1px solid #00e59955' }}>EXACT (Street+Landmark)</span>
          <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: '#00f0ff22', color: '#00f0ff', border: '1px solid #00f0ff55' }}>STREET</span>
          <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: '#a855f722', color: '#c084fc', border: '1px solid #a855f755' }}>NEAR_LANDMARK</span>
          <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: '#3b82f622', color: '#60a5fa', border: '1px solid #3b82f655' }}>AREA (Village)</span>
        </div>

        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
          * Coimbatore Location Intelligence: Area coordinates automatically resolved (No citizen GPS required)
        </div>
      </div>
    </div>
  );
}
