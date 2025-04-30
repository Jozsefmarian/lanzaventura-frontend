// api/search.js

// Helyben .env fájlból is beolvashatod, ha szeretnéd:
// require('dotenv').config();

export default async function handler(req, res) {
  // Általános CORS-fejlécek minden kérésre
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight kérések lekezelése
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Csak POST-ra válaszolunk
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // A POST esetén viszont szükségesek az env-változók:
  const { VITE_RATEHAWK_API_ID, VITE_RATEHAWK_API_KEY } = process.env;
  if (!VITE_RATEHAWK_API_ID || !VITE_RATEHAWK_API_KEY) {
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  const params = req.body;

  try {
    const apiRes = await fetch(
      'https://api.worldota.net/api/b2b/v3/search/serp/region/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${VITE_RATEHAWK_API_ID}:${VITE_RATEHAWK_API_KEY}`
          ).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      }
    );
    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
