const { chromium } = require("playwright");

async function debugAbyssal() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE:', msg.text()));
    
    await page.goto("file://" + __dirname + "/index.html");
    await page.waitForTimeout(2000);
    
    console.log("🔍 Debugging abyssal plain calculation...");
    
    const results = await page.evaluate(() => {
        const ocean = window.oceanInstance;
        if (!ocean) return { error: "No ocean instance" };
        
        // Test abyssal plain position
        const x = 5000, z = 0;
        const province = ocean.getGeologicalProvince(x);
        
        let debug = {
            position: { x, z },
            province: province,
            provinceConfig: ocean.provinces.abyssal
        };
        
        try {
            // Step by step calculation
            const baseDepth = ocean.getProvinceBaseDepth(x, z, province);
            debug.baseDepth = baseDepth;
            
            // Direct call to getAbyssalPlainDepth
            const abyssalDepth = ocean.getAbyssalPlainDepth(x, z);
            debug.abyssalDepth = abyssalDepth;
            
            const tectonicEffect = ocean.getTectonicEffect(x, z);
            debug.tectonicEffect = tectonicEffect;
            
            const canyonDepth = ocean.getCanyonDepth(x, z);
            debug.canyonDepth = canyonDepth;
            
            const volcanicEffect = ocean.getVolcanicEffect(x, z);
            debug.volcanicEffect = volcanicEffect;
            
            const hydroEffect = ocean.getHydrothermalVentEffect(x, z);
            debug.hydroEffect = hydroEffect;
            
            const sedimentThickness = ocean.getSedimentThickness(x, z);
            debug.sedimentThickness = sedimentThickness;
            
            const roughness = ocean.getSeafloorRoughness(x, z);
            debug.roughness = roughness;
            
            const finalHeight = ocean.getTerrainHeight(x, z);
            debug.finalHeight = finalHeight;
            
            return debug;
        } catch (error) {
            debug.error = error.message;
            return debug;
        }
    });
    
    console.log("Abyssal plain breakdown:");
    console.log(JSON.stringify(results, null, 2));
    
    await browser.close();
}

debugAbyssal().catch(console.error);