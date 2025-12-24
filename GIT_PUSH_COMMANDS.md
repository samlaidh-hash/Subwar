# Manual Git Commands to Push to Main

## Step-by-Step Commands

### 1. Check Current Status
```bash
git status
```
Shows which files have been modified, added, or deleted.

### 2. Add All Changes
```bash
git add .
```
Stages all changes. Alternatively, add specific files:
```bash
git add js/submarine.js js/ocean.js js/enemies.js
```

### 3. Commit Changes
```bash
git commit -m "Your commit message here"
```
Example commit messages:
```bash
git commit -m "Fix crush depth warnings and torpedo system"
git commit -m "Update sonar visibility system and enemy AI"
git commit -m "Apply textures to terrain features"
```

### 4. Pull Latest Changes (if needed)
```bash
git pull origin main
```
**Important:** Pull first if others have pushed changes to avoid conflicts.

### 5. Push to Main
```bash
git push origin main
```

## Complete Sequence (Copy-Paste Ready)

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Update game systems: crush depth, sonar visibility, enemy AI, terrain textures"

# Pull latest (if needed)
git pull origin main

# Push to main
git push origin main
```

## If You Get Conflicts

If `git pull` shows conflicts:
```bash
# See conflicts
git status

# Resolve conflicts in files, then:
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

## If Push is Rejected

If push is rejected (remote has changes you don't have):
```bash
# Pull and merge
git pull origin main

# If merge conflicts occur, resolve them, then:
git add .
git commit -m "Merge remote changes"
git push origin main
```

## Alternative: Force Push (USE WITH CAUTION)

**⚠️ WARNING:** Only use if you're sure you want to overwrite remote changes:
```bash
git push origin main --force
```

## Check Remote Status

To see what's on remote vs local:
```bash
git fetch origin
git status
```

## View Commit History

To see recent commits:
```bash
git log --oneline -10
```



