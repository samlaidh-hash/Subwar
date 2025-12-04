# Oolite Model Integration for Sub War 2060

## Overview
Complete system for extracting, converting, and using Oolite spaceship models in the Sub War 2060 Three.js submarine game.

## 🎯 What This System Does

1. **Parses Oolite .dat files** - Reads vertex, face, and texture data
2. **Converts to Three.js format** - Optimizes for web browser performance  
3. **Integrates with game** - Spawns ships as enemies, adds to sonar contacts
4. **Provides game controls** - Keyboard shortcuts for spawning and managing ships

## 📁 File Structure

```
Sub War 2060/
├── oolite_dat_parser.js         # Core parser for .dat files
├── js/oolite_loader.js          # Three.js integration
├── convert_oolite_models.js     # Command-line converter
├── test_oolite_system.js        # Test suite
├── demo_oolite_integration.js   # Game demo integration
├── models/                      # Model storage
│   ├── test_ship.dat           # Sample ship model
│   ├── test_ship.json          # Converted model
│   ├── test_cube.dat           # Sample cube model
│   └── test_cube.json          # Converted cube
└── OOLITE_INTEGRATION.md       # This documentation
```

## 🚀 Quick Start

### 1. Convert Oolite Models
```bash
# Convert single model
node convert_oolite_models.js ship.dat models/ship.json

# Batch convert directory
node convert_oolite_models.js --batch ./oolite_ships/ --maxsize=15

# Create sample model for testing
node convert_oolite_models.js --sample test.dat
```

### 2. Load Models in Game
```javascript
// Get the loader
const loader = window.getOoliteLoader();

// Load single ship
const ship = await loader.loadModel('models/ship.json', {
    scale: 1.0,
    position: {x: 100, y: 0, z: 50},
    name: 'enemy_ship_1'
});

// Load fleet
const fleetConfig = [
    {
        path: 'models/cobra.json',
        scale: 1.2,
        position: {x: 200, y: 20, z: 100},
        enemyType: 'fighter'
    }
];
const fleet = await loader.loadFleet(fleetConfig);
```

### 3. Game Integration
```javascript
// Initialize demo (automatic on game load)
await initOoliteDemo();

// Manual controls in game:
// O - Spawn enemy fleet
// K - Clear all enemies  
// U - Update ship behaviors
```

## 🛠️ API Reference

### OoliteDatParser Class
```javascript
const parser = new OoliteDatParser();
const modelData = parser.parse(datContent);
```

**Methods:**
- `parse(datContent)` - Parse .dat file content
- `toThreeJSFormat()` - Convert to Three.js compatible format
- `scaleModelData(data, maxSize)` - Scale model to fit bounds

### OoliteModelLoader Class
```javascript
const loader = new OoliteModelLoader(scene);
```

**Methods:**
- `loadModel(path, options)` - Load single model
- `loadFleet(configs)` - Load multiple models
- `removeModel(nameOrMesh)` - Remove from scene
- `updateModels(deltaTime)` - Update animations
- `clearAll()` - Remove all models

### Command Line Converter
```bash
# Usage patterns
node convert_oolite_models.js <input.dat> [output.json] [--maxsize=10] [--verbose]
node convert_oolite_models.js --batch <input_dir> [options]
node convert_oolite_models.js --sample <output.dat>
node convert_oolite_models.js --validate <model.json>
```

## 🎮 Game Integration Features

### Automatic Sonar Integration
- Converted ships automatically appear as sonar contacts
- Classified by enemy type (Fighter, Scout, Station, etc.)
- Distance and bearing calculated in real-time
- Integrates with existing targeting system

### Ship Behaviors
```javascript
// Add AI behaviors to ships
ship.userData.enemyType = 'interceptor';
ship.userData.health = 100;
ship.userData.patrolPath = true;
ship.userData.rotateSpeed = 0.5;
ship.userData.trackPlayer = true;
```

### Fleet Management
- Spawn formations around player
- Different ship types with unique properties
- Health and damage tracking
- Remove destroyed ships from scene

## 📊 Model Format Support

