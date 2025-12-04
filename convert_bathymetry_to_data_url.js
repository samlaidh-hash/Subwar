const fs = require('fs');
const path = require('path');

// Convert bathymetry PNG to data URL to avoid CORS issues
function convertBathymetryToDataURL() {
    console.log('🔄 Converting bathymetry image to data URL...');
    
    const imagePath = path.join(__dirname, 'inspirations', 'bathymetry_map.png');
    
    if (!fs.existsSync(imagePath)) {
        console.error('❌ Bathymetry image not found at:', imagePath);
        return;
    }
    
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const dataURL = `data:image/png;base64,${base64Image}`;
    
    console.log(`✅ Image converted to data URL (${Math.round(dataURL.length / 1024)}KB)`);
    
    // Create a JavaScript file with the data URL
    const jsContent = `// Bathymetry data URL (generated from bathymetry_map.png)
window.BATHYMETRY_DATA_URL = "${dataURL}";
console.log('📊 Bathymetry data URL loaded (${Math.round(dataURL.length / 1024)}KB)');
`;
    
    const outputPath = path.join(__dirname, 'js', 'bathymetry_data.js');
    fs.writeFileSync(outputPath, jsContent);
    
    console.log('✅ Bathymetry data URL saved to:', outputPath);
    console.log('💡 Add this script tag to index.html: <script src="js/bathymetry_data.js"></script>');
}

convertBathymetryToDataURL();