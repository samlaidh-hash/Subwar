const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://localhost:8000');

    // Wait for game to initialize
    await page.waitForTimeout(3000);

    // Take screenshot of current minimap
    const minimapElement = await page.locator('#minimap');
    if (await minimapElement.count() > 0) {
        await minimapElement.screenshot({ path: 'current_minimap.png' });
        console.log('📸 Current minimap screenshot saved as current_minimap.png');
    }

    // Take full game screenshot
    await page.screenshot({ path: 'current_game.png' });
    console.log('📸 Full game screenshot saved as current_game.png');

    await browser.close();
})();
