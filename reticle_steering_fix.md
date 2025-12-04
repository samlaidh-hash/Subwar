# Reticle-Based Steering System - FIXED
**Date**: 2025-09-30
**Status**: ✅ IMPLEMENTED CORRECTLY

---

## What Was Wrong

I misunderstood the original request. I was implementing:
- Icon position → directly controls submarine rotation
- Submarine tries to align its center with icon

## What You Actually Wanted

- **Reticle is always projected ahead of submarine** (based on sub's heading)
- **Submarine turns to bring the reticle toward the icon**
- **The error/offset between reticle and icon drives the turning**

This is a **lead pursuit system** - you're trying to get your nose (reticle) pointed at a target (icon).

---

## How It Now Works

### 1. **Firing Reticle Position**
- Reticle stays fixed ahead of submarine (4 sub lengths)
- Projected based on submarine's current heading
- Always visible on screen

### 2. **Maneuver Icon Position**
- You move mouse → icon moves on screen
- Icon can be anywhere within bounds
- Still has auto-drift back to center (after 0.5s no movement)

### 3. **Error Calculation**
```
Error = Icon Position - Reticle Position
```

- If icon is right of reticle → error is positive → turn right
- If icon is left of reticle → error is negative → turn left
- If icon is above reticle → error is positive → pitch up
- If icon is below reticle → error is negative → pitch down

### 4. **Submarine Turning**
```javascript
yawRate = errorX * turnSensitivity
pitchRate = errorY * pitchSensitivity
```

The submarine turns at a rate proportional to the error, chasing the icon with the reticle.

---

## Implementation Details

**File**: `js/submarine.js:4289-4382`

### Step 1: Project Reticle to Screen Space
```javascript
// Get reticle world position
const reticleWorldPos = this.firingReticle.position.clone();

// Project to screen using camera
const reticleScreenPos = reticleWorldPos.project(camera);

// Convert to screen pixels
const reticleScreenX = (reticleScreenPos.x * centerX) + centerX;
const reticleScreenY = -(reticleScreenPos.y * centerY) + centerY;

// Normalize to -1 to 1 (like maneuver icon)
const reticleNormX = (reticleScreenX - centerX) / centerX;
const reticleNormY = (reticleScreenY - centerY) / centerY;
```

### Step 2: Calculate Error
```javascript
const errorX = this.maneuverIcon.x - reticleNormX;
const errorY = this.maneuverIcon.y - reticleNormY;
```

### Step 3: Apply Turning
```javascript
const turnSensitivity = 2.0;
const pitchSensitivity = 1.5;

if (!inDeadZone) {
    const yawRate = errorX * turnSensitivity;
    this.mesh.rotation.y += yawRate * deltaTime;

    const pitchRate = errorY * pitchSensitivity;
    this.mesh.rotation.z += pitchRate * deltaTime;
}
```

---

## Behavior

### When You Move Mouse Right:
1. Maneuver icon moves right
2. Error becomes positive (icon > reticle)
3. Submarine yaws right
4. Reticle moves right toward icon
5. Error decreases
6. Turning slows as reticle approaches icon

### When Icon Is In Dead Zone (Center):
- Error is near zero
- Submarine levels out
- Auto-level for roll and pitch
- Straight and level flight

### Auto-Drift:
- After 0.5s of no mouse input
- Icon drifts back to center at 0.8 units/sec
- Submarine automatically levels out
- Can interrupt by moving mouse

---

## Tuning Parameters

### Turn Sensitivity
```javascript
const turnSensitivity = 2.0; // Higher = faster horizontal turning
const pitchSensitivity = 1.5; // Higher = faster vertical movement
```

**Adjust these if**:
- Submarine turns too slowly → increase
- Submarine turns too aggressively/oscillates → decrease
- Recommend: 1.0 - 3.0 range

### Dead Zone
```javascript
deadZoneRadius: 0.15 // In maneuverIcon initialization
```

**Adjust this if**:
- Hard to maintain level flight → increase (bigger dead zone)
- Submarine not responsive enough → decrease
- Recommend: 0.1 - 0.2 range

### Auto-Drift
```javascript
driftDelay: 500 // ms before drift starts
driftSpeed: 0.8 // units per second
```

---

## Key Differences From Before

| Aspect | Before (Wrong) | After (Correct) |
|--------|---------------|-----------------|
| **Input** | Icon position directly | Error between icon and reticle |
| **Reticle** | Stays ahead but ignored | Actively chases icon |
| **Behavior** | Direct control | Lead pursuit |
| **Feel** | Immediate response | Smooth chase |
| **Alignment** | Sub center with icon | Reticle with icon |

---

## Testing Checklist

1. **Basic Turning**:
   - Move icon right → reticle should chase it right
   - Move icon left → reticle should chase it left
   - ✅ Reticle should visibly move toward icon

2. **Dead Zone**:
   - Center icon → submarine levels out
   - No oscillation or wobbling
   - ✅ Stable level flight

3. **Auto-Drift**:
   - Move icon, stop mouse
   - Wait 0.5 seconds
   - ✅ Icon should drift back to center smoothly

4. **Chase Behavior**:
   - Move icon in circles
   - ✅ Reticle should follow in smooth circles
   - Submarine should bank naturally

5. **Sensitivity**:
   - Large icon movements → reticle chases quickly
   - Small icon movements → reticle tracks precisely
   - ✅ No overshoot or oscillation

---

## Known Behaviors

### Reticle Lag
The reticle will **always lag behind the icon** - this is correct! The submarine needs time to turn. The reticle chases the icon, reducing the error over time.

### Banking
The submarine banks (rolls) naturally during turns based on the existing banking logic in the code.

### Pitch Limits
Pitch is clamped to ±60 degrees to prevent the submarine from doing loops.

### Dead Zone Behavior
When icon returns to center, submarine smoothly levels out. This creates stable, predictable straight flight.

---

## If Something Feels Off

### Submarine turns too slowly:
```javascript
const turnSensitivity = 3.0; // Increase from 2.0
const pitchSensitivity = 2.5; // Increase from 1.5
```

### Submarine oscillates/wobbles:
```javascript
const turnSensitivity = 1.0; // Decrease from 2.0
const pitchSensitivity = 0.8; // Decrease from 1.5
```

### Hard to fly straight:
```javascript
deadZoneRadius: 0.2 // Increase from 0.15
```

### Reticle doesn't chase icon at all:
- Check console for errors
- Verify `window.gameState.camera` exists
- Verify `this.firingReticle.position` is set

---

## Summary

The submarine now works like a **pursuit system**:
1. You place the target icon where you want to aim
2. The submarine turns to bring its firing reticle toward that point
3. The reticle chases the icon smoothly
4. When you center the icon (or it auto-drifts), submarine levels out

This gives you **precise aiming control** while maintaining the **feel of flying a submarine** rather than directly controlling rotation.

**Status**: Ready for testing
**Next**: Test in-game and adjust sensitivity values if needed
