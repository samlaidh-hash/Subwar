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

    console.log('🔍 Checking submarine mesh status...');

    const submarineStatus = await page.evaluate(() => {
        const submarine = window.playerSubmarine && window.playerSubmarine();
        if (!submarine) return { exists: false };

        return {
            exists: true,
            hasMesh: !!submarine.mesh,
            meshPosition: submarine.mesh ? {
                x: submarine.mesh.position.x,
                y: submarine.mesh.position.y,
                z: submarine.mesh.position.z
            } : null,
            meshVisible: submarine.mesh ? submarine.mesh.visible : null,
            meshInScene: submarine.mesh ? submarine.scene.children.includes(submarine.mesh) : null,
            sceneChildrenCount: submarine.scene ? submarine.scene.children.length : 0
        };
    });

    console.log('Submarine Status:', submarineStatus);

    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'submarine_visibility_debug.png' });

    await page.waitForTimeout(2000);

    await browser.close();
})();
