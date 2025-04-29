// api/search.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { VITE_RATEHAWK_API_ID, VITE_RATEHAWK_API_KEY } = process.env;
  const params = req.body;

  try {
    const response = await fetch('https://api.worldota.net/api/b2b/v3/search/serp/hotels/', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${VITE_RATEHAWK_API_ID}:${VITE_RATEHAWK_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const data = await response.json();

    // Engedélyezzük a CORS-t a frontendre
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
