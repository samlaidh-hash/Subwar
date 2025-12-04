const { chromium } = require('playwright');

async function debugTorpedoRows() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🧪 DEBUGGING TORPEDO ROW BEHAVIOR');
        
        // Open game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(2000);
        
        // Select patrol mission
        await page.click('[data-scenario="PATROL_MISSION"]');
        await page.waitForTimeout(5000);
        
        // Take initial screenshot
        await page.screenshot({ path: 'torpedo_debug_1_initial.png', fullPage: true });
        
        // Test pressing key 1 multiple times
        console.log('Testing key 1 presses...');
        for (let i = 1; i <= 8; i++) {
            await page.keyboard.press('1');
            await page.waitForTimeout(500);
            await page.screenshot({ path: `torpedo_debug_1_press_${i}.png`, fullPage: true });
            console.log(`Press ${i} completed`);
        }
        
        // Test other keys
        console.log('Testing key 2...');
        await page.keyboard.press('2');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'torpedo_debug_2_key2.png', fullPage: true });
        
        console.log('Testing key 3...');
        await page.keyboard.press('3');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'torpedo_debug_3_key3.png', fullPage: true });
        
        console.log('Testing key 4...');
        await page.keyboard.press('4');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'torpedo_debug_4_key4.png', fullPage: true });
        
        // Check torpedo launcher state
        const torpedoState = await page.evaluate(() => {
            const sub = window.playerSubmarine;
            if (!sub) return { error: 'No submarine found' };
            
            console.log('Submarine object keys:', Object.keys(sub));
            console.log('Has launchers property:', 'launchers' in sub);
            console.log('Launchers type:', typeof sub.launchers);
            console.log('Launchers length:', sub.launchers ? sub.launchers.length : 'N/A');
            
            return {
                hasSubmarine: true,
                selectedLauncher: sub.selectedLauncher,
                submarineClass: sub.submarineClass,
                hasLaunchers: !!sub.launchers,
                launchersLength: sub.launchers ? sub.launchers.length : 0,
                launchers: sub.launchers ? sub.launchers.map(l => ({
                    id: l.id,
                    currentBox: l.currentBox,
                    chambers: l.chambers
                })) : 'N/A'
            };
        });
        
        console.log('Current torpedo state:', JSON.stringify(torpedoState, null, 2));
        
    } catch (error) {
        console.error('Debug error:', error);
    } finally {
        await browser.close();
    }
}

debugTorpedoRows();