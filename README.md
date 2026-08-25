# EDNX Live Radar v6.3

Karten-Fix:
- OFM-Basiskacheln werden nicht mehr verwendet.
- Stabiler OpenStreetMap-Untergrund (normale 256px Slippy Tiles).
- Darüber nur der transparente OpenFlightMaps-Aero-Layer.
- Der OFM-Aero-Layer nutzt Leaflets Standard-Tile-Geometrie, ohne tileSize/zoomOffset-Manipulation.
- VFR MAP bleibt per Toggle AN/AUS.
- Radar/Traffic/Trails bleiben aus der stabilen v5/v6.1-Version.

Warum:
Die 512px OFM-Basiskacheln führten in der bisherigen direkten Leaflet-Einbindung zu fehlerhafter Kachelgeometrie.
Der Aero-Layer wird als transparentes Luftfahrt-Overlay über einer stabilen OSM-Basiskarte genutzt.
