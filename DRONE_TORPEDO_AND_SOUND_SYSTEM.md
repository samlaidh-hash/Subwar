# Drone Torpedo and Sound System Implementation

## Overview
Implemented Drone (DN) torpedo type and comprehensive sound system with file-based audio support.

---

## 1. Drone (DN) Torpedo System ✅

### Torpedo Specifications
- **Type Code:** DN
- **Damage:** 0 (reconnaissance only)
- **Speed:** 100 knots (~51 m/s)
- **Behavior:** Travels straight in direction fired (no lock-on required)
- **Activation:** After traveling 1km, reveals 2km diameter bubble around itself
- **Termination:** Travels until map edge or terrain collision, then stops and implodes
- **Default Loadout:** 1 DN in slot 6 of each launcher

### Implementation Details
- Added `DN` to `TORPEDO_SPECIFICATIONS` in `js/submarine.js`
- Updated `initializeDefaultLoadouts()` to place DN in slot 6 (index 5) of all launchers
- Modified `launchTorpedo()` and `fireSequentialTorpedo()` to allow DN launch without lock-on
- Created `createDroneTorpedo()` method with:
  - Straight-line movement in launch direction
  - 1km activation range
  - 2km bubble rendering system
  - Map boundary detection
  - Terrain collision detection (placeholder)
  - Visual mesh (green-cyan box)

### Bubble Rendering
- After 1km travel, drone activates bubble rendering
- Reveals terrain and enemies within 2km diameter
- Updates sonar contacts display
- Integrates with terrain visibility system

---

## 2. Sound File System ✅

### File Loading
- Supports both `.wav` and `.mp3` formats
- Automatic fallback: tries `.wav` first, then `.mp3`
- Sound cache system for performance
- Preloads common sounds on initialization

### Sound Directory
- All sounds loaded from `SOUNDS/` directory
- Files expected:
  - `active_constant_pinging.wav/mp3`
  - `active_single_ping.wav/mp3`
  - `torpedo_launch.wav/mp3`
  - `underwater_ambience.wav/mp3`
  - `deep_underwater_ambience.wav/mp3`
  - `knuckle.wav/mp3`
  - `underwater_explosion.wav/mp3`
  - `underwater_impact.wav/mp3`
  - `hit.wav/mp3`
  - `proximity.wav/mp3`
  - `active_single_pings.wav/mp3` (for torpedo pings)

### AudioManager Methods
- `loadSoundFile(filename)` - Loads sound file with format fallback
- `playSoundFile(filename, volume, loop)` - Plays sound file (one-shot or looped)
- `stopSoundFile(audioInstance)` - Stops specific sound instance

---

## 3. Sound Triggers ✅

### Active Sonar Sounds
- **Active Mode Constant Pinging:**
  - Starts when sonar mode switched to 'Active'
  - Loops `active_constant_pinging` sound
  - Stops when switched to 'Passive'
  - Triggered in `cycleSonarMode()`

- **Single Active Ping:**
  - Plays `active_single_ping` when R key pressed
  - Triggered in `performSonarPing()`

### Torpedo Launch Sound
- Plays `torpedo_launch` when torpedo launched
- Triggered in `launchTorpedo()` and `fireSequentialTorpedo()`

### Ambience System
- **Above 3000m:** Plays `underwater_ambience` continuously
- **Below 3000m:** Fades from `underwater_ambience` to `deep_underwater_ambience`
- Fade occurs over 1km depth range (3000m to 4000m)
- Smooth volume transitions
- Triggered in `update()` method based on current depth

### Knuckle Sound
- Plays `knuckle` sound for 2 seconds when knuckle formed
- Triggered in `createKnuckle()` method
- Also triggered in `checkKnuckleFormation()` for high turn rates

### Explosion/Impact Sounds
- **Underwater Explosion:** `underwater_explosion` when submarine/structure implodes
- **Underwater Impact:** `underwater_impact` when sub collides with something
- **Hit:** `hit` when torpedo hits target but doesn't destroy it
- Methods available in AudioManager, need to be called from collision/impact handlers

