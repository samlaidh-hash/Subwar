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
    await page.waitForTimeout(5000);

    console.log('🔍 Checking terrain draw distance...');

    const terrainInfo = await page.evaluate(() => {
        const ocean = window.oceanInstance;
        if (!ocean) return { exists: false };

        return {
            exists: true,
            maxViewDistance: ocean.maxViewDistance,
            drawDistance: ocean.drawDistance,
            terrainSize: ocean.terrainSize,
            chunkSize: ocean.chunkSize,
            activeChunks: ocean.activeChunks ? ocean.activeChunks.size : 0,
            totalChunks: ocean.terrainChunks ? ocean.terrainChunks.size : 0
        };
    });

    console.log('Terrain Configuration:', terrainInfo);

    console.log('📸 Taking screenshot to show increased terrain visibility...');
    await page.screenshot({ path: 'terrain_draw_distance_test.png' });

    console.log('✅ Terrain draw distance test complete!');

    await browser.close();
})();
