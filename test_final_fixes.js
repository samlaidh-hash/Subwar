// Final test to verify terrain shaders and COBRA model are working
const { chromium } = require('playwright');
const path = require('path');

async function testFinalFixes() {
    console.log('🔧 TESTING FINAL TERRAIN & COBRA FIXES');
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
    
    // Enable console logging
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        console.log(`[${type.toUpperCase()}] ${text}`);
    });
    
    try {
        // Test 1: Quick Test Page
        console.log('\\n🧪 TEST 1: Quick Test Page');
        console.log('-' .repeat(30));
        
        const quickTestPath = path.join(__dirname, 'quick_test.html');
        await page.goto(`file://${quickTestPath}`);
        await page.waitForTimeout(3000);
        
        const quickStatus = await page.textContent('#status');
        console.log('📊 Quick Test Status:', quickStatus);
        
        // Test B key in quick test
        console.log('🔧 Testing B key (shader mode)...');
        await page.keyboard.press('b');
        await page.waitForTimeout(1000);
        
        const afterB = await page.textContent('#status');
        console.log('📊 After B key:', afterB);
        
        // Test V key (wireframe)
        console.log('🔧 Testing V key (wireframe mode)...');
        await page.keyboard.press('v');
        await page.waitForTimeout(1000);
        
        const afterV = await page.textContent('#status');
        console.log('📊 After V key:', afterV);
        
        console.log('✅ Quick test completed');
        
        // Test 2: Main Game
        console.log('\\n🎮 TEST 2: Main Game');
        console.log('-' .repeat(30));
        
        const mainGamePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${mainGamePath}`);
        await page.waitForTimeout(5000); // Allow time for terrain to initialize
        
        // Check if terrain initialized
        const terrainExists = await page.evaluate(() => {
            return {
                simpleTerrain: !!window.simpleTerrain,
                isVisible: window.simpleTerrain ? window.simpleTerrain.isVisible : false,
                wireframeMode: window.simpleTerrain ? window.simpleTerrain.wireframeMode : null,
                scene: !!window.gameState?.scene,
                camera: !!window.gameState?.camera
            };
        });
        
        console.log('🌍 Main Game Terrain Status:', terrainExists);
        
        // Start a scenario to test submarine
        console.log('🎯 Starting patrol mission (F1)...');
        await page.keyboard.press('F1');
        await page.waitForTimeout(3000);
        
        // Check submarine after scenario start
        const submarineStatus = await page.evaluate(() => {
            return {
                playerSubmarine: !!window.playerSubmarine,
                submarineClass: window.playerSubmarine ? window.playerSubmarine.submarineClass : null,
                mesh: !!window.playerSubmarine?.mesh,
                children: window.playerSubmarine?.mesh ? window.playerSubmarine.mesh.children.length : 0
            };
        });
        
        console.log('🚢 Submarine Status:', submarineStatus);
        
        // Test terrain controls in main game
        console.log('🔧 Testing terrain controls in main game...');
        
        // Test B key
        await page.keyboard.press('b');
        await page.waitForTimeout(1000);
        console.log('✅ B key pressed (shader mode)');
        
        // Test V key  
        await page.keyboard.press('v');
        await page.waitForTimeout(1000);
        console.log('✅ V key pressed (wireframe mode)');
        
        // Test T key
        await page.keyboard.press('t');
        await page.waitForTimeout(1000);
        console.log('✅ T key pressed (toggle terrain)');
        
        // Final status check
        const finalStatus = await page.evaluate(() => {
            return {
                terrainVisible: window.simpleTerrain ? window.simpleTerrain.isVisible : false,
                terrainMode: window.simpleTerrain ? (window.simpleTerrain.wireframeMode ? 'Wireframe' : 'Shaded') : 'Unknown',
                submarineClass: window.playerSubmarine ? window.playerSubmarine.submarineClass : 'None'
            };
        });
        
        console.log('\\n📊 FINAL STATUS:', finalStatus);
        
        // Results
        console.log('\\n🏆 TEST RESULTS:');
        console.log('=' .repeat(50));
        
        const results = {
            quickTestTerrain: quickStatus.includes('Terrain'),
            quickTestSubmarine: quickStatus.includes('Submarine'),
            mainGameTerrain: terrainExists.simpleTerrain,
            mainGameSubmarine: submarineStatus.submarineClass === 'COBRA',
            bKeyWorking: afterB.includes('Shader'),
            vKeyWorking: afterV.includes('Wireframe')
        };
        
        Object.entries(results).forEach(([test, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
        });
        
        const overallSuccess = Object.values(results).every(result => result);
        console.log('\\n' + '=' .repeat(50));
        console.log(`🏆 OVERALL: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
        
        if (overallSuccess) {
            console.log('\\n🎉 SUCCESS! Both terrain shaders and COBRA model should now be visible!');
        } else {
            console.log('\\n⚠️ Some issues remain. Check the detailed results above.');
        }
        
        // Keep browser open for manual verification
        console.log('\\n👀 Keeping browser open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);
        
        return overallSuccess;
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        return false;
    } finally {
        await browser.close();
    }
}

testFinalFixes().then(success => {
    console.log(`\\n🏁 Test completed with ${success ? 'SUCCESS' : 'FAILURES'}`);
    process.exit(success ? 0 : 1);
}).catch(console.error);