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


// styles
import '../styles/SmartFilter.css';
import '../styles/LocateUserButton.css';
import '../styles/DarkModeToggle.css';

// Configure default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Watches map bounds (bbox) and reports them upward
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
  const { user } = useContext(UserContext);

  const [filters, setFilters] = useState({
    vehicleType: [],
    chargerType: [],
    chargingSpeed: [],
    priceRange: 100,
    showOnlyAvailable: false,
    darkMode: false,
    showReliability: true
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [stations, setStations] = useState([]);
  const [bbox, setBbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // local UI state for the floating dark-mode button icon
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.body.classList.contains('dark-mode')
  );

  // keep body class in sync when SmartFilter toggles filters.darkMode
  useEffect(() => {
    const desired = Boolean(filters.darkMode);
    const hasClass = document.body.classList.contains('dark-mode');
    if (desired !== hasClass) {
      document.body.classList.toggle('dark-mode', desired);
    }
    setIsDark(document.body.classList.contains('dark-mode'));
  }, [filters.darkMode]);

  // Fetch chargers only when token available and bbox changes
  useEffect(() => {
    let mounted = true;
    let id;

    if (!user?.token) {
      setLoading(false);
      return;
    }

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

    setLoading(true);
    load();
    id = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [bbox, user?.token]);

  // Apply filters on stations
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      const { connection_type, power_output, cost } = station;

      if (filters.chargerType.length > 0 && !filters.chargerType.includes(connection_type)) {
        return false;
      }

      if (filters.chargingSpeed.length > 0) {
        const speed = parseFloat(power_output);
        const ok = filters.chargingSpeed.some(range => {
          if (range === '<22kW') return speed < 22;
          if (range === '22-50kW') return speed >= 22 && speed <= 50;
          if (range === '50-150kW') return speed > 50 && speed <= 150;
          if (range === '150kW+') return speed > 150;
          return false;
        });
        if (!ok) return false;
      }

      if (typeof cost === 'string') {
        const match = cost.match(/\$([\d.]+)/);
        const price = match ? parseFloat(match[1]) : 0;
        if (price > filters.priceRange) return false;
      }

      if (filters.showOnlyAvailable && station.is_operational !== 'true') {
        return false;
      }

      return true;
    });
  }, [stations, filters]);

  return (
    <div>
      <NavBar />
      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        <button
          className="filter-toggle-button"
          onClick={() => setIsFilterOpen(true)}
        >
          🔍 Smart Filters
        </button>

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

        <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <BoundsWatcher onChange={setBbox} />
          <ClusterMarkers showReliability={filters.showReliability} stations={filteredStations} />
          <LocateUser />
        </MapContainer>

        <button
          className="dark-mode-floating"
          aria-label="Toggle dark mode"
          onClick={() => {
            document.body.classList.toggle('dark-mode');
            const nowDark = document.body.classList.contains('dark-mode');
            setIsDark(nowDark);
            setFilters(prev => ({ ...prev, darkMode: nowDark }));
          }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '🌙' : '☀️'}
        </button>

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
