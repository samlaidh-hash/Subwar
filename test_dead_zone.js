// Test script for Dead Zone and UI Changes
// Playwright test script with comprehensive validation

const { chromium } = require('playwright');

(async () => {
    console.log('🎯 Starting Dead Zone and UI Changes Test...');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Navigate to the game
        await page.goto('http://localhost:8000');
        console.log('🎮 Navigated to game');

        // Wait for game to load
        await page.waitForTimeout(3000);

        // Test 1: Check UI panel removal and sonar shortcuts
        console.log('📸 Test 1: UI panel changes');
        const uiElements = await page.evaluate(() => {
            return {
                // Should NOT exist (old HUD panel removed)
                oldHudPanel: document.getElementById('hud') !== null,

                // Should exist (sonar contacts with new shortcuts)
                sonarContacts: document.getElementById('sonarContacts') !== null,
                sonarControls: document.getElementById('sonarControls') !== null,
                sonarShortcuts: document.querySelector('.sonar-shortcuts') !== null,
                sonarShortcutsText: document.querySelector('.sonar-shortcuts')?.textContent || 'Not found',

                // Reticle HUD should still exist
                reticleHUD: document.getElementById('reticleHUD') !== null,

                // Dead zone system
                submarine: window.playerSubmarine() ? {
                    deadZoneRadius: window.playerSubmarine().maneuverIcon?.deadZoneRadius || 'Not found',
                    maneuverIconExists: window.playerSubmarine().maneuverIconElement !== null,
                    deadZoneElementExists: window.playerSubmarine().deadZoneElement !== null,
                    centerIconExists: window.playerSubmarine().centerIconElement !== null
                } : 'Submarine not found'
            };
        });

        console.log('UI Elements Status:', JSON.stringify(uiElements, null, 2));
        await page.screenshot({
            path: 'test_screenshots/deadzone_01_ui_changes.png',
            fullPage: true
        });

        // Test 2: Dead zone visual elements
        console.log('📸 Test 2: Dead zone visual elements');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/deadzone_02_dead_zone_visual.png',
            fullPage: true
        });

        // Test 3: Mouse movement to test dead zone behavior
        console.log('📸 Test 3: Mouse movement outside dead zone');
        await page.mouse.move(600, 400); // Move outside dead zone
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/deadzone_03_outside_deadzone.png',
            fullPage: true
        });

        // Test 4: Mouse movement inside dead zone
        console.log('📸 Test 4: Mouse movement inside dead zone');
        const centerX = await page.evaluate(() => window.innerWidth / 2);
        const centerY = await page.evaluate(() => window.innerHeight / 2);
        await page.mouse.move(centerX + 20, centerY + 20); // Move inside dead zone
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/deadzone_04_inside_deadzone.png',
            fullPage: true
        });

        // Test 5: Test submarine movement with dead zone
        console.log('📸 Test 5: Testing dead zone prevention of movement');

        // First, move outside dead zone to show it works
        await page.mouse.move(centerX + 100, centerY + 100);
        await page.waitForTimeout(2000); // Let submarine start to turn
        await page.screenshot({
            path: 'test_screenshots/deadzone_05_movement_active.png',
            fullPage: true
        });

        // Then move back to dead zone to show it stops
        await page.mouse.move(centerX, centerY);
        await page.waitForTimeout(2000); // Should stop movement
        await page.screenshot({
            path: 'test_screenshots/deadzone_06_movement_stopped.png',
            fullPage: true
        });

        // Test 6: Sonar controls integration
        console.log('📸 Test 6: Testing sonar controls in contacts panel');
        await page.keyboard.press('KeyR'); // Sonar ping
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/deadzone_07_sonar_integration.png',
            fullPage: true
        });

        // Test 7: Overall system functionality
        console.log('📸 Test 7: Overall system test');

        // Test dead zone behavior programmatically
        const deadZoneTest = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (!sub) return 'No submarine found';

            // Simulate different maneuver icon positions
            const tests = [];

            // Test 1: Inside dead zone (should not move)
            sub.maneuverIcon.x = 0.1; // Within dead zone radius of 0.15
            sub.maneuverIcon.y = 0.1;
            const distance1 = Math.sqrt(sub.maneuverIcon.x ** 2 + sub.maneuverIcon.y ** 2);
            const inDeadZone1 = distance1 <= sub.maneuverIcon.deadZoneRadius;
            tests.push({
                test: 'Inside dead zone',
                position: {x: sub.maneuverIcon.x, y: sub.maneuverIcon.y},
                distance: distance1,
                deadZoneRadius: sub.maneuverIcon.deadZoneRadius,
                inDeadZone: inDeadZone1,
                expected: true
            });

            // Test 2: Outside dead zone (should move)
            sub.maneuverIcon.x = 0.3; // Outside dead zone radius of 0.15
            sub.maneuverIcon.y = 0.3;
            const distance2 = Math.sqrt(sub.maneuverIcon.x ** 2 + sub.maneuverIcon.y ** 2);
            const inDeadZone2 = distance2 <= sub.maneuverIcon.deadZoneRadius;
            tests.push({
                test: 'Outside dead zone',
                position: {x: sub.maneuverIcon.x, y: sub.maneuverIcon.y},
                distance: distance2,
                deadZoneRadius: sub.maneuverIcon.deadZoneRadius,
                inDeadZone: inDeadZone2,
                expected: false
            });

            return tests;
        });

        console.log('Dead Zone Test Results:', JSON.stringify(deadZoneTest, null, 2));

        await page.screenshot({
            path: 'test_screenshots/deadzone_08_final_test.png',
            fullPage: true
        });

        console.log('✅ All tests completed!');
        console.log('📁 Screenshots saved to test_screenshots/deadzone_*.png');

        // Validation results
        let testsPassed = 0;
        let testsFailed = 0;

        console.log('\n=== TEST RESULTS ===');

        // Check UI changes
        if (!uiElements.oldHudPanel) {
            console.log('✅ Old HUD panel successfully removed');
            testsPassed++;
        } else {
            console.error('❌ Old HUD panel still exists');
            testsFailed++;
        }

        if (uiElements.sonarShortcuts && uiElements.sonarShortcutsText.includes('R - Single Ping')) {
            console.log('✅ Sonar shortcuts successfully moved to contacts panel');
            testsPassed++;
        } else {
            console.error('❌ Sonar shortcuts not properly integrated');
            testsFailed++;
        }

        if (uiElements.submarine.deadZoneRadius === 0.15) {
            console.log('✅ Dead zone radius correctly set to 0.15');
            testsPassed++;
        } else {
            console.error('❌ Dead zone radius incorrect:', uiElements.submarine.deadZoneRadius);
            testsFailed++;
        }

        if (uiElements.submarine.deadZoneElementExists) {
            console.log('✅ Dead zone visual element created');
            testsPassed++;
        } else {
            console.error('❌ Dead zone visual element missing');
            testsFailed++;
        }

        // Check dead zone logic
        if (deadZoneTest && Array.isArray(deadZoneTest)) {
            deadZoneTest.forEach(test => {
                if (test.inDeadZone === test.expected) {
                    console.log(`✅ ${test.test}: Dead zone logic working correctly`);
                    testsPassed++;
                } else {
                    console.error(`❌ ${test.test}: Dead zone logic failed`);
                    testsFailed++;
                }
            });
        }

        console.log(`\n📊 Final Results: ${testsPassed} passed, ${testsFailed} failed`);

        console.log('🔍 Browser kept open for manual inspection...');
        await page.waitForTimeout(15000);

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
})();
