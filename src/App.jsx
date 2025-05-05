import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import HotelList from "./components/HotelList";
import "./styles/SearchForm.css";

function App() {
  const [results, setResults] = useState([]);

  return (
    <div className="search-background">
      <div className="app-container">
        <SearchForm setResults={setResults} />
        <HotelList hotels={results} />
      </div>
    </div>
  );
}

export default App;
