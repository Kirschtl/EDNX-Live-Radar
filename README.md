# EDNX Live Radar Web v8.2 – ADS-B via Deno

## Architektur
- Web-App: weiterhin statisch auf Netlify
- ADS-B Live-Daten: Deno Deploy → ADSB.lol
- openAIP Airspaces: weiterhin Netlify Function
- Die Netlify Function `aircraft.mjs` ist entfernt

## Deno ADS-B Proxy
Produktionsadresse:
`https://ednx-adsb-proxy.kirschtl.deno.net`

Die Web-App fragt den Proxy mit `?radius=<km>` ab.

## Ergebnis
Die laufenden ADS-B-Abfragen erzeugen keine Netlify-Function-Aufrufe mehr.
Netlify wird nur noch für die statische Web-App und den Airspace-Proxy verwendet.
