// src/api.js

const BASE_URL = '/api/search';

export async function searchHotels(params) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}



