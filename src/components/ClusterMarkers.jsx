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
      const lat = st.latitude;
      const lng = st.longitude;

      // Skip invalid coordinates
      if (typeof lat !== 'number' || typeof lng !== 'number') return;

      const icon = iconForReliability(showReliability, st.reliability);
      const html = `
        <strong>${st.operator || 'Unknown Operator'}</strong><br/>
        Type: ${st.connection_type || 'N/A'}<br/>
        Power: ${st.power_output || 'N/A'} kW<br/>
        Cost: ${st.cost || 'N/A'}<br/>
        ${showReliability && typeof st.reliability === 'number' 
          ? `Reliability: ${Math.round(st.reliability * 100)}%<br/>` 
          : ''}
        Access: ${st.access_key_required === 'true' ? 'Restricted' : 'Open'}
      `;

      group.addLayer(
        L.marker([lat, lng], { icon }).bindPopup(html)
      );
    });

    map.addLayer(group);
    return () => map.removeLayer(group);
  }, [map, showReliability, stations]);

  return null;
}

export default ClusterMarkers;
