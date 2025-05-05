import React, { useState, useEffect } from "react";
import "../styles/searchform.css";

const SearchForm = () => {
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState(null);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [hotels, setHotels] = useState([]);

  // Autocomplete lekérés
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch("/api/autocomplete?q=Budapest");
        const json = await res.json();
        setRegions(json.data.regions.concat(json.data.hotels));
      } catch (err) {
        console.error("Autocomplete hiba:", err);
      }
    };

    fetchRegions();
  }, []);

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    const selectedRegion = regions.find((r) => String(r.id) === selectedId);
    setRegion(selectedRegion);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!region || !checkin || !checkout) {
      alert("Kérlek, tölts ki minden mezőt!");
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
          children: [],
        },
      ],
    };

    if (region.type === "region") {
      payload.ids = [String(region.id)];
    } else if (region.type === "hotel") {
      payload.hids = [Number(region.id)];
    }

    console.log("🔹 Keresési payload:", payload);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      console.log("🔸 API válasz:", json);

      if (json?.data?.hotels?.length > 0) {
        setHotels(json.data.hotels);
      } else {
        alert("Nincs találat a megadott időpontra.");
        setHotels([]);
      }
    } catch (err) {
      console.error("Keresési hiba:", err);
      alert("API hiba vagy nem megfelelő válasz.");
    }
  };

  return (
    <div className="search-background">
      <form onSubmit={handleSubmit} className="search-form">
        <h2>Találj szállást a paradicsomban!</h2>

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
        />

        <button type="submit">Keresés</button>
      </form>

      {hotels.length > 0 && (
        <div className="results">
          <h3>Találatok:</h3>
          <ul>
            {hotels.map((hotel) => (
              <li key={hotel.id}>{hotel.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
