const EDNX_LAT = 48.239166;
const EDNX_LON = 11.559334;
const AIRSPACE_RADIUS_METERS = 130_000;
const WEEK = 7 * 24 * 60 * 60;

const indexHtml = await Deno.readTextFile(new URL("./index.html", import.meta.url));

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
};

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...jsonHeaders, ...extraHeaders },
  });
}

async function aircraft(request: Request) {
  const url = new URL(request.url);
  let radiusKm = Number(url.searchParams.get("radius") ?? "30");

  if (!Number.isFinite(radiusKm)) radiusKm = 30;
  radiusKm = Math.max(5, Math.min(100, radiusKm));

  const radiusNm = Math.max(1, Math.ceil(radiusKm / 1.852));

  const sources = [
    {
      name: "adsb.lol",
      url: `https://api.adsb.lol/v2/point/${EDNX_LAT}/${EDNX_LON}/${radiusNm}`,
    },
    {
      name: "adsb.fi",
      url: `https://opendata.adsb.fi/api/v2/lat/${EDNX_LAT}/lon/${EDNX_LON}/dist/${radiusNm}`,
    },
    {
      name: "adsb.one",
      url: `https://api.adsb.one/v2/point/${EDNX_LAT}/${EDNX_LON}/${radiusNm}`,
    },
  ];

  const errors: string[] = [];

  for (const source of sources) {
    try {
      const response = await fetch(source.url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "EDNX-Live-Radar/8.3",
        },
      });

      if (!response.ok) {
        errors.push(`${source.name}: HTTP ${response.status}`);
        continue;
      }

      const data = await response.json() as Record<string, unknown>;
      const aircraft =
        (Array.isArray(data.ac) && data.ac) ||
        (Array.isArray(data.aircraft) && data.aircraft) ||
        [];

      return json(
        {
          ...data,
          ac: aircraft,
          source: source.name,
          radiusKm,
          radiusNm,
        },
        200,
        {
          "Cache-Control": "public, max-age=2",
          "Deno-CDN-Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
        },
      );
    } catch (error) {
      errors.push(
        `${source.name}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return json(
    {
      error: "No ADS-B source available",
      sources: errors,
      radiusKm,
      radiusNm,
    },
    502,
    {
      "Cache-Control": "public, max-age=2",
      "Deno-CDN-Cache-Control": "public, s-maxage=5",
    },
  );
}

async function airspaces() {
  const apiKey = Deno.env.get("OPENAIP_API_KEY");

  if (!apiKey) {
    return json(
      { error: "OPENAIP_API_KEY is not configured in Deno Deploy" },
      500,
    );
  }

  const upstream = new URL("https://api.core.openaip.net/api/airspaces");
  upstream.searchParams.set("pos", `${EDNX_LAT},${EDNX_LON}`);
  upstream.searchParams.set("dist", String(AIRSPACE_RADIUS_METERS));
  upstream.searchParams.set("limit", "1000");
  upstream.searchParams.set("page", "1");

  try {
    const response = await fetch(upstream, {
      headers: {
        "x-openaip-api-key": apiKey,
        "Accept": "application/json",
        "User-Agent": "EDNX-Live-Radar/8.3",
      },
    });

    const text = await response.text();

    if (!response.ok) {
      return json(
        {
          error: `openAIP HTTP ${response.status}`,
          details: text.slice(0, 500),
        },
        502,
      );
    }

    const data = JSON.parse(text);
    const items = Array.isArray(data.items) ? data.items : [];

    const compact = items.map((item: Record<string, unknown>) => ({
      _id: item._id,
      name: item.name,
      type: item.type,
      icaoClass: item.icaoClass,
      upperLimit: item.upperLimit,
      lowerLimit: item.lowerLimit,
      geometry: item.geometry,
    }));

    return json(
      {
        items: compact,
        totalCount: data.totalCount ?? compact.length,
        cachedForSeconds: WEEK,
      },
      200,
      {
        "Cache-Control": `public, max-age=${WEEK}, stale-while-revalidate=${WEEK * 4}`,
        "Deno-CDN-Cache-Control": `public, s-maxage=${WEEK}, stale-while-revalidate=${WEEK * 4}`,
        "Deno-Cache-Id": "ednx-airspaces-v1",
        "Deno-Cache-Tag": "ednx-airspaces",
      },
    );
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : String(error) },
      500,
    );
  }
}

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (url.pathname === "/api/aircraft") {
      return aircraft(request);
    }

    if (url.pathname === "/api/airspaces") {
      return airspaces();
    }

    if (url.pathname === "/health") {
      return json({ ok: true, app: "EDNX Live Radar", version: "8.3" });
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(request.method === "HEAD" ? null : indexHtml, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
          "Deno-CDN-Cache-Control": "public, s-maxage=60",
        },
      });
    }

    return new Response("404: Not Found", { status: 404 });
  },
} satisfies Deno.ServeDefaultExport;
