import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import NavBar from '../components/NavBar';
import SmartFilter from '../components/SmartFilter';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    vehicleType: [],
    chargerType: [],
    chargingSpeed: [],
    priceRange: 100,
    showOnlyAvailable: false,
    darkMode: false
  });

  // Filter the charger locations based on selected filters
  const filteredLocations = useMemo(() => {
    return chargerLocations.filter(location => {
      // Vehicle Type filter
      if (filters.vehicleType.length > 0) {
        const hasMatchingVehicleType = filters.vehicleType.some(type => 
          location.vehicleType.includes(type)
        );
        if (!hasMatchingVehicleType) return false;
      }

      // Charger Type filter
      if (filters.chargerType.length > 0) {
        const hasMatchingChargerType = filters.chargerType.some(type => 
          location.chargerType.includes(type)
        );
        if (!hasMatchingChargerType) return false;
      }

      // Charging Speed filter
      if (filters.chargingSpeed.length > 0) {
        if (!filters.chargingSpeed.includes(location.chargingSpeed)) {
          return false;
        }
      }

      // Price Range filter
      if (location.priceRange > filters.priceRange) {
        return false;
      }

      // Availability filter
      if (filters.showOnlyAvailable && !location.isAvailable) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Apply dark mode if enabled
  React.useEffect(() => {
    if (filters.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [filters.darkMode]);

  return (
    <div>
      <NavBar />
      <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
        {/* Filter Button */}
        <button 
          className="filter-toggle-button"
          onClick={() => setIsFilterOpen(true)}
        >
          🔍 Smart Filters
        </button>

        <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
          />
          {filteredLocations.map((station) => (
            <Marker key={station.id} position={[station.lat, station.lng]} icon={chargerIcon}>
              <Popup>
                <div>
                  <h3>{station.name}</h3>
                  <p><strong>Vehicle Types:</strong> {station.vehicleType.join(', ')}</p>
                  <p><strong>Charger Types:</strong> {station.chargerType.join(', ')}</p>
                  <p><strong>Charging Speed:</strong> {station.chargingSpeed}</p>
                  <p><strong>Price:</strong> ${station.priceRange}</p>
                  <p><strong>Status:</strong> <span style={{ color: station.isAvailable ? '#28a745' : '#dc3545' }}>
                    {station.isAvailable ? 'Available' : 'Unavailable'}
                  </span></p>
                </div>
              </Popup>
            </Marker>
          ))}
          <LocateUser />
        </MapContainer>

        {/* Smart Filter Modal */}
        <SmartFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          filters={filters}
          setFilters={setFilters}
          filteredCount={filteredLocations.length}
        />
      </div>
    </div>
  );
}

export default Map;

