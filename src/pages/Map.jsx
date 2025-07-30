import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import NavBar from '../components/NavBar';
import LocateUser from "../components/LocateUser";
import chargerGreen from '../assets/charger-icon-green.png';
import chargerYellow from '../assets/charger-icon-yellow.png';
import chargerRed from '../assets/charger-icon-red.png';
import chargerLocations from "../data/chargerLocations";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: chargerGreen,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
const yellowIcon = new L.Icon({
  iconUrl: chargerYellow,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
const redIcon = new L.Icon({
  iconUrl: chargerRed,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function ClusterMarkers() {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup();

    chargerLocations.forEach(station => {
      let icon = redIcon;
      if (station.reliability >= 0.8) icon = greenIcon;
      else if (station.reliability >= 0.5) icon = yellowIcon;

      const marker = L.marker([station.lat, station.lng], { icon })
        .bindPopup(`
          <strong>${station.name}</strong><br/>
          Reliability: ${Math.round(station.reliability * 100)}%
        `);

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);
    return () => { map.removeLayer(clusterGroup); };
  }, [map]);

  return null;
}

function Map() {
  return (
    <div>
      <NavBar />
      <div style={{ height: '100vh', width: '100%' }}>
        <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
          />
          <ClusterMarkers />
          <LocateUser />
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;
