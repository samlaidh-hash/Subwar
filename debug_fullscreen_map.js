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

    console.log('🔍 Checking initial fullscreen map state...');
    const initialState = await page.evaluate(() => {
        const fullscreenMap = document.getElementById('fullscreenMap');
        return {
            exists: !!fullscreenMap,
            classes: fullscreenMap ? fullscreenMap.className : null,
            style: fullscreenMap ? fullscreenMap.style.cssText : null,
            computedStyle: fullscreenMap ? window.getComputedStyle(fullscreenMap).display : null
        };
    });
    console.log('Initial state:', initialState);

    console.log('🔍 Pressing M key to open fullscreen map...');
    await page.keyboard.press('KeyM');

    await page.waitForTimeout(1000);

    console.log('🔍 Checking fullscreen map state after M key...');
    const afterMState = await page.evaluate(() => {
        const fullscreenMap = document.getElementById('fullscreenMap');
        const canvas = document.getElementById('fullscreenMapCanvas');
        return {
            exists: !!fullscreenMap,
            classes: fullscreenMap ? fullscreenMap.className : null,
            style: fullscreenMap ? fullscreenMap.style.cssText : null,
            computedStyle: fullscreenMap ? window.getComputedStyle(fullscreenMap).display : null,
            canvasExists: !!canvas,
            canvasWidth: canvas ? canvas.width : null,
            canvasHeight: canvas ? canvas.height : null,
            canvasStyle: canvas ? canvas.style.cssText : null
        };
    });
    console.log('After M state:', afterMState);

    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'debug_fullscreen_map.png' });

    await page.waitForTimeout(2000);

    await browser.close();
})();
