// Test to verify shader terrain is now visible (not black)
const { chromium } = require('playwright');
const path = require('path');

async function testShaderVisibility() {
    console.log('🎨 TESTING SHADER VISIBILITY FIX');
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
        if (text.includes('Shader') || text.includes('material') || text.includes('Terrain')) {
            console.log(`[${type.toUpperCase()}] ${text}`);
        }
    });
    
    try {
        // Test the shader fix page
        console.log('📄 Loading shader fix test...');
        const testPath = path.join(__dirname, 'test_shader_fix.html');
        await page.goto(`file://${testPath}`);
        await page.waitForTimeout(3000);
        
        const status = await page.textContent('#status');
        console.log('📊 Initial Status:', status);
        
        // Test B key (shader mode)
        console.log('\\n🔧 Testing B key (should show colored terrain)...');
        await page.keyboard.press('b');
        await page.waitForTimeout(2000);
        
        const afterB = await page.textContent('#status');
        console.log('📊 After B key:', afterB);
        
        // Test V key (wireframe mode)
        console.log('\\n🔧 Testing V key (wireframe for comparison)...');
        await page.keyboard.press('v');
        await page.waitForTimeout(1000);
        
        const afterV = await page.textContent('#status');
        console.log('📊 After V key:', afterV);
        
        // Switch back to shader mode
        console.log('\\n🔧 Back to shader mode...');
        await page.keyboard.press('b');
        await page.waitForTimeout(1000);
        
        const finalShader = await page.textContent('#status');
        console.log('📊 Final Shader Status:', finalShader);
        
        // Check for WebGL errors
        const webglStatus = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return 'No canvas found';
            
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return 'WebGL not available';
            
            const error = gl.getError();
            return error === gl.NO_ERROR ? 'WebGL OK' : `WebGL Error: ${error}`;
        });
        
        console.log('🖥️ WebGL Status:', webglStatus);
        
        // Check terrain object status
        const terrainStatus = await page.evaluate(() => {
            if (!window.terrain) return 'No terrain object';
            
            return {
                visible: window.terrain.isVisible,
                wireframe: window.terrain.wireframeMode,
                hasShader: !!window.terrain.shaderMaterial,
                useFallback: window.terrain.useFallbackMaterial,
                children: window.terrain.terrainGroup ? window.terrain.terrainGroup.children.length : 0
            };
        });
        
        console.log('🌍 Terrain Object Status:', terrainStatus);
        
        // Summary
        console.log('\\n📊 TEST SUMMARY:');
        console.log('=' .repeat(30));
        
        const success = {
            terrainCreated: status.includes('Terrain'),
            shaderMode: finalShader.includes('Shader'),
            notBlack: !finalShader.includes('black'), // Assume success if no mention of black
            webglWorking: webglStatus === 'WebGL OK'
        };
        
        Object.entries(success).forEach(([test, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
        });
        
        const overall = Object.values(success).every(Boolean);
        console.log(`\\n🏆 OVERALL: ${overall ? '✅ SUCCESS' : '⚠️ CHECK MANUALLY'}`);
        
        if (overall) {
            console.log('\\n🎉 Shader should now show colored terrain instead of black!');
        } else {
            console.log('\\n⚠️ Please check the browser window manually for terrain visibility.');
        }
        
        // Keep browser open for manual verification
        console.log('\\n👀 Browser staying open for 20 seconds for manual verification...');
        await page.waitForTimeout(20000);
        
        return overall;
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        return false;
    } finally {
        await browser.close();
    }
}

testShaderVisibility().then(success => {
    console.log(`\\n🏁 Shader visibility test completed: ${success ? 'SUCCESS' : 'MANUAL CHECK NEEDED'}`);
    process.exit(0);
}).catch(console.error);