export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    checkin,
    checkout,
    residency,
    nationality,
    currency,
    guests,
    ids,
    hids
  } = req.body;

  const payload = {
    checkin,
    checkout,
    residency,
    nationality,
    currency,
    guests
  };

  if (ids) {
    payload.ids = ids.map(String);
  } else if (hids) {
    payload.hids = hids.map(String);
  }

  console.log("🔹 Kimenő Ratehawk keresési payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch("https://api.worldota.net/api/b2b/v3/search/serp/hotels/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${process.env.RATEHAWK_API_ID}:${process.env.RATEHAWK_API_KEY}`).toString("base64")
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🔸 API hiba:", data);
      return res.status(response.status).json({ error: data });
    }

    console.log("✅ Találatok:", JSON.stringify(data, null, 2));
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Szerver hiba:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
