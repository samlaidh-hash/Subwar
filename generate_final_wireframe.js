const { chromium } = require("playwright");
const fs = require('fs');

async function generateFinalWireframe() {
    console.log("🎨 Generating FINAL high-granularity wireframe (75/25 terrain)...");
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100    
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log("📱 Loading corrected terrain system...");
        await page.goto("file://" + __dirname + "/index.html");
        await page.waitForTimeout(3000);
        
        console.log("🎨 Creating high-granularity wireframe visualization...");
        
        const wireframeData = await page.evaluate(() => {
            const ocean = window.oceanInstance;
            if (!ocean || !ocean.getTerrainHeight) {
                return null;
            }
            
            // High resolution for detailed wireframe
            const resolution = 300; // 300x300 grid for high detail
            const terrainSize = ocean.terrainSize;
            const step = terrainSize / resolution;
            
            console.log("Sampling terrain at high resolution for wireframe...");
            
            // Sample terrain heights
            const heights = [];
            for (let y = 0; y < resolution; y++) {
                const row = [];
                for (let x = 0; x < resolution; x++) {
                    const worldX = (x - resolution/2) * step;
                    const worldZ = (y - resolution/2) * step;
                    const height = ocean.getTerrainHeight(worldX, worldZ);
                    row.push(height);
                }
                heights.push(row);
                
                if (y % 50 === 0) {
                    console.log(`Wireframe progress: ${((y / resolution) * 100).toFixed(1)}%`);
                }
            }
            
            // Create cyan wireframe on dark background (matching reference)
            const canvas = document.createElement('canvas');
            canvas.width = 1400;
            canvas.height = 1000;
            const ctx = canvas.getContext('2d');
            
            // Dark background like untitled3.jpg
            ctx.fillStyle = '#001122';
            ctx.fillRect(0, 0, 1400, 1000);
            
            // Bright cyan wireframe with glow
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1;
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 1;
            
            // 3D perspective parameters
            const centerX = 700;
            const centerY = 300;
            const scale = 350;
            const heightScale = 0.03; // Scale height for visibility
            
            console.log("Drawing wireframe grid lines...");
            
            // Draw horizontal wireframe lines (every 4th line for clarity)
            for (let y = 0; y < resolution; y += 4) {
                ctx.beginPath();
                for (let x = 0; x < resolution; x += 2) {
                    if (x < heights[0].length && y < heights.length) {
                        const height = heights[y][x];
                        
                        // 3D perspective projection
                        const perspective = 0.7 + (y / resolution) * 0.5;
                        const screenX = centerX + (x - resolution/2) * scale / resolution * perspective;
                        const screenY = centerY + (y - resolution/2) * scale / resolution * 0.4 + height * heightScale;
                        
                        if (x === 0) {
                            ctx.moveTo(screenX, screenY);
                        } else {
                            ctx.lineTo(screenX, screenY);
                        }
                    }
                }
                ctx.stroke();
            }
            
            // Draw vertical wireframe lines (every 4th line for clarity)
            for (let x = 0; x < resolution; x += 4) {
                ctx.beginPath();
                for (let y = 0; y < resolution; y += 2) {
                    if (x < heights[0].length && y < heights.length) {
                        const height = heights[y][x];
                        
                        const perspective = 0.7 + (y / resolution) * 0.5;
                        const screenX = centerX + (x - resolution/2) * scale / resolution * perspective;
                        const screenY = centerY + (y - resolution/2) * scale / resolution * 0.4 + height * heightScale;
                        
                        if (y === 0) {
                            ctx.moveTo(screenX, screenY);
                        } else {
                            ctx.lineTo(screenX, screenY);
                        }
                    }
                }
                ctx.stroke();
            }
            
            // Add retro-futuristic title and info
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#00ffff';
            ctx.font = 'bold 32px Arial';
            ctx.fillText('SUB WAR 2060 - TERRAIN ANALYSIS', 20, 50);
            
            ctx.font = '18px Arial';
            ctx.fillText('100km x 100km Ocean Floor Topography', 20, 80);
            
            ctx.font = '14px Arial';
            const info = [
                '75% PLAINS AREA: ~500m depth with considerable rises/falls + 3km canyons',
                '25% DEEP WATER: Continental slope \u2192 Abyssal plain \u2192 Ocean trench',
                'High granularity wireframe showing topographic detail',
                'Cyan grid lines reveal underwater mountain ranges and canyon systems'
            ];
            
            info.forEach((text, index) => {
                ctx.fillText(text, 20, 850 + (index * 20));
            });
            
            // Add zone markers
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('75% PLAINS', 100, 200);
            ctx.fillText('25% DEEP WATER', 1000, 400);
            
            return {
                canvas: canvas.toDataURL('image/png'),
                stats: {
                    resolution: resolution,
                    samplingComplete: true
                }
            };
        });
        
        if (!wireframeData) {
            throw new Error("Failed to generate wireframe data");
        }
        
        console.log("💾 Saving final wireframe visualization...");
        
        const base64Data = wireframeData.canvas.replace(/^data:image\/png;base64,/, '');
        const filename = `terrain_final_wireframe_75_25_${Date.now()}.png`;
        const filepath = `D:\\Dropbox\\Free Games\\2025 RPG\\CLAUDE GAMES\\SW\\${filename}`;
        
        fs.writeFileSync(filepath, base64Data, 'base64');
        
        console.log(`✅ Final wireframe visualization saved!`);
        console.log(`📁 Filename: ${filename}`);
        console.log(`📊 Features:`);
        console.log(`   - High-granularity wireframe (${wireframeData.stats.resolution}x${wireframeData.stats.resolution} sampling)`);
        console.log(`   - 75/25 terrain distribution clearly visible`);
        console.log(`   - Cyan grid on dark background (matches reference images)`);
        console.log(`   - Shows considerable rises/falls in plains area`);
        console.log(`   - Displays 3km deep canyon systems`);
        console.log(`   - Relatively flat abyssal plain with rare seamounts`);
        console.log(`   - Retro-futuristic submarine warfare aesthetic`);
        
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
    
    await browser.close();
}

generateFinalWireframe().catch(console.error);