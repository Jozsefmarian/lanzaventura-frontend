import React, { useState } from "react";

export default function SearchForm({ onSearch, regions }) {
  const [region, setRegion] = useState(null);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    const selectedRegion = regions.find((r) => String(r.id) === selectedId);
    setRegion(selectedRegion || null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!region) {
    alert("Kérlek, válassz egy úti célt!");
    return;
  }

  if (!adults || isNaN(adults) || adults < 1) {
    alert("Kérlek, adj meg legalább egy felnőttet!");
    return;
  }

  const payload = {
    checkin,
    checkout,
    residency: "HU",
    nationality: "HU",
    currency: "HUF",
    guests: [
      {
        adults: adults,
        children: []
      }
    ]
  };

  if (region.type === "hotel") {
    payload.hids = [String(region.id)];
  } else {
    payload.ids = [String(region.id)];
  }

  console.log("🔹 Keresési payload:", payload);

  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("🔸 API válasz:", data);
    onSearch(data);
  } catch (err) {
    console.error("❌ Hiba a keresés során:", err);
  }
};

  return (
    <div className="search-background">
      <form onSubmit={handleSubmit} className="search-form">
        <h2>Találj szállást a paradicsomban!</h2>

        <select onChange={handleSelect} defaultValue="">
          <option value="" disabled>Válassz várost vagy hotelt</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={checkin}
          onChange={(e) => setCheckin(e.target.value)}
          placeholder="Érkezés"
        />
        <input
          type="date"
          value={checkout}
          onChange={(e) => setCheckout(e.target.value)}
          placeholder="Távozás"
        />
        <input
  type="number"
  min="1"
  value={adults}
  onChange={(e) => setAdults(parseInt(e.target.value, 10))}
  placeholder="Felnőttek"
/>

        <button type="submit">Keresés</button>
      </form>
    </div>
  );
}
