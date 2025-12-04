// Visual Test for Combined Reticle System
// Playwright test script with screenshot validation

const { chromium } = require('playwright');

(async () => {
    console.log('📸 Starting Combined Reticle Visual Test...');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Navigate to the game
        await page.goto('http://localhost:8000');
        console.log('🎮 Navigated to game');

        // Wait for game to load
        await page.waitForTimeout(3000);

        // Test 1: Initial view with combined reticle (no center piece)
        console.log('📸 Test 1: Combined reticle - no center piece');
        await page.screenshot({
            path: 'test_screenshots/reticle_01_combined_no_center.png',
            fullPage: true
        });

        // Test 2: Validate elements presence/absence
        const reticleInfo = await page.evaluate(() => {
            return {
                // Should exist
                reticleHUD: document.getElementById('reticleHUD') !== null,
                torpedoData: document.getElementById('reticleTorpedoData') !== null,
                noiseIndicator: document.getElementById('reticleNoiseIndicator') !== null,
                speedBar: document.getElementById('reticleSpeedBar') !== null,
                depthBar: document.getElementById('reticleDepthBar') !== null,

                // Should NOT exist
                reticleCrosshair: document.getElementById('reticleCrosshair') !== null,
                centerDot: document.querySelector('.reticle-center-dot') !== null,
                arcCount: document.querySelectorAll('.reticle-arc').length,

                // Firing reticle distance
                submarine: window.playerSubmarine() ? {
                    firingReticleDistance: window.playerSubmarine().firingReticle?.distance || 'Not found',
                    has3DReticle: window.playerSubmarine().firingReticleMesh !== null
                } : 'Not found'
            };
        });

        console.log('Reticle System Info:', JSON.stringify(reticleInfo, null, 2));

        // Test 3: Move submarine to show reticle distance
        console.log('📸 Test 2: Testing reticle distance while moving');
        await page.keyboard.down('ArrowUp'); // Throttle up
        await page.waitForTimeout(2000);
        await page.keyboard.up('ArrowUp');
        await page.screenshot({
            path: 'test_screenshots/reticle_02_distance_test.png',
            fullPage: true
        });

        // Test 4: Different angles to show 3D reticle positioning
        console.log('📸 Test 3: Testing reticle at different angles');
        await page.keyboard.press('KeyA'); // Turn left
        await page.waitForTimeout(1500);
        await page.screenshot({
            path: 'test_screenshots/reticle_03_angle_left.png',
            fullPage: true
        });

        await page.keyboard.press('KeyD'); // Turn right
        await page.keyboard.press('KeyD'); // More right
        await page.waitForTimeout(1500);
        await page.screenshot({
            path: 'test_screenshots/reticle_04_angle_right.png',
            fullPage: true
        });

        // Test 5: Dive to show reticle depth tracking
        console.log('📸 Test 4: Testing depth changes with reticle');
        await page.keyboard.press('KeyW'); // Dive
        await page.waitForTimeout(2000);
        await page.screenshot({
            path: 'test_screenshots/reticle_05_depth_change.png',
            fullPage: true
        });

        // Test 6: HUD elements visibility test
        console.log('📸 Test 5: HUD elements detail view');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'test_screenshots/reticle_06_hud_detail.png',
            fullPage: true
        });

        console.log('✅ All visual tests completed!');
        console.log('📁 Screenshots saved to test_screenshots/reticle_*.png');

        // Display results
        if (reticleInfo.reticleCrosshair || reticleInfo.centerDot || reticleInfo.arcCount > 0) {
            console.error('❌ Center piece elements still present');
        } else {
            console.log('✅ Center piece successfully removed');
        }

        if (reticleInfo.submarine.firingReticleDistance === 20) {
            console.log('✅ Reticle distance correctly set to 20 units');
        } else {
            console.log('⚠️  Reticle distance:', reticleInfo.submarine.firingReticleDistance);
        }

        console.log('🔍 Browser kept open for manual inspection...');
        await page.waitForTimeout(10000);

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
})();
