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
        const data = json.data || [];
        setSuggestions(data);
        setNoResults(data.length === 0);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Autocomplete fetch error:", err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [query]);

  const handleSelect = (item) => {
    onSelect(item);
    setQuery(item.name);
    setSuggestions([]);
    setNoResults(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Írd be a várost vagy hotelt..."
        autoComplete="off"
        required
        name="location"
      />
      {loading && <div style={{ position: "absolute", top: "100%", background: "#fff" }}>Keresés...</div>}
      {noResults && <div style={{ position: "absolute", top: "100%", background: "#fff" }}>Nincs találat</div>}
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 10,
            backgroundColor: "white",
            border: "1px solid #ccc",
            width: "100%",
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxHeight: "200px",
            overflowY: "auto",
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
