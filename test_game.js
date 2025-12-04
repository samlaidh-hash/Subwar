const { chromium } = require('C:/Users/JC/AppData/Roaming/npm/node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Listen for console messages and errors
    page.on('console', msg => {
        console.log(`CONSOLE: ${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', error => {
        console.log(`PAGE ERROR: ${error.message}`);
    });

    // Navigate to game
    console.log('Navigating to game...');
    await page.goto('http://localhost:8000');

    // Wait for scripts to load and execute
    await page.waitForTimeout(5000);

    // Check if THREE is available
    const threeExists = await page.evaluate(() => {
        return typeof THREE !== 'undefined';
    });
    console.log('THREE.js loaded:', threeExists);

    // Check if canvas element exists
    const canvas = await page.$('canvas');
    console.log('Canvas found:', canvas !== null);

    // Check canvas dimensions if it exists
    if (canvas) {
        const canvasInfo = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return {
                width: canvas.width,
                height: canvas.height,
                style: canvas.style.cssText,
                position: canvas.getBoundingClientRect()
            };
        });
        console.log('Canvas info:', canvasInfo);
    }

    // Check if game scene is initialized
    const gameState = await page.evaluate(() => {
        return {
            gameStateExists: typeof window.gameState !== 'undefined',
            sceneExists: window.gameState && window.gameState.scene !== null,
            cameraExists: window.gameState && window.gameState.camera !== null,
            rendererExists: window.gameState && window.gameState.renderer !== null,
            sceneChildrenCount: window.gameState && window.gameState.scene ? window.gameState.scene.children.length : 0
        };
    });
    console.log('Game state:', gameState);

    // Take a screenshot
    await page.screenshot({ path: 'debug_screenshot.png' });
    console.log('Screenshot saved as debug_screenshot.png');

    // Keep browser open for inspection
    console.log('Browser will stay open for 15 seconds...');
    await page.waitForTimeout(15000);

    await browser.close();
})();
