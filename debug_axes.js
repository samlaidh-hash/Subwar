const { chromium } = require("playwright");

async function debugAxes() {
    console.log("🔍 Debugging rotation axes assignment...");
    
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
        
        // Test each axis independently
        const axisTests = [
            { name: "center", x: centerX, y: centerY, desc: "CENTER - all rotations should be 0" },
            { name: "up_only", x: centerX, y: centerY - 200, desc: "UP ONLY - should change X rotation (pitch)" },
            { name: "right_only", x: centerX + 200, y: centerY, desc: "RIGHT ONLY - should change Y rotation (yaw)" }
        ];
        
        for (const test of axisTests) {
            console.log(`\n📍 ${test.name.toUpperCase()}: ${test.desc}`);
            await page.mouse.move(test.x, test.y);
            await page.waitForTimeout(2000);
            
            const rotations = await page.evaluate(() => {
                const sub = window.playerSubmarine && window.playerSubmarine();
                if (sub && sub.mesh) {
                    return {
                        x_rotation: (sub.mesh.rotation.x * 180 / Math.PI).toFixed(2),
                        y_rotation: (sub.mesh.rotation.y * 180 / Math.PI).toFixed(2),
                        z_rotation: (sub.mesh.rotation.z * 180 / Math.PI).toFixed(2),
                        mouse_x: sub.maneuverIcon.x.toFixed(3),
                        mouse_y: sub.maneuverIcon.y.toFixed(3)
                    };
                }
                return null;
            });
            
            if (rotations) {
                console.log(`📐 X rotation (pitch): ${rotations.x_rotation}°`);
                console.log(`📐 Y rotation (yaw): ${rotations.y_rotation}°`);
                console.log(`📐 Z rotation (roll): ${rotations.z_rotation}°`);
                console.log(`🖱️  Mouse normalized: (${rotations.mouse_x}, ${rotations.mouse_y})`);
                
                // Analyze what changed
                if (test.name === "up_only") {
                    if (Math.abs(parseFloat(rotations.x_rotation)) > 1) {
                        console.log("✅ CORRECT: UP movement changed X rotation (pitch)");
                    } else if (Math.abs(parseFloat(rotations.y_rotation)) > 1) {
                        console.log("❌ WRONG: UP movement changed Y rotation (should be pitch/X)");
                    } else if (Math.abs(parseFloat(rotations.z_rotation)) > 1) {
                        console.log("❌ WRONG: UP movement changed Z rotation (should be pitch/X)");
                    }
                } else if (test.name === "right_only") {
                    if (Math.abs(parseFloat(rotations.y_rotation)) > 1) {
                        console.log("✅ CORRECT: RIGHT movement changed Y rotation (yaw)");
                    } else if (Math.abs(parseFloat(rotations.x_rotation)) > 1) {
                        console.log("❌ WRONG: RIGHT movement changed X rotation (should be yaw/Y)");
                    } else if (Math.abs(parseFloat(rotations.z_rotation)) > 1) {
                        console.log("✅ EXPECTED: RIGHT movement changed Z rotation (banking)");
                    }
                }
            }
        }
        
        console.log("\n🔍 Browser open for manual verification...");
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

debugAxes().catch(console.error);