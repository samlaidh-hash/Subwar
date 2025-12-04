// Download NOAA/GEBCO Bathymetric Data for Sub War 2060
// Location: North Pacific (25.72°N, 167.35°W) near Hawaiian-Emperor Chain

// Calculate bounding box for 100km x 100km area
const centerLat = 25.72;    // North latitude
const centerLon = -167.35;  // West longitude (negative for western hemisphere)

// At this latitude, 1 degree latitude ≈ 111 km
// 1 degree longitude ≈ 111 km * cos(latitude) ≈ 111 km * cos(25.72°) ≈ 100.4 km
const latRange = 100 / 111;  // ~0.9 degrees
const lonRange = 100 / (111 * Math.cos(centerLat * Math.PI / 180));  // ~1.0 degrees

const boundingBox = {
    north: centerLat + (latRange / 2),   // 26.17°N
    south: centerLat - (latRange / 2),   // 25.27°N
    east: centerLon + (lonRange / 2),    // -166.85°W
    west: centerLon - (lonRange / 2)     // -167.85°W
};

console.log('GEBCO Download Parameters for Sub War 2060:');
console.log('===========================================');
console.log(`Location: North Pacific, Hawaiian-Emperor Chain region`);
console.log(`Center: ${centerLat}°N, ${Math.abs(centerLon)}°W`);
console.log(`Area: 100km × 100km`);
console.log('');
console.log('Bounding Box Coordinates:');
console.log(`  North: ${boundingBox.north.toFixed(4)}°`);
console.log(`  South: ${boundingBox.south.toFixed(4)}°`);
console.log(`  East:  ${boundingBox.east.toFixed(4)}°`);
console.log(`  West:  ${boundingBox.west.toFixed(4)}°`);
console.log('');
console.log('GEBCO Download URL:');
console.log('https://download.gebco.net/');
console.log('');
console.log('Steps:');
console.log('1. Select GEBCO_2025 Grid');
console.log('2. Select format: netCDF or GeoTIFF');
console.log('3. Enter coordinates above in bounding box fields');
console.log('4. Download and save as: north_pacific_bathymetry_100km.nc');

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