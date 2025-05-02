export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let query = req.query.q || "";

  if (query.length < 2) {
    return res.status(400).json({ error: "Too short query." });
  }

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
      body: JSON.stringify({
        query,
        language: "en"
      })
    });

    const data = await response.json();

    console.log("MULTICOMPLETE response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Error accessing Ratehawk", details: err.message });
  }
}