### Oolite .dat Format
```
NVERTS 6
0.0, 0.0, 15.0
10.0, 0.0, 0.0
...

NFACES 8
1, 0.577, 0.577, 0.577, 0, 4, 2
2, -0.577, 0.577, 0.577, 0, 3, 4
...
```

### Converted JSON Format
```json
{
  "vertices": [0.0, 0.0, 15.0, ...],
  "indices": [0, 4, 2, ...],
  "normals": [0.577, 0.577, 0.577, ...], 
  "colors": [1.0, 0.0, 0.0, ...],
  "bounds": {
    "maxX": 10, "maxY": 8, "maxZ": 15,
    "maxDimension": 15
  },
  "metadata": {
    "originalVertexCount": 6,
    "originalFaceCount": 8,
    "triangleCount": 8
  }
}
```

## 🧪 Testing

### Run Complete Test Suite
```bash
node test_oolite_system.js
```

**Tests Include:**
- Parser functionality (8 tests)
- Converter functionality (7 tests)
- Model validation (7 tests)
- Integration testing (5 tests)

### Manual Testing
1. Start the game server: `python -m http.server 8000`
2. Open browser: `http://localhost:8000`
3. Wait for game to load (5 seconds)
4. Press `O` to spawn enemy fleet
5. Use sonar (`R`) to detect ships
6. Press `Tab` to cycle through contacts

## 🎯 Popular Oolite Ships to Download

### Recommended Models
1. **Cobra Mark III** - Classic Elite ship
2. **Viper Interceptor** - Fast fighter
3. **Asp Explorer** - Medium ship
4. **Anaconda** - Large transport
5. **Thargoid** - Alien ship
6. **Fer-de-Lance** - Sleek fighter

### Sources
- [Oolite.org](https://www.oolite.org/) - Official ship library
- [Elite Dangerous Assets](https://github.com/edcd) - Open source models
- [OpenGameArt.org](https://opengameart.org/) - CC licensed models

## 🔧 Customization

### Adding New Ship Types
```javascript
// Define new enemy type
const customConfig = {
    path: 'models/custom_ship.json',
    name: 'custom_enemy',
    scale: 2.0,
    enemyType: 'dreadnought',
    health: 500,
    speed: 5,
    weaponRange: 200,
    behavior: 'aggressive'
};
```

### Custom Materials
```javascript
const customMaterial = new THREE.MeshLambertMaterial({
    vertexColors: true,
    emissive: 0x003300, // Green glow
    transparent: true,
    opacity: 0.8
});

await loader.loadModel('models/ship.json', {
    material: customMaterial
});
```

### Animation Behaviors
```javascript
// Custom update function
ship.userData.customUpdate = function(deltaTime) {
    this.rotation.y += deltaTime * 0.5;
    this.position.z += Math.sin(Date.now() * 0.001) * deltaTime * 10;
};
```

## ⚠️ Important Notes

1. **Legal Considerations** - Ensure you have rights to use Oolite models
2. **Performance** - Large models may impact game performance  
3. **Scaling** - Models are auto-scaled to reasonable size (default: 10 units max)
4. **Textures** - Basic texture support, may need manual enhancement
5. **Normals** - Face normals are preserved from original models

## 🐛 Troubleshooting

### Common Issues

**"Model not loading"**
- Check file path is correct
- Ensure JSON file exists and is valid
- Verify model was converted properly

**"Ships not appearing in game"**  
- Check browser console for errors
- Ensure game scene is initialized
- Verify Oolite loader is initialized

**"Poor model quality"**
- Increase maxSize parameter when converting
- Check original .dat file quality
- Consider manual model cleanup

**"Performance issues"**
- Reduce number of simultaneous ships
- Lower model polygon count
- Use simpler materials

### Debug Commands
```javascript
// Check system status
window.getOoliteDemo().showStatus();

// List loaded models
window.getOoliteLoader().listModels();

// Validate converted model
node convert_oolite_models.js --validate models/ship.json
```

## 🎉 Success!

The Oolite integration system is now fully operational! You can:
- ✅ Parse any Oolite .dat file
- ✅ Convert to optimized Three.js format
- ✅ Load ships as enemies in your submarine game
- ✅ Integrate with sonar and targeting systems
- ✅ Manage fleets with AI behaviors

**Happy submarine hunting!** 🚢💥