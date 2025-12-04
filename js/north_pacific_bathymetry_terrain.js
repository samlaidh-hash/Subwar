// North Pacific Hawaiian-Emperor Chain Bathymetric Terrain System
// NOAA/GEBCO Bathymetry for Hawaiian-Emperor Chain Seamount Region
// Location: 25.72°N, 167.35°W (100km × 100km coverage)

class NorthPacificBathymetryTerrain {
    constructor() {
        this.terrainSize = 100000; // 100km x 100km
        this.heightmapCanvas = null;
        this.heightmapContext = null;
        this.heightmapData = null;
        this.loaded = false;
        
        // North Pacific Hawaiian-Emperor Chain characteristics
        this.dataSource = 'GEBCO 2025 - North Pacific';
        this.location = {
            name: 'Hawaiian-Emperor Chain',
            center: { lat: 25.72, lon: -167.35 },
            bounds: {
                north: 26.1705,
                south: 25.2695,
                east: -166.8500,
                west: -167.8500
            }
        };
        
        console.log('🌊 Initializing North Pacific Hawaiian-Emperor Chain Bathymetric System...');
        console.log(`📍 Location: ${this.location.center.lat}°N, ${Math.abs(this.location.center.lon)}°W`);
        console.log(`📊 Data Source: ${this.dataSource}`);
        console.log(`🗻 Features: Seamount chain, volcanic ridges, abyssal plains`);
    }
    
    async loadBathymetryData() {
        return new Promise((resolve, reject) => {
            console.log('📡 Loading North Pacific NOAA bathymetry data...');
            
            const img = new Image();
            img.onload = () => {
                console.log(`✅ North Pacific bathymetry loaded: ${img.width}x${img.height}`);
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
                
                console.log('🗺️ North Pacific NOAA bathymetric data processed and ready');
                console.log('🌋 Features: Hawaiian-Emperor Chain seamounts, abyssal plains, volcanic ridges');
                resolve();
            };
            
            img.onerror = () => {
                console.error('❌ Failed to load North Pacific bathymetry data');
                console.log('📋 Using fallback Hawaiian-Emperor Chain depth profiles...');
                reject(new Error('North Pacific bathymetry data not available - using fallback'));
            };
            
            // Check for North Pacific data URL
            if (window.NORTH_PACIFIC_BATHYMETRY_DATA_URL) {
                img.src = window.NORTH_PACIFIC_BATHYMETRY_DATA_URL;
            } else {
                console.warn('⚠️ NORTH_PACIFIC_BATHYMETRY_DATA_URL not found');
                console.log('📋 Using Hawaiian-Emperor Chain fallback profiles...');
                reject(new Error('North Pacific bathymetry data URL not available'));
            }
        });
    }
    
