# Sonar Visibility System Changes

## Changes Applied

### 1. Default Visibility: 500m ✅
**File:** `js/ocean.js:48`

**Changed:**
- `passiveRange` changed from 2000m to 500m
- Everything within 500m of player submarine is visible by default
- Everything beyond 500m is invisible

### 2. Active Sonar Ping Timing ✅
**File:** `js/ocean.js:53-54, 2894-2935`

**Changed:**
- `sonarPingDuration` changed from 10 seconds to 30 seconds
- Added `sonarPingFadeDuration` of 10 seconds
- Active sonar ping makes everything out to ping range visible for 30 seconds
- Fades out from 30-40 seconds (10 second fade period)

**New Functions:**
- `isSonarPingActive()` - Checks if ping is still active (handles timing)
- `getSonarPingAlpha()` - Returns fade alpha (1.0 for 0-30s, fades 30-40s, 0.0 after 40s)

### 3. Removed Silent Mode ✅
**File:** `js/submarine.js:1590, 6378-6397`

**Changed:**
- Removed 'Silent' from sonar mode cycle
- Only 'Active' and 'Passive' modes remain
- Updated mode descriptions:
  - Active: "(Press R for single ping)"
  - Passive: "(Continuous listening - 500m range)"

**Removed:**
- Silent mode check in `performSonarPing()`
- Silent mode references in UI and comments

### 4. Single Active Ping ✅
**File:** `js/submarine.js:6338-6376`

**Changed:**
- `performSonarPing()` now works as single ping (works in both Active and Passive modes)
- Always uses 2km range for active ping
- Removed mode-specific range settings
- Press R key for single active sonar ping

### 5. Terrain Visibility Updates ✅
**File:** `js/ocean.js:2819-2896, js/simple_terrain_fix.js:2295-2307`

**Changed:**
- `updateTerrainLOD()` now checks `isSonarPingActive()` for timing
- Terrain chunks visible within 500m by default
- Terrain chunks visible within 2km during active ping (with fade)
- Terrain shader updated to use 500m default range

### 6. UI Updates ✅
**File:** `index.html:156, 322`

**Changed:**
- Removed "Silent" from sonar mode descriptions
- Updated to show "Active/Passive" only

## Summary

**Default Behavior:**
- Everything within 500m of player submarine is visible
- Everything beyond 500m is invisible

**Active Sonar Ping (R key):**
- Makes everything out to 2km visible for 30 seconds
- Fades out from 30-40 seconds (10 second fade)
- Works in both Active and Passive sonar modes

**Sonar Modes:**
- **Passive**: Continuous listening, 500m range
- **Active**: Press R for single ping, 2km range for 30s (fades 30-40s)
- **Silent**: Removed

The system now provides clear visibility mechanics: default 500m visibility with optional active pings that extend range temporarily.


