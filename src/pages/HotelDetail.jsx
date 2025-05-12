import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function HotelDetail() {
  const { hid } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotel() {
      try {
        const res = await fetch("http://localhost:3002/api/hotel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hid: parseInt(hid) }),
        });
        const data = await res.json();
        if (data && !data.error) {
          console.log("Hotel részletes adat:", data);
          setHotel(data);
        } else {
          console.error("Hibás válasz a backendtől:", data);
        }
      } catch (err) {
        console.error("Hiba a hotel lekérés során:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHotel();
  }, [hid]);

  if (loading) return <p>Betöltés...</p>;
  if (!hotel) return <p>Nem található adat ehhez a hotelhez.</p>;

  return (
    <div className="hotel-detail">
      <h1>{hotel.name}</h1>
      <p>{hotel.address}</p>
      {hotel.main_photo_url && hotel.main_photo_url !== "unspecified" ? (
        <img src={hotel.main_photo_url} alt={hotel.name} width="500" />
      ) : (
        <p>[Nincs kép elérhető]</p>
      )}
      <p>
        {hotel.description?.text ||
          (Array.isArray(hotel.description_struct)
            ? hotel.description_struct.map((d) => d.text).join("\n\n")
            : "Nincs leírás.")}
      </p>
    </div>
  );
}
