import React, { useState, useEffect } from 'react';

export default function SearchForm({ onSearch }) {
  const [query, setQuery]       = useState('');
  const [suggestions, setSug]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [checkin, setCheckin]   = useState('');
  const [checkout, setCheckout] = useState('');
  const [adults, setAdults]     = useState(2);

  // 1) Autocomplete hívás
  useEffect(() => {
    if (query.length < 2) {
      setSug([]);
      return;
    }
    fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(json => setSug(json.data || []))
      .catch(() => setSug([]));
  }, [query]);

  // 2) Javaslat kiválasztása
  const handleSelect = item => {
    setSelected(item);
    setQuery(item.name);
    setSug([]);
  };

  // 3) Űrlap submit
  const handleSubmit = e => {
    e.preventDefault();
    if (!selected) {
      alert('Kérlek, válassz egy javaslatot!');
      return;
    }

    // Alap paraméterek
    const base = {
      residence:  'HU',
      nationality:'HU',
      checkin,
      checkout,
      guests: [{ adults, children: [] }],
      currency: 'HUF'
    };

    // Endpoint választás
    if (selected.type === 'hotel') {
      onSearch({ ...base, ids: [ Number(selected.id) ] });
    } else {
      // Country, region, city
      onSearch({ ...base, region_id: Number(selected.id) });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Helyszín:
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); }}
          autoComplete="off"
          required
        />
      </label>
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map(item => (
            <li
              key={item.type + item.id}
              onClick={() => handleSelect(item)}
            >
              {item.name} <small>({item.type})</small>
            </li>
          ))}
        </ul>
      )}

      <label>
        Érkezés:
        <input
          type="date"
          value={checkin}
          onChange={e => setCheckin(e.target.value)}
          required
        />
      </label>

      <label>
        Távozás:
        <input
          type="date"
          value={checkout}
          onChange={e => setCheckout(e.target.value)}
          required
        />
      </label>

      <label>
        Felnőttek:
        <input
          type="number"
          min="1"
          value={adults}
          onChange={e => setAdults(Number(e.target.value))}
        />
      </label>

      <button type="submit">Keresés</button>
    </form>
  );
}
