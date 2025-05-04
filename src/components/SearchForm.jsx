import { useState } from "react";
import "../styles/SearchForm.css";

function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);

  const fetchSuggestions = async (q) => {
    setQuery(q);
    if (q.length < 2) return;

    try {
      const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions([...data.data.regions, ...data.data.hotels]);
    } catch (err) {
      console.error("Autocomplete hiba:", err);
      setSuggestions([]);
    }
  };

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    const selected = suggestions.find((item) => String(item.id) === selectedId);
    setRegion(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!region) return alert("Kérlek, válassz egy várost vagy hotelt!");

    const payload = {
      checkin,
      checkout,
      residency: "HU",
      nationality: "HU",
      currency: "HUF",
      guests: [{ adults: Number(adults), children: [] }],
    };

    if (region.type === "City" || region.type === "Region" || region.type === "region") {
      payload.region_ids = [String(region.id)];
    } else if (region.type === "Hotel" || region.type === "hotel") {
      payload.hids = [String(region.id)];
    }

    console.log("🔹 Keresési payload:", payload);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("🔸 API válasz:", data);
      onSearch(data);
    } catch (err) {
      console.error("Keresési hiba:", err);
      alert("API hiba vagy nem megfelelő válasz.");
    }
  };

  return (
    <div className="search-background">
      <form onSubmit={handleSubmit} className="search-form">
        <h2>Találj szállást a paradicsomban!</h2>

        <input
          type="text"
          placeholder="Város vagy hotel keresése"
          value={query}
          onChange={(e) => fetchSuggestions(e.target.value)}
          list="autocomplete-options"
        />
        <datalist id="autocomplete-options">
          {suggestions.map((item) => (
            <option key={item.id} value={item.name} data-id={item.id}>
              {item.name}
            </option>
          ))}
        </datalist>

        <select onChange={handleSelect} defaultValue="">
          <option value="" disabled>Válassz várost vagy hotelt</option>
          {suggestions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.type})
            </option>
          ))}
        </select>

        <input
          type="date"
          value={checkin}
          onChange={(e) => setCheckin(e.target.value)}
        />
        <input
          type="date"
          value={checkout}
          onChange={(e) => setCheckout(e.target.value)}
        />
        <input
          type="number"
          min="1"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
        />
        <button type="submit">Keresés</button>
      </form>
    </div>
  );
}

export default SearchForm;
