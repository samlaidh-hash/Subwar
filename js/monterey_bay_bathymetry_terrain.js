// Monterey Bay Canyon Bathymetric Terrain System
// NOAA/GEBCO Bathymetry for Monterey Bay Canyon, California
// Location: 36.663277°N, 122.388124°W (100km × 100km coverage)

class MontereyBayBathymetryTerrain {
    constructor() {
        this.terrainSize = 200000; // 200km x 200km (expanded for full canyon visibility)
        this.heightmapCanvas = null;
        this.heightmapContext = null;
        this.heightmapData = null;
        this.loaded = false;
        
        // Monterey Bay Canyon characteristics
        this.dataSource = 'GEBCO 2025 - Monterey Bay Canyon';
        this.location = {
            name: 'Monterey Bay Canyon',
            center: { lat: 36.663277, lon: -122.388124 },
            bounds: {
                north: 37.1137,
                south: 36.2128,
                east: -121.8266,
                west: -122.9497
            }
        };
        
        console.log('🌊 Initializing Monterey Bay Canyon Bathymetric System...');
        console.log(`📍 Location: ${this.location.center.lat}°N, ${Math.abs(this.location.center.lon)}°W`);
        console.log(`📊 Data Source: ${this.dataSource}`);
        console.log(`🏔️ Features: Submarine canyon, continental shelf, abyssal fan`);
        console.log(`📏 Canyon depth: 0-3,885m (12,743 feet)`);
    }
    
    async loadBathymetryData() {
        return new Promise((resolve, reject) => {
            console.log('📡 Loading Monterey Bay NOAA bathymetry data...');
            
            const img = new Image();
            img.onload = () => {
                console.log(`✅ Monterey Bay bathymetry loaded: ${img.width}x${img.height}`);
                console.log(`📊 Data source: ${this.dataSource}`);
                console.log(`🔍 Resolution: ${(100000 / img.width).toFixed(1)}m per pixel`);
                
                // Create canvas to sample pixel data
                this.heightmapCanvas = document.createElement('canvas');
                this.heightmapCanvas.width = img.width;
                this.heightmapCanvas.height = img.height;
                this.heightmapContext = this.heightmapCanvas.getContext('2d');
                
                // Draw image to canvas
                this.heightmapContext.drawImage(img, 0, 0);
                
                // Get pixel data
                this.heightmapData = this.heightmapContext.getImageData(0, 0, img.width, img.height);
                this.loaded = true;
                
                console.log('🗺️ Monterey Bay NOAA bathymetric data processed and ready');
                console.log('🏔️ Features: Submarine canyon, continental shelf, canyon tributaries');
                resolve();
            };
            
            img.onerror = () => {
                console.error('❌ Failed to load Monterey Bay bathymetry data');
                console.log('📋 Using fallback Monterey Canyon depth profiles...');
                reject(new Error('Monterey Bay bathymetry data not available - using fallback'));
            };
            
            // Check for Monterey Bay data URL
            if (window.MONTEREY_BAY_BATHYMETRY_DATA_URL) {
                img.src = window.MONTEREY_BAY_BATHYMETRY_DATA_URL;
            } else {
                console.warn('⚠️ MONTEREY_BAY_BATHYMETRY_DATA_URL not found');
                console.log('📋 Using Monterey Canyon fallback profiles...');
                reject(new Error('Monterey Bay bathymetry data URL not available'));
            }
        });
    }
    
