export default {
  async fetch(request, env, ctx) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, max-age=3"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    try {
      const url = new URL(request.url);
      let km = Number(url.searchParams.get("radius") || 30);
      if (!Number.isFinite(km)) km = 30;
      km = Math.max(5, Math.min(100, km));

      // ADSB.lol point API uses nautical miles.
      const nm = Math.max(1, Math.ceil(km / 1.852));
      const upstream =
        `https://api.adsb.lol/v2/point/48.239166/11.559334/${nm}`;

      // Short edge cache: if several displays request nearly simultaneously,
      // Cloudflare can reuse the same ADS-B response.
      const cache = caches.default;
      const cacheKey = new Request(
        `https://ednx-radar-cache.invalid/aircraft?radius=${km}`,
        request
      );

      let cached = await cache.match(cacheKey);
      if (cached) {
        const headers = new Headers(cached.headers);
        Object.entries(cors).forEach(([k,v]) => headers.set(k,v));
        headers.set("X-EDNX-Cache", "HIT");
        return new Response(cached.body, { status: cached.status, headers });
      }

      const upstreamResponse = await fetch(upstream, {
        headers: { "User-Agent": "EDNX-Live-Radar-Web/8.1" }
      });

      if (!upstreamResponse.ok) {
        return new Response(
          JSON.stringify({ error: `ADSB.lol HTTP ${upstreamResponse.status}` }),
          {
            status: 502,
            headers: { ...cors, "Content-Type": "application/json; charset=utf-8" }
          }
        );
      }

      const body = await upstreamResponse.text();
      const responseHeaders = {
        ...cors,
        "Content-Type": "application/json; charset=utf-8",
        "X-EDNX-Cache": "MISS"
      };

      const response = new Response(body, {
        status: 200,
        headers: responseHeaders
      });

      // Cache only a few seconds; still feels live, but reduces duplicate upstream calls.
      ctx.waitUntil(
        cache.put(
          cacheKey,
          new Response(body, {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": "public, max-age=3"
            }
          })
        )
      );

      return response;
    } catch (err) {
      return new Response(
        JSON.stringify({ error: String(err) }),
        {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json; charset=utf-8" }
        }
      );
    }
  }
};
