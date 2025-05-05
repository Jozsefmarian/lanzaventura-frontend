import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { RATEHAWK_API_ID, RATEHAWK_API_KEY } = process.env;

  if (!RATEHAWK_API_ID || !RATEHAWK_API_KEY) {
    console.error("❌ RATEHAWK kulcsok hiányoznak az env-ből");
    return res.status(500).json({ error: "Missing API credentials" });
  }

  const authHeader = `Basic ${Buffer.from(`${RATEHAWK_API_ID}:${RATEHAWK_API_KEY}`).toString("base64")}`;

  console.log("📦 Kérés test:", req.body);
  console.log("🔐 Auth header:", authHeader);

  try {
    const response = await axios.post(
      "https://api.worldota.net/api/b2b/v3/search/serp/region/",
      req.body,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Ratehawk válasz:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("🔴 Ratehawk API hiba:", error.response?.data || error.message);
    res.status(500).json({
      error: "API request failed",
      detail: error.response?.data || error.message
    });
  }
}
