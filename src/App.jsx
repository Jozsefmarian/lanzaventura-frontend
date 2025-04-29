import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import HotelList from './components/HotelList';
import { searchHotels } from './api';

export default function App() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async params => {
    setLoading(true);
    try {
      const data = await searchHotels(params);
      setHotels(data.hotels || []);
    } catch (err) {
      console.error(err);
      alert('Hiba a keresés során');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <img src="/logo.png" alt="Lanzaventura" style={{ height: '80px', objectFit: 'contain' }} />
      </header>
      <SearchForm onSearch={handleSearch} />
      {loading ? <p>Betöltés…</p> : <HotelList hotels={hotels} />}
    </div>
);
}
