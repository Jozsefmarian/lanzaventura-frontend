// src/components/HotelList.jsx
import React from 'react';

export default function HotelList({ hotels, loading }) {
  if (loading) {
    return <p>Betöltés…</p>;
  }
  if (!hotels || hotels.length === 0) {
    return <p>Nincs találat.</p>;
  }

  return (
    <ul className="hotel-list">
      {hotels.map((hotel) => {
        const name    = hotel.name || hotel.hotel_name || 'Név ismeretlen';
        const imgUrl  = hotel.images?.[0]?.url || '';
        const price   = hotel.min_price ?? hotel.minPrice ?? '–';
        const curr    = hotel.currency || hotel.currency_code || '';

        return (
          <li key={hotel.hotel_id} className="hotel-item">
            {imgUrl && (
              <img
                src={imgUrl}
                alt={name}
                className="hotel-image"
              />
            )}
            <h3 className="hotel-name">{name}</h3>
            <p className="hotel-price">
              Ár: {price} {curr}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
