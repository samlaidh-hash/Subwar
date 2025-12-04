const { chromium } = require("playwright");

async function testNewNoiseSystem() {
    console.log("🔊 Testing NEW simplified linear noise system...");
    
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
        
        const viewport = page.viewportSize();
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;
        
        // Test 1: Linear speed relationship
        console.log("\n🚀 TEST 1: LINEAR SPEED RELATIONSHIP");
        await page.mouse.move(centerX, centerY);
        
        const speeds = [0, 10, 20, 30, 40, 50, 60];
        for (const testSpeed of speeds) {
            await page.evaluate((speed) => {
                const sub = window.playerSubmarine();
                if (sub) {
                    sub.speed = speed;
                    sub.currentThrust = speed;
                    sub.targetSpeed = speed;
                }
            }, testSpeed);
            
            await page.waitForTimeout(500);
            
            const data = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub) {
                    return {
                        speed: sub.speed.toFixed(1),
                        noise: sub.sonarSignature.current.toFixed(1),
                        base: sub.sonarSignature.base.toFixed(1),
                        turnRate: sub.turnRate.toFixed(1)
                    };
                }
                return null;
            });
            
            const expectedLinearNoise = parseFloat(data.base) + (testSpeed * 0.1);
            const expectedSupercavNoise = testSpeed > 50 ? expectedLinearNoise + 15 : expectedLinearNoise;
            
            console.log(`   Speed ${testSpeed}kt: Noise=${data.noise} (Expected=${expectedSupercavNoise.toFixed(1)}) | Base=${data.base} | Turn=${data.turnRate}`);
            
            if (testSpeed > 50) {
                console.log(`      ${parseFloat(data.noise) > expectedLinearNoise + 10 ? '✅' : '❌'} Supercavitation jump detected`);
            }
        }
        
        // Test 2: Turn-based noise
        console.log("\n🌪️  TEST 2: TURN-BASED NOISE");
        await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub) {
                sub.speed = 25; // Moderate speed
                sub.currentThrust = 25;
            }
        });
        
        const turnTests = [
            { name: "no_turn", mouseX: centerX, mouseY: centerY, desc: "No turning" },
            { name: "light_turn", mouseX: centerX + 100, mouseY: centerY, desc: "Light turn" },
            { name: "heavy_turn", mouseX: centerX + 300, mouseY: centerY, desc: "Heavy turn" }
        ];
        
        for (const test of turnTests) {
            await page.mouse.move(test.mouseX, test.mouseY);
            await page.waitForTimeout(2000); // Allow turn rate to build up
            
            const data = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub) {
                    return {
                        noise: sub.sonarSignature.current.toFixed(1),
                        turnRate: sub.turnRate.toFixed(1),
                        speed: sub.speed.toFixed(1)
                    };
                }
                return null;
            });
            
            console.log(`   ${test.desc}: Noise=${data.noise} | TurnRate=${data.turnRate} | Speed=${data.speed}kt`);
        }
        
        // Test 3: Knuckle noise masking
        console.log("\n🌊 TEST 3: KNUCKLE NOISE MASKING");
        await page.mouse.move(centerX, centerY);
        await page.waitForTimeout(1000);
        
        // Get baseline noise
        const beforeKnuckle = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub) {
                sub.speed = 30; // Set moderate speed
                return {
                    noise: sub.sonarSignature.current.toFixed(1),
                    knuckleCount: sub.knuckles.length
                };
            }
            return null;
        });
        
        console.log(`   Before knuckle: Noise=${beforeKnuckle.noise} | Knuckles=${beforeKnuckle.knuckleCount}`);
        
        // Force create a knuckle by simulating high turn rate
        await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub) {
                sub.turnRate = 60; // High turn rate to trigger knuckle
                sub.speed = 25; // Adequate speed
                sub.createKnuckle(); // Force create knuckle
            }
        });
        
        await page.waitForTimeout(500);
        
        const afterKnuckle = await page.evaluate(() => {
            const sub = window.playerSubmarine();
            if (sub) {
                return {
                    noise: sub.sonarSignature.current.toFixed(1),
                    knuckleCount: sub.knuckles.length,
                    knuckleReduction: sub.knuckleNoiseReduction.toFixed(2)
                };
            }
            return null;
        });
        
        console.log(`   After knuckle: Noise=${afterKnuckle.noise} | Knuckles=${afterKnuckle.knuckleCount} | Reduction=${afterKnuckle.knuckleReduction}`);
        console.log(`   ${parseFloat(afterKnuckle.noise) < parseFloat(beforeKnuckle.noise) ? '✅' : '❌'} Noise reduction working`);
        
        console.log("\n🔍 Browser open for manual observation...");
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

testNewNoiseSystem().catch(console.error);