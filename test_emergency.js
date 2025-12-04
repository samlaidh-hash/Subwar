// Test emergency terrain visibility
const { chromium } = require('playwright');
const path = require('path');

async function testEmergencyTerrain() {
    console.log('🚨 EMERGENCY TERRAIN TEST');
    console.log('=' .repeat(40));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    
    const page = await browser.newPage();
    
    page.on('console', msg => {
        console.log(`[LOG] ${msg.text()}`);
    });
    
    try {
        const testPath = path.join(__dirname, 'emergency_terrain_test.html');
        await page.goto(`file://${testPath}`);
        await page.waitForTimeout(3000);
        
        const status = await page.textContent('#status');
        console.log('Status:', status);
        
        // Test B key
        await page.keyboard.press('b');
        await page.waitForTimeout(1000);
        const afterB = await page.textContent('#status');
        console.log('After B:', afterB);
        
        // Test V key
        await page.keyboard.press('v');
        await page.waitForTimeout(1000);
        const afterV = await page.textContent('#status');
        console.log('After V:', afterV);
        
        console.log('\\n👀 Check browser for:');
        console.log('- ORANGE plane (large flat surface)');
        console.log('- RED cubes (5 markers)');
        console.log('- GREEN tower (tall vertical)');
        console.log('- CYAN grid (wireframe mode)');
        
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

testEmergencyTerrain();