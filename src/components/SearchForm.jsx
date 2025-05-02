import React, { useState } from "react";
import Autocomplete from "./Autocomplete";

export default function SearchForm({ onSearch }) {
  const [selected, setSelected] = useState(null);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selected) {
      alert("Kérlek, válassz egy javaslatot a listából!");
      return;
    }

    const base = {
      residence: "HU",
      nationality: "HU",
      currency: "HUF",
      checkin,
      checkout,
      guests: [{ adults, children: [] }],
    };

    if (selected.type === "hotel") {
      onSearch({ ...base, ids: [Number(selected.id)] });
    } else if (selected.type === "region" || selected.type === "city") {
      onSearch({ ...base, region_id: Number(selected.id) });
    } else {
      alert("Nem támogatott keresési típus: " + selected.type);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <label>
        Helyszín:
        <Autocomplete onSelect={(item) => setSelected(item)} />
      </label>

      <label>
        Érkezés:
        <input
          type="date"
          name="checkin"
          value={checkin}
          onChange={(e) => setCheckin(e.target.value)}
          required
        />
      </label>

      <label>
        Távozás:
        <input
          type="date"
          name="checkout"
          value={checkout}
          onChange={(e) => setCheckout(e.target.value)}
          required
        />
      </label>

      <label>
        Felnőttek száma:
        <input
          type="number"
          name="adults"
          min="1"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
          required
        />
      </label>

      <button type="submit">Keresés</button>
    </form>
  );
}
