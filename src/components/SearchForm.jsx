import React, { useState } from "react";
import "../styles/searchform.css";

const SearchForm = () => {
  const [regionId, setRegionId] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

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
      residency: "HU",
      language: "en",
      currency: "HUF",
      guests: [
        {
          adults: parseInt(adults),
          children: []
        }
      ]
    };

    try {
      setLoading(true);
      console.log("🔹 Keresési payload:", payload);

      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("🔸 API válasz:", data);

      if (data?.data?.hotels?.length) {
        setResults(data.data.hotels);
      } else {
        alert("Nincs találat a megadott időszakra.");
        setResults([]);
      }
    } catch (err) {
      console.error("Keresési hiba:", err);
      alert("API hiba vagy nem megfelelő válasz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSearch}>
        <h2>Találj szállást a paradicsomban!</h2>

        <input
          type="text"
          placeholder="Úticél (pl. Budapest region ID: 715)"
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          required
        />

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
          placeholder="Felnőttek száma"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Keresés folyamatban..." : "Keresés"}
        </button>
      </form>

      {results && (
        <div className="results">
          <h3>{results.length} találat</h3>
          <ul>
            {results.map((hotel) => (
              <li key={hotel.id}>{hotel.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
