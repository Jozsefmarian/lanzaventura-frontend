import { useState, useEffect } from 'react';

export default function SearchForm({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [regionId, setRegionId] = useState('715');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [adults, setAdults] = useState(2);

  useEffect(() => {
    if (query.length < 3) return setSuggestions([]);
    fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(j => setSuggestions(j.data));
  }, [query]);

  const handleSubmit = e => {
    e.preventDefault();
    onSearch({
      residence:'HU',
      nationality:'HU',
      region_id: Number(regionId),
      checkin,
      checkout,
      guests:[{ adults, children:[] }],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Város (pl. Budapest)"
        value={query}
        onChange={e => { setQuery(e.target.value); setRegionId(''); }}
        required
      />
      <datalist id="regions">
        {suggestions.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </datalist>
      <input
        type="number"
        placeholder="Region ID"
        list="regions"
        value={regionId}
        onChange={e => setRegionId(e.target.value)}
        required
      />
      <input type="date" value={checkin} onChange={e=>setCheckin(e.target.value)} required />
      <input type="date" value={checkout} onChange={e=>setCheckout(e.target.value)} required />
      <input type="number" min="1" value={adults} onChange={e=>setAdults(Number(e.target.value))} required />
      <button type="submit">Keresés</button>
    </form>
  );
}
