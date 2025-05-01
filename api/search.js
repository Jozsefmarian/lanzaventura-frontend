// api/search.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1) Logoljuk a bejövő paramétereket
  console.log('▶ /api/search params:', req.body);

  const params = req.body;
  const id = process.env.RATEHAWK_API_ID?.trim();
  const key = process.env.RATEHAWK_API_KEY?.trim();

  if (!id || !key) {
    console.error('❌ Missing credentials:', { id, key });
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  const auth = Buffer.from(`${id}:${key}`).toString('base64');

  try {
    // 2) Hívjuk a hotels-végpontot
    const apiRes = await fetch(
      'https://api.worldota.net/api/b2b/v3/search/serp/hotels/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type':  'application/json'
        },
        body: JSON.stringify(params)
      }
    );

    // 3) Logoljuk a status-t és a nyers választ
    console.log('▶ RateHawk status:', apiRes.status);
    const text = await apiRes.text();
    console.log('▶ RateHawk raw response:', text);

    let json;
    try {
      json = JSON.parse(text);
    } catch(parseErr) {
      console.error('❌ JSON.parse hiba:', parseErr);
      return res.status(500).json({ error: 'Invalid JSON from RateHawk' });
    }

    // 4) Ha a RateHawk hibát jelzett
    if (json.status === 'error') {
      console.error('❌ RateHawk error payload:', json);
      return res.status(500).json({ error: json.error || 'RateHawk returned error' });
    }

    // 5) Visszaküldjük a hotels tömböt
    const hotels = json.data?.hotels || [];
    console.log(`▶ Forwarding ${hotels.length} hotels`);
    return res.status(200).json({ hotels });

  } catch (err) {
    console.error('❌ Funkció hiba:', err);
    return res.status(500).json({ error: err.message });
  }
}
