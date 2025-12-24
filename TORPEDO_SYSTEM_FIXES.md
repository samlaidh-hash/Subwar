# Torpedo System and Speed Fixes

## Changes Applied

### 1. Mouse Wheel Speed Control - Fixed Scale ✅
**File:** `js/submarine.js:4234-4248`

**Fixed:**
- Speed now correctly converts knots to meters per second
- 1 knot = 0.5144 m/s
- Movement per frame = speed (knots) × 0.5144 × deltaTime
- Ensures realistic submarine movement speed in game space

**Before:**
```javascript
const moveSpeed = 1.03; // Fixed multiplier
const forwardMovement = forwardDirection.multiplyScalar(this.speed * moveSpeed);
```

**After:**
```javascript
const knotsToMetersPerSecond = 0.5144;
const moveSpeed = this.speed * knotsToMetersPerSecond * deltaTime;
const forwardMovement = forwardDirection.multiplyScalar(moveSpeed);
```

### 2. Number Keys - Cycle Torpedoes Left to Right ✅
**File:** `js/submarine.js:3834-3854, cycleTorpedoBox()`

**Fixed:**
- Number keys (1-4) now cycle through torpedo boxes left to right
- One press = moves highlight one box to the right
- Wraps around: after box 6, goes back to box 0
- Multiple tubes can have highlighted boxes simultaneously

**Implementation:**
- `cycleTorpedoBox(launcherNumber)` - Moves highlight one box right per press
- Each launcher tracks its own `currentBox` (-1 = none, 0-6 = box positions)

### 3. Yellow Highlight for Selected Torpedoes ✅
**File:** `js/submarine.js:4775, updateLauncherDisplay()`

**Fixed:**
- All highlighted boxes show yellow highlight (`.selected` class)
- CSS already has yellow highlight styling
- Multiple tubes can have highlights simultaneously

### 4. Sequential Firing System ✅
**File:** `js/submarine.js:fireSequentialTorpedo()`

**Fixed:**
- Space fires tube 1, removes highlight, moves to tube 2
- Next Space fires tube 2, removes highlight, moves to tube 3
- Continues through tubes 1→2→3→4→1
- After firing, removes highlight from that tube's current box

**Implementation:**
- `sequentialFiring.nextTubeToFire` - Tracks which tube fires next (1-4)
- `sequentialFiring.firedTubes` - Set of tubes that have been fired
- `sequentialFiring.allFired` - Flag when all 4 tubes fired

### 5. Reload System ✅
**File:** `js/submarine.js:reloadTube()`

**Fixed:**
- After all 4 tubes fired, number keys reload tubes instead of cycling
- Press number key (1-4) to reload that tube
- Reloads first available empty chamber with available torpedo type
- Prioritizes MT, then LT, then HT
- Resets firing state when all tubes reloaded

**Implementation:**
- Checks `sequentialFiring.allFired` flag
- `reloadTube(tubeNumber)` - Reloads specified tube
- Resets `firedTubes` set and `allFired` flag when complete

## Summary

All requested features implemented:
1. ✅ Mouse wheel controls speed with correct scale (knots → m/s)
2. ✅ Number keys cycle torpedoes left to right (one press = one box)
3. ✅ Yellow highlight on selected torpedo boxes
4. ✅ Multiple tubes can have highlights
5. ✅ Space fires sequentially (tube 1→2→3→4)
6. ✅ Removes highlight after firing
7. ✅ Reload system after all tubes fired



