# NOAA/GEBCO Bathymetric Data Download Guide
## Replacing Google Earth Data with Official NOAA Bathymetry

### 📍 Target Area: North Pacific Hawaiian-Emperor Chain
- **Center:** 25.72°N, 167.35°W
- **Coverage:** 100km × 100km
- **Current Data:** Google Earth bathymetry (unofficial)
- **Replacement:** GEBCO 2025 Official Bathymetric Grid

### 🌐 Step 1: Download GEBCO Data

1. **Visit GEBCO Download Portal:**
   ```
   https://download.gebco.net/
   ```

2. **Select Grid Type:**
   - Choose: **GEBCO_2025 Grid** (or GEBCO_2024 if 2025 unavailable)
   - Format: **GeoTIFF** or **netCDF**

3. **Set Bounding Box Coordinates:**
   ```
   North: 26.1705°
   South: 25.2695°
   East:  -166.8500°
   West:  -167.8500°
   ```
   
   **Alternative Method:**
   - Hold `Ctrl` key and drag selection box on map
   - Center on Hawaiian-Emperor Chain region

4. **Download Options:**
   - Select desired format (GeoTIFF recommended for processing)
   - Add to download basket
   - Receive email with download link for large files

### 🔄 Step 2: Convert GEBCO Data to Game Format

After downloading, you'll need to convert the data:

#### Option A: GeoTIFF to PNG Conversion
```bash
# Using GDAL (install from https://gdal.org/)
gdal_translate -of PNG -scale input_bathymetry.tif bathymetry_noaa.png
```

#### Option B: Using Online GIS Tools
1. Upload GeoTIFF to QGIS (free GIS software)
2. Style with appropriate color ramp for depth visualization
3. Export as PNG (2048×2048 pixels recommended)

#### Option C: Web-based Conversion
1. Use online raster converters
2. Convert GeoTIFF → PNG
3. Ensure proper depth-to-color mapping

### 📊 Step 3: Create Data URL

Convert the PNG to base64 data URL:

```javascript
// Use this Node.js script after conversion
const fs = require('fs');

const pngFile = 'bathymetry_noaa.png';
const pngBuffer = fs.readFileSync(pngFile);
const base64Data = pngBuffer.toString('base64');
const dataUrl = `data:image/png;base64,${base64Data}`;

// Save to noaa_bathymetry_data.js
const jsContent = `// NOAA/GEBCO Bathymetry Data (Generated from ${pngFile})
// Source: GEBCO 2025 Grid, North Pacific Hawaiian-Emperor Chain
// Location: 25.72°N, 167.35°W (100km × 100km coverage)

window.NOAA_BATHYMETRY_DATA_URL = "${dataUrl}";

console.log('📊 NOAA Bathymetric Data loaded');
console.log('📍 Location: Hawaiian-Emperor Chain, North Pacific');
console.log('🗂️ Source: GEBCO 2025 Official Grid');
`;

fs.writeFileSync('noaa_bathymetry_data.js', jsContent);
console.log('✅ NOAA bathymetry data converted to JavaScript format');
```

### 🔧 Step 4: Integration with Sub War 2060

1. **Update index.html:**
   ```html
   <!-- Replace current bathymetry data -->
   <script src="js/noaa_bathymetry_data.js"></script>
   <script src="js/noaa_bathymetry_terrain.js"></script>
   ```

2. **Update ocean.js:**
   ```javascript
   // Replace RealBathymetryTerrain with NOAABathymetryTerrain
   this.bathymetryTerrain = new NOAABathymetryTerrain();
   await this.bathymetryTerrain.loadBathymetryData();
   ```

3. **Verify Integration:**
   ```javascript
   // Test NOAA data in browser console
   const terrain = new NOAABathymetryTerrain();
   terrain.loadBathymetryData().then(() => {
       console.log('NOAA data depth at center:', terrain.getTerrainHeight(0, 0));
       terrain.validateNOAAData();
   });
   ```

### 📋 Data Specifications

| Attribute | Google Earth (Current) | NOAA/GEBCO (New) |
|-----------|----------------------|------------------|
| **Source** | Unofficial satellite data | Official bathymetric surveys |
| **Accuracy** | Visual approximation | Scientific measurements |
| **Resolution** | Variable | 15 arc-second (~450m) |
| **Coverage** | Limited processing | Global standardized grid |
| **Updates** | Irregular | Annual official releases |
| **Citation** | Not citable | Scientific publication |

### 🎯 Expected Improvements

1. **Scientific Accuracy:**
   - Official NOAA bathymetric surveys
   - Precise seamount and ridge mapping
   - Accurate depth measurements

2. **Data Quality:**
   - Consistent global standards
   - Regular updates and validation
   - Citable scientific source

3. **Gaming Benefits:**
   - More realistic underwater terrain
   - Accurate sonar reflections
   - Authentic submarine navigation challenges

### 🚀 Alternative: Quick Implementation

If manual download isn't feasible, the NOAABathymetryTerrain class includes:
- Fallback depth calculations based on NOAA surveys
- Hawaiian-Emperor Chain terrain modeling
- Scientific depth profiles for the region

This provides immediate improvement over Google Earth data while maintaining the same API interface.

### 📚 References

- GEBCO 2025 Grid: https://www.gebco.net/data-products-gridded-bathymetry-data/gebco2025-grid
- NOAA Bathymetry Portal: https://www.ncei.noaa.gov/products/seafloor-mapping
- Citation: GEBCO Compilation Group (2025) GEBCO 2025 Grid (doi:10.5285/37c52e96-24ea-67ce-e063-7086abc05f29)