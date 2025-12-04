const { chromium } = require('playwright');
const path = require('path');

async function takeGameScreenshot() {
    console.log('🎮 Starting Playwright to capture game screenshot...');

    const browser = await chromium.launch({
        headless: false,  // Show browser for debugging
        slowMo: 1000     // Slow down for loading
    });

    const page = await browser.newPage();

    // Set viewport size for consistent screenshots
    await page.setViewportSize({ width: 1920, height: 1080 });

    try {
        // Navigate to the game
        const gameUrl = `file://${path.resolve(__dirname, 'index.html')}`;
        console.log('📂 Loading game from:', gameUrl);

        await page.goto(gameUrl);

        // Wait for game to load
        console.log('⏳ Waiting for game to initialize...');
        await page.waitForTimeout(5000);

        // Check if scenario selection is showing and start rescue mission
        const scenarioOverlay = await page.$('#scenarioOverlay');
        if (scenarioOverlay) {
            console.log('🚁 Starting rescue mission sequence...');

            // Click on rescue mission card
            const rescueMission = await page.$('[data-scenario="RESCUE_MISSION"]');
            if (rescueMission) {
                await rescueMission.click();
                console.log('✅ Clicked rescue mission');
                await page.waitForTimeout(1000);
            }

            // Select Whirlwind submarine
            console.log('🌪️ Selecting Whirlwind submarine...');
            await page.keyboard.press('F4'); // Whirlwind is F4
            await page.waitForTimeout(1000);

            // Start mission
            console.log('🚀 Starting mission...');
            await page.keyboard.press('Enter'); // Start mission
            await page.waitForTimeout(3000);
        }

        // Wait for 3D scene to render
        console.log('🌊 Waiting for 3D scene to render...');
        await page.waitForTimeout(3000);

        // Take screenshot
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = `game_screenshot_${timestamp}.png`;

        console.log('📸 Taking screenshot...');
        await page.screenshot({
            path: screenshotPath,
            fullPage: false
        });

        console.log('✅ Screenshot saved as:', screenshotPath);

        // Keep browser open for a moment to see the game
        await page.waitForTimeout(2000);

        return screenshotPath;

    } catch (error) {
        console.error('❌ Error taking screenshot:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the screenshot function
takeGameScreenshot().then(screenshotPath => {
    console.log('🎯 Screenshot complete:', screenshotPath);
}).catch(error => {
    console.error('💥 Screenshot failed:', error);
});