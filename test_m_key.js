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
    console.log('Waiting for game to initialize...');
    await page.waitForTimeout(5000);

    console.log('Pressing M key...');
    await page.keyboard.press('KeyM');

    await page.waitForTimeout(2000);

    console.log('Pressing M key again...');
    await page.keyboard.press('KeyM');

    await page.waitForTimeout(2000);

    await browser.close();
})();
