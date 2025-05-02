export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const username = process.env.RATEHAWK_API_ID;
  const password = process.env.RATEHAWK_API_KEY;
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch("https://api.worldota.net/api/b2b/v3/hotel/region/dump/", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    // Ideiglenesen nem cache-elünk!
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: "Hiba a régiók lekérésekor", details: err.message });
  }
}
