import { useState } from "react";
import Autocomplete from "./components/Autocomplete";
import SearchForm from "./components/SearchForm";

function App() {
  const [regions, setRegions] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  return (
    <div>
      {/* Autocomplete: város/hotel kiválasztás */}
      <Autocomplete onRegionsUpdate={setRegions} />

      {/* Keresőpanel mindig megjelenik */}
      <SearchForm regions={regions} onSearch={setSearchResults} />

      {/* Eredmények megjelenítése */}
      {searchResults && (
        <div style={{ padding: "20px" }}>
          <h2>Találatok:</h2>
          {searchResults.data?.hotels?.length > 0 ? (
            <ul>
              {searchResults.data.hotels.map((hotel) => (
                <li key={hotel.id}>{hotel.name}</li>
              ))}
            </ul>
          ) : (
            <p>Nincs találat a megadott időszakra.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
