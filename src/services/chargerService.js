import chargerStations from '../data/chargerStations';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

function normalize(s) {
  return {
    id: s.id,
    name: s.name ?? 'Unknown',
    lat: Number(s.lat),
    lng: Number(s.lng),
    reliability: typeof s.reliability === 'number' ? s.reliability : undefined,
    lastUpdated: s.lastUpdated ?? null
  };
}

function inBbox(st, bbox) {
  if (!bbox) return true;
  const [minLng, minLat, maxLng, maxLat] = bbox;
  return st.lng >= minLng && st.lng <= maxLng && st.lat >= minLat && st.lat <= maxLat;
}

function jitter(st) {
  if (typeof st.reliability !== 'number') return st;
  const delta = (Math.random() - 0.5) * 0.02;
  const r = Math.max(0, Math.min(1, st.reliability + delta));
  return { ...st, reliability: r, lastUpdated: new Date().toISOString() };
}

export async function getChargers({ bbox } = {}) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    return chargerStations.filter(s => inBbox(s, bbox)).map(normalize).map(jitter);
  }

}

// import { fetchJson } from './http';

// export async function getChargers({ bbox } = {}) {
//   const q = bbox ? `?bbox=${bbox.join(',')}` : '';
//   const data = await fetchJson(`/api/chargers${q}`);
//   return Array.isArray(data) ? data.map(s => ({
//     id: s.id,
//     name: s.name ?? 'Unknown',
//     lat: Number(s.lat ?? s.latitude),
//     lng: Number(s.lng ?? s.longitude),
//     reliability: typeof s.reliability === 'number' ? s.reliability : undefined,
//     lastUpdated: s.lastUpdated ?? null
//   })) : [];
// }
