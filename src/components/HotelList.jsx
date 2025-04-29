import React from 'react';

export default function HotelList({ hotels }) {
  if (!hotels.length) return <p>Nincs találat.</p>;
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {hotels.map(h => (
        <div key={h.id} style={{ border: '1px solid #ddd', padding: '1rem' }}>
          {h.main_photo && (
            <img src={h.main_photo} alt={h.name} style={{ maxWidth: '100%' }} />
          )}
          <h3>{h.name}</h3>
          <p>{h.address}</p>
          <p>
            Induló ár: {h.min_price.amount} {h.min_price.currency}
          </p>
        </div>
      ))}
    </div>
  );
}
