const { chromium } = require("playwright");

async function debugVolcanic() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE:', msg.text()));
    
    await page.goto("file://" + __dirname + "/index.html");
    await page.waitForTimeout(2000);
    
    console.log("🌋 Debugging volcanic effect calculation...");
    
    const results = await page.evaluate(() => {
        const ocean = window.oceanInstance;
        if (!ocean) return { error: "No ocean instance" };
        
        // Test abyssal plain position where we're getting unexpected volcanic effect
        const x = 5000, z = 0;
        
        let debug = {
            position: { x, z },
            volcanicFeatures: ocean.volcanicFeatures
        };
        
        try {
            // Check each seamount manually
            debug.seamountDistances = [];
            ocean.volcanicFeatures.seamountChain.forEach((seamount, i) => {
                const distance = Math.sqrt(
                    (x - seamount.position.x) ** 2 + 
                    (z - seamount.position.z) ** 2
                );
                debug.seamountDistances.push({
                    index: i,
                    seamount: seamount,
                    distance: distance,
                    withinDiameter: distance < seamount.diameter,
                    effect: distance < seamount.diameter ? 'ACTIVE' : 'none'
                });
            });
            
            // Check intraplate volcanoes too
            debug.intraplateDDistances = [];
            ocean.volcanicFeatures.intraplatevolcanoes.forEach((volcano, i) => {
                const distance = Math.sqrt(
                    (x - volcano.position.x) ** 2 + 
                    (z - volcano.position.z) ** 2
                );
                debug.intraplateDDistances.push({
                    index: i,
                    volcano: volcano,
                    distance: distance,
                    withinDiameter: distance < volcano.diameter,
                    effect: distance < volcano.diameter ? 'ACTIVE' : 'none'
                });
            });
            
            const volcanicEffect = ocean.getVolcanicEffect(x, z);
            debug.finalVolcanicEffect = volcanicEffect;
            
            return debug;
        } catch (error) {
            debug.error = error.message;
            return debug;
        }
    });
    
    console.log("Volcanic effect breakdown:");
    console.log(JSON.stringify(results, null, 2));
    
    await browser.close();
}

debugVolcanic().catch(console.error);