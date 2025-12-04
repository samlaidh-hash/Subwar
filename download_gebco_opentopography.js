// Download GEBCO Bathymetric Data via OpenTopography API
// For Sub War 2060 North Pacific area (100km x 100km)

const https = require('https');
const fs = require('fs');
const path = require('path');

// Bounding box coordinates for North Pacific near Hawaiian-Emperor Chain
const boundingBox = {
    north: 26.1705,   // 26.17°N  
    south: 25.2695,   // 25.27°N
    east: -166.8500,  // 166.85°W
    west: -167.8500   // 167.85°W
};

// OpenTopography API endpoint for GEBCO data
const API_BASE = 'https://portal.opentopography.org/API/globaldem';

// Note: You might need to register for a free API key at https://portal.opentopography.org/
const API_KEY = 'demoapikey'; // Replace with actual API key if needed

const params = new URLSearchParams({
    demtype: 'GEBCO2025',  // or GEBCO2024 if 2025 not available
    south: boundingBox.south,
    north: boundingBox.north,
    west: boundingBox.west,
    east: boundingBox.east,
    outputFormat: 'GTiff', // GeoTIFF format
    API_Key: API_KEY
});

const downloadUrl = `${API_BASE}?${params}`;

console.log('Downloading GEBCO bathymetric data...');
console.log('Area: North Pacific, Hawaiian-Emperor Chain');
console.log(`Bounds: ${boundingBox.south}°N to ${boundingBox.north}°N, ${Math.abs(boundingBox.east)}°W to ${Math.abs(boundingBox.west)}°W`);
console.log('Source: GEBCO via OpenTopography API');
console.log(`URL: ${downloadUrl}`);
console.log('');

// Download the data
const outputFile = path.join(__dirname, 'north_pacific_gebco_bathymetry.tif');

const file = fs.createWriteStream(outputFile);

https.get(downloadUrl, (response) => {
    if (response.statusCode === 200) {
        console.log('✅ Download started...');
        
        let downloadedBytes = 0;
        const totalBytes = parseInt(response.headers['content-length'] || '0');
        
        response.on('data', (chunk) => {
            downloadedBytes += chunk.length;
            if (totalBytes > 0) {
                const progress = ((downloadedBytes / totalBytes) * 100).toFixed(1);
                process.stdout.write(`\rProgress: ${progress}% (${downloadedBytes}/${totalBytes} bytes)`);
            }
        });
        
        response.pipe(file);
        
        response.on('end', () => {
            console.log('\n✅ Download complete!');
            console.log(`📁 Saved as: ${outputFile}`);
            console.log(`📏 File size: ${downloadedBytes} bytes`);
            console.log('');
            console.log('Next steps:');
            console.log('1. Convert GeoTIFF to JavaScript data format');
            console.log('2. Replace current bathymetry_data.js with new NOAA data');
            console.log('3. Update real_bathymetry_terrain.js if needed');
        });
        
    } else if (response.statusCode === 401) {
        console.log('❌ API Key required. Please register at https://portal.opentopography.org/ for free API access');
        
    } else if (response.statusCode === 404) {
        console.log('❌ GEBCO2025 not available, trying GEBCO2024...');
        
        // Retry with GEBCO2024
        const params2024 = new URLSearchParams({
            demtype: 'GEBCO2024',
            south: boundingBox.south,
            north: boundingBox.north,
            west: boundingBox.west,
            east: boundingBox.east,
            outputFormat: 'GTiff',
            API_Key: API_KEY
        });
        
        const downloadUrl2024 = `${API_BASE}?${params2024}`;
        console.log(`Trying: ${downloadUrl2024}`);
        
        // Recursive call with 2024 data
        https.get(downloadUrl2024, (response2024) => {
            if (response2024.statusCode === 200) {
                console.log('✅ GEBCO2024 download started...');
                response2024.pipe(file);
            } else {
                console.log(`❌ Failed with status: ${response2024.statusCode}`);
                console.log('Manual download required from https://download.gebco.net/');
            }
        });
        
    } else {
        console.log(`❌ Failed with status: ${response.statusCode} ${response.statusMessage}`);
        console.log('Manual download required from https://download.gebco.net/');
    }
    
}).on('error', (err) => {
    console.error('❌ Download error:', err.message);
    console.log('Manual download required from https://download.gebco.net/');
});