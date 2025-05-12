import "./styles/App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchForm from "./components/SearchForm";
import HotelList from "./components/HotelList";
import HotelDetail from "./pages/HotelDetail";
import "./styles/SearchForm.css";
import ResultsPage from "./pages/ResultsPage";

function SearchPage({ setResults, results }) {
  return (
    <div className="search-background">
      <div className="app-container">
        <SearchForm setResults={setResults} />
        <HotelList hotels={results} />
      </div>
    </div>
  );
}

function App() {
  const [results, setResults] = useState([]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<SearchPage setResults={setResults} results={results} />}
        />
        <Route path="/hotel/:hid" element={<HotelDetail />} />
        <Route path="/results" element={<ResultsPage />} /> {/* <-- EZ KELL */}
      </Routes>
    </Router>
  );
}

export default App;
