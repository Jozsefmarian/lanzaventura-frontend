export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const RH_USER = process.env.RATEHAWK_USER;     // például: 12146
    const RH_PASSWORD = process.env.RATEHAWK_PASS; // például: a token

    const response = await fetch("https://api.worldota.net/api/b2b/v3/search/serp/hotels/", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${RH_USER}:${RH_PASSWORD}`).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    console.log("🔹 Ratehawk válasz:", JSON.stringify(data, null, 2));

    if (!response.ok || data.status !== "ok") {
      return res.status(400).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Proxy hiba:", error);
    return res.status(500).json({ error: "Proxy error" });
  }
}
