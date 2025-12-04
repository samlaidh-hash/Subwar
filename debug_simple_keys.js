const { chromium } = require('playwright');

async function debugSimpleKeys() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🧪 SIMPLE KEY TEST');
        
        // Open game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(3000);
        
        // Select patrol mission
        await page.click('[data-scenario="PATROL_MISSION"]');
        await page.waitForTimeout(8000);
        
        // Add console logging for key presses
        await page.evaluate(() => {
            // Override the handleKeyDown method to add logging
            const originalHandleKeyDown = window.playerSubmarine?.handleKeyDown;
            if (window.playerSubmarine && originalHandleKeyDown) {
                window.playerSubmarine.handleKeyDown = function(event) {
                    console.log('🔑 Key pressed:', event.code, 'Submarine exists:', !!window.playerSubmarine, 'Launchers:', !!this.launchers);
                    if (event.code.startsWith('Digit')) {
                        console.log('🎯 Digit key pressed, launchers length:', this.launchers ? this.launchers.length : 'N/A');
                    }
                    return originalHandleKeyDown.call(this, event);
                };
            }
        });
        
        console.log('Testing key 1...');
        await page.keyboard.press('1');
        await page.waitForTimeout(1000);
        
        console.log('Testing key 1 again...');
        await page.keyboard.press('1');
        await page.waitForTimeout(1000);
        
        console.log('Testing key 2...');
        await page.keyboard.press('2');
        await page.waitForTimeout(1000);
        
        // Take screenshot
        await page.screenshot({ path: 'debug_simple_keys.png', fullPage: true });
        
    } catch (error) {
        console.error('Debug error:', error);
    } finally {
        await browser.close();
    }
}

debugSimpleKeys();