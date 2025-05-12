export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST allowed" }), { status: 405 });
  }

  try {
    const body = await req.json();

    const {
      region_id,
      checkin,
      checkout,
      residency,
      language,
      currency,
      guests,
    } = body;

    const authHeader = "Basic " + btoa(`${process.env.RATEHAWK_USER_ID}:${process.env.RATEHAWK_API_KEY}`);

    // 1. Lekérjük a hoteleket a régióhoz
    const regionRes = await fetch("https://api.worldota.net/api/b2b/v3/search/serp/region/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        region_id,
        checkin,
        checkout,
        residency,
        language,
        currency,
        guests,
      }),
    });

    const regionData = await regionRes.json();

    if (regionData.status !== "ok" || !Array.isArray(regionData.data?.hotels)) {
      return new Response(JSON.stringify({ error: "Region search failed", details: regionData }), { status: 500 });
    }

    const hids = regionData.data.hotels
      .map((h) => h.hid)
      .filter((id) => typeof id === "number" && !isNaN(id))
      .slice(0, 100);

    // 2. Részletes hotelinfó hívás
    const hotelRes = await fetch("https://api.worldota.net/api/b2b/v3/search/serp/hotels/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        hids,
        checkin,
        checkout,
        residency,
        language,
        currency,
        guests,
      }),
    });

    const hotelData = await hotelRes.json();

    if (hotelData.status !== "ok" || !Array.isArray(hotelData.data?.hotels)) {
      return new Response(JSON.stringify({ error: "Hotel search failed", details: hotelData }), { status: 500 });
    }

    const hotels = hotelData.data.hotels.map((hotel) => {
      const firstRate = hotel.rates?.[0];
      const payment = firstRate?.payment_options?.payment_types?.[0];

      return {
        id: hotel.hid,
        name: firstRate?.room_name || "Hotel",
        address: "Not available",
        mainPhoto: firstRate?.main_photo_url?.replace("{size}", "400x300") || null,
        price: payment?.show_amount || null,
        currency: payment?.show_currency_code || currency,
      };
    });

    return new Response(JSON.stringify({ hotels: hotelData.data.hotels }), {
  headers: { "Content-Type": "application/json" },
  status: 200,
});
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unhandled error", details: error.message }), { status: 500 });
  }
}
