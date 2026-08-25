const CENTER = { lat: 48.239166, lon: 11.559334 };

export default async (request) => {
  try {
    const apiKey = process.env.OPENAIP_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAIP_API_KEY is not configured" }),
        { status: 500, headers: { "content-type": "application/json; charset=utf-8" } }
      );
    }

    const url = new URL(request.url);
    let km = Number(url.searchParams.get("radius") || 50);
    if (!Number.isFinite(km)) km = 50;
    km = Math.max(20, Math.min(150, km));

    // openAIP list endpoints support pos="<lat>,<lon>" and dist in meters.
    // Use a small buffer so polygons crossing the visible edge are still returned.
    const distMeters = Math.ceil((km + 20) * 1000);

    const upstream = new URL("https://api.core.openaip.net/api/airspaces");
    upstream.searchParams.set("pos", `${CENTER.lat},${CENTER.lon}`);
    upstream.searchParams.set("dist", String(distMeters));
    upstream.searchParams.set("limit", "1000");
    upstream.searchParams.set("page", "1");

    const response = await fetch(upstream, {
      headers: {
        "x-openaip-api-key": apiKey,
        "User-Agent": "EDNX-Live-Radar/7.3"
      }
    });

    const text = await response.text();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `openAIP HTTP ${response.status}`,
          details: text.slice(0, 500)
        }),
        {
          status: 502,
          headers: { "content-type": "application/json; charset=utf-8" }
        }
      );
    }

    const data = JSON.parse(text);
    const items = Array.isArray(data.items) ? data.items : [];

    // Keep only fields the browser needs. This avoids exposing irrelevant API data.
    const compact = items.map(item => ({
      _id: item._id,
      name: item.name,
      type: item.type,
      icaoClass: item.icaoClass,
      upperLimit: item.upperLimit,
      lowerLimit: item.lowerLimit,
      geometry: item.geometry
    }));

    return new Response(
      JSON.stringify({
        items: compact,
        totalCount: data.totalCount ?? compact.length
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          // Airspace geometry changes slowly; cache to save calls/Netlify usage.
          "cache-control": "public, max-age=300, s-maxage=1800"
        }
      }
    );
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