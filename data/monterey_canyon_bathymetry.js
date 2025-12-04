// Monterey Bay Canyon Bathymetry Data
// Simplified bathymetric data for the Monterey Canyon system

window.MONTEREY_CANYON_BATHYMETRY = {
    // Coverage area: Monterey Bay to Canyon system (200km x 200km)
    bounds: {
        north: 37.0,  // 37°N
        south: 36.0,  // 36°N  
        east: -121.0, // 121°W
        west: -122.0  // 122°W
    },
    
    // Simplified depth function for Monterey Canyon
    getDepth: function(worldX, worldZ) {
        // Convert world coordinates (±100km) to normalized coordinates
        const halfSize = 100000; // 100km radius
        const normalizedX = (worldX + halfSize) / (halfSize * 2); // 0-1
        const normalizedZ = (worldZ + halfSize) / (halfSize * 2); // 0-1
        
        // Clamp to bounds
        const x = Math.max(0, Math.min(1, normalizedX));
        const z = Math.max(0, Math.min(1, normalizedZ));
        
        // Create canyon-like bathymetry
        // Center channel represents the main Monterey Canyon
        const centerX = 0.5;
        const centerZ = 0.3; // Canyon runs roughly north-south, offset from center
        
        // Distance from canyon center line
        const distanceFromCanyon = Math.abs(x - centerX);
        const distanceAlongCanyon = Math.abs(z - centerZ);
        
        // Base depth varies with distance from shore (z coordinate)
        const shorelineDepth = -100;   // 100m near shore (z=0)
        const abyssalDepth = -4000;    // 4000m in deep water (z=1)
        const baseDepth = shorelineDepth + (abyssalDepth - shorelineDepth) * z;
        
        // Canyon carving - deeper channel in center
        let canyonDepth = 0;
        if (distanceFromCanyon < 0.1) { // Within canyon walls
            const canyonFactor = (0.1 - distanceFromCanyon) / 0.1;
            // Canyon gets deeper as it goes offshore
            const maxCanyonDepth = -1500 * (0.5 + z); // Up to 1500m additional depth offshore
            canyonDepth = maxCanyonDepth * canyonFactor * canyonFactor; // Squared for sharper walls
        }
        
        // Add some underwater hills and seamounts
        const hillNoise = Math.sin(x * 8) * Math.cos(z * 6) * 200; // ±200m variation
        const seamountNoise = Math.sin(x * 3) * Math.sin(z * 4) * 300; // ±300m variation
        
        // Combine all depth components
        const totalDepth = baseDepth + canyonDepth + hillNoise + seamountNoise;
        
        return Math.min(-50, totalDepth); // Never shallower than 50m
    }
};

// Set up the data URL for the terrain system
console.log('📊 Loading local Monterey Canyon bathymetry data...');