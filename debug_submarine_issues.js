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

    console.log('🔍 Checking submarine duplication and movement...');

    const submarineInfo = await page.evaluate(() => {
        const submarine = window.playerSubmarine && window.playerSubmarine();
        if (!submarine) return { exists: false };

        // Count submarine meshes in scene
        const scene = submarine.scene;
        let submarineMeshCount = 0;
        scene.traverse((child) => {
            if (child.name && child.name.includes('submarine')) {
                submarineMeshCount++;
            }
        });

        return {
            exists: true,
            submarineMeshCount: submarineMeshCount,
            sceneChildrenTotal: scene.children.length,
            currentSpeed: submarine.speed,
            currentThrust: submarine.currentThrust,
            targetSpeed: submarine.targetSpeed,
            maxSpeed: submarine.maxSpeed,
            position: submarine.mesh ? {
                x: submarine.mesh.position.x,
                y: submarine.mesh.position.y,
                z: submarine.mesh.position.z
            } : null,
            fixedCenter: submarine.fixedCenter
        };
    });

    console.log('Submarine Analysis:', submarineInfo);

    // Test throttle
    console.log('🎮 Testing throttle controls...');
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(1000);

    const afterThrottle = await page.evaluate(() => {
        const submarine = window.playerSubmarine && window.playerSubmarine();
        return submarine ? {
            speed: submarine.speed,
            thrust: submarine.currentThrust,
            targetSpeed: submarine.targetSpeed
        } : null;
    });

    console.log('After throttle up:', afterThrottle);

    await page.waitForTimeout(2000);

    await browser.close();
})();
