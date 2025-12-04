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

    console.log('🔍 Testing M key with debouncing...');

    // Test 1: Check initial state
    const initialState = await page.evaluate(() => {
        const fullscreenMap = document.getElementById('fullscreenMap');
        return {
            classes: fullscreenMap ? fullscreenMap.className : null,
            computedStyle: fullscreenMap ? window.getComputedStyle(fullscreenMap).display : null
        };
    });
    console.log('Initial state:', initialState);

    // Test 2: Single M key press
    console.log('🔍 Pressing M key once...');
    await page.keyboard.press('KeyM');

    await page.waitForTimeout(1000);

    const afterFirstPress = await page.evaluate(() => {
        const fullscreenMap = document.getElementById('fullscreenMap');
        return {
            classes: fullscreenMap ? fullscreenMap.className : null,
            computedStyle: fullscreenMap ? window.getComputedStyle(fullscreenMap).display : null
        };
    });
    console.log('After first M press:', afterFirstPress);

    // Test 3: Take screenshot
    console.log('📸 Taking screenshot of fullscreen map...');
    await page.screenshot({ path: 'test_fullscreen_working.png' });

    // Test 4: Press M again to close
    console.log('🔍 Pressing M key again to close...');
    await page.keyboard.press('KeyM');

    await page.waitForTimeout(1000);

    const afterSecondPress = await page.evaluate(() => {
        const fullscreenMap = document.getElementById('fullscreenMap');
        return {
            classes: fullscreenMap ? fullscreenMap.className : null,
            computedStyle: fullscreenMap ? window.getComputedStyle(fullscreenMap).display : null
        };
    });
    console.log('After second M press:', afterSecondPress);

    console.log('✅ M key debouncing test complete!');

    await browser.close();
})();
