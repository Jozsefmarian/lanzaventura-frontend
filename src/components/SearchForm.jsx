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
      alert("Kérlek, válassz egy javaslatot!");
      return;
    }

    const base = {
      residence: "HU",
      nationality: "HU",
      checkin,
      checkout,
      guests: [{ adults, children: [] }],
      currency: "HUF",
    };

    if (selected.type === "hotel") {
      onSearch({ ...base, ids: [Number(selected.id)] });
    } else {
      onSearch({ ...base, region_id: Number(selected.id) });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Helyszín:
        <Autocomplete onSelect={(item) => setSelected(item)} />
      </label>

      <label>
        Érkezés:
        <input
          type="date"
          value={checkin}
          onChange={(e) => setCheckin(e.target.value)}
          required
        />
      </label>

      <label>
        Távozás:
        <input
          type="date"
          value={checkout}
          onChange={(e) => setCheckout(e.target.value)}
          required
        />
      </label>

      <label>
        Felnőttek:
        <input
          type="number"
          min="1"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
        />
      </label>

      <button type="submit">Keresés</button>
    </form>
  );
}
