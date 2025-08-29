import React, { useEffect, useContext } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { iconForReliability } from '../utils/chargerIcons';
import { FavouritesContext } from '../context/FavouritesContext';

function ClusterMarkers({ showReliability, stations, onSelectStation }) {
  const map = useMap();
  const { favourites, toggleFavourite } = useContext(FavouritesContext);

  useEffect(() => {
    const group = L.markerClusterGroup();

    stations.forEach((st) => {
      const lat = parseFloat(st.latitude);
      const lng = parseFloat(st.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const icon = iconForReliability(showReliability, st.reliability) || new L.Icon.Default();

      // Build HTML popup
      const isFav = favourites.some((s) => (typeof s === 'object' ? s.id : s) === st.id);

      const html = `
        <div style="min-width:200px">
          <strong>${st.operator || 'Unknown Operator'}</strong><br/>
          Type: ${st.connection_type || 'N/A'}<br/>
          Power: ${st.power_output || 'N/A'} kW<br/>
          Cost: ${st.cost || 'N/A'}<br/>
          ${showReliability && typeof st.reliability === 'number'
          ? `Reliability: ${Math.round(st.reliability * 100)}%<br/>`
          : ''}
          Access: ${st.access_key_required === 'true' ? 'Restricted' : 'Open'}<br/>
          <button id="fav-btn-${st.id}" style="background:none;border:none;cursor:pointer;font-size:1.2rem;">
            ${isFav ? '❤️' : '🤍'}
          </button>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon })
        .bindPopup(html)
        .on('click', () => onSelectStation?.(st));


      // Attach favourite toggle after popup opens
      marker.on('popupopen', () => {
        const btn = document.getElementById(`fav-btn-${st.id}`);
        if (!btn) return;

        btn.onclick = () => {
          toggleFavourite(st); // update React state
          btn.textContent = btn.textContent === '❤️' ? '🤍' : '❤️';
        };
      });

      group.addLayer(marker);
    });

    map.addLayer(group);

    return () => map.removeLayer(group);
  }, [map, stations, showReliability, toggleFavourite]);

  return null;
}

export default ClusterMarkers;