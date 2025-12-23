# Running Tests - Bypassing PowerShell Execution Policy

## Problem
PowerShell execution policy is blocking `npx` scripts. Here are several workarounds:

---

## Solution 1: Use Command Prompt (CMD) Instead ✅ RECOMMENDED

**Open CMD (not PowerShell):**
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to project: `cd "D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\SW\Subwar"`

**Then run:**
```cmd
npx playwright test tests/sonar-quick.spec.js
npx playwright test tests/sonar-system.spec.js
```

CMD doesn't have execution policy restrictions!

---

## Solution 2: Bypass Policy for Single Command

**In PowerShell, run:**
```powershell
powershell -ExecutionPolicy Bypass -Command "npx playwright test tests/sonar-quick.spec.js"
```

Or set bypass for current session:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npx playwright test tests/sonar-quick.spec.js
```

---

## Solution 3: Use Node Directly (No npx)

**Find Playwright location:**
```powershell
npm list -g playwright
```

**Then run directly:**
```powershell
node "C:\Users\YourName\AppData\Roaming\npm\node_modules\playwright\cli.js" test tests/sonar-quick.spec.js
```

---

## Solution 4: Create Batch File

**Create `run-tests.bat` in project root:**
```batch
@echo off
cd /d "%~dp0"
npx playwright test tests/sonar-quick.spec.js
npx playwright test tests/sonar-system.spec.js
pause
```

**Then double-click the .bat file** - it will use CMD automatically.

---

## Solution 5: Use VS Code Integrated Terminal

1. Open VS Code
2. Press `` Ctrl + ` `` to open terminal
3. **Change terminal to CMD:**
   - Click dropdown next to `+` button
   - Select "Command Prompt" instead of PowerShell
4. Run: `npx playwright test tests/sonar-quick.spec.js`

---

## Quick Test Commands (CMD)

**Start server (Terminal 1):**
```cmd
python -m http.server 8000
```

**Run tests (Terminal 2):**
```cmd
cd "D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\SW\Subwar"
npx playwright test tests/sonar-quick.spec.js --reporter=list
```

---

## Recommended Approach

**Use Solution 1 (CMD)** - It's the simplest and doesn't require changing system settings!

