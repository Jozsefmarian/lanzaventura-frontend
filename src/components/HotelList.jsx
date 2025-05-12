import { useEffect, useState } from "react";
import axios from "axios";

export default function HotelList({ hotels }) {
  const [hotelInfos, setHotelInfos] = useState([]);

  useEffect(() => {
    const fetchHotelInfos = async () => {
      try {
        cconst results = await Promise.all(
  hotels.map((hotel) =>
    axios.post("/api/hotel", { hotel_id: hotel.hid }).then((res) => ({
      ...res.data,
      hid: hotel.hid,
      rooms: hotel.rooms,
    }))
  )
);
        setHotelInfos(results);
      } catch (error) {
        console.error("Hiba a hotelinfók lekérésekor:", error);
      }
    };

    if (hotels.length > 0) {
      fetchHotelInfos();
    }
  }, [hotels]);

  return (
    <div className="hotel-list">
      {hotelInfos.map((hotel, index) => (
        <div key={hotel.hid || index} className="hotel-card">
          <h2>{hotel.name?.value || "Névtelen hotel"}</h2>
          <p>{hotel.address?.text || "Cím nem elérhető"}</p>
          {hotel.main_photo && (
            <img
              src={hotel.main_photo}
              alt={hotel.name?.value || "Hotel"}
              width="300"
            />
          )}
          {hotel.rooms?.[0]?.rate?.amount && (
            <p>
              Ár: {hotel.rooms[0].rate.amount} {hotel.rooms[0].rate.currency}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
