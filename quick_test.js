const { chromium } = require('playwright');

(async () => {
    console.log('🚀 Quick submarine rotation test...');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewportSize({ width: 1200, height: 800 });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ Error:', msg.text());
        }
    });

    try {
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        const viewport = page.viewportSize();
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;

        // Move to center
        await page.mouse.move(centerX, centerY);
        await page.waitForTimeout(500);

        console.log('📍 Getting initial state...');
        const initial = await page.evaluate(() => {
            if (window.playerSubmarine && window.playerSubmarine().mesh) {
                const mesh = window.playerSubmarine().mesh;
                return { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z };
            }
            return null;
        });

        if (initial) {
            console.log(`🔵 Initial: ${(initial.x * 180/Math.PI).toFixed(1)}°, ${(initial.y * 180/Math.PI).toFixed(1)}°, ${(initial.z * 180/Math.PI).toFixed(1)}°`);
        }

        // First mouse move
        console.log('🖱️  Moving mouse left...');
        await page.mouse.move(centerX - 100, centerY);
        await page.waitForTimeout(200);

        const after = await page.evaluate(() => {
            if (window.playerSubmarine && window.playerSubmarine().mesh) {
                const mesh = window.playerSubmarine().mesh;
                return { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z };
            }
            return null;
        });

        if (after && initial) {
            console.log(`🔴 After: ${(after.x * 180/Math.PI).toFixed(1)}°, ${(after.y * 180/Math.PI).toFixed(1)}°, ${(after.z * 180/Math.PI).toFixed(1)}°`);

            const yawChange = Math.abs(after.y - initial.y) * 180/Math.PI;

            if (yawChange > 100) {
                console.log('🚨 STILL INSANE! Yaw change:', yawChange.toFixed(1) + '°');
            } else {
                console.log('✅ FIXED! Reasonable yaw change:', yawChange.toFixed(1) + '°');
            }
        }

    } catch (error) {
        console.log('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
})();
