import React, { useEffect, useContext } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { iconForReliability } from '../utils/chargerIcons';
import { FavouritesContext } from '../context/FavouritesContext';

function ClusterMarkers({ showReliability, stations, onSelectStation, isDark }) {
  const map = useMap();
  const { favourites } = useContext(FavouritesContext);

  useEffect(() => {
    const group = L.markerClusterGroup();

    stations.forEach((st) => {
      const lat = parseFloat(st.latitude);
      const lng = parseFloat(st.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const icon = iconForReliability(showReliability, st.reliability, isDark) || new L.Icon.Default();

      const marker = L.marker([lat, lng], { icon });

      marker.on('click', () => {
        onSelectStation?.(st); 
      });

      group.addLayer(marker);
    });

    map.addLayer(group);

    return () => map.removeLayer(group);
  }, [map, stations, showReliability, onSelectStation]);

  return null;
}

export default ClusterMarkers;
