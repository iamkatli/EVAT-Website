import React, { useEffect, useState, useMemo, useContext } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import NavBar from '../components/NavBar';
import LocateUser from '../components/LocateUser';
import ClusterMarkers from '../components/ClusterMarkers';
import SmartFilter from '../components/SmartFilter';
import { UserContext } from '../context/user';
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
  const { user } = useContext(UserContext);
  console.log("User context:", user);
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
        const data = await getChargers(user, bbox ? { bbox } : undefined);
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
  }, [bbox, user]);

  // اعمال فیلترها روی داده‌های دریافتی
const filteredStations = useMemo(() => {
  return stations.filter(station => {
    const {
      connection_type,
      power_output,
      cost,
      is_operational
    } = station;

    // Filter by Charger Type
    if (
      filters.chargerType.length > 0 &&
      !filters.chargerType.includes(connection_type)
    ) {
      return false;
    }

    // Filter by Charging Speed (based on power_output)
    if (filters.chargingSpeed.length > 0) {
      const speed = parseFloat(power_output);
      const speedFilter = filters.chargingSpeed.some(range => {
        if (range === '<22kW') return speed < 22;
        if (range === '22-50kW') return speed >= 22 && speed <= 50;
        if (range === '50-150kW') return speed > 50 && speed <= 150;
        if (range === '150kW+') return speed > 150;
        return false;
      });
      if (!speedFilter) return false;
    }

    // Filter by Price Range
    if (typeof cost === 'string') {
      const match = cost.match(/\$([\d.]+)/);
      const price = match ? parseFloat(match[1]) : 0;
      if (price > filters.priceRange) return false;
    }

    // Filter by Availability
    if (filters.showOnlyAvailable && station.is_operational !== 'true') {
      return false;
    }

    return true;
  });
}, [stations, filters]);


  // Dark mode toggle
  useEffect(() => {
    document.body.classList.toggle('dark-mode', filters.darkMode);
  }, [filters.darkMode]);


  //Log filtered stations to console
  useEffect(() => {
  console.log('Filtered stations:', filteredStations);
}, [filteredStations]);

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
