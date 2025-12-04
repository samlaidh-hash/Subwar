const { chromium } = require('playwright');

async function debugTerrainPosition() {
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
        console.log('🧪 DEBUGGING TERRAIN POSITION vs SUBMARINE');
        
        // Open game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(3000);
        
        // Select patrol mission
        await page.click('[data-scenario="PATROL_MISSION"]');
        await page.waitForTimeout(8000);
        
        // Check terrain and submarine positions
        const positionInfo = await page.evaluate(() => {
            const sub = window.playerSubmarine;
            const terrainGen = window.terrainGenerator;
            
            const info = {
                submarinePosition: sub ? {
                    x: sub.mesh.position.x,
                    y: sub.mesh.position.y,
                    z: sub.mesh.position.z
                } : 'No submarine',
                
                terrainInfo: terrainGen ? {
                    terrainSize: terrainGen.terrainSize,
                    minDepth: terrainGen.minDepth,
                    maxDepth: terrainGen.maxDepth,
                    terrainExists: !!terrainGen.terrainMesh,
                    terrainPosition: terrainGen.terrainMesh ? {
                        x: terrainGen.terrainMesh.position.x,
                        y: terrainGen.terrainMesh.position.y,
                        z: terrainGen.terrainMesh.position.z
                    } : 'No terrain mesh'
                } : 'No terrain generator',
                
                sceneChildren: window.gameState && window.gameState.scene ? 
                    window.gameState.scene.children.length : 'No scene',
                    
                terrainGroups: []
            };
            
            // Look for terrain groups in scene
            if (window.gameState && window.gameState.scene) {
                window.gameState.scene.traverse((child) => {
                    if (child.name === 'proceduralTerrain' || child.name === 'fullScaleTerrain') {
                        info.terrainGroups.push({
                            name: child.name,
                            position: {x: child.position.x, y: child.position.y, z: child.position.z},
                            visible: child.visible,
                            children: child.children.length
                        });
                    }
                });
            }
            
            return info;
        });
        
        console.log('=== POSITION ANALYSIS ===');
        console.log(JSON.stringify(positionInfo, null, 2));
        
        // Calculate if submarine is within terrain bounds
        if (positionInfo.submarinePosition !== 'No submarine' && positionInfo.terrainInfo !== 'No terrain generator') {
            const subX = positionInfo.submarinePosition.x;
            const subZ = positionInfo.submarinePosition.z;
            const terrainSize = positionInfo.terrainInfo.terrainSize;
            const halfSize = terrainSize / 2;
            
            console.log('=== BOUNDS CHECK ===');
            console.log(`Submarine position: (${subX}, ${subZ})`);
            console.log(`Terrain size: ${terrainSize}km`);
            console.log(`Terrain bounds: -${halfSize}km to +${halfSize}km`);
            console.log(`Submarine within bounds: ${Math.abs(subX) <= halfSize && Math.abs(subZ) <= halfSize ? 'YES ✅' : 'NO ❌'}`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'debug_terrain_position.png', fullPage: true });
        
        // Test bubble creation by diving
        console.log('=== TESTING BUBBLE CREATION ===');
        console.log('Pressing Q to dive and trigger bubbles...');
        await page.keyboard.press('q');
        await page.waitForTimeout(3000);
        
        // Count bubbles in scene
        const bubbleCount = await page.evaluate(() => {
            let count = 0;
            if (window.gameState && window.gameState.scene) {
                window.gameState.scene.traverse((child) => {
                    if (child.geometry && child.geometry.type === 'SphereGeometry') {
                        count++;
                    }
                });
            }
            return count;
        });
        
        console.log(`Bubbles found in scene: ${bubbleCount}`);
        
    } catch (error) {
        console.error('Debug script error:', error);
    } finally {
        await browser.close();
    }
}

debugTerrainPosition();