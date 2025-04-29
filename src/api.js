- const BASE_URL = 'https://api.worldota.net/api/b2b/v3/search/serp/hotels/';
+ const BASE_URL = '/api/search';    // a saját serverless proxy-d

export async function searchHotels(params) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
-     'Authorization': `Basic ${btoa(`${API_ID}:${API_KEY}`)}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  if (!response.ok) throw new Error('API error: ' + response.status);
  return response.json();
}
