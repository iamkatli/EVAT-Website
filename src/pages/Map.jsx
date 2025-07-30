import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import NavBar from '../components/NavBar';
import LocateUser from "../components/LocateUser";
import chargerIconUrl from "../assets/charger-station-icon.png";
import chargerLocations from "../data/chargerLocations";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:   'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:         'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const chargerIcon = new L.Icon({
  iconUrl:    chargerIconUrl,
  iconSize:   [30, 45],
  iconAnchor: [15, 45],
  popupAnchor:[0, -40],
  shadowUrl:  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

function ClusterMarkers() {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup();

    chargerLocations.forEach(station => {
      const marker = L.marker([station.lat, station.lng], { icon: chargerIcon })
        .bindPopup(`<strong>${station.name}</strong>`);
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
