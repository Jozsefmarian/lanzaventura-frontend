export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method==='OPTIONS') return res.status(200).end();
  if (req.method!=='GET') return res.status(405).json({ error:'Method Not Allowed' });
  const q = (req.query.q||'').trim();
  if (!q) return res.status(200).json({ data: [] });
  const id = process.env.RATEHAWK_API_ID?.trim();
  const key = process.env.RATEHAWK_API_KEY?.trim();
  const auth = Buffer.from(`${id}:${key}`).toString('base64');
  const apiRes = await fetch(
    'https://api.worldota.net/api/b2b/v3/search/multicomplete/',
    {
      method:'POST',
      headers:{
        'Authorization':`Basic ${auth}`,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({ q })
    }
  );
  const json = await apiRes.json();
  const regions = Array.isArray(json.data) ? json.data.filter(item => item.type==='City' || item.type==='region') : [];
  return res.status(200).json({ data: regions });
}
