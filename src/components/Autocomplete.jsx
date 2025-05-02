import React, { useState, useEffect } from "react";

export default function Autocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setNoResults(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`, { signal })
      .then((res) => res.json())
      .then((json) => {
  const data = json.data || {};
  const regions = data.regions || [];
  const hotels = data.hotels || [];

  const combined = [
    ...regions.map((r) => ({ id: r.id, name: r.name, type: "region" })),
    ...hotels.map((h) => ({ id: h.hid, name: h.name, type: "hotel" })),
  ];

  setSuggestions(combined);
  setNoResults(combined.length === 0);
})
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Autocomplete fetch error:", err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.name);
    setSuggestions([]);
    setNoResults(false);
    onSelect(item);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        id="region"
        name="region"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Város vagy hotel neve..."
        autoComplete="off"
        required
      />
      {loading && <div style={{ position: "absolute", top: "100%" }}>Keresés...</div>}
      {noResults && <div style={{ position: "absolute", top: "100%" }}>Nincs találat</div>}
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            zIndex: 1000,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            margin: 0,
            padding: 0,
            listStyle: "none",
            width: "100%",
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{ padding: "0.5rem", cursor: "pointer" }}
            >
              {item.name} {item.type === "hotel" ? "(szálloda)" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
