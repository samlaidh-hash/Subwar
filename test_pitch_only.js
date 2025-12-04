const { chromium } = require("playwright");

async function testPitchOnly() {
    console.log("🎮 Testing PURE vertical mouse movement...");
    
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
        
        const viewport = page.viewportSize();
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;
        
        console.log(`🎯 Center: (${centerX}, ${centerY})`);
        
        // Test PURE vertical movements only
        const tests = [
            { name: "start_center", x: centerX, y: centerY, desc: "Starting position - should be level" },
            { name: "pure_up", x: centerX, y: centerY - 200, desc: "PURE UP - should ONLY pitch up (no roll)" },
            { name: "center_after_up", x: centerX, y: centerY, desc: "Back to center after up" },
            { name: "pure_down", x: centerX, y: centerY + 200, desc: "PURE DOWN - should ONLY pitch down (no roll)" },
            { name: "final_center", x: centerX, y: centerY, desc: "Final center position" }
        ];
        
        for (const test of tests) {
            console.log(`\n📍 ${test.name}: ${test.desc}`);
            await page.mouse.move(test.x, test.y);
            await page.waitForTimeout(2000);
            
            const info = await page.evaluate(() => {
                const sub = window.playerSubmarine && window.playerSubmarine();
                if (sub && sub.mesh) {
                    return {
                        pitch: (sub.mesh.rotation.z * 180 / Math.PI).toFixed(1) + "°", // Z is pitch due to model rotation
                        yaw: (sub.mesh.rotation.y * 180 / Math.PI).toFixed(1) + "°",   // Y is still yaw
                        roll: (sub.mesh.rotation.x * 180 / Math.PI).toFixed(1) + "°",  // X is roll due to model rotation
                        mouseX: sub.maneuverIcon.x.toFixed(3),
                        mouseY: sub.maneuverIcon.y.toFixed(3)
                    };
                }
                return null;
            });
            
            if (info) {
                console.log(`🔍 Pitch=${info.pitch}, Yaw=${info.yaw}, Roll=${info.roll}`);
                console.log(`🖱️  Mouse X=${info.mouseX}, Y=${info.mouseY}`);
                
                // Check for unwanted roll during vertical movement
                if (test.name.includes("up") || test.name.includes("down")) {
                    const rollValue = parseFloat(info.roll.replace("°", ""));
                    if (Math.abs(rollValue) > 1) {
                        console.log(`⚠️  WARNING: Unwanted roll detected! Roll should be ~0° but is ${info.roll}`);
                    } else {
                        console.log(`✅ Good: Roll is minimal (${info.roll})`);
                    }
                }
            }
            
            await page.screenshot({ path: `pitch_test_${test.name}.png` });
        }
        
        console.log("\n🔍 Browser open for manual testing...");
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

testPitchOnly().catch(console.error);