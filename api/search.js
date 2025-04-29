// api/search.js
import fetch from 'node-fetch';  // vagy plain 'fetch' Node18+ esetén

export default async function handler(req, res) {
  // 1) Általános CORS-fejlécek minden kérésre
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2) Preflight kezelés
  if (req.method === 'OPTIONS') {
    // Csak a fejléceket küldjük vissza, nincs body
    return res.status(200).end();
  }

  // 3) Valódi POST kérést engedélyezünk csak
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 4) Ha ideértünk, akkor POST: proxy a Ratehawk API felé
  const { VITE_RATEHAWK_API_ID, VITE_RATEHAWK_API_KEY } = process.env;
  const params = req.body;

  try {
    const apiRes = await fetch(
      'https://api.worldota.net/api/b2b/v3/search/serp/hotels/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${VITE_RATEHAWK_API_ID}:${VITE_RATEHAWK_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params),
      }
    );
    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
