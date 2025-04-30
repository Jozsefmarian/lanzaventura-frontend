// api/search.js

// api/search.js

export default async function handler(req, res) {
  // 1) CORS-fejlécek minden kérésre
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2) Preflight kérések gyors lekezelése
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3) Csak POST-ot engedélyezünk
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 4) Környezeti változók beolvasása és trim
  const id = process.env.RATEHAWK_API_ID?.trim();
  const key = process.env.RATEHAWK_API_KEY?.trim();

  if (!id || !key) {
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  const params = req.body;

  try {
    // 5) Proxy a RateHawk region SERP végpontjához
    const apiRes = await fetch(
      'https://api.worldota.net/api/b2b/v3/search/serp/region/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${id}:${key}`).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      }
    );

    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);

  } catch (err) {
    // 6) Hiba esetén 500-as válasz
    return res.status(500).json({ error: err.message });
  }
}

