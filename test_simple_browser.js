const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Opening game...');

    // Listen to ALL console events from the page
    page.on('console', msg => {
        console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    await page.goto('http://localhost:8000');
    console.log('Game loaded, waiting 5 seconds for initialization...');
    await page.waitForTimeout(5000);

    // Check final state
    const finalCheck = await page.evaluate(() => {
        return {
            maneuverIconInDOM: !!document.getElementById('maneuverIcon'),
            centerIconInDOM: !!document.getElementById('centerIcon'),
            submarineInitialized: typeof window.playerSubmarine === 'function' && window.playerSubmarine() !== null
        };
    });

    console.log('Final Check:', finalCheck);

    // Keep browser open for manual inspection
    console.log('Browser will stay open for 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);

    await browser.close();
})();
