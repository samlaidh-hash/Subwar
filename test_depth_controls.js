const { chromium } = require("playwright");

async function testDepthControls() {
    console.log("🌊 Testing Q/E depth controls...");
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 300    
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log("📱 Loading game...");
        await page.goto("file://" + __dirname + "/index.html");
        await page.waitForTimeout(3000);
        
        // Get initial position and depth
        const initialData = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub && sub.mesh) {
                return {
                    position_y: sub.mesh.position.y.toFixed(2),
                    calculated_depth: Math.max(0, 300 - sub.mesh.position.y).toFixed(2),
                    depth_property: sub.depth.toFixed(2)
                };
            }
            return null;
        });
        
        console.log(`\n🏁 INITIAL STATE:`);
        console.log(`   Position Y: ${initialData.position_y}`);
        console.log(`   Calculated Depth: ${initialData.calculated_depth}m`);
        console.log(`   Depth Property: ${initialData.depth_property}m`);
        
        // Test Q key (decrease depth - go up)
        console.log(`\n⬆️  TESTING Q KEY (Go Up) - 3 seconds:`);
        await page.keyboard.down('KeyQ');
        
        for (let i = 1; i <= 3; i++) {
            await page.waitForTimeout(1000);
            const data = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub && sub.mesh) {
                    return {
                        position_y: sub.mesh.position.y.toFixed(2),
                        calculated_depth: Math.max(0, 300 - sub.mesh.position.y).toFixed(2),
                        depth_property: sub.depth.toFixed(2)
                    };
                }
                return null;
            });
            
            const deltaY = parseFloat(data.position_y) - parseFloat(initialData.position_y);
            console.log(`   Second ${i}: Y=${data.position_y} (Δ${deltaY.toFixed(2)}) | Depth=${data.calculated_depth}m | Property=${data.depth_property}m`);
        }
        
        await page.keyboard.up('KeyQ');
        await page.waitForTimeout(500);
        
        // Test E key (increase depth - go down)
        console.log(`\n⬇️  TESTING E KEY (Go Down) - 3 seconds:`);
        const beforeEData = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            return sub && sub.mesh ? {
                position_y: sub.mesh.position.y,
                depth: sub.depth
            } : null;
        });
        
        await page.keyboard.down('KeyE');
        
        for (let i = 1; i <= 3; i++) {
            await page.waitForTimeout(1000);
            const data = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub && sub.mesh) {
                    return {
                        position_y: sub.mesh.position.y.toFixed(2),
                        calculated_depth: Math.max(0, 300 - sub.mesh.position.y).toFixed(2),
                        depth_property: sub.depth.toFixed(2)
                    };
                }
                return null;
            });
            
            const deltaY = parseFloat(data.position_y) - beforeEData.position_y;
            console.log(`   Second ${i}: Y=${data.position_y} (Δ${deltaY.toFixed(2)}) | Depth=${data.calculated_depth}m | Property=${data.depth_property}m`);
        }
        
        await page.keyboard.up('KeyE');
        
        // Final state
        const finalData = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub && sub.mesh) {
                return {
                    position_y: sub.mesh.position.y.toFixed(2),
                    calculated_depth: Math.max(0, 300 - sub.mesh.position.y).toFixed(2),
                    depth_property: sub.depth.toFixed(2)
                };
            }
            return null;
        });
        
        console.log(`\n🏁 FINAL STATE:`);
        console.log(`   Position Y: ${finalData.position_y}`);
        console.log(`   Calculated Depth: ${finalData.calculated_depth}m`);
        console.log(`   Depth Property: ${finalData.depth_property}m`);
        
        const totalDeltaY = parseFloat(finalData.position_y) - parseFloat(initialData.position_y);
        console.log(`\n📊 SUMMARY:`);
        console.log(`   Total Y Change: ${totalDeltaY.toFixed(2)}`);
        console.log(`   QE Controls Working: ${Math.abs(totalDeltaY) > 1 ? '✅ YES' : '❌ NO'}`);
        
        console.log("\n🔍 Browser open for manual testing...");
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

testDepthControls().catch(console.error);