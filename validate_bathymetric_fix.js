const { chromium } = require('playwright');

async function validateBathymetricFix() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🧪 VALIDATING BATHYMETRIC TERRAIN FIX');
        
        // Open game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(2000);
        
        // Select patrol mission
        await page.click('[data-scenario="PATROL_MISSION"]');
        console.log('✅ Patrol mission selected');
        
        // Wait for full initialization
        await page.waitForTimeout(5000);
        console.log('✅ Game initialized');
        
        // Take screenshot of the result
        await page.screenshot({ path: 'bathymetric_terrain_FIXED.png', fullPage: true });
        console.log('✅ Screenshot captured: bathymetric_terrain_FIXED.png');
        
        // Validate terrain is now solid
        const terrainStatus = await page.evaluate(() => {
            let results = {
                gameExists: !!window.game,
                terrainObjects: 0,
                wireframeObjects: 0,
                solidObjects: 0,
                shaderObjects: 0
            };
            
            if (window.game && window.game.scene) {
                window.game.scene.traverse((child) => {
                    if (child.isMesh || child.isLine || child.type === 'LineSegments') {
                        results.terrainObjects++;
                        
                        if (child.material) {
                            if (child.material.wireframe === true || child.type === 'LineSegments') {
                                results.wireframeObjects++;
                            } else if (child.material.type === 'ShaderMaterial') {
                                results.shaderObjects++;
                            } else {
                                results.solidObjects++;
                            }
                        }
                    }
                });
            }
            
            return results;
        });
        
        console.log('🔍 TERRAIN VALIDATION RESULTS:');
        console.log(`   Total terrain objects: ${terrainStatus.terrainObjects}`);
        console.log(`   Wireframe objects: ${terrainStatus.wireframeObjects}`);
        console.log(`   Solid objects: ${terrainStatus.solidObjects}`);
        console.log(`   Shader objects: ${terrainStatus.shaderObjects}`);
        
        // Test terrain mode switching
        console.log('\n🎮 TESTING TERRAIN MODE KEYS:');
        
        // Test B key (bathymetric shader)
        await page.keyboard.press('b');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'terrain_B_key_test.png', fullPage: true });
        console.log('✅ B key test - Screenshot: terrain_B_key_test.png');
        
        // Test N key (solid mode)
        await page.keyboard.press('n');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'terrain_N_key_test.png', fullPage: true });
        console.log('✅ N key test - Screenshot: terrain_N_key_test.png');
        
        // Test T key (wireframe toggle)
        await page.keyboard.press('t');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'terrain_T_key_test.png', fullPage: true });
        console.log('✅ T key test - Screenshot: terrain_T_key_test.png');
        
        console.log('\n🎯 BATHYMETRIC TERRAIN FIX VALIDATION COMPLETE!');
        console.log('📸 Check the screenshots to verify the terrain is now displaying properly');
        
    } catch (error) {
        console.error('Validation error:', error);
        await page.screenshot({ path: 'validation_error.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

validateBathymetricFix();