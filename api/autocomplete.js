// api/autocomplete.js

export default async function handler(req, res) {
  // 1) CORS fejlécek
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2) OPTIONS (preflight) gyors lekezelése
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3) Csak GET-et engedélyezünk
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 4) Lekérdezzük a ?q= paramétert
  const q = (req.query.q || '').trim();
  if (!q) {
    return res.status(200).json({ data: [] });
  }

  // 5) Éles env-ek + trim
  const id = process.env.RATEHAWK_API_ID?.trim();
  const key = process.env.RATEHAWK_API_KEY?.trim();
  if (!id || !key) {
    return res.status(500).json({ error: 'Missing API credentials' });
  }
  const auth = Buffer.from(`${id}:${key}`).toString('base64');

  try {
    // 6) Proxy a multicomplete végpontra
    const apiRes = await fetch(
      'https://api.worldota.net/api/b2b/v3/search/multicomplete/',
      {
        method: 'POST',  // a RateHawk POST-ot vár
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q })
      }
    );
    const json = await apiRes.json();

    // 7) Csak a region típusú találatokat adjuk vissza
    const regions = Array.isArray(json.data)
      ? json.data.filter(item => item.type === 'region')
      : [];

    return res.status(200).json({ data: regions });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

