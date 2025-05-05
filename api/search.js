export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();

    const response = await fetch('https://api.worldota.net/api/b2b/v3/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' +
          btoa(`${process.env.RATEHAWK_USER_ID}:${process.env.RATEHAWK_API_KEY}`),
      },
      body: JSON.stringify(body),
    });

    const raw = await response.text(); // Nem parse-oljuk még

    try {
      const data = JSON.parse(raw); // Ha sikerül, akkor minden ok
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (parseErr) {
      // Visszaadjuk a nyers választ szövegként, ha nem JSON
      return new Response(
        JSON.stringify({
          error: "Invalid JSON response from Ratehawk",
          raw,
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Search failed", details: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
