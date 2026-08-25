Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);

    let radiusKm = Number(url.searchParams.get("radius") || 30);

    if (!Number.isFinite(radiusKm)) {
      radiusKm = 30;
    }

    radiusKm = Math.max(5, Math.min(100, radiusKm));

    // Kilometer -> nautische Meilen
    const radiusNm = Math.ceil(radiusKm / 1.852);

    // EDNX Oberschleißheim
    const lat = 48.239166;
    const lon = 11.559334;

    /*
     * Wir probieren mehrere öffentliche ADS-B-Endpunkte.
     * Sobald einer funktioniert und gültige Flugzeugdaten liefert,
     * wird dessen Antwort an die Radar-Webapp weitergegeben.
     */
    const sources = [
      {
        name: "adsb.lol",
        url: `https://api.adsb.lol/v2/point/${lat}/${lon}/${radiusNm}`,
      },
      {
        name: "adsb.fi",
        url: `https://opendata.adsb.fi/api/v2/lat/${lat}/lon/${lon}/dist/${radiusNm}`,
      },
      {
        name: "adsb.one",
        url: `https://api.adsb.one/v2/point/${lat}/${lon}/${radiusNm}`,
      },
    ];

    const errors: string[] = [];

    for (const source of sources) {
      try {
        const response = await fetch(source.url, {
          headers: {
            "Accept": "application/json",
            "User-Agent": "EDNX-Live-Radar/1.0",
          },
        });

        if (!response.ok) {
          errors.push(`${source.name}: HTTP ${response.status}`);
          continue;
        }

        const data = await response.json();

        /*
         * Die verschiedenen Anbieter verwenden teilweise
         * unterschiedliche Feldnamen. Wir vereinheitlichen
         * die Antwort für unsere Radar-App.
         */
        const aircraft =
          data.ac ??
          data.aircraft ??
          data.states ??
          [];

        if (!Array.isArray(aircraft)) {
          errors.push(`${source.name}: ungültiges Datenformat`);
          continue;
        }

        return new Response(
          JSON.stringify({
            ...data,
            ac: aircraft,
            source: source.name,
            radiusKm,
            radiusNm,
          }),
          {
            status: 200,
            headers: corsHeaders,
          },
        );

      } catch (error) {
        errors.push(
          `${source.name}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    return new Response(
      JSON.stringify({
        error: "No ADS-B source available",
        sources: errors,
        radiusKm,
        radiusNm,
      }),
      {
        status: 502,
        headers: corsHeaders,
      },
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
});