// src/components/HotelList.jsx
export default function HotelList({ hotels, loading }) {
  if (loading) return <p>Betöltés…</p>;
  if (!hotels.length) return <p>Nincs találat.</p>;
  return (
    <ul>
      {hotels.map(h => (
        <li key={h.id}>
          <h3>{h.name}</h3>
          <p>Ár: {h.rates?.[0]?.price?.amount} {h.rates?.[0]?.price?.currency}</p>
          {h.main_photo && <img src={h.main_photo} alt={h.name} width="200" />}
        </li>
      ))}
    </ul>
  );
}