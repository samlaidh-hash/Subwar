const { chromium } = require("playwright");

async function testBottomDepthIndicator() {
    console.log("🌊 Testing bottom depth indicator functionality...");
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 200    
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log("📱 Loading game...");
        await page.goto("file://" + __dirname + "/index.html");
        await page.waitForTimeout(3000);
        
        console.log("\n🎯 TEST: Bottom depth indicator functionality");
        
        // Test at multiple positions to see seabed depth changes
        const testPositions = [
            { name: "Starting Position", x: 0, z: 0 },
            { name: "Shallow Area", x: -2000, z: -2000 },
            { name: "Deep Area", x: 3000, z: 3000 },
            { name: "Canyon Area", x: 1000, z: -1500 }
        ];
        
        for (const pos of testPositions) {
            console.log(`\n📍 Testing at ${pos.name} (${pos.x}, ${pos.z}):`);
            
            // Move submarine to test position
            await page.evaluate((position) => {
                const sub = window.playerSubmarine();
                if (sub && sub.mesh) {
                    sub.mesh.position.x = position.x;
                    sub.mesh.position.z = position.z;
                    // Force depth bar update
                    sub.updateDepthBar();
                }
            }, pos);
            
            await page.waitForTimeout(500);
            
            // Check depth indicator data
            const depthData = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                const oceanInstance = window.oceanInstance;
                
                if (sub && sub.mesh && oceanInstance) {
                    const seabedHeight = oceanInstance.getSeabedHeight(sub.mesh.position.x, sub.mesh.position.z);
                    const calculatedSeabedDepth = Math.abs(300 - seabedHeight);
                    
                    // Get UI elements
                    const depthBottomElement = document.querySelector('.depth-bottom');
                    const bottomMarker = document.getElementById('bottomDepthMarker');
                    const depthCurrentElement = document.querySelector('.depth-current');
                    
                    return {
                        position: { x: sub.mesh.position.x.toFixed(0), z: sub.mesh.position.z.toFixed(0) },
                        seabedHeight: seabedHeight.toFixed(1),
                        calculatedDepth: calculatedSeabedDepth.toFixed(1),
                        displayedDepth: depthBottomElement ? depthBottomElement.textContent : 'N/A',
                        markerVisible: bottomMarker ? (bottomMarker.style.display !== 'none') : false,
                        markerPosition: bottomMarker ? bottomMarker.style.top : 'N/A',
                        currentDepth: depthCurrentElement ? depthCurrentElement.textContent : 'N/A'
                    };
                }
                return null;
            });
            
            if (depthData) {
                console.log(`   Position: (${depthData.position.x}, ${depthData.position.z})`);
                console.log(`   Seabed Height: ${depthData.seabedHeight}m`);
                console.log(`   Calculated Depth: ${depthData.calculatedDepth}m`);
                console.log(`   Displayed Depth: ${depthData.displayedDepth}`);
                console.log(`   Marker Visible: ${depthData.markerVisible}`);
                console.log(`   Marker Position: ${depthData.markerPosition}`);
                console.log(`   Current Depth: ${depthData.currentDepth}`);
                
                // Verify consistency
                const depthMatch = Math.abs(parseFloat(depthData.calculatedDepth) - parseFloat(depthData.displayedDepth.replace('m', ''))) < 1;
                console.log(`   ${depthMatch ? '✅' : '❌'} Depth calculation matches display`);
            }
        }
        
        console.log("\n🎮 Testing depth changes with E/Q keys:");
        
        // Test depth changes and marker behavior
        await page.keyboard.down('KeyE');
        await page.waitForTimeout(2000);
        await page.keyboard.up('KeyE');
        
        const afterDescent = await page.evaluate(() => {
            const depthCurrent = document.querySelector('.depth-current');
            const depthBottom = document.querySelector('.depth-bottom');
            const marker = document.getElementById('bottomDepthMarker');
            
            return {
                currentDepth: depthCurrent ? depthCurrent.textContent : 'N/A',
                bottomDepth: depthBottom ? depthBottom.textContent : 'N/A',
                markerTop: marker ? marker.style.top : 'N/A'
            };
        });
        
        console.log(`   After descent: Current=${afterDescent.currentDepth} | Bottom=${afterDescent.bottomDepth} | Marker=${afterDescent.markerTop}`);
        
        console.log("\n🔍 Browser open for manual observation...");
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

testBottomDepthIndicator().catch(console.error);