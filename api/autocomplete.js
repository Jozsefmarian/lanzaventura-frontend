// api/autocomplete.js

export default async function handler(req, res) {
  // CORS fejlécek
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const q = (req.query.q || '').trim();
  if (!q) {
    return res.status(200).json({ data: [] });
  }

  const id = process.env.RATEHAWK_API_ID?.trim();
  const key = process.env.RATEHAWK_API_KEY?.trim();
  if (!id || !key) {
    return res.status(500).json({ error: 'Missing API credentials' });
  }
  const auth = Buffer.from(`${id}:${key}`).toString('base64');

+  // Multicomplete GET -- q param in URL, not in body
+  const url = `https://api.worldota.net/api/b2b/v3/search/multicomplete/?q=${encodeURIComponent(q)}`;
+  const apiRes = await fetch(url, {
+    method: 'GET',
+    headers: {
+      'Authorization': `Basic ${auth}`,
+      'Accept': 'application/json'
+    }
+  });

  // Ha kell, debug-logolhatod:
  // console.log('▶ multicomplete status:', apiRes.status);
  // const dump = await apiRes.clone().json();
  // console.log('▶ multicomplete body:', JSON.stringify(dump, null,2));

  const json = await apiRes.json();
  const regions = Array.isArray(json.data)
    ? json.data.filter(item => item.type === 'region')
    : [];

  return res.status(200).json({ data: regions });
}
