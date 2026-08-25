# EDNX Live Radar v6.2

Fix gegenüber v6.1:
- OpenFlightMaps liefert 512px-Kacheln.
- Leaflet wurde dafür auf `tileSize: 512` und `zoomOffset: -1` eingestellt.
- Dadurch sollten die OFM-Kacheln wieder nahtlos und geografisch korrekt zusammengesetzt werden.

Sonst unverändert:
- stabiles v5-Radar
- VFR MAP Toggle AN/AUS
- Trails in Geo-Koordinaten
- kein Beam
- Ground Traffic nur EDNX
