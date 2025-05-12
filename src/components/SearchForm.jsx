import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function SearchForm({ setResults }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [regionId, setRegionId] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [error, setError] = useState("");

  // Autocomplete: fájlból betöltött városlista
  // Autocomplete: valós időben az API-ból
// Autocomplete: Ratehawk valós idejű régiójavaslatok
useEffect(() => {
  if (query.length < 2) {
    setSuggestions([]);
    return;
  }

  const timeout = setTimeout(() => {
    fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data?.data?.regions || []);
      })
      .catch((err) => console.error("Autocomplete load error:", err));
  }, 300); // debounce 300ms

  return () => clearTimeout(timeout);
}, [query]);

  const onChangeQuery = (e) => {
    const val = e.target.value;
    setQuery(val);

    const match = suggestions.find(
      (r) => r.name.toLowerCase() === val.toLowerCase()
    );

    if (match) {
      setRegionId(match.id);
    } else {
      setRegionId("");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!regionId || !checkin || !checkout || !adults) {
    setError("Kérlek, tölts ki minden mezőt!");
    return;
  }

  const payload = {
    region_id: parseInt(regionId),
    checkin,
    checkout,
    residency: "hu",
    language: "en",
    currency: "HUF",
    guests: [
      {
        adults: parseInt(adults),
        children: [],
      },
    ],
  };

  try {
    navigate("/results", {
      state: payload, // most csak a keresési feltételeket küldjük tovább
    });
  } catch (err) {
    console.error("Navigációs hiba:", err);
    setError("Valami hiba történt a keresés elindításakor.");
  }
};

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Város"
        value={query}
        onChange={onChangeQuery}
        list="region-suggestions"
        required
      />
      <datalist id="region-suggestions">
        {suggestions.map((r) => (
          <option key={r.id} value={r.name} />
        ))}
      </datalist>

      <input
        type="date"
        value={checkin}
        onChange={(e) => setCheckin(e.target.value)}
        required
      />
      <input
        type="date"
        value={checkout}
        onChange={(e) => setCheckout(e.target.value)}
        required
      />
      <input
        type="number"
        min="1"
        value={adults}
        onChange={(e) => setAdults(e.target.value)}
        required
      />
      <button type="submit">Keresés</button>

      {error && <p className="error-msg">{error}</p>}
    </form>
  );
}
