import React, { useState } from "react";
import Autocomplete from "./Autocomplete";

export default function SearchForm({ onSearch }) {
  const [region, setRegion] = useState(null);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok || result.status !== "ok") {
  console.error("Ratehawk search error:", result?.error || result);
  alert("Hiba történt a keresés során.");
  return;
}

if (result.data?.hotels?.length === 0) {
  alert("Nincs találat a megadott időszakra.");
  return;
}

      console.log("Találatok:", result);
      onSearch(result);
    } catch (err) {
      console.error("Keresési hiba:", err);
      alert("Hiba történt a keresés során.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <label htmlFor="region">Város vagy szálloda</label>
      <Autocomplete onSelect={setRegion} />

      <label htmlFor="checkin">Érkezés</label>
      <input
        type="date"
        id="checkin"
        value={checkin}
        onChange={(e) => setCheckin(e.target.value)}
        required
      />

      <label htmlFor="checkout">Távozás</label>
      <input
        type="date"
        id="checkout"
        value={checkout}
        onChange={(e) => setCheckout(e.target.value)}
        required
      />

      <label htmlFor="adults">Felnőttek száma</label>
      <input
        type="number"
        id="adults"
        min={1}
        value={adults}
        onChange={(e) => setAdults(Number(e.target.value))}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Keresés..." : "Keresés"}
      </button>
    </form>
  );
}
