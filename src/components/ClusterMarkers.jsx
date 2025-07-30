import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { iconForReliability } from '../map/chargerIcons';

function ClusterMarkers({ showReliability, stations }) {
  const map = useMap();

  useEffect(() => {
    const group = L.markerClusterGroup();
    stations.forEach(st => {
      const icon = iconForReliability(showReliability, st.reliability);
      const html = `<strong>${st.name}</strong>${showReliability && typeof st.reliability === 'number' ? `<br/>Reliability: ${Math.round(st.reliability * 100)}%` : ''}`;
      group.addLayer(L.marker([st.lat, st.lng], { icon }).bindPopup(html));
    });
    map.addLayer(group);
    return () => map.removeLayer(group);
  }, [map, showReliability, stations]);

  return null;
}

export default ClusterMarkers;
