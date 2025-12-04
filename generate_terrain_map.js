const { chromium } = require("playwright");
const fs = require('fs');

async function generateTerrainMap() {
    console.log("🗺️  Generating 100km x 100km terrain heightmap image...");
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100    
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log("📱 Loading game to access terrain system...");
        await page.goto("file://" + __dirname + "/index.html");
        await page.waitForTimeout(3000);
        
        // Generate heightmap data
        console.log("🎨 Generating terrain heightmap data...");
        const heightmapData = await page.evaluate(() => {
            const ocean = window.oceanInstance;
            if (!ocean || !ocean.getTerrainHeight) {
                return null;
            }
            
            const mapSize = 1000; // 1000x1000 pixel map
            const terrainSize = ocean.terrainSize; // 100km
            const step = terrainSize / mapSize; // Sample every 100m
            
            const heightData = [];
            let minHeight = Infinity;
            let maxHeight = -Infinity;
            
            console.log(`Sampling terrain at ${mapSize}x${mapSize} resolution...`);
            
            for (let y = 0; y < mapSize; y++) {
                const row = [];
                for (let x = 0; x < mapSize; x++) {
                    // Convert pixel coordinates to world coordinates
                    const worldX = (x - mapSize/2) * step;
                    const worldZ = (y - mapSize/2) * step;
                    
                    const height = ocean.getTerrainHeight(worldX, worldZ);
                    row.push(height);
                    
                    minHeight = Math.min(minHeight, height);
                    maxHeight = Math.max(maxHeight, height);
                }
                heightData.push(row);
                
                // Progress indicator
                if (y % 100 === 0) {
                    console.log(`Progress: ${((y / mapSize) * 100).toFixed(1)}%`);
                }
            }
            
            console.log(`Terrain sampled: ${minHeight.toFixed(1)}m to ${maxHeight.toFixed(1)}m depth range`);
            
            return {
                heightData: heightData,
                minHeight: minHeight,
                maxHeight: maxHeight,
                mapSize: mapSize,
                terrainSize: terrainSize
            };
        });
        
        if (!heightmapData) {
            throw new Error("Failed to generate heightmap data");
        }
        
        console.log("🎨 Creating terrain visualization canvas...");
        
        // Create canvas and render heightmap
        const canvasData = await page.evaluate((data) => {
            const canvas = document.createElement('canvas');
            canvas.width = data.mapSize;
            canvas.height = data.mapSize;
            const ctx = canvas.getContext('2d');
            
            const imageData = ctx.createImageData(data.mapSize, data.mapSize);
            const pixels = imageData.data;
            
            const heightRange = data.maxHeight - data.minHeight;
            
            for (let y = 0; y < data.mapSize; y++) {
                for (let x = 0; x < data.mapSize; x++) {
                    const height = data.heightData[y][x];
                    const pixelIndex = (y * data.mapSize + x) * 4;
                    
                    // Normalize height to 0-1 range
                    const normalizedHeight = (height - data.minHeight) / heightRange;
                    
                    // Create depth-based color scheme
                    let r, g, b;
                    
                    if (normalizedHeight > 0.9) {
                        // Shallow areas (mountains/seamounts) - Red/Yellow
                        r = 255;
                        g = Math.floor(255 * (normalizedHeight - 0.9) * 10);
                        b = 0;
                    } else if (normalizedHeight > 0.7) {
                        // Hills - Orange
                        r = 255;
                        g = Math.floor(165 * (normalizedHeight - 0.7) * 5);
                        b = 0;
                    } else if (normalizedHeight > 0.5) {
                        // Plains - Green
                        r = 0;
                        g = Math.floor(255 * (normalizedHeight - 0.5) * 5);
                        b = 0;
                    } else if (normalizedHeight > 0.3) {
                        // Continental slope - Blue-green
                        r = 0;
                        g = Math.floor(150 * (normalizedHeight - 0.3) * 5);
                        b = Math.floor(255 * (normalizedHeight - 0.3) * 5);
                    } else if (normalizedHeight > 0.1) {
                        // Abyssal plain - Blue
                        r = 0;
                        g = 0;
                        b = Math.floor(255 * (normalizedHeight - 0.1) * 5);
                    } else {
                        // Deep trench - Dark blue/black
                        r = 0;
                        g = 0;
                        b = Math.floor(100 * normalizedHeight * 10);
                    }
                    
                    pixels[pixelIndex] = r;     // Red
                    pixels[pixelIndex + 1] = g; // Green
                    pixels[pixelIndex + 2] = b; // Blue
                    pixels[pixelIndex + 3] = 255; // Alpha
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            // Add scale and labels
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            
            // Title
            const title = '100km x 100km Terrain Heightmap';
            ctx.strokeText(title, 10, 30);
            ctx.fillText(title, 10, 30);
            
            // Depth legend
            const legend = [
                `Shallowest: ${Math.abs(data.maxHeight).toFixed(0)}m`,
                `Deepest: ${Math.abs(data.minHeight).toFixed(0)}m`,
                'Red/Yellow: Seamounts/Mountains',
                'Orange: Hills (200m depth)',
                'Green: Plains (500m depth)',
                'Blue-Green: Continental Slope',
                'Blue: Abyssal Plain (6000m)',
                'Dark Blue: Ocean Trench (13000m)'
            ];
            
            legend.forEach((text, index) => {
                const y = data.mapSize - 150 + (index * 18);
                ctx.strokeText(text, 10, y);
                ctx.fillText(text, 10, y);
            });
            
            // Scale indicator
            const scaleText = '1 pixel = 100m';
            ctx.strokeText(scaleText, data.mapSize - 150, 30);
            ctx.fillText(scaleText, data.mapSize - 150, 30);
            
            return canvas.toDataURL('image/png');
        }, heightmapData);
        
        console.log("💾 Saving terrain map image...");
        
        // Convert base64 to image file
        const base64Data = canvasData.replace(/^data:image\/png;base64,/, '');
        const filename = `terrain_heightmap_100km_${Date.now()}.png`;
        const filepath = `D:\\Dropbox\\Free Games\\2025 RPG\\CLAUDE GAMES\\SW\\${filename}`;
        
        fs.writeFileSync(filepath, base64Data, 'base64');
        
        console.log(`✅ Terrain heightmap saved as: ${filename}`);
        console.log(`📁 Location: ${filepath}`);
        console.log(`📊 Map Details:`);
        console.log(`   - Resolution: 1000x1000 pixels`);
        console.log(`   - Scale: 1 pixel = 100m`);
        console.log(`   - Coverage: 100km x 100km`);
        console.log(`   - Depth Range: ${Math.abs(heightmapData.maxHeight).toFixed(0)}m to ${Math.abs(heightmapData.minHeight).toFixed(0)}m`);
        
        // Create a second wireframe-style version
        console.log("\n🎨 Creating wireframe contour version...");
        
        const wireframeData = await page.evaluate((data) => {
            const canvas = document.createElement('canvas');
            canvas.width = data.mapSize;
            canvas.height = data.mapSize;
            const ctx = canvas.getContext('2d');
            
            // Black background
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, data.mapSize, data.mapSize);
            
            // Draw contour lines in cyan (like wireframe aesthetic)
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1;
            
            const contourInterval = 500; // Contour every 500m depth
            const heightRange = data.maxHeight - data.minHeight;
            
            for (let contourDepth = data.minHeight; contourDepth <= data.maxHeight; contourDepth += contourInterval) {
                ctx.beginPath();
                
                for (let y = 1; y < data.mapSize - 1; y++) {
                    for (let x = 1; x < data.mapSize - 1; x++) {
                        const height = data.heightData[y][x];
                        const heightRight = data.heightData[y][x + 1];
                        const heightDown = data.heightData[y + 1][x];
                        
                        // Check if contour line crosses this pixel
                        if ((height <= contourDepth && heightRight > contourDepth) ||
                            (height > contourDepth && heightRight <= contourDepth)) {
                            ctx.moveTo(x + 0.5, y);
                            ctx.lineTo(x + 0.5, y + 1);
                        }
                        
                        if ((height <= contourDepth && heightDown > contourDepth) ||
                            (height > contourDepth && heightDown <= contourDepth)) {
                            ctx.moveTo(x, y + 0.5);
                            ctx.lineTo(x + 1, y + 0.5);
                        }
                    }
                }
                ctx.stroke();
            }
            
            // Add labels
            ctx.fillStyle = '#00ffff';
            ctx.font = '16px Arial';
            ctx.fillText('100km x 100km Terrain - Wireframe Contours', 10, 25);
            ctx.fillText('Cyan contour lines every 500m depth', 10, 45);
            
            return canvas.toDataURL('image/png');
        }, heightmapData);
        
        const wireframeBase64 = wireframeData.replace(/^data:image\/png;base64,/, '');
        const wireframeFilename = `terrain_wireframe_100km_${Date.now()}.png`;
        const wireframeFilepath = `D:\\Dropbox\\Free Games\\2025 RPG\\CLAUDE GAMES\\SW\\${wireframeFilename}`;
        
        fs.writeFileSync(wireframeFilepath, wireframeBase64, 'base64');
        
        console.log(`✅ Wireframe contour map saved as: ${wireframeFilename}`);
        console.log(`📁 Location: ${wireframeFilepath}`);
        
        console.log("\n🎉 Terrain visualization complete!");
        console.log("   Two images generated:");
        console.log(`   1. Color heightmap: ${filename}`);
        console.log(`   2. Wireframe contours: ${wireframeFilename}`);
        
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

generateTerrainMap().catch(console.error);