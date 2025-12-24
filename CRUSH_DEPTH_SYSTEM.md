# Crush Depth System Enhancement

## Changes Applied

### 1. Warning When Approaching Maximum Depth ✅
**File:** `js/submarine.js:7231-7300`

**Added:**
- Warning triggers when submarine reaches 90% of maximum depth
- Shows status message: "⚠️ APPROACHING MAXIMUM DEPTH! Xm remaining (Y% margin)"
- Warning appears every 2 seconds while approaching
- Plays hull stress sound as warning

**Implementation:**
- `warningThreshold = crushDepth * 0.9` (90% of crush depth)
- Calculates depth remaining and percentage margin
- Uses `showStatusMessage()` to display warnings

### 2. Damage When Exceeding Maximum Depth ✅
**File:** `js/submarine.js:7240-7275`

**Enhanced:**
- Damage system already existed but improved messaging
- Base damage: 1% hull HP per second at crush depth
- Damage increases with depth excess: +1% per meter below crush depth
- Random variation: ±20% (0.8x to 1.2x multiplier)

**Damage Formula:**
```
damagePerSecond = baseDamageRate × depthMultiplier × randomVariation
where:
  baseDamageRate = 0.01 (1% per second)
  depthMultiplier = 1 + (depthExcess / 100)
  randomVariation = 0.8 + (Math.random() * 0.4)
```

**Examples:**
- At crush depth: 1% HP/sec
- At crush depth + 50m: 1.5% HP/sec (50% more)
- At crush depth + 100m: 2.0% HP/sec (100% more)
- At crush depth + 200m: 3.0% HP/sec (200% more)

**Warning Messages:**
- Normal exceedance: "⚠️ EXCEEDING MAXIMUM DEPTH! Xm over limit - Taking Y% hull damage/sec"
- Critical exceedance (>50m over): "🌊 CRITICAL DEPTH! Xm over limit - Taking Y% hull damage/sec"
- Implosion: "💥 HULL IMPLOSION! Submarine destroyed by crushing pressure!"

### 3. Torpedo Types Available ✅

**Three Torpedo Types:**

#### Light Torpedo (LT)
- **Damage:** 50
- **Max Speed:** 200 knots (fastest)
- **SCAV Speed:** 100 knots
- **Maneuverability:** 0.9 (High - most maneuverable)
- **Lock Time:** 2000ms (active), 4000ms (passive)
- **Terminal Range:** 300m
- **Max Range:** 4000m
- **Load Time:** 30 seconds
- **Special:** Can intercept torpedoes
- **Availability:** All submarines

#### Medium Torpedo (MT)
- **Damage:** 100
- **Max Speed:** 160 knots
- **SCAV Speed:** 80 knots
- **Maneuverability:** 0.6 (Medium)
- **Lock Time:** 5000ms (active), 10000ms (passive)
- **Terminal Range:** 400m
- **Max Range:** 6000m
- **Load Time:** 30 seconds
- **Availability:** All submarines

#### Heavy Torpedo (HT)
- **Damage:** 150 (highest)
- **Max Speed:** 130 knots (slowest)
- **SCAV Speed:** 60 knots
- **Maneuverability:** 0.3 (Low - least maneuverable)
- **Lock Time:** 8000ms (active), 15000ms (passive)
- **Terminal Range:** 500m
- **Max Range:** 8000m
- **Load Time:** 30 seconds
- **Availability:** Submarines with `canCarryHeavyTorpedoes: true`

**Torpedo Selection:**
- Use number keys (1-4) to cycle through torpedo boxes
- Yellow highlight shows selected torpedo
- Press Space to fire sequentially (tube 1→2→3→4)
- Reload with number keys after all tubes fired

## Summary

**Crush Depth System:**
1. ✅ Warning at 90% of maximum depth
2. ✅ Damage starts when exceeding maximum depth
3. ✅ Damage increases with depth excess (further below = more damage)
4. ✅ Random damage variation (±20%)
5. ✅ Visual and audio warnings

**Torpedo Types:**
- Light (LT): Fast, maneuverable, low damage
- Medium (MT): Balanced
- Heavy (HT): Slow, high damage, requires compatible submarine

