const { chromium } = require('playwright');

(async () => {
    console.log('🐛 Capturing submarine "going insane" on first mouse move...');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000 // Slow down for visibility
    });
    const page = await browser.newPage();

    // Set viewport size
    await page.setViewportSize({ width: 1200, height: 800 });

    // Enable console logging
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ Browser Error:', msg.text());
        } else if (msg.text().includes('Maneuver:') || msg.text().includes('rotation') || msg.text().includes('submarine')) {
            console.log('📊 Game:', msg.text());
        }
    });

    try {
        console.log('🌐 Loading game...');
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

        console.log('⏳ Waiting for game to initialize...');
        await page.waitForTimeout(4000); // Let game fully load

        console.log('📸 Taking BEFORE screenshot...');
        await page.screenshot({
            path: 'submarine_before_move.png',
            fullPage: false
        });

        // Get viewport center
        const viewport = page.viewportSize();
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;

        console.log(`🎯 Center: ${centerX}, ${centerY}`);

        // Move mouse to center first (ensure starting position)
        await page.mouse.move(centerX, centerY);
        await page.waitForTimeout(500);

        console.log('📍 Getting initial submarine state...');
        const initialState = await page.evaluate(() => {
            if (window.playerSubmarine && window.playerSubmarine().mesh) {
                const mesh = window.playerSubmarine().mesh;
                return {
                    position: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
                    rotation: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
                    maneuverIcon: window.playerSubmarine().maneuverIcon ? {
                        x: window.playerSubmarine().maneuverIcon.x,
                        y: window.playerSubmarine().maneuverIcon.y
                    } : null
                };
            }
            return null;
        });

        if (initialState) {
            console.log('🔵 Initial State:');
            console.log(`   Position: (${initialState.position.x.toFixed(2)}, ${initialState.position.y.toFixed(2)}, ${initialState.position.z.toFixed(2)})`);
            console.log(`   Rotation: (${(initialState.rotation.x * 180/Math.PI).toFixed(1)}°, ${(initialState.rotation.y * 180/Math.PI).toFixed(1)}°, ${(initialState.rotation.z * 180/Math.PI).toFixed(1)}°)`);
            if (initialState.maneuverIcon) {
                console.log(`   Maneuver Icon: (${initialState.maneuverIcon.x.toFixed(3)}, ${initialState.maneuverIcon.y.toFixed(3)})`);
            }
        }

        console.log('🖱️  PERFORMING FIRST MOUSE MOVE - Moving left...');
        // Make first mouse movement - small left movement
        await page.mouse.move(centerX - 80, centerY, { steps: 5 });

        console.log('⏳ Waiting 100ms after first move...');
        await page.waitForTimeout(100); // Brief moment after first move

        console.log('📸 Taking IMMEDIATE screenshot after first move...');
        await page.screenshot({
            path: 'submarine_during_insanity.png',
            fullPage: false
        });

        console.log('📍 Getting submarine state after first move...');
        const afterMoveState = await page.evaluate(() => {
            if (window.playerSubmarine && window.playerSubmarine().mesh) {
                const mesh = window.playerSubmarine().mesh;
                return {
                    position: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
                    rotation: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
                    maneuverIcon: window.playerSubmarine().maneuverIcon ? {
                        x: window.playerSubmarine().maneuverIcon.x,
                        y: window.playerSubmarine().maneuverIcon.y
                    } : null
                };
            }
            return null;
        });

        if (afterMoveState && initialState) {
            console.log('🔴 After First Move:');
            console.log(`   Position: (${afterMoveState.position.x.toFixed(2)}, ${afterMoveState.position.y.toFixed(2)}, ${afterMoveState.position.z.toFixed(2)})`);
            console.log(`   Rotation: (${(afterMoveState.rotation.x * 180/Math.PI).toFixed(1)}°, ${(afterMoveState.rotation.y * 180/Math.PI).toFixed(1)}°, ${(afterMoveState.rotation.z * 180/Math.PI).toFixed(1)}°)`);
            if (afterMoveState.maneuverIcon) {
                console.log(`   Maneuver Icon: (${afterMoveState.maneuverIcon.x.toFixed(3)}, ${afterMoveState.maneuverIcon.y.toFixed(3)})`);
            }

            // Calculate changes
            const posChange = Math.sqrt(
                Math.pow(afterMoveState.position.x - initialState.position.x, 2) +
                Math.pow(afterMoveState.position.y - initialState.position.y, 2) +
                Math.pow(afterMoveState.position.z - initialState.position.z, 2)
            );
            const rotChange = Math.sqrt(
                Math.pow(afterMoveState.rotation.x - initialState.rotation.x, 2) +
                Math.pow(afterMoveState.rotation.y - initialState.rotation.y, 2) +
                Math.pow(afterMoveState.rotation.z - initialState.rotation.z, 2)
            );

            console.log('📊 CHANGES:');
            console.log(`   Position Change: ${posChange.toFixed(3)} units`);
            console.log(`   Rotation Change: ${(rotChange * 180/Math.PI).toFixed(1)}° total`);

            if (rotChange > 1.0) { // > ~57 degrees total rotation change
                console.log('🚨 SUBMARINE WENT INSANE! Large rotation detected!');
            }
        }

        console.log('⏳ Waiting longer to see if it settles...');
        await page.waitForTimeout(2000);

        console.log('📸 Taking AFTER settlement screenshot...');
        await page.screenshot({
            path: 'submarine_after_settle.png',
            fullPage: false
        });

        console.log('📍 Getting final settled state...');
        const settledState = await page.evaluate(() => {
            if (window.playerSubmarine && window.playerSubmarine().mesh) {
                const mesh = window.playerSubmarine().mesh;
                return {
                    position: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
                    rotation: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z }
                };
            }
            return null;
        });

        if (settledState) {
            console.log('🟢 Final Settled State:');
            console.log(`   Position: (${settledState.position.x.toFixed(2)}, ${settledState.position.y.toFixed(2)}, ${settledState.position.z.toFixed(2)})`);
            console.log(`   Rotation: (${(settledState.rotation.x * 180/Math.PI).toFixed(1)}°, ${(settledState.rotation.y * 180/Math.PI).toFixed(1)}°, ${(settledState.rotation.z * 180/Math.PI).toFixed(1)}°)`);
        }

        console.log('✅ Screenshots captured:');
        console.log('   - submarine_before_move.png');
        console.log('   - submarine_during_insanity.png');
        console.log('   - submarine_after_settle.png');

        // Keep browser open for manual inspection
        console.log('🔍 Keeping browser open for 10 seconds...');
        await page.waitForTimeout(10000);

    } catch (error) {
        console.log('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
