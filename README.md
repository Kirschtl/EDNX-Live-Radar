# EDNX Live Radar Web v8.1 – ADS-B ohne Netlify

## Architektur
- Web-App: weiterhin statisch auf Netlify
- ADS-B Live-Daten: **Cloudflare Worker → ADSB.lol**
- openAIP Airspaces: weiterhin Netlify Function (API-Key bleibt geheim)
- Die Netlify Function `aircraft.mjs` wurde entfernt.

Damit erzeugt der laufende 10-Sekunden-ADS-B-Abruf keine Netlify-Function-Aufrufe mehr.

## Cloudflare Worker einrichten
1. Kostenloses Cloudflare-Konto öffnen.
2. Workers & Pages → Create → Worker.
3. Inhalt aus `cloudflare-worker.js` einfügen und deployen.
4. Die erzeugte Adresse kopieren, z. B.
   `https://ednx-adsb-proxy.USERNAME.workers.dev`
5. In `index.html` ganz oben diese Zeile ändern:
   `const ADSB_PROXY_BASE='https://YOUR-WORKER.workers.dev';`
   auf deine echte Worker-Adresse.
6. Geänderte `index.html` nach GitHub hochladen; Netlify deployt die Web-App automatisch.

## Verbrauch
Cloudflare Workers Free erlaubt aktuell 100.000 Requests pro Tag.
Bei einem ADS-B-Abruf alle 10 Sekunden sind das ca. 8.640 Requests/Tag pro dauerhaft geöffnetem Display.

## Sicherheit
Für ADSB.lol ist kein geheimer API-Key nötig. Der Worker darf daher CORS für den Browser freigeben.
Der openAIP-Key bleibt weiterhin nur in Netlify.
