# EDNX Live Radar v7

Neu:
- echte openAIP-Lufträume als GeoJSON-Polygone
- keine OpenFlightMaps-/Leaflet-Tiles mehr
- AIRSPACE-Schalter:
  - AUS
  - CTR + RMZ (lokal: München CTR / EDNX-Oberschleißheim RMZ)
  - ALLE
- CTR magenta
- RMZ blau
- andere Lufträume grau (nur bei ALLE)
- Range-Wechsel projiziert die Lufträume zusammen mit Traffic/Trails neu
- openAIP-Key bleibt serverseitig in Netlify (`OPENAIP_API_KEY`)
- openAIP-Antwort wird gecacht, um API- und Netlify-Verbrauch zu reduzieren

Daten:
- Traffic: ADSB.lol
- Airspaces: openAIP Core API
