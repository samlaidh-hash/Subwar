const { chromium } = require("playwright");

async function testDepthBug() {
    console.log("🌊 Testing depth bug after knuckle creation...");
    
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
        
        // Move submarine to a specific depth using E key
        console.log("\n⬇️  Setting initial depth with E key (5 seconds)...");
        await page.keyboard.down('KeyE');
        await page.waitForTimeout(5000);
        await page.keyboard.up('KeyE');
        
        // Get baseline depth and position
        const beforeKnuckle = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub && sub.mesh) {
                return {
                    meshY: sub.mesh.position.y.toFixed(2),
                    calculatedDepth: Math.max(0, 300 - sub.mesh.position.y).toFixed(2),
                    depthProperty: sub.depth.toFixed(2),
                    knuckleCount: sub.knuckles.length
                };
            }
            return null;
        });
        
        console.log(`\n🏁 BEFORE KNUCKLE:`);
        console.log(`   Mesh Y Position: ${beforeKnuckle.meshY}`);
        console.log(`   Calculated Depth: ${beforeKnuckle.calculatedDepth}m`);
        console.log(`   Depth Property: ${beforeKnuckle.depthProperty}m`);
        console.log(`   Knuckles: ${beforeKnuckle.knuckleCount}`);
        
        // Force create a knuckle
        console.log(`\n🌪️  CREATING KNUCKLE...`);
        await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub) {
                sub.turnRate = 60; // High turn rate
                sub.speed = 25; // Adequate speed
                sub.createKnuckle(); // Force create knuckle
            }
        });
        
        await page.waitForTimeout(1000);
        
        // Check depth after knuckle creation
        const afterKnuckle = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub && sub.mesh) {
                return {
                    meshY: sub.mesh.position.y.toFixed(2),
                    calculatedDepth: Math.max(0, 300 - sub.mesh.position.y).toFixed(2),
                    depthProperty: sub.depth.toFixed(2),
                    knuckleCount: sub.knuckles.length,
                    speed: sub.speed.toFixed(2)
                };
            }
            return null;
        });
        
        console.log(`\n🏁 AFTER KNUCKLE:`);
        console.log(`   Mesh Y Position: ${afterKnuckle.meshY} (Change: ${(parseFloat(afterKnuckle.meshY) - parseFloat(beforeKnuckle.meshY)).toFixed(2)})`);
        console.log(`   Calculated Depth: ${afterKnuckle.calculatedDepth}m (Change: ${(parseFloat(afterKnuckle.calculatedDepth) - parseFloat(beforeKnuckle.calculatedDepth)).toFixed(2)}m)`);
        console.log(`   Depth Property: ${afterKnuckle.depthProperty}m`);
        console.log(`   Knuckles: ${afterKnuckle.knuckleCount}`);
        console.log(`   Speed: ${afterKnuckle.speed}kt (knuckles slow submarine)`);
        
        // Check for depth bug
        const depthBug = parseFloat(afterKnuckle.depthProperty) === 0 && parseFloat(beforeKnuckle.depthProperty) > 0;
        console.log(`\n🔍 DEPTH BUG ANALYSIS:`);
        console.log(`   ${depthBug ? '❌' : '✅'} Depth bug detected: ${depthBug}`);
        console.log(`   ${Math.abs(parseFloat(afterKnuckle.meshY) - parseFloat(beforeKnuckle.meshY)) < 1 ? '✅' : '❌'} Mesh position stable`);
        
        // Monitor depth over time
        console.log(`\n⏱️  MONITORING DEPTH OVER TIME (10 seconds):`);
        for (let i = 1; i <= 10; i++) {
            await page.waitForTimeout(1000);
            
            const timeData = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub && sub.mesh) {
                    return {
                        meshY: sub.mesh.position.y.toFixed(2),
                        depth: sub.depth.toFixed(2),
                        knuckles: sub.knuckles.length
                    };
                }
                return null;
            });
            
            console.log(`   Second ${i}: Depth=${timeData.depth}m | MeshY=${timeData.meshY} | Knuckles=${timeData.knuckles}`);
            
            if (parseFloat(timeData.depth) === 0) {
                console.log(`   ❌ Depth stuck at 0 detected at second ${i}!`);
                break;
            }
        }
        
        console.log("\n🔍 Browser open for manual observation...");
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

testDepthBug().catch(console.error);