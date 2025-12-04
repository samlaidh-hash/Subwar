const { chromium } = require("playwright");

async function testRealBathymetry() {
    console.log("🌊 Testing REAL BATHYMETRY terrain system...");
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 200    
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    // Listen to console logs
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    
    try {
        console.log("📱 Loading game with real bathymetry terrain...");
        await page.goto("file://" + __dirname + "/index.html");
        await page.waitForTimeout(5000); // Give time for bathymetry to load
        
        console.log("🧪 Testing real bathymetry terrain heights...");
        
        const terrainTests = [
            { name: "Northwest Corner", x: -40000, z: -40000 },
            { name: "North Center", x: 0, z: -40000 },
            { name: "Northeast Corner", x: 40000, z: -40000 },
            { name: "West Center", x: -40000, z: 0 },
            { name: "CENTER", x: 0, z: 0 },
            { name: "East Center", x: 40000, z: 0 },
            { name: "Southwest Corner", x: -40000, z: 40000 },
            { name: "South Center", x: 0, z: 40000 },
            { name: "Southeast Corner", x: 40000, z: 40000 }
        ];
        
        console.log("\\n🗺️  REAL BATHYMETRY TERRAIN TEST:");
        
        for (const test of terrainTests) {
            const result = await page.evaluate((pos) => {
                const ocean = window.oceanInstance;
                if (ocean && ocean.getTerrainHeight) {
                    const height = ocean.getTerrainHeight(pos.x, pos.z);
                    return {
                        depth: Math.abs(height).toFixed(1),
                        height: height.toFixed(1),
                        isFinite: isFinite(height)
                    };
                }
                return null;
            }, test);
            
            if (result) {
                console.log(`   ${test.name}: ${result.depth}m deep ${result.isFinite ? '✅' : '❌'} (${result.height}m)`);
            } else {
                console.log(`   ${test.name}: ❌ No terrain data`);
            }
        }
        
        // Test terrain variation
        console.log("\\n📊 TERRAIN VARIATION ANALYSIS:");
        const depths = [];
        for (const test of terrainTests) {
            const result = await page.evaluate((pos) => {
                const ocean = window.oceanInstance;
                if (ocean && ocean.getTerrainHeight) {
                    return Math.abs(ocean.getTerrainHeight(pos.x, pos.z));
                }
                return null;
            }, test);
            
            if (result && isFinite(result)) {
                depths.push(result);
            }
        }
        
        if (depths.length > 0) {
            const minDepth = Math.min(...depths);
            const maxDepth = Math.max(...depths);
            const avgDepth = depths.reduce((a, b) => a + b) / depths.length;
            
            console.log(`   Depth Range: ${minDepth.toFixed(1)}m to ${maxDepth.toFixed(1)}m`);
            console.log(`   Average Depth: ${avgDepth.toFixed(1)}m`);
            console.log(`   Total Variation: ${(maxDepth - minDepth).toFixed(1)}m`);
            console.log(`   Terrain Complexity: ${depths.length > 0 ? '✅ Realistic' : '❌ Too uniform'}`);
        }
        
        // Check bathymetry loading status
        const loadingStatus = await page.evaluate(() => {
            const ocean = window.oceanInstance;
            if (ocean && ocean.bathymetryTerrain) {
                return {
                    loaded: ocean.bathymetryTerrain.loaded,
                    hasData: !!ocean.bathymetryTerrain.heightmapData,
                    imageSize: ocean.bathymetryTerrain.heightmapData ? 
                        `${ocean.bathymetryTerrain.heightmapData.width}x${ocean.bathymetryTerrain.heightmapData.height}` : 'none'
                };
            }
            return null;
        });
        
        console.log("\\n📡 BATHYMETRY LOADING STATUS:");
        if (loadingStatus) {
            console.log(`   Data Loaded: ${loadingStatus.loaded ? '✅' : '❌'}`);
            console.log(`   Has Heightmap: ${loadingStatus.hasData ? '✅' : '❌'}`);
            console.log(`   Image Resolution: ${loadingStatus.imageSize}`);
        }
        
        console.log("\\n🔍 Browser open for manual terrain exploration...");
        console.log("   Navigate the real ocean floor terrain from Google Earth!");
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

testRealBathymetry().catch(console.error);