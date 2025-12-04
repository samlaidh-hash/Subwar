const { chromium } = require("playwright");

async function debugTerrain() {
    console.log("🔧 Debugging terrain system...");
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100    
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Listen to console logs
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    
    try {
        console.log("📱 Loading index.html...");
        await page.goto("file://" + __dirname + "/index.html");
        await page.waitForTimeout(3000);
        
        console.log("🔍 Checking window.oceanInstance...");
        const oceanStatus = await page.evaluate(() => {
            return {
                hasOceanInstance: !!window.oceanInstance,
                hasGetTerrainHeight: !!(window.oceanInstance && window.oceanInstance.getTerrainHeight),
                hasGetSeabedHeight: !!(window.oceanInstance && window.oceanInstance.getSeabedHeight),
                oceanType: window.oceanInstance ? typeof window.oceanInstance : 'undefined'
            };
        });
        
        console.log("Ocean status:", oceanStatus);
        
        if (oceanStatus.hasGetTerrainHeight) {
            console.log("🧪 Testing terrain height function...");
            const testResult = await page.evaluate(() => {
                try {
                    const ocean = window.oceanInstance;
                    const height = ocean.getTerrainHeight(0, 0);
                    return {
                        success: true,
                        height: height,
                        type: typeof height,
                        isFinite: isFinite(height)
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error.message
                    };
                }
            });
            
            console.log("Terrain height test result:", testResult);
        }
        
        console.log("⏳ Keeping browser open for manual inspection...");
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

debugTerrain().catch(console.error);