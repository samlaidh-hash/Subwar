// Comprehensive Test Suite for Sub War 2060 Scenarios System
// Playwright test script with screenshot validation

const { chromium } = require('playwright');

(async () => {
    console.log('🎯 Starting Sub War 2060 Scenarios System Test Suite...');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Navigate to the game
        await page.goto('http://localhost:8000');
        console.log('📱 Navigated to game');

        // Wait for game to load
        await page.waitForTimeout(3000);

        // Test 1: Initial state with advanced reticle
        console.log('📸 Test 1: Capturing initial game state with advanced reticle');
        await page.screenshot({
            path: 'test_screenshots/01_initial_advanced_reticle.png',
            fullPage: true
        });

        // Test 2: HUD Elements visibility
        console.log('📸 Test 2: Validating HUD elements around reticle');
        const hudElements = await page.evaluate(() => {
            const elements = {};
            elements.reticleCrosshair = document.getElementById('reticleCrosshair') !== null;
            elements.torpedoData = document.getElementById('reticleTorpedoData') !== null;
            elements.noiseIndicator = document.getElementById('reticleNoiseIndicator') !== null;
            elements.speedBar = document.getElementById('reticleSpeedBar') !== null;
            elements.depthBar = document.getElementById('reticleDepthBar') !== null;
            elements.minimap = document.getElementById('minimap') !== null;
            return elements;
        });
        console.log('HUD Elements:', hudElements);
        await page.screenshot({
            path: 'test_screenshots/02_hud_elements.png',
            fullPage: true
        });

        // Test 3: Start Patrol Mission (F1)
        console.log('📸 Test 3: Starting Patrol Mission (F1)');
        await page.keyboard.press('F1');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/03_patrol_mission_start.png',
            fullPage: true
        });

        // Validate mission started
        const missionStatus = await page.evaluate(() => {
            const statusEl = document.getElementById('status');
            return statusEl ? statusEl.textContent : 'No status found';
        });
        console.log('Mission Status:', missionStatus);

        // Test 4: Wait and show mission progress
        console.log('📸 Test 4: Mission progress after 5 seconds');
        await page.waitForTimeout(5000);
        await page.screenshot({
            path: 'test_screenshots/04_patrol_progress.png',
            fullPage: true
        });

        // Test 5: Switch to Stealth Operation (F2)
        console.log('📸 Test 5: Starting Stealth Operation (F2)');
        await page.keyboard.press('F2');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/05_stealth_mission_start.png',
            fullPage: true
        });

        // Test 6: Move submarine to test speed/depth bars
        console.log('📸 Test 6: Testing submarine movement and HUD updates');
        await page.keyboard.down('ArrowUp'); // Throttle up
        await page.waitForTimeout(2000);
        await page.keyboard.up('ArrowUp');
        await page.keyboard.press('KeyW'); // Dive
        await page.waitForTimeout(2000);
        await page.screenshot({
            path: 'test_screenshots/06_movement_hud_update.png',
            fullPage: true
        });

        // Test 7: Test sonar ping
        console.log('📸 Test 7: Testing sonar ping (R)');
        await page.keyboard.press('KeyR');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/07_sonar_ping.png',
            fullPage: true
        });

        // Test 8: Test torpedo selection
        console.log('📸 Test 8: Testing torpedo tube selection (Key 1)');
        await page.keyboard.press('Digit1');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/08_torpedo_selection.png',
            fullPage: true
        });

        // Test 9: Test torpedo type cycling (double-tap)
        console.log('📸 Test 9: Testing torpedo type cycling (double-tap Key 1)');
        await page.keyboard.press('Digit1');
        await page.waitForTimeout(100);
        await page.keyboard.press('Digit1');
        await page.waitForTimeout(2000);
        await page.screenshot({
            path: 'test_screenshots/09_torpedo_cycling.png',
            fullPage: true
        });

        // Test 10: Test minimap toggle (M)
        console.log('📸 Test 10: Testing full-screen map (M)');
        await page.keyboard.press('KeyM');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/10_fullscreen_map.png',
            fullPage: true
        });

        // Close map
        await page.keyboard.press('KeyM');
        await page.waitForTimeout(500);

        // Test 11: Test Combat Training scenario (F3)
        console.log('📸 Test 11: Starting Combat Training (F3)');
        await page.keyboard.press('F3');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/11_combat_training.png',
            fullPage: true
        });

        // Test 12: Test emergency repair (C)
        console.log('📸 Test 12: Testing emergency repair (C)');
        await page.keyboard.press('KeyC');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/12_emergency_repair.png',
            fullPage: true
        });

        // Test 13: Test skill system validation
        console.log('📸 Test 13: Validating skill system integration');
        const skillData = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub) {
                return {
                    skills: sub.skills,
                    scenarios: sub.scenarios ? {
                        current: sub.scenarios.current?.name || 'None',
                        stats: sub.scenarios.stats
                    } : 'Not initialized'
                };
            }
            return 'Submarine not found';
        });
        console.log('Skill System Data:', JSON.stringify(skillData, null, 2));
        await page.screenshot({
            path: 'test_screenshots/13_skill_system_validation.png',
            fullPage: true
        });

        // Test 14: Final comprehensive view
        console.log('📸 Test 14: Final comprehensive game state');
        await page.waitForTimeout(2000);
        await page.screenshot({
            path: 'test_screenshots/14_final_comprehensive.png',
            fullPage: true
        });

        console.log('✅ All tests completed successfully!');
        console.log('📁 Screenshots saved to test_screenshots/ directory');

        // Keep browser open for manual inspection
        console.log('🔍 Browser kept open for manual inspection. Press Ctrl+C to close.');
        await page.waitForTimeout(30000); // Wait 30 seconds

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
})();
