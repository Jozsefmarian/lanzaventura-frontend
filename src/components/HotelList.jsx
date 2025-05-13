import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function HotelList({ hotels, searchParams }) {
  const [hotelDetails, setHotelDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

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
            language: "en",
          });

          results.push({
            ...res.data,
            hid: hotel.hid,
            rooms: hotel.rooms,
          });
        } catch (error) {
          console.error("❌ Hotel info fetch failed:", error?.response?.data || error.message);
        }

        await delay(1000); // max. 10 request per minute
      }

      setHotelDetails(results);
      setLoading(false);
    };

    if (!hasFetched.current && hotels.length > 0 && searchParams) {
      hasFetched.current = true;
      fetchHotelDetails();
    }
  }, [hotels, searchParams]);

  if (loading) {
    return <p>Betöltés...</p>;
  }

  return (
    <div className="hotel-list">
      {hotelDetails.map((hotel) => (
        <div key={hotel.hid} className="hotel-card">
          <h2>{hotel.name}</h2>
          <p>{hotel.address}</p>
          {hotel.main_photo?.url && (
            <img src={hotel.main_photo.url} alt={hotel.name} />
          )}
          <p>
            {hotel.min_price} {hotel.currency}
          </p>
        </div>
      ))}
    </div>
  );
}
