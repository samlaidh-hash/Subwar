// Sub War 2060 - Ocean Environment Module

// Ocean class for underwater environment
class Ocean {
    constructor(scene) {
        this.scene = scene;
        this.seaFloor = null;
        this.waterPlane = null;
        this.rocks = [];
        this.debris = [];
        this.kelp = [];
        this.bases = [];

        this.init();
    }

    init() {
        this.createSeaFloor(); // CRITICAL: Create seaFloor group before terrain chunks
        // ENABLED: Wireframe terrain generation for visibility
        this.createVectorWireframeTerrain();
        this.createWaterSurface();
        this.createDualThermoclines();  // Add thermoclines back
        this.createRockFormations();
        this.createDebris();
        this.createKelpForest();
        this.createCoralReefs();
        this.createShipwrecks();
        this.setupEnvironmentLighting();
        console.log('Ocean environment initialized with water surface, thermoclines and features (terrain handled by simple terrain system)');
    }

    createSeaFloor() {
        // Create seaFloor as a Group to contain terrain chunks and other seafloor elements
        this.seaFloor = new THREE.Group();
        this.seaFloor.name = 'seaFloor';
        this.scene.add(this.seaFloor);

        console.log('Created seaFloor group container for terrain chunks');
    }

    // Enhanced 100km x 100km Complex Terrain System 
    createVectorWireframeTerrain() {
        // Large-scale terrain parameters
        this.terrainSize = 70000; // 70km x 70km total area (proper scale for submarine navigation)
        this.chunkSize = 1000; // 1km chunks for performance (sensor range LOD handles detail)
        this.chunksPerSide = this.terrainSize / this.chunkSize; // 70x70 = 4900 chunks (manageable)
        // Submarine sensor ranges
        this.passiveRange = 500;     // 500m default visibility - everything within 500m visible, beyond invisible
        this.activeSonarRange = 6000; // 6km active sonar ping range
        this.maxViewDistance = this.activeSonarRange; // Maximum possible view distance
        this.drawDistance = this.passiveRange; // Default to passive range (500m)
        this.lastSonarPingTime = 0;
        this.sonarPingDuration = 30000; // 30 seconds sonar visibility after ping
        this.sonarPingFadeDuration = 10000; // Fade out over 10 seconds (30-40 seconds total)
        this.isActiveSonarActive = false;

        // COMPLEX TERRAIN DEPTHS - Per user specifications (CORRECTED)
        this.plainsDepth = -500; // Plains at 500m depth
        this.hillPeakDepth = -200; // Hills peak at 200m depth
        this.seamountPeakDepth = -20; // Seamount peaks MUCH closer to surface (20m depth)
        this.canyonMaxDepth = -3000; // Canyons down to 3000m
        this.abyssalDepth = -6000; // Abyssal plains at 6000m
        this.trenchStepsDepth = -8000; // Trench steps to 8000m
        this.trenchPrecipiceDepth = -13000; // Precipice to 13000m MAX (not 22km!)
        this.sheerFaceDepth = -13000; // Sheer face drop from plains to trench
        this.thermoclineDepth1 = -200; // First thermocline at 200m
        this.thermoclineDepth2 = -1100; // Second thermocline at 1100m

        // LOD system for performance
        this.terrainChunks = new Map();
        this.activeChunks = new Set();
        this.lastPlayerPosition = new THREE.Vector3();

        // CRITICAL FIX: Initialize gridSize and heightData BEFORE creating chunks
        this.gridSize = 512; // 512x512 grid resolution for 70km terrain
        this.initializeHeightData();

        // Create comprehensive height function with geological features
        this.createGeologicalHeightFunction();

        // CRITICAL FIX: Generate terrain chunks immediately with procedural data
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0x00aa88,
            linewidth: 1,
            transparent: true,
            opacity: 0.6
        });
        this.generateAllTerrainChunks(wireframeMaterial);
        console.log(`🔍 DEBUG: Generated terrain chunks immediately with procedural data`);

        // Initialize terrain chunks around origin
        this.updateTerrainLOD(new THREE.Vector3(0, 0, 0));

        // Create full-scale wireframe terrain with geological features
        console.log('Creating full-scale wireframe terrain with geological features');
        // Temporarily disabled - using LOD chunk system instead
        // this.createFullScaleTerrain();

        // Cave systems temporarily disabled to ensure LOD system controls all terrain visibility
        // this.createCaveSystems();

        console.log('Enhanced 200km x 200km real bathymetry wireframe terrain created with LOD system');
    }

    initializeHeightData() {
        // Generate height data for terrain chunks
        const dataSize = (this.gridSize + 1) * (this.gridSize + 1);
        this.heightData = new Float32Array(dataSize);

        console.log(`🔍 DEBUG: Generating ${dataSize} height points for ${this.gridSize}x${this.gridSize} grid`);

        // Generate procedural terrain with realistic depths
        for (let z = 0; z <= this.gridSize; z++) {
            for (let x = 0; x <= this.gridSize; x++) {
                const worldX = (x / this.gridSize) * this.terrainSize - this.terrainSize / 2;
                const worldZ = (z / this.gridSize) * this.terrainSize - this.terrainSize / 2;

                // Generate height using procedural noise
                const height = this.generateProceduralHeight(worldX, worldZ);
                this.heightData[z * (this.gridSize + 1) + x] = height;
            }
        }

        console.log(`✅ Height data initialized: ${this.heightData.length} points`);
    }

    generateProceduralHeight(worldX, worldZ) {
        // Simple procedural terrain - can be enhanced later
        const distance = Math.sqrt(worldX * worldX + worldZ * worldZ);
        const baseDepth = -500; // 500m base depth
        const noise = Math.sin(worldX * 0.001) * Math.cos(worldZ * 0.001) * 200; // Terrain variation
        const depthVariation = Math.sin(distance * 0.0001) * 1000; // Large-scale depth changes

        return baseDepth + noise + depthVariation;
    }

    createGeologicalHeightFunction() {
        // Initialize NOAA bathymetry terrain system (replaces Google Earth data)
        this.bathymetryTerrain = new NOAABathymetryTerrain();
        
        // Load the NOAA bathymetry data
        this.bathymetryTerrain.loadBathymetryData().then(() => {
            console.log('✅ NOAA bathymetry terrain system loaded successfully');
            console.log('📊 Official NOAA/GEBCO data now active');
            // Validate the loaded data
            this.bathymetryTerrain.validateNOAAData();
            // Recreate the wireframe terrain with official NOAA data
            this.recreateWireframeTerrain();
        }).catch(error => {
            console.error('❌ Failed to load NOAA bathymetry data:', error);
            console.log('📋 Using fallback NOAA depth profiles for Hawaiian-Emperor Chain');
        });
        
        this.getTerrainHeight = (worldX, worldZ) => {
            if (!this.bathymetryTerrain || !this.bathymetryTerrain.loaded) {
                // Return default depth while bathymetry is loading
                return -1000;
            }
            return this.bathymetryTerrain.getTerrainHeight(worldX, worldZ);
        };
        
        this.getSeabedHeight = (worldX, worldZ) => {
            return this.bathymetryTerrain.getSeabedHeight(worldX, worldZ);
        };
        
        console.log('🌊 NOAA bathymetry terrain system initialized');
        console.log('📍 Location: North Pacific Hawaiian-Emperor Chain (25.72°N, 167.35°W)');
    }

    recreateWireframeTerrain() {
        // Remove existing terrain
        const existingTerrain = this.scene.getObjectByName('fullScaleTerrain');
        if (existingTerrain) {
            this.scene.remove(existingTerrain);
            // Clean up geometry and materials
            existingTerrain.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }

        // Create new terrain with real bathymetry data
        console.log('🌊 Bathymetry data loaded - LOD terrain system active');

        // Initialize LOD chunk system for sensor-based terrain visibility
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff99,  // Brighter cyan/green for better visibility
            linewidth: 1,
            transparent: false,  // Make it fully opaque for better visibility
            opacity: 1.0
        });
        this.generateAllTerrainChunks(wireframeMaterial);
        console.log(`🗺️ Generated ${this.terrainChunks.size} terrain chunks for sensor-based LOD system`);
    }

    initializeGeologicalProvinces() {
        // Define realistic geological provinces based on real ocean margins
        this.provinces = {
            continental: {
                extent: { xMin: -50000, xMax: -15000 }, // 35km wide continental margin
                shelf: { depth: -150, slope: 0.001 },     // Continental shelf: 150m deep, gentle
                shelfBreak: { position: -25000, depth: -200 }, // Shelf break at 25km offshore
                slope: { angle: 0.05, maxDepth: -2000 }  // Continental slope: 3° angle
            },
            abyssal: {
                extent: { xMin: -15000, xMax: 35000 },    // 50km wide abyssal province
                baseDepth: -4500,                          // Typical abyssal depth
                variation: 200,                            // Gentle undulations
                sedimentThickness: 500                     // Thick sediment cover
            },
            trench: {
                extent: { xMin: 35000, xMax: 50000 },     // 15km trench province
                axis: { position: 42000, depth: -9000 },  // Trench axis at 42km offshore
                walls: { angle: 0.15, width: 7000 },      // Steep trench walls
                forearc: { depth: -6000, width: 3000 }    // Forearc basin
            }
        };
        
        console.log('Geological provinces defined');
    }

    createTectonicStructures() {
        // Create realistic tectonic features based on plate boundaries
        this.tectonicFeatures = {
            faultSystems: [
                // Major normal fault system on continental slope
                { 
                    trend: 'NE-SW', 
                    position: { x: -20000, z: 10000 },
                    length: 25000,
                    displacement: 300,
                    orientation: Math.PI / 4
                },
                // Transform fault in abyssal region
                {
                    trend: 'E-W',
                    position: { x: 5000, z: -15000 },
                    length: 40000,
                    displacement: 150,
                    orientation: 0
                }
            ],
            // Mid-ocean ridge segment in abyssal region
            spreadingCenter: {
                position: { x: 10000, z: 0 },
                orientation: Math.PI / 6, // NE-SW trending
                length: 30000,
                relief: 800,
                valleyWidth: 2000
            }
        };
        
        console.log('Tectonic structures created');
    }

    simulateErosionNetwork() {
        // Create realistic canyon systems based on sediment transport
        this.canyonSystems = [
            // Major submarine canyon (like Monterey Canyon)
            {
                head: { x: -35000, z: 5000 },              // Canyon head near shelf break
                mouth: { x: -10000, z: -8000 },            // Canyon mouth on abyssal plain
                maxDepth: 1500,                             // Maximum canyon depth
                width: 3000,                                // Canyon width
                tributaries: [
                    { branch: { x: -30000, z: 8000 }, depth: 800 },
                    { branch: { x: -25000, z: 2000 }, depth: 600 },
                    { branch: { x: -20000, z: -5000 }, depth: 400 }
                ]
            },
            // Secondary canyon system
            {
                head: { x: -30000, z: -20000 },
                mouth: { x: -12000, z: -35000 },
                maxDepth: 1200,
                width: 2000,
                tributaries: [
                    { branch: { x: -28000, z: -15000 }, depth: 500 },
                    { branch: { x: -22000, z: -25000 }, depth: 600 }
                ]
            }
        ];
        
        console.log('Canyon erosion network simulated');
    }

    createVolcanicFeatures() {
        // Create realistic seamount chain following hotspot track
        this.volcanicFeatures = {
            seamountChain: [
                // Age-progressive seamount chain (older = more eroded)
                { position: { x: -5000, z: 15000 }, height: 2200, age: 1.0, diameter: 2000 },  // Young, tall
                { position: { x: -2000, z: 8000 }, height: 1800, age: 2.5, diameter: 2500 },   // Intermediate
                { position: { x: 32000, z: -2000 }, height: 1400, age: 4.0, diameter: 3000 },  // Older, eroded (moved to edge)
                { position: { x: 38000, z: -12000 }, height: 900, age: 6.0, diameter: 3500 },  // Old, low (moved to trench)
                { position: { x: 45000, z: -25000 }, height: 600, age: 8.0, diameter: 4000 }   // Very old guyot (in trench)
            ],
            // Isolated volcanic edifices
            intraplatevolcanoes: [
                { position: { x: -8000, z: -10000 }, height: 1600, diameter: 2000 },
                { position: { x: 38000, z: 20000 }, height: 1100, diameter: 3000 }
            ]
        };
        
        console.log('Volcanic features created');
    }

    initializeSedimentDistribution() {
        // Realistic sediment thickness distribution
        this.sedimentModel = {
            // Sediment thickness decreases with distance from land
            continentalSediments: {
                shelfThickness: 50,        // 50m thick on shelf (realistic)
                slopeThickness: 30,        // 30m on slope  
                riseThickness: 20          // 20m on continental rise
            },
            abyssalSediments: {
                baseThickness: 10,         // 10m base pelagic sediment
                turbiditeThickness: 20     // 20m additional turbidite layers
            },
            volcanicSediments: {
                proximity: 5000,           // Within 5km of volcanoes
                thickness: 30              // 30m volcanic ash layers
            }
        };
        
        console.log('Sediment distribution model initialized');
        
        // Add black smoker hydrothermal vent fields
        this.createHydrothermalVents();
    }

    createHydrothermalVents() {
        // Create black smoker fields tall enough for submarine dogfights
        this.hydroThermalVents = [
            {
                name: "Dragon's Breath Field",
                center: { x: 8000, z: -15000 },     // On spreading center
                area: 3000,                          // 3km diameter field
                smokerCount: 25,                     // Multiple tall smokers
                maxHeight: 150,                      // 150m tall towers (dogfight height!)
                temperature: 350,                    // Hot vents
                minerals: ['sulfides', 'barite']
            },
            {
                name: "Serpent's Garden",
                center: { x: 12000, z: 8000 },      // Secondary vent field
                area: 2000,                          // 2km diameter
                smokerCount: 15,
                maxHeight: 120,                      // 120m tall towers
                temperature: 280,
                minerals: ['sulfides', 'silica']
            },
            {
                name: "Abyss Gate Complex",
                center: { x: 5000, z: 18000 },      // Isolated field
                area: 1500,                          // 1.5km diameter  
                smokerCount: 12,
                maxHeight: 100,                      // 100m towers
                temperature: 320,
                minerals: ['sulfides', 'metals']
            }
        ];
        
        console.log('Hydrothermal vent fields created - tall enough for submarine combat!');
    }

    calculateRealisticSeafloorDepth(worldX, worldZ) {
        // Main function that combines all geological processes
        
        // 1. Determine geological province
        const province = this.getGeologicalProvince(worldX);
        let depth = this.getProvinceBaseDepth(worldX, worldZ, province);
        
        // 2. Apply tectonic structure modifications
        depth += this.getTectonicEffect(worldX, worldZ);
        
        // 3. Apply erosional features (canyons)
        depth = Math.min(depth, this.getCanyonDepth(worldX, worldZ));
        
        // 4. Apply volcanic features (seamounts) - raises seafloor
        const volcanicHeight = this.getVolcanicEffect(worldX, worldZ);
        if (volcanicHeight > 0) {
            depth = Math.max(depth, depth + volcanicHeight); // Raise seafloor by volcanic height
        }
        
        // 5. Apply hydrothermal vent towers (black smokers) - raises seafloor  
        const ventHeight = this.getHydrothermalVentEffect(worldX, worldZ);
        if (ventHeight > 0) {
            depth = Math.max(depth, depth + ventHeight); // Raise seafloor by vent height
        }
        
        // 6. Apply sediment deposition
        depth += this.getSedimentThickness(worldX, worldZ);
        
        // 7. Add fine-scale roughness
        depth += this.getSeafloorRoughness(worldX, worldZ);
        
        return depth;
    }

    getHydrothermalVentEffect(worldX, worldZ) {
        let maxHeight = -Infinity;
        
        this.hydroThermalVents.forEach(ventField => {
            const distanceToCenter = Math.sqrt(
                (worldX - ventField.center.x) ** 2 + 
                (worldZ - ventField.center.z) ** 2
            );
            
            if (distanceToCenter < ventField.area / 2) {
                // Generate individual smoker towers within the field
                const seedX = Math.floor(worldX / 200) * 200; // 200m grid for smokers
                const seedZ = Math.floor(worldZ / 200) * 200;
                const smokerSeed = seedX * 1000 + seedZ; // Pseudo-random seed
                
                // Use seed to determine if there's a smoker here
                const smokerRandom = ((smokerSeed * 9301 + 49297) % 233280) / 233280; // Pseudo-random 0-1
                
                if (smokerRandom < 0.15) { // 15% chance of smoker in each 200m cell
                    // Create tall smoker tower
                    const localX = worldX - seedX;
                    const localZ = worldZ - seedZ;
                    const distanceFromSmokerCenter = Math.sqrt(localX ** 2 + localZ ** 2);
                    
                    if (distanceFromSmokerCenter < 50) { // 50m radius smoker
                        // Tall, narrow chimney profile
                        const smokerProfile = Math.exp(-Math.pow(distanceFromSmokerCenter / 25, 2));
                        const heightVariation = ((smokerSeed * 7919 + 37) % 1000) / 1000; // 0-1 variation
                        const smokerHeight = ventField.maxHeight * (0.7 + heightVariation * 0.3) * smokerProfile;
                        
                        maxHeight = Math.max(maxHeight, smokerHeight);
                    }
                }
            }
        });
        
        return maxHeight === -Infinity ? 0 : maxHeight;
    }

    getGeologicalProvince(worldX) {
        if (worldX >= this.provinces.continental.extent.xMin && worldX <= this.provinces.continental.extent.xMax) {
            return 'continental';
        } else if (worldX >= this.provinces.abyssal.extent.xMin && worldX <= this.provinces.abyssal.extent.xMax) {
            return 'abyssal';
        } else if (worldX >= this.provinces.trench.extent.xMin && worldX <= this.provinces.trench.extent.xMax) {
            return 'trench';
        }
        return 'abyssal'; // Default
    }

    getProvinceBaseDepth(worldX, worldZ, province) {
        switch (province) {
            case 'continental':
                return this.getContinentalMarginDepth(worldX, worldZ);
            case 'abyssal':
                return this.getAbyssalPlainDepth(worldX, worldZ);
            case 'trench':
                return this.getTrenchDepth(worldX, worldZ);
            default:
                return this.provinces.abyssal.baseDepth;
        }
    }

    getContinentalMarginDepth(worldX, worldZ) {
        const continental = this.provinces.continental;
        
        // Distance from shore (normalized 0-1 across continental margin)
        const distanceFromShore = (worldX - continental.extent.xMin) / (continental.extent.xMax - continental.extent.xMin);
        
        if (distanceFromShore < 0.3) {
            // Continental shelf - very gentle slope
            const shelfDistance = distanceFromShore / 0.3;
            return continental.shelf.depth - (shelfDistance * 50); // 150m to 200m depth
        } else if (distanceFromShore < 0.7) {
            // Continental slope - steep descent
            const slopeDistance = (distanceFromShore - 0.3) / 0.4;
            const slopeDepth = -200 + (slopeDistance * -1800); // 200m to 2000m depth
            
            // Add realistic slope irregularities
            const slopeVariation = Math.sin(worldZ * 0.0001) * Math.cos(worldX * 0.00008) * 150;
            return slopeDepth + slopeVariation;
        } else {
            // Continental rise - gentler transition to abyssal
            const riseDistance = (distanceFromShore - 0.7) / 0.3;
            const riseDepth = -2000 + (riseDistance * -2500); // 2000m to 4500m depth
            
            // Add sediment fan variations
            const fanVariation = Math.sin(worldZ * 0.00005) * 100;
            return riseDepth + fanVariation;
        }
    }

    getAbyssalPlainDepth(worldX, worldZ) {
        const abyssal = this.provinces.abyssal;
        let depth = abyssal.baseDepth;
        
        // Very gentle abyssal hill variations (realistic scale)
        depth += Math.sin(worldX * 0.00003) * Math.cos(worldZ * 0.00002) * abyssal.variation;
        depth += Math.sin(worldX * 0.00001) * Math.sin(worldZ * 0.000015) * (abyssal.variation * 0.5);
        
        return depth;
    }

    getTrenchDepth(worldX, worldZ) {
        const trench = this.provinces.trench;
        const distanceFromAxis = Math.abs(worldX - trench.axis.position);
        
        if (distanceFromAxis < trench.walls.width / 2) {
            // Inside trench - V-shaped profile
            const normalizedDistance = distanceFromAxis / (trench.walls.width / 2);
            const trenchProfile = 1 - Math.pow(normalizedDistance, 1.5); // Steep V-shape
            const depth = trench.forearc.depth + (trench.axis.depth - trench.forearc.depth) * trenchProfile;
            
            // Add along-axis variations
            const axisVariation = Math.sin(worldZ * 0.00002) * 500;
            return depth + axisVariation;
        } else {
            // Trench walls and forearc
            return trench.forearc.depth + Math.sin(worldZ * 0.00005) * 200;
        }
    }

    getTectonicEffect(worldX, worldZ) {
        let tectonicEffect = 0;
        
        // Apply fault system effects
        this.tectonicFeatures.faultSystems.forEach(fault => {
            const distance = this.distanceToLineSegment(worldX, worldZ, fault);
            if (distance < 5000) { // Within 5km of fault
                const effect = fault.displacement * Math.exp(-distance / 2000); // Exponential decay
                tectonicEffect += (Math.random() > 0.5 ? effect : -effect); // Up or down throw
            }
        });
        
        // Apply spreading center effect
        const ridge = this.tectonicFeatures.spreadingCenter;
        const ridgeDistance = this.distanceToRidge(worldX, worldZ, ridge);
        if (ridgeDistance < ridge.relief) {
            const ridgeEffect = ridge.relief * (1 - ridgeDistance / ridge.relief);
            tectonicEffect += ridgeEffect; // Ridge topography
        }
        
        return tectonicEffect;
    }

    getCanyonDepth(worldX, worldZ) {
        let minDepth = 0; // No canyon effect by default
        
        this.canyonSystems.forEach(canyon => {
            const canyonDistance = this.distanceToCanyonAxis(worldX, worldZ, canyon);
            if (canyonDistance < canyon.width) {
                // Canyon profile - U-shaped with steep walls
                const normalizedDistance = canyonDistance / canyon.width;
                const canyonProfile = 1 - Math.pow(normalizedDistance, 2);
                const canyonCut = -canyon.maxDepth * canyonProfile;
                minDepth = Math.min(minDepth, canyonCut);
            }
            
            // Add tributary effects
            canyon.tributaries.forEach(tributary => {
                const tribDistance = Math.sqrt(
                    (worldX - tributary.branch.x) ** 2 + 
                    (worldZ - tributary.branch.z) ** 2
                );
                if (tribDistance < 1000) { // 1km tributary width
                    const tribProfile = 1 - (tribDistance / 1000);
                    const tribCut = -tributary.depth * tribProfile;
                    minDepth = Math.min(minDepth, tribCut);
                }
            });
        });
        
        return minDepth;
    }

    getVolcanicEffect(worldX, worldZ) {
        let maxHeight = -Infinity;
        
        // Seamount chain effects
        this.volcanicFeatures.seamountChain.forEach(seamount => {
            const distance = Math.sqrt(
                (worldX - seamount.position.x) ** 2 + 
                (worldZ - seamount.position.z) ** 2
            );
            
            if (distance < seamount.diameter) {
                // Gaussian volcanic edifice with age-related erosion
                const normalizedDistance = distance / seamount.diameter;
                const volcanicProfile = Math.exp(-(normalizedDistance ** 2) * 5);
                const erosionFactor = 1 - (seamount.age * 0.1); // Older = more eroded
                const height = seamount.height * volcanicProfile * erosionFactor;
                maxHeight = Math.max(maxHeight, height);
            }
        });
        
        // Intraplate volcanoes
        this.volcanicFeatures.intraplatevolcanoes.forEach(volcano => {
            const distance = Math.sqrt(
                (worldX - volcano.position.x) ** 2 + 
                (worldZ - volcano.position.z) ** 2
            );
            
            if (distance < volcano.diameter) {
                const normalizedDistance = distance / volcano.diameter;
                const volcanicProfile = Math.exp(-(normalizedDistance ** 2) * 4);
                const height = volcano.height * volcanicProfile;
                maxHeight = Math.max(maxHeight, height);
            }
        });
        
        return maxHeight === -Infinity ? 0 : maxHeight;
    }

    getSedimentThickness(worldX, worldZ) {
        // Calculate sediment thickness based on distance from sources
        const province = this.getGeologicalProvince(worldX);
        let sedimentThickness = 0;
        
        if (province === 'continental') {
            // Continental sediments - thicker near shore
            const distanceFromShore = worldX - this.provinces.continental.extent.xMin;
            const normalizedDistance = distanceFromShore / 35000; // 35km margin width
            sedimentThickness = this.sedimentModel.continentalSediments.shelfThickness * (1 - normalizedDistance);
        } else if (province === 'abyssal') {
            // Pelagic sediments - uniform thin layer
            sedimentThickness = this.sedimentModel.abyssalSediments.baseThickness;
            
            // Add turbidite deposits near canyon mouths
            this.canyonSystems.forEach(canyon => {
                const distanceToMouth = Math.sqrt(
                    (worldX - canyon.mouth.x) ** 2 + 
                    (worldZ - canyon.mouth.z) ** 2
                );
                if (distanceToMouth < 10000) { // 10km fan radius
                    const fanThickness = this.sedimentModel.abyssalSediments.turbiditeThickness * 
                                       Math.exp(-distanceToMouth / 5000);
                    sedimentThickness += fanThickness;
                }
            });
        }
        
        // Volcanic ash near volcanoes
        this.volcanicFeatures.seamountChain.forEach(seamount => {
            const distance = Math.sqrt(
                (worldX - seamount.position.x) ** 2 + 
                (worldZ - seamount.position.z) ** 2
            );
            if (distance < this.sedimentModel.volcanicSediments.proximity) {
                const ashThickness = this.sedimentModel.volcanicSediments.thickness * 
                                   (1 - distance / this.sedimentModel.volcanicSediments.proximity);
                sedimentThickness += ashThickness;
            }
        });
        
        return -sedimentThickness; // Negative because sediment adds to depth
    }

    getSeafloorRoughness(worldX, worldZ) {
        // Multi-scale roughness for realistic seabed texture
        let roughness = 0;
        
        // Large-scale undulations (100m-1km)
        roughness += Math.sin(worldX * 0.00628) * Math.cos(worldZ * 0.00314) * 20; // 1km wavelength
        roughness += Math.sin(worldX * 0.0157) * Math.sin(worldZ * 0.0125) * 10;   // 400m wavelength
        
        // Medium-scale features (10m-100m)
        roughness += Math.cos(worldX * 0.0628) * Math.sin(worldZ * 0.0785) * 5;    // 100m wavelength
        roughness += Math.sin(worldX * 0.157) * Math.cos(worldZ * 0.125) * 3;      // 40m wavelength
        
        // Fine-scale texture (1m-10m)
        roughness += Math.sin(worldX * 0.628) * Math.cos(worldZ * 0.785) * 1;      // 10m wavelength
        
        return roughness;
    }

    // Helper functions for distance calculations
    distanceToLineSegment(x, z, fault) {
        // Simplified distance to fault line
        const dx = Math.cos(fault.orientation) * fault.length / 2;
        const dz = Math.sin(fault.orientation) * fault.length / 2;
        const x1 = fault.position.x - dx;
        const z1 = fault.position.z - dz;
        const x2 = fault.position.x + dx;
        const z2 = fault.position.z + dz;
        
        const A = x - x1;
        const B = z - z1;
        const C = x2 - x1;
        const D = z2 - z1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;
        
        let xx, zz;
        if (param < 0) {
            xx = x1; zz = z1;
        } else if (param > 1) {
            xx = x2; zz = z2;
        } else {
            xx = x1 + param * C;
            zz = z1 + param * D;
        }
        
        return Math.sqrt((x - xx) ** 2 + (z - zz) ** 2);
    }

    distanceToRidge(x, z, ridge) {
        // Distance to spreading center axis
        return Math.abs((x - ridge.position.x) * Math.cos(ridge.orientation + Math.PI/2) + 
                       (z - ridge.position.z) * Math.sin(ridge.orientation + Math.PI/2));
    }

    distanceToCanyonAxis(x, z, canyon) {
        // Distance to canyon thalweg (central axis)
        const dx = canyon.mouth.x - canyon.head.x;
        const dz = canyon.mouth.z - canyon.head.z;
        const length = Math.sqrt(dx * dx + dz * dz);
        
        const nx = dx / length;
        const nz = dz / length;
        
        const px = x - canyon.head.x;
        const pz = z - canyon.head.z;
        
        const dot = px * nx + pz * nz;
        const t = Math.max(0, Math.min(length, dot));
        
        const closestX = canyon.head.x + t * nx;
        const closestZ = canyon.head.z + t * nz;
        
        return Math.sqrt((x - closestX) ** 2 + (z - closestZ) ** 2);
    }

    createPlainsWithCanyons(normalizedX, normalizedZ) {
        // 75% PLAINS AREA: ~500m deep with small rises/falls + 3km deep canyons
        
        // Base plains depth (~500m)
        let terrain = this.plainsDepth; // -500m base
        
        // ========== CONSIDERABLE RISES AND FALLS, HILLS AND MOUNTAINS ==========
        // The plains should have significant topographic variation!
        
        // Large mountain ranges and major hills (considerable rises!)
        // Major hills with randomized positioning to break symmetry
        const hillRandomFreq = this.noise(normalizedX * 50, normalizedZ * 60) * 1.5 + 2.5; // 1.0 to 4.0
        const hillPhase = this.noise(normalizedX * 30, normalizedZ * 40) * Math.PI * 2;
        const majorHillNoise = Math.sin(normalizedX * Math.PI * hillRandomFreq + hillPhase) * Math.cos(normalizedZ * Math.PI * (hillRandomFreq * 0.8) + hillPhase);

        if (majorHillNoise > 0.2) { // 40% of plains have hills/mountains
            const hillHeight = Math.pow((majorHillNoise - 0.2) / 0.8, 1.5);
            const peakDepth = this.hillPeakDepth + (this.plainsDepth - this.hillPeakDepth) * (1 - hillHeight);
            terrain = Math.max(terrain, peakDepth);
        }

        // Secondary mountain systems with irregular placement
        const mountainRandomFreq = this.noise(normalizedX * 70, normalizedZ * 55) * 1.2 + 3.5; // 2.3 to 4.7
        const mountainPhase = this.noise(normalizedX * 45, normalizedZ * 35) * Math.PI * 2;
        const secondaryMountains = Math.cos(normalizedX * Math.PI * mountainRandomFreq + mountainPhase) * Math.sin(normalizedZ * Math.PI * (mountainRandomFreq * 0.9) + mountainPhase);

        if (secondaryMountains > 0.3) {
            const mountainHeight = Math.pow((secondaryMountains - 0.3) / 0.7, 2);
            const mountainDepth = this.seamountPeakDepth + (this.hillPeakDepth - this.seamountPeakDepth) * (1 - mountainHeight);
            terrain = Math.max(terrain, mountainDepth);
        }
        
        // Rolling hills with randomized frequencies to break symmetry
        const randomSeed1 = this.noise(normalizedX * 100, normalizedZ * 100) * 0.3 + 1.0; // 0.7 to 1.3
        const randomSeed2 = this.noise(normalizedX * 150, normalizedZ * 120) * 0.2 + 1.0; // 0.8 to 1.2
        const randomSeed3 = this.noise(normalizedX * 200, normalizedZ * 180) * 0.1 + 1.0; // 0.9 to 1.1

        terrain += Math.sin(normalizedX * Math.PI * 6 * randomSeed1) * Math.cos(normalizedZ * Math.PI * 5 * randomSeed1) * 120; // Large undulations
        terrain += Math.cos(normalizedX * Math.PI * 8 * randomSeed2) * Math.sin(normalizedZ * Math.PI * 7 * randomSeed2) * 80;  // Medium hills
        terrain += Math.sin(normalizedX * Math.PI * 12 * randomSeed3) * Math.cos(normalizedZ * Math.PI * 10 * randomSeed3) * 50; // Smaller hills

        // Fine granularity detail with phase shifts to break regularity
        const phaseShift1 = this.noise(normalizedX * 80, normalizedZ * 90) * Math.PI;
        const phaseShift2 = this.noise(normalizedX * 110, normalizedZ * 95) * Math.PI;
        const phaseShift3 = this.noise(normalizedX * 140, normalizedZ * 130) * Math.PI;

        terrain += Math.sin(normalizedX * Math.PI * 25 + phaseShift1) * Math.cos(normalizedZ * Math.PI * 20 + phaseShift1) * 20;
        terrain += Math.cos(normalizedX * Math.PI * 40 + phaseShift2) * Math.sin(normalizedZ * Math.PI * 35 + phaseShift2) * 10;
        terrain += Math.sin(normalizedX * Math.PI * 60 + phaseShift3) * Math.cos(normalizedZ * Math.PI * 55 + phaseShift3) * 5;
        
        // ========== 3KM DEEP CANYONS (cutting through plains) ==========
        const canyonDepth = this.createPlainsCanyon(normalizedX, normalizedZ);
        terrain = Math.min(terrain, canyonDepth); // Canyons cut down into plains
        
        
        return terrain;
    }

    createDeepWaterZone(normalizedX, normalizedZ) {
        // 25% DEEP WATER: Continental slope → Abyssal plain → Trench
        // Progress from edge of plains (normalizedX = 0.5) to far edge (normalizedX = 1.0)
        const deepWaterProgress = (normalizedX - 0.5) / 0.5; // 0 to 1
        
        let terrain;
        
        // Zone subdivision within the 25%:
        if (deepWaterProgress < 0.4) {
            // CONTINENTAL SLOPE (first 40% of deep water zone = 10% of total map)
            const slopeProgress = deepWaterProgress / 0.4;
            terrain = this.plainsDepth + (this.abyssalDepth - this.plainsDepth) * slopeProgress;
            
            // Add gentle slope variations
            terrain += Math.sin(normalizedZ * Math.PI * 4) * 50 * (1 - slopeProgress);
            terrain += Math.cos(normalizedX * Math.PI * 8) * 25;
            
        } else if (deepWaterProgress < 0.8) {
            // ABYSSAL PLAIN (next 40% of deep water zone = 10% of total map)
            // RELATIVELY FLAT with just a few vertiginous seamounts
            terrain = this.abyssalDepth;
            
            // Very subtle abyssal variations (relatively flat!)
            terrain += Math.sin(normalizedX * Math.PI * 3) * Math.cos(normalizedZ * Math.PI * 2) * 30;
            terrain += Math.sin(normalizedZ * Math.PI * 4) * 15;
            
            // A FEW VERTIGINOUS SEAMOUNTS (very rare, dramatic!)
            const abyssalSeamountNoise = Math.sin(normalizedX * Math.PI * 5) * Math.cos(normalizedZ * Math.PI * 4);
            if (abyssalSeamountNoise > 0.95) { // Extremely rare (only ~0.5% of abyssal plain)
                const seamountHeight = Math.pow((abyssalSeamountNoise - 0.95) / 0.05, 4); // Vertiginous but not crazy
                const seamountDepth = this.abyssalDepth + (this.seamountPeakDepth - this.abyssalDepth) * seamountHeight;
                terrain = Math.max(terrain, seamountDepth); // Rise from abyssal to near surface
            }
            
        } else {
            // OCEAN TRENCH (final 20% of deep water zone = 5% of total map)
            const trenchProgress = (deepWaterProgress - 0.8) / 0.2; // 0 to 1
            terrain = this.abyssalDepth + (this.trenchPrecipiceDepth - this.abyssalDepth) * trenchProgress;
            
            // Trench variations
            terrain += Math.sin(normalizedZ * Math.PI * 12) * 200;
        }
        
        // ========== SPECIFIC SHEER CLIFF FEATURE ==========
        // Dramatic cliff dropping from plains to deep water
        if (normalizedX > 0.49 && normalizedX < 0.51 && Math.abs(normalizedZ) < 0.15) {
            const cliffProgress = (normalizedX - 0.49) / 0.02; // Very sharp transition over 2km
            const cliffDepth = this.plainsDepth + (this.abyssalDepth - this.plainsDepth) * Math.pow(cliffProgress, 5);
            terrain = Math.min(terrain, cliffDepth); // Dramatic drop to abyssal depth
        }
        
        return terrain;
    }

    createPlainsCanyon(normalizedX, normalizedZ) {
        // 3KM DEEP CANYONS cutting through the 500m plains
        let terrain = this.plainsDepth; // Start from plains depth
        
        // Major canyon system - branching network
        const mainCanyons = [
            { centerX: -0.3, centerZ: 0.1, width: 0.08, maxDepth: this.canyonMaxDepth, angle: Math.PI / 6 },
            { centerX: 0.1, centerZ: -0.2, width: 0.06, maxDepth: -2500, angle: -Math.PI / 4 },
            { centerX: -0.1, centerZ: 0.3, width: 0.07, maxDepth: -2800, angle: Math.PI / 3 }
        ];
        
        mainCanyons.forEach(canyon => {
            // Calculate distance from canyon centerline
            const cosAngle = Math.cos(canyon.angle);
            const sinAngle = Math.sin(canyon.angle);
            const rotatedX = (normalizedX - canyon.centerX) * cosAngle - (normalizedZ - canyon.centerZ) * sinAngle;
            const distanceFromCanyon = Math.abs(rotatedX);
            
            if (distanceFromCanyon < canyon.width) {
                // V-shaped canyon profile for dramatic 3km cuts
                const profileFactor = 1 - Math.pow(distanceFromCanyon / canyon.width, 1.5);
                const canyonDepth = canyon.maxDepth * profileFactor;
                terrain = Math.min(terrain, canyonDepth);
            }
        });
        
        // Tributary canyons (smaller branching)
        const tributaries = [
            { centerX: -0.2, centerZ: -0.1, width: 0.04, depth: -2000, angle: 0 },
            { centerX: 0.3, centerZ: 0.2, width: 0.05, depth: -2200, angle: Math.PI / 2 },
            { centerX: -0.4, centerZ: -0.3, width: 0.03, depth: -1800, angle: -Math.PI / 6 }
        ];
        
        tributaries.forEach(trib => {
            const cosAngle = Math.cos(trib.angle);
            const sinAngle = Math.sin(trib.angle);
            const rotatedX = (normalizedX - trib.centerX) * cosAngle - (normalizedZ - trib.centerZ) * sinAngle;
            
            if (Math.abs(rotatedX) < trib.width) {
                const tribProfile = 1 - Math.pow(Math.abs(rotatedX) / trib.width, 2);
                const tribDepth = trib.depth * tribProfile;
                terrain = Math.min(terrain, tribDepth);
            }
        });
        
        return terrain;
    }


    createContinentalSlope(normalizedX, normalizedZ) {
        // 20% CONTINENTAL SLOPE - Gentle transition from mixed terrain to abyssal plain
        
        // Progress from slope start (normalizedX = 0.4) to abyssal plain (normalizedX = 0.8)
        const slopeProgress = (normalizedX - 0.4) / 0.4; // 0 to 1
        
        // Base slope from plains depth to abyssal depth
        let slopeDepth = this.plainsDepth + (this.abyssalDepth - this.plainsDepth) * slopeProgress;
        
        // Add gentle variations
        slopeDepth += Math.sin(normalizedZ * Math.PI * 3) * 100 * (1 - slopeProgress); // Less variation as it gets deeper
        slopeDepth += Math.cos(normalizedX * Math.PI * 4) * 50;
        
        // Some canyons open onto the slope
        if (Math.abs(normalizedZ - 0.2) < 0.1 || Math.abs(normalizedZ + 0.3) < 0.08) {
            const canyonCut = -200 - (slopeProgress * 500); // Canyon cuts deeper down the slope
            slopeDepth = Math.min(slopeDepth, canyonCut);
        }
        
        return slopeDepth;
    }

    createOceanTrench(normalizedX, normalizedZ) {
        // 10% OCEAN TRENCH - Series of steps down to 8000m then precipice to 13000m
        
        // Progress into trench (normalizedX = 0.8 to 1.0)
        const trenchProgress = (normalizedX - 0.8) / 0.2; // 0 to 1
        
        let trenchDepth = this.abyssalDepth; // Start from abyssal depth
        
        // SERIES OF STEPS down to 8000m
        if (trenchProgress < 0.7) { // First 70% of trench area
            const stepProgress = trenchProgress / 0.7; // 0 to 1 for stepping area
            
            // Create 3 distinct steps
            const step1 = stepProgress < 0.33 ? stepProgress / 0.33 : 1;
            const step2 = stepProgress < 0.66 ? (stepProgress > 0.33 ? (stepProgress - 0.33) / 0.33 : 0) : 1;
            const step3 = stepProgress > 0.66 ? (stepProgress - 0.66) / 0.34 : 0;
            
            // Create stepped descent (each step goes deeper, not additive!)
            let stepDepth = this.abyssalDepth; // Start from abyssal depth (-6000m)
            
            if (step1 > 0) stepDepth = this.abyssalDepth + (this.trenchStepsDepth - this.abyssalDepth) * 0.33 * step1;
            if (step2 > 0) stepDepth = this.abyssalDepth + (this.trenchStepsDepth - this.abyssalDepth) * 0.66 * step2;
            if (step3 > 0) stepDepth = this.abyssalDepth + (this.trenchStepsDepth - this.abyssalDepth) * step3;
            
            trenchDepth = stepDepth;
            
            // Add variations along the trench
            trenchDepth += Math.sin(normalizedZ * Math.PI * 8) * 200;
        }
        
        // PRECIPICE drop to 13000m (final 30% of trench area)
        else {
            const precipiceProgress = (trenchProgress - 0.7) / 0.3; // 0 to 1 for precipice
            const precipiceDepth = this.trenchStepsDepth + (this.trenchPrecipiceDepth - this.trenchStepsDepth) * Math.pow(precipiceProgress, 3); // Steep drop
            trenchDepth = precipiceDepth;
            
            // Very deep trench floor variations
            trenchDepth += Math.sin(normalizedZ * Math.PI * 12) * 100;
        }
        
        // Trench is narrower in the middle
        const trenchDistance = Math.abs(normalizedZ);
        if (trenchDistance > 0.3) { // Outside trench width, return to abyssal depth
            const edgeBlend = Math.min((trenchDistance - 0.3) / 0.2, 1); // Blend back to abyssal
            trenchDepth = trenchDepth + (this.abyssalDepth - trenchDepth) * edgeBlend;
        }
        
        return trenchDepth;
    }

    createBranchingCanyons(normalizedX, normalizedZ) {
        // COMPLEX BRANCHING CANYON SYSTEM for 100km terrain - down to 3000m
        let terrain = this.plainsDepth; // Start from base terrain
        
        // Main canyon network - multiple major canyons
        const majorCanyons = [
            // Main north-south canyon
            { centerX: -0.2, centerZ: 0, width: 0.12, maxDepth: this.canyonMaxDepth, angle: 0 },
            // Diagonal canyon crossing
            { centerX: 0.1, centerZ: -0.3, width: 0.10, maxDepth: -2500, angle: Math.PI / 4 },
            // Curved canyon system
            { centerX: -0.5, centerZ: 0.4, width: 0.08, maxDepth: -2200, angle: Math.PI / 6 }
        ];
        
        majorCanyons.forEach(canyon => {
            // Calculate distance from canyon centerline
            let distanceFromCanyon;
            if (canyon.angle === 0) {
                // Straight north-south canyon
                distanceFromCanyon = Math.abs(normalizedX - canyon.centerX);
            } else {
                // Angled canyon - rotate coordinates
                const cosAngle = Math.cos(canyon.angle);
                const sinAngle = Math.sin(canyon.angle);
                const rotatedX = (normalizedX - canyon.centerX) * cosAngle - (normalizedZ - canyon.centerZ) * sinAngle;
                distanceFromCanyon = Math.abs(rotatedX);
            }
            
            if (distanceFromCanyon < canyon.width) {
                // U-shaped canyon profile
                const profileFactor = 1 - Math.pow(distanceFromCanyon / canyon.width, 2);
                
                // Canyon gets deeper towards center and varies along length
                const lengthVariation = Math.sin((normalizedZ + canyon.centerZ) * Math.PI * 3) * 0.3 + 0.7; // 0.4 to 1.0
                const canyonDepth = canyon.maxDepth * profileFactor * lengthVariation;
                
                terrain = Math.min(terrain, canyonDepth);
            }
        });
        
        // Branching tributary canyons (smaller, connecting to main canyons)
        const tributaries = [
            { centerX: -0.1, centerZ: -0.6, width: 0.06, depth: -1800, angle: -Math.PI / 3 },
            { centerX: 0.2, centerZ: 0.5, width: 0.05, depth: -1600, angle: Math.PI / 2 },
            { centerX: -0.7, centerZ: -0.2, width: 0.04, depth: -1400, angle: Math.PI / 4 },
            { centerX: 0.3, centerZ: -0.1, width: 0.07, depth: -2000, angle: -Math.PI / 6 },
            { centerX: -0.4, centerZ: 0.7, width: 0.05, depth: -1500, angle: 0 },
            { centerX: 0.0, centerZ: 0.8, width: 0.04, depth: -1300, angle: Math.PI / 3 }
        ];
        
        tributaries.forEach(trib => {
            const cosAngle = Math.cos(trib.angle);
            const sinAngle = Math.sin(trib.angle);
            const rotatedX = (normalizedX - trib.centerX) * cosAngle - (normalizedZ - trib.centerZ) * sinAngle;
            const rotatedZ = (normalizedX - trib.centerX) * sinAngle + (normalizedZ - trib.centerZ) * cosAngle;
            
            if (Math.abs(rotatedX) < trib.width && Math.abs(rotatedZ) < 0.25) {
                const tribProfile = 1 - Math.pow(Math.abs(rotatedX) / trib.width, 2);
                const tribDepth = trib.depth * tribProfile;
                terrain = Math.min(terrain, tribDepth);
            }
        });
        
        return terrain;
    }

    createSeaCaveNetwork(normalizedX, normalizedZ) {
        // INTERCONNECTED SEA CAVE SYSTEM for 100km terrain
        let terrain = this.plainsDepth; // Start from base terrain
        
        // Large cave chambers (major cavern systems)
        const majorCaves = [
            { x: -0.6, z: -0.3, radius: 0.15, depth: -800, entranceDepth: -600 },
            { x: -0.2, z: 0.2, radius: 0.12, depth: -900, entranceDepth: -650 },
            { x: -0.8, z: 0.5, radius: 0.10, depth: -750, entranceDepth: -550 },
            { x: 0.1, z: -0.6, radius: 0.13, depth: -950, entranceDepth: -700 },
            { x: -0.4, z: 0.7, radius: 0.09, depth: -700, entranceDepth: -500 },
            { x: 0.2, z: 0.4, radius: 0.11, depth: -850, entranceDepth: -600 }
        ];
        
        majorCaves.forEach(cave => {
            const distance = Math.sqrt(
                (normalizedX - cave.x) * (normalizedX - cave.x) +
                (normalizedZ - cave.z) * (normalizedZ - cave.z)
            );

            // Main cave chamber with gradual entrance
            if (distance < cave.radius) {
                const caveProfile = 1 - Math.pow(distance / cave.radius, 2);
                const caveDepth = cave.entranceDepth + (cave.depth - cave.entranceDepth) * caveProfile;
                terrain = Math.min(terrain, caveDepth);
            }
        });
        
        // Interconnecting tunnel network between caves
        const tunnels = [
            { from: { x: -0.6, z: -0.3 }, to: { x: -0.2, z: 0.2 }, width: 0.04, depth: -650 },
            { from: { x: -0.2, z: 0.2 }, to: { x: 0.1, z: -0.6 }, width: 0.03, depth: -600 },
            { from: { x: -0.8, z: 0.5 }, to: { x: -0.4, z: 0.7 }, width: 0.035, depth: -550 },
            { from: { x: 0.1, z: -0.6 }, to: { x: 0.2, z: 0.4 }, width: 0.04, depth: -700 },
            { from: { x: -0.6, z: -0.3 }, to: { x: -0.8, z: 0.5 }, width: 0.03, depth: -575 },
            { from: { x: -0.4, z: 0.7 }, to: { x: 0.2, z: 0.4 }, width: 0.03, depth: -600 }
        ];
        
        tunnels.forEach(tunnel => {
            const tunnelDistance = this.distanceToLine(
                normalizedX, normalizedZ,
                tunnel.from.x, tunnel.from.z,
                tunnel.to.x, tunnel.to.z
            );
            
            if (tunnelDistance < tunnel.width) {
                const tunnelProfile = 1 - Math.pow(tunnelDistance / tunnel.width, 2);
                const tunnelDepth = tunnel.depth * tunnelProfile;
                terrain = Math.min(terrain, tunnelDepth);
            }
        });
        
        return terrain;
    }

    distanceToLine(px, pz, x1, z1, x2, z2) {
        // Calculate distance from point (px, pz) to line segment (x1,z1)-(x2,z2)
        const A = px - x1;
        const B = pz - z1;
        const C = x2 - x1;
        const D = z2 - z1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) param = dot / lenSq;

        let xx, zz;
        if (param < 0) {
            xx = x1;
            zz = z1;
        } else if (param > 1) {
            xx = x2;
            zz = z2;
        } else {
            xx = x1 + param * C;
            zz = z1 + param * D;
        }

        const dx = px - xx;
        const dz = pz - zz;
        return Math.sqrt(dx * dx + dz * dz);
    }

    createCanyonSystem(normalizedX, normalizedZ) {
        // Legacy function - kept for compatibility
        let canyonDepth = 0;

        // Main canyon branch (northwest to southeast) - Monterey Canyon scale
        const mainCanyonProgress = (normalizedX + normalizedZ + 1) / 2;
        const mainCanyonDistance = Math.abs(normalizedZ - normalizedX) * 0.5;
        if (mainCanyonDistance < 0.08 && mainCanyonProgress > 0.2 && mainCanyonProgress < 0.8) {
            canyonDepth = Math.min(canyonDepth, -2500 * (1 - mainCanyonDistance / 0.08));
        }

        // Secondary canyon branches - realistic submarine canyon depths
        const branches = [
            { startX: -0.2, startZ: 0.1, endX: 0.1, endZ: 0.4, width: 0.06, depth: -1800 },
            { startX: 0.3, startZ: -0.1, endX: 0.6, endZ: 0.2, width: 0.05, depth: -1500 },
            { startX: -0.1, startZ: -0.4, endX: 0.2, endZ: -0.1, width: 0.04, depth: -1200 }
        ];

        branches.forEach(branch => {
            const branchProgress = this.getDistanceToLine(
                normalizedX, normalizedZ,
                branch.startX, branch.startZ,
                branch.endX, branch.endZ
            );
            if (branchProgress.distance < branch.width && branchProgress.t >= 0 && branchProgress.t <= 1) {
                const branchDepth = branch.depth * (1 - branchProgress.distance / branch.width);
                canyonDepth = Math.min(canyonDepth, branchDepth);
            }
        });

        return canyonDepth;
    }

    getDistanceToLine(px, pz, x1, z1, x2, z2) {
        const dx = x2 - x1;
        const dz = z2 - z1;
        const length = Math.sqrt(dx * dx + dz * dz);

        if (length === 0) return { distance: Math.sqrt((px - x1) * (px - x1) + (pz - z1) * (pz - z1)), t: 0 };

        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (pz - z1) * dz) / (length * length)));
        const projectionX = x1 + t * dx;
        const projectionZ = z1 + t * dz;

        return {
            distance: Math.sqrt((px - projectionX) * (px - projectionX) + (pz - projectionZ) * (pz - projectionZ)),
            t: t
        };
    }

    getTerrainNoise(worldX, worldZ) {
        // Multi-octave noise for realistic terrain detail - scaled for deep ocean
        let noise = 0;
        let amplitude = 300; // Increased for realistic deep ocean variations
        let frequency = 0.0005; // Lower frequency for larger scale features

        for (let i = 0; i < 5; i++) {
            noise += Math.sin(worldX * frequency) * Math.cos(worldZ * frequency) * amplitude;
            frequency *= 2.1;
            amplitude *= 0.4;
        }

        return noise;
    }

    // LOD terrain chunk generation - Creates wireframe mesh like EPS vector graphics
    generateTerrainChunk(chunkX, chunkZ) {
        const chunkGroup = new THREE.Group();
        chunkGroup.name = `terrainChunk_${chunkX}_${chunkZ}`;

        const startX = chunkX * this.chunkSize - this.terrainSize / 2;
        const startZ = chunkZ * this.chunkSize - this.terrainSize / 2;
        const gridResolution = 50; // Grid lines every 50m
        const detailResolution = 10; // Point detail every 10m

        // Digital wireframe material - retro-futuristic cyan aesthetic  
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff, // Pure cyan like the inspiration images
            linewidth: 1,    // Clean thin lines for wireframe aesthetic
            transparent: true,
            opacity: 0.8,    // Slight transparency for depth
            fog: false       // Prevent fog from affecting terrain lines
        });

        // Create terrain mesh grid - X direction (parallel lines)
        for (let localZ = 0; localZ <= this.chunkSize; localZ += gridResolution) {
            const points = [];
            for (let localX = 0; localX <= this.chunkSize; localX += detailResolution) {
                const worldX = startX + localX;
                const worldZ = startZ + localZ;
                const height = this.getTerrainHeight(worldX, worldZ);
                points.push(new THREE.Vector3(worldX, height, worldZ));

                // Debug: Log first few points
                if (points.length <= 3) {
                    console.log(`Terrain point: (${worldX}, ${height}, ${worldZ})`);
                }
            }

            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                chunkGroup.add(line);
            }
        }

        // Create terrain mesh grid - Z direction (perpendicular lines)
        for (let localX = 0; localX <= this.chunkSize; localX += gridResolution) {
            const points = [];
            for (let localZ = 0; localZ <= this.chunkSize; localZ += detailResolution) {
                const worldX = startX + localX;
                const worldZ = startZ + localZ;
                const height = this.getTerrainHeight(worldX, worldZ);
                points.push(new THREE.Vector3(worldX, height, worldZ));
            }

            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                chunkGroup.add(line);
            }
        }

        return chunkGroup;
    }

    // REMOVED: Old LOD system replaced with sensor-based terrain visibility (see updateTerrainLOD method around line 2598)

    // Subtle Cave Systems (integrated with terrain)
    createCaveSystems() {
        this.caves = {
            blind: [],      // Dead-end caves
            navigable: [],  // Tunnels connecting areas
            chambers: []    // Large underground chambers
        };

        // Subtle cave material - darker and less prominent
        const caveMaterial = new THREE.LineBasicMaterial({
            color: 0x006666, // Dark cyan, subtle
            linewidth: 1,
            transparent: true,
            opacity: 0.4
        });

        // Just a few key cave entrances - very subtle
        const caveEntrances = [
            { x: -3000, z: 2000, depth: -150, radius: 20 },
            { x: 4000, z: -3000, depth: -300, radius: 25 },
            { x: -1000, z: 4000, depth: -250, radius: 15 }
        ];

        caveEntrances.forEach((cave, index) => {
            // Just create simple circular entrance markers
            const points = [];
            for (let i = 0; i <= 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const x = cave.x + Math.cos(angle) * cave.radius;
                const z = cave.z + Math.sin(angle) * cave.radius;
                points.push(new THREE.Vector3(x, cave.depth, z));
            }

            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, caveMaterial);
                line.name = `caveEntrance_${index}`;
                this.scene.add(line);
            }
        });

        console.log(`Subtle cave entrances created: ${caveEntrances.length} cave markers`);
    }

    // Full-scale wireframe terrain with geological features
    createFullScaleTerrain() {
        const terrainGroup = new THREE.Group();
        terrainGroup.name = 'fullScaleTerrain';

        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff, // Pure cyan for maximum visibility  
            linewidth: 1,    // WebGL limitation - linewidth > 1 often ignored
            transparent: false,
            opacity: 1.0,    // Full opacity for better visibility
            fog: false       // Prevent fog from affecting terrain lines
        });

        // Full scale terrain - 200km x 200km real bathymetry area  
        const size = 100000; // 100km radius = 200km total (expanded Monterey Canyon system)
        const resolution = 2000; // Grid lines every 2km (appropriate for 100km area)
        const detail = 500; // Points every 500m (reduced density for performance)

        console.log('Creating full-scale 200km wireframe terrain with real bathymetry data...');

        // Create X-direction lines (showing the terrain elevation)
        let minHeight = Infinity, maxHeight = -Infinity;
        let sampleCount = 0;
        for (let z = -size; z <= size; z += resolution) {
            const points = [];
            for (let x = -size; x <= size; x += detail) {
                const rawHeight = this.getTerrainHeight(x, z);
                // Scale height for visibility - bathymetry depths are negative, invert and scale them up
                // Convert depth to elevation: deeper = lower, shallower = higher
                const scaledHeight = (-rawHeight) * 0.05; // Invert depth to height and scale for visibility
                points.push(new THREE.Vector3(x, scaledHeight, z));
                
                // Track height range for debugging
                minHeight = Math.min(minHeight, rawHeight);
                maxHeight = Math.max(maxHeight, rawHeight);
                sampleCount++;
                
                // Log first few samples for debugging
                if (sampleCount <= 5) {
                    console.log(`🔍 Sample ${sampleCount}: (${x}, ${z}) raw=${rawHeight.toFixed(1)}m, scaled=${scaledHeight.toFixed(1)}`);
                }
                
                // Debug specific samples near submarine position (0,0,0)
                if (Math.abs(x) <= 1000 && Math.abs(z) <= 1000) {
                    console.log(`🎯 Near origin: (${x}, ${z}) raw=${rawHeight.toFixed(1)}m, scaled=${scaledHeight.toFixed(1)}`);
                }
            }

            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                terrainGroup.add(line);
            }
        }

        // Create Z-direction lines (perpendicular grid)
        for (let x = -size; x <= size; x += resolution) {
            const points = [];
            for (let z = -size; z <= size; z += detail) {
                const rawHeight = this.getTerrainHeight(x, z);
                // Scale height for visibility - same scaling as X-direction lines
                const scaledHeight = (-rawHeight) * 0.05; // Invert depth to height and scale for visibility
                points.push(new THREE.Vector3(x, scaledHeight, z));
            }

            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                terrainGroup.add(line);
            }
        }

        this.scene.add(terrainGroup);
        console.log(`Full-scale terrain mesh created with ${terrainGroup.children.length} wireframe lines`);
        console.log(`🌊 Depth range: ${minHeight.toFixed(0)}m to ${maxHeight.toFixed(0)}m (inverted and scaled by 0.05x for visibility)`);
        console.log('Features: Real North Pacific Ocean bathymetry with seamounts, valleys, and underwater ridges');
        console.log(`🎯 Terrain group added to scene with ${terrainGroup.children.length} children at position (0,0,0)`);
        
        // Force terrain to be visible
        terrainGroup.visible = true;
        terrainGroup.children.forEach(child => {
            child.visible = true;
        });
        console.log('🔍 Terrain forced to visible state for debugging');
        
        // Add a simple test line near submarine (0,0,0) to verify rendering works
        const testPoints = [
            new THREE.Vector3(-1000, 100, 0),  // 1km left of sub, 100m above
            new THREE.Vector3(1000, 100, 0)    // 1km right of sub, 100m above
        ];
        const testGeometry = new THREE.BufferGeometry().setFromPoints(testPoints);
        const testLine = new THREE.Line(testGeometry, wireframeMaterial);
        terrainGroup.add(testLine);
        console.log('🧪 Added test line from (-1000,100,0) to (1000,100,0) for visibility verification');
    }

    // Function to get seabed height at any world position
    getSeabedHeight(worldX, worldZ) {
        if (this.getTerrainHeight) {
            return this.getTerrainHeight(worldX, worldZ);
        }
        return -25; // Fallback
    }

    generateHeightmap(width, height) {
        const data = new Float32Array(width * height);

        // Generate dramatic 1980s-style wireframe terrain
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x;

                // Normalize coordinates
                const nx = (x / (width - 1)) - 0.5;
                const ny = (y / (height - 1)) - 0.5;

                let elevation = 0;

                // Create dramatic mountain ridges (80s style) - MUCH higher
                const ridge1 = Math.abs(Math.sin(nx * Math.PI * 3)) * Math.exp(-(ny * ny) * 8) * 200;
                const ridge2 = Math.abs(Math.cos(ny * Math.PI * 2)) * Math.exp(-(nx * nx) * 6) * 180;
                const ridge3 = Math.abs(Math.sin((nx + ny) * Math.PI * 4)) * Math.exp(-((nx*nx + ny*ny) * 4)) * 160;

                elevation += ridge1 + ridge2 + ridge3;

                // Add fractal noise for surface detail with multiple octaves
                elevation += this.noise(nx * 8, ny * 8) * 50;
                elevation += this.noise(nx * 16, ny * 16) * 25;
                elevation += this.noise(nx * 32, ny * 32) * 15;
                elevation += this.noise(nx * 64, ny * 64) * 8;

                // Create deep valleys between ridges
                const valleyMask = 1 - Math.exp(-((nx*nx + ny*ny) * 2));
                elevation *= valleyMask;

                // Add massive dramatic peaks (80s mountain style)
                const peak1 = Math.exp(-((nx - 0.3) ** 2 + (ny - 0.2) ** 2) * 25) * 350;
                const peak2 = Math.exp(-((nx + 0.2) ** 2 + (ny + 0.3) ** 2) * 20) * 320;
                const peak3 = Math.exp(-((nx + 0.1) ** 2 + (ny - 0.4) ** 2) * 30) * 300;
                const peak4 = Math.exp(-((nx - 0.1) ** 2 + (ny + 0.1) ** 2) * 35) * 280;
                const peak5 = Math.exp(-((nx - 0.4) ** 2 + (ny + 0.4) ** 2) * 40) * 260;

                elevation += peak1 + peak2 + peak3 + peak4 + peak5;

                // Create MUCH DEEPER and interconnected canyon systems
                const trench1 = Math.exp(-(((nx + 0.4) ** 2) * 50 + ((ny - 0.1) ** 2) * 8)) * -500;
                const trench2 = Math.exp(-(((nx - 0.1) ** 2) * 8 + ((ny + 0.2) ** 2) * 40)) * -450;
                const trench3 = Math.exp(-(((nx + 0.2) ** 2) * 30 + ((ny - 0.3) ** 2) * 15)) * -400;
                const trench4 = Math.exp(-(((nx - 0.3) ** 2) * 25 + ((ny + 0.1) ** 2) * 20)) * -380;

                // Create interconnected canyon network
                const canyonNetwork1 = Math.exp(-(Math.pow(Math.abs(nx + ny), 2) * 40)) * -300;
                const canyonNetwork2 = Math.exp(-(Math.pow(Math.abs(nx - ny), 2) * 35)) * -280;

                elevation += trench1 + trench2 + trench3 + trench4 + canyonNetwork1 + canyonNetwork2;

                // Add deep pits and cave entrances
                const pit1 = Math.exp(-((nx - 0.15) ** 2 + (ny - 0.25) ** 2) * 100) * -200;
                const pit2 = Math.exp(-((nx + 0.25) ** 2 + (ny + 0.15) ** 2) * 120) * -180;
                const pit3 = Math.exp(-((nx + 0.05) ** 2 + (ny - 0.35) ** 2) * 80) * -160;

                elevation += pit1 + pit2 + pit3;

                // Base seafloor level
                elevation -= 60;

                data[index] = elevation;
            }
        }

        return data;
    }

    // Simple noise function for terrain generation
    noise(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return (n - Math.floor(n)) * 2 - 1;
    }

    createSeafloorTopography() {
        // Create detailed geological wireframe seafloor like ChatGPT image
        const vectorMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 1,
            transparent: true,
            opacity: 0.8
        });

        const topographyGroup = new THREE.Group();

        // Create multiple deep trenches with detailed geological layers
        const trenches = [
            { x: -600, z: 0, width: 300, length: 800, depth: 150 },
            { x: 400, z: -600, width: 200, length: 600, depth: 120 },
            { x: 0, z: 400, width: 250, length: 700, depth: 130 }
        ];

        trenches.forEach(trench => {
            // Create trench with multiple depth layers (like geological strata)
            for (let layer = 0; layer < 8; layer++) {
                const layerDepth = -50 - (layer / 7) * trench.depth;
                const layerWidth = trench.width * (1 - layer * 0.1);

                // Horizontal layer lines (geological strata)
                for (let i = 0; i <= 20; i++) {
                    const progress = i / 20;
                    const x = trench.x + (progress - 0.5) * trench.length;

                    const layerGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(x, layerDepth, trench.z - layerWidth/2),
                        new THREE.Vector3(x, layerDepth, trench.z + layerWidth/2)
                    ]);
                    const layerLine = new THREE.Line(layerGeometry, vectorMaterial);
                    topographyGroup.add(layerLine);
                }

                // Vertical cliff faces (trench walls)
                for (let i = 0; i <= 15; i++) {
                    const progress = i / 15;
                    const z = trench.z + (progress - 0.5) * layerWidth;

                    const leftWallGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(trench.x - trench.length/2, -50, z),
                        new THREE.Vector3(trench.x - trench.length/2, layerDepth, z)
                    ]);
                    const leftWall = new THREE.Line(leftWallGeometry, vectorMaterial);
                    topographyGroup.add(leftWall);

                    const rightWallGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(trench.x + trench.length/2, -50, z),
                        new THREE.Vector3(trench.x + trench.length/2, layerDepth, z)
                    ]);
                    const rightWall = new THREE.Line(rightWallGeometry, vectorMaterial);
                    topographyGroup.add(rightWall);
                }
            }

            // Add jagged crevasses within trenches
            for (let c = 0; c < 5; c++) {
                const crevX = trench.x + (Math.random() - 0.5) * trench.length * 0.8;
                const crevZ = trench.z + (Math.random() - 0.5) * trench.width * 0.6;
                const crevDepth = 30 + Math.random() * 40;

                // Create irregular crevasse shape
                const crevPoints = [];
                for (let p = 0; p < 8; p++) {
                    const angle = (p / 8) * Math.PI * 2;
                    const radius = 10 + Math.random() * 15;
                    crevPoints.push(new THREE.Vector3(
                        crevX + Math.cos(angle) * radius,
                        -50 - Math.random() * crevDepth,
                        crevZ + Math.sin(angle) * radius
                    ));
                }

                // Connect crevasse points
                for (let p = 0; p < crevPoints.length; p++) {
                    const next = (p + 1) % crevPoints.length;
                    const crevGeometry = new THREE.BufferGeometry().setFromPoints([
                        crevPoints[p],
                        crevPoints[next]
                    ]);
                    const crevLine = new THREE.Line(crevGeometry, vectorMaterial);
                    topographyGroup.add(crevLine);
                }
            }
        });

        // Create detailed seafloor plains with elevation contours
        for (let contourLevel = 0; contourLevel < 12; contourLevel++) {
            const elevation = -40 - contourLevel * 3;
            const contourSize = 1500 + contourLevel * 100;

            // Create irregular contour lines
            for (let ring = 0; ring < 3; ring++) {
                const points = [];
                const numPoints = 32;

                for (let i = 0; i <= numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    const radius = contourSize/2 + ring * 200 + Math.sin(angle * 4) * 50;
                    const noise = (Math.random() - 0.5) * 30; // Natural irregularity

                    points.push(new THREE.Vector3(
                        Math.cos(angle) * radius + noise,
                        elevation + Math.sin(angle * 6) * 5,
                        Math.sin(angle) * radius + noise
                    ));
                }

                const contourGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const contour = new THREE.Line(contourGeometry, vectorMaterial);
                topographyGroup.add(contour);
            }
        }

        // Add detailed rock formations and ridges
        for (let ridge = 0; ridge < 15; ridge++) {
            const ridgeX = (Math.random() - 0.5) * 1800;
            const ridgeZ = (Math.random() - 0.5) * 1800;
            const ridgeLength = 100 + Math.random() * 200;
            const ridgeHeight = 20 + Math.random() * 30;

            // Create jagged ridge profile
            const ridgePoints = [];
            for (let r = 0; r <= 20; r++) {
                const progress = r / 20;
                const x = ridgeX + (progress - 0.5) * ridgeLength;
                const height = -50 + Math.sin(progress * Math.PI) * ridgeHeight + (Math.random() - 0.5) * 10;
                ridgePoints.push(new THREE.Vector3(x, height, ridgeZ));
            }

            const ridgeGeometry = new THREE.BufferGeometry().setFromPoints(ridgePoints);
            const ridge = new THREE.Line(ridgeGeometry, vectorMaterial);
            topographyGroup.add(ridge);

            // Add cross-sectional detail lines
            for (let cross = 0; cross < ridgePoints.length - 1; cross++) {
                const crossGeometry = new THREE.BufferGeometry().setFromPoints([
                    ridgePoints[cross],
                    new THREE.Vector3(ridgePoints[cross].x, -50, ridgePoints[cross].z - 20),
                    new THREE.Vector3(ridgePoints[cross].x, -50, ridgePoints[cross].z + 20)
                ]);
                const crossLine = new THREE.Line(crossGeometry, vectorMaterial);
                topographyGroup.add(crossLine);
            }
        }

        topographyGroup.name = 'detailedSeafloorTopography';
        this.scene.add(topographyGroup);
        console.log('Detailed geological seafloor topography created (ChatGPT style)');
    }

    createWaterSurface() {
        // Create wireframe water surface grid (much larger to match terrain)
        const vectorMaterial = new THREE.LineBasicMaterial({
            color: 0x0099ff, // Blue tint for water
            linewidth: 1,
            transparent: true,
            opacity: 0.3
        });

        const surfaceGroup = new THREE.Group();
        const surfaceSize = 4000; // Match terrain size
        const surfaceDivisions = 50; // More divisions for detail

        // Surface grid lines
        for (let i = 0; i <= surfaceDivisions; i++) {
            const x = (i / surfaceDivisions) * surfaceSize - surfaceSize/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x, 0, -surfaceSize/2),
                new THREE.Vector3(x, 0, surfaceSize/2)
            ]);
            const line = new THREE.Line(geometry, vectorMaterial);
            surfaceGroup.add(line);
        }

        for (let i = 0; i <= surfaceDivisions; i++) {
            const z = (i / surfaceDivisions) * surfaceSize - surfaceSize/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-surfaceSize/2, 0, z),
                new THREE.Vector3(surfaceSize/2, 0, z)
            ]);
            const line = new THREE.Line(geometry, vectorMaterial);
            surfaceGroup.add(line);
        }

        this.waterPlane = surfaceGroup;
        this.waterPlane.position.y = 300; // Move to top of 3D scene (above highest peaks)
        this.waterPlane.name = 'waterSurface';
        this.scene.add(this.waterPlane);

        // Add dual thermoclines at specified depths
        this.createDualThermoclines();
    }

    createKelpForest() {
        // Create wireframe kelp plants (simplified vector style)
        const vectorMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 1,
            transparent: true,
            opacity: 0.6
        });

        for (let i = 0; i < 15; i++) { // Reduced count for cleaner look
            const kelpGroup = new THREE.Group();
            const height = 6 + Math.random() * 4;

            // Main stem (vertical line)
            const stemGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, -25, 0),
                new THREE.Vector3(0, -25 + height, 0)
            ]);
            const stem = new THREE.Line(stemGeometry, vectorMaterial);
            kelpGroup.add(stem);

            // Simple fronds (angled lines)
            const frondCount = 3 + Math.floor(Math.random() * 3);
            for (let j = 0; j < frondCount; j++) {
                const frondHeight = 0 + (j + 1) * (height / frondCount); // Start from local seabed (0)
                const angle = j * Math.PI / 3;
                const frondLength = 0.8 + Math.random() * 0.4;

                const frondGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, frondHeight, 0),
                    new THREE.Vector3(
                        Math.cos(angle) * frondLength,
                        frondHeight + 0.3,
                        Math.sin(angle) * frondLength
                    )
                ]);
                const frond = new THREE.Line(frondGeometry, vectorMaterial);
                kelpGroup.add(frond);
            }

            // Random position locked to seabed
            const kelpX = (Math.random() - 0.5) * 1000; // Spread across larger area
            const kelpZ = (Math.random() - 0.5) * 1000;
            const kelpSeabedY = this.getSeabedHeight(kelpX, kelpZ);
            kelpGroup.position.set(kelpX, kelpSeabedY, kelpZ);
            kelpGroup.name = 'kelp';

            this.kelp.push(kelpGroup);
            this.scene.add(kelpGroup);
        }
    }

    createRockFormations() {
        // Create rocky outcrops on the sea floor
        for (let i = 0; i < 20; i++) {
            const rockGroup = new THREE.Group();

            // Main rock
            const rockGeometry = new THREE.SphereGeometry(
                1 + Math.random() * 2,
                8,
                6
            );

            // Deform the sphere to make it more rock-like
            const vertices = rockGeometry.attributes.position.array;
            for (let j = 0; j < vertices.length; j += 3) {
                const scale = 0.8 + Math.random() * 0.4;
                vertices[j] *= scale;
                vertices[j + 1] *= scale;
                vertices[j + 2] *= scale;
            }
            rockGeometry.attributes.position.needsUpdate = true;
            rockGeometry.computeVertexNormals();

            const rockMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });

            const rockEdges = new THREE.EdgesGeometry(rockGeometry);
            const rock = new THREE.LineSegments(rockEdges, rockMaterial);
            rock.position.y = 2; // Slightly above local seabed (group will be positioned correctly)
            rock.castShadow = true;
            rockGroup.add(rock);

            // Add smaller rocks around main rock
            for (let k = 0; k < 2 + Math.random() * 3; k++) {
                const smallRockGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.5);
                const smallRockEdges = new THREE.EdgesGeometry(smallRockGeometry);
                const smallRock = new THREE.LineSegments(smallRockEdges, rockMaterial);
                smallRock.position.set(
                    (Math.random() - 0.5) * 4,
                    2 + Math.random() * 0.5,
                    (Math.random() - 0.5) * 4
                );
                smallRock.castShadow = true;
                rockGroup.add(smallRock);
            }

            // Random position locked to seabed
            const rockX = (Math.random() - 0.5) * 1600; // Spread across larger terrain
            const rockZ = (Math.random() - 0.5) * 1600;
            const rockSeabedY = this.getSeabedHeight(rockX, rockZ);
            rockGroup.position.set(rockX, rockSeabedY, rockZ);
            rockGroup.name = 'rocks';

            this.rocks.push(rockGroup);
            this.scene.add(rockGroup);
        }
    }

    createDebris() {
        // Create sunken ship debris and other underwater objects
        const shipDebris = new THREE.Group();

        // Ship hull fragment
        const hullGeometry = new THREE.BoxGeometry(8, 2, 3);
        const hullMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const hullEdges = new THREE.EdgesGeometry(hullGeometry);
        const hull = new THREE.LineSegments(hullEdges, hullMaterial);
        hull.rotation.z = Math.PI / 6; // Tilted
        hull.position.y = -23;
        shipDebris.add(hull);

        // Broken mast
        const mastGeometry = new THREE.CylinderGeometry(0.1, 0.15, 6);
        const mastMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const mastEdges = new THREE.EdgesGeometry(mastGeometry);
        const mast = new THREE.LineSegments(mastEdges, mastMaterial);
        mast.position.set(2, -20, 0);
        mast.rotation.z = Math.PI / 4;
        shipDebris.add(mast);

        // Scattered barrels
        for (let i = 0; i < 5; i++) {
            const barrelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.6);
            const barrelMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
            const barrelEdges = new THREE.EdgesGeometry(barrelGeometry);
            const barrel = new THREE.LineSegments(barrelEdges, barrelMaterial);
            barrel.position.set(
                (Math.random() - 0.5) * 15,
                -24.5,
                (Math.random() - 0.5) * 10
            );
            barrel.rotation.x = Math.random() * Math.PI;
            barrel.rotation.z = Math.random() * Math.PI;
            shipDebris.add(barrel);
        }

        const debrisX = -500, debrisZ = 600;
        const debrisSeabedY = this.getSeabedHeight(debrisX, debrisZ);
        shipDebris.position.set(debrisX, debrisSeabedY + 2, debrisZ); // Slightly above seabed
        shipDebris.name = 'shipwreck';
        this.debris.push(shipDebris);
        this.scene.add(shipDebris);

        // Add some modern debris (containers, etc.)
        for (let i = 0; i < 8; i++) {
            const containerGeometry = new THREE.BoxGeometry(
                2 + Math.random() * 2,
                1 + Math.random(),
                1 + Math.random()
            );
            const containerMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.4)
            });
            const container = new THREE.Mesh(containerGeometry, containerMaterial);

            container.position.set(
                (Math.random() - 0.5) * 100,
                -24.5,
                (Math.random() - 0.5) * 100
            );
            container.rotation.y = Math.random() * Math.PI * 2;
            container.castShadow = true;
            container.name = 'debris';

            this.debris.push(container);
            this.scene.add(container);
        }
    }

    // Create coral reef structures
    createCoralReefs() {
        for (let reefId = 0; reefId < 4; reefId++) {
            const reefGroup = new THREE.Group();
            reefGroup.name = `coralReef_${reefId}`;

            // Main reef structure (branching coral)
            const coralMaterial = new THREE.LineBasicMaterial({
                color: 0xff6b9d,
                transparent: true,
                opacity: 0.7
            });

            // Create branching coral structures
            for (let branch = 0; branch < 15; branch++) {
                const branchHeight = 0.5 + Math.random() * 2;
                const branchRadius = 0.2 + Math.random() * 0.3;

                // Main branch
                const points = [];
                const branchX = (Math.random() - 0.5) * 8;
                const branchZ = (Math.random() - 0.5) * 8;

                // Create curved branch
                for (let i = 0; i <= 10; i++) {
                    const t = i / 10;
                    const y = t * branchHeight;
                    const curve = Math.sin(t * Math.PI * 2) * branchRadius;
                    points.push(new THREE.Vector3(
                        branchX + curve,
                        y,
                        branchZ + Math.cos(t * Math.PI * 3) * branchRadius
                    ));
                }

                const branchGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const branchLine = new THREE.Line(branchGeometry, coralMaterial);
                reefGroup.add(branchLine);

                // Add smaller sub-branches
                if (Math.random() > 0.5) {
                    const subPoints = [
                        points[Math.floor(points.length * 0.7)],
                        new THREE.Vector3(
                            branchX + (Math.random() - 0.5) * 1,
                            branchHeight * 0.8,
                            branchZ + (Math.random() - 0.5) * 1
                        )
                    ];
                    const subGeometry = new THREE.BufferGeometry().setFromPoints(subPoints);
                    const subBranch = new THREE.Line(subGeometry, coralMaterial);
                    reefGroup.add(subBranch);
                }
            }

            // Position reef on seafloor
            const reefX = (Math.random() - 0.5) * 200;
            const reefZ = (Math.random() - 0.5) * 200;
            const reefSeabedY = this.getSeabedHeight(reefX, reefZ);
            reefGroup.position.set(reefX, reefSeabedY, reefZ);

            this.scene.add(reefGroup);
        }
        console.log('Created 4 coral reef structures');
    }

    // Create additional shipwreck sites
    createShipwrecks() {
        for (let wreckId = 0; wreckId < 3; wreckId++) {
            const wreckGroup = new THREE.Group();
            wreckGroup.name = `shipwreck_${wreckId}`;

            const wreckMaterial = new THREE.LineBasicMaterial({
                color: 0x8b4513,
                transparent: true,
                opacity: 0.6
            });

            // Main hull sections
            const hullLength = 8 + Math.random() * 12;
            const hullWidth = 2 + Math.random() * 3;
            const hullHeight = 1.5 + Math.random() * 2;

            // Hull wireframe
            const hullGeometry = new THREE.BoxGeometry(hullLength, hullHeight, hullWidth);
            const hullEdges = new THREE.EdgesGeometry(hullGeometry);
            const hull = new THREE.LineSegments(hullEdges, wreckMaterial);

            // Random tilt and damage
            hull.rotation.x = (Math.random() - 0.5) * 0.5;
            hull.rotation.z = (Math.random() - 0.5) * 0.8;
            hull.position.y = hullHeight * 0.3; // Partially buried
            wreckGroup.add(hull);

            // Broken superstructure
            for (let structure = 0; structure < 3; structure++) {
                const structGeometry = new THREE.BoxGeometry(
                    1 + Math.random() * 2,
                    0.5 + Math.random() * 1.5,
                    1 + Math.random() * 1.5
                );
                const structEdges = new THREE.EdgesGeometry(structGeometry);
                const structMesh = new THREE.LineSegments(structEdges, wreckMaterial);

                structMesh.position.set(
                    (Math.random() - 0.5) * hullLength * 0.8,
                    hullHeight + Math.random() * 1,
                    (Math.random() - 0.5) * hullWidth
                );
                structMesh.rotation.set(
                    Math.random() * 0.5,
                    Math.random() * Math.PI,
                    Math.random() * 0.5
                );
                wreckGroup.add(structMesh);
            }

            // Debris field around wreck
            for (let debris = 0; debris < 8; debris++) {
                const debrisSize = 0.2 + Math.random() * 0.8;
                const debrisGeometry = new THREE.BoxGeometry(debrisSize, debrisSize * 0.5, debrisSize);
                const debrisEdges = new THREE.EdgesGeometry(debrisGeometry);
                const debrisMesh = new THREE.LineSegments(debrisEdges, wreckMaterial);

                debrisMesh.position.set(
                    (Math.random() - 0.5) * hullLength * 2,
                    -0.2,
                    (Math.random() - 0.5) * hullLength * 2
                );
                debrisMesh.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                wreckGroup.add(debrisMesh);
            }

            // Position wreck on seafloor
            const wreckX = (Math.random() - 0.5) * 300;
            const wreckZ = (Math.random() - 0.5) * 300;
            const wreckSeabedY = this.getSeabedHeight(wreckX, wreckZ);
            wreckGroup.position.set(wreckX, wreckSeabedY, wreckZ);

            this.scene.add(wreckGroup);
        }
        console.log('Created 3 additional shipwreck sites');
    }

    createUnderwaterBases() {
        // Create different types of underwater bases

        // 1. Bottom-set base (friendly research station)
        const researchBase = this.createBottomBase('Research Station Alpha', true);
        const researchX = -1200, researchZ = 800;
        const researchSeabedY = this.getSeabedHeight(researchX, researchZ);
        researchBase.position.set(researchX, researchSeabedY, researchZ);
        this.bases.push({
            type: 'bottom',
            name: 'Research Station Alpha',
            friendly: true,
            position: researchBase.position.clone(),
            mesh: researchBase,
            services: ['refuel', 'repair', 'resupply'],
            dockingRange: 15
        });
        this.scene.add(researchBase);

        // 2. Free-floating base (military outpost)
        const militaryBase = this.createFloatingBase('Military Outpost Bravo', true);
        const militaryX = 1000, militaryZ = -600;
        const militarySeabedY = this.getSeabedHeight(militaryX, militaryZ);
        militaryBase.position.set(militaryX, militarySeabedY + 30, militaryZ); // Float above seabed
        this.bases.push({
            type: 'floating',
            name: 'Military Outpost Bravo',
            friendly: true,
            position: militaryBase.position.clone(),
            mesh: militaryBase,
            services: ['refuel', 'repair', 'resupply', 'torpedoes'],
            dockingRange: 20
        });
        this.scene.add(militaryBase);

        // 3. Ice-suspended base (arctic listening post)
        const iceGeometry = new THREE.BoxGeometry(400, 30, 300);
        const iceMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
        });
        const iceEdges = new THREE.EdgesGeometry(iceGeometry);
        const icePack = new THREE.LineSegments(iceEdges, iceMaterial);
        const iceX = -300, iceZ = -1200;
        icePack.position.set(iceX, 5, iceZ); // At surface
        this.scene.add(icePack);

        const arcticBase = this.createIceSuspendedBase('Arctic Listening Post Charlie', true);
        arcticBase.position.set(iceX, 0, iceZ); // Just below surface
        this.bases.push({
            type: 'ice_suspended',
            name: 'Arctic Listening Post Charlie',
            friendly: true,
            position: arcticBase.position.clone(),
            mesh: arcticBase,
            services: ['intelligence', 'repair'],
            dockingRange: 12
        });
        this.scene.add(arcticBase);

        // 4. Enemy bottom base (hostile)
        const enemyBase = this.createBottomBase('Enemy Installation Delta', false);
        const enemyX = 800, enemyZ = 1200;
        const enemySeabedY = this.getSeabedHeight(enemyX, enemyZ);
        enemyBase.position.set(enemyX, enemySeabedY, enemyZ);
        this.bases.push({
            type: 'bottom',
            name: 'Enemy Installation Delta',
            friendly: false,
            position: enemyBase.position.clone(),
            mesh: enemyBase,
            services: [],
            dockingRange: 0,
            threat: true
        });
        this.scene.add(enemyBase);

        console.log(`Created ${this.bases.length} underwater bases`);
    }

    createBottomBase(name, friendly) {
        const baseGroup = new THREE.Group();
        baseGroup.name = name;

        // Main dome structure
        const domeGeometry = new THREE.SphereGeometry(8, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: friendly ? 0.8 : 0.6
        });
        const domeEdges = new THREE.EdgesGeometry(domeGeometry);
        const dome = new THREE.LineSegments(domeEdges, domeMaterial);
        dome.position.y = 4;
        baseGroup.add(dome);

        // Support pillars
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const pillarGeometry = new THREE.CylinderGeometry(0.8, 1.2, 8);
            const pillarMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: friendly ? 0.7 : 0.5
            });
            const pillarEdges = new THREE.EdgesGeometry(pillarGeometry);
            const pillar = new THREE.LineSegments(pillarEdges, pillarMaterial);
            pillar.position.set(
                Math.cos(angle) * 6,
                0,
                Math.sin(angle) * 6
            );
            baseGroup.add(pillar);
        }

        // Central tower
        const towerGeometry = new THREE.CylinderGeometry(2, 3, 12);
        const towerMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: friendly ? 0.9 : 0.7
        });
        const towerEdges = new THREE.EdgesGeometry(towerGeometry);
        const tower = new THREE.LineSegments(towerEdges, towerMaterial);
        tower.position.y = 6;
        baseGroup.add(tower);

        // Docking arms
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const armGeometry = new THREE.BoxGeometry(8, 0.5, 1);
            const armMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7
            });
            const armEdges = new THREE.EdgesGeometry(armGeometry);
            const arm = new THREE.LineSegments(armEdges, armMaterial);
            arm.position.set(
                Math.cos(angle) * 10,
                2,
                Math.sin(angle) * 10
            );
            arm.rotation.y = angle;
            baseGroup.add(arm);
        }

        // Status lights
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const lightGeometry = new THREE.SphereGeometry(0.3);
            const lightMaterial = new THREE.LineBasicMaterial({
                color: friendly ? 0x00ff00 : 0xff0000,
                transparent: true,
                opacity: 1.0
            });
            const lightEdges = new THREE.EdgesGeometry(lightGeometry);
            const light = new THREE.LineSegments(lightEdges, lightMaterial);
            light.position.set(
                Math.cos(angle) * 8.5,
                8,
                Math.sin(angle) * 8.5
            );
            baseGroup.add(light);
        }

        return baseGroup;
    }

    createFloatingBase(name, friendly) {
        const baseGroup = new THREE.Group();
        baseGroup.name = name;

        // Main hull (submarine-like)
        const hullGeometry = new THREE.CylinderGeometry(4, 4, 20);
        const hullMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: friendly ? 0.8 : 0.6
        });
        const hullEdges = new THREE.EdgesGeometry(hullGeometry);
        const hull = new THREE.LineSegments(hullEdges, hullMaterial);
        hull.rotation.z = Math.PI / 2;
        baseGroup.add(hull);

        // Command tower
        const towerGeometry = new THREE.BoxGeometry(3, 6, 4);
        const towerMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const towerEdges = new THREE.EdgesGeometry(towerGeometry);
        const tower = new THREE.LineSegments(towerEdges, towerMaterial);
        tower.position.y = 5;
        baseGroup.add(tower);

        // Stabilizer fins
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const finGeometry = new THREE.BoxGeometry(0.5, 4, 6);
            const finMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            const fin = new THREE.Mesh(finGeometry, finMaterial);
            fin.position.set(
                Math.cos(angle) * 4.5,
                Math.sin(angle) * 4.5,
                0
            );
            baseGroup.add(fin);
        }

        // Docking tube
        const tubeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 6);
        const tubeMaterial = new THREE.MeshLambertMaterial({
            color: friendly ? 0x0099ff : 0xff9900
        });
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tube.position.y = -6;
        baseGroup.add(tube);

        // Navigation lights
        const lightPositions = [
            {x: 10, y: 2, color: friendly ? 0x00ff00 : 0xff0000},
            {x: -10, y: 2, color: friendly ? 0xff0000 : 0x00ff00},
            {x: 0, y: 8, color: 0xffffff}
        ];

        lightPositions.forEach(pos => {
            const lightGeometry = new THREE.SphereGeometry(0.4);
            const lightMaterial = new THREE.MeshBasicMaterial({ color: pos.color });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(pos.x, pos.y, 0);
            baseGroup.add(light);
        });

        return baseGroup;
    }

    createIceSuspendedBase(name, friendly) {
        const baseGroup = new THREE.Group();
        baseGroup.name = name;

        // Main pressure sphere
        const sphereGeometry = new THREE.SphereGeometry(5);
        const sphereMaterial = new THREE.MeshLambertMaterial({
            color: friendly ? 0x4466bb : 0xbb6644,
            transparent: true,
            opacity: 0.9
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.y = -8;
        baseGroup.add(sphere);

        // Support cables/tethers
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const cableGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8);
            const cableMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
            const cable = new THREE.Mesh(cableGeometry, cableMaterial);
            cable.position.set(
                Math.cos(angle) * 3,
                -4,
                Math.sin(angle) * 3
            );
            baseGroup.add(cable);
        }

        // Equipment pods
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
            const podGeometry = new THREE.CylinderGeometry(1.5, 1.5, 4);
            const podMaterial = new THREE.MeshLambertMaterial({
                color: friendly ? 0x336699 : 0x996633
            });
            const pod = new THREE.Mesh(podGeometry, podMaterial);
            pod.position.set(
                Math.cos(angle) * 6,
                -10,
                Math.sin(angle) * 6
            );
            pod.rotation.z = Math.PI / 2;
            baseGroup.add(pod);
        }

        // Antenna array
        const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3);
        const antennaMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        for (let i = 0; i < 6; i++) {
            const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
            antenna.position.set(
                (Math.random() - 0.5) * 4,
                -3,
                (Math.random() - 0.5) * 4
            );
            antenna.rotation.x = (Math.random() - 0.5) * 0.5;
            antenna.rotation.z = (Math.random() - 0.5) * 0.5;
            baseGroup.add(antenna);
        }

        // Status beacon
        const beaconGeometry = new THREE.SphereGeometry(0.5);
        const beaconMaterial = new THREE.MeshBasicMaterial({
            color: friendly ? 0x00ffff : 0xff8800
        });
        const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
        beacon.position.y = -2;
        baseGroup.add(beacon);

        return baseGroup;
    }

    createDualThermoclines() {
        // Create dual thermoclines at 200m and 1100m depths with variations
        const thermoclineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffaa,  // Green-cyan for thermoclines (distinct from terrain)
            transparent: true,
            opacity: 0.7,
            linewidth: 2
        });

        // Thermocline 1: ~200m depth (varies 180m-220m)
        this.createThermoclineLayer(this.thermoclineDepth1, 20, thermoclineMaterial, 'thermocline_200m');
        
        // Thermocline 2: ~1100m depth (varies 1050m-1150m) 
        this.createThermoclineLayer(this.thermoclineDepth2, 50, thermoclineMaterial, 'thermocline_1100m');

        console.log('Dual thermoclines created at', this.thermoclineDepth1, 'and', this.thermoclineDepth2, 'meters');
    }

    createThermoclineLayer(baseDepth, variation, material, name) {
        const thermoclineGroup = new THREE.Group();
        const gridSize = 30; // 30x30 grid for smooth thermocline
        const span = 100000; // 100km span (half the 200km terrain)

        // Create horizontal grid lines
        for (let i = 0; i <= gridSize; i++) {
            const points = [];
            const zPos = (i / gridSize - 0.5) * span;

            for (let j = 0; j <= gridSize; j++) {
                const xPos = (j / gridSize - 0.5) * span;
                
                // Create undulating thermocline surface
                const wave1 = Math.sin(xPos * 0.0002) * variation;
                const wave2 = Math.cos(zPos * 0.0003) * (variation * 0.6);
                const wave3 = Math.sin((xPos + zPos) * 0.0001) * (variation * 0.4);
                
                const depth = baseDepth + wave1 + wave2 + wave3;
                points.push(new THREE.Vector3(xPos, depth, zPos));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            thermoclineGroup.add(line);
        }

        // Create vertical grid lines
        for (let i = 0; i <= gridSize; i++) {
            const points = [];
            const xPos = (i / gridSize - 0.5) * span;

            for (let j = 0; j <= gridSize; j++) {
                const zPos = (j / gridSize - 0.5) * span;
                
                const wave1 = Math.sin(xPos * 0.0002) * variation;
                const wave2 = Math.cos(zPos * 0.0003) * (variation * 0.6);
                const wave3 = Math.sin((xPos + zPos) * 0.0001) * (variation * 0.4);
                
                const depth = baseDepth + wave1 + wave2 + wave3;
                points.push(new THREE.Vector3(xPos, depth, zPos));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            thermoclineGroup.add(line);
        }

        thermoclineGroup.name = name;
        this.scene.add(thermoclineGroup);
    }

    createThermoclines() {
        // Create thermocline layers (simplified for debugging)
        const thermoclineMaterial = new THREE.LineBasicMaterial({
            color: 0x66aaff, // Light blue for temperature layers
            linewidth: 1,
            transparent: true,
            opacity: 0.4
        });

        const thermoclineGroup = new THREE.Group();
        const layers = [-20, -80, -150, -300];

        // Create simple horizontal grid layers
        layers.forEach((depth, index) => {
            for (let x = -1500; x <= 1500; x += 300) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(x, depth, -1500),
                    new THREE.Vector3(x, depth, 1500)
                ]);
                const line = new THREE.Line(geometry, thermoclineMaterial);
                thermoclineGroup.add(line);
            }

            for (let z = -1500; z <= 1500; z += 300) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-1500, depth, z),
                    new THREE.Vector3(1500, depth, z)
                ]);
                const line = new THREE.Line(geometry, thermoclineMaterial);
                thermoclineGroup.add(line);
            }
        });

        thermoclineGroup.name = 'thermoclines';
        this.scene.add(thermoclineGroup);
        console.log('Thermoclines created');
    }

    createUnderwaterCaves() {
        // Create underwater cave systems
        const caveMaterial = new THREE.LineBasicMaterial({
            color: 0x444444, // Dark grey for cave walls
            linewidth: 1,
            transparent: true,
            opacity: 0.8
        });

        const caveGroup = new THREE.Group();

        // Define cave locations near deep canyons and cliffs
        const caveLocations = [
            { x: -800, z: 200, depth: -150, size: 40, tunnels: 3 },
            { x: 400, z: -600, depth: -120, size: 35, tunnels: 4 },
            { x: -300, z: 800, depth: -180, size: 50, tunnels: 5 },
            { x: 600, z: 300, depth: -200, size: 45, tunnels: 3 },
            { x: -1000, z: -400, depth: -170, size: 30, tunnels: 2 }
        ];

        // Simplified caves for now to avoid JS errors - will create basic cave chambers
        caveLocations.forEach((cave, caveIndex) => {
            const caveSystem = new THREE.Group();

            // Create main cave chamber (ellipsoid wireframe)
            const chamberGeometry = new THREE.SphereGeometry(cave.size, 12, 8);
            chamberGeometry.scale(1, 0.6, 1.5);
            const chamberEdges = new THREE.EdgesGeometry(chamberGeometry);
            const chamber = new THREE.LineSegments(chamberEdges, caveMaterial);
            chamber.position.y = cave.depth;
            caveSystem.add(chamber);

            caveSystem.position.set(cave.x, 0, cave.z);
            caveSystem.name = `underwater_cave_${caveIndex}`;
            caveGroup.add(caveSystem);
        });

        caveGroup.name = 'underwaterCaves';
        this.scene.add(caveGroup);
        console.log('Underwater cave systems created');
    }

    setupEnvironmentLighting() {
        // Add underwater lighting effects

        // Dim ambient light for underwater feel
        const existingAmbient = this.scene.getObjectByName('ambientLight');
        if (existingAmbient) {
            existingAmbient.intensity = 0.2; // Very dim ambient
        }

        // Add blue-tinted directional light from above (sunlight filtering through water)
        const underwaterLight = new THREE.DirectionalLight(0x4466aa, 0.6);
        underwaterLight.position.set(0, 10, 0);
        underwaterLight.target.position.set(0, -10, 0);
        underwaterLight.castShadow = true;
        underwaterLight.name = 'underwaterLight';
        this.scene.add(underwaterLight);
        this.scene.add(underwaterLight.target);

        // Add some point lights for mysterious depth lighting
        for (let i = 0; i < 3; i++) {
            const depthLight = new THREE.PointLight(0x00ffff, 0.3, 20);
            depthLight.position.set(
                (Math.random() - 0.5) * 80,
                -15 - Math.random() * 5,
                (Math.random() - 0.5) * 80
            );
            depthLight.name = 'depthLight';
            this.scene.add(depthLight);
        }
    }

    update(deltaTime) {
        // Update LOD terrain system based on player position
        if (window.playerSubmarine && window.playerSubmarine()) {
            const submarine = window.playerSubmarine();
            if (submarine && submarine.mesh) {
                const playerPos = submarine.mesh.position;
                if (this.updateTerrainLOD) {
                    // Initialize lastPlayerPosition if not set
                    if (!this.lastPlayerPosition || this.lastPlayerPosition.distanceTo(playerPos) > 100) {
                        this.updateTerrainLOD(playerPos);
                        if (!this.lastPlayerPosition) {
                            this.lastPlayerPosition = new THREE.Vector3();
                        }
                        this.lastPlayerPosition.copy(playerPos);
                    }
                }
            }
        }


        // Gentle water surface animation (now at top of scene)
        if (this.waterPlane) {
            this.waterPlane.position.y = 300 + Math.sin(Date.now() * 0.0005) * 0.2;
        }

        // Animate thermocline undulation
        if (this.thermoclineData) {
            const time = Date.now() * 0.0003; // Very slow undulation
            const waveAmplitude = 8; // Gentle wave height

            this.thermoclineData.lines.forEach((lineData, lineIndex) => {
                const positions = lineData.geometry.attributes.position.array;

                // Update each point in the line
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i];
                    const z = positions[i + 2];

                    // Create slow, gentle waves
                    const wave1 = Math.sin(time + x * 0.003 + z * 0.002) * waveAmplitude;
                    const wave2 = Math.cos(time * 0.7 + x * 0.002 - z * 0.003) * waveAmplitude * 0.6;

                    positions[i + 1] = this.thermoclineData.baseDepth + wave1 + wave2;
                }

                lineData.geometry.attributes.position.needsUpdate = true;
            });
        }
    }

    getBases() {
        return this.bases;
    }

    cleanup() {
        // Clean up ocean environment objects
        [...this.rocks, ...this.debris, ...this.bases].forEach(obj => {
            const meshToRemove = obj.mesh || obj;
            if (meshToRemove && meshToRemove.parent) {
                meshToRemove.parent.remove(meshToRemove);
            }
            // Dispose of geometries and materials
            if (meshToRemove && meshToRemove.traverse) {
                meshToRemove.traverse((child) => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => mat.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
            }
        });

        if (this.seaFloor) {
            this.scene.remove(this.seaFloor);
            this.seaFloor.geometry.dispose();
            this.seaFloor.material.dispose();
        }

        if (this.waterPlane) {
            this.scene.remove(this.waterPlane);
            this.waterPlane.geometry.dispose();
            this.waterPlane.material.dispose();
        }
    }

    // New terrain generation method for varied seabed
    generateVariedHeightmap(width, height) {
        const data = new Float32Array(width * height);

        // Generate much more varied terrain with seamounts, canyons, and abyssal plains
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x;

                // Normalize coordinates
                const nx = (x / (width - 1)) - 0.5;
                const ny = (y / (height - 1)) - 0.5;
                const distance = Math.sqrt(nx * nx + ny * ny);

                let elevation = 0;

                // Base ocean floor - deeper for realism
                elevation = -800;

                // Create major seamount chains with randomized positions and sizes
                const seamountOffset1 = this.noise(nx * 8, ny * 8) * 0.1; // Random offset up to 0.1
                const seamountOffset2 = this.noise(nx * 12, ny * 10) * 0.08;
                const seamountOffset3 = this.noise(nx * 15, ny * 12) * 0.09;

                const seamount1 = Math.exp(-((nx - (0.2 + seamountOffset1)) ** 2 + (ny + (0.1 + seamountOffset1)) ** 2) * (15 + this.noise(nx * 20, ny * 25) * 5)) * (1200 + this.noise(nx * 18, ny * 22) * 200);
                const seamount2 = Math.exp(-((nx + (0.3 + seamountOffset2)) ** 2 + (ny - (0.2 + seamountOffset2)) ** 2) * (20 + this.noise(nx * 24, ny * 28) * 6)) * (1100 + this.noise(nx * 26, ny * 24) * 180);
                const seamount3 = Math.exp(-((nx + (0.1 + seamountOffset3)) ** 2 + (ny + (0.3 + seamountOffset3)) ** 2) * (18 + this.noise(nx * 22, ny * 30) * 4)) * (1000 + this.noise(nx * 28, ny * 20) * 150);

                // Underwater mountains with randomized characteristics
                const mountainOffset1 = this.noise(nx * 16, ny * 14) * 0.07;
                const mountainOffset2 = this.noise(nx * 18, ny * 16) * 0.06;
                const mountainOffset3 = this.noise(nx * 14, ny * 18) * 0.08;

                const mountain1 = Math.exp(-((nx - (0.4 + mountainOffset1)) ** 2 + (ny - (0.1 + mountainOffset1)) ** 2) * (12 + this.noise(nx * 32, ny * 35) * 4)) * (600 + this.noise(nx * 35, ny * 32) * 100);
                const mountain2 = Math.exp(-((nx + (0.2 + mountainOffset2)) ** 2 + (ny + (0.1 + mountainOffset2)) ** 2) * (14 + this.noise(nx * 38, ny * 40) * 3)) * (550 + this.noise(nx * 40, ny * 38) * 90);
                const mountain3 = Math.exp(-((nx - (0.1 + mountainOffset3)) ** 2 + (ny - (0.3 + mountainOffset3)) ** 2) * (16 + this.noise(nx * 36, ny * 42) * 5)) * (500 + this.noise(nx * 42, ny * 36) * 80);

                elevation += seamount1 + seamount2 + seamount3 + mountain1 + mountain2 + mountain3;

                // Create deep interconnected canyon system
                const canyon1 = Math.exp(-(Math.pow(Math.abs(nx + 0.4), 4) + Math.pow(Math.abs(ny - 0.2), 2)) * 8) * -600;
                const canyon2 = Math.exp(-(Math.pow(Math.abs(nx - 0.3), 2) + Math.pow(Math.abs(ny + 0.3), 4)) * 10) * -550;
                const canyon3 = Math.exp(-(Math.pow(Math.abs(nx + ny + 0.1), 2) * 12)) * -500;
                const canyon4 = Math.exp(-(Math.pow(Math.abs(nx - ny - 0.2), 2) * 15)) * -480;

                // Interconnected canyon network
                const networkCanyon1 = Math.exp(-(Math.pow(Math.sin(nx * 4 + ny * 2), 2) * 8)) * -400;
                const networkCanyon2 = Math.exp(-(Math.pow(Math.cos(nx * 2 + ny * 4), 2) * 10)) * -350;

                elevation += canyon1 + canyon2 + canyon3 + canyon4 + networkCanyon1 + networkCanyon2;

                // Abyssal plains (very deep flat areas)
                const abyssal1 = Math.exp(-((nx + 0.35) ** 2 + (ny - 0.35) ** 2) * 3) * -400;
                const abyssal2 = Math.exp(-((nx - 0.35) ** 2 + (ny + 0.35) ** 2) * 4) * -350;

                elevation += abyssal1 + abyssal2;

                // Add fractal noise for realistic detail
                elevation += this.noise(nx * 4, ny * 4) * 80;
                elevation += this.noise(nx * 8, ny * 8) * 40;
                elevation += this.noise(nx * 16, ny * 16) * 20;
                elevation += this.noise(nx * 32, ny * 32) * 10;

                data[index] = elevation;
            }
        }

        return data;
    }

    // Generate terrain chunks for LOD rendering
    generateAllTerrainChunks(wireframeMaterial) {
        console.log(`🔍 DEBUG: Starting terrain generation - chunksPerSide: ${this.chunksPerSide}, chunkSize: ${this.chunkSize}`);
        console.log(`🔍 DEBUG: terrainSize: ${this.terrainSize}, gridSize: ${this.gridSize}`);
        console.log(`🔍 DEBUG: heightData length: ${this.heightData ? this.heightData.length : 'NO HEIGHTDATA'}`);

        let totalChunks = 0;
        let chunksWithGeometry = 0;

        for (let chunkZ = 0; chunkZ < this.chunksPerSide; chunkZ++) {
            for (let chunkX = 0; chunkX < this.chunksPerSide; chunkX++) {
                const chunkGroup = this.generateTerrainChunk(chunkX, chunkZ, wireframeMaterial);
                const chunkKey = `${chunkX}_${chunkZ}`;
                totalChunks++;

                // CRITICAL FIX: Add chunk to seaFloor immediately, then control visibility via LOD
                chunkGroup.visible = true; // Start VISIBLE for debugging
                this.seaFloor.add(chunkGroup);

                // DEBUG: Check if chunk has geometry
                if (chunkGroup.children.length > 0) {
                    chunksWithGeometry++;
                }

                // FIXED: Simplified chunk positioning - center chunks around origin (0,0)
                const halfChunks = Math.floor(this.chunksPerSide / 2);
                this.terrainChunks.set(chunkKey, {
                    group: chunkGroup,
                    visible: true,  // Start visible for debugging
                    centerX: (chunkX - halfChunks) * this.chunkSize,
                    centerZ: (chunkZ - halfChunks) * this.chunkSize
                });
            }
        }

        console.log(`🔍 DEBUG: Generated ${totalChunks} chunks, ${chunksWithGeometry} have geometry`);
        console.log(`🔍 DEBUG: seaFloor children count: ${this.seaFloor.children.length}`);
    }

    // Generate individual terrain chunk
    generateTerrainChunk(chunkX, chunkZ, wireframeMaterial) {
        const chunkGroup = new THREE.Group();

        // FIXED: Map chunk coordinates to grid coordinates properly
        // Each chunk represents a portion of the gridSize, not literal coordinates
        const gridPointsPerChunk = Math.floor(this.gridSize / this.chunksPerSide);
        const startX = chunkX * gridPointsPerChunk;
        const startZ = chunkZ * gridPointsPerChunk;
        const endX = Math.min(startX + gridPointsPerChunk, this.gridSize);
        const endZ = Math.min(startZ + gridPointsPerChunk, this.gridSize);

        // Create horizontal grid lines for this chunk
        for (let z = startZ; z <= endZ; z++) {
            const points = [];
            for (let x = startX; x <= endX; x++) {
                const worldX = (x / this.gridSize) * this.terrainSize - this.terrainSize / 2;
                const worldZ = (z / this.gridSize) * this.terrainSize - this.terrainSize / 2;
                const height = this.heightData[z * (this.gridSize + 1) + x];
                points.push(new THREE.Vector3(worldX, height, worldZ));
            }

            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                chunkGroup.add(line);
            }
        }

        // Create vertical grid lines for this chunk
        for (let x = startX; x <= endX; x++) {
            const points = [];
            for (let z = startZ; z <= endZ; z++) {
                const worldX = (x / this.gridSize) * this.terrainSize - this.terrainSize / 2;
                const worldZ = (z / this.gridSize) * this.terrainSize - this.terrainSize / 2;
                const height = this.heightData[z * (this.gridSize + 1) + x];
                points.push(new THREE.Vector3(worldX, height, worldZ));
            }

            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                chunkGroup.add(line);
            }
        }

        return chunkGroup;
    }

    // Create seamounts that reach the surface as islands
    createSeamounts(wireframeMaterial) {
        const seamountPositions = [
            { x: 4000, z: -2000, height: 1200, radius: 800 },
            { x: -6000, z: 4000, height: 1100, radius: 900 },
            { x: -2000, z: -6000, height: 1000, radius: 700 }
        ];

        seamountPositions.forEach(seamount => {
            // Create seamount wireframe structure
            const seamountGroup = new THREE.Group();

            // Create circular contour lines at different heights
            for (let level = 0; level < 10; level++) {
                const height = seamount.height * (level / 10) - 200;
                const radius = seamount.radius * (1 - level * 0.08);

                const points = [];
                for (let i = 0; i <= 32; i++) {
                    const angle = (i / 32) * Math.PI * 2;
                    const x = seamount.x + Math.cos(angle) * radius;
                    const z = seamount.z + Math.sin(angle) * radius;
                    points.push(new THREE.Vector3(x, height, z));
                }

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                seamountGroup.add(line);

                // Add radial lines
                if (level % 2 === 0) {
                    for (let i = 0; i < 8; i++) {
                        const angle = (i / 8) * Math.PI * 2;
                        const radialPoints = [
                            new THREE.Vector3(seamount.x, height, seamount.z),
                            new THREE.Vector3(
                                seamount.x + Math.cos(angle) * radius,
                                height,
                                seamount.z + Math.sin(angle) * radius
                            )
                        ];

                        const radialGeometry = new THREE.BufferGeometry().setFromPoints(radialPoints);
                        const radialLine = new THREE.Line(radialGeometry, wireframeMaterial);
                        seamountGroup.add(radialLine);
                    }
                }
            }

            // Create surface island wireframe (above water level)
            const islandRadius = seamount.radius * 0.3;
            for (let level = 0; level < 5; level++) {
                const height = 50 + level * 20; // Above water surface
                const radius = islandRadius * (1 - level * 0.15);

                const points = [];
                for (let i = 0; i <= 16; i++) {
                    const angle = (i / 16) * Math.PI * 2;
                    const x = seamount.x + Math.cos(angle) * radius;
                    const z = seamount.z + Math.sin(angle) * radius;
                    points.push(new THREE.Vector3(x, height, z));
                }

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                seamountGroup.add(line);
            }

            this.seaFloor.add(seamountGroup);
        });
    }


    // Update terrain visibility based on submarine sensor ranges
    updateTerrainLOD(playerPosition) {
        if (!this.terrainChunks || !playerPosition) return;

        // Update current sensor range based on active sonar status
        // Check if sonar ping is still active (30s visible, fade 30-40s)
        const currentTime = Date.now();
        if (this.isActiveSonarActive) {
            const timeSincePing = currentTime - this.lastSonarPingTime;
            // Deactivate after 40 seconds (30s visible + 10s fade)
            if (timeSincePing > this.sonarPingDuration + this.sonarPingFadeDuration) {
                this.isActiveSonarActive = false;
                console.log('🔊 Active sonar range expired after 40 seconds, returning to passive sensors');
            }
        }

        // Determine current visibility range
        this.drawDistance = this.isActiveSonarActive ? this.activeSonarRange : this.passiveRange;

        // Debug: Log sensor status changes
        if (!this.lodDebugLogged || this.lastDrawDistance !== this.drawDistance) {
            console.log(`🔍 Sensors: ${this.isActiveSonarActive ? 'ACTIVE SONAR' : 'PASSIVE'} - Range: ${this.drawDistance}m`);
            console.log(`📊 Total chunks available: ${this.terrainChunks.size}`);
            this.lodDebugLogged = true;
            this.lastDrawDistance = this.drawDistance;
        }

        let visibleCount = 0;
        let hiddenCount = 0;

        this.terrainChunks.forEach((chunk, key) => {
            const distance = Math.sqrt(
                (playerPosition.x - chunk.centerX) ** 2 +
                (playerPosition.z - chunk.centerZ) ** 2
            );

            let shouldBeVisible = false;
            let visibilityAlpha = 1.0;

            if (this.isSonarPingActive()) {
                // Active sonar ping: 2km range with fade timing
                const dx = chunk.centerX - playerPosition.x;
                const dz = chunk.centerZ - playerPosition.z;
                const angle = Math.atan2(dz, dx);

                // Get submarine facing direction (assume positive X is forward)
                const submarineFacing = 0; // This should be actual submarine rotation
                const relativeAngle = angle - submarineFacing;
                const normalizedAngle = ((relativeAngle + Math.PI) % (2 * Math.PI)) - Math.PI;

                // Check if in rear 90-degree blind spot (-45 to +45 degrees behind)
                const isInBlindSpot = Math.abs(normalizedAngle) > (Math.PI - Math.PI/4);

                if (distance <= this.activeSonarRange && !isInBlindSpot) {
                    shouldBeVisible = true;
                    visibilityAlpha = this.getSonarPingAlpha(); // Apply fade alpha
                }
            } else {
                // Default: 500m sphere around submarine
                shouldBeVisible = distance <= this.passiveRange;
            }

            if (shouldBeVisible && !chunk.visible) {
                chunk.group.visible = true;
                chunk.visible = true;
            } else if (!shouldBeVisible && chunk.visible) {
                chunk.group.visible = false;
                chunk.visible = false;
            }

            // Count visibility for debug
            if (chunk.visible) {
                visibleCount++;
            } else {
                hiddenCount++;
            }
        });

        // Debug: Log chunk visibility stats every few seconds
        if (!this.lastDebugTime || Date.now() - this.lastDebugTime > 3000) {
            console.log(`🌊 Terrain LOD Status: ${visibleCount} visible, ${hiddenCount} hidden (Range: ${this.drawDistance}m)`);
            this.lastDebugTime = Date.now();
        }
    }

    // Activate sonar ping for extended terrain visibility
    activateSonarPing() {
        this.lastSonarPingTime = Date.now();
        this.isActiveSonarActive = true;
        console.log('🔊 ACTIVE SONAR PING - Extended range activated for 30 seconds');
        console.log(`📡 Terrain visibility: ${this.passiveRange}m → ${this.activeSonarRange}m (fades 30-40s)`);
        console.log(`🌊 Visibility updates with each ping, then fades before next ping`);

        // Force immediate terrain update
        if (window.playerSubmarine && window.playerSubmarine()) {
            const submarine = window.playerSubmarine();
            if (submarine && submarine.mesh) {
                this.updateTerrainLOD(submarine.mesh.position);
            }
        }
    }

    // Check if active sonar ping is still active (with fade)
    isSonarPingActive() {
        if (!this.isActiveSonarActive) return false;
        
        const timeSincePing = Date.now() - this.lastSonarPingTime;
        
        // Fully visible for 30 seconds
        if (timeSincePing <= this.sonarPingDuration) {
            return true;
        }
        
        // Fade out from 30-40 seconds
        if (timeSincePing <= this.sonarPingDuration + this.sonarPingFadeDuration) {
            return true; // Still active but will fade
        }
        
        // Beyond 40 seconds - deactivate
        this.isActiveSonarActive = false;
        return false;
    }

    // Get visibility alpha based on sonar ping timing
    getSonarPingAlpha() {
        if (!this.isActiveSonarActive) return 0.0;
        
        const timeSincePing = Date.now() - this.lastSonarPingTime;
        
        // Fully visible for 30 seconds
        if (timeSincePing <= this.sonarPingDuration) {
            return 1.0;
        }
        
        // Fade out from 30-40 seconds
        if (timeSincePing <= this.sonarPingDuration + this.sonarPingFadeDuration) {
            const fadeProgress = (timeSincePing - this.sonarPingDuration) / this.sonarPingFadeDuration;
            return 1.0 - fadeProgress; // Fade from 1.0 to 0.0
        }
        
        // Beyond 40 seconds
        this.isActiveSonarActive = false;
        return 0.0;
    }

    // Terrain visualization controls
    toggleTerrainWireframe() {
        console.log('Toggling terrain wireframe visibility...');
        console.log('Scene children count:', this.scene.children.length);
        
        // List all named objects in scene for debugging
        const namedObjects = this.scene.children.filter(obj => obj.name).map(obj => obj.name);
        console.log('Named objects in scene:', namedObjects);
        
        // Find the terrain group
        const terrainGroup = this.scene.getObjectByName('fullScaleTerrain');
        console.log('Found terrain group:', terrainGroup);
        
        if (terrainGroup) {
            const oldVisible = terrainGroup.visible;
            terrainGroup.visible = !terrainGroup.visible;
            console.log(`Ocean terrain wireframe: ${oldVisible ? 'ON' : 'OFF'} -> ${terrainGroup.visible ? 'ON' : 'OFF'}`);
            console.log('Terrain group children count:', terrainGroup.children.length);
            
            // Also check if terrain group has any children and their visibility
            terrainGroup.children.forEach((child, i) => {
                console.log(`  Child ${i}: ${child.type}, visible: ${child.visible}`);
            });
        } else {
            console.log('❌ No terrain group found to toggle - searching all objects...');
            
            // Search all objects recursively
            this.scene.traverse((obj) => {
                if (obj.name === 'fullScaleTerrain') {
                    console.log('Found fullScaleTerrain in traverse:', obj);
                }
                if (obj.type === 'Group' || obj.type === 'Line') {
                    console.log(`Object: name="${obj.name}", type=${obj.type}, visible=${obj.visible}`);
                }
            });
        }
    }

    toggleThermoclines() {
        console.log('Toggling thermocline visibility...');
        
        // Find all thermocline groups
        const thermoclineGroups = [];
        this.scene.traverse((obj) => {
            if (obj.name && obj.name.includes('thermocline')) {
                thermoclineGroups.push(obj);
            }
        });
        
        console.log('Found thermocline groups:', thermoclineGroups.map(g => g.name));
        
        if (thermoclineGroups.length > 0) {
            // Toggle visibility of all thermoclines
            const newVisibility = !thermoclineGroups[0].visible;
            thermoclineGroups.forEach(group => {
                group.visible = newVisibility;
                console.log(`${group.name}: ${newVisibility ? 'ON' : 'OFF'}`);
            });
            console.log(`All thermoclines: ${newVisibility ? 'ON' : 'OFF'}`);
        } else {
            console.log('❌ No thermocline groups found');
        }
    }

    setTerrainVisualizationMode(mode) {
        console.log('Setting terrain visualization mode:', mode);
        
        const terrainGroup = this.scene.getObjectByName('fullScaleTerrain');
        if (!terrainGroup) {
            console.log('No terrain group found');
            return;
        }

        // Apply different visual styles to terrain lines
        switch (mode) {
            case 'wireframe':
                terrainGroup.visible = true;
                // Change all lines to cyan wireframe
                terrainGroup.traverse((child) => {
                    if (child.material) {
                        child.material.color.setHex(0x00ffff); // Cyan
                        child.material.opacity = 0.8;
                        child.material.transparent = true;
                        child.material.linewidth = 1;
                    }
                });
                console.log('Ocean terrain set to wireframe mode (cyan)');
                break;
            case 'solid':
                terrainGroup.visible = true;
                // Change all lines to solid white/bright lines
                terrainGroup.traverse((child) => {
                    if (child.material) {
                        child.material.color.setHex(0xffffff); // White
                        child.material.opacity = 1.0;
                        child.material.transparent = false;
                        child.material.linewidth = 2;
                    }
                });
                console.log('Ocean terrain set to solid mode (bright white)');
                break;
            case 'shader':
                terrainGroup.visible = true;
                // Change all lines to depth-based green gradient
                terrainGroup.traverse((child) => {
                    if (child.material) {
                        child.material.color.setHex(0x00ff88); // Green-cyan
                        child.material.opacity = 0.9;
                        child.material.transparent = true;
                        child.material.linewidth = 1.5;
                    }
                });
                console.log('Ocean terrain set to shader mode (green depth-based)');
                break;
            default:
                console.log('Unknown terrain visualization mode:', mode);
        }
        
        // Store current mode
        this.currentTerrainMode = mode;
    }

    getTerrainVisualizationInfo() {
        const terrainGroup = this.scene.getObjectByName('fullScaleTerrain');
        if (terrainGroup) {
            const mode = this.currentTerrainMode || 'wireframe';
            return `Ocean terrain: ${terrainGroup.visible ? 'Visible' : 'Hidden'} (${mode} mode)`;
        }
        return 'No ocean terrain found';
    }
}

// Global ocean instance
let oceanEnvironment = null;

// Initialize ocean environment
function initOcean(scene) {
    console.log('🌊 initOcean() called - initializing ocean system...');
    if (oceanEnvironment) {
        oceanEnvironment.cleanup();
    }
    oceanEnvironment = new Ocean(scene);
    // Make ocean instance globally available for collision detection
    window.oceanInstance = oceanEnvironment;
    console.log('✅ Ocean system initialized successfully - should see terrain creation logs next');
    return oceanEnvironment;
}

// Update ocean environment
function updateOcean(deltaTime) {
    if (oceanEnvironment) {
        oceanEnvironment.update(deltaTime);
        // Update terrain LOD based on player position
        if (window.playerSubmarine && window.playerSubmarine()) {
            const submarine = window.playerSubmarine();
            if (submarine && submarine.mesh) {
                oceanEnvironment.updateTerrainLOD(submarine.mesh.position);
            }
        }
    }
}

// Get ocean bases
function getOceanBases() {
    return oceanEnvironment ? oceanEnvironment.getBases() : [];
}

// Export functions
window.initOcean = initOcean;
window.updateOcean = updateOcean;
window.getOceanBases = getOceanBases;
window.oceanEnvironment = () => oceanEnvironment;
