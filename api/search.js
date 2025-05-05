import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      "https://api.worldota.net/api/b2b/v3/search/serp/region/",
      req.body,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.RATEHAWK_API_ID}:${process.env.RATEHAWK_API_KEY}`).toString("base64")}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Proxy hiba:", error?.response?.data || error.message);
    return res.status(error?.response?.status || 500).json({
      error: error?.response?.data || { message: "Internal server error" }
    });
  }
}
