# 2026-03-17 — Streaming 2×2 km terrain, G map snapshot, procedural hulls

## Terrain
- `SimpleTerrain.terrainStreamingEnabled`: local **2000 m** patches, **40×40** segments, height from **`getHeightAtPosition`** (same 70 km function).
- Cross-fade **~220 ms** when sub moves **>650 m** from patch anchor and cell changes.
- Two **thermocline** sheets per patch: **400 m** and **1100 m** depth → **y = 300 − depth** (−100, −800).
- Ocean **`createDualThermoclines`** skipped when streaming; seabed queries prefer **`simpleTerrain.getHeightAtPosition`**.

## G — map snapshot
- **Freezes** gameplay (`update` skipped); own render loop branch with **orthographic** “isometric” view.
- Shows cached **70×70 km** low-poly overview + pale thermoclines; **HTML HUD hidden** via `body.map-snapshot-mode`.
- **Pan** LMB drag, **wheel** zoom; **G / Esc / P** exit.
- **Sonar ping** removed from **G** (was duplicate handler).

## Submarine
- Default **COBRA** mesh: **`buildProceduralEliteHull`** (`js/procedural_sub_hulls.js`), variants **0–5** via `window.SUB_HULL_VARIANT` or **`?hull=`**.
- **`SUB_USE_OOLITE_MODEL = true`** for async Oolite JSON.
- Player mesh rotation **(0,0,0)** — hull built along **+X**.

## Performance note (Q15)
- For local patches, **flat `MeshBasicMaterial`** on moderate segment counts is usually **less expensive** than **wireframe** on the same topology (line overdraw). Overview snapshot uses **MeshBasicMaterial** intentionally.
