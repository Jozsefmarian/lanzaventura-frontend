import axios from "axios";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "GET") {
    return res.status(405).json({ error: "Only GET method allowed" });
  }

  try {
    const response = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/info/",
      {
        hotel_id: id,
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

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Ratehawk hotel/info error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Hotel info fetch failed" });
  }
}
