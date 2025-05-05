import React from "react";

export default function HotelList({ hotels }) {
  if (!hotels) return null;

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
                <img
                  src={hotel.main_photo_url}
                  alt={hotel.name}
                  style={{ width: "100%", maxWidth: "300px" }}
                />
              )}
              <p>Ár: {hotel.min_price?.amount} {hotel.min_price?.currency}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
