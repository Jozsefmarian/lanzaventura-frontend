import { useState } from 'react';

export default function SearchForm({ onSearch }) {
  const [city, setCity] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [adults, setAdults] = useState(2);

  const handleSubmit = e => {
    e.preventDefault();
    onSearch({
      residence: 'HU',
      nationality: 'HU',
      city_id: city,
      checkin,
      checkout,
      guests: [{ adults, children: [] }]
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Város ID"
        value={city}
        onChange={e => setCity(e.target.value)}
        required
      />
      <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} required />
      <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} required />
      <input
        type="number"
        min="1"
        value={adults}
        onChange={e => setAdults(Number(e.target.value))}
        required
      />
      <button type="submit">Keresés</button>
    </form>
);
