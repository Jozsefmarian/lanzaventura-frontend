import React, { useState } from "react";
import Autocomplete from "./Autocomplete";

const SearchForm = () => {
  const [region, setRegion] = useState(null);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!region || !checkin || !checkout || !adults) {
      alert("Kérlek, tölts ki minden mezőt!");
      return;
    }

    const payload = {
      checkin,
      checkout,
      residency: "HU",
      nationality: "HU",
      currency: "HUF",
      guests: [{ adults: Number(adults), children: [] }],
    };

    if (region.type === "region") {
      payload.ids = [String(region.id)];
    } else if (region.type === "hotel") {
      payload.hids = [String(region.id)];
    }

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("🔸 API válasz:", data);

      if (data?.data?.hotels?.length > 0) {
        alert(`Találatok száma: ${data.data.hotels.length}`);
      } else {
        alert("Nincs találat a megadott időpontra.");
      }
    } catch (error) {
      console.error("Keresési hiba:", error);
      alert("API hiba vagy nem megfelelő válasz.");
    }
  };

  return (
    <div className="search-background">
      <form onSubmit={handleSubmit} className="search-form">
        <h2>Találj szállást a paradicsomban!</h2>

        <Autocomplete onSelect={setRegion} />

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
          placeholder="Felnőttek száma"
          required
        />

        <button type="submit">Keresés</button>
      </form>
    </div>
  );
};

export default SearchForm;
