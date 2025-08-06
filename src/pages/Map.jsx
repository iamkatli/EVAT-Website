import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import NavBar from '../components/NavBar';
import LocateUser from '../components/LocateUser';
import ClusterMarkers from '../components/ClusterMarkers';
import SmartFilter from '../components/SmartFilter';
import { getChargers } from '../services/chargerService';

// تنظیم آیکون پیش‌فرض Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// کامپوننتی برای مانیتور کردن محدوده دید نقشه
function BoundsWatcher({ onChange }) {
  const map = useMapEvents({
    moveend() {
      const b = map.getBounds();
      onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
    }
  });

  useEffect(() => {
    const b = map.getBounds();
    onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
  }, [map, onChange]);

  return null;
}

export default function Map() {
  // State اصلی فیلترها
  const [filters, setFilters] = useState({
    vehicleType: [],
    chargerType: [],
    chargingSpeed: [],
    priceRange: 100,
    showOnlyAvailable: false,
    darkMode: false,
    showReliability: true // NEW: کنترل Reliability Overlay
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [stations, setStations] = useState([]);
  const [bbox, setBbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // دریافت داده‌ها از API
  useEffect(() => {
    let mounted = true;
    let id;

    const load = async () => {
      try {
        setErr('');
        const data = await getChargers(bbox ? { bbox } : undefined);
        if (mounted) setStations(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setErr(e.message || 'Failed to load chargers');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    id = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [bbox]);

  // اعمال فیلترها روی داده‌های دریافتی
  const filteredStations = useMemo(() => {
    return stations.filter(location => {
      if (filters.vehicleType.length > 0 &&
        !filters.vehicleType.some(type => location.vehicleType?.includes(type))) return false;

      if (filters.chargerType.length > 0 &&
        !filters.chargerType.some(type => location.chargerType?.includes(type))) return false;

      if (filters.chargingSpeed.length > 0 &&
        !filters.chargingSpeed.includes(location.chargingSpeed)) return false;

      if (location.priceRange > filters.priceRange) return false;

      if (filters.showOnlyAvailable && !location.isAvailable) return false;

      return true;
    });
  }, [stations, filters]);

  // Dark mode toggle
  useEffect(() => {
    document.body.classList.toggle('dark-mode', filters.darkMode);
  }, [filters.darkMode]);

  return (
    <div>
      <NavBar />
      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        
        {/* دکمه باز کردن SmartFilter */}
        <button
          className="filter-toggle-button"
          onClick={() => setIsFilterOpen(true)}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000 }}
        >
          🔍 Smart Filters
        </button>

        {/* پیام‌ها */}
        {loading && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1000,
            background: '#fff',
            padding: '6px 10px',
            borderRadius: 6
          }}>
            Loading…
          </div>
        )}
        {err && (
          <div style={{
            position: 'absolute',
            top: 44,
            left: 12,
            zIndex: 1000,
            background: '#ffdddd',
            padding: '6px 10px',
            borderRadius: 6
          }}>
            {err}
          </div>
        )}

        {/* نقشه */}
        <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
          />
          <BoundsWatcher onChange={setBbox} />
          <ClusterMarkers showReliability={filters.showReliability} stations={filteredStations} />
          <LocateUser />
        </MapContainer>

        {/* Smart Filter Modal */}
        <SmartFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={(newFilters) => setFilters(newFilters)}
          filters={filters}
          setFilters={setFilters}
          filteredCount={filteredStations.length}
        />
      </div>
    </div>
  );
}
