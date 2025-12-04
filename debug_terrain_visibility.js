// Debug terrain visibility issues
const { chromium } = require('playwright');
const path = require('path');

async function debugTerrainVisibility() {
    console.log('🔍 DEBUGGING TERRAIN VISIBILITY ISSUES');
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
    
    // Capture all console output
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        console.log(`[${type.toUpperCase()}] ${text}`);
    });
    
    try {
        // Test 1: Super Simple Test
        console.log('\\n🧪 TEST 1: Super Simple Terrain');
        console.log('-' .repeat(30));
        
        const simpleTestPath = path.join(__dirname, 'super_simple_test.html');
        await page.goto(`file://${simpleTestPath}`);
        await page.waitForTimeout(3000);
        
        const simpleStatus = await page.textContent('#status');
        console.log('📊 Simple Test Status:', simpleStatus);
        
        // Check if terrain is in scene
        const simpleSceneInfo = await page.evaluate(() => {
            if (!window.scene) return 'No scene';
            
            const terrain = window.scene.getObjectByName('simpleTerrain');
            return {
                sceneChildren: window.scene.children.length,
                terrainExists: !!terrain,
                terrainType: terrain ? terrain.type : 'none',
                terrainVisible: terrain ? terrain.visible : false,
                cameraPos: window.camera ? window.camera.position : 'no camera'
            };
        });
        
        console.log('🎬 Simple Scene Info:', simpleSceneInfo);
        
        // Test 2: Main Game
        console.log('\\n🎮 TEST 2: Main Game');
        console.log('-' .repeat(30));
        
        const mainGamePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${mainGamePath}`);
        await page.waitForTimeout(8000); // Wait longer for full initialization
        
        // Check main game terrain
        const mainGameInfo = await page.evaluate(() => {
            return {
                gameState: !!window.gameState,
                scene: !!window.gameState?.scene,
                camera: !!window.gameState?.camera,
                simpleTerrain: !!window.simpleTerrain,
                terrainVisible: window.simpleTerrain?.isVisible,
                terrainWireframe: window.simpleTerrain?.wireframeMode,
                sceneChildren: window.gameState?.scene?.children?.length || 0,
                cameraPosition: window.gameState?.camera?.position || 'no camera'
            };
        });
        
        console.log('🎮 Main Game Info:', mainGameInfo);
        
        // Try terrain controls in main game
        if (mainGameInfo.simpleTerrain) {
            console.log('\\n🔧 Testing terrain controls...');
            
            // Test B key
            await page.keyboard.press('b');
            await page.waitForTimeout(1000);
            console.log('✅ B key pressed');
            
            // Test V key
            await page.keyboard.press('v');
            await page.waitForTimeout(1000);
            console.log('✅ V key pressed');
            
            // Check terrain after controls
            const afterControls = await page.evaluate(() => {
                return {
                    terrainVisible: window.simpleTerrain?.isVisible,
                    terrainWireframe: window.simpleTerrain?.wireframeMode,
                    terrainChildren: window.simpleTerrain?.terrainGroup?.children?.length || 0
                };
            });
            
            console.log('🔧 After Controls:', afterControls);
        }
        
        // Debug scene contents
        const sceneDebug = await page.evaluate(() => {
            if (!window.gameState?.scene) return 'No scene available';
            
            const scene = window.gameState.scene;
            const children = scene.children.map(child => ({
                type: child.type,
                name: child.name || 'unnamed',
                visible: child.visible,
                position: child.position,
                hasGeometry: !!child.geometry,
                hasMaterial: !!child.material
            }));
            
            return {
                totalChildren: scene.children.length,
                childrenDetails: children
            };
        });
        
        console.log('\\n🎬 SCENE DEBUG:', JSON.stringify(sceneDebug, null, 2));
        
        // Summary
        console.log('\\n📊 SUMMARY:');
        console.log('=' .repeat(30));
        console.log(`Simple Test Terrain: ${simpleSceneInfo.terrainExists ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`Main Game Terrain: ${mainGameInfo.simpleTerrain ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`Main Game Visible: ${mainGameInfo.terrainVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
        
        if (!simpleSceneInfo.terrainExists && !mainGameInfo.simpleTerrain) {
            console.log('\\n🚨 CRITICAL: No terrain found in either test!');
            console.log('🔧 Possible issues: Material creation, geometry generation, or scene adding');
        } else if (mainGameInfo.simpleTerrain && !mainGameInfo.terrainVisible) {
            console.log('\\n⚠️ Terrain exists but not visible - check camera positioning or material');
        }
        
        // Keep browser open for inspection
        console.log('\\n👀 Browser staying open for 30 seconds for manual inspection...');
        console.log('🔍 Check if you can see any terrain in either test...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        await browser.close();
    }
}

debugTerrainVisibility().catch(console.error);