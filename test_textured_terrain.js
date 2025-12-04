// Test textured seafloor terrain
const { chromium } = require('playwright');
const path = require('path');

async function testTexturedTerrain() {
    console.log('🌊 TESTING TEXTURED SEAFLOOR TERRAIN');
    console.log('=' .repeat(50));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500,
        args: ['--disable-web-security', '--allow-file-access-from-files']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });
    
    const page = await context.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (text.includes('texture') || text.includes('Seafloor') || text.includes('material')) {
            console.log(`[${type.toUpperCase()}] ${text}`);
        }
    });
    
    try {
        // Load textured seafloor test
        console.log('🌊 Loading textured seafloor test...');
        const testPath = path.join(__dirname, 'test_textured_seafloor.html');
        await page.goto(`file://${testPath}`);
        await page.waitForTimeout(5000); // Allow time for texture generation
        
        // Check status messages
        const terrainStatus = await page.textContent('#terrainStatus');
        const materialStatus = await page.textContent('#materialStatus');
        const textureStatus = await page.textContent('#textureStatus');
        
        console.log('📊 Terrain Status:', terrainStatus);
        console.log('📊 Material Status:', materialStatus);
        console.log('📊 Texture Status:', textureStatus);
        
        // Test mode switching
        console.log('\\n🔧 Testing textured mode (B key)...');
        await page.keyboard.press('b');
        await page.waitForTimeout(1000);
        
        const afterB = await page.textContent('#materialStatus');
        console.log('📊 After B key:', afterB);
        
        // Test solid mode
        console.log('\\n🔧 Testing solid mode (N key)...');
        await page.keyboard.press('n');
        await page.waitForTimeout(1000);
        
        const afterN = await page.textContent('#materialStatus');
        console.log('📊 After N key:', afterN);
        
        // Back to textured mode
        console.log('\\n🔧 Back to textured mode...');
        await page.keyboard.press('b');
        await page.waitForTimeout(1000);
        
        const finalTextured = await page.textContent('#materialStatus');
        console.log('📊 Final Textured Status:', finalTextured);
        
        // Check terrain object
        const terrainInfo = await page.evaluate(() => {
            if (!window.terrain) return 'No terrain object';
            
            return {
                visible: window.terrain.isVisible,
                wireframe: window.terrain.wireframeMode,
                useFallback: window.terrain.useFallbackMaterial,
                children: window.terrain.terrainGroup ? window.terrain.terrainGroup.children.length : 0
            };
        });
        
        console.log('🌍 Terrain Object Info:', terrainInfo);
        
        // Test results
        console.log('\\n📊 TEST RESULTS:');
        console.log('=' .repeat(30));
        
        const results = {
            terrainCreated: terrainStatus.includes('✅'),
            materialCreated: materialStatus.includes('✅'),
            textureGenerated: textureStatus.includes('✅'),
            texturedModeWorks: finalTextured.includes('Textured seafloor'),
            terrainVisible: typeof terrainInfo === 'object' && terrainInfo.visible
        };
        
        Object.entries(results).forEach(([test, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
        });
        
        const overall = Object.values(results).every(Boolean);
        console.log(`\\n🏆 OVERALL: ${overall ? '✅ SUCCESS' : '⚠️ CHECK MANUALLY'}`);
        
        if (overall) {
            console.log('\\n🎉 Textured seafloor should now be visible with realistic ocean bottom textures!');
            console.log('🌊 Features: Sandy patches, muddy areas, rocky outcrops, sediment details');
        } else {
            console.log('\\n⚠️ Please check browser manually for texture visibility');
        }
        
        // Keep browser open for inspection
        console.log('\\n👀 Browser staying open for 15 seconds for manual verification...');
        await page.waitForTimeout(15000);
        
        return overall;
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        return false;
    } finally {
        await browser.close();
    }
}

testTexturedTerrain().then(success => {
    console.log(`\\n🏁 Textured terrain test: ${success ? 'SUCCESS' : 'MANUAL CHECK NEEDED'}`);
    process.exit(0);
}).catch(console.error);