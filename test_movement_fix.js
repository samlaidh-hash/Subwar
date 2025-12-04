const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Listen for console messages
    page.on('console', msg => {
        console.log('BROWSER:', msg.text());
    });

    await page.goto('http://localhost:8000');

    // Wait for game to initialize
    console.log('⏳ Waiting for game to initialize...');
    await page.waitForTimeout(3000);

    console.log('🚀 Testing submarine movement...');

    // Get initial position
    const initialPos = await page.evaluate(() => {
        const submarine = window.playerSubmarine && window.playerSubmarine();
        return submarine && submarine.mesh ? {
            x: submarine.mesh.position.x,
            y: submarine.mesh.position.y,
            z: submarine.mesh.position.z
        } : null;
    });
    console.log('Initial position:', initialPos);

    // Apply throttle and wait
    console.log('🎮 Applying throttle...');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');

    await page.waitForTimeout(2000);

    // Check position after movement
    const afterPos = await page.evaluate(() => {
        const submarine = window.playerSubmarine && window.playerSubmarine();
        return submarine && submarine.mesh ? {
            x: submarine.mesh.position.x,
            y: submarine.mesh.position.y,
            z: submarine.mesh.position.z,
            speed: submarine.speed,
            thrust: submarine.currentThrust
        } : null;
    });
    console.log('After throttle:', afterPos);

    // Calculate movement
    if (initialPos && afterPos) {
        const distance = Math.sqrt(
            (afterPos.x - initialPos.x) ** 2 +
      (afterPos.z - initialPos.z) ** 2
        );
        console.log('🎯 Movement distance:', distance.toFixed(2), 'units');

        if (distance > 0.1) {
            console.log('✅ MOVEMENT WORKING!');
        } else {
            console.log('❌ Still not moving');
        }
    }

    await page.waitForTimeout(2000);

    await browser.close();
})();
