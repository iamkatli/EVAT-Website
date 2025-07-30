import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import chargerGreen from '../assets/charger-icon-green.png';
import chargerYellow from '../assets/charger-icon-yellow.png';
import chargerRed from '../assets/charger-icon-red.png';
import chargerBlack from '../assets/charger-icon-black.png';
import chargerStations from '../data/chargerStations';

const greenIcon = new L.Icon({ iconUrl: chargerGreen, iconSize: [32, 32], iconAnchor: [16, 32] });
const yellowIcon = new L.Icon({ iconUrl: chargerYellow, iconSize: [32, 32], iconAnchor: [16, 32] });
const redIcon = new L.Icon({ iconUrl: chargerRed, iconSize: [32, 32], iconAnchor: [16, 32] });
const blackIcon = new L.Icon({ iconUrl: chargerBlack, iconSize: [32, 32], iconAnchor: [16, 32] });

export default function ClusterMarkers({ showReliability }) {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup();

    chargerStations.forEach(station => {
      let icon = blackIcon;
      if (showReliability) {
        if (station.reliability >= 0.8) icon = greenIcon;
        else if (station.reliability >= 0.5) icon = yellowIcon;
        else icon = redIcon;
      }
      const text = typeof station.reliability === 'number'
        ? `Reliability: ${Math.round(station.reliability * 100)}%`
        : '';
      const marker = L.marker([station.lat, station.lng], { icon })
        .bindPopup(`<strong>${station.name}</strong>${showReliability && text ? `<br/>${text}` : ''}`);
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);
    return () => { map.removeLayer(clusterGroup); };
  }, [map, showReliability]);

  return null;
}
