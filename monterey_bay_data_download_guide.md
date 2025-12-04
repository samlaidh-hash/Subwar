# Monterey Bay Canyon NOAA/GEBCO Bathymetric Data Download Guide
## Centered at 36.663277°N, 122.388124°W

### 📍 Target Area: Monterey Bay Canyon, California
- **Center:** 36.663277°N, 122.388124°W
- **Coverage:** 100km × 100km
- **Features:** Largest Pacific submarine canyon, continental shelf, abyssal fan
- **Max Depth:** 3,885m (12,743 feet)
- **Canyon Length:** 470km (292 miles)

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
   North: 37.1137°
   South: 36.2128°
   East:  -121.8266°
   West:  -122.9497°
   ```
   
   **Alternative Method:**
   - Hold `Ctrl` key and drag selection box on map
   - Center on Monterey Bay Canyon region

4. **Download Options:**
   - Select desired format (GeoTIFF recommended for processing)
   - Add to download basket
   - Receive email with download link for large files

### 🏔️ Monterey Canyon Features Covered

#### **Bathymetric Zones:**
- **Continental Shelf**: 0-100m depth (nearshore California coast)
- **Canyon Head**: 100-500m depth (Moss Landing area - dramatic drop)
- **Upper Canyon**: 500-1500m depth (steep canyon walls)
- **Mid Canyon**: 1500-2500m depth (meandering channel)
- **Lower Canyon**: 2500-3500m depth (wider canyon profile)
- **Abyssal Fan**: 3500-3885m depth (maximum depth, submarine fan)

#### **Geological Features:**
- **Submarine Canyon**: Largest on Pacific coast, Grand Canyon-sized
- **Canyon Tributaries**: Soquel Canyon and Carmel Canyon
- **Steep Walls**: 1.6km (1 mile) vertical relief
- **Continental Slope**: Dramatic depth transitions
- **Sediment Fan**: Deep-sea deposition zone

### 🔄 Step 2: Convert GEBCO Data to Game Format

After downloading, you'll need to convert the data:

#### Option A: GeoTIFF to PNG Conversion
```bash
# Using GDAL (install from https://gdal.org/)
gdal_translate -of PNG -scale input_monterey_canyon.tif monterey_canyon_bathymetry.png
```

#### Option B: Using QGIS (Recommended for Canyon Data)
1. Download QGIS (free GIS software)
2. Load GeoTIFF with proper canyon depth styling
3. Style with blue-to-white gradient for depth visualization
4. Export as PNG (2048×2048 pixels recommended)
5. Ensure proper canyon wall contrast

#### Option C: NOAA Direct Data
1. Visit NOAA Monterey Bay P080 dataset
2. Download 1/3 arc-second DEM directly
3. Process with GIS tools for canyon visualization

### 📊 Step 3: Create Data URL

Convert the PNG to base64 data URL:

```javascript
// Use this Node.js script after conversion
const fs = require('fs');

const pngFile = 'monterey_canyon_bathymetry.png';
const pngBuffer = fs.readFileSync(pngFile);
const base64Data = pngBuffer.toString('base64');
const dataUrl = `data:image/png;base64,${base64Data}`;

// Save to monterey_bay_bathymetry_data.js
const jsContent = `// Monterey Bay Canyon NOAA/GEBCO Bathymetry Data
// Source: GEBCO 2025 Grid, Monterey Bay Canyon, California
// Location: 36.663277°N, 122.388124°W (100km × 100km coverage)
// Features: Submarine canyon, continental shelf, canyon tributaries

window.MONTEREY_BAY_BATHYMETRY_DATA_URL = "${dataUrl}";

console.log('📊 Monterey Bay Canyon Bathymetric Data loaded');
console.log('📍 Location: Monterey Bay Canyon, California');
console.log('🏔️ Max Depth: 3,885m (12,743 feet)');
console.log('🗂️ Source: GEBCO 2025 Official Grid');
`;

fs.writeFileSync('monterey_bay_bathymetry_data.js', jsContent);
console.log('✅ Monterey Bay canyon data converted to JavaScript format');
```

### 🔧 Step 4: Integration with Sub War 2060

1. **Create Monterey Bay Data File:**
   ```html
   <!-- Add to HTML -->
   <script src="js/monterey_bay_bathymetry_data.js"></script>
   <script src="js/monterey_bay_bathymetry_terrain.js"></script>
   ```

2. **Use Monterey Bay Map:**
   ```html
   <!-- Launch Monterey Bay Canyon game -->
   <script>
       window.NOAABathymetryTerrain = window.MontereyBayBathymetryTerrain;
       initGame();
   </script>
   ```

3. **Verify Canyon Integration:**
   ```javascript
   // Test Monterey Canyon data in browser console
   const canyon = new MontereyBayBathymetryTerrain();
   canyon.loadBathymetryData().then(() => {
       console.log('Canyon head depth:', canyon.getTerrainHeight(0, 20000));
       console.log('Max canyon depth:', canyon.getTerrainHeight(0, -40000));
       canyon.validateNOAAData();
   });
   ```

### 📋 Data Specifications

| Attribute | Previous System | Monterey Bay Canyon (New) |
|-----------|----------------|---------------------------|
| **Location** | Generic Pacific | Monterey Bay Canyon, CA |
| **Coordinates** | Approximate | 36.663277°N, 122.388124°W |
| **Features** | Basic seamounts | Submarine canyon system |
| **Max Depth** | ~6000m | 3,885m (realistic canyon) |
| **Terrain** | Smooth transitions | Steep canyon walls |
| **Geology** | Generic | Continental shelf + canyon |
| **Realism** | Approximated | NOAA surveyed canyon |

### 🎯 Expected Gaming Improvements

1. **Canyon Navigation:**
   - Dramatic depth changes from shelf to canyon
   - Realistic canyon wall sonar reflections
   - Complex 3D underwater terrain

2. **Tactical Advantages:**
   - Canyon walls provide sonar masking
   - Multiple depth layers for submarine tactics
   - Realistic continental shelf operations

3. **Environmental Realism:**
   - Authentic California coast bathymetry
   - Real submarine canyon characteristics
   - NOAA-accurate depth profiles

### 🚀 Quick Implementation

The MontereyBayBathymetryTerrain class provides immediate canyon modeling:
- Fallback canyon depth calculations
- Continental shelf to abyssal transitions
- Canyon head dramatic depth drops
- Steep wall sonar characteristics

### 📚 References

- **GEBCO 2025 Grid**: https://www.gebco.net/data-products-gridded-bathymetry-data/gebco2025-grid
- **NOAA Monterey Bay P080**: https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ngdc.mgg.dem:monterey_bay_P080_2018
- **USGS Canyon Maps**: https://pubs.usgs.gov/publication/ofr20161072
- **Citation**: GEBCO Compilation Group (2025) GEBCO 2025 Grid

### 🗺️ File Structure

```
Sub War 2060/
├── monterey_bay_canyon.html              # Main Monterey Bay game
├── test_monterey_bay_bathymetry.html      # Canyon test suite
├── js/
│   ├── monterey_bay_bathymetry_terrain.js # Canyon system
│   └── monterey_bay_bathymetry_data.js    # Data URL (after download)
└── monterey_bay_data_download_guide.md   # This guide
```

The system is ready for immediate use with realistic canyon fallback profiles, providing a dramatic submarine canyon environment centered precisely at the requested coordinates.