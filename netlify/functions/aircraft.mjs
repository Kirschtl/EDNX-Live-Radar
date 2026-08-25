export default async (request) => {
  try {
    const url = new URL(request.url);
    let km = Number(url.searchParams.get("radius") || 50);
    if (!Number.isFinite(km)) km = 50;
    km = Math.max(1, Math.min(100, km));

    // ADSB.lol radius is nautical miles.
    const nm = Math.max(1, Math.ceil(km / 1.852));
    const upstream = `https://api.adsb.lol/v2/point/48.239166/11.559334/${nm}`;

    const response = await fetch(upstream, {
      headers: {
        "User-Agent": "EDNX-Live-Radar/1.0"
      }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `ADSB.lol HTTP ${response.status}` }),
        {
          status: 502,
          headers: { "content-type": "application/json; charset=utf-8" }
        }
      );
    }

    const body = await response.text();

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        status: 500,
        headers: { "content-type": "application/json; charset=utf-8" }
      }
    );
  }
};
