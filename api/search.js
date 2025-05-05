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

    const rhUrl = 'https://api.worldota.net/api/b2b/v3/search';
    const authBase64 = process.env.RATEHAWK_AUTH_BASE64;

    const response = await fetch(rhUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + authBase64,
      },
      body: JSON.stringify(body),
    });

    const raw = await response.text();

    try {
      const data = JSON.parse(raw);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON from Ratehawk",
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
