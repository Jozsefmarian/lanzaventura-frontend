export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const username = process.env.RATEHAWK_API_ID;
  const password = process.env.RATEHAWK_API_KEY;
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch("https://api.worldota.net/api/b2b/v3/search/serp/hotels/", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba a keresés során", details: err.message });
  }
}