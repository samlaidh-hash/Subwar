const { chromium } = require('playwright');

async function debugSubmarineInit() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Capture all console messages
    const consoleMessages = [];
    page.on('console', msg => {
        const text = `${msg.type()}: ${msg.text()}`;
        console.log(text);
        consoleMessages.push(text);
    });

    // Capture errors
    page.on('error', error => {
        const text = `ERROR: ${error.message}`;
        console.log(text);
        consoleMessages.push(text);
    });

    page.on('pageerror', error => {
        const text = `PAGE ERROR: ${error.message}`;
        console.log(text);
        consoleMessages.push(text);
    });

    try {
        console.log('🧪 DEBUGGING SUBMARINE INITIALIZATION');
        
        // Open game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(3000);
        
        // Select patrol mission
        await page.click('[data-scenario="PATROL_MISSION"]');
        await page.waitForTimeout(8000);
        
        // Check submarine initialization details
        const submarineDetails = await page.evaluate(() => {
            const sub = window.playerSubmarine;
            if (!sub) return { error: 'No submarine found' };
            
            // Check SUBMARINE_SPECIFICATIONS
            const specs = window.SUBMARINE_SPECIFICATIONS ? window.SUBMARINE_SPECIFICATIONS['TORNADO'] : null;
            
            return {
                submarineExists: true,
                submarineClass: sub.submarineClass,
                hasSpecs: !!specs,
                torpedoTubes: specs ? specs.torpedoTubes : 'N/A',
                launchersLength: sub.launchers ? sub.launchers.length : 0,
                launchersExist: !!sub.launchers,
                initMethods: {
                    initializeSubmarineClass: typeof sub.initializeSubmarineClass,
                    initializeTorpedoSystem: typeof sub.initializeTorpedoSystem,
                    updateLauncherDisplay: typeof sub.updateLauncherDisplay
                },
                constructorFlow: {
                    step1_specs: !!specs,
                    step2_launchers: !!sub.launchers,
                    step3_selectedLauncher: sub.selectedLauncher,
                    step4_launcherInteraction: !!sub.launcherInteraction
                }
            };
        });
        
        console.log('=== SUBMARINE INITIALIZATION DETAILS ===');
        console.log(JSON.stringify(submarineDetails, null, 2));
        
        // Take screenshot
        await page.screenshot({ path: 'debug_submarine_init.png', fullPage: true });
        
    } catch (error) {
        console.error('Debug script error:', error);
    } finally {
        await browser.close();
    }
}

debugSubmarineInit();