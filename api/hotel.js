import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { hotel_id } = req.body;

  if (!hotel_id) {
    return res.status(400).json({ error: "Missing hotel_id" });
  }

  try {
    const response = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/info/",
      {
        hotel_id,
        language: "en",
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
    console.error("❌ Hotel info fetch failed:", error?.response?.data || error.message);
    return res.status(500).json({
      error: "Failed to fetch hotel info",
      details: error?.response?.data || error.message,
    });
  }
}