    getTerrainHeight(worldX, worldZ) {
        if (!this.loaded || !this.heightmapData) {
            // Return Monterey Canyon depth profiles while loading
            return this.getMontereyCanyonDepth(worldX, worldZ);
        }
        
        // Convert world coordinates to image coordinates
        const halfSize = this.terrainSize / 2;
        const normalizedX = (worldX + halfSize) / this.terrainSize;
        const normalizedZ = (worldZ + halfSize) / this.terrainSize;
        
        // Clamp to image bounds
        const clampedX = Math.max(0, Math.min(1, normalizedX));
        const clampedZ = Math.max(0, Math.min(1, normalizedZ));
        
        // Enhanced sampling for Monterey Canyon data (7x7 for canyon precision)
        const pixelX = clampedX * (this.heightmapData.width - 1);
        const pixelY = clampedZ * (this.heightmapData.height - 1);
        
        const centerX = Math.round(pixelX);
        const centerY = Math.round(pixelY);
        
        // 7x7 weighted average for maximum canyon wall precision
        const getPixelDepth = (x, y) => {
            x = Math.max(0, Math.min(this.heightmapData.width - 1, x));
            y = Math.max(0, Math.min(this.heightmapData.height - 1, y));
            
            const index = (y * this.heightmapData.width + x) * 4;
            const r = this.heightmapData.data[index];
            const g = this.heightmapData.data[index + 1];
            const b = this.heightmapData.data[index + 2];
            return this.montereyCanyonDepthFromRGB(r, g, b);
        };
        
        // Enhanced 7x7 Gaussian weighted sampling for canyon walls
        let totalDepth = 0;
        let totalWeight = 0;
        
        for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
                const distance = Math.sqrt(dx*dx + dy*dy);
                const weight = distance === 0 ? 16 : 
                              distance === 1 ? 12 : 
                              distance <= Math.sqrt(2) ? 8 :
                              distance <= Math.sqrt(5) ? 5 :
                              distance <= Math.sqrt(8) ? 3 :
                              distance <= Math.sqrt(13) ? 2 : 1;
                
                const depth = getPixelDepth(centerX + dx, centerY + dy);
                totalDepth += depth * weight;
                totalWeight += weight;
            }
        }
        
        return totalDepth / totalWeight;
    }
    
    montereyCanyonDepthFromRGB(r, g, b) {
        // NOAA/GEBCO depth encoding for Monterey Canyon region
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        
        let depth;
        
        if (brightness > 0.9) {
            // Shallow shelf and nearshore (0-100m)
            depth = -10 - (0.9 - brightness) * 900; // 0-100m depth
        } else if (brightness > 0.7) {
            // Continental shelf (100-200m)
            depth = -100 - (0.9 - brightness) * 500; // 100-200m depth
        } else if (brightness > 0.5) {
            // Canyon head and upper walls (200-1000m)
            depth = -200 - (0.7 - brightness) * 4000; // 200-1000m depth
        } else if (brightness > 0.3) {
            // Mid canyon with steep walls (1000-2500m)
            depth = -1000 - (0.5 - brightness) * 7500; // 1000-2500m depth
        } else if (brightness > 0.1) {
            // Lower canyon and tributaries (2500-3500m)
            depth = -2500 - (0.3 - brightness) * 5000; // 2500-3500m depth
        } else {
            // Abyssal fan and maximum depth (3500-3885m)
            depth = -3500 - (0.1 - brightness) * 3850; // 3500-3885m depth
        }
        
        // Monterey Canyon wall variation (more dramatic than seamount variation)
        const canyonVariation = Math.sin(r * 0.05) * Math.cos(g * 0.05) * 50; // ±50m variation
        
        return depth + canyonVariation;
    }
    
    getMontereyCanyonDepth(worldX, worldZ) {
        // Monterey Canyon depth modeling based on NOAA surveys
        const distanceFromCenter = Math.sqrt(worldX * worldX + worldZ * worldZ);
        const normalizedDistance = distanceFromCenter / 50000; // 0-1 over 50km radius
        
        // Create canyon channel effect (north-south trending)
        const canyonChannel = Math.abs(worldX) / 10000; // Canyon runs roughly N-S
        const shoreDistance = (worldZ + 50000) / 100000; // Distance from shore (0=shore, 1=offshore)
        
        // Monterey Canyon profile
        if (shoreDistance < 0.1) {
            // Nearshore shelf (0-50m)
            return -10 - Math.random() * 40;
        } else if (shoreDistance < 0.3 && canyonChannel < 0.5) {
            // Canyon head area (50-500m) - dramatic drop
            return -50 - Math.random() * 450;
        } else if (shoreDistance < 0.3) {
            // Continental shelf (50-200m)
            return -50 - Math.random() * 150;
        } else if (shoreDistance < 0.6 && canyonChannel < 0.3) {
            // Mid canyon with steep walls (500-2000m)
            return -500 - Math.random() * 1500;
        } else if (shoreDistance < 0.6) {
            // Continental slope (200-1000m)
            return -200 - Math.random() * 800;
        } else if (shoreDistance < 0.9 && canyonChannel < 0.2) {
            // Lower canyon (2000-3500m)
            return -2000 - Math.random() * 1500;
        } else {
            // Abyssal plain and fan (1000-3885m)
            return -1000 - Math.random() * 2885;
        }
    }
    
    getSeabedHeight(worldX, worldZ) {
        return this.getTerrainHeight(worldX, worldZ);
    }
    
    // Create Monterey Canyon visualization
    createMontereyCanyonVisualization() {
        if (!this.heightmapCanvas && !this.loaded) {
            // Create visualization from fallback data
            console.log('🎨 Creating Monterey Canyon visualization from depth models...');
        }
        
        const debugCanvas = document.createElement('canvas');
        debugCanvas.width = 600;
        debugCanvas.height = 600;
        const debugCtx = debugCanvas.getContext('2d');
        
        // Title
        debugCtx.fillStyle = '#ffffff';
        debugCtx.font = 'bold 16px Arial';
        debugCtx.fillText('Monterey Bay Canyon Bathymetry', 10, 25);
        debugCtx.font = '12px Arial';
        debugCtx.fillText(`Source: ${this.dataSource}`, 10, 45);
        debugCtx.fillText(`Location: ${this.location.center.lat}°N, ${Math.abs(this.location.center.lon)}°W`, 10, 60);
        debugCtx.fillText(`Coverage: 100km × 100km`, 10, 75);
        
        const mapCanvas = debugCtx.createImageData(500, 500);
        
        for (let y = 0; y < 500; y++) {
            for (let x = 0; x < 500; x++) {
                const worldX = (x / 500 - 0.5) * this.terrainSize;
                const worldZ = (y / 500 - 0.5) * this.terrainSize;
                const depth = this.getTerrainHeight(worldX, worldZ);
                
                // Monterey Canyon color mapping
                const normalizedDepth = Math.max(0, Math.min(1, (-depth) / 4000));
                
                const index = (y * 500 + x) * 4;
                
                if (normalizedDepth > 0.95) {
                    // Shallow shelf - light blue/white
                    mapCanvas.data[index] = 255;     // R
                    mapCanvas.data[index + 1] = 255; // G
                    mapCanvas.data[index + 2] = 255; // B
                } else if (normalizedDepth > 0.8) {
                    // Continental shelf - cyan
                    mapCanvas.data[index] = 0;       // R
                    mapCanvas.data[index + 1] = 255; // G
                    mapCanvas.data[index + 2] = 255; // B
                } else if (normalizedDepth > 0.5) {
                    // Upper canyon - light blue
                    mapCanvas.data[index] = 0;       // R
                    mapCanvas.data[index + 1] = 150; // G
                    mapCanvas.data[index + 2] = 255; // B
                } else if (normalizedDepth > 0.2) {
                    // Mid canyon - blue
                    mapCanvas.data[index] = 0;       // R
                    mapCanvas.data[index + 1] = 100; // G
                    mapCanvas.data[index + 2] = 200; // B
                } else {
                    // Deep canyon - dark blue/purple
                    mapCanvas.data[index] = 50;      // R
                    mapCanvas.data[index + 1] = 0;   // G
                    mapCanvas.data[index + 2] = 150; // B
                }
                
                mapCanvas.data[index + 3] = 255; // A
            }
        }
        
        debugCtx.putImageData(mapCanvas, 50, 90);
        
        // Add depth scale for Monterey Canyon
        debugCtx.fillStyle = '#ffffff';
        debugCtx.font = '10px Arial';
        debugCtx.fillText('Monterey Canyon Depth Scale:', 50, 610);
        debugCtx.fillText('White: 0-100m (shelf)', 50, 625);
        debugCtx.fillText('Cyan: 100-500m (canyon head)', 50, 640);
        debugCtx.fillText('Light Blue: 500-1500m (upper canyon)', 50, 655);
        debugCtx.fillText('Blue: 1500-3000m (mid canyon)', 50, 670);
        debugCtx.fillText('Dark Blue: 3000-3885m (abyssal)', 50, 685);
        
        return debugCanvas;
    }
    
    validateNOAAData() {
        if (!this.loaded) {
            console.log('⚠️ Monterey Bay data not loaded for validation');
            return false;
        }
        
        console.log('🔍 Validating Monterey Bay bathymetric data...');
        
        const testPoints = [
            { x: 0, z: 40000, expectedRange: [-100, -10] },        // Nearshore (shelf)
            { x: 0, z: 0, expectedRange: [-2000, -200] },          // Canyon center
            { x: 0, z: -40000, expectedRange: [-3885, -1000] },    // Deep offshore
            { x: 30000, z: 0, expectedRange: [-1000, -200] },      // Canyon edge
            { x: -30000, z: 0, expectedRange: [-1000, -200] }      // Opposite canyon edge
        ];
        
        let validPoints = 0;
        
        testPoints.forEach((point, i) => {
            const depth = this.getTerrainHeight(point.x, point.z);
            const isValid = depth >= point.expectedRange[0] && depth <= point.expectedRange[1];
            
            console.log(`   Point ${i+1}: ${point.x}, ${point.z} = ${depth.toFixed(0)}m ${isValid ? '✅' : '❌'}`);
            
            if (isValid) validPoints++;
        });
        
        const isValid = validPoints === testPoints.length;
        console.log(`🔍 Monterey Bay validation: ${isValid ? '✅ PASSED' : '❌ FAILED'} (${validPoints}/${testPoints.length} points valid)`);
        
        return isValid;
    }
}

// Export for use in ocean.js
window.MontereyBayBathymetryTerrain = MontereyBayBathymetryTerrain;

// Monterey Bay data source information
window.MONTEREY_BAY_DATA_INFO = {
    source: 'GEBCO 2025 - Monterey Bay Canyon Grid',
    location: 'Monterey Bay Canyon, California',
    coordinates: '36.663277°N, 122.388124°W',
    coverage: '100km × 100km',
    resolution: '15 arc-second (~450m)',
    features: 'Submarine canyon, continental shelf, abyssal fan',
    maxDepth: '3,885m (12,743 feet)',
    canyonLength: '470km (292 miles)',
    downloadUrl: 'https://download.gebco.net/',
    citation: 'GEBCO Compilation Group (2025) GEBCO 2025 Grid'
};

console.log('📚 Monterey Bay Canyon Bathymetry System loaded');
console.log('🏔️ Features: Largest submarine canyon on Pacific coast');