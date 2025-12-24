# Terrain Visibility Fix

## Issue
Terrain visibility was unlimited - should be limited to 500m default, 6000m when sonar pings or active, with proper fading between pings.

## Changes Made

### 1. Updated Active Sonar Range ✅
**File:** `js/ocean.js`
- Changed `activeSonarRange` from `2000m` (2km) to `6000m` (6km)
- Line 49: `this.activeSonarRange = 6000;`

### 2. Updated Shader Default Range ✅
**File:** `js/simple_terrain_fix.js`
- Changed shader default `activeSonarRange` uniform from `2000.0` to `6000.0`
- Line 2321: `activeSonarRange: { value: 6000.0 }`

### 3. Added Sonar Fade Alpha Uniform ✅
**File:** `js/simple_terrain_fix.js`
- Added `sonarFadeAlpha` uniform to shader for proper fade control
- Line 2324: `sonarFadeAlpha: { value: 1.0 }`
- Updated fragment shader to accept `uniform float sonarFadeAlpha;`
- Updated visibility calculation to use fade alpha: `visibility = sonarFadeAlpha;`

### 4. Updated Shader Uniform Updates ✅
**File:** `js/simple_terrain_fix.js`
- Updated uniform update code to pass fade alpha from `oceanInstance.getSonarPingAlpha()`
- Lines 2373-2377: Now updates `sonarFadeAlpha` based on ping timing
- Fade alpha: 1.0 = fully visible (0-30s), fades to 0.0 (30-40s)

### 5. Enhanced Shader Visibility Logic ✅
**File:** `js/simple_terrain_fix.js`
- Shader now properly checks:
  - Default: 500m visibility (`passiveRange`)
  - Active sonar: 6000m visibility (`activeSonarRange`) with fade alpha
  - Beyond range: `visibility = 0.0` (invisible)

### 6. Added Alpha Test for Performance ✅
**File:** `js/simple_terrain_fix.js`
- Added `alphaTest: 0.01` to discard fully transparent fragments
- Changed `depthWrite: false` for transparent fragments to avoid depth issues
- Line 2329: `alphaTest: 0.01`
- Line 2330: `depthWrite: false`

## How It Works

1. **Default Visibility (500m):**
   - Terrain within 500m of submarine is always visible
   - Terrain beyond 500m is invisible (alpha = 0)

2. **Active Sonar Ping (6000m):**
   - When sonar pings, visibility extends to 6000m
   - Terrain within 6000m becomes visible with fade alpha
   - Fade alpha starts at 1.0 (fully visible)

3. **Fade Out (30-40 seconds):**
   - After 30 seconds, fade alpha decreases from 1.0 to 0.0
   - Takes 10 seconds to fade completely (30-40s total)
   - Terrain beyond 500m fades out and becomes invisible

4. **Next Ping:**
   - Each new ping resets the timer and extends visibility again
   - View updates with each ping, then fades before next ping

## Technical Details

### Shader Visibility Calculation
```glsl
float distanceToSubmarine = distance(vPosition.xz, submarinePosition.xz);
float visibility = 0.0;

// Default: 500m visibility
if (distanceToSubmarine <= passiveRange) {
    visibility = 1.0;
}
// Active sonar ping: 6000m range with timing-based fade
else if (isActiveSonarActive && distanceToSubmarine <= activeSonarRange) {
    visibility = sonarFadeAlpha; // Fades from 1.0 to 0.0
}

float finalAlpha = visibility;
```

### Uniform Updates
- `submarinePosition` - Updated every frame from player submarine
- `isActiveSonarActive` - Updated from `oceanInstance.isSonarPingActive()`
- `sonarFadeAlpha` - Updated from `oceanInstance.getSonarPingAlpha()`
- `passiveRange` - 500m (constant)
- `activeSonarRange` - 6000m (constant)

## Testing
- Verify terrain beyond 500m is invisible by default
- Verify terrain extends to 6000m when sonar pings
- Verify terrain fades out smoothly from 30-40 seconds
- Verify each new ping resets visibility and fade timer

