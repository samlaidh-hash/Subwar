// Playwright test for shader and Cobra model verification
const { chromium } = require('playwright');
const path = require('path');

async function testShaderAndCobra() {
    console.log('🧪 Starting Shader & Cobra Model Test with Playwright');
    
    const browser = await chromium.launch({ 
        headless: false, // Show browser for visual verification
        slowMo: 1000,    // Slow down actions for observation
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
        console.log(`[${type.toUpperCase()}] ${text}`);
    });
    
    // Handle errors
    page.on('pageerror', err => {
        console.error('❌ Page Error:', err.message);
    });
    
    try {
        // Load the test page
        const testPagePath = path.join(__dirname, 'test_shaders_cobra.html');
        console.log('📄 Loading test page:', testPagePath);
        
        await page.goto(`file://${testPagePath}`);
        
        // Wait for page to load and initialize
        await page.waitForTimeout(3000);
        
        // Check if terrain was created
        const terrainStatus = await page.textContent('#terrainStatus');
        console.log('🌍 Terrain Status:', terrainStatus);
        
        // Check if submarine was created
        const submarineStatus = await page.textContent('#submarineStatus');
        console.log('🚢 Submarine Status:', submarineStatus);
        
        // Check shader status
        const shaderStatus = await page.textContent('#shaderStatus');
        console.log('🎨 Shader Status:', shaderStatus);
        
        // Check Cobra model status
        const cobraStatus = await page.textContent('#cobraStatus');
        console.log('🐍 Cobra Status:', cobraStatus);
        
        // Test terrain toggle (T key)
        console.log('\\n🔧 Testing terrain toggle...');
        await page.keyboard.press('t');
        await page.waitForTimeout(1000);
        
        const terrainAfterToggle = await page.textContent('#terrainStatus');
        console.log('🌍 Terrain After Toggle:', terrainAfterToggle);
        
        // Test shader mode (B key)
        console.log('\\n🔧 Testing shader mode...');
        await page.keyboard.press('b');
        await page.waitForTimeout(1000);
        
        const terrainAfterShader = await page.textContent('#terrainStatus');
        console.log('🌍 Terrain After Shader Mode:', terrainAfterShader);
        
        // Test wireframe mode (V key)
        console.log('\\n🔧 Testing wireframe mode...');
        await page.keyboard.press('v');
        await page.waitForTimeout(1000);
        
        const terrainAfterWireframe = await page.textContent('#terrainStatus');
        console.log('🌍 Terrain After Wireframe Mode:', terrainAfterWireframe);
        
        // Check if any WebGL errors occurred
        const webglErrors = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return ['No canvas found'];
            
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return ['WebGL not available'];
            
            const error = gl.getError();
            if (error !== gl.NO_ERROR) {
                return [`WebGL Error: ${error}`];
            }
            
            return ['WebGL OK'];
        });
        
        console.log('🖥️ WebGL Status:', webglErrors);
        
        // Test results summary
        console.log('\\n📊 TEST RESULTS SUMMARY:');
        console.log('=' .repeat(50));
        
        const results = {
            terrain: terrainStatus.includes('✅'),
            submarine: submarineStatus.includes('✅'),
            shaders: shaderStatus.includes('✅'),
            cobra: cobraStatus.includes('✅'),
            webgl: webglErrors[0] === 'WebGL OK'
        };
        
        Object.entries(results).forEach(([test, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${test.toUpperCase()}: ${passed ? 'PASS' : 'FAIL'}`);
        });
        
        const overallSuccess = Object.values(results).every(result => result);
        console.log('\\n' + '=' .repeat(50));
        console.log(`🏆 OVERALL TEST: ${overallSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
        
        // Keep browser open for manual inspection
        console.log('\\n👀 Browser will stay open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);
        
        return overallSuccess;
        
    } catch (error) {
        console.error('❌ Test execution failed:', error);
        return false;
    } finally {
        await browser.close();
    }
}

// Also test the main game
async function testMainGame() {
    console.log('\\n🎮 Testing main game with shader/Cobra fixes...');
    
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
        if (text.includes('terrain') || text.includes('shader') || text.includes('COBRA') || text.includes('submarine')) {
            console.log(`[${type.toUpperCase()}] ${text}`);
        }
    });
    
    try {
        // Load main game
        const mainGamePath = path.join(__dirname, 'index.html');
        console.log('📄 Loading main game:', mainGamePath);
        
        await page.goto(`file://${mainGamePath}`);
        
        // Wait for game to load
        await page.waitForTimeout(3000);
        
        // Start a quick scenario to initialize submarine
        console.log('🎯 Starting patrol mission...');
        await page.keyboard.press('F1'); // Patrol mission
        await page.waitForTimeout(2000);
        
        // Test terrain controls
        console.log('🔧 Testing terrain controls in main game...');
        await page.keyboard.press('b'); // Shader mode
        await page.waitForTimeout(1000);
        
        await page.keyboard.press('v'); // Wireframe mode
        await page.waitForTimeout(1000);
        
        await page.keyboard.press('t'); // Toggle terrain
        await page.waitForTimeout(1000);
        
        console.log('✅ Main game shader/Cobra test completed');
        
        // Keep open for inspection
        console.log('👀 Main game will stay open for 20 seconds...');
        await page.waitForTimeout(20000);
        
    } catch (error) {
        console.error('❌ Main game test failed:', error);
    } finally {
        await browser.close();
    }
}

// Run both tests
async function runAllTests() {
    const testResult = await testShaderAndCobra();
    await testMainGame();
    
    console.log('\\n🏁 All tests completed!');
    process.exit(testResult ? 0 : 1);
}

runAllTests().catch(console.error);