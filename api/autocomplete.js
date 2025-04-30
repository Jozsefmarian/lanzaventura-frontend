// api/autocomplete.js

export default async function handler(req, res) {
  // CORS fejlécek
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  // Csak GET-et engedélyezünk innen
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const q = (req.query.q || '').trim();
  if (!q) {
    return res.status(200).json({ data: [] });
  }

  // Env változók
  const id = process.env.RATEHAWK_API_ID?.trim();
  const key = process.env.RATEHAWK_API_KEY?.trim();
  if (!id || !key) {
    return res.status(500).json({ error: 'Missing API credentials' });
  }
  const auth = Buffer.from(`${id}:${key}`).toString('base64');

  try {
    // IDE KÜLDJÜK POST-BAN a RateHawk multicomplete-nek
    const apiRes = await fetch(
      'https://api.worldota.net/api/b2b/v3/search/multicomplete/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q })
      }
    );

    const json = await apiRes.json();
    const regions = Array.isArray(json.data)
      ? json.data.filter(item => item.type === 'region')
      : [];

    return res.status(200).json({ data: regions });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
