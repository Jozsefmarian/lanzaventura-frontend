export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const params = req.body;  // vagy { region_id, ids, ... }

  const id  = process.env.RATEHAWK_API_ID?.trim();
  const key = process.env.RATEHAWK_API_KEY?.trim();
  if (!id || !key) {
    return res.status(500).json({ error: 'Missing API credentials' });
  }
  const auth = Buffer.from(`${id}:${key}`).toString('base64');

  // Döntés: ids → /hotels/, egyébként → /region/
  const url = Array.isArray(params.ids) && params.ids.length > 0
    ? 'https://api.worldota.net/api/b2b/v3/search/serp/hotels/'
    : 'https://api.worldota.net/api/b2b/v3/search/serp/region/';

  try {
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify(params)
    });

    const json = await apiRes.json();
    if (json.status === 'error') {
      return res.status(500).json({ error: json.error || 'RateHawk error' });
    }

    const hotels = json.data?.hotels || [];
    return res.status(200).json({ hotels });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
