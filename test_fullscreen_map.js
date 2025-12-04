const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://localhost:8000');

    // Wait for game to initialize
    await page.waitForTimeout(3000);

    console.log('📸 Taking screenshot of normal minimap...');
    await page.screenshot({ path: 'minimap_normal.png' });

    // Press M key to open fullscreen map
    console.log('🔍 Pressing M key to open fullscreen map...');
    await page.keyboard.press('KeyM');

    // Wait for fullscreen map to appear
    await page.waitForTimeout(1000);

    console.log('📸 Taking screenshot of fullscreen map...');
    await page.screenshot({ path: 'minimap_fullscreen.png' });

    // Press M again to close
    console.log('🔍 Pressing M key to close fullscreen map...');
    await page.keyboard.press('KeyM');

    await page.waitForTimeout(1000);

    console.log('✅ Fullscreen map test complete!');

    await browser.close();
})();
