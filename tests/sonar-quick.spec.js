/**
 * Quick Sonar System Tests
 * Focused tests to verify key sonar bugs identified by Perception Agent
 */

const { test, expect } = require('@playwright/test');

test.describe('Quick Sonar Bug Verification', () => {
    test.setTimeout(60000); // 60 second timeout

    test('verify sonar system state and modes', async ({ page }) => {
        console.log('\n🔍 Starting sonar system verification...\n');

        // Load game
        await page.goto('http://localhost:8000/index.html');

        // Wait for game initialization with longer timeout
        try {
            await page.waitForFunction(() => {
                return window.playerSubmarine !== undefined &&
                       window.gameState !== undefined &&
                       window.gameState.scene !== undefined;
            }, { timeout: 30000 });
        } catch (e) {
            console.log('⚠️ Game failed to initialize within 30 seconds');
            throw e;
        }

        console.log('✓ Game initialized');

        // Select a scenario (F1 for Patrol Mission)
        await page.keyboard.press('F1');

        // Wait for submarine to be created
        await page.waitForFunction(() => {
            const sub = window.playerSubmarine && window.playerSubmarine();
            return sub && sub.sonarMode !== undefined;
        }, { timeout: 10000 });

        console.log('✓ Submarine created\n');

        // === TEST 1: Check default sonar mode ===
        const initialMode = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            return sub ? sub.sonarMode : null;
        });

        console.log(`TEST 1: Initial sonar mode = "${initialMode}"`);
        expect(initialMode).toBe('Passive');
        console.log('  ✓ Defaults to Passive mode\n');

        // === TEST 2: Check mode cycling ===
        await page.keyboard.press('M');
        await page.waitForTimeout(300);

        const afterFirstCycle = await page.evaluate(() => window.playerSubmarine()?.sonarMode);
        console.log(`TEST 2: After pressing S = "${afterFirstCycle}"`);
        expect(afterFirstCycle).toBe('Silent');
        console.log('  ✓ Mode cycling works\n');

        // === TEST 3: Check if Silent mode blocks pinging (EXPECTED FAIL) ===
        console.log('TEST 3: Testing Silent mode ping restriction...');

        const beforePing = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            return sub?.firingReticle?.lastSonarPing || 0;
        });

        await page.keyboard.press('r');
        await page.waitForTimeout(500);

        const afterPing = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            return sub?.firingReticle?.lastSonarPing || 0;
        });

        if (afterPing > beforePing) {
            console.log('  ⚠️  BUG CONFIRMED: Silent mode allows pinging (should be blocked)');
            console.log(`     Before: ${beforePing}, After: ${afterPing}\n`);
        } else {
            console.log('  ✓ Silent mode correctly blocks pinging\n');
        }

        // === TEST 4: Check performAdvancedSonarSweep parameters ===
        console.log('TEST 4: Checking sonar sweep function signature...');

        const sweepInfo = await page.evaluate(() => {
            if (!window.performAdvancedSonarSweep) return { exists: false };

            const funcString = window.performAdvancedSonarSweep.toString();
            const params = funcString.match(/\(([^)]*)\)/);

            return {
                exists: true,
                parameters: params ? params[1] : null,
                hasSonarModeParam: funcString.includes('sonarMode')
            };
        });

        console.log(`  Function exists: ${sweepInfo.exists}`);
        console.log(`  Parameters: ${sweepInfo.parameters}`);
        console.log(`  Has sonarMode parameter: ${sweepInfo.hasSonarModeParam}`);

        if (!sweepInfo.hasSonarModeParam) {
            console.log('  ⚠️  BUG CONFIRMED: performAdvancedSonarSweep() does not accept sonarMode parameter\n');
        } else {
            console.log('  ✓ Function accepts sonarMode parameter\n');
        }

        // === TEST 5: Check passive sensitivity calculation ===
        console.log('TEST 5: Checking passive sensitivity system...');

        const sensitivityTest = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (!sub) return null;

            // Get sensitivity at different speeds
            const originalSpeed = sub.speed;

            sub.speed = 0;
            sub.updatePassiveSensitivity();
            const stationarySensitivity = sub.passiveSensitivity;

            sub.speed = sub.maxSpeed * 0.8;
            sub.updatePassiveSensitivity();
            const movingSensitivity = sub.passiveSensitivity;

            sub.speed = originalSpeed;

            return {
                stationary: stationarySensitivity,
                moving: movingSensitivity,
                decreasesWithSpeed: movingSensitivity < stationarySensitivity
            };
        });

        console.log(`  Stationary sensitivity: ${sensitivityTest.stationary.toFixed(2)}`);
        console.log(`  Moving sensitivity: ${sensitivityTest.moving.toFixed(2)}`);
        console.log(`  ✓ Sensitivity ${sensitivityTest.decreasesWithSpeed ? 'correctly decreases' : 'ERROR: does not decrease'} with speed\n`);

        // === TEST 6: Check if there's continuous detection (EXPECTED: NO) ===
        console.log('TEST 6: Checking for continuous passive detection...');

        // Switch to Passive mode
        await page.evaluate(() => {
            const sub = window.playerSubmarine();
            sub.sonarMode = 'Passive';
        });

        // Check if there's an automatic detection loop
        const hasAutomaticDetection = await page.evaluate(() => {
            // Check if updateWarfareSystems or update() calls performSonarPing automatically
            const sub = window.playerSubmarine();
            if (!sub) return { error: 'No submarine' };

            const updateFunc = sub.updateWarfareSystems ? sub.updateWarfareSystems.toString() : '';
            const hasAutoSweep = updateFunc.includes('performAdvancedSonarSweep') &&
                                !updateFunc.includes('//') && // Not commented out
                                updateFunc.includes('Passive');

            return {
                hasUpdateWarfareSystems: !!sub.updateWarfareSystems,
                callsAutoSweep: hasAutoSweep,
                updateFunctionLength: updateFunc.length
            };
        });

        console.log(`  Has updateWarfareSystems: ${hasAutomaticDetection.hasUpdateWarfareSystems}`);
        console.log(`  Calls automatic sweep in Passive: ${hasAutomaticDetection.callsAutoSweep}`);

        if (!hasAutomaticDetection.callsAutoSweep) {
            console.log('  ⚠️  BUG CONFIRMED: No continuous passive detection implemented\n');
        } else {
            console.log('  ✓ Continuous passive detection implemented\n');
        }

        // === SUMMARY ===
        console.log('\n========================================');
        console.log('SONAR SYSTEM VERIFICATION COMPLETE');
        console.log('========================================\n');
    });

    test('check sonar ranges per mode', async ({ page }) => {
        console.log('\n🔍 Testing sonar range configuration...\n');

        await page.goto('http://localhost:8000/index.html');

        await page.waitForFunction(() => window.playerSubmarine !== undefined, { timeout: 30000 });
        await page.keyboard.press('F1'); // Select Patrol Mission
        await page.waitForFunction(() => {
            const sub = window.playerSubmarine && window.playerSubmarine();
            return sub && sub.sonarMode !== undefined;
        }, { timeout: 10000 });

        const rangeTest = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (!sub) return null;

            // Check what range is used in performSonarPing
            const pingFunc = sub.performSonarPing ? sub.performSonarPing.toString() : '';

            // Check if powerSettings array is different per mode
            const usesDifferentRanges = pingFunc.includes('sonarMode') &&
                                       (pingFunc.includes('Active') || pingFunc.includes('Passive'));

            return {
                performSonarPingExists: !!sub.performSonarPing,
                checksModeForRange: usesDifferentRanges,
                currentPowerSettings: sub.sonarSettings ? sub.sonarSettings.power : null
            };
        });

        console.log(`  performSonarPing exists: ${rangeTest.performSonarPingExists}`);
        console.log(`  Checks sonarMode for range: ${rangeTest.checksModeForRange}`);

        if (!rangeTest.checksModeForRange) {
            console.log('  ⚠️  BUG CONFIRMED: Range not adjusted based on sonar mode\n');
        } else {
            console.log('  ✓ Range adjusted per sonar mode\n');
        }
    });
});
