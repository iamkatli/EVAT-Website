import L from 'leaflet';
import chargerGreen from '../assets/charger-icon-green.png';
import chargerYellow from '../assets/charger-icon-yellow.png';
import chargerRed from '../assets/charger-icon-red.png';
import chargerBlack from '../assets/charger-icon-black.png';

export const icons = {
  green: new L.Icon({ iconUrl: chargerGreen,  iconSize: [32, 32], iconAnchor: [16, 32] }),
  yellow:new L.Icon({ iconUrl: chargerYellow, iconSize: [32, 32], iconAnchor: [16, 32] }),
  red:   new L.Icon({ iconUrl: chargerRed,    iconSize: [32, 32], iconAnchor: [16, 32] }),
  black: new L.Icon({ iconUrl: chargerBlack,  iconSize: [32, 32], iconAnchor: [16, 32] })
};

export function iconForReliability(showReliability, reliability) {
  if (!showReliability) return icons.black;
  if (typeof reliability !== 'number') return icons.black;
  if (reliability >= 0.8) return icons.green;
  if (reliability >= 0.5) return icons.yellow;
  return icons.red;
}
