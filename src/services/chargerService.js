import chargerStations from '../data/chargerStations';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

function normalize(s) {
  return {
    id: s.id,
    name: s.name ?? 'Unknown',
    lat: Number(s.lat),
    lng: Number(s.lng),
    reliability: typeof s.reliability === 'number' ? s.reliability : undefined,
    lastUpdated: s.lastUpdated ?? null,


    vehicleType: s.vehicleType ?? [],
    chargerType: s.chargerType ?? [],
    chargingSpeed: s.chargingSpeed ?? '',
    priceRange: typeof s.priceRange === 'number' ? s.priceRange : 0,
    isAvailable: typeof s.isAvailable === 'boolean' ? s.isAvailable : false
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
    return chargerStations
      .filter(s => inBbox(s, bbox))
      .map(normalize)
      .map(jitter);
  }
}
