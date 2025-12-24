# Terrain Visibility, Blue Color, and Enemy Spawn Fixes

## Issues Fixed

### 1. Terrain Visibility Not Limited to Sensor Ranges ✅
**Problem:** Whole map was visible, not limited to 500m passive or 6km active ranges.

**Fix:** Updated `updateTerrainLOD()` in `js/ocean.js` to properly check visibility:
- Passive mode: Only chunks within 500m are visible
- Active sonar ping: Chunks within 6km are visible (with fade alpha)
- Chunks beyond range are properly hidden (`chunk.group.visible = false`)

**Changes:**
- Removed blind spot calculation (was causing issues)
- Added proper alpha threshold check (`pingAlpha > 0.01`)
- Ensured passive range chunks are always visible when within 500m

### 2. Blue Color Artifacts During Sonar Ping ✅
**Problem:** Active sonar ping made various bits of terrain change color to blue.

**Fix:** Added `discard` statement in terrain shader to prevent rendering fragments with very low alpha.

**Changes in `js/simple_terrain_fix.js`:**
```glsl
// Discard fragments with very low alpha to prevent color artifacts
if (finalAlpha < 0.01) {
    discard;
}
```

This prevents terrain fragments with alpha < 0.01 from rendering, eliminating blue color artifacts from semi-transparent fragments.

### 3. Enemy Spawn Function ✅
**Problem:** Need to spawn enemy sub 400m ahead for testing.

**Fix:** Added `spawnEnemyAhead()` function to `EnemyManager` class and global helper function.

**Usage:**
```javascript
// Spawn enemy 400m ahead (default)
window.spawnEnemyAhead();

// Spawn enemy at custom distance
window.spawnEnemyAhead(600, 'attack');

// Spawn different enemy types
window.spawnEnemyAhead(400, 'patrol');
window.spawnEnemyAhead(400, 'hunter-killer');
```

**Implementation:**
- `EnemyManager.spawnEnemyAhead(playerSubmarine, distance, type)` - Instance method
- `window.spawnEnemyAhead(distance, type)` - Global helper function
- Calculates forward direction from player submarine quaternion
- Spawns enemy at specified distance ahead, same depth as player

### 4. Game Space Dimensions Verification ✅

**Submarine Scale:**
- Tornado class submarine: **24 meters** hull length (from specs)
- Model length: **5 units** (in Three.js scene)
- **Scale: 1 unit = 4.8 meters**

**Game Space Dimensions:**
- Total terrain size: **70,000 meters** (70km × 70km)
- In model units: **14,583 units** × **14,583 units**
- Relative to submarine: **~2,917 submarine lengths** × **2,917 submarine lengths**

**Chunk System:**
- Chunk size: **1,000 meters** (1km chunks)
- Chunks per side: **70 chunks** (70 × 70 = 4,900 total chunks)
- Each chunk: **~208 submarine lengths** × **208 submarine lengths**

**Sensor Ranges:**
- Passive range: **500m** = **~104 units** = **~21 submarine lengths**
- Active sonar range: **6,000m** = **1,250 units** = **~250 submarine lengths**

## Summary

All issues have been fixed:
1. ✅ Terrain visibility now properly limited to sensor ranges
2. ✅ Blue color artifacts eliminated with shader discard
3. ✅ Enemy spawn function available: `window.spawnEnemyAhead(400)`
4. ✅ Game space dimensions verified and documented

The game space is correctly scaled with 70km × 70km terrain, and visibility is properly limited to 500m passive / 6km active ranges.

