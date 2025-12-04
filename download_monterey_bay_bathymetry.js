// Download NOAA/GEBCO Bathymetric Data for Monterey Bay Canyon
// Location: Monterey Bay, California (36.663277°N, 122.388124°W)

// Monterey Bay Canyon center coordinates (user specified)
const centerLat = 36.663277;      // North latitude (precise Monterey Bay location)
const centerLon = -122.388124;    // West longitude (precise Monterey Bay location)

// Calculate bounding box for 100km x 100km area
// At this latitude, 1 degree latitude ≈ 111 km
// 1 degree longitude ≈ 111 km * cos(latitude) ≈ 111 km * cos(36.663277°) ≈ 89.5 km
const latRange = 100 / 111;  // ~0.9 degrees
const lonRange = 100 / (111 * Math.cos(centerLat * Math.PI / 180));  // ~1.1 degrees

const boundingBox = {
    north: centerLat + (latRange / 2),   // 37.25°N
    south: centerLat - (latRange / 2),   // 36.35°N
    east: centerLon + (lonRange / 2),    // -121.45°W
    west: centerLon - (lonRange / 2)     // -122.55°W
};

console.log('GEBCO Download Parameters for Monterey Bay Canyon:');
console.log('==================================================');
console.log(`Location: Monterey Bay Canyon, California`);
console.log(`Center: ${centerLat}°N, ${Math.abs(centerLon)}°W`);
console.log(`Area: 100km × 100km`);
console.log('');
console.log('Monterey Canyon Features:');
console.log('• Largest submarine canyon on Pacific coast');
console.log('• Depth: 0m to 3,885m (12,743 feet)');
console.log('• Length: 470km (292 miles)');
console.log('• Width: Up to 12km');
console.log('• Canyon walls: 1.6km (1 mile) high');
console.log('• Features: Canyon head, tributaries, submarine fan');
console.log('');
console.log('Bounding Box Coordinates:');
console.log(`  North: ${boundingBox.north.toFixed(4)}°`);
console.log(`  South: ${boundingBox.south.toFixed(4)}°`);
console.log(`  East:  ${boundingBox.east.toFixed(4)}°`);
console.log(`  West:  ${boundingBox.west.toFixed(4)}°`);
console.log('');
console.log('NOAA Official Data Available:');
console.log('• NOAA NOS Estuarine Bathymetry - Monterey Bay (P080)');
console.log('• USGS California State Waters Map Series');
console.log('• 1/3 arc-second resolution DEM');
console.log('• Coordinates: West -122.0301, East -121.7800, South 36.5999, North 36.9801');
console.log('');
console.log('GEBCO Download URL:');
console.log('https://download.gebco.net/');
console.log('');
console.log('Steps:');
console.log('1. Select GEBCO_2025 Grid');
console.log('2. Select format: netCDF or GeoTIFF');
console.log('3. Enter coordinates above in bounding box fields');
console.log('4. Download and save as: monterey_bay_canyon_bathymetry_100km.nc');

// Alternative: Direct download URLs (if GEBCO supports them)
const downloadParams = new URLSearchParams({
    format: 'netcdf',
    north: boundingBox.north,
    south: boundingBox.south,
    east: boundingBox.east,
    west: boundingBox.west
});

console.log('');
console.log('Alternative Direct Download (if supported):');
console.log(`https://www.gebco.net/data_and_products/gridded_bathymetry_data/gebco_2025/download/gebco_2025.nc?${downloadParams}`);

console.log('');
console.log('Monterey Canyon Depth Profile:');
console.log('• Shallow shelf: 0-100m (nearshore)');
console.log('• Canyon head: 100-500m (Moss Landing area)');
console.log('• Upper canyon: 500-1500m (steep walls)');
console.log('• Mid canyon: 1500-2500m (meandering channel)');
console.log('• Lower canyon: 2500-3500m (wider profile)');
console.log('• Abyssal fan: 3500-3885m (maximum depth)');