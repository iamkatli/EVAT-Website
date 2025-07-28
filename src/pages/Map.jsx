import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocateUser from "../components/LocateUser";
import chargerIconUrl from "/public/charger-station-icon.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const chargerIcon = new L.Icon({
  iconUrl: chargerIconUrl,
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -40],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41]
});

const chargerLocations = [
  { id: 1, lat: -38.1582, lng: 144.3745, name: 'East Geelong Station' },
  { id: 2, lat: -38.1800, lng: 144.3500, name: 'Belmont Station' },
  { id: 3, lat: -38.2054, lng: 144.3393, name: 'Grovedale Station' },
  { id: 4, lat: -38.1407, lng: 144.3367, name: 'Geelong West Station' },
];

function Map() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; OpenStreetMap contributors'
        />
        {chargerLocations.map((station) => (
          <Marker key={station.id} position={[station.lat, station.lng]} icon={chargerIcon}>
            <Popup >{station.name}</Popup>
          </Marker>
        ))}
        <LocateUser />
      </MapContainer>
    </div>
  );
}

export default Map;

