const { chromium } = require('playwright');

async function testFullTerrainFix() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🌊 TESTING FULL BATHYMETRIC TERRAIN AREA FIX');
        
        // Open game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(2000);
        
        // Select patrol mission
        await page.click('[data-scenario="PATROL_MISSION"]');
        console.log('✅ Patrol mission selected');
        
        // Wait for full initialization (longer wait for large terrain)
        await page.waitForTimeout(8000);
        console.log('✅ Game initialized with extended wait time');
        
        // Take screenshot of full terrain
        await page.screenshot({ path: 'full_terrain_FIXED.png', fullPage: true });
        console.log('✅ Screenshot captured: full_terrain_FIXED.png');
        
        // Check terrain object properties
        const terrainInfo = await page.evaluate(() => {
            let results = {
                gameExists: !!window.game,
                terrainObjects: [],
                totalTerrainObjects: 0,
                terrainMeshDetails: null
            };
            
            if (window.game && window.game.scene) {
                window.game.scene.traverse((child) => {
                    if (child.isMesh && child.geometry) {
                        const info = {
                            name: child.name || 'unnamed',
                            type: child.type,
                            geometryType: child.geometry.type,
                            visible: child.visible,
                            position: {x: child.position.x, y: child.position.y, z: child.position.z},
                            scale: {x: child.scale.x, y: child.scale.y, z: child.scale.z},
                            materialType: child.material ? child.material.type : 'none',
                            wireframe: child.material ? child.material.wireframe : false,
                            vertexCount: child.geometry.attributes.position ? child.geometry.attributes.position.count : 0
                        };
                        
                        results.terrainObjects.push(info);
                        results.totalTerrainObjects++;
                        
                        // Check if this is the main terrain mesh
                        if (info.vertexCount > 10000) { // Large mesh likely to be terrain
                            results.terrainMeshDetails = info;
                        }
                    }
                });
                
                // Check if terrain generator exists
                if (window.terrainGenerator) {
                    results.terrainGeneratorExists = true;
                    results.terrainSize = window.terrainGenerator.terrainSize;
                    results.maxDepth = window.terrainGenerator.maxDepth;
                    results.minDepth = window.terrainGenerator.minDepth;
                }
            }
            
            return results;
        });
        
        console.log('🔍 TERRAIN ANALYSIS:');
        console.log(`   Game exists: ${terrainInfo.gameExists}`);
        console.log(`   Total terrain objects: ${terrainInfo.totalTerrainObjects}`);
        console.log(`   Terrain generator size: ${terrainInfo.terrainSize}`);
        console.log(`   Depth range: ${terrainInfo.minDepth}m to ${terrainInfo.maxDepth}m`);
        
        if (terrainInfo.terrainMeshDetails) {
            console.log('📐 MAIN TERRAIN MESH DETAILS:');
            console.log(`   Vertex count: ${terrainInfo.terrainMeshDetails.vertexCount}`);
            console.log(`   Position: (${terrainInfo.terrainMeshDetails.position.x}, ${terrainInfo.terrainMeshDetails.position.y}, ${terrainInfo.terrainMeshDetails.position.z})`);
            console.log(`   Scale: (${terrainInfo.terrainMeshDetails.scale.x}, ${terrainInfo.terrainMeshDetails.scale.y}, ${terrainInfo.terrainMeshDetails.scale.z})`);
            console.log(`   Material: ${terrainInfo.terrainMeshDetails.materialType}`);
            console.log(`   Wireframe: ${terrainInfo.terrainMeshDetails.wireframe}`);
        } else {
            console.log('⚠️  No large terrain mesh found');
        }
        
        // Test movement to see terrain extent
        console.log('\n🎮 TESTING TERRAIN EXTENT WITH MOVEMENT:');
        
        // Move submarine up/forward to see more terrain
        await page.keyboard.down('ArrowUp');
        await page.waitForTimeout(2000);
        await page.keyboard.up('ArrowUp');
        
        await page.screenshot({ path: 'terrain_moved_forward.png', fullPage: true });
        console.log('✅ Screenshot after moving forward: terrain_moved_forward.png');
        
        // Move submarine back/down 
        await page.keyboard.down('ArrowDown');
        await page.waitForTimeout(2000);
        await page.keyboard.up('ArrowDown');
        
        await page.screenshot({ path: 'terrain_moved_back.png', fullPage: true });
        console.log('✅ Screenshot after moving back: terrain_moved_back.png');
        
        console.log('\n🎯 FULL TERRAIN AREA TEST COMPLETE!');
        console.log('📸 Check screenshots to verify terrain now covers full bathymetric area');
        
    } catch (error) {
        console.error('Test error:', error);
        await page.screenshot({ path: 'terrain_test_error.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

testFullTerrainFix();