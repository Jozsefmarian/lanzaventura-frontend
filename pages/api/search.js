import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { region_id, checkin, checkout, residency, language, guests, currency } = req.body;

    const payload = {
      region_id,
      checkin,
      checkout,
      residency,
      language,
      guests,
      currency
    };

    const response = await axios.post(
      "https://api.worldota.net/api/b2b/v3/search/serp/region/",
      payload,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.RATEHAWK_API_ID}:${process.env.RATEHAWK_API_KEY}`).toString("base64")}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("🔴 Ratehawk API hiba:", error.response?.data || error.message);
    res.status(500).json({
      error: "API request failed",
      detail: error.response?.data || error.message
    });
  }
}
