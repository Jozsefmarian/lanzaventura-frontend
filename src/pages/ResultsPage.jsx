import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import HotelList from "../components/HotelList";

export default function ResultsPage() {
  const location = useLocation();
  const searchParams = location.state;

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchParams),
        });

        const data = await response.json();
        setHotels(data.hotels || []);
      } catch (error) {
        console.error("Hiba a szállások lekérésekor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchParams) {
      fetchHotels();
    }
  }, [searchParams]);

  return (
    <div className="results-container">
      {loading ? (
        <p>Keresés folyamatban...</p>
      ) : (
        <HotelList hotels={hotels} />
      )}
    </div>
  );
}
