const { chromium } = require("playwright");

async function testMouseMovement() {
    console.log("🎮 Testing mouse movement behavior...");
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500    
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
        
        // Test mouse movements
        const tests = [
            { name: "center", x: centerX, y: centerY, desc: "Center - should be level" },
            { name: "right", x: centerX + 300, y: centerY, desc: "Right - should turn right continuously" },
            { name: "back_center", x: centerX, y: centerY, desc: "Back to center - should stop turning" },
            { name: "up", x: centerX, y: centerY - 200, desc: "Up - should pitch up continuously" },
            { name: "center_final", x: centerX, y: centerY, desc: "Final center - should level out" }
        ];
        
        for (const test of tests) {
            console.log(`📍 ${test.name}: ${test.desc}`);
            await page.mouse.move(test.x, test.y);
            await page.waitForTimeout(2000);
            await page.screenshot({ path: `mouse_${test.name}.png` });
            
            const info = await page.evaluate(() => {
                const sub = window.playerSubmarine && window.playerSubmarine();
                if (sub && sub.mesh) {
                    return {
                        pitch: (sub.mesh.rotation.x * 180 / Math.PI).toFixed(1) + "°",
                        yaw: (sub.mesh.rotation.y * 180 / Math.PI).toFixed(1) + "°",
                        roll: (sub.mesh.rotation.z * 180 / Math.PI).toFixed(1) + "°",
                        mouseX: sub.maneuverIcon.x.toFixed(3),
                        mouseY: sub.maneuverIcon.y.toFixed(3)
                    };
                }
                return null;
            });
            
            if (info) {
                console.log(`🔍 Pitch=${info.pitch}, Yaw=${info.yaw}, Roll=${info.roll}`);
                console.log(`🖱️  Mouse X=${info.mouseX}, Y=${info.mouseY}`);
            }
        }
        
        console.log("🔍 Browser open for manual testing...");
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

testMouseMovement().catch(console.error);
