export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (query.length < 2) {
    return new Response(
      JSON.stringify({ error: "Query too short." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const auth = "Basic " + btoa(`${process.env.RATEHAWK_USER_ID}:${process.env.RATEHAWK_API_KEY}`);

  try {
    const response = await fetch("https://api.worldota.net/api/b2b/v3/search/multicomplete/", {
      method: "POST",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, language: "en" }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Ratehawk error", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
