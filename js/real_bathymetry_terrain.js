// Real Bathymetry Terrain System
// Loads Google Earth bathymetry data and converts to submarine terrain

class RealBathymetryTerrain {
    constructor() {
        this.terrainSize = 200000; // 200km x 200km (expanded for full canyon visibility)
        this.heightmapCanvas = null;
        this.heightmapContext = null;
        this.heightmapData = null;
        this.loaded = false;
        
        console.log('🌊 Initializing Real Bathymetry Terrain System...');
    }
    
    async loadBathymetryData() {
        return new Promise((resolve, reject) => {
            console.log('📡 Loading bathymetry image data...');
            
            const img = new Image();
            img.onload = () => {
                console.log(`✅ Bathymetry image loaded: ${img.width}x${img.height}`);
                
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
                
                console.log('🗺️ Bathymetry data processed and ready');
                resolve();
            };
            
            img.onerror = () => {
                console.error('❌ Failed to load bathymetry image');
                reject(new Error('Could not load bathymetry image'));
            };
            
            // Use data URL to avoid CORS issues
            if (window.BATHYMETRY_DATA_URL) {
                img.src = window.BATHYMETRY_DATA_URL;
            } else {
                console.error('❌ Bathymetry data URL not found - make sure bathymetry_data.js is loaded');
                reject(new Error('Bathymetry data URL not available'));
                return;
            }
        });
    }
    
    getTerrainHeight(worldX, worldZ) {
        if (!this.loaded || !this.heightmapData) {
            return -1000; // Default depth while loading
        }
        
        // Convert world coordinates to image coordinates
        const halfSize = this.terrainSize / 2;
        const normalizedX = (worldX + halfSize) / this.terrainSize; // 0-1
        const normalizedZ = (worldZ + halfSize) / this.terrainSize; // 0-1
        
        // Clamp to image bounds
        const clampedX = Math.max(0, Math.min(1, normalizedX));
        const clampedZ = Math.max(0, Math.min(1, normalizedZ));
        
        // Use a larger sampling area for extra smoothness (3x3 kernel)
        const pixelX = clampedX * (this.heightmapData.width - 1);
        const pixelY = clampedZ * (this.heightmapData.height - 1);
        
        const centerX = Math.round(pixelX);
        const centerY = Math.round(pixelY);
        
        // Sample 9 points in a 3x3 grid for ultra-smooth averaging
        const getPixelDepth = (x, y) => {
            // Clamp to image bounds
            x = Math.max(0, Math.min(this.heightmapData.width - 1, x));
            y = Math.max(0, Math.min(this.heightmapData.height - 1, y));
            
            const index = (y * this.heightmapData.width + x) * 4;
            const r = this.heightmapData.data[index];
            const g = this.heightmapData.data[index + 1];
            const b = this.heightmapData.data[index + 2];
            return this.rgbToDepth(r, g, b);
        };
        
        // 3x3 Gaussian-like weighted average for maximum smoothness
        let totalDepth = 0;
        let totalWeight = 0;
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const weight = (dx === 0 && dy === 0) ? 4 : (dx === 0 || dy === 0) ? 2 : 1; // Center weighted
                const depth = getPixelDepth(centerX + dx, centerY + dy);
                totalDepth += depth * weight;
                totalWeight += weight;
            }
        }
        
        return totalDepth / totalWeight; // Weighted average for smooth terrain
    }
    
    rgbToDepth(r, g, b) {
        // Extremely gentle depth mapping to match smooth Google Earth bathymetry
        // The original image shows gentle rolling underwater hills, not sharp peaks
        
        // Convert RGB to grayscale for depth estimation
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        
        // Very gentle depth range - more like the original smooth bathymetry
        // Linear mapping with much smaller depth variations
        let depth;
        
        if (brightness > 0.6) {
            // Lightest areas - shallow underwater ridges (400-1200m)
            depth = -400 - (0.6 - brightness) * 2000; // Very gentle slope
        } else if (brightness > 0.4) {
            // Medium areas - typical ocean floor (1200-2500m)
            depth = -1200 - (0.6 - brightness) * 6500; // Gradual transition
        } else if (brightness > 0.25) {
            // Darker areas - deeper ocean (2500-4000m)
            depth = -2500 - (0.4 - brightness) * 10000; // Still gentle
        } else {
            // Darkest areas - deepest parts (4000-5000m)
            depth = -4000 - (0.25 - brightness) * 4000; // Minimal deep variation
        }
        
        // NO artificial variation - let the original image data speak for itself
        return depth;
    }
    
    getSeabedHeight(worldX, worldZ) {
        return this.getTerrainHeight(worldX, worldZ);
    }
    
    // Create debug visualization
    createDebugVisualization() {
        if (!this.heightmapCanvas) return null;
        
        // Create a visualization canvas showing the interpreted depths
        const debugCanvas = document.createElement('canvas');
        debugCanvas.width = 400;
        debugCanvas.height = 400;
        const debugCtx = debugCanvas.getContext('2d');
        
        const imageData = debugCtx.createImageData(400, 400);
        
        for (let y = 0; y < 400; y++) {
            for (let x = 0; x < 400; x++) {
                const worldX = (x / 400 - 0.5) * this.terrainSize;
                const worldZ = (y / 400 - 0.5) * this.terrainSize;
                const depth = this.getTerrainHeight(worldX, worldZ);
                
                // Convert depth to color for visualization
                const normalizedDepth = Math.max(0, Math.min(1, (-depth) / 6000));
                const color = Math.floor(normalizedDepth * 255);
                
                const index = (y * 400 + x) * 4;
                imageData.data[index] = color;     // R
                imageData.data[index + 1] = color; // G  
                imageData.data[index + 2] = 255;   // B
                imageData.data[index + 3] = 255;   // A
            }
        }
        
        debugCtx.putImageData(imageData, 0, 0);
        return debugCanvas;
    }
}

// Export for use in ocean.js
window.RealBathymetryTerrain = RealBathymetryTerrain;