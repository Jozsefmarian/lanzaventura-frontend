import React from 'react';

export default function HotelList({ hotels, loading }) {
  // Debug: nézzük meg, mi érkezik a hotels tömbben
  console.log('▶ Hotels array:', hotels);

  if (loading) {
    return <p>Betöltés…</p>;
  }
  if (!hotels || hotels.length === 0) {
    return <p>Nincs találat.</p>;
  }

  return (
    <ul className="hotel-list">
      {hotels.map((hotel, index) => {
        // A valós mezők ellenőrzése után frissítsd ezeket:
        const name = hotel.hotel_name || hotel.title || hotel.name || 'Név ismeretlen';
        const imgUrl = hotel.images?.[0]?.url || '';
        const price = hotel.price_from ?? hotel.minPrice ?? hotel.price ?? '–';
        const currency = hotel.currency || hotel.currency_code || '';

        return (
          <li key={hotel.hotel_id || hotel.id || index} className="hotel-item">
            {imgUrl && (
              <img
                src={imgUrl}
                alt={name}
                className="hotel-image"
              />
            )}
            <h3 className="hotel-name">{name}</h3>
            <p className="hotel-price">
              Ár: {price} {currency}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

