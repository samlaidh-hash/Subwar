const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Listen for console messages
    page.on('console', msg => {
        if (msg.text().includes('DEBUG')) {
            console.log('BROWSER:', msg.text());
        }
    });

    await page.goto('http://localhost:8000');

    // Wait for game to initialize
    await page.waitForTimeout(5000);

    console.log('Move mouse to trigger debug output...');

    // Simulate mouse movement to trigger debug logs
    await page.mouse.move(400, 300);
    await page.waitForTimeout(1000);
    await page.mouse.move(500, 400);
    await page.waitForTimeout(1000);
    await page.mouse.move(300, 200);
    await page.waitForTimeout(3000);

    await browser.close();
})();
