import React, { useState, useEffect } from "react";

export default function Autocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((json) => {
        console.log("🔎 Autocomplete suggestions:", json.data);
        setSuggestions(json.data || []);
      })
      .catch((err) => {
        console.error("Autocomplete fetch error:", err);
        setSuggestions([]);
      });
  }, [query]);

  const handleSelect = (item) => {
    onSelect(item);
    setQuery(item.name);
    setSuggestions([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Írd be a várost vagy hotelt..."
        autoComplete="off"
        required
      />
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
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {item.name} <small>({item.type})</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
