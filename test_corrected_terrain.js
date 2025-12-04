const { chromium } = require("playwright");

async function testCorrectedTerrain() {
    console.log("🗺️  Testing CORRECTED 75/25 terrain system...");
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 200    
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log("📱 Loading game with corrected terrain system...");
        await page.goto("file://" + __dirname + "/index.html");
        await page.waitForTimeout(4000);
        
        // Test 1: Verify 75/25 split
        console.log("\n🎯 TEST 1: Verifying 75/25 Zone Distribution");
        const zoneTests = [
            { name: "Plains West Edge", x: -40000, z: 0, expectedZone: "plains", expectedRange: [100, 800] },
            { name: "Plains Center", x: -20000, z: -15000, expectedZone: "plains", expectedRange: [100, 800] },
            { name: "Plains East Edge", x: -5000, z: 10000, expectedZone: "plains", expectedRange: [100, 800] },
            { name: "Continental Slope", x: 15000, z: 5000, expectedZone: "slope", expectedRange: [500, 6000] },
            { name: "Abyssal Plain", x: 35000, z: 0, expectedZone: "abyssal", expectedRange: [5900, 6100] },
            { name: "Ocean Trench", x: 45000, z: 0, expectedZone: "trench", expectedRange: [6000, 13000] }
        ];
        
        for (const test of zoneTests) {
            const depthData = await page.evaluate((position) => {
                const ocean = window.oceanInstance;
                if (ocean && ocean.getTerrainHeight) {
                    const height = ocean.getTerrainHeight(position.x, position.z);
                    return {
                        depth: Math.abs(height).toFixed(1),
                        height: height.toFixed(1)
                    };
                }
                return null;
            }, test);
            
            if (depthData) {
                const depth = parseFloat(depthData.depth);
                const inRange = depth >= test.expectedRange[0] && depth <= test.expectedRange[1];
                console.log(`   ${test.name}: ${depthData.depth}m ${inRange ? '✅' : '❌'} (expected ${test.expectedRange[0]}-${test.expectedRange[1]}m)`);
            }
        }
        
        // Test 2: Check for considerable rises/falls in plains
        console.log("\n🏔️  TEST 2: Plains Topographic Variation (Considerable Rises/Falls)");
        const plainsVariation = [];
        
        for (let i = 0; i < 20; i++) {
            const x = -40000 + (i * 3000); // Sample across plains area
            const z = -20000 + (Math.random() * 40000);
            
            const depthData = await page.evaluate((position) => {
                const ocean = window.oceanInstance;
                if (ocean && ocean.getTerrainHeight) {
                    const height = ocean.getTerrainHeight(position.x, position.z);
                    return Math.abs(height);
                }
                return null;
            }, { x, z });
            
            if (depthData) {
                plainsVariation.push(depthData);
            }
        }
        
        const minDepth = Math.min(...plainsVariation);
        const maxDepth = Math.max(...plainsVariation);
        const variation = maxDepth - minDepth;
        
        console.log(`   Plains depth range: ${minDepth.toFixed(1)}m to ${maxDepth.toFixed(1)}m`);
        console.log(`   Total variation: ${variation.toFixed(1)}m ${variation > 300 ? '✅' : '❌'} (should have considerable rises/falls)`);
        
        // Test 3: Check for 3km deep canyons
        console.log("\n🏔️  TEST 3: 3km Deep Canyons in Plains");
        const canyonTests = [
            { x: -15000, z: 5000 },   // Canyon area 1
            { x: 5000, z: -10000 },   // Canyon area 2  
            { x: -5000, z: 15000 }    // Canyon area 3
        ];
        
        let foundDeepCanyon = false;
        for (const test of canyonTests) {
            const depthData = await page.evaluate((position) => {
                const ocean = window.oceanInstance;
                if (ocean && ocean.getTerrainHeight) {
                    const height = ocean.getTerrainHeight(position.x, position.z);
                    return Math.abs(height);
                }
                return null;
            }, test);
            
            if (depthData && depthData > 2500) {
                foundDeepCanyon = true;
                console.log(`   Found canyon: ${depthData.toFixed(1)}m deep at (${test.x/1000}km, ${test.z/1000}km) ✅`);
            }
        }
        
        if (!foundDeepCanyon) {
            console.log(`   ❌ No deep canyons found in test areas`);
        }
        
        // Test 4: Check abyssal plain flatness with rare seamounts
        console.log("\n🌊 TEST 4: Abyssal Plain Flatness + Vertiginous Seamounts");
        const abyssalTests = [];
        
        for (let i = 0; i < 15; i++) {
            const x = 25000 + (i * 2000); // Sample across abyssal area
            const z = -15000 + (Math.random() * 30000);
            
            const depthData = await page.evaluate((position) => {
                const ocean = window.oceanInstance;
                if (ocean && ocean.getTerrainHeight) {
                    const height = ocean.getTerrainHeight(position.x, position.z);
                    return Math.abs(height);
                }
                return null;
            }, { x, z });
            
            if (depthData) {
                abyssalTests.push(depthData);
            }
        }
        
        const abyssalMin = Math.min(...abyssalTests);
        const abyssalMax = Math.max(...abyssalTests);
        const abyssalVariation = abyssalMax - abyssalMin;
        
        console.log(`   Abyssal range: ${abyssalMin.toFixed(1)}m to ${abyssalMax.toFixed(1)}m`);
        console.log(`   Abyssal variation: ${abyssalVariation.toFixed(1)}m ${abyssalVariation < 200 ? '✅' : '❌'} (should be relatively flat)`);
        
        if (abyssalMin < 1000) {
            console.log(`   ✅ Found vertiginous seamount: ${abyssalMin.toFixed(1)}m depth`);
        }
        
        // Test 5: Check sheer cliff feature
        console.log("\n🧗 TEST 5: Specific Sheer Cliff Feature");
        const cliffTest = await page.evaluate(() => {
            const ocean = window.oceanInstance;
            if (ocean && ocean.getTerrainHeight) {
                // Test the cliff area (should be around x=0, transition point)
                const beforeCliff = ocean.getTerrainHeight(-2000, 0); // Plains side
                const inCliff = ocean.getTerrainHeight(0, 0);         // Cliff area
                const afterCliff = ocean.getTerrainHeight(2000, 0);   // Deep water side
                
                return {
                    before: Math.abs(beforeCliff).toFixed(1),
                    cliff: Math.abs(inCliff).toFixed(1), 
                    after: Math.abs(afterCliff).toFixed(1)
                };
            }
            return null;
        });
        
        if (cliffTest) {
            const cliffDrop = parseFloat(cliffTest.after) - parseFloat(cliffTest.before);
            console.log(`   Before cliff: ${cliffTest.before}m`);
            console.log(`   Cliff area: ${cliffTest.cliff}m`);
            console.log(`   After cliff: ${cliffTest.after}m`);
            console.log(`   Cliff drop: ${cliffDrop.toFixed(1)}m ${cliffDrop > 2000 ? '✅' : '❌'} (should be dramatic)`);
        }
        
        console.log("\n🔍 Browser open for manual terrain exploration...");
        console.log("   Navigate the corrected 75/25 terrain system!");
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

testCorrectedTerrain().catch(console.error);