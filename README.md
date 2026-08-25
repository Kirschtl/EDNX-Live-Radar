# EDNX Live Radar v8.0 – Web

Diese Version überträgt den finalen Stand der Fire-TV-App v2.0 auf die Netlify-Webapp.

Übernommen:
- adaptive Radar-Geometrie / bildschirmfüllende Darstellung
- korrigierte Skalierung für kleine Ranges
- 5 / 10 / 15 / 20 / 30 / 50 / 75 / 100 km
- OpenStreetMap-Projektion und Kachel-Skalierung aus der Fire-TV-Version
- Flugzeuge und Airspaces auch in der Kartenansicht
- Ziel-Cache / Coasting bei kurzzeitig fehlenden ADS-B-Zielen
- robustere Aktualisierung bei 429/502/503/504
- Trail-Historie bleibt beim Umschalten und bei Range-Wechseln konsistent
- kompaktere Seitenliste und Bedienleiste
- Hubschrauber-Symbole und bestehende Filter

Web-spezifisch:
- ADS-B: /.netlify/functions/aircraft
- Airspaces: /.netlify/functions/airspaces

Damit ist die Darstellungs-/Filterlogik weitgehend identisch zur Fire-TV-v2.0-Version,
während die Webapp weiterhin über die vorhandenen Netlify Functions arbeitet.
