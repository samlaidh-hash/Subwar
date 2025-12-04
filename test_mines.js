const { chromium } = require('playwright');

async function testMineDeployment() {
    console.log('Starting mine deployment test...');
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Navigate to game
        await page.goto('http://localhost:8000');
        await page.waitForTimeout(3000); // Wait for game to load

        // Take initial screenshot
        await page.screenshot({ path: 'screenshots/mine_01_initial.png', fullPage: true });
        console.log('Screenshot 1: Initial state');

        // Try to deploy a mine with Key 9
        console.log('Deploying mine...');
        await page.keyboard.press('9');
        await page.waitForTimeout(1000);

        // Take screenshot after mine deployment
        await page.screenshot({ path: 'screenshots/mine_02_deployed.png', fullPage: true });
        console.log('Screenshot 2: After mine deployment');

        // Deploy another mine
        await page.keyboard.press('9');
        await page.waitForTimeout(1000);

        // Take final screenshot
        await page.screenshot({ path: 'screenshots/mine_03_multiple.png', fullPage: true });
        console.log('Screenshot 3: Multiple mines deployed');

        // Check console for mine deployment messages
        const consoleLogs = [];
        page.on('console', msg => consoleLogs.push(msg.text()));

        await page.waitForTimeout(2000);
        console.log('Console logs:', consoleLogs.filter(log => log.includes('Mine') || log.includes('mine')));

    } catch (error) {
        console.error('Test failed:', error);
        await page.screenshot({ path: 'screenshots/mine_error.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('Mine deployment test completed.');
    }
}

testMineDeployment();
