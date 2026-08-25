# EDNX Live Radar v7.5

Wesentliche Änderung:
- RADAR und OPENSTREETMAP sind jetzt zwei getrennte Render-Engines.
- RADAR benutzt weiterhin die lokale km-basierte SVG-Projektion.
- OPENSTREETMAP wird vollständig von Leaflet/Web-Mercator gerendert.
- In OSM werden nun auch Flugzeuge, Tracks, EDNX und openAIP-Lufträume direkt über ihre geografischen Koordinaten von Leaflet positioniert.
- Das bisherige problematische Übereinanderlegen von OSM-Tiles und dem Radar-SVG entfällt vollständig.
- SCREEN: RADAR / OPENSTREETMAP
- AIRSPACE: AN / AUS
- Range und übrige Filter bleiben erhalten.
