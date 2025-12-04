const { chromium } = require('playwright');

async function testGameVisual() {
    console.log('🎮 Starting visual game test with Playwright...');
    
    const browser = await chromium.launch({ 
        headless: false, // Show browser for debugging
        slowMo: 1000    // Slow down for observation
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        // Navigate to the game
        console.log('📱 Loading game...');
        await page.goto('file://' + __dirname + '/index.html');
        
        // Wait for game to load
        await page.waitForTimeout(3000);
        
        // Take initial screenshot
        await page.screenshot({ path: 'game_startup.png', fullPage: false });
        console.log('📸 Initial screenshot saved: game_startup.png');
        
        // Wait a bit more for initialization
        await page.waitForTimeout(2000);
        
        // Move mouse to create maneuver icon movement
        console.log('🖱️ Testing maneuver icon movement...');
        
        // Get viewport center
        const viewport = page.viewportSize();
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;
        
        // Move mouse to different positions to test maneuvering
        const positions = [
            { x: centerX, y: centerY, name: 'center' },
            { x: centerX + 200, y: centerY, name: 'right' },
            { x: centerX, y: centerY - 200, name: 'up' },
            { x: centerX - 200, y: centerY, name: 'left' },
            { x: centerX, y: centerY + 200, name: 'down' },
            { x: centerX, y: centerY, name: 'back_center' }
        ];
        
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            console.log(`📍 Moving to ${pos.name} position: (${pos.x}, ${pos.y})`);
            
            // Move mouse to position
            await page.mouse.move(pos.x, pos.y);
            
            // Wait for submarine to respond
            await page.waitForTimeout(2000);
            
            // Take screenshot
            const filename = `maneuver_${i}_${pos.name}.png`;
            await page.screenshot({ path: filename, fullPage: false });
            console.log(`📸 Screenshot saved: ${filename}`);
            
            // Also capture console logs to see pitch debug info
            const logs = await page.evaluate(() => {
                return window.debugLogs || [];
            });
            if (logs.length > 0) {
                console.log('🔍 Console logs:', logs.slice(-5)); // Last 5 logs
            }
        }
        
        // Test terrain visibility - move around the world
        console.log('🗺️ Testing terrain rendering...');
        
        // Press keys to move submarine around (if key controls exist)
        await page.keyboard.press('ArrowUp'); // Try to move forward
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'terrain_movement.png', fullPage: false });
        console.log('📸 Terrain screenshot saved: terrain_movement.png');
        
        // Check if we can see the scale by looking at console logs
        const terrainLogs = await page.evaluate(() => {
            // Look for any terrain-related console output
            return Array.from(document.querySelectorAll('*'))
                .map(el => el.textContent)
                .filter(text => text && (text.includes('terrain') || text.includes('chunk') || text.includes('LOD')))
                .slice(0, 10);
        });
        
        console.log('🌍 Terrain info found:', terrainLogs);
        
        // Get submarine position and terrain info if available
        const gameInfo = await page.evaluate(() => {
            const submarine = window.playerSubmarine && window.playerSubmarine();
            const ocean = window.oceanEnvironment && window.oceanEnvironment();
            
            return {
                submarinePosition: submarine ? {
                    x: submarine.mesh.position.x,
                    y: submarine.mesh.position.y, 
                    z: submarine.mesh.position.z,
                    rotation: {
                        x: submarine.mesh.rotation.x,
                        y: submarine.mesh.rotation.y,
                        z: submarine.mesh.rotation.z
                    }
                } : null,
                terrainSize: ocean ? ocean.terrainSize : null,
                activeChunks: ocean ? ocean.activeChunks.size : null
            };
        });
        
        console.log('🎯 Game state:', JSON.stringify(gameInfo, null, 2));
        
    } catch (error) {
        console.error('❌ Error during visual test:', error);
        await page.screenshot({ path: 'error_screenshot.png', fullPage: false });
    }
    
    // Keep browser open for manual inspection
    console.log('🔍 Browser staying open for manual inspection...');
    console.log('📝 Screenshots saved in current directory');
    console.log('⏱️ Waiting 30 seconds before closing...');
    
    await page.waitForTimeout(30000);
    
    await browser.close();
    console.log('✅ Visual test completed');
}

testGameVisual().catch(console.error);