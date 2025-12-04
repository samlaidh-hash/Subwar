const { chromium } = require('playwright');

async function inspectBathymetry() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Open the game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(2000);

        // Select patrol mission
        await page.click('[data-scenario="PATROL_MISSION"]');
        await page.waitForTimeout(3000);

        console.log('=== DETAILED BATHYMETRY INSPECTION ===');
        
        // Get detailed scene information
        const detailedInfo = await page.evaluate(() => {
            const info = {
                gameExists: !!window.game,
                sceneExists: !!(window.game && window.game.scene),
                bathymetryDataExists: !!window.bathymetryData,
                bathymetryKeys: window.bathymetryData ? Object.keys(window.bathymetryData) : [],
                bathymetryDataSize: 0,
                terrainMeshExists: false,
                terrainMaterial: 'unknown',
                sceneChildren: [],
                terrainVisible: false,
                terrainPosition: null,
                terrainScale: null
            };
            
            if (window.bathymetryData && window.bathymetryData.elevations) {
                info.bathymetryDataSize = window.bathymetryData.elevations.length;
            }
            
            if (window.game && window.game.scene) {
                // Check scene children
                window.game.scene.children.forEach(child => {
                    info.sceneChildren.push({
                        type: child.type,
                        name: child.name,
                        visible: child.visible,
                        position: {x: child.position.x, y: child.position.y, z: child.position.z},
                        isMesh: child.isMesh,
                        hasGeometry: !!child.geometry,
                        hasMaterial: !!child.material,
                        materialType: child.material ? child.material.type : null
                    });
                    
                    // Check if this is terrain
                    if (child.name && child.name.toLowerCase().includes('terrain')) {
                        info.terrainMeshExists = true;
                        info.terrainVisible = child.visible;
                        info.terrainPosition = {x: child.position.x, y: child.position.y, z: child.position.z};
                        info.terrainScale = {x: child.scale.x, y: child.scale.y, z: child.scale.z};
                        if (child.material) {
                            info.terrainMaterial = child.material.type;
                        }
                    }
                });
            }
            
            return info;
        });
        
        console.log('Detailed scene info:', JSON.stringify(detailedInfo, null, 2));
        
        // Test terrain mode switching
        console.log('=== TESTING TERRAIN MODES ===');
        
        // Try solid mode (N key)
        await page.keyboard.press('n');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'terrain_solid_mode.png', fullPage: true });
        console.log('Pressed N - Terrain Solid Mode');
        
        // Try shader mode (B key)  
        await page.keyboard.press('b');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'terrain_shader_mode.png', fullPage: true });
        console.log('Pressed B - Terrain Shader Mode');
        
        // Try wireframe toggle (T key)
        await page.keyboard.press('t');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'terrain_wireframe_toggle.png', fullPage: true });
        console.log('Pressed T - Toggle Terrain Wireframe');
        
        // Check console for any terrain-related errors
        const consoleMessages = [];
        page.on('console', msg => {
            if (msg.text().toLowerCase().includes('terrain') || 
                msg.text().toLowerCase().includes('bathymetry') ||
                msg.text().toLowerCase().includes('elevation')) {
                consoleMessages.push(`${msg.type()}: ${msg.text()}`);
            }
        });
        
        await page.waitForTimeout(1000);
        
        console.log('=== TERRAIN-RELATED CONSOLE MESSAGES ===');
        consoleMessages.forEach(msg => console.log(msg));
        
        // Check if bathymetry data file loaded
        const bathymetryFileCheck = await page.evaluate(() => {
            // Check global bathymetry variables
            return {
                montereyBathymetryExists: typeof montereyBathymetryData !== 'undefined',
                bathymetryDataExists: typeof bathymetryData !== 'undefined',
                globalBathymetryExists: typeof window.bathymetryData !== 'undefined',
                montereyData: typeof montereyBathymetryData !== 'undefined' ? {
                    hasElevations: !!(montereyBathymetryData.elevations),
                    elevationCount: montereyBathymetryData.elevations ? montereyBathymetryData.elevations.length : 0,
                    width: montereyBathymetryData.width,
                    height: montereyBathymetryData.height,
                    bounds: montereyBathymetryData.bounds
                } : null
            };
        });
        
        console.log('=== BATHYMETRY DATA FILE CHECK ===');
        console.log(JSON.stringify(bathymetryFileCheck, null, 2));
        
    } catch (error) {
        console.error('Error during bathymetry inspection:', error);
        await page.screenshot({ path: 'bathymetry_error.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

inspectBathymetry();