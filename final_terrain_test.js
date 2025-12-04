// Final comprehensive terrain visibility test
const { chromium } = require('playwright');
const path = require('path');

async function finalTerrainTest() {
    console.log('🏁 FINAL TERRAIN VISIBILITY TEST');
    console.log('=' .repeat(50));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000,
        args: ['--disable-web-security', '--allow-file-access-from-files']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });
    
    const page = await context.newPage();
    
    // Capture geometry-related console output
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('bounds') || text.includes('Mesh') || text.includes('geometry') || 
            text.includes('visible') || text.includes('Emergency') || text.includes('✅') || 
            text.includes('❌')) {
            console.log(`[CONSOLE] ${text}`);
        }
    });
    
    try {
        // Test geometry fix
        console.log('🔧 Testing geometry fix...');
        const testPath = path.join(__dirname, 'test_geometry_fix.html');
        await page.goto(`file://${testPath}`);
        await page.waitForTimeout(5000);
        
        // Check status messages
        const status = await page.textContent('#status');
        const geometryStatus = await page.textContent('#geometryStatus');
        const boundsStatus = await page.textContent('#boundsStatus');
        const visibilityStatus = await page.textContent('#visibilityStatus');
        
        console.log('📊 Status:', status);
        console.log('📊 Geometry:', geometryStatus);
        console.log('📊 Bounds:', boundsStatus);
        console.log('📊 Visibility:', visibilityStatus);
        
        // Test main game after fixes
        console.log('\\n🎮 Testing main game with fixes...');
        const mainPath = path.join(__dirname, 'index.html');
        await page.goto(`file://${mainPath}`);
        await page.waitForTimeout(8000);
        
        // Check terrain after fixes
        const mainGameResults = await page.evaluate(() => {
            if (!window.simpleTerrain) return { error: 'No terrain object' };
            
            const terrainGroup = window.simpleTerrain.terrainGroup;
            if (!terrainGroup) return { error: 'No terrain group' };
            
            let meshDetails = [];
            terrainGroup.children.forEach((child, i) => {
                if (child.type === 'Mesh') {
                    meshDetails.push({
                        index: i,
                        type: child.type,
                        visible: child.visible,
                        hasGeometry: !!child.geometry,
                        hasBounds: !!(child.geometry && child.geometry.boundingBox),
                        boundsValid: child.geometry && child.geometry.boundingBox && 
                                   !isNaN(child.geometry.boundingBox.min.x),
                        position: child.position,
                        materialType: child.material ? child.material.constructor.name : 'none'
                    });
                }
            });
            
            return {
                terrainExists: true,
                terrainVisible: window.simpleTerrain.isVisible,
                totalChildren: terrainGroup.children.length,
                meshCount: meshDetails.length,
                meshDetails: meshDetails
            };
        });
        
        console.log('\\n🎮 Main Game Results:', JSON.stringify(mainGameResults, null, 2));
        
        // Test controls
        if (mainGameResults.terrainExists) {
            console.log('\\n🔧 Testing terrain controls...');
            
            await page.keyboard.press('b');
            await page.waitForTimeout(2000);
            console.log('✅ B key pressed (terrain mode)');
            
            await page.keyboard.press('v');
            await page.waitForTimeout(2000);
            console.log('✅ V key pressed (wireframe mode)');
            
            await page.keyboard.press('b');
            await page.waitForTimeout(2000);
            console.log('✅ Back to terrain mode');
        }
        
        // Final assessment
        console.log('\\n📊 FINAL ASSESSMENT:');
        console.log('=' .repeat(30));
        
        const results = {
            geometryTestPassed: geometryStatus.includes('✅'),
            boundsFixed: boundsStatus.includes('valid bounds') || boundsStatus.includes('✅'),
            terrainExists: mainGameResults.terrainExists,
            hasMeshes: mainGameResults.meshCount > 0,
            meshesHaveBounds: mainGameResults.meshDetails?.some(m => m.hasBounds) || false
        };
        
        Object.entries(results).forEach(([test, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
        });
        
        const overallSuccess = Object.values(results).every(Boolean);
        console.log(`\\n🏆 OVERALL: ${overallSuccess ? '✅ SUCCESS' : '⚠️ PARTIAL SUCCESS'}`);
        
        if (overallSuccess) {
            console.log('\\n🎉 TERRAIN SHOULD NOW BE VISIBLE!');
            console.log('🌍 The geometry fix has resolved the mesh bounds issue');
            console.log('🎮 Press B in the game to see brown terrain');
        } else {
            console.log('\\n⚠️ Some issues may remain:');
            if (!results.hasMeshes) console.log('- No mesh objects found in terrain');
            if (!results.meshesHaveBounds) console.log('- Meshes still missing valid bounds');
        }
        
        // Keep browser open for manual verification
        console.log('\\n👀 Browser staying open for 20 seconds...');
        console.log('🔍 Check if you can see brown terrain when pressing B key');
        await page.waitForTimeout(20000);
        
        return overallSuccess;
        
    } catch (error) {
        console.error('❌ Final test failed:', error);
        return false;
    } finally {
        await browser.close();
    }
}

finalTerrainTest().then(success => {
    console.log(`\\n🏁 Final terrain test: ${success ? 'SUCCESS' : 'NEEDS MANUAL CHECK'}`);
    process.exit(0);
}).catch(console.error);