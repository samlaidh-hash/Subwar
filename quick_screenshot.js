const { chromium } = require('playwright');
const path = require('path');

async function quickGameScreenshot() {
    console.log('🎮 Quick game screenshot...');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    try {
        const gameUrl = `file://${path.resolve(__dirname, 'index.html')}`;
        await page.goto(gameUrl);

        console.log('⏳ Loading game...');
        await page.waitForTimeout(3000);

        // Click multiple times on rescue mission to select it
        console.log('🚁 Selecting rescue mission (multiple clicks)...');
        await page.click('[data-scenario="RESCUE_MISSION"]'); // Rescue mission card
        await page.waitForTimeout(300);
        await page.click('[data-scenario="RESCUE_MISSION"]'); // Click again to ensure selection
        await page.waitForTimeout(300);
        await page.click('[data-scenario="RESCUE_MISSION"]'); // Third click to be sure
        await page.waitForTimeout(500);

        // Click on WHIRLWIND submarine multiple times
        console.log('🚤 Selecting Whirlwind submarine (multiple clicks)...');
        await page.click('[data-submarine="WHIRLWIND"]'); // WHIRLWIND submarine
        await page.waitForTimeout(300);
        await page.click('[data-submarine="WHIRLWIND"]'); // Click again
        await page.waitForTimeout(500);

        // Click Start Mission button
        console.log('🚀 Starting mission (clicking Start Mission)...');
        await page.click('.start-mission-btn', { force: true });
        await page.waitForTimeout(8000);

        // Take screenshot
        const screenshotPath = `camera_distance_test_${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath });

        console.log('✅ Screenshot saved:', screenshotPath);

        await page.waitForTimeout(1000);
        return screenshotPath;

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
}

quickGameScreenshot();