// src/App.jsx
import { useState } from 'react';
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
    <div>
      <h1>Lanzaventura Szálláskereső</h1>
      <SearchForm onSearch={handleSearch} />
      <HotelList hotels={hotels} loading={loading} />
    </div>
  );
}
