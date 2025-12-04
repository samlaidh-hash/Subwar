const { chromium } = require("playwright");
const fs = require('fs');

async function generateRealBathymetryWireframe() {
    console.log("🎨 Generating FINAL wireframe from REAL BATHYMETRY data...");
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100    
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log("📱 Loading real bathymetry terrain system...");
        await page.goto("file://" + __dirname + "/index.html");
        await page.waitForTimeout(5000); // Wait for bathymetry to load
        
        console.log("🎨 Creating high-resolution wireframe from real ocean floor data...");
        
        const wireframeData = await page.evaluate(() => {
            const ocean = window.oceanInstance;
            if (!ocean || !ocean.getTerrainHeight || !ocean.bathymetryTerrain.loaded) {
                return null;
            }
            
            console.log("📊 Sampling real bathymetry data for wireframe...");
            
            // High resolution for detailed wireframe of real terrain
            const resolution = 300; // 300x300 grid for high detail
            const terrainSize = 100000; // 100km x 100km
            const step = terrainSize / resolution;
            
            // Sample real terrain heights
            const heights = [];
            let minHeight = Infinity;
            let maxHeight = -Infinity;
            
            for (let y = 0; y < resolution; y++) {
                const row = [];
                for (let x = 0; x < resolution; x++) {
                    const worldX = (x - resolution/2) * step;
                    const worldZ = (y - resolution/2) * step;
                    const height = ocean.getTerrainHeight(worldX, worldZ);
                    row.push(height);
                    
                    minHeight = Math.min(minHeight, height);
                    maxHeight = Math.max(maxHeight, height);
                }
                heights.push(row);
                
                if (y % 50 === 0) {
                    console.log(`Real bathymetry sampling: ${((y / resolution) * 100).toFixed(1)}%`);
                }
            }
            
            console.log(`Real terrain range: ${minHeight.toFixed(0)}m to ${maxHeight.toFixed(0)}m`);
            
            // Create wireframe visualization
            const canvas = document.createElement('canvas');
            canvas.width = 1600;
            canvas.height = 1200;
            const ctx = canvas.getContext('2d');
            
            // Dark ocean background
            ctx.fillStyle = '#000814';
            ctx.fillRect(0, 0, 1600, 1200);
            
            // Bright cyan wireframe with glow effect
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 1.2;
            ctx.shadowColor = '#00f5ff';
            ctx.shadowBlur = 2;
            
            // 3D perspective parameters for dramatic view
            const centerX = 800;
            const centerY = 400;
            const scale = 400;
            const heightScale = 0.05; // Scale height for visibility
            
            console.log("Drawing real bathymetry wireframe...");
            
            // Draw horizontal wireframe lines (every 6th line for clarity)
            for (let y = 0; y < resolution; y += 6) {
                ctx.beginPath();
                for (let x = 0; x < resolution; x += 3) {
                    if (x < heights[0].length && y < heights.length) {
                        const height = heights[y][x];
                        
                        // 3D perspective projection
                        const perspective = 0.6 + (y / resolution) * 0.6;
                        const screenX = centerX + (x - resolution/2) * scale / resolution * perspective;
                        const screenY = centerY + (y - resolution/2) * scale / resolution * 0.3 + height * heightScale;
                        
                        if (x === 0) {
                            ctx.moveTo(screenX, screenY);
                        } else {
                            ctx.lineTo(screenX, screenY);
                        }
                    }
                }
                ctx.stroke();
            }
            
            // Draw vertical wireframe lines (every 6th line for clarity)
            for (let x = 0; x < resolution; x += 6) {
                ctx.beginPath();
                for (let y = 0; y < resolution; y += 3) {
                    if (x < heights[0].length && y < heights.length) {
                        const height = heights[y][x];
                        
                        const perspective = 0.6 + (y / resolution) * 0.6;
                        const screenX = centerX + (x - resolution/2) * scale / resolution * perspective;
                        const screenY = centerY + (y - resolution/2) * scale / resolution * 0.3 + height * heightScale;
                        
                        if (y === 0) {
                            ctx.moveTo(screenX, screenY);
                        } else {
                            ctx.lineTo(screenX, screenY);
                        }
                    }
                }
                ctx.stroke();
            }
            
            // Add title and technical data
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#00f5ff';
            ctx.font = 'bold 36px Arial';
            ctx.fillText('SUB WAR 2060 - REAL BATHYMETRY', 30, 60);
            
            ctx.font = '20px Arial';
            ctx.fillText('NORTH PACIFIC OCEAN FLOOR', 30, 95);
            ctx.fillText('100km × 100km Real Terrain Data', 30, 120);
            
            ctx.font = '16px Arial';
            const info = [
                `SOURCE: Google Earth Bathymetry Export (${ocean.bathymetryTerrain.heightmapData.width}×${ocean.bathymetryTerrain.heightmapData.height}px)`,
                `DEPTH RANGE: ${Math.abs(maxHeight).toFixed(0)}m to ${Math.abs(minHeight).toFixed(0)}m below sea level`,
                `LOCATION: North Pacific (25.72°N, 167.35°W) near Hawaiian-Emperor Chain`,
                `FEATURES: Real underwater mountain ranges, valleys, and seamount systems`,
                `TERRAIN VARIATION: ${(Math.abs(minHeight) - Math.abs(maxHeight)).toFixed(0)}m vertical complexity`,
                `SUBMARINE COMBAT: Ideal for 3D underwater warfare with realistic obstacles`
            ];
            
            info.forEach((text, index) => {
                ctx.fillText(text, 30, 1000 + (index * 22));
            });
            
            // Add depth scale indicators
            ctx.fillStyle = '#ffaa00';
            ctx.font = 'bold 18px Arial';
            ctx.fillText('SHALLOW', 1200, 300);
            ctx.fillText('DEEP', 1200, 800);
            
            // Add coordinate indicators
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.fillText('50km N', centerX - 200, 200);
            ctx.fillText('50km S', centerX - 200, 800);
            ctx.fillText('50km W', 200, centerY);
            ctx.fillText('50km E', 1400, centerY);
            
            return {
                canvas: canvas.toDataURL('image/png'),
                stats: {
                    resolution: resolution,
                    minHeight: minHeight,
                    maxHeight: maxHeight,
                    variation: Math.abs(minHeight) - Math.abs(maxHeight),
                    imageSize: `${ocean.bathymetryTerrain.heightmapData.width}×${ocean.bathymetryTerrain.heightmapData.height}`
                }
            };
        });
        
        if (!wireframeData) {
            throw new Error("Failed to generate real bathymetry wireframe data");
        }
        
        console.log("💾 Saving REAL BATHYMETRY wireframe visualization...");
        
        const base64Data = wireframeData.canvas.replace(/^data:image\/png;base64,/, '');
        const filename = `real_bathymetry_wireframe_${Date.now()}.png`;
        const filepath = `D:\\\\Dropbox\\\\Free Games\\\\2025 RPG\\\\CLAUDE GAMES\\\\SW\\\\${filename}`;
        
        fs.writeFileSync(filepath, base64Data, 'base64');
        
        console.log(`✅ REAL BATHYMETRY wireframe saved!`);
        console.log(`📁 Filename: ${filename}`);
        console.log(`🌊 Real Ocean Floor Features:`);
        console.log(`   - Source: Google Earth bathymetry (${wireframeData.stats.imageSize})`);
        console.log(`   - Depth Range: ${Math.abs(wireframeData.stats.maxHeight).toFixed(0)}m to ${Math.abs(wireframeData.stats.minHeight).toFixed(0)}m`);
        console.log(`   - Vertical Complexity: ${wireframeData.stats.variation.toFixed(0)}m`);
        console.log(`   - Real underwater mountains, valleys, and seamounts`);
        console.log(`   - Perfect for realistic submarine warfare scenarios`);
        console.log(`   - High-resolution wireframe (${wireframeData.stats.resolution}×${wireframeData.stats.resolution} sampling)`);
        
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

generateRealBathymetryWireframe().catch(console.error);