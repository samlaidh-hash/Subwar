const { chromium } = require("playwright");

async function testNoise() {
    console.log("🔊 Testing submarine noise signature changes...");
    
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
        
        // Set forward speed to generate some base noise
        await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub) {
                sub.currentThrust = 15;
                sub.targetSpeed = 15;
                sub.speed = 15;
            }
        });
        
        const viewport = page.viewportSize();
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;
        
        // Test different maneuvers and observe noise changes
        const tests = [
            { name: "steady", mouseX: centerX, mouseY: centerY, duration: 2000, desc: "Steady forward - baseline noise" },
            { name: "pitch_up", mouseX: centerX, mouseY: centerY - 200, duration: 3000, desc: "Pitching up - should increase noise" },
            { name: "center_after_pitch", mouseX: centerX, mouseY: centerY, duration: 2000, desc: "Back to center - noise should decrease" },
            { name: "yaw_right", mouseX: centerX + 200, mouseY: centerY, duration: 3000, desc: "Yawing right - should increase noise" },
            { name: "back_to_steady", mouseX: centerX, mouseY: centerY, duration: 2000, desc: "Back to steady - noise should normalize" }
        ];
        
        for (const test of tests) {
            console.log(`\n🎯 ${test.name.toUpperCase()}: ${test.desc}`);
            
            // Set mouse position
            await page.mouse.move(test.mouseX, test.mouseY);
            
            // Monitor noise over the duration
            const startTime = Date.now();
            let maxNoise = 0;
            let minNoise = 999;
            
            while (Date.now() - startTime < test.duration) {
                const noiseData = await page.evaluate(() => {
                    const sub = window.playerSubmarine();
                    if (sub) {
                        return {
                            current: sub.sonarSignature.current.toFixed(1),
                            pitch: (sub.mesh.rotation.z * 180 / Math.PI).toFixed(1),
                            yaw: (sub.mesh.rotation.y * 180 / Math.PI).toFixed(1),
                            roll: (sub.mesh.rotation.x * 180 / Math.PI).toFixed(1),
                            speed: sub.speed.toFixed(1)
                        };
                    }
                    return null;
                });
                
                if (noiseData) {
                    const noise = parseFloat(noiseData.current);
                    maxNoise = Math.max(maxNoise, noise);
                    minNoise = Math.min(minNoise, noise);
                    
                    if ((Date.now() - startTime) % 1000 < 100) { // Log every ~1 second
                        console.log(`   Noise: ${noiseData.current}, Pitch: ${noiseData.pitch}°, Yaw: ${noiseData.yaw}°, Roll: ${noiseData.roll}°`);
                    }
                }
                
                await page.waitForTimeout(100);
            }
            
            console.log(`📊 ${test.name} Summary: Min noise: ${minNoise.toFixed(1)}, Max noise: ${maxNoise.toFixed(1)}, Range: ${(maxNoise - minNoise).toFixed(1)}`);
            
            // Analyze noise change
            if (test.name.includes("pitch") || test.name.includes("yaw")) {
                if (maxNoise - minNoise > 0.5) {
                    console.log("✅ Good: Noise increased during maneuvering");
                } else {
                    console.log("❌ Issue: No significant noise increase during maneuvering");
                }
            }
        }
        
        console.log("\n🔍 Browser open for manual testing...");
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

testNoise().catch(console.error);