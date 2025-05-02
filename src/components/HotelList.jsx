import React, { useState } from "react";

export default function HotelList({ searchPayload }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (!searchPayload) return;

    setLoading(true);
    setError(null);

    fetch("/api/search-hotels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(searchPayload)
    })
      .then((res) => res.json())
      .then((data) => {
        setHotels(data.hotels || []);
      })
      .catch((err) => {
        setError("Hiba történt a keresés során.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchPayload]);

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {hotels.length === 0 ? (
        <p>Nincs találat.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {hotels.map((hotel) => (
            <li key={hotel.id} style={{ marginBottom: "2rem", border: "1px solid #ccc", padding: "1rem" }}>
              <h3>{hotel.name}</h3>
              {hotel.main_photo_url && (
                <img src={hotel.main_photo_url} alt={hotel.name} style={{ width: "100%", maxWidth: "300px" }} />
              )}
              <p>Ár: {hotel.min_price?.amount} {hotel.min_price?.currency}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