    getTerrainHeight(worldX, worldZ) {
        if (!this.loaded || !this.heightmapData) {
            // Return Hawaiian-Emperor Chain depth profiles while loading
            return this.getHawaiianEmperorDepth(worldX, worldZ);
        }
        
        // Convert world coordinates to image coordinates
        const halfSize = this.terrainSize / 2;
        const normalizedX = (worldX + halfSize) / this.terrainSize;
        const normalizedZ = (worldZ + halfSize) / this.terrainSize;
        
        // Clamp to image bounds
        const clampedX = Math.max(0, Math.min(1, normalizedX));
        const clampedZ = Math.max(0, Math.min(1, normalizedZ));
        
        // Enhanced sampling for North Pacific seamount data
        const pixelX = clampedX * (this.heightmapData.width - 1);
        const pixelY = clampedZ * (this.heightmapData.height - 1);
        
        const centerX = Math.round(pixelX);
        const centerY = Math.round(pixelY);
        
        // 5x5 weighted average for Hawaiian-Emperor Chain precision
        const getPixelDepth = (x, y) => {
            x = Math.max(0, Math.min(this.heightmapData.width - 1, x));
            y = Math.max(0, Math.min(this.heightmapData.height - 1, y));
            
            const index = (y * this.heightmapData.width + x) * 4;
            const r = this.heightmapData.data[index];
            const g = this.heightmapData.data[index + 1];
            const b = this.heightmapData.data[index + 2];
            return this.northPacificDepthFromRGB(r, g, b);
        };
        
        // Enhanced 5x5 Gaussian weighted sampling
        let totalDepth = 0;
        let totalWeight = 0;
        
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const distance = Math.sqrt(dx*dx + dy*dy);
                const weight = distance === 0 ? 9 : 
                              distance === 1 ? 6 : 
                              distance <= Math.sqrt(2) ? 4 :
                              distance <= Math.sqrt(5) ? 2 : 1;
                
                const depth = getPixelDepth(centerX + dx, centerY + dy);
                totalDepth += depth * weight;
                totalWeight += weight;
            }
        }
        
        return totalDepth / totalWeight;
    }
    
    northPacificDepthFromRGB(r, g, b) {
        // NOAA/GEBCO depth encoding for Hawaiian-Emperor Chain region
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        
        let depth;
        
        if (brightness > 0.8) {
            // Seamount peaks and volcanic ridges (500-1500m)
            depth = -500 - (0.8 - brightness) * 5000;
        } else if (brightness > 0.6) {
            // Upper seamount slopes (1500-3000m)
            depth = -1500 - (0.8 - brightness) * 7500;
        } else if (brightness > 0.4) {
            // Mid-ocean ridges and volcanic fields (3000-4500m)
            depth = -3000 - (0.6 - brightness) * 7500;
        } else if (brightness > 0.2) {
            // Abyssal plains (4500-5500m)
            depth = -4500 - (0.4 - brightness) * 5000;
        } else {
            // Deep trenches and fracture zones (5500-6000m+)
            depth = -5500 - (0.2 - brightness) * 2500;
        }
        
        // North Pacific seamount variation
        const seamountVariation = Math.sin(r * 0.1) * Math.cos(g * 0.1) * 15;
        
        return depth + seamountVariation;
    }
    
    getHawaiianEmperorDepth(worldX, worldZ) {
        // Hawaiian-Emperor Chain seamount modeling
        const distanceFromCenter = Math.sqrt(worldX * worldX + worldZ * worldZ);
        const normalizedDistance = distanceFromCenter / 50000;
        
        // Seamount chain profile
        if (normalizedDistance < 0.2) {
            // Seamount peaks (800-2000m) - closer to surface
            return -800 - Math.random() * 1200;
        } else if (normalizedDistance < 0.5) {
            // Seamount flanks (2000-3500m)
            return -2000 - Math.random() * 1500;
        } else if (normalizedDistance < 0.8) {
            // Transitional slopes (3500-4500m)
            return -3500 - Math.random() * 1000;
        } else {
            // Abyssal plains (4500-5800m)
            return -4500 - Math.random() * 1300;
        }
    }
    
    getSeabedHeight(worldX, worldZ) {
        return this.getTerrainHeight(worldX, worldZ);
    }
    
    validateNOAAData() {
        if (!this.loaded) {
            console.log('⚠️ North Pacific data not loaded for validation');
            return false;
        }
        
        console.log('🔍 Validating North Pacific bathymetric data...');
        
        const testPoints = [
            { x: 0, z: 0, expectedRange: [-2000, -800] },        // Center (seamount region)
            { x: 25000, z: 25000, expectedRange: [-5800, -3500] }, // Edge (abyssal plain)
            { x: -25000, z: -25000, expectedRange: [-5800, -3500] } // Opposite edge
        ];
        
        let validPoints = 0;
        
        testPoints.forEach((point, i) => {
            const depth = this.getTerrainHeight(point.x, point.z);
            const isValid = depth >= point.expectedRange[0] && depth <= point.expectedRange[1];
            
            console.log(`   Point ${i+1}: ${point.x}, ${point.z} = ${depth.toFixed(0)}m ${isValid ? '✅' : '❌'}`);
            
            if (isValid) validPoints++;
        });
        
        const isValid = validPoints === testPoints.length;
        console.log(`🔍 North Pacific validation: ${isValid ? '✅ PASSED' : '❌ FAILED'} (${validPoints}/${testPoints.length} points valid)`);
        
        return isValid;
    }
}

// Export for use in ocean.js
window.NorthPacificBathymetryTerrain = NorthPacificBathymetryTerrain;

// North Pacific data source information
window.NORTH_PACIFIC_DATA_INFO = {
    source: 'GEBCO 2025 - North Pacific Grid',
    location: 'Hawaiian-Emperor Chain, North Pacific',
    coordinates: '25.72°N, 167.35°W',
    coverage: '100km × 100km',
    resolution: '15 arc-second (~450m)',
    features: 'Seamount chain, volcanic ridges, abyssal plains',
    downloadUrl: 'https://download.gebco.net/',
    citation: 'GEBCO Compilation Group (2025) GEBCO 2025 Grid'
};

console.log('📚 North Pacific Hawaiian-Emperor Chain Bathymetry System loaded');