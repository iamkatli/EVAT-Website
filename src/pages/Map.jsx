import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import NavBar from '../components/NavBar';
import LocateUser from '../components/LocateUser';
import ReliabilityToggle from '../components/ReliabilityToggle';
import ClusterMarkers from '../components/ClusterMarkers';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Map() {
  const [showReliability, setShowReliability] = useState(true);

  return (
    <div>
      <NavBar />
      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        <ReliabilityToggle
          active={showReliability}
          onToggle={() => setShowReliability(v => !v)}
        />
        <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
          />
          <ClusterMarkers showReliability={showReliability} />
          <LocateUser />
        </MapContainer>
      </div>
    </div>
  );
}
