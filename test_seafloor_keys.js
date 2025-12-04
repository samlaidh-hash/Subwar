// Test seafloor fixes with correct key combinations
const { chromium } = require('playwright');
const path = require('path');

async function testSeafloorFixes() {
    console.log('🔧 TESTING SEAFLOOR FIXES');
    console.log('=' .repeat(40));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    
    const page = await browser.newPage();
    
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('terrain') || text.includes('key') || text.includes('mode') || text.includes('seafloor')) {
            console.log(`[LOG] ${text}`);
        }
    });
    
    try {
        // Load main game
        const mainPath = path.join(__dirname, 'index.html');
        await page.goto(`file://${mainPath}`);
        await page.waitForTimeout(5000);
        
        console.log('\\n🎮 Starting scenario...');
        await page.keyboard.press('F1'); // Start patrol mission
        await page.waitForTimeout(3000);
        
        console.log('\\n🔧 Testing B key (seafloor mode)...');
        await page.keyboard.press('b');
        await page.waitForTimeout(2000);
        
        console.log('\\n🔧 Testing T key (wireframe mode)...');
        await page.keyboard.press('t');
        await page.waitForTimeout(2000);
        
        console.log('\\n🔧 Testing B key again (back to seafloor)...');
        await page.keyboard.press('b');
        await page.waitForTimeout(2000);
        
        // Check terrain status
        const terrainInfo = await page.evaluate(() => {
            if (!window.simpleTerrain) return { error: 'No terrain' };
            
            return {
                exists: true,
                visible: window.simpleTerrain.isVisible,
                wireframe: window.simpleTerrain.wireframeMode,
                children: window.simpleTerrain.terrainGroup?.children?.length || 0,
                hasSeafloor: window.simpleTerrain.terrainGroup?.children?.some(child => 
                    child.material?.color?.getHex() === 0x8B7355) || false
            };
        });
        
        console.log('\\n📊 Final Terrain Status:', terrainInfo);
        
        console.log('\\n✅ Test completed! Check browser for:');
        console.log('- Brown sandy seafloor (main surface)');
        console.log('- Gray rock outcrops');
        console.log('- Brown mounds and trenches');
        console.log('- B key = Seafloor mode');
        console.log('- T key = Wireframe mode');
        
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

testSeafloorFixes();