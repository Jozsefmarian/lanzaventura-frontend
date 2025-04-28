import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

window.onload = () => {
  const root = ReactDOM.createRoot(document.getElementById('app')); // Itt biztosítjuk, hogy a DOM már betöltődött
  root.render(<App />);
};


