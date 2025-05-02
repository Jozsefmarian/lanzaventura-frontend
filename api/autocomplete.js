export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let query = req.query.q || "";

  if (query.length < 2) {
    return res.status(400).json({ error: "Túl rövid keresési kifejezés." });
  }

  // Normalizált keresés: Budapest
  query = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();

  const username = process.env.RATEHAWK_API_ID;
  const password = process.env.RATEHAWK_API_KEY;
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch("https://api.worldota.net/api/b2b/v3/search/multicomplete/", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    // ⚠️ Logoljuk a teljes választ Vercelbe
    console.log("RATEHAWK MULTICOMPLETE VÁLASZ:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("HIBA A RATEHAWK-TÓL:", data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Hiba a Ratehawk API elérésekor:", err);
    return res.status(500).json({ error: "Kapcsolódási hiba", details: err.message });
  }
}