### Proximity Sound
- Plays `proximity` sound when enemy submarine within 1000m
- Volume increases as distance decreases (closer = louder)
- Smooth fade in/out
- Triggered in `updateProximitySound()` method
- Called every frame in `update()` method

---

## 4. Torpedo Ping Sound System ✅

### Ping Rate Algorithm
- **Start Distance:** 2km to target
- **Initial Ping Interval:** 3 seconds
- **Close Range Interval:** 0.2 seconds (just before impact)
- **Interpolation:** Linear between 2km and 50m

### Behavior
- Each torpedo plays its own ping sound (`active_single_pings`)
- Ping rate increases linearly as torpedo approaches target
- If torpedo misses, ping rate slows down gradually
- Ping stops completely if interval exceeds 10 seconds
- Ping stops if target lost or distance > 2km

### Implementation
- `startTorpedoPing(torpedoId, distanceToTarget, hasTarget)` - Starts ping for torpedo
- `updateTorpedoPing(torpedoId, distanceToTarget, hasTarget)` - Updates ping rate
- `stopTorpedoPing(torpedoId)` - Stops ping for torpedo
- Called from `updateTorpedoPingSounds()` in main update loop

---

## 5. Integration Points

### Game Loop Updates
Added to `update()` method:
- `updateAmbience()` - Updates depth-based ambience
- `updateProximitySound()` - Updates proximity sound for nearby enemies
- `updateDrones()` - Updates drone torpedoes and bubble rendering
- `updateTorpedoPingSounds()` - Updates torpedo ping sounds
- `checkKnuckleFormation()` - Checks for knuckle formation

### Sonar System Integration
- `cycleSonarMode()` - Starts/stops active sonar constant pinging
- `performSonarPing()` - Plays single active ping sound

### Torpedo System Integration
- `launchTorpedo()` - Plays torpedo launch sound
- `fireSequentialTorpedo()` - Plays torpedo launch sound
- `createDroneTorpedo()` - Creates drone torpedo (no lock required)

---

## 6. Files Modified

- `js/submarine.js`:
  - Added DN torpedo type to `TORPEDO_SPECIFICATIONS`
  - Updated `initializeDefaultLoadouts()` for DN in slot 6
  - Modified `launchTorpedo()` and `fireSequentialTorpedo()` for DN support
  - Added `createDroneTorpedo()` method
  - Enhanced `AudioManager` class with sound file loading
  - Added all sound trigger methods
  - Added torpedo ping sound system
  - Added proximity sound system
  - Integrated all sounds into game loop

---

## 7. Testing Checklist

- [ ] DN torpedo launches without lock-on
- [ ] DN torpedo travels straight in launch direction
- [ ] DN torpedo activates bubble after 1km
- [ ] DN torpedo reveals terrain/enemies in 2km bubble
- [ ] DN torpedo stops at map edge or terrain collision
- [ ] Active sonar constant pinging plays in Active mode
- [ ] Single active ping plays on R key press
- [ ] Torpedo launch sound plays on launch
- [ ] Ambience switches from underwater to deep at 3000m
- [ ] Knuckle sound plays for 2 seconds when knuckle formed
- [ ] Torpedo ping rate increases as torpedo approaches target
- [ ] Torpedo ping slows down if torpedo misses
- [ ] Proximity sound plays when enemy within 1000m
- [ ] Proximity sound volume increases with closeness

---

## 8. Notes

- Sound files must be placed in `SOUNDS/` directory
- System supports both `.wav` and `.mp3` formats
- Drone bubble rendering integrates with terrain visibility system
- Torpedo ping sounds require torpedo position and target distance updates
- Proximity sound requires enemy submarine position updates
- Collision/impact sounds need to be called from collision handlers (not yet integrated)

