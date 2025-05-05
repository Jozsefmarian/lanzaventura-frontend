import React, { useState, useEffect } from "react";
import "../styles/SearchForm.css";

const SearchForm = ({ setResults }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [regionId, setRegionId] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [loading, setLoading] = useState(false);

  // Autocomplete lekérdezés
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query) return;
      try {
        const res = await fetch(`/api/autocomplete?q=${query}`);
        const data = await res.json();
        setSuggestions(data?.data?.regions || []);
      } catch (err) {
        console.error("Autocomplete hiba:", err);
        setSuggestions([]);
      }
    };
    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!regionId || !checkin || !checkout) {
      alert("Kérlek, tölts ki minden mezőt!");
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
      setLoading(true);
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.data?.hotels?.length) {
        setResults(data.data.hotels);
      } else {
        alert("Nincs találat a megadott időszakra.");
        setResults([]);
      }
    } catch (err) {
      console.error("Keresési hiba:", err);
      alert("Hiba történt a keresés során.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        placeholder="Város"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        list="region-suggestions"
        required
      />
      <datalist id="region-suggestions">
        {suggestions.map((region) => (
          <option key={region.id} value={region.name} onClick={() => setRegionId(region.id)} />
        ))}
      </datalist>

      <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} required />
      <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} required />
      <input
        type="number"
        min="1"
        value={adults}
        onChange={(e) => setAdults(e.target.value)}
        placeholder="Felnőttek"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Keresés..." : "Keresés"}
      </button>
    </form>
  );
};

export default SearchForm;
