// src/components/SearchForm.jsx
import { useState } from 'react';

export default function SearchForm({ onSearch }) {
  const [regionId, setRegionId] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [adults, setAdults] = useState(2);

  const handleSubmit = e => {
    e.preventDefault();
    onSearch({
      residence: 'HU',
      nationality: 'HU',
      region_id: Number(regionId),
      checkin,
      checkout,
      guests: [{ adults, children: [] }],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Region ID"
        value={regionId}
        onChange={e => setRegionId(e.target.value)}
        required
      />
      <input
        type="date"
        value={checkin}
        onChange={e => setCheckin(e.target.value)}
        required
      />
      <input
        type="date"
        value={checkout}
        onChange={e => setCheckout(e.target.value)}
        required
      />
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
}