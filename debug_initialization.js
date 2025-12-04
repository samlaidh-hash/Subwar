const { chromium } = require('playwright');

async function debugInitialization() {
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
        console.log('🧪 DEBUGGING GAME INITIALIZATION');
        
        // Open game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(3000);
        
        console.log('=== AFTER PAGE LOAD ===');
        
        // Select patrol mission
        await page.click('[data-scenario="PATROL_MISSION"]');
        await page.waitForTimeout(8000);
        
        console.log('=== AFTER MISSION SELECTION ===');
        
        // Check what loaded
        const gameState = await page.evaluate(() => {
            return {
                hasGameState: !!window.gameState,
                hasPlayerSubmarine: !!window.playerSubmarine,
                hasTerrainGenerator: !!window.terrainGenerator,
                hasScene: !!(window.gameState && window.gameState.scene),
                sceneChildren: window.gameState && window.gameState.scene ? window.gameState.scene.children.length : 0,
                terrainMesh: window.terrainGenerator && window.terrainGenerator.terrainMesh ? 'exists' : 'missing',
                errors: window.initializationErrors || []
            };
        });
        
        console.log('=== GAME STATE CHECK ===');
        console.log(JSON.stringify(gameState, null, 2));
        
        // Take screenshot
        await page.screenshot({ path: 'debug_initialization.png', fullPage: true });
        
        // Check for specific errors
        const errors = consoleMessages.filter(msg => 
            msg.toLowerCase().includes('error') || 
            msg.toLowerCase().includes('failed') ||
            msg.toLowerCase().includes('undefined')
        );
        
        console.log('=== ERRORS FOUND ===');
        errors.forEach(error => console.log('❌', error));
        
    } catch (error) {
        console.error('Debug script error:', error);
    } finally {
        await browser.close();
    }
}

debugInitialization();