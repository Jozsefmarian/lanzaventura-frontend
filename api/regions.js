export const config = {
  runtime: 'edge'
};

export default async function handler() {
  try {
    const response = await fetch('https://api.worldota.net/api/b2b/v3/regions/dump', {
      headers: {
        Authorization: 'Basic ' + btoa(`${process.env.RATEHAWK_USER_ID}:${process.env.RATEHAWK_TOKEN}`)
      }
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Region dump error:', err);
    return new Response(JSON.stringify({ error: 'Region dump failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
