import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { hotel_id, checkin, checkout, guests, currency, residency } = req.body;
  console.log("📦 /api/hotel kapott body:", req.body);

  try {
    const response = await axios.post(
      "https://api.worldota.net/api/b2b/v3/search/hp",
      {
        hid: hotel_id,
        checkin,
        checkout,
        guests,
        currency,
        residency,
        language: "en"
      },
      {
        auth: {
          username: process.env.RATEHAWK_USER_ID,
          password: process.env.RATEHAWK_API_KEY,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Hotel info fetch failed:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch hotel info",
      details: error?.response?.data || error.message,
    });
  }
}
