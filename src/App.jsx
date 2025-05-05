import React from "react";
import SearchForm from "./components/SearchForm";
import "./styles/searchform.css"; // biztosítjuk, hogy a stílus érvényesüljön

function App() {
  return (
    <div className="app-container">
      <SearchForm />
    </div>
  );
}

export default App;
