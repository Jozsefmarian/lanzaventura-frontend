import { useEffect, useState } from "react";
import axios from "axios";

export default function HotelList({ hotels, searchParams }) {
  const [hotelDetails, setHotelDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const fetchHotelDetails = async () => {
      const results = [];

      for (let i = 0; i < Math.min(hotels.length, 10); i++) {
        const hotel = hotels[i];

        try {
          const res = await axios.post("/api/hotel", {
            hotel_id: hotel.hid,
            checkin: searchParams.checkin,
            checkout: searchParams.checkout,
            guests: searchParams.guests,
            currency: "HUF",
            residency: "HU",
          });

          results.push({
            ...res.data,
            hid: hotel.hid,
            rooms: hotel.rooms,
          });
        } catch (error) {
          console.error("Hotel fetch failed:", error);
        }

        // ⏳ 1 másodperces késleltetés, hogy ne lépjük túl a limitet
        await delay(1000);
      }

      setHotelDetails(results);
      setLoading(false);
    };

    if (hotels && hotels.length > 0 && searchParams) {
      fetchHotelDetails();
    }
  }, [hotels, searchParams]);

  if (loading) {
    return <p>Betöltés.
