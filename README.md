# EDNX Live Radar v7.1

Fixes gegenüber v7:
- geografische Projektion korrigiert: Ost/West und Nord/Süd nutzen jetzt exakt denselben Pixel-pro-km-Maßstab
- dadurch werden CTR/RMZ-Polygone nicht mehr horizontal verzerrt
- Filter `EDDM CTR + EDNX RMZ` korrigiert
- erkennt u.a. `CTR MUENCHEN`, `CTR SEKTOR EDNX (HX)` und `RMZ EDNX`
- `ALLE` bleibt unverändert verfügbar

Hinweis:
Die rechteckige Radarfläche bleibt bestehen. Die tatsächliche geografische Darstellung wird darin 1:1 skaliert; dadurch können links/rechts ungenutzte Randbereiche entstehen. Das ist beabsichtigt und verhindert Verzerrungen.
