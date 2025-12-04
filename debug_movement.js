const { chromium } = require("playwright");

async function debugMovement() {
    console.log("🔍 Debugging submarine nose direction and movement...");
    
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
        
        // Set a forward thrust to observe movement
        await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub) {
                sub.currentThrust = 10; // Set forward speed
                sub.targetSpeed = 10;
                sub.speed = 10;
            }
        });
        
        const viewport = page.viewportSize();
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;
        
        // Test different orientations and observe movement
        const tests = [
            { name: "level_forward", mouseX: centerX, mouseY: centerY, desc: "Level - should move in nose direction" },
            { name: "pitch_up", mouseX: centerX, mouseY: centerY - 150, desc: "Pitched up - should move up and forward" },
            { name: "yaw_right", mouseX: centerX + 150, mouseY: centerY, desc: "Yawed right - should move right and forward" }
        ];
        
        for (const test of tests) {
            console.log(`\n📍 ${test.name.toUpperCase()}: ${test.desc}`);
            
            // Set orientation
            await page.mouse.move(test.mouseX, test.mouseY);
            await page.waitForTimeout(2000);
            
            // Get initial position
            const initialState = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub && sub.mesh) {
                    return {
                        position: {
                            x: sub.mesh.position.x.toFixed(2),
                            y: sub.mesh.position.y.toFixed(2),
                            z: sub.mesh.position.z.toFixed(2)
                        },
                        rotation: {
                            pitch: (sub.mesh.rotation.z * 180 / Math.PI).toFixed(1) + "°",
                            yaw: (sub.mesh.rotation.y * 180 / Math.PI).toFixed(1) + "°",
                            roll: (sub.mesh.rotation.x * 180 / Math.PI).toFixed(1) + "°"
                        }
                    };
                }
                return null;
            });
            
            console.log(`🧭 Initial: Pos(${initialState.position.x}, ${initialState.position.y}, ${initialState.position.z})`);
            console.log(`📐 Rotation: Pitch=${initialState.rotation.pitch}, Yaw=${initialState.rotation.yaw}, Roll=${initialState.rotation.roll}`);
            
            // Wait for movement
            await page.waitForTimeout(3000);
            
            // Get final position
            const finalState = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub && sub.mesh) {
                    return {
                        position: {
                            x: sub.mesh.position.x.toFixed(2),
                            y: sub.mesh.position.y.toFixed(2),
                            z: sub.mesh.position.z.toFixed(2)
                        }
                    };
                }
                return null;
            });
            
            // Calculate movement direction
            const deltaX = parseFloat(finalState.position.x) - parseFloat(initialState.position.x);
            const deltaY = parseFloat(finalState.position.y) - parseFloat(initialState.position.y);
            const deltaZ = parseFloat(finalState.position.z) - parseFloat(initialState.position.z);
            
            console.log(`🎯 Final: Pos(${finalState.position.x}, ${finalState.position.y}, ${finalState.position.z})`);
            console.log(`➡️  Movement: ΔX=${deltaX.toFixed(2)}, ΔY=${deltaY.toFixed(2)}, ΔZ=${deltaZ.toFixed(2)}`);
            
            // Analyze movement direction
            const totalMovement = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);
            if (totalMovement > 0.1) {
                console.log(`📊 Movement analysis: Total distance=${totalMovement.toFixed(2)}`);
                console.log(`   Primary axis: ${Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > Math.abs(deltaZ) ? 'X' : Math.abs(deltaY) > Math.abs(deltaZ) ? 'Y' : 'Z'}`);
            } else {
                console.log("⚠️  No significant movement detected!");
            }
            
            await page.screenshot({ path: `movement_${test.name}.png` });
        }
        
        console.log("\n🔍 Browser open for manual observation...");
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

debugMovement().catch(console.error);