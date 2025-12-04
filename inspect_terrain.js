const { chromium } = require('playwright');

async function inspectTerrain() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Open the game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(2000);

        console.log('=== INITIAL STATE ===');
        console.log('Page loaded, checking scenario overlay...');
        
        // Take initial screenshot
        await page.screenshot({ path: 'terrain_inspection_1_initial.png', fullPage: true });
        
        // Check if scenario overlay is visible
        const scenarioOverlay = await page.$('#scenarioOverlay');
        const isOverlayVisible = await scenarioOverlay.isVisible();
        console.log('Scenario overlay visible:', isOverlayVisible);

        if (isOverlayVisible) {
            console.log('=== SELECTING PATROL MISSION ===');
            
            // Click on patrol mission (F1)
            await page.click('[data-scenario="PATROL_MISSION"]');
            await page.waitForTimeout(1000);
            
            // Take screenshot after mission selection
            await page.screenshot({ path: 'terrain_inspection_2_mission_selected.png', fullPage: true });
        }
        
        // Wait for game to initialize
        await page.waitForTimeout(3000);
        
        // Check console logs for terrain loading
        const logs = [];
        page.on('console', msg => {
            logs.push(`${msg.type()}: ${msg.text()}`);
        });
        
        // Take final screenshot
        await page.screenshot({ path: 'terrain_inspection_3_final.png', fullPage: true });
        
        // Check if 3D elements are present
        console.log('=== CHECKING 3D SCENE ELEMENTS ===');
        
        // Check if canvas is present and visible
        const canvas = await page.$('canvas');
        if (canvas) {
            const canvasVisible = await canvas.isVisible();
            const canvasRect = await canvas.boundingBox();
            console.log('Canvas visible:', canvasVisible);
            console.log('Canvas dimensions:', canvasRect);
        } else {
            console.log('No canvas element found!');
        }
        
        // Execute JavaScript to check Three.js scene
        const sceneInfo = await page.evaluate(() => {
            return {
                hasWindow: typeof window !== 'undefined',
                hasThreeJS: typeof THREE !== 'undefined',
                hasGame: typeof window.game !== 'undefined',
                hasScene: window.game && window.game.scene ? true : false,
                sceneChildren: window.game && window.game.scene ? window.game.scene.children.length : 0,
                hasBathymetry: window.bathymetryData ? Object.keys(window.bathymetryData).length : 0
            };
        });
        
        console.log('Scene information:', sceneInfo);
        
        // Check recent console logs
        console.log('=== RECENT CONSOLE LOGS ===');
        logs.slice(-10).forEach(log => console.log(log));
        
        console.log('=== INSPECTION COMPLETE ===');
        console.log('Screenshots saved as terrain_inspection_*.png');
        
    } catch (error) {
        console.error('Error during inspection:', error);
        await page.screenshot({ path: 'terrain_inspection_error.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

inspectTerrain();