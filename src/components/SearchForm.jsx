import React, { useState } from "react";
import Autocomplete from "./Autocomplete";

export default function SearchForm({ onSearch }) {
  const [region, setRegion] = useState(null);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!region || !region.id || !region.type) {
      alert("Kérlek, válassz egy javaslatot a listából!");
      return;
    }

    const payload = {
      checkin,
      checkout,
      residence: "HU",
      nationality: "HU",
      currency: "HUF",
      guests: [
        {
          adults,
          children: []
        }
      ]
    };

    if (region.type === "region") {
  payload.ids = [String(region.id)];
} else if (region.type === "hotel") {
  payload.hids = [String(region.id)];
} else {
  alert("Ismeretlen keresési típus. Kérlek, válassz újra!");
  return;
}

    console.log("Keresési payload:", payload);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const result = await res.json();
      console.log("Találatok:", result);
      onSearch(result);
    } catch (err) {
      console.error("Keresési hiba:", err);
      alert("Hiba történt a keresés során.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <label htmlFor="region">Város vagy szálloda</label>
      <Autocomplete onSelect={setRegion} />

      <label htmlFor="checkin">Érkezés</label>
      <input
        type="date"
        name="checkin"
        id="checkin"
        value={checkin}
        onChange={(e) => setCheckin(e.target.value)}
        required
      />

      <label htmlFor="checkout">Távozás</label>
      <input
        type="date"
        name="checkout"
        id="checkout"
        value={checkout}
        onChange={(e) => setCheckout(e.target.value)}
        required
      />

      <label htmlFor="adults">Felnőttek száma</label>
      <input
        type="number"
        name="adults"
        id="adults"
        value={adults}
        min={1}
        onChange={(e) => setAdults(Number(e.target.value))}
        required
      />

      <button type="submit">Keresés</button>
    </form>
  );
}
