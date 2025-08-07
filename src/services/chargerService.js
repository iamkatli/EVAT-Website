export async function getChargers(user, params = {}) {
  const baseUrl = 'https://evat.ddns.net:443/api/chargers';
  const url = new URL(baseUrl);

  if (params.bbox) {
    url.searchParams.set('bbox', params.bbox.join(','));
  }

  console.log(`Bearer ${user?.token}`);

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`
    }
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: Failed to fetch chargers`);
  }

  const data = await res.json();
  console.log('Chargers API response:', data);
  return data.data;
}
