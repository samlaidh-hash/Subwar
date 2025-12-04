const { chromium } = require('playwright');

(async () => {
    console.log('🚀 Testing Sub War 2060 submarine controls...');

    const browser = await chromium.launch({ headless: false }); // Show browser for visual testing
    const page = await browser.newPage();

    // Enable console logging from the page
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ Browser Error:', msg.text());
        } else if (msg.text().includes('LOD:') || msg.text().includes('submarine') || msg.text().includes('rotation')) {
            console.log('📋 Game:', msg.text());
        }
    });

    try {
        console.log('🌐 Loading game at http://localhost:8000...');
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

        // Wait for game to initialize
        await page.waitForTimeout(3000);

        console.log('🔧 Testing submarine initial orientation...');

        // Check if submarine starts level (rotation should be close to 0,0,0)
        const initialRotation = await page.evaluate(() => {
            if (window.playerSubmarine && window.playerSubmarine().mesh) {
                const mesh = window.playerSubmarine().mesh;
                return {
                    x: mesh.rotation.x,
                    y: mesh.rotation.y,
                    z: mesh.rotation.z
                };
            }
            return null;
        });

        if (initialRotation) {
            console.log('✅ Initial submarine rotation:', initialRotation);
            console.log(`   Pitch (X): ${(initialRotation.x * 180/Math.PI).toFixed(1)}°`);
            console.log(`   Yaw   (Y): ${(initialRotation.y * 180/Math.PI).toFixed(1)}°`);
            console.log(`   Roll  (Z): ${(initialRotation.z * 180/Math.PI).toFixed(1)}°`);

            // Check if submarine is reasonably level (within 5 degrees)
            const isLevel = Math.abs(initialRotation.x) < 0.087 && // ~5 degrees
                           Math.abs(initialRotation.y) < 0.087 &&
                           Math.abs(initialRotation.z) < 0.087;

            if (isLevel) {
                console.log('✅ Submarine starts straight and level!');
            } else {
                console.log('❌ Submarine does NOT start level');
            }
        } else {
            console.log('❌ Could not get submarine rotation - mesh not found');
        }

        console.log('🎮 Testing maneuver controls...');

        // Get center of screen for mouse movements
        const viewport = page.viewportSize();
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;

        // Move mouse to center first
        await page.mouse.move(centerX, centerY);
        await page.waitForTimeout(500);

        // Test left maneuver (should cause roll)
        console.log('🔄 Testing LEFT maneuver...');
        await page.mouse.move(centerX - 100, centerY); // Move mouse left
        await page.waitForTimeout(1000);

        const leftRotation = await page.evaluate(() => {
            if (window.playerSubmarine && window.playerSubmarine().mesh) {
                const mesh = window.playerSubmarine().mesh;
                return {
                    x: mesh.rotation.x,
                    y: mesh.rotation.y,
                    z: mesh.rotation.z
                };
            }
            return null;
        });

        if (leftRotation) {
            console.log('📐 After LEFT maneuver:');
            console.log(`   Roll (Z): ${(leftRotation.z * 180/Math.PI).toFixed(1)}°`);

            // Check if submarine rolls right when maneuvering left (positive Z rotation)
            if (leftRotation.z > 0.05) { // ~3 degrees
                console.log('✅ Left maneuver causes RIGHT roll (correct banking)!');
            } else {
                console.log('❌ Left maneuver does NOT cause roll');
            }
        }

        // Return to center
        await page.mouse.move(centerX, centerY);
        await page.waitForTimeout(1000);

        // Test right maneuver
        console.log('🔄 Testing RIGHT maneuver...');
        await page.mouse.move(centerX + 100, centerY); // Move mouse right
        await page.waitForTimeout(1000);

        const rightRotation = await page.evaluate(() => {
            if (window.playerSubmarine && window.playerSubmarine().mesh) {
                const mesh = window.playerSubmarine().mesh;
                return {
                    x: mesh.rotation.x,
                    y: mesh.rotation.y,
                    z: mesh.rotation.z
                };
            }
            return null;
        });

        if (rightRotation) {
            console.log('📐 After RIGHT maneuver:');
            console.log(`   Roll (Z): ${(rightRotation.z * 180/Math.PI).toFixed(1)}°`);

            // Check if submarine rolls left when maneuvering right (negative Z rotation)
            if (rightRotation.z < -0.05) { // ~-3 degrees
                console.log('✅ Right maneuver causes LEFT roll (correct banking)!');
            } else {
                console.log('❌ Right maneuver does NOT cause roll');
            }
        }

        // Test auto-leveling
        console.log('🔄 Testing auto-leveling...');
        await page.mouse.move(centerX, centerY); // Return to center
        await page.waitForTimeout(2000); // Wait for auto-level

        const levelRotation = await page.evaluate(() => {
            if (window.playerSubmarine && window.playerSubmarine().mesh) {
                const mesh = window.playerSubmarine().mesh;
                return {
                    x: mesh.rotation.x,
                    y: mesh.rotation.y,
                    z: mesh.rotation.z
                };
            }
            return null;
        });

        if (levelRotation) {
            console.log('📐 After returning to center (auto-level):');
            console.log(`   Roll (Z): ${(levelRotation.z * 180/Math.PI).toFixed(1)}°`);

            if (Math.abs(levelRotation.z) < 0.1) { // ~6 degrees tolerance
                console.log('✅ Submarine auto-levels when not maneuvering!');
            } else {
                console.log('❌ Submarine does NOT auto-level properly');
            }
        }

        console.log('🎯 Control testing complete!');

        // Keep browser open for visual inspection
        console.log('🔍 Browser kept open for manual inspection...');
        await page.waitForTimeout(5000);

    } catch (error) {
        console.log('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
