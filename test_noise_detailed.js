const { chromium } = require("playwright");

async function testNoiseDetailed() {
    console.log("🔊 Testing detailed noise signature analysis...");
    
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
        
        // Set forward speed
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
        
        console.log("\n🎯 STEADY STATE (5 seconds):");
        await page.mouse.move(centerX, centerY);
        
        for (let i = 0; i < 5; i++) {
            await page.waitForTimeout(1000);
            const data = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub) {
                    // Access the modifiers object directly
                    const modifiers = {
                        speed: 0,
                        acceleration: 0,
                        maneuvering: 0,
                        dragTurn: 0,
                        weaponsFire: 0,
                        torpedoLaunch: 0,
                        sonarPing: 0,
                        depthChange: 0,
                        surfacePenalty: 0,
                        cavitation: 0
                    };
                    
                    // Recalculate current modifiers
                    const currentSpeed = Math.abs(sub.speed);
                    if (currentSpeed > 20) {
                        const excessSpeed = currentSpeed - 20;
                        modifiers.speed = (excessSpeed / 10) * sub.sonarSignature.classModifiers.speedMultiplier;
                    }
                    
                    return {
                        totalNoise: sub.sonarSignature.current.toFixed(1),
                        baseNoise: sub.sonarSignature.base.toFixed(1),
                        speed: sub.speed.toFixed(1),
                        pitch: (sub.mesh.rotation.z * 180 / Math.PI).toFixed(1),
                        yaw: (sub.mesh.rotation.y * 180 / Math.PI).toFixed(1),
                        roll: (sub.mesh.rotation.x * 180 / Math.PI).toFixed(1),
                        speedModifier: modifiers.speed.toFixed(1)
                    };
                }
                return null;
            });
            
            if (data) {
                console.log(`   Second ${i+1}: Noise=${data.totalNoise} (base=${data.baseNoise}, speed+${data.speedModifier}) | Angles: P=${data.pitch}° Y=${data.yaw}° R=${data.roll}°`);
            }
        }
        
        console.log("\n🎯 PITCHING UP (3 seconds):");
        await page.mouse.move(centerX, centerY - 200);
        
        for (let i = 0; i < 3; i++) {
            await page.waitForTimeout(1000);
            const data = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub) {
                    return {
                        totalNoise: sub.sonarSignature.current.toFixed(1),
                        baseNoise: sub.sonarSignature.base.toFixed(1),
                        pitch: (sub.mesh.rotation.z * 180 / Math.PI).toFixed(1),
                        yaw: (sub.mesh.rotation.y * 180 / Math.PI).toFixed(1),
                        roll: (sub.mesh.rotation.x * 180 / Math.PI).toFixed(1)
                    };
                }
                return null;
            });
            
            if (data) {
                console.log(`   Second ${i+1}: Noise=${data.totalNoise} (base=${data.baseNoise}) | Angles: P=${data.pitch}° Y=${data.yaw}° R=${data.roll}°`);
            }
        }
        
        console.log("\n🎯 BACK TO CENTER (5 seconds):");
        await page.mouse.move(centerX, centerY);
        
        for (let i = 0; i < 5; i++) {
            await page.waitForTimeout(1000);
            const data = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub) {
                    return {
                        totalNoise: sub.sonarSignature.current.toFixed(1),
                        baseNoise: sub.sonarSignature.base.toFixed(1),
                        pitch: (sub.mesh.rotation.z * 180 / Math.PI).toFixed(1),
                        yaw: (sub.mesh.rotation.y * 180 / Math.PI).toFixed(1),
                        roll: (sub.mesh.rotation.x * 180 / Math.PI).toFixed(1)
                    };
                }
                return null;
            });
            
            if (data) {
                console.log(`   Second ${i+1}: Noise=${data.totalNoise} (base=${data.baseNoise}) | Angles: P=${data.pitch}° Y=${data.yaw}° R=${data.roll}°`);
            }
        }
        
        console.log("\n🔍 Browser open for manual observation...");
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

testNoiseDetailed().catch(console.error);