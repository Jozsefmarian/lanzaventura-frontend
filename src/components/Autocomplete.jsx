import React, { useState, useEffect } from "react";

export default function Autocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [regions, setRegions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((json) => {
        setRegions(json.data || []);
      })
      .catch((err) => console.error("Region fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setNoResults(false);
      return;
    }

    const matches = regions.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(matches);
    setNoResults(matches.length === 0);
  }, [query, regions]);

  const handleSelect = (region) => {
    setQuery(region.name);
    setSuggestions([]);
    setNoResults(false);
    onSelect({ id: region.id, name: region.name });
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        id="region"
        name="region"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Város neve..."
        autoComplete="off"
        required
      />
      {loading && <div style={{ position: "absolute", top: "100%" }}>Betöltés...</div>}
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
          {suggestions.map((region) => (
            <li
              key={region.id}
              onClick={() => handleSelect(region)}
              style={{ padding: "0.5rem", cursor: "pointer" }}
            >
              {region.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
