const { chromium } = require("playwright");
const fs = require('fs');

async function generateProperWireframe() {
    console.log("🎨 Generating PROPER wireframe terrain visualization (matching reference images)...");
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100    
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log("📱 Loading game with corrected terrain depths...");
        await page.goto("file://" + __dirname + "/index.html");
        await page.waitForTimeout(3000);
        
        // Test corrected depths
        console.log("🔍 Verifying corrected depth ranges...");
        const depthTest = await page.evaluate(() => {
            const ocean = window.oceanInstance;
            if (!ocean) return null;
            
            const testPoints = [
                { name: "Seamount", x: -25000, z: -10000 }, // Should be ~20m depth
                { name: "Hills", x: -15000, z: 5000 },      // Should be ~200m depth  
                { name: "Plains", x: -5000, z: 0 },         // Should be ~500m depth
                { name: "Slope", x: 15000, z: 0 },          // Should be 500-6000m
                { name: "Trench", x: 42000, z: 0 }          // Should be max 13000m
            ];
            
            const results = testPoints.map(point => {
                const height = ocean.getTerrainHeight(point.x, point.z);
                return {
                    name: point.name,
                    depth: Math.abs(height).toFixed(0)
                };
            });
            
            return results;
        });
        
        console.log("Depth verification:");
        depthTest.forEach(result => {
            console.log(`   ${result.name}: ${result.depth}m depth`);
        });
        
        // Generate wireframe that matches reference images
        console.log("\n🎨 Creating reference-style wireframe visualization...");
        
        const wireframeCanvas = await page.evaluate(() => {
            const ocean = window.oceanInstance;
            if (!ocean || !ocean.getTerrainHeight) {
                return null;
            }
            
            // Style 1: Clean white wireframe on light background (like Untitled.jpeg)
            const canvas1 = document.createElement('canvas');
            canvas1.width = 1200;
            canvas1.height = 1200;
            const ctx1 = canvas1.getContext('2d');
            
            // Light gray background
            ctx1.fillStyle = '#f0f0f0';
            ctx1.fillRect(0, 0, 1200, 1200);
            
            // White wireframe lines
            ctx1.strokeStyle = '#ffffff';
            ctx1.lineWidth = 1;
            
            const mapSize = 200; // Lower resolution for clean wireframe
            const terrainSize = ocean.terrainSize;
            const step = terrainSize / mapSize;
            
            console.log("Generating clean white wireframe grid...");
            
            // Draw horizontal grid lines
            for (let y = 0; y < mapSize; y += 4) { // Every 4th line for clarity
                ctx1.beginPath();
                for (let x = 0; x < mapSize; x++) {
                    const worldX = (x - mapSize/2) * step;
                    const worldZ = (y - mapSize/2) * step;
                    const height = ocean.getTerrainHeight(worldX, worldZ);
                    
                    // Convert to screen coordinates with perspective
                    const screenX = (x / mapSize) * 1200;
                    const screenY = (y / mapSize) * 1200 + (height / 100) * 0.5; // Slight height influence
                    
                    if (x === 0) {
                        ctx1.moveTo(screenX, screenY);
                    } else {
                        ctx1.lineTo(screenX, screenY);
                    }
                }
                ctx1.stroke();
            }
            
            // Draw vertical grid lines
            for (let x = 0; x < mapSize; x += 4) { // Every 4th line for clarity
                ctx1.beginPath();
                for (let y = 0; y < mapSize; y++) {
                    const worldX = (x - mapSize/2) * step;
                    const worldZ = (y - mapSize/2) * step;
                    const height = ocean.getTerrainHeight(worldX, worldZ);
                    
                    const screenX = (x / mapSize) * 1200;
                    const screenY = (y / mapSize) * 1200 + (height / 100) * 0.5;
                    
                    if (y === 0) {
                        ctx1.moveTo(screenX, screenY);
                    } else {
                        ctx1.lineTo(screenX, screenY);
                    }
                }
                ctx1.stroke();
            }
            
            // Add title
            ctx1.fillStyle = '#333333';
            ctx1.font = 'bold 24px Arial';
            ctx1.fillText('100km Terrain - White Wireframe Grid', 20, 40);
            
            return {
                whiteWireframe: canvas1.toDataURL('image/png')
            };
        });
        
        // Generate cyan wireframe on dark background (like untitled3.jpg)
        const cyanWireframe = await page.evaluate(() => {
            const ocean = window.oceanInstance;
            const canvas2 = document.createElement('canvas');
            canvas2.width = 1200;
            canvas2.height = 1200;
            const ctx2 = canvas2.getContext('2d');
            
            // Dark background
            ctx2.fillStyle = '#001122';
            ctx2.fillRect(0, 0, 1200, 1200);
            
            // Bright cyan wireframe
            ctx2.strokeStyle = '#00ffff';
            ctx2.lineWidth = 1;
            ctx2.shadowColor = '#00ffff';
            ctx2.shadowBlur = 2;
            
            const mapSize = 150;
            const terrainSize = ocean.terrainSize;
            const step = terrainSize / mapSize;
            
            console.log("Generating cyan wireframe with glow effect...");
            
            // Perspective projection for 3D effect
            const centerX = 600;
            const centerY = 400;
            const scale = 400;
            
            // Draw 3D perspective wireframe
            for (let y = 0; y < mapSize; y += 3) {
                ctx2.beginPath();
                for (let x = 0; x < mapSize; x++) {
                    const worldX = (x - mapSize/2) * step;
                    const worldZ = (y - mapSize/2) * step;
                    const height = ocean.getTerrainHeight(worldX, worldZ);
                    
                    // 3D perspective projection
                    const perspective = 0.8 + (y / mapSize) * 0.4;
                    const screenX = centerX + (x - mapSize/2) * scale / mapSize * perspective;
                    const screenY = centerY + (y - mapSize/2) * scale / mapSize * 0.5 + height * 0.02;
                    
                    if (x === 0) {
                        ctx2.moveTo(screenX, screenY);
                    } else {
                        ctx2.lineTo(screenX, screenY);
                    }
                }
                ctx2.stroke();
            }
            
            for (let x = 0; x < mapSize; x += 3) {
                ctx2.beginPath();
                for (let y = 0; y < mapSize; y++) {
                    const worldX = (x - mapSize/2) * step;
                    const worldZ = (y - mapSize/2) * step;
                    const height = ocean.getTerrainHeight(worldX, worldZ);
                    
                    const perspective = 0.8 + (y / mapSize) * 0.4;
                    const screenX = centerX + (x - mapSize/2) * scale / mapSize * perspective;
                    const screenY = centerY + (y - mapSize/2) * scale / mapSize * 0.5 + height * 0.02;
                    
                    if (y === 0) {
                        ctx2.moveTo(screenX, screenY);
                    } else {
                        ctx2.lineTo(screenX, screenY);
                    }
                }
                ctx2.stroke();
            }
            
            // Add retro-futuristic title
            ctx2.shadowBlur = 0;
            ctx2.fillStyle = '#00ffff';
            ctx2.font = 'bold 28px Arial';
            ctx2.fillText('SUB WAR 2060 - 100KM TERRAIN GRID', 20, 50);
            ctx2.font = '16px Arial';
            ctx2.fillText('Digital Wireframe Topography', 20, 80);
            
            return canvas2.toDataURL('image/png');
        });
        
        // Save both images
        console.log("💾 Saving wireframe visualizations...");
        
        // White wireframe
        const whiteBase64 = wireframeCanvas.whiteWireframe.replace(/^data:image\/png;base64,/, '');
        const whiteFilename = `terrain_white_wireframe_${Date.now()}.png`;
        const whiteFilepath = `D:\\Dropbox\\Free Games\\2025 RPG\\CLAUDE GAMES\\SW\\${whiteFilename}`;
        fs.writeFileSync(whiteFilepath, whiteBase64, 'base64');
        
        // Cyan wireframe  
        const cyanBase64 = cyanWireframe.replace(/^data:image\/png;base64,/, '');
        const cyanFilename = `terrain_cyan_wireframe_${Date.now()}.png`;
        const cyanFilepath = `D:\\Dropbox\\Free Games\\2025 RPG\\CLAUDE GAMES\\SW\\${cyanFilename}`;
        fs.writeFileSync(cyanFilepath, cyanBase64, 'base64');
        
        console.log("✅ PROPER wireframe visualizations saved:");
        console.log(`   📁 White wireframe: ${whiteFilename}`);
        console.log(`   📁 Cyan wireframe: ${cyanFilename}`);
        console.log("\n🎯 These match the reference image styles:");
        console.log("   - Clean white grid on light background");
        console.log("   - Bright cyan grid with glow on dark background");
        console.log("   - Geometric wireframe aesthetic (not color heightmaps!)");
        
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

generateProperWireframe().catch(console.error);