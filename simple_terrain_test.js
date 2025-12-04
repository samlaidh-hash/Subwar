const { chromium } = require("playwright");

async function simpleTerrain() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE:', msg.text()));
    
    await page.goto("file://" + __dirname + "/index.html");
    await page.waitForTimeout(2000);
    
    console.log("🧪 Testing direct terrain function calls...");
    
    const results = await page.evaluate(() => {
        const ocean = window.oceanInstance;
        if (!ocean) return { error: "No ocean instance" };
        
        // Test a few key positions
        const tests = [
            { name: "Continental Shelf", x: -45000, z: 0 },
            { name: "Abyssal Plain", x: 5000, z: 0 },
            { name: "Ocean Trench", x: 42000, z: 0 }
        ];
        
        const results = [];
        for (const test of tests) {
            try {
                const height = ocean.getTerrainHeight(test.x, test.z);
                const province = ocean.getGeologicalProvince ? ocean.getGeologicalProvince(test.x) : 'unknown';
                results.push({
                    name: test.name,
                    x: test.x,
                    height: height,
                    depth: Math.abs(height),
                    province: province
                });
            } catch (error) {
                results.push({
                    name: test.name,
                    error: error.message
                });
            }
        }
        
        return results;
    });
    
    console.log("Results:", results);
    
    await browser.close();
}

simpleTerrain().catch(console.error);