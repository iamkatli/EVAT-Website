import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import NavBar from '../components/NavBar';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocateUser from "../components/LocateUser";
import chargerIconUrl from "../assets/charger-station-icon.png";
import chargerLocations from "../data/chargerLocations";
import MarkerClusterGroup from 'react-leaflet-cluster';


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
          {chargerLocations.map((station) => (
            <Marker key={station.id} position={[station.lat, station.lng]} icon={chargerIcon}>
              <Popup >{station.name}</Popup>
            </Marker>
          ))}
          <LocateUser />
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;

