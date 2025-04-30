// api/search.js

// Helyben .env fájlból is beolvashatod, ha szeretnéd:
// require('dotenv').config();

export default async function handler(req, res) {
  // Általános CORS-fejlécek minden kérésre
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { RATEHAWK_API_ID, RATEHAWK_API_KEY } = process.env;
  console.log('▶ ENV RATEHAWK_API_ID:', process.env.RATEHAWK_API_ID);
  console.log('▶ ENV RATEHAWK_API_KEY:', process.env.RATEHAWK_API_KEY ? '***SET***' : '***MISSING***');
  console.log('▶ Generated Auth header:', Buffer.from(
    `${process.env.RATEHAWK_API_ID}:${process.env.RATEHAWK_API_KEY}`
  ).toString('base64'));

    if (!RATEHAWK_API_ID || !RATEHAWK_API_KEY) {
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  const params = req.body;

  try {
    const apiRes = await fetch(
      'https://api.worldota.net/api/b2b/v3/search/serp/region/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${RATEHAWK_API_ID}:${RATEHAWK_API_KEY}`).toString('base64')}`,
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
