// api/autocomplete.js
export default async function handler(req, res) {
  const q = (req.query.q || '').trim();
  res.setHeader('Access-Control-Allow-Origin','*');
  if (!q) return res.status(200).json({ data: [] });
  const id = process.env.RATEHAWK_API_ID.trim();
  const key = process.env.RATEHAWK_API_KEY.trim();
  const auth = Buffer.from(`${id}:${key}`).toString('base64');
  const apiRes = await fetch(
    'https://api.worldota.net/api/b2b/v3/search/multicomplete/',
    {
      method:'POST',
      headers:{
        'Authorization': `Basic ${auth}`,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({ q })
    }
  );
  const json = await apiRes.json();
  const regions = json.data.filter(item => item.type==='region');
  res.status(200).json({ data: regions });
}
