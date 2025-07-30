import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import NavBar from '../components/NavBar';
import LocateUser from '../components/LocateUser';
import ReliabilityToggle from '../components/ReliabilityToggle';
import ClusterMarkers from '../components/ClusterMarkers';
import { getChargers } from '../services/chargerService';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

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
  const [showReliability, setShowReliability] = useState(true);
  const [stations, setStations] = useState([]);
  const [bbox, setBbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

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
    return () => { mounted = false; clearInterval(id); };
  }, [bbox]);

  return (
    <div>
      <NavBar />
      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        <ReliabilityToggle active={showReliability} onToggle={() => setShowReliability(v => !v)} />
        {loading && <div style={{ position:'absolute', top:12, left:12, zIndex:1000, background:'#fff', padding:'6px 10px', borderRadius:6 }}>Loading…</div>}
        {err && <div style={{ position:'absolute', top:44, left:12, zIndex:1000, background:'#ffdddd', padding:'6px 10px', borderRadius:6 }}>{err}</div>}
        <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='&copy; OpenStreetMap contributors' />
          <BoundsWatcher onChange={setBbox} />
          <ClusterMarkers showReliability={showReliability} stations={stations} />
          <LocateUser />
        </MapContainer>
      </div>
    </div>
  );
}
