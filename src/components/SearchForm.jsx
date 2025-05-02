import React, { useState } from "react";
import Autocomplete from "./Autocomplete";

export default function SearchForm({ onSearch }) {
  const [region, setRegion] = useState(null);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!region || !region.id) {
      alert("Kérlek, válassz egy várost a listából!");
      return;
    }

    const payload = {
      region_id: Number(region.id),
      checkin,
      checkout,
      guests: [{ adults, children: [] }],
      residence: "HU",
      nationality: "HU",
      currency: "HUF"
    };

    console.log("Keresési payload:", payload);
    onSearch(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <label htmlFor="region">Város</label>
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

      <label htmlFor="adults">Felnőttek</label>
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
