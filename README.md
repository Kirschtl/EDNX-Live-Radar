# EDNX Live Radar v7.6

OpenStreetMap komplett neu umgesetzt, ohne Leaflet.

Warum:
- Die vorherigen Leaflet-Versionen zeigten auf dem Zielbrowser falsch/fragmentiert positionierte Tiles.
- Zusätzlich brach die OSM-Overlay-Logik durch eine falsche Trail-Variable ab.

v7.6:
- RADAR bleibt die stabile SVG-Ansicht.
- OPENSTREETMAP nutzt einen eigenen Slippy-Map-Renderer:
  - OSM-Kacheln werden anhand der offiziellen Web-Mercator-Tile-Mathematik selbst positioniert.
  - Keine Leaflet-CSS-/Layout-Abhängigkeit.
- Flugzeuge, Trails, EDNX und openAIP-Lufträume werden im OSM-Modus mit exakt derselben Web-Mercator-Projektion gerendert.
- Damit liegen München, EDNX, Traffic und Airspaces in derselben geografischen Projektion.
- SCREEN: RADAR / OPENSTREETMAP
- AIRSPACE: AN / AUS
- Range 10/15/20/30/50/75/100 km
- Hubschrauber-Symbole bleiben erhalten.
