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

    if (!region?.id || !region?.type) {
      alert("Kérlek, válassz egy várost vagy hotelt a javaslatok közül.");
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
    adults: Number(adults),
    children: []
  }
]
    };

    if (region.type === "region") {
      payload.region_ids = [String(region.id)];
    } else if (region.type === "hotel") {
      payload.hids = [String(region.id)];
    }

    console.log("🔹 Keresési payload:", payload);
    setLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      console.log("🔸 API válasz:", result);

      if (!res.ok || result.status !== "ok") {
        alert("API hiba vagy nem megfelelő válasz.");
        return;
      }

      if (result.data?.hotels?.length === 0) {
        alert("Nincs találat a megadott időszakra.");
        return;
      }

      onSearch(result.data.hotels);
    } catch (err) {
      console.error("❌ Keresési hiba:", err);
      alert("Technikai hiba történt a keresés során.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Autocomplete onSelect={setRegion} />
      <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} required />
      <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} required />
      <input type="number" min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
      <button type="submit" disabled={loading}>{loading ? "Keresés…" : "Keresés"}</button>
    </form>
  );
}
