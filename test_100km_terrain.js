const { chromium } = require("playwright");

async function test100kmTerrain() {
    console.log("🌍 Testing new 100km x 100km complex terrain system...");
    
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
        await page.waitForTimeout(5000); // Extra time for terrain generation
        
        // Test 1: Verify terrain system initialization
        console.log("\n🎯 TEST 1: Terrain System Initialization");
        const terrainInfo = await page.evaluate(() => {
            const ocean = window.oceanInstance;
            if (ocean) {
                return {
                    terrainSize: ocean.terrainSize,
                    chunkSize: ocean.chunkSize,
                    chunksPerSide: ocean.chunksPerSide,
                    maxViewDistance: ocean.maxViewDistance,
                    plainsDepth: ocean.plainsDepth,
                    canyonMaxDepth: ocean.canyonMaxDepth,
                    abyssalDepth: ocean.abyssalDepth,
                    trenchPrecipiceDepth: ocean.trenchPrecipiceDepth,
                    thermoclineDepth1: ocean.thermoclineDepth1,
                    thermoclineDepth2: ocean.thermoclineDepth2,
                    kelpAreasCount: ocean.kelpAreas ? ocean.kelpAreas.length : 0
                };
            }
            return null;
        });
        
        if (terrainInfo) {
            console.log(`   ✅ Terrain Size: ${terrainInfo.terrainSize / 1000}km x ${terrainInfo.terrainSize / 1000}km`);
            console.log(`   ✅ Chunk System: ${terrainInfo.chunkSize / 1000}km chunks, ${terrainInfo.chunksPerSide}x${terrainInfo.chunksPerSide} grid`);
            console.log(`   ✅ View Distance: ${terrainInfo.maxViewDistance / 1000}km`);
            console.log(`   ✅ Plains Depth: ${Math.abs(terrainInfo.plainsDepth)}m`);
            console.log(`   ✅ Canyon Max Depth: ${Math.abs(terrainInfo.canyonMaxDepth)}m`);
            console.log(`   ✅ Abyssal Depth: ${Math.abs(terrainInfo.abyssalDepth)}m`);
            console.log(`   ✅ Trench Max Depth: ${Math.abs(terrainInfo.trenchPrecipiceDepth)}m`);
            console.log(`   ✅ Thermoclines: ${Math.abs(terrainInfo.thermoclineDepth1)}m & ${Math.abs(terrainInfo.thermoclineDepth2)}m`);
            console.log(`   ✅ Kelp Areas Marked: ${terrainInfo.kelpAreasCount}`);
        }
        
        // Test 2: Sample terrain heights across different zones
        console.log("\n🗺️  TEST 2: Terrain Zone Sampling");
        const testPositions = [
            { name: "Mixed Terrain West", x: -20000, z: 0, expectedZone: "mixed" },
            { name: "Mixed Terrain Center", x: -10000, z: -15000, expectedZone: "mixed" },  
            { name: "Continental Slope", x: 10000, z: 0, expectedZone: "slope" },
            { name: "Ocean Trench", x: 40000, z: 0, expectedZone: "trench" },
            { name: "Trench Precipice", x: 45000, z: 0, expectedZone: "precipice" }
        ];
        
        for (const pos of testPositions) {
            const heightData = await page.evaluate((position) => {
                const ocean = window.oceanInstance;
                if (ocean && ocean.getTerrainHeight) {
                    const height = ocean.getTerrainHeight(position.x, position.z);
                    return {
                        x: position.x,
                        z: position.z,
                        height: height.toFixed(1),
                        depth: Math.abs(height).toFixed(1)
                    };
                }
                return null;
            }, pos);
            
            if (heightData) {
                console.log(`   ${pos.name}: (${heightData.x/1000}km, ${heightData.z/1000}km) → Depth: ${heightData.depth}m`);
                
                // Verify expected depth ranges
                const depth = parseFloat(heightData.depth);
                let validRange = false;
                switch (pos.expectedZone) {
                    case "mixed":
                        validRange = depth >= 50 && depth <= 3000; // Seamounts to canyons
                        break;
                    case "slope":
                        validRange = depth >= 500 && depth <= 6000; // Plains to abyssal
                        break;
                    case "trench":
                        validRange = depth >= 6000 && depth <= 8000; // Trench steps
                        break;
                    case "precipice":
                        validRange = depth >= 8000 && depth <= 13000; // Deep trench
                        break;
                }
                console.log(`     ${validRange ? '✅' : '❌'} Zone depth validation: ${pos.expectedZone}`);
            }
        }
        
        // Test 3: Visual wireframe rendering
        console.log("\n🎨 TEST 3: Digital Wireframe Rendering");
        const renderingInfo = await page.evaluate(() => {
            const scene = window.scene;
            if (scene) {
                let terrainChunks = 0;
                let thermoclines = 0;
                let wireframeLines = 0;
                
                scene.traverse((object) => {
                    if (object.name.includes('terrainChunk')) terrainChunks++;
                    if (object.name.includes('thermocline')) thermoclines++;
                    if (object.type === 'Line') wireframeLines++;
                });
                
                return {
                    terrainChunks: terrainChunks,
                    thermoclines: thermoclines,
                    wireframeLines: wireframeLines,
                    totalObjects: scene.children.length
                };
            }
            return null;
        });
        
        if (renderingInfo) {
            console.log(`   ✅ Terrain Chunks: ${renderingInfo.terrainChunks}`);
            console.log(`   ✅ Thermocline Layers: ${renderingInfo.thermoclines}`);
            console.log(`   ✅ Wireframe Lines: ${renderingInfo.wireframeLines}`);
            console.log(`   ✅ Total Scene Objects: ${renderingInfo.totalObjects}`);
        }
        
        // Test 4: Navigate to different terrain zones
        console.log("\n🚁 TEST 4: Navigation Through Terrain Zones");
        const navigationTests = [
            { name: "Mountains", x: -30000, z: -20000 },
            { name: "Canyon System", x: -10000, z: 5000 },
            { name: "Continental Slope", x: 20000, z: 10000 },
            { name: "Ocean Trench", x: 42000, z: -5000 }
        ];
        
        for (const nav of navigationTests) {
            console.log(`\n   📍 Navigating to ${nav.name} (${nav.x/1000}km, ${nav.z/1000}km):`);
            
            // Move submarine to position
            await page.evaluate((position) => {
                const sub = window.playerSubmarine();
                if (sub && sub.mesh) {
                    sub.mesh.position.x = position.x;
                    sub.mesh.position.z = position.z;
                    sub.mesh.position.y = 200; // Stay near surface
                }
                
                // Update camera to follow
                const camera = window.camera;
                if (camera) {
                    camera.position.x = position.x;
                    camera.position.z = position.z + 500;
                    camera.position.y = 400;
                    camera.lookAt(position.x, 200, position.z);
                }
            }, nav);
            
            await page.waitForTimeout(2000);
            
            // Check terrain around new position
            const localTerrain = await page.evaluate(() => {
                const sub = window.playerSubmarine();
                if (sub && sub.mesh) {
                    const ocean = window.oceanInstance;
                    if (ocean && ocean.getSeabedHeight) {
                        const seabedHeight = ocean.getSeabedHeight(sub.mesh.position.x, sub.mesh.position.z);
                        const seabedDepth = Math.abs(300 - seabedHeight);
                        return {
                            subPosition: { 
                                x: sub.mesh.position.x.toFixed(0), 
                                z: sub.mesh.position.z.toFixed(0) 
                            },
                            seabedDepth: seabedDepth.toFixed(1)
                        };
                    }
                }
                return null;
            });
            
            if (localTerrain) {
                console.log(`     Position: (${localTerrain.subPosition.x}, ${localTerrain.subPosition.z})`);
                console.log(`     Seabed Depth: ${localTerrain.seabedDepth}m`);
            }
        }
        
        console.log("\n🔍 Browser open for manual terrain exploration...");
        console.log("   Use WASD keys to navigate and explore the 100km terrain!");
        await page.waitForTimeout(20000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

test100kmTerrain().catch(console.error);