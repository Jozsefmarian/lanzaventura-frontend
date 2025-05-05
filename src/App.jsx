import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import HotelList from "./components/HotelList";

function App() {
  const [results, setResults] = useState([]);

  return (
    <div className="app-container">
      <SearchForm setResults={setResults} />
      <HotelList hotels={results} />
    </div>
  );
}

export default App;


