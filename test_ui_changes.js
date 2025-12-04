const { chromium } = require('playwright');

async function testUIChanges() {
    console.log('Starting UI test...');
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Navigate to game
        await page.goto('http://localhost:8000');
        await page.waitForTimeout(2000); // Wait for game to load

        // Take initial screenshot
        await page.screenshot({ path: 'screenshots/01_initial_state.png', fullPage: true });
        console.log('Screenshot 1: Initial game state');

        // Test torpedo tube selection (Key 1)
        await page.keyboard.press('1');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'screenshots/02_tube1_selected.png', fullPage: true });
        console.log('Screenshot 2: Tube 1 selected');

        // Test double-tap torpedo cycling (Key 1 again within 2 seconds)
        await page.keyboard.press('1');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'screenshots/03_torpedo_cycling.png', fullPage: true });
        console.log('Screenshot 3: Torpedo cycling initiated');

        // Test tube 2 selection
        await page.keyboard.press('2');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'screenshots/04_tube2_selected.png', fullPage: true });
        console.log('Screenshot 4: Tube 2 selected');

        // Test sonar ping
        await page.keyboard.press('r');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'screenshots/05_sonar_ping.png', fullPage: true });
        console.log('Screenshot 5: After sonar ping');

        // Test sonar mode cycling
        await page.keyboard.press('m');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'screenshots/06_sonar_mode.png', fullPage: true });
        console.log('Screenshot 6: Sonar mode changed');

        // Wait a bit longer to see the loading process
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'screenshots/07_final_state.png', fullPage: true });
        console.log('Screenshot 7: Final state after changes');

    } catch (error) {
        console.error('Test failed:', error);
        await page.screenshot({ path: 'screenshots/error_state.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('Test completed. Check screenshots/ folder for results.');
    }
}

// Create screenshots directory
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

testUIChanges();
