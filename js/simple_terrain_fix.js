/**
 * Simple Terrain Fix for Sub War 2060
 * Creates reliable terrain rendering without complex dependencies
 */

class SimpleTerrain {
    constructor(scene) {
        this.scene = scene;
        this.terrainGroup = null;
        this.terrainSize = 70000; // 70km x 70km (extended 20km south)
        this.gridSpacing = 1000; // 1km grid spacing for smoother appearance
        this.isVisible = true;
        this.wireframeMode = false; // Start with shaded mode for visual appeal
        this.currentMode = 'shader'; // Track current visualization mode: 'wireframe', 'solid', 'shader'
        this.shaderMaterial = null; // Store reference to shader for animation
        this.useFallbackMaterial = false; // Use shader material by default
    }

    createTerrain() {
        try {
            console.log('🚨 DEBUG: Starting createTerrain()...');

            // Remove existing terrain
            this.removeTerrain();

            // Create new terrain group
            this.terrainGroup = new THREE.Group();
            this.terrainGroup.name = 'simpleTerrain';

            console.log('🌊 CREATING TERRAIN - SAME GEOMETRY FOR BOTH WIREFRAME AND SOLID');

            // Always use the same terrain generation method
            this.createEmergencyTerrain();

            // Add to scene
            this.scene.add(this.terrainGroup);

            console.log('✅ Emergency terrain created and added to scene');
            console.log('📊 Terrain group children:', this.terrainGroup.children.length);
            console.log('📊 Scene children count after adding terrain:', this.scene.children.length);

            return this.terrainGroup;

        } catch (error) {
            console.error('❌ ERROR in createTerrain():', error);
            console.error('❌ Error stack:', error.stack);
            throw error;
        }
    }

    calculateNoisePattern(x, z, baseDepth) {
        // Smoothed multi-scale noise pattern for less jagged terrain

        // Base noise using multiple octaves with smoother frequencies
        const noise1 = Math.sin(x * 0.0005 + 47.3) * Math.cos(z * 0.0006 + 23.7); // Large scale (reduced frequency)
        const noise2 = Math.sin(x * 0.0015 + 12.1) * Math.cos(z * 0.0017 + 89.2); // Medium scale (reduced frequency)
        const noise3 = Math.sin(x * 0.004 + 67.8) * Math.cos(z * 0.0037 + 34.5); // Fine scale (reduced frequency)
        const noise4 = Math.sin(x * 0.008 + 91.4) * Math.cos(z * 0.0083 + 78.9); // Detail scale (reduced frequency)

        // Combine noise layers with smoother weighting (more weight on large scale)
        const combinedNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.15 + noise4 * 0.05);

        // Calculate depth-based variance modifier (reduced from 10% to 5% for smoother terrain)
        const depthMagnitude = Math.abs(baseDepth);
        const variancePercent = 0.05; // ±5% base variance (reduced from 10%)

        // Reduced intensity multiplier for smoother transitions
        const noiseIntensity = Math.abs(combinedNoise);
        const intensityMultiplier = 1.0 + (noiseIntensity * 1.0); // 1x to 2x multiplier (reduced from 3x)

        // Calculate final variance: base depth × variance × noise intensity × combined noise
        const noiseVariance = depthMagnitude * variancePercent * intensityMultiplier * combinedNoise;

        return noiseVariance;
    }

    smoothTerrain(geometry, widthSegments, heightSegments) {
        // Smooth terrain by averaging neighboring vertices to reduce jagged peaks
        const vertices = geometry.attributes.position.array;
        const smoothedHeights = new Float32Array(vertices.length / 3);
        
        // First pass: calculate smoothed heights
        for (let i = 0; i < vertices.length; i += 3) {
            const vertexIndex = i / 3;
            const row = Math.floor(vertexIndex / (widthSegments + 1));
            const col = vertexIndex % (widthSegments + 1);
            
            let sum = vertices[i + 1]; // Current height
            let count = 1;
            
            // Average with neighboring vertices (4-connected)
            if (row > 0) {
                const neighborIndex = (row - 1) * (widthSegments + 1) + col;
                sum += vertices[neighborIndex * 3 + 1];
                count++;
            }
            if (row < heightSegments) {
                const neighborIndex = (row + 1) * (widthSegments + 1) + col;
                sum += vertices[neighborIndex * 3 + 1];
                count++;
            }
            if (col > 0) {
                const neighborIndex = row * (widthSegments + 1) + (col - 1);
                sum += vertices[neighborIndex * 3 + 1];
                count++;
            }
            if (col < widthSegments) {
                const neighborIndex = row * (widthSegments + 1) + (col + 1);
                sum += vertices[neighborIndex * 3 + 1];
                count++;
            }
            
            // Weighted average: 60% current, 40% neighbors (preserves major features while smoothing)
            smoothedHeights[vertexIndex] = vertices[i + 1] * 0.6 + (sum / count) * 0.4;
        }
        
        // Second pass: apply smoothed heights
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 1] = smoothedHeights[i / 3];
        }
        
        console.log('✅ Terrain smoothing applied to reduce jagged peaks');
    }

    createEmergencyTerrain() {
        try {
            console.log('🌊 Creating SIMPLE terrain with realistic noise pattern...');
            console.log('🚨 DEBUG: Starting createEmergencyTerrain()...');
        
        // Expanded terrain size to match terrainSize for full southern extension
        const width = this.terrainSize;   // Use dynamic terrain size (now 70km)
        const height = this.terrainSize;  // Use dynamic terrain size (now 70km)  
        const widthSegments = 800;    // Maximum resolution for ultra-smooth, naturalistic terrain
        const heightSegments = 800;   // Maximum resolution for ultra-smooth, naturalistic terrain
        
        const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
        console.log('✅ Terrain geometry created with', widthSegments, 'x', heightSegments, 'segments');
        
        // FIRST: Rotate to horizontal BEFORE modifying vertices
        geometry.rotateX(-Math.PI / 2);
        console.log('✅ Terrain rotated to horizontal BEFORE height modifications');
        
        // NOW modify vertices in the correct coordinate system (XZ plane)
        const vertices = geometry.attributes.position.array;
        console.log('🔍 Modifying', vertices.length / 3, 'vertices for height variation...');
        
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];     // x coordinate
            const z = vertices[i + 2]; // z coordinate 
            // Y is now the height after rotation
            
            // OCEANOGRAPHIC ZONES ALONG Z-AXIS (North-South)
            // Terrain coordinates: Z goes from -35000 to +35000 (70km total)
            // Zone boundaries:
            // Continental Shelf: Z = -35000 to -15000 (0-20km from north edge) 
            // Continental Slope: Z = -15000 to +15000 (20km to 50km) 
            // Northern Abyssal Plain: Z = +15000 to +25000 (50km to 60km) - with trench and seamounts
            // Southern Abyssal Plain: Z = +25000 to +35000 (60km to 70km) - with submarine ridge
            
            // Determine which oceanographic zone this vertex is in
            let zoneDepth, zoneVariation;
            
            if (z <= -15000) {
                // CONTINENTAL SHELF ZONE - NOW WITH DRAMATIC 2KM HILLS AND UNDULATING TERRAIN
                const shelfPosition = (z + 25000) / 10000; // 0 to 1 across shelf
                let baseShelfDepth = -100 - (shelfPosition * 100); // -100m to -200m base depth

                // CHECK FOR BRANCHING CANYON SYSTEM FIRST
                const canyonInfo = this.getBranchingCanyonDepth(x, z);
                if (canyonInfo.inCanyon) {
                    // Use absolute canyon depth - this carves through the terrain
                    zoneDepth = canyonInfo.absoluteDepth || (baseShelfDepth + canyonInfo.depthModification);
                    zoneVariation = canyonInfo.variation;
                } else {
                    // DRAMATIC UNDULATING HILLS ON CONTINENTAL SHELF

                    // Large-scale hill systems up to 2km high
                    const majorHills = Math.sin(x * 0.0003) * Math.cos(z * 0.0004) * 1200; // 1.2km hills
                    const secondaryHills = Math.sin(x * 0.0008 + z * 0.0006) * 800; // 800m secondary hills
                    const rollingTerrain = Math.sin(x * 0.002) * Math.cos(z * 0.0015) * 400; // 400m rolling terrain

                    // Concentrated hill clusters in specific areas
                    const hillClusterX1 = -8000; // Western hill cluster
                    const hillClusterZ1 = -20000;
                    const distToCluster1 = Math.sqrt(Math.pow(x - hillClusterX1, 2) + Math.pow(z - hillClusterZ1, 2));
                    const cluster1Effect = Math.max(0, (8000 - distToCluster1) / 8000); // 8km radius
                    const cluster1Hills = cluster1Effect * Math.sin(x * 0.001) * Math.cos(z * 0.0012) * 2000; // Up to 2km

                    const hillClusterX2 = 6000; // Eastern hill cluster (between spires and trench)
                    const hillClusterZ2 = -18000;
                    const distToCluster2 = Math.sqrt(Math.pow(x - hillClusterX2, 2) + Math.pow(z - hillClusterZ2, 2));
                    const cluster2Effect = Math.max(0, (6000 - distToCluster2) / 6000); // 6km radius
                    const cluster2Hills = cluster2Effect * Math.sin(x * 0.0015) * Math.sin(z * 0.001) * 1500; // Up to 1.5km

                    // Scattered smaller hills across the shelf
                    const scatteredHills = Math.sin(x * 0.0012) * Math.cos(z * 0.001) * 600 + // 600m scattered hills
                                          Math.sin(x * 0.003 + z * 0.0025) * 300; // 300m micro-hills

                    // Ridge systems connecting hills
                    const ridgeSystem1 = Math.abs(Math.sin(x * 0.0002 + z * 0.0003)) > 0.8 ?
                                        Math.sin(x * 0.0008) * 800 : 0; // Ridge lines up to 800m
                    const ridgeSystem2 = Math.abs(Math.cos(x * 0.0003 - z * 0.0002)) > 0.85 ?
                                        Math.cos(z * 0.001) * 600 : 0; // Cross ridges up to 600m

                    // Total hill elevation
                    const totalHillHeight = majorHills + secondaryHills + rollingTerrain +
                                          cluster1Hills + cluster2Hills + scatteredHills +
                                          ridgeSystem1 + ridgeSystem2;

                    // Apply hill height to base depth (hills rise UP from seabed)
                    zoneDepth = baseShelfDepth + totalHillHeight;

                    // Enhanced surface variations for realistic hill texture
                    zoneVariation = Math.sin(x * 0.005) * 25 + Math.sin(z * 0.008) * 20 +
                                   Math.sin(x * 0.015 + z * 0.01) * 10 + // Hill surface texture
                                   Math.sin(x * 0.03) * Math.cos(z * 0.025) * 5; // Fine surface detail
                }
                
            } else if (z >= 25000) {
                // SOUTHERN ABYSSAL PLAIN ZONE (4000-6000m depth) WITH SUBMARINE RIDGE
                const southAbyssalPosition = (z - 25000) / 20000; // 0 to 1 across 20km southern extension
                zoneDepth = -4000 - (southAbyssalPosition * 2000); // -4000m to -6000m (deeper than north)
                
                // CHECK FOR SUBMARINE RIDGE (NE-SW trending)
                const ridgeInfo = this.getSubmarineRidgeHeight(x, z);
                if (ridgeInfo.onRidge) {
                    zoneDepth += ridgeInfo.heightModification; // Ridge rises above abyssal floor
                    zoneVariation = ridgeInfo.variation;
                } else {
                    // Smooth southern abyssal plain variations
                    zoneVariation = Math.sin(x * 0.0002) * 80 + Math.sin(z * 0.00015) * 60 +
                                   Math.sin(x * 0.0008 + z * 0.0005) * 25 + // Mid-scale features
                                   Math.sin(x * 0.0012) * Math.cos(z * 0.001) * 12; // Fine abyssal texture
                }
                
            } else if (z >= 15000) {
                // NORTHERN ABYSSAL PLAIN ZONE (2000-4000m depth) WITH TRENCH AND SEAMOUNTS
                const abyssalPosition = (z - 15000) / 10000; // 0 to 1 across abyss
                zoneDepth = -2000 - (abyssalPosition * 2000); // -2000m to -4000m
                
                // FIRST: Check for full canyon system (including branches extending through abyssal zone)
                const canyonInfo = this.getBranchingCanyonDepth(x, z);
                if (canyonInfo.inCanyon) {
                    // Canyon in abyssal zone - could be hanging valley or branch extension
                    zoneDepth = canyonInfo.absoluteDepth || (zoneDepth + canyonInfo.depthModification);
                    zoneVariation = canyonInfo.variation;
                } else {
                    // SECOND: Check for GRAND CANYON-STYLE TRENCH with meandering path
                    const trenchInfo = this.getGrandCanyonTrenchDepth(x, z);
                    if (trenchInfo.inTrench) {
                        zoneDepth = trenchInfo.depth;
                        zoneVariation = trenchInfo.variation;
                    } else {
                        // THIRD: CHECK FOR SEAMOUNTS - but EXCLUDE trench area to preserve stepped terraces
                        const baseZ = 20000; // Trench centerline
                        const meander = Math.sin(x * 0.0003) * 800 + Math.sin(x * 0.0008) * 400;
                        const trenchCenterZ = baseZ + meander;
                        const distanceFromTrenchCenter = Math.abs(z - trenchCenterZ);
                        const trenchExclusionZone = 4000; // 4km exclusion zone around trench
                        
                        if (distanceFromTrenchCenter > trenchExclusionZone) {
                            // Outside trench exclusion zone - allow seamounts
                            const seamountInfo = this.getSeamountHeight(x, z, 20000, abyssalPosition);
                            if (seamountInfo.isSeamount) {
                                // Override zone depth with seamount height
                                zoneDepth = seamountInfo.height;
                                zoneVariation = 0; // No additional variation on seamounts
                            } else {
                                // NORMAL ABYSSAL PLAIN - outside trench and seamounts
                                // Smooth gentle undulations - naturalistic deep ocean floor
                                zoneVariation = Math.sin(x * 0.0003) * 70 + Math.sin(z * 0.0002) * 50 +
                                               Math.sin(x * 0.001 + z * 0.0007) * 20 + // Mid-scale features
                                               Math.sin(x * 0.002) * Math.cos(z * 0.0015) * 10; // Fine abyssal texture
                            }
                        } else {
                            // Inside trench exclusion zone - no seamounts, just normal abyssal plain
                            // NORMAL ABYSSAL PLAIN - outside trench and seamounts
                            // Smooth gentle undulations - naturalistic deep ocean floor
                            zoneVariation = Math.sin(x * 0.0003) * 70 + Math.sin(z * 0.0002) * 50 +
                                           Math.sin(x * 0.001 + z * 0.0007) * 20 + // Mid-scale features
                                           Math.sin(x * 0.002) * Math.cos(z * 0.0015) * 10; // Fine abyssal texture
                        }
                    }
                }
                
            } else {
                // CONTINENTAL SLOPE ZONE (200-2000m depth)
                const slopePosition = (z + 15000) / 30000; // 0 to 1 across slope
                zoneDepth = -200 - (slopePosition * 1800); // -200m to -2000m (smooth transition)
                
                // CHECK FOR WESTERN SLOPE DEPRESSION FIRST
                const depressionInfo = this.getWesternDepressionDepth(x, z, slopePosition);
                if (depressionInfo.inDepression) {
                    // Western slope depression with fractal edges and canyon network
                    zoneDepth = depressionInfo.absoluteDepth;
                    zoneVariation = depressionInfo.variation;
                } else {
                    // CHECK FOR BRANCHING CANYON SYSTEM
                    const canyonInfo = this.getBranchingCanyonDepth(x, z);
                    if (canyonInfo.inCanyon) {
                        // Use absolute canyon depth to carve through terrain (deepest in slope zone)
                        zoneDepth = canyonInfo.absoluteDepth || (zoneDepth + canyonInfo.depthModification);
                        zoneVariation = canyonInfo.variation;
                    } else {
                        // CHECK FOR DOGFIGHTING TERRAIN - jagged mountains and hills
                        const dogfightInfo = this.getDogfightingTerrainHeight(x, z, slopePosition);
                        if (dogfightInfo.inDogfightZone) {
                            // Apply dramatic mountain heights for submarine dogfighting
                            zoneDepth += dogfightInfo.heightModification;
                            zoneVariation = dogfightInfo.variation;
                        } else {
                            // Smooth moderate variations - naturalistic sloping terrain
                            const slopeVariation = Math.sin(x * 0.0005) * 40 + Math.sin(z * 0.0007) * 30;
                            // Add gentle slope-specific features (smooth ridges and texture)
                            const ridgeFeature = Math.sin(x * 0.0012 + z * 0.0003) * 80;
                            const fineTexture = Math.sin(x * 0.002) * Math.cos(z * 0.0018) * 15 + // Fine slope details
                                               Math.sin(x * 0.003 + z * 0.0025) * 8; // Micro-relief
                            zoneVariation = slopeVariation + ridgeFeature + fineTexture;
                        }
                    }
                }
            }
            
            // RANDOM NOISE PATTERN WITH DEPTH-BASED VARIANCE
            const noiseVariance = this.calculateNoisePattern(x, z, zoneDepth);

            const newHeight = zoneDepth + zoneVariation + noiseVariance;

            vertices[i + 1] = newHeight; // Modify Y coordinate (height after rotation)
            
            // Log first few vertices for debugging (including noise effect)
            if (i < 30) {
                console.log(`🔍 Vertex ${i/3}: (${x.toFixed(1)}, ${newHeight.toFixed(1)}, ${z.toFixed(1)}) | Base: ${(zoneDepth + zoneVariation).toFixed(1)} + Noise: ${noiseVariance.toFixed(1)}`);
            }
        }
        
        // Apply smoothing pass to reduce jagged peaks
        this.smoothTerrain(geometry, widthSegments, heightSegments);
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals(); // Recalculate normals
        console.log('✅ Height variations applied AFTER rotation and smoothed');
        
        // Enhanced depth-based shader material with textures for all terrain features
        const material = this.createTexturedTerrainShader();

        // REMOVED: Second mesh with standard material - was causing visibility issues
        // All terrain now uses shader material with proper visibility limits
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        
        this.terrainGroup.add(mesh);
        console.log(`✅ OCEANOGRAPHIC TERRAIN: 50x50km with realistic depth zones in ${this.wireframeMode ? 'WIREFRAME' : 'SOLID'} mode`);
        console.log('📊 Mesh info: position =', mesh.position, ', visible =', mesh.visible);
        console.log('📊 Mesh material type:', mesh.material.constructor.name);
        console.log('📊 Mesh geometry vertices:', mesh.geometry.attributes.position.count);

        // DEBUG: Add a textured test plane near submarine starting position for visibility test
        const testGeometry = new THREE.PlaneGeometry(1000, 1000);
        testGeometry.rotateX(-Math.PI / 2);
        const testMaterial = new THREE.MeshStandardMaterial({
            map: this.createSandTexture(),
            roughness: 0.7,
            metalness: 0.0,
            side: THREE.DoubleSide
        });
        const testMesh = new THREE.Mesh(testGeometry, testMaterial);
        testMesh.position.set(0, -200, 18000); // Near submarine starting position
        this.terrainGroup.add(testMesh);
        console.log('🚨 DEBUG: Added textured test plane at submarine starting area (0, -200, 18000)');
        console.log('🌊 ZONE LAYOUT (North to South):');
        console.log('  📍 Continental Shelf (0-10km): 100-200m depth');
        console.log('  📍 Continental Slope (10-40km): 200-2000m depth');  
        console.log('  📍 Abyssal Plain (40-50km): 2000-6000m depth');
        console.log('  🏔️ GRAND CANYON-STYLE TRENCH (45km): Meandering canyon with flat floor');
        console.log('    🌊 Canyon Floor: Flat 11000m depth (center 30% width)');
        console.log('    ⛰️  North Wall: 4 stepped terraces (Grand Canyon style)');
        console.log('      🟢 Terrace 1: 6000-7250m depth');
        console.log('      🟢 Terrace 2: 7250-8500m depth');  
        console.log('      🟢 Terrace 3: 8500-9750m depth');
        console.log('      🟢 Terrace 4: 9750-11000m depth');
        console.log('    🧗 South Wall: Sheer cliff face (6000-11000m)');
        console.log('    🌊 Meandering Path: ±1200m natural curves along X-axis');
        console.log('  🗻 SEAMOUNT GROUP (South of trench): 8 discrete vertical features');
        console.log('    🏔️  Large seamounts: 800-1000m base radius, plateau tops at 150-350m depth');
        console.log('    ⛰️  Medium seamounts: 500-700m base radius, plateau tops at 100-300m depth');
        console.log('    🔺 Small seamounts: 350-400m base radius, plateau tops at 400-500m depth');
        console.log('    📐 Features: Flat plateau tops with sheer slopes to abyssal floor');
        console.log('  🏔️ BRANCHING CANYON SYSTEM: Shelf to trench navigation routes');
        console.log('    🌊 Canyon head: Continental shelf (-5000, -20000) at 300m depth');
        console.log('    🌿 Main trunk: 800m wide, deepens to 1800m through continental slope');
        console.log('    🍀 Three branches: Split at (0, 5000), terminate at trench as hanging valleys');
        console.log('    ⛰️  West branch: 600m wide, ends at 9km depth (-3000, 19000)');
        console.log('    ⛰️  Central branch: 700m wide, ends at 9.5km depth (500, 19500)');
        console.log('    ⛰️  East branch: 500m wide, ends at 9.2km depth (2000, 19200)');
        console.log('📊 Total depth range: -100m to -11000m (including trench, seamount tops, and canyon heads)');
        
        // Add textured reference plane above the terrain for comparison
        const cyanGeometry = new THREE.PlaneGeometry(this.terrainSize * 0.1, this.terrainSize * 0.1); // 10% of terrain size reference plane
        cyanGeometry.rotateX(-Math.PI / 2);
        const cyanMaterial = new THREE.MeshStandardMaterial({ 
            map: this.createCombinedSeafloorTexture(),
            roughness: 0.6,
            metalness: 0.0,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        });
        const cyanMesh = new THREE.Mesh(cyanGeometry, cyanMaterial);
        cyanMesh.position.set(0, -50, 0); // Above the continental shelf (shallowest area)
        this.terrainGroup.add(cyanMesh);
        console.log('✅ Cyan reference plane (5km×5km) added at Y=-50 (above continental shelf)');
        
        // Add red debug box for reference  
        const debugBox = new THREE.Mesh(
            new THREE.BoxGeometry(200, 200, 200),
            new THREE.MeshBasicMaterial({ color: 0xFF0000 })
        );
        debugBox.position.set(0, -50, 0); // Well above terrain
        this.terrainGroup.add(debugBox);
        console.log('✅ Red debug box added at Y=-50');
        
        // Add seamount debug markers for visibility
        this.addSeamountMarkers();
        
        // Add canyon debug markers for visibility
        this.addCanyonMarkers();
        
        // Add trench terrace markers for stepped side visibility
        this.addGrandCanyonMarkers();
        
        // Add dogfighting terrain markers
        this.addDogfightingTerrainMarkers();
        
        // Add western depression markers
        this.addWesternDepressionMarkers();
        
        console.log('📊 HEIGHT VARIED TERRAIN SUMMARY:');
        console.log('  - Terrain: 10km x 10km with hills/valleys (-200m to 0m depth)');
        console.log('  - Segments: 32x32 for smooth height variation');
        console.log('  - Height algorithm: 3-layer sine waves for natural look');
        console.log('  - Cyan reference: 2km x 2km at Y=-100');  
        console.log('  - Red debug box: 200x200x200 at Y=-50');
        console.log('  - Total objects in terrainGroup:', this.terrainGroup.children.length);

        } catch (error) {
            console.error('❌ ERROR in createEmergencyTerrain():', error);
            console.error('❌ Error stack:', error.stack);
            throw error;
        }
    }

    createEmergencyWireframe() {
        console.log('🌊 Creating realistic wireframe terrain with shader overlay...');
        
        // Create a proper terrain mesh that can display wireframe + shaders
        const terrainSize = this.terrainSize; // Use full terrain size (70km)
        const segments = 300; // 300x300 grid for ultra-smooth detail
        
        // Create plane geometry with proper height variation
        const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
        
        // Add realistic height variation to the wireframe mesh
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            // Use the same height calculation as the solid terrain
            vertices[i + 1] = this.getHeightAtPosition(x, z);
        }
        
        // Update geometry
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        geometry.rotateX(-Math.PI / 2);
        
        // Create shader material for the wireframe terrain
        const shaderMaterial = this.createDepthShaderMaterial();
        shaderMaterial.wireframe = true; // Enable wireframe on the shader material
        
        // Create the wireframe mesh with shader material
        const wireframeMesh = new THREE.Mesh(geometry, shaderMaterial);
        wireframeMesh.position.set(0, 0, 0);
        this.terrainGroup.add(wireframeMesh);
        
        // Add some additional wireframe grid lines for enhanced visibility
        this.addEnhancedWireframeGrid();
        
        console.log('✅ Realistic wireframe terrain created with shader overlay');
        console.log('🎨 Wireframe shows depth-based colors and underwater effects');
    }

    addEnhancedWireframeGrid() {
        // Add some bright cyan wireframe lines for enhanced wireframe visibility
        const material = new THREE.LineBasicMaterial({ 
            color: 0x00FFFF, 
            transparent: true,
            opacity: 0.6
        });
        
        // Create major grid lines every 500m
        const gridSize = 2500;
        const gridStep = 500;
        
        for (let i = -gridSize; i <= gridSize; i += gridStep) {
            // X direction lines with terrain height
            const points1 = [];
            for (let z = -gridSize; z <= gridSize; z += 50) {
                const height = this.getHeightAtPosition(i, z);
                points1.push(new THREE.Vector3(i, height + 5, z)); // Slightly above terrain
            }
            const geo1 = new THREE.BufferGeometry().setFromPoints(points1);
            const line1 = new THREE.Line(geo1, material);
            this.terrainGroup.add(line1);
            
            // Z direction lines with terrain height
            const points2 = [];
            for (let x = -gridSize; x <= gridSize; x += 50) {
                const height = this.getHeightAtPosition(x, i);
                points2.push(new THREE.Vector3(x, height + 5, i)); // Slightly above terrain
            }
            const geo2 = new THREE.BufferGeometry().setFromPoints(points2);
            const line2 = new THREE.Line(geo2, material);
            this.terrainGroup.add(line2);
        }
        
        console.log('🔵 Enhanced wireframe grid overlay added');
    }

    createSeafloorTextureMaterial() {
        // Create realistic seafloor texture material using procedural patterns
        console.log('🎨 Creating seafloor texture material...');
        
        // Create a combined texture that simulates realistic seafloor
        const combinedTexture = this.createCombinedSeafloorTexture();
        
        // Create material with realistic seafloor appearance
        const material = new THREE.MeshLambertMaterial({
            map: combinedTexture,
            transparent: false,
            side: THREE.DoubleSide
        });
        
        console.log('🌊 Created realistic seafloor texture material');
        return material;
    }

    createDepthShaderMaterial() {
        console.log('🎨 Creating depth-based shader material...');
        
        const vertexShader = `
            varying vec3 vPosition;
            varying vec3 vNormal;
            
            void main() {
                vPosition = position;
                vNormal = normal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            varying vec3 vPosition;
            varying vec3 vNormal;
            
            uniform float minDepth;
            uniform float maxDepth;
            uniform vec3 deepColor;
            uniform vec3 shallowColor;
            uniform vec3 ridgeColor;
            uniform vec3 canyonColor;
            uniform float time;
            
            void main() {
                // Calculate depth-based coloring
                float depth = abs(vPosition.y);
                float normalizedDepth = clamp(depth / maxDepth, 0.0, 1.0);
                
                // Base color interpolation between shallow and deep
                vec3 baseColor = mix(shallowColor, deepColor, normalizedDepth);
                
                // Add terrain features based on normal and position
                float steepness = 1.0 - abs(dot(vNormal, vec3(0.0, 1.0, 0.0)));
                
                // Ridge detection (steep areas)
                if (steepness > 0.6) {
                    baseColor = mix(baseColor, ridgeColor, steepness * 0.7);
                }
                
                // Canyon enhancement for very deep areas
                if (normalizedDepth > 0.8) {
                    baseColor = mix(baseColor, canyonColor, (normalizedDepth - 0.8) * 5.0);
                }
                
                // Subtle animation
                float wave = sin(time + vPosition.x * 0.01 + vPosition.z * 0.01) * 0.1 + 0.9;
                baseColor *= wave;
                
                gl_FragColor = vec4(baseColor, 1.0);
            }
        `;
        
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                minDepth: { value: 0.0 },
                maxDepth: { value: 1000.0 },
                deepColor: { value: new THREE.Color(0x001122) },    // Deep blue
                shallowColor: { value: new THREE.Color(0x8B7355) }, // Sandy brown
                ridgeColor: { value: new THREE.Color(0x666644) },   // Gray rock
                canyonColor: { value: new THREE.Color(0x223344) },  // Deep canyon
                time: { value: 0.0 }
            },
            transparent: false,
            side: THREE.DoubleSide,
            // Add these properties to ensure visibility
            depthWrite: true,
            depthTest: true
        });
        
        // Store reference for animation
        this.shaderMaterial = material;
        
        console.log('✅ Depth-based shader material created');
        return material;
    }

    update(deltaTime) {
        // Update shader animation
        if (this.shaderMaterial && this.shaderMaterial.uniforms) {
            this.shaderMaterial.uniforms.time.value += deltaTime;
        }
    }
    
    createCombinedSeafloorTexture() {
        // Create a realistic combined seafloor texture
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        // Base seafloor color (muddy brown)
        ctx.fillStyle = '#7D6F4F';
        ctx.fillRect(0, 0, 1024, 1024);
        
        // Add sandy patches
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const radius = Math.random() * 80 + 40;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, '#C4A572');
            gradient.addColorStop(1, '#7D6F4F');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add rocky areas
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const radius = Math.random() * 60 + 20;
            
            ctx.fillStyle = '#555555';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add smaller rock details
            for (let j = 0; j < 10; j++) {
                const rx = x + (Math.random() - 0.5) * radius;
                const ry = y + (Math.random() - 0.5) * radius;
                const rsize = Math.random() * 8 + 2;
                
                ctx.fillStyle = '#666666';
                ctx.beginPath();
                ctx.arc(rx, ry, rsize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Add fine sediment details
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const size = Math.random() * 2 + 0.5;
            const brightness = Math.random() * 40 - 20;
            
            ctx.fillStyle = `rgb(${125 + brightness}, ${111 + brightness}, ${79 + brightness})`;
            ctx.fillRect(x, y, size, size);
        }
        
        // Add some darker cracks/fissures for realism
        for (let i = 0; i < 20; i++) {
            const x1 = Math.random() * 1024;
            const y1 = Math.random() * 1024;
            const x2 = x1 + (Math.random() - 0.5) * 200;
            const y2 = y1 + (Math.random() - 0.5) * 200;
            
            ctx.strokeStyle = '#4A3F2F';
            ctx.lineWidth = Math.random() * 3 + 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(25, 25); // Tile the texture across the terrain
        
        return texture;
    }
    
    createSandTexture() {
        // Create procedural sand texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Base sand color
        ctx.fillStyle = '#C4A572';
        ctx.fillRect(0, 0, 512, 512);
        
        // Add sand grain texture
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = Math.random() * 2 + 1;
            const brightness = Math.random() * 50 - 25;
            
            ctx.fillStyle = `rgb(${196 + brightness}, ${165 + brightness}, ${114 + brightness})`;
            ctx.fillRect(x, y, size, size);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(50, 50);
        
        return texture;
    }
    
    createMudTexture() {
        // Create procedural mud texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Base mud color
        ctx.fillStyle = '#5D4E37';
        ctx.fillRect(0, 0, 512, 512);
        
        // Add mud patterns
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = Math.random() * 5 + 2;
            const brightness = Math.random() * 30 - 15;
            
            ctx.fillStyle = `rgb(${93 + brightness}, ${78 + brightness}, ${55 + brightness})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(30, 30);
        
        return texture;
    }
    
    createRockTexture() {
        // Create procedural rock texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Base rock color
        ctx.fillStyle = '#696969';
        ctx.fillRect(0, 0, 512, 512);
        
        // Add rock patterns
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = Math.random() * 8 + 3;
            const brightness = Math.random() * 60 - 30;
            
            ctx.fillStyle = `rgb(${105 + brightness}, ${105 + brightness}, ${105 + brightness})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(20, 20);
        
        return texture;
    }

    createWireframeGrid(material, halfSize, segments) {
        // Create grid lines - X direction
        for (let i = 0; i <= segments; i++) {
            const x = -halfSize + (i * this.gridSpacing);
            const points = [];
            
            for (let j = 0; j <= segments; j++) {
                const z = -halfSize + (j * this.gridSpacing);
                const y = this.getHeightAtPosition(x, z);
                points.push(new THREE.Vector3(x, y, z));
            }
            
            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                this.terrainGroup.add(line);
            }
        }

        // Create grid lines - Z direction
        for (let j = 0; j <= segments; j++) {
            const z = -halfSize + (j * this.gridSpacing);
            const points = [];
            
            for (let i = 0; i <= segments; i++) {
                const x = -halfSize + (i * this.gridSpacing);
                const y = this.getHeightAtPosition(x, z);
                points.push(new THREE.Vector3(x, y, z));
            }
            
            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                this.terrainGroup.add(line);
            }
        }
    }

    createSolidMesh(material, halfSize, segments) {
        console.log('🎨 createSolidMesh called with material:', material);
        console.log('🎨 Material type:', material.constructor.name);
        
        try {
            // Create smaller, simpler geometry for visibility testing
            const testSize = Math.min(this.terrainSize, 10000); // Limit to 10km for testing
            const testSegments = Math.min(segments, 50); // Limit segments for performance
            
            console.log(`🔧 Creating geometry: ${testSize}x${testSize}, ${testSegments} segments`);
            
            // Create plane geometry
            const geometry = new THREE.PlaneGeometry(testSize, testSize, testSegments, testSegments);
            
            // Add minimal height variation to ensure visibility
            const vertices = geometry.attributes.position.array;
            for (let i = 0; i < vertices.length; i += 3) {
                const x = vertices[i];
                const z = vertices[i + 2];
                // Use much simpler height calculation for visibility
                vertices[i + 1] = Math.sin(x * 0.0001) * Math.cos(z * 0.0001) * 100; // Max 100m variation
            }
            
            // Update geometry
            geometry.attributes.position.needsUpdate = true;
            geometry.computeVertexNormals();
            
            // Force bounding box calculation
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
            
            // Rotate to be horizontal
            geometry.rotateX(-Math.PI / 2);
            
            // Force bounding box recalculation after rotation
            geometry.computeBoundingBox();
            
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, 0); // Ensure it's at origin
            mesh.updateMatrixWorld(); // Force matrix update
            this.terrainGroup.add(mesh);
            
            console.log('✅ Simple solid mesh created successfully');
            console.log('📏 Mesh bounds after creation:', mesh.geometry.boundingBox);
            console.log('🎯 Mesh position:', mesh.position);
            console.log('👁️ Mesh visible:', mesh.visible);
            
        } catch (error) {
            console.error('❌ Solid mesh creation failed:', error);
            // Create emergency fallback - multiple visible objects
            console.log('🚨 Creating emergency fallback terrain...');
            
            // Large flat plane using full terrain size
            const planeGeometry = new THREE.PlaneGeometry(this.terrainSize, this.terrainSize);
            planeGeometry.rotateX(-Math.PI / 2);
            const planeMesh = new THREE.Mesh(planeGeometry, material);
            planeMesh.position.set(0, 0, 0);
            this.terrainGroup.add(planeMesh);
            
            // Marker boxes at corners for visibility testing
            const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
            const positions = [
                [1000, 50, 1000],   // NE corner
                [-1000, 50, 1000],  // NW corner  
                [1000, 50, -1000],  // SE corner
                [-1000, 50, -1000], // SW corner
                [0, 50, 0]          // Center
            ];
            
            positions.forEach((pos, i) => {
                const boxMesh = new THREE.Mesh(boxGeometry, material);
                boxMesh.position.set(pos[0], pos[1], pos[2]);
                this.terrainGroup.add(boxMesh);
            });
            
            console.log('🚨 Emergency fallback created: 1 plane + 5 marker boxes');
        }
    }

    getHeightAtPosition(x, z) {
        // ENHANCED ZONED TERRAIN SYSTEM
        // Preserves excellent base terrain + adds local detail variations + creates islands
        
        // STEP 1: Generate base smooth terrain (the excellent current system)
        let baseHeight = this.generateBaseTerrainHeight(x, z);
        
        // STEP 2: Add zoned detail overlay
        const detailHeight = this.generateZonedDetailOverlay(x, z);
        
        // STEP 3: Combine base + detail
        let finalHeight = baseHeight + detailHeight;
        
        // STEP 4: Allow islands (positive heights become surface features)
        // No clamping to underwater - let terrain naturally create islands!
        
        return finalHeight;
    }

    addSeamountMarkers() {
        // Add visible markers at each seamount location for debugging
        // UPDATED: Match the actual seamount data used in getSeamountHeight()
        const seamountData = [
            // Mount 1: Large circular plateau - far west (moved outside exclusion zone)
            {
                centerX: -8000, centerZ: 24500,
                baseRadius: 1200, topRadiusX: 400, topRadiusZ: 400,
                topDepth: -150,
                shape: 'circular',
                name: 'Mount 1 (Circular)'
            },

            // Mount 2: Oval plateau with southern shelves - west
            {
                centerX: -3000, centerZ: 25000,
                baseRadius: 1000, topRadiusX: 600, topRadiusZ: 300,
                topDepth: -200,
                shape: 'oval',
                name: 'Mount 2 (Oval + Shelves)'
            },

            // Mount 3: Small round plateau - east (moved outside exclusion zone)
            {
                centerX: 4000, centerZ: 24200,
                baseRadius: 800, topRadiusX: 250, topRadiusZ: 250,
                topDepth: -300,
                shape: 'circular',
                name: 'Mount 3 (Small Round)'
            },

            // Mount 4: Large elongated plateau with southern shelves - far east
            {
                centerX: 7000, centerZ: 25500,
                baseRadius: 1400, topRadiusX: 800, topRadiusZ: 200,
                topDepth: -100,
                shape: 'elongated',
                name: 'Mount 4 (Elongated + Shelves)'
            }
        ];

        seamountData.forEach((seamount, index) => {
            // Create a bright colored marker at each seamount location
            const markerGeometry = new THREE.CylinderGeometry(200, 200, 100, 8);

            // Different colors for different shapes
            let markerColor;
            switch (seamount.shape) {
                case 'circular': markerColor = 0x00FF00; break;   // Green for circular
                case 'oval': markerColor = 0xFF8000; break;       // Orange for oval
                case 'elongated': markerColor = 0xFF0080; break;  // Pink for elongated
                default: markerColor = 0xFFFF00; break;           // Yellow default
            }

            const markerMaterial = new THREE.MeshBasicMaterial({
                color: markerColor,
                transparent: true,
                opacity: 0.9
            });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);

            // Position marker at seamount plateau top
            marker.position.set(seamount.centerX, seamount.topDepth, seamount.centerZ);
            marker.name = `seamount_marker_${index}`;

            this.terrainGroup.add(marker);

            console.log(`🗻 ${seamount.name} marker added at (${seamount.centerX}, ${seamount.topDepth}, ${seamount.centerZ}) - ${seamount.shape} shape`);
        });

        console.log('✅ All 4 seamount debug markers added with correct positions');
    }

    addCanyonMarkers() {
        // Add visible markers at key canyon locations for debugging
        const canyonMarkers = [
            // Canyon head
            { x: -5000, z: -20000, y: -300, color: 0x00FFFF, name: 'Canyon Head' },
            
            // Main canyon split point
            { x: 0, z: 5000, y: -1800, color: 0x0088FF, name: 'Canyon Split' },
            
            // Branch terminations (hanging valleys)
            { x: -3000, z: 20200, y: -9000, color: 0xFF4444, name: 'West Hanging Valley' },
            { x: 500, z: 20000, y: -9500, color: 0xFF4444, name: 'Central Hanging Valley' },
            { x: 2000, z: 20200, y: -9200, color: 0xFF4444, name: 'East Hanging Valley' }
        ];

        canyonMarkers.forEach((marker, index) => {
            // Create a bright colored marker at each canyon location
            const markerGeometry = new THREE.SphereGeometry(150, 8, 6);
            const markerMaterial = new THREE.MeshBasicMaterial({ 
                color: marker.color,
                transparent: true,
                opacity: 0.9
            });
            const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
            
            // Position marker at canyon location
            markerMesh.position.set(marker.x, marker.y, marker.z);
            markerMesh.name = `canyon_marker_${marker.name}`;
            
            this.terrainGroup.add(markerMesh);
            
            console.log(`🏔️ Canyon marker '${marker.name}' added at (${marker.x}, ${marker.y}, ${marker.z})`);
        });
        
        console.log('✅ All canyon debug markers added');
    }

    addTrenchTerraceMarkers() {
        // Add visible markers at each terrace level on the north side of trench
        const trenchCenterZ = 20000;
        const trenchHalfWidth = 1500;
        
        const terraceMarkers = [
            // North side terraces (4 major levels) - MUCH more prominent
            { x: -1000, z: trenchCenterZ - trenchHalfWidth * 0.8, y: -6000, name: 'Terrace 0 (Rim)', color: 0x00FF00, size: 400 },
            { x: -500, z: trenchCenterZ - trenchHalfWidth * 0.6, y: -7250, name: 'Terrace 1', color: 0x00DD00, size: 400 },
            { x: 0, z: trenchCenterZ - trenchHalfWidth * 0.4, y: -8500, name: 'Terrace 2', color: 0x00BB00, size: 400 },
            { x: 500, z: trenchCenterZ - trenchHalfWidth * 0.2, y: -9750, name: 'Terrace 3 (Deep)', color: 0x009900, size: 400 },
            
            // Trench center (deepest point)
            { x: 0, z: trenchCenterZ, y: -11000, name: 'Trench Floor', color: 0xFF0000, size: 500 },
            
            // South side cliff markers
            { x: 1000, z: trenchCenterZ + trenchHalfWidth * 0.9, y: -6500, name: 'Cliff Face', color: 0xFF6600, size: 300 },
            { x: 500, z: trenchCenterZ + trenchHalfWidth * 0.5, y: -9000, name: 'Mid Cliff', color: 0xFF4400, size: 300 },
        ];

        terraceMarkers.forEach((marker, index) => {
            // Create MUCH larger, distinct colored markers for each terrace level
            const markerSize = marker.size || 300;
            const markerGeometry = new THREE.BoxGeometry(markerSize, markerSize/2, markerSize);
            const markerMaterial = new THREE.MeshBasicMaterial({ 
                color: marker.color,
                transparent: true,
                opacity: 0.9
            });
            const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
            
            // Position marker at terrace location
            markerMesh.position.set(marker.x, marker.y, marker.z);
            markerMesh.name = `trench_terrace_${marker.name}`;
            
            this.terrainGroup.add(markerMesh);
            
            console.log(`🏔️ Trench marker '${marker.name}' added at (${marker.x}, ${marker.y}, ${marker.z})`);
        });
        
        console.log('✅ All trench terrace debug markers added');
    }

    addGrandCanyonMarkers() {
        // Add markers for the new Grand Canyon-style trench
        const markers = [
            { x: -2000, z: 18500, y: -6000, name: 'Canyon Rim North', color: 0x00FF00 },
            { x: 0, z: 20000, y: -11000, name: 'Canyon Floor', color: 0xFF0000 },
            { x: 2000, z: 21500, y: -6000, name: 'Canyon Rim South', color: 0xFF6600 }
        ];

        markers.forEach((marker) => {
            const markerGeometry = new THREE.SphereGeometry(200);
            const markerMaterial = new THREE.MeshBasicMaterial({ 
                color: marker.color,
                transparent: true,
                opacity: 0.9
            });
            const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
            markerMesh.position.set(marker.x, marker.y, marker.z);
            markerMesh.name = `canyon_${marker.name}`;
            this.terrainGroup.add(markerMesh);
            console.log(`🏔️ Canyon marker '${marker.name}' added at (${marker.x}, ${marker.y}, ${marker.z})`);
        });
        
        console.log('✅ All Grand Canyon markers added');
    }

    addDogfightingTerrainMarkers() {
        // Add markers for the relocated dogfighting zone (moved east)
        const markers = [
            { x: 8000, z: -5000, y: 500, name: 'Dogfight Center', color: 0xFFFF00 },
            { x: 4000, z: -5000, y: 200, name: 'Dogfight West', color: 0xFFDD00 },
            { x: 12000, z: -5000, y: 200, name: 'Dogfight East', color: 0xFFDD00 }
        ];

        markers.forEach((marker) => {
            const markerGeometry = new THREE.ConeGeometry(150, 300, 6);
            const markerMaterial = new THREE.MeshBasicMaterial({ 
                color: marker.color,
                transparent: true,
                opacity: 0.8
            });
            const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
            markerMesh.position.set(marker.x, marker.y, marker.z);
            markerMesh.name = `dogfight_${marker.name}`;
            this.terrainGroup.add(markerMesh);
            console.log(`⚡ Dogfight marker '${marker.name}' added at (${marker.x}, ${marker.y}, ${marker.z})`);
        });
        
        console.log('✅ All dogfighting terrain markers added');
    }

    getSeamountHeight(x, z, trenchCenterZ, abyssalPosition) {
        // REDESIGNED SEAMOUNT SYSTEM - 4 varied seamounts distributed along trench
        // Different shapes, sizes, and some with southern shelf structures

        // Define 4 seamounts spread widely along the trench (reduced from 8)
        const seamountData = [
            // Mount 1: Large circular plateau - far west (moved outside exclusion zone)
            {
                centerX: -8000, centerZ: 24500,
                baseRadius: 1200, topRadiusX: 400, topRadiusZ: 400,
                topDepth: -150,
                shape: 'circular',
                hasSouthernShelves: false
            },

            // Mount 2: Oval plateau with southern shelves - west
            {
                centerX: -3000, centerZ: 25000,
                baseRadius: 1000, topRadiusX: 600, topRadiusZ: 300,
                topDepth: -200,
                shape: 'oval',
                hasSouthernShelves: true
            },

            // Mount 3: Small round plateau - east (moved outside exclusion zone)
            {
                centerX: 4000, centerZ: 24200,
                baseRadius: 800, topRadiusX: 250, topRadiusZ: 250,
                topDepth: -300,
                shape: 'circular',
                hasSouthernShelves: false
            },

            // Mount 4: Large elongated plateau with southern shelves - far east
            {
                centerX: 7000, centerZ: 25500,
                baseRadius: 1400, topRadiusX: 800, topRadiusZ: 200,
                topDepth: -100,
                shape: 'elongated',
                hasSouthernShelves: true
            }
        ];

        // Check if position is within any seamount
        for (const seamount of seamountData) {
            const distanceFromCenter = Math.sqrt(
                Math.pow(x - seamount.centerX, 2) + Math.pow(z - seamount.centerZ, 2)
            );

            if (distanceFromCenter <= seamount.baseRadius) {
                // INSIDE SEAMOUNT - Calculate height based on varied shape and features

                const abyssalFloorDepth = -6000; // Base depth of abyssal floor

                // Check if on plateau top (varies by shape)
                let onPlateau = false;
                if (seamount.shape === 'circular') {
                    const plateauRadius = Math.max(seamount.topRadiusX, seamount.topRadiusZ);
                    onPlateau = distanceFromCenter <= plateauRadius;
                } else if (seamount.shape === 'oval' || seamount.shape === 'elongated') {
                    // Elliptical plateau check
                    const dx = x - seamount.centerX;
                    const dz = z - seamount.centerZ;
                    const ellipseCheck = (dx*dx)/(seamount.topRadiusX*seamount.topRadiusX) +
                                        (dz*dz)/(seamount.topRadiusZ*seamount.topRadiusZ);
                    onPlateau = ellipseCheck <= 1;
                }

                if (onPlateau) {
                    // ENHANCED PLATEAU TOP WITH JUTTING BITS AND CUTS
                    let plateauHeight = seamount.topDepth;

                    // Add chaotic variation to plateau surface based on seamount type
                    const dx = x - seamount.centerX;
                    const dz = z - seamount.centerZ;

                    // Multi-scale noise for realistic geological variation
                    const largeChaos = Math.sin(dx * 0.01) * Math.cos(dz * 0.008) * 80;  // Large 80m variations
                    const mediumChaos = Math.sin(dx * 0.03) * Math.cos(dz * 0.025) * 40; // Medium 40m variations
                    const smallChaos = Math.sin(dx * 0.08) * Math.cos(dz * 0.06) * 15;   // Small 15m variations

                    // Add jutting bits - sharp upward protrusions
                    const juttingPattern = Math.sin(dx * 0.02) * Math.sin(dz * 0.015);
                    const juttingHeight = juttingPattern > 0.6 ? Math.pow(juttingPattern - 0.6, 2) * 500 : 0; // Up to 500m jutting peaks

                    // Add inward cuts - valleys and depressions
                    const cutPattern = Math.cos(dx * 0.025) * Math.cos(dz * 0.02);
                    const cutDepth = cutPattern < -0.5 ? Math.pow(Math.abs(cutPattern + 0.5), 1.5) * 200 : 0; // Up to 200m deep cuts

                    // Seamount-specific variations
                    let typeVariation = 0;
                    if (seamount.shape === 'circular') {
                        // Circular seamounts: radial ridges and valleys
                        const angle = Math.atan2(dz, dx);
                        const radialRidges = Math.sin(angle * 6) * 60; // 6 major ridges, 60m high
                        typeVariation = radialRidges;
                    } else if (seamount.shape === 'oval') {
                        // Oval seamounts: longitudinal ridges
                        const longitudinalRidges = Math.sin(dx * 0.015) * 45; // Longitudinal ridges, 45m high
                        typeVariation = longitudinalRidges;
                    } else if (seamount.shape === 'elongated') {
                        // Elongated seamounts: parallel ridges and fault lines
                        const parallelRidges = Math.sin(dz * 0.02) * 70; // Parallel ridges, 70m high
                        const faultLines = Math.cos(dx * 0.035) < -0.7 ? -100 : 0; // Fault line cuts, 100m deep
                        typeVariation = parallelRidges + faultLines;
                    }

                    // Combine all variations
                    const totalVariation = largeChaos + mediumChaos + smallChaos + juttingHeight - cutDepth + typeVariation;
                    plateauHeight += totalVariation;

                    return {
                        isSeamount: true,
                        height: plateauHeight
                    };
                } else {
                    // SLOPES OR SOUTHERN SHELVES
                    if (seamount.hasSouthernShelves) {
                        // Check if on southern side for shelf structures
                        const relativeZ = z - seamount.centerZ;
                        if (relativeZ > seamount.topRadiusZ) {
                            // SOUTHERN SIDE - Add shelf structures
                            const southProgress = (relativeZ - seamount.topRadiusZ) /
                                                (seamount.baseRadius - seamount.topRadiusZ);

                            // Create 3 shelf levels on southern face
                            if (southProgress < 0.3) {
                                // Upper shelf
                                return {
                                    isSeamount: true,
                                    height: seamount.topDepth - 500 // 500m below plateau
                                };
                            } else if (southProgress < 0.6) {
                                // Middle shelf
                                return {
                                    isSeamount: true,
                                    height: seamount.topDepth - 1200 // 1200m below plateau
                                };
                            } else if (southProgress < 0.85) {
                                // Lower shelf
                                return {
                                    isSeamount: true,
                                    height: seamount.topDepth - 2000 // 2000m below plateau
                                };
                            } else {
                                // Slope to abyssal floor
                                const slopeProgress = (southProgress - 0.85) / 0.15;
                                const height = seamount.topDepth - 2000 - (slopeProgress * 1800);
                                return {
                                    isSeamount: true,
                                    height: height
                                };
                            }
                        }
                    }

                    // ENHANCED SLOPES WITH JUTTING BITS AND CUTS
                    const plateauEdgeRadius = seamount.shape === 'circular' ?
                        Math.max(seamount.topRadiusX, seamount.topRadiusZ) :
                        Math.sqrt(seamount.topRadiusX * seamount.topRadiusZ); // Approx for oval

                    const slopeRadius = seamount.baseRadius - plateauEdgeRadius;
                    const distanceFromPlateauEdge = distanceFromCenter - plateauEdgeRadius;
                    const slopeProgress = distanceFromPlateauEdge / slopeRadius;

                    const totalSeamountHeight = abyssalFloorDepth - seamount.topDepth;
                    let baseHeight = seamount.topDepth - (slopeProgress * totalSeamountHeight);

                    // Add slope variations - more dramatic on slopes than plateau
                    const dx = x - seamount.centerX;
                    const dz = z - seamount.centerZ;

                    // Slope-specific jutting outcrops and erosion cuts
                    const slopeJutting = Math.sin(dx * 0.025) * Math.cos(dz * 0.02);
                    const juttingRocks = slopeJutting > 0.7 ? Math.pow(slopeJutting - 0.7, 2) * 800 : 0; // Up to 800m jutting outcrops

                    // Erosion gullies and ravines on slopes
                    const erosionPattern = Math.cos(dx * 0.04) * Math.sin(dz * 0.035);
                    const erosionCuts = erosionPattern < -0.6 ? Math.pow(Math.abs(erosionPattern + 0.6), 1.8) * 400 : 0; // Up to 400m deep erosion cuts

                    // Slope terracing from geological processes
                    const terracingPattern = Math.sin(distanceFromCenter * 0.008) * 30; // 30m terracing

                    // Rock falls and talus slopes - more variation near base
                    const talusVariation = slopeProgress * Math.sin(dx * 0.06) * Math.cos(dz * 0.05) * 150; // Up to 150m near base

                    // Combine slope variations (reduced intensity compared to plateau)
                    const slopeVariationIntensity = 1 - (slopeProgress * 0.3); // Less variation near base
                    const totalSlopeVariation = (juttingRocks - erosionCuts + terracingPattern + talusVariation) * slopeVariationIntensity;

                    baseHeight += totalSlopeVariation;

                    return {
                        isSeamount: true,
                        height: baseHeight
                    };
                }
            }
        }

        // Not within any seamount
        return {
            isSeamount: false,
            height: null
        };
    }

    getBranchingCanyonDepth(x, z) {
        // BRANCHING CANYON SYSTEM from Continental Shelf to Deep Ocean Trench
        // Starts at shelf (~300m), branches through slope, ends as hanging valleys at trench (9-10km)
        
        // FIRST CHECK: Are we near the trench? If so, integrate with trench system
        const baseZ = 20000; // Trench centerline at 45km from north

        // Match the trench's sinuous meandering pattern
        const largeMeander = Math.sin(x * 0.0002) * 3000;
        const mediumMeander = Math.sin(x * 0.0008) * 1200;
        const smallMeander = Math.sin(x * 0.003) * 400;
        const microMeander = Math.sin(x * 0.01) * 150;

        const trenchCenterZ = baseZ + largeMeander + mediumMeander + smallMeander + microMeander;
        const distanceFromTrenchCenter = z - trenchCenterZ;
        const trenchHalfWidth = 1800; // 1.8km from center = 3.6km total width
        
        // If we're at the trench, check if canyons should merge here
        if (Math.abs(distanceFromTrenchCenter) <= trenchHalfWidth && z >= 18000) {
            // We're in the trench area - check if any canyon branches terminate here
            const canyonTerminations = [
                { x: -3000, z: 20200, width: 600 }, // West branch - at trench wall
                { x: 500, z: 20000, width: 700 },   // Central branch - at trench center
                { x: 2000, z: 20200, width: 500 }   // East branch - at trench wall
            ];
            
            for (const termination of canyonTerminations) {
                const distToTermination = Math.sqrt(
                    Math.pow(x - termination.x, 2) + Math.pow(z - termination.z, 2)
                );
                
                if (distToTermination <= termination.width) {
                    // We're in a canyon termination area - create hanging valley effect
                    const hangingValleyFactor = 1 - (distToTermination / termination.width);
                    const baseHangingDepth = -7000; // Hanging valleys at 7km depth
                    const canyonDepth = baseHangingDepth - (1000 * hangingValleyFactor);
                    
                    return {
                        inCanyon: true,
                        absoluteDepth: canyonDepth, // Use absolute depth, not modification
                        variation: 50 * hangingValleyFactor,
                        isHangingValley: true
                    };
                }
            }
            
            // In trench but not in hanging valley - no canyon modification
            return { inCanyon: false, depthModification: 0, variation: 0 };
        }
        
        // Define the main canyon trunk and its branches - NOW WITH CHAOTIC NATURAL FEATURES
        const canyonSystem = {
            // Main canyon trunk - starts in shelf, goes to slope with sinuous meandering
            main: {
                startX: -5000, startZ: -20000,  // Canyon head in continental shelf
                endX: 0, endZ: 5000,           // Splits in mid-slope
                baseWidth: 800,                 // Base 800m wide canyon
                widthVariation: 0.4,           // ±40% width variation
                startDepth: 100,                // 100m below shelf (300m total depth)
                endDepth: 1500,                 // 1500m additional depth in slope
                meander: 0.7,                   // Meandering intensity
                chaos: 0.6                      // Geological chaos factor
            },

            // Branch canyons - continue from main to trench with natural irregularities
            branches: [
                // Western branch - widest and most chaotic
                {
                    startX: 0, startZ: 5000,       // Continues from main canyon
                    endX: -3000, endZ: 22000,      // Extended THROUGH the trench to create hanging valley
                    baseWidth: 600,                 // Base 600m wide branch
                    widthVariation: 0.6,           // ±60% width variation (very chaotic)
                    startDepth: 1500,               // Continues main depth
                    endDepth: 7000,                 // 9km total depth at trench
                    meander: 1.2,                   // Strong meandering
                    chaos: 0.8,                     // High geological chaos
                    tributaries: 3                  // Number of small tributary canyons
                },

                // Central branch - deepest with moderate chaos
                {
                    startX: 0, startZ: 5000,       // Continues from main canyon
                    endX: 500, endZ: 22000,        // Extended THROUGH the trench to create hanging valley
                    baseWidth: 700,                 // Base 700m wide branch
                    widthVariation: 0.5,           // ±50% width variation
                    startDepth: 1500,               // Continues main depth
                    endDepth: 7500,                 // 9.5km total depth at trench (deepest)
                    meander: 0.9,                   // Moderate meandering
                    chaos: 0.7,                     // Moderate chaos
                    tributaries: 4                  // More tributaries (main drainage)
                },

                // Eastern branch - narrowest but most erratic
                {
                    startX: 0, startZ: 5000,       // Continues from main canyon
                    endX: 2000, endZ: 22000,       // Extended THROUGH the trench to create hanging valley
                    baseWidth: 500,                 // Base 500m wide branch (narrowest)
                    widthVariation: 0.8,           // ±80% width variation (most erratic)
                    startDepth: 1500,               // Continues main depth
                    endDepth: 7200,                 // 9.2km total depth at trench
                    meander: 1.5,                   // Extreme meandering
                    chaos: 1.0,                     // Maximum geological chaos
                    tributaries: 2                  // Fewer but deeper tributaries
                }
            ]
        };
        
        // Check if position is within main canyon trunk - NOW WITH CHAOTIC WIDTH
        const mainCanyon = this.getDistanceFromCanyonPath(x, z, canyonSystem.main);

        // Calculate dynamic chaotic width
        const progressAlongCanyon = mainCanyon.progress;
        const widthChaos = Math.sin(progressAlongCanyon * Math.PI * 8) * canyonSystem.main.widthVariation +
                          Math.sin(x * 0.01) * 0.2 + Math.sin(z * 0.008) * 0.15;
        const dynamicWidth = canyonSystem.main.baseWidth * (1 + widthChaos);

        if (mainCanyon.distance <= dynamicWidth / 2) {
            const baseSurfaceDepth = -300; // Continental shelf base depth

            // Add chaotic depth variations
            const depthChaos = Math.sin(progressAlongCanyon * Math.PI * 6) * 200 * canyonSystem.main.chaos +
                              Math.sin(x * 0.015) * 100 + Math.sin(z * 0.012) * 80;

            const canyonDepth = baseSurfaceDepth - canyonSystem.main.startDepth -
                (progressAlongCanyon * (canyonSystem.main.endDepth - canyonSystem.main.startDepth)) + depthChaos;

            // Enhanced wall variations with geological chaos
            const wallVariation = this.getCanyonWallVariation(mainCanyon.distance, dynamicWidth / 2) *
                                  (1 + canyonSystem.main.chaos * 0.5);

            return {
                inCanyon: true,
                absoluteDepth: canyonDepth,
                variation: wallVariation,
                canyonName: 'main'
            };
        }
        
        // Check if position is within any branch canyon - NOW WITH EXTREME CHAOS
        for (let i = 0; i < canyonSystem.branches.length; i++) {
            const branch = canyonSystem.branches[i];
            const branchCanyon = this.getDistanceFromCanyonPath(x, z, branch);

            // Calculate chaotic branch width with extreme variations
            const branchProgress = branchCanyon.progress;
            const branchWidthChaos = Math.sin(branchProgress * Math.PI * 12) * branch.widthVariation +
                                    Math.sin(x * 0.02 * branch.meander) * 0.3 +
                                    Math.sin(z * 0.015 * branch.meander) * 0.25;
            const dynamicBranchWidth = branch.baseWidth * (1 + branchWidthChaos);

            // Add tributary canyon effects (smaller side canyons)
            let tributaryEffect = 0;
            for (let t = 0; t < branch.tributaries; t++) {
                const tributaryX = branch.startX + (branchProgress * (branch.endX - branch.startX)) +
                                  Math.sin(t * Math.PI * 2 + branchProgress * Math.PI * 4) * 800;
                const tributaryZ = branch.startZ + (branchProgress * (branch.endZ - branch.startZ)) +
                                  Math.cos(t * Math.PI * 2 + branchProgress * Math.PI * 4) * 600;

                const distToTributary = Math.sqrt(Math.pow(x - tributaryX, 2) + Math.pow(z - tributaryZ, 2));
                if (distToTributary < 300) { // 300m tributary influence
                    tributaryEffect = Math.max(tributaryEffect, (300 - distToTributary) / 300);
                }
            }

            const effectiveWidth = dynamicBranchWidth * (1 + tributaryEffect * 0.5);

            if (branchCanyon.distance <= effectiveWidth / 2) {
                const baseSlopeDepth = -1500; // Continental slope base depth at branch start

                // Extreme chaotic depth variations with geological complexity
                const depthChaos = Math.sin(branchProgress * Math.PI * 10) * 400 * branch.chaos +
                                  Math.sin(x * 0.02) * 200 + Math.sin(z * 0.018) * 150 +
                                  Math.sin(branchProgress * Math.PI * 20) * 100; // Fine-scale chaos

                // Add tributary depth effects
                const tributaryDepth = tributaryEffect * 300; // Tributaries add up to 300m depth

                const canyonDepth = baseSlopeDepth - branch.startDepth -
                    (branchProgress * (branch.endDepth - branch.startDepth)) + depthChaos - tributaryDepth;

                // Extreme wall variations with tributary roughness
                const wallVariation = this.getCanyonWallVariation(branchCanyon.distance, effectiveWidth / 2) *
                                     (1 + branch.chaos * 0.8) + (tributaryEffect * 80);

                return {
                    inCanyon: true,
                    absoluteDepth: canyonDepth,
                    variation: wallVariation,
                    canyonName: `branch_${i}`,
                    tributaryInfluence: tributaryEffect
                };
            }
        }
        
        // Not in any canyon
        return {
            inCanyon: false,
            depthModification: 0,
            variation: 0
        };
    }

    getDistanceFromCanyonPath(x, z, canyon) {
        // Calculate distance from point to canyon centerline and progress along canyon
        const dx = canyon.endX - canyon.startX;
        const dz = canyon.endZ - canyon.startZ;
        const canyonLength = Math.sqrt(dx * dx + dz * dz);
        
        // Vector from canyon start to point
        const pointDx = x - canyon.startX;
        const pointDz = z - canyon.startZ;
        
        // Project point onto canyon centerline
        const dotProduct = (pointDx * dx + pointDz * dz) / (canyonLength * canyonLength);
        const progress = Math.max(0, Math.min(1, dotProduct)); // Clamp to [0,1]
        
        // Find closest point on canyon centerline
        const closestX = canyon.startX + progress * dx;
        const closestZ = canyon.startZ + progress * dz;
        
        // Distance from point to canyon centerline
        const distance = Math.sqrt(Math.pow(x - closestX, 2) + Math.pow(z - closestZ, 2));
        
        return {
            distance: distance,
            progress: progress
        };
    }

    getCanyonWallVariation(distanceFromCenter, maxRadius) {
        // Create highly realistic canyon wall profile - V-shaped with detailed variation
        const wallSteepness = distanceFromCenter / maxRadius; // 0 at center, 1 at edge
        
        // Enhanced V-shaped profile - deeper in center, shallower at edges
        const vProfile = (1 - wallSteepness) * 0.85; // 85% depth reduction from center to edge
        
        // Multiple layers of wall texture for naturalistic appearance
        const coarseTexture = Math.sin(distanceFromCenter * 0.02) * 35; // Large wall features
        const mediumTexture = Math.sin(distanceFromCenter * 0.08) * 15; // Medium wall irregularities
        const fineTexture = Math.sin(distanceFromCenter * 0.2) * 8;     // Fine wall detail
        const microTexture = Math.sin(distanceFromCenter * 0.5) * 3;    // Micro-relief
        
        const totalTexture = coarseTexture + mediumTexture + fineTexture + microTexture;
        
        return totalTexture * vProfile;
    }

    getGrandCanyonTrenchDepth(x, z) {
        // SINUOUS CHAOTIC TRENCH - Realistic geological feature with variable width, overhangs, and complex meandering

        // Base trench centerline with complex sinuous meandering
        const baseTrenchZ = 20000;

        // Multi-scale meandering for realistic sinuosity
        const largeMeander = Math.sin(x * 0.0002) * 3000;  // 3km amplitude, 31km wavelength
        const mediumMeander = Math.sin(x * 0.0008) * 1200; // 1.2km amplitude, 7.8km wavelength
        const smallMeander = Math.sin(x * 0.003) * 400;    // 400m amplitude, 2km wavelength
        const microMeander = Math.sin(x * 0.01) * 150;     // 150m amplitude, 628m wavelength

        const trenchCenterZ = baseTrenchZ + largeMeander + mediumMeander + smallMeander + microMeander;

        // Variable width - trench widens and narrows naturally
        const baseWidth = 2000; // 2km base width
        const widthVariation = Math.sin(x * 0.0005) * 800 + Math.sin(x * 0.002) * 300; // ±1100m variation
        const trenchHalfWidth = Math.max(800, baseWidth + widthVariation); // Never narrower than 1.6km total

        const distanceFromCenterline = z - trenchCenterZ;
        const absDistance = Math.abs(distanceFromCenterline);

        if (absDistance <= trenchHalfWidth) {
            // INSIDE THE TRENCH
            const normalizedDistance = absDistance / trenchHalfWidth; // 0 at center, 1 at rim
            const isNorthSide = distanceFromCenterline < 0;

            // Add overhanging sections and complex profile
            const overhangFactor = Math.sin(x * 0.004) * 0.3 + Math.sin(x * 0.015) * 0.2; // Creates overhangs
            const adjustedDistance = normalizedDistance + overhangFactor;

            // Chaotic depth variations along trench axis
            const depthChaos = Math.sin(x * 0.001) * 800 + Math.sin(x * 0.006) * 300 + Math.sin(x * 0.02) * 150;

            if (adjustedDistance < 0.15) {
                // CENTRAL TRENCH FLOOR - Variable depth with chaos
                const floorDepth = -10000 - depthChaos; // 9.2km to 11.25km deep
                const floorRoughness = Math.sin(x * 0.05) * 50 + Math.sin(z * 0.03) * 30; // Floor texture
                return {
                    inTrench: true,
                    depth: floorDepth,
                    variation: floorRoughness
                };
            } else if (isNorthSide) {
                // NORTH SIDE: Irregular shelves with natural variations
                const shelfProgress = (Math.max(0, adjustedDistance) - 0.15) / 0.85;

                // Irregular shelf transitions with natural chaos
                const shelfNoise = Math.sin(x * 0.008) * 200 + Math.sin(x * 0.025) * 100;

                if (shelfProgress < 0.2) {
                    // Deepest shelf - highly variable
                    const shelfDepth = -8000 - depthChaos * 0.5 + shelfNoise;
                    const shelfRoughness = Math.sin(x * 0.02) * 80 + Math.sin(z * 0.04) * 40;
                    return {
                        inTrench: true,
                        depth: shelfDepth,
                        variation: shelfRoughness
                    };
                } else if (shelfProgress < 0.45) {
                    // Mid-deep shelf with undulations
                    const shelfDepth = -6000 - depthChaos * 0.3 + shelfNoise;
                    const shelfRoughness = Math.sin(x * 0.03) * 60 + Math.sin(z * 0.05) * 30;
                    return {
                        inTrench: true,
                        depth: shelfDepth,
                        variation: shelfRoughness
                    };
                } else if (shelfProgress < 0.7) {
                    // Mid shelf with rocky terrain
                    const shelfDepth = -4000 - depthChaos * 0.2 + shelfNoise;
                    const shelfRoughness = Math.sin(x * 0.04) * 40 + Math.sin(z * 0.06) * 25;
                    return {
                        inTrench: true,
                        depth: shelfDepth,
                        variation: shelfRoughness
                    };
                } else {
                    // Shallowest shelf transitioning to rim
                    const rimProgress = (shelfProgress - 0.7) / 0.3;
                    const shelfDepth = -2000 - depthChaos * 0.1 + shelfNoise + (rimProgress * 500);
                    const shelfRoughness = Math.sin(x * 0.05) * 30 + Math.sin(z * 0.08) * 20;
                    return {
                        inTrench: true,
                        depth: shelfDepth,
                        variation: shelfRoughness
                    };
                }
            } else {
                // SOUTH SIDE: Chaotic cliff face with overhangs and irregularities
                const cliffProgress = (Math.max(0, adjustedDistance) - 0.15) / 0.85;

                // Complex cliff profile with overhangs and jutting sections
                const cliffChaos = Math.sin(x * 0.007) * 400 + Math.sin(x * 0.02) * 200;
                const overhangSections = Math.sin(x * 0.012) * 300; // Creates dramatic overhangs

                // Non-linear cliff rise with natural irregularities
                const cliffCurve = Math.pow(cliffProgress, 1.5); // Steep at bottom, gentler at top
                const baseCliffDepth = -10000 + (cliffCurve * 4000); // Rise from 10km to 6km
                const finalCliffDepth = baseCliffDepth - depthChaos * 0.4 + cliffChaos + overhangSections;

                // Cliff face texture and irregularities
                const cliffTexture = Math.sin(x * 0.04) * 80 + Math.sin(z * 0.03) * 60 + Math.sin(x * 0.1) * 25;

                return {
                    inTrench: true,
                    depth: finalCliffDepth,
                    variation: cliffTexture
                };
            }
        }

        // Not in trench
        return {
            inTrench: false,
            depth: 0,
            variation: 0
        };
    }

    getDogfightingTerrainHeight(x, z, slopePosition) {
        // SUBMARINE DOGFIGHTING TERRAIN - ROUNDED mountains and hills on continental slope

        // Define the dogfighting zone relocated to the east, away from canyon head
        const dogfightCenterX = 8000; // 8km east (away from western canyon head)
        const dogfightCenterZ = -5000; // Mid-slope area
        const dogfightRadius = 6000; // 12km diameter zone (slightly smaller)

        const distanceFromCenter = Math.sqrt(
            Math.pow(x - dogfightCenterX, 2) + Math.pow(z - dogfightCenterZ, 2)
        );

        if (distanceFromCenter <= dogfightRadius) {
            // INSIDE DOGFIGHTING ZONE
            const intensity = 1 - (distanceFromCenter / dogfightRadius); // 1 at center, 0 at edge

            // Create ROUNDED mountain peaks and valleys using smooth mathematical functions
            // Use squared/cubed functions for rounded peaks instead of sharp sin/cos
            const largePeaksBase = Math.sin(x * 0.0015) * Math.cos(z * 0.0012);
            const largePeaks = Math.sign(largePeaksBase) * Math.pow(Math.abs(largePeaksBase), 0.6) * 1500; // Rounded major peaks

            const mediumPeaksBase = Math.sin(x * 0.004 + z * 0.003);
            const mediumPeaks = Math.sign(mediumPeaksBase) * Math.pow(Math.abs(mediumPeaksBase), 0.7) * 800; // Rounded medium features

            const rollingHillsBase = Math.sin(x * 0.008) * Math.cos(z * 0.01);
            const rollingHills = Math.sign(rollingHillsBase) * Math.pow(Math.abs(rollingHillsBase), 0.8) * 400; // Gentle rolling hills

            const gentleTexture = Math.sin(x * 0.02 + z * 0.015) * 100; // Reduced surface roughness for smoothness

            // Combine all layers with intensity falloff
            const totalHeight = (largePeaks + mediumPeaks + rollingHills + gentleTexture) * intensity;

            // Create ROUNDED spires and gentle valleys instead of sharp ones
            const spireBase = Math.sin(x * 0.006) * Math.sin(z * 0.007);

            // Use smooth mathematical curves for rounded spires
            let spireHeight = 0;
            let valleyDepth = 0;

            if (spireBase > 0.7) {
                // Rounded dome spires using quadratic curve
                const spireIntensity = (spireBase - 0.7) / 0.3; // 0 to 1
                spireHeight = Math.pow(spireIntensity, 1.5) * 2000; // Smooth dome shape, max 2km
            } else if (spireBase < -0.7) {
                // Gentle bowl valleys
                const valleyIntensity = (-spireBase - 0.7) / 0.3; // 0 to 1
                valleyDepth = -Math.pow(valleyIntensity, 1.5) * 1000; // Smooth bowl shape, max 1km deep
            }

            // Add some rounded boulder/hill clusters
            const boulderField = Math.pow(Math.abs(Math.sin(x * 0.01) * Math.cos(z * 0.012)), 1.2) * 300;

            return {
                inDogfightZone: true,
                heightModification: totalHeight + spireHeight + valleyDepth + boulderField,
                variation: Math.sin(x * 0.03) * Math.cos(z * 0.025) * 20 // Much gentler surface detail
            };
        }

        // Not in dogfighting zone
        return {
            inDogfightZone: false,
            heightModification: 0,
            variation: 0
        };
    }

    generateBaseTerrainHeight(x, z) {
        // PRESERVED: The excellent smooth base terrain system
        let height = -1000; // Start at 1000m deep (middle of our range)
        
        // Large-scale continental features (very low frequency for big smooth features)
        const continentalScale = 0.00005;
        const continentalShelf = Math.sin(x * continentalScale) * Math.cos(z * continentalScale) * 600;
        height += continentalShelf;
        
        // Major underwater mountain ranges (big smooth ridges)
        const ridgeScale = 0.00008;
        const ridgeNoise = Math.sin(x * ridgeScale + z * ridgeScale * 0.7) * Math.cos(z * ridgeScale * 0.9);
        height += ridgeNoise * 500;
        
        // Large abyssal plains and deep basins (very smooth transitions)
        const basinScale = 0.00006;
        const basinNoise = Math.cos(x * basinScale - z * basinScale * 0.8) * Math.sin(x * basinScale * 1.2);
        height += basinNoise * 400;
        
        // Medium-scale smooth hills and valleys
        const hillScale = 0.0002;
        height += Math.sin(x * hillScale) * Math.cos(z * hillScale * 0.8) * 250;
        height += Math.cos(x * hillScale * 1.3 + z * hillScale) * 200;
        
        // Gentle undulations
        const gentleScale = 0.0005;
        height += Math.sin(x * gentleScale * 1.5) * Math.cos(z * gentleScale) * 100;
        
        // Keep base terrain in reasonable range for detail overlay
        height = Math.max(height, -2000);
        height = Math.min(height, -150);
        
        return height;
    }

    update(deltaTime) {
        // Update shader animation if we have a shader material
        if (this.shaderMaterial && this.shaderMaterial.uniforms && this.shaderMaterial.uniforms.time) {
            this.shaderMaterial.uniforms.time.value += deltaTime;
        }
    }

    generateZonedDetailOverlay(x, z) {
        // Determine which zone this position is in
        const distanceFromOrigin = Math.sqrt(x * x + z * z);
        
        let meshSize, variationIntensity;
        
        if (distanceFromOrigin <= 5000) {
            // Zone 1: Starting area (±5km) - Highest detail
            meshSize = 50; // 50m mesh
            variationIntensity = 1.0; // Full intensity
        } else if (distanceFromOrigin <= 15000) {
            // Zone 2: Mid-range (5-15km) - Moderate detail
            meshSize = 100; // 100m mesh  
            variationIntensity = 0.7; // 70% intensity
        } else {
            // Zone 3: Far areas (15km+) - Lower detail
            meshSize = 200; // 200m mesh
            variationIntensity = 0.4; // 40% intensity
        }
        
        // Create smooth transition between zones
        const transitionWidth = 1000; // 1km transition zone
        if (distanceFromOrigin > 4000 && distanceFromOrigin < 6000) {
            // Transition between Zone 1 and 2
            const factor = (distanceFromOrigin - 4000) / 2000;
            meshSize = 50 + (100 - 50) * factor;
            variationIntensity = 1.0 + (0.7 - 1.0) * factor;
        } else if (distanceFromOrigin > 14000 && distanceFromOrigin < 16000) {
            // Transition between Zone 2 and 3
            const factor = (distanceFromOrigin - 14000) / 2000;
            meshSize = 100 + (200 - 100) * factor;
            variationIntensity = 0.7 + (0.4 - 0.7) * factor;
        }
        
        return this.generateDetailMeshOverlay(x, z, meshSize, variationIntensity);
    }

    generateDetailMeshOverlay(x, z, meshSize, intensity) {
        // Create a detailed mesh overlay using deterministic "randomness"
        
        // Snap to mesh grid
        const gridX = Math.floor(x / meshSize) * meshSize;
        const gridZ = Math.floor(z / meshSize) * meshSize;
        
        // Get the 4 surrounding grid points
        const corners = [
            { x: gridX, z: gridZ },
            { x: gridX + meshSize, z: gridZ },
            { x: gridX, z: gridZ + meshSize },
            { x: gridX + meshSize, z: gridZ + meshSize }
        ];
        
        // Generate deterministic height variations for each corner
        const cornerHeights = corners.map(corner => {
            return this.getDeterministicVariation(corner.x, corner.z) * intensity;
        });
        
        // Determine smoothing level for this area based on deterministic criteria
        const smoothingSeed = Math.sin(gridX * 0.001 + gridZ * 0.0007) * 43758.5453;
        const smoothingRandom = smoothingSeed - Math.floor(smoothingSeed);
        
        let interpolationMethod;
        if (smoothingRandom < 0.3) {
            // 30% - Sharp angular terrain (linear interpolation)
            interpolationMethod = 'linear';
        } else if (smoothingRandom < 0.7) {
            // 40% - Moderately smooth terrain (cubic interpolation)  
            interpolationMethod = 'cubic';
        } else {
            // 30% - Very smooth rounded terrain (quintic interpolation)
            interpolationMethod = 'quintic';
        }
        
        // Apply chosen interpolation method
        const localX = (x - gridX) / meshSize;
        const localZ = (z - gridZ) / meshSize;
        
        let smoothX, smoothZ;
        
        if (interpolationMethod === 'linear') {
            smoothX = localX;
            smoothZ = localZ;
        } else if (interpolationMethod === 'cubic') {
            // Cubic smoothing: 3t² - 2t³
            smoothX = localX * localX * (3 - 2 * localX);
            smoothZ = localZ * localZ * (3 - 2 * localZ);
        } else { // quintic
            // Quintic smoothing: 6t⁵ - 15t⁴ + 10t³ (very smooth)
            smoothX = localX * localX * localX * (localX * (localX * 6 - 15) + 10);
            smoothZ = localZ * localZ * localZ * (localZ * (localZ * 6 - 15) + 10);
        }
        
        // Interpolation using smoothed coordinates
        const top = cornerHeights[0] * (1 - smoothX) + cornerHeights[1] * smoothX;
        const bottom = cornerHeights[2] * (1 - smoothX) + cornerHeights[3] * smoothX;
        
        return top * (1 - smoothZ) + bottom * smoothZ;
    }

    getDeterministicVariation(x, z) {
        // Deterministic "random" height variation using position-based seeding
        // This ensures same terrain every game while appearing random
        
        // Create a unique seed from position
        const seed1 = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
        const seed2 = Math.sin((x + 1) * 92.9898 + (z + 1) * 45.233) * 23758.5453;
        const seed3 = Math.sin((x - 1) * 52.9898 + (z - 1) * 67.233) * 33758.5453;
        
        // Get fractional part (0 to 1)
        const random1 = seed1 - Math.floor(seed1);
        const random2 = seed2 - Math.floor(seed2);
        const random3 = seed3 - Math.floor(seed3);
        
        // Combine multiple seeds for better distribution
        let combinedRandom = (random1 + random2 + random3) / 3;
        
        // Distribute height variations (reduced scale for better visibility):
        // 70% at ±150m, 15% at ±100/50m, 15% at ±200/300m
        
        let variation;
        if (combinedRandom < 0.70) {
            // 70% get ±150m variation (moderate terrain)
            variation = 150;
        } else if (combinedRandom < 0.775) {
            // 7.5% get ±100m variation  
            variation = 100;
        } else if (combinedRandom < 0.85) {
            // 7.5% get ±50m variation (gentle slopes)
            variation = 50;
        } else if (combinedRandom < 0.925) {
            // 7.5% get ±200m variation (hills)
            variation = 200;
        } else {
            // 7.5% get ±300m variation (mountains/valleys)
            variation = 300;
        }
        
        // Apply positive or negative variation
        const sign = (random1 > 0.5) ? 1 : -1;
        
        return variation * sign;
    }

    addScaleReferenceFeatures() {
        // Add various scale reference objects to help judge terrain size
        this.createShipwrecks();
        this.createWhaleSkeletons();
        this.createCoralReefs();
        
        console.log('🔍 Scale reference features added: shipwrecks, whale skeletons, coral reefs');
    }

    createShipwrecks() {
        // Add several shipwrecks of known sizes for scale reference
        const shipwrecks = [
            { name: 'Destroyer', length: 110, width: 12, height: 15, color: 0x666666 },
            { name: 'Cargo Ship', length: 180, width: 25, height: 20, color: 0x554444 },
            { name: 'Battleship', length: 250, width: 35, height: 25, color: 0x444444 },
            { name: 'Container Ship', length: 300, width: 40, height: 30, color: 0x333333 },
            { name: 'Aircraft Carrier', length: 330, width: 80, height: 35, color: 0x555555 }
        ];

        const halfSize = this.terrainSize / 2;
        
        shipwrecks.forEach((ship, index) => {
            // Place shipwrecks at different locations across the terrain
            const x = (Math.random() - 0.5) * this.terrainSize * 0.8; // Within 80% of terrain
            const z = (Math.random() - 0.5) * this.terrainSize * 0.8;
            const terrainHeight = this.getHeightAtPosition(x, z);
            
            // Create simple box geometry for shipwreck
            const geometry = new THREE.BoxGeometry(ship.length, ship.height, ship.width);
            const material = new THREE.MeshBasicMaterial({ 
                color: ship.color,
                transparent: true,
                opacity: 0.8
            });
            
            const wreck = new THREE.Mesh(geometry, material);
            wreck.position.set(x, terrainHeight + ship.height/2, z);
            
            // Random rotation for realism
            wreck.rotation.y = Math.random() * Math.PI * 2;
            wreck.rotation.x = (Math.random() - 0.5) * 0.3; // Slight tilt
            wreck.rotation.z = (Math.random() - 0.5) * 0.2;
            
            wreck.name = `shipwreck_${ship.name}_${ship.length}m`;
            this.terrainGroup.add(wreck);
        });
    }

    createWhaleSkeletons() {
        // Add whale skeletons for biological scale reference
        const whaleTypes = [
            { name: 'Blue Whale', length: 30, width: 4, height: 3, color: 0xeeeeee },
            { name: 'Sperm Whale', length: 18, width: 3, height: 2.5, color: 0xdddddd },
            { name: 'Humpback Whale', length: 16, width: 4, height: 2, color: 0xcccccc },
            { name: 'Gray Whale', length: 14, width: 3, height: 2, color: 0xbbbbbb }
        ];

        whaleTypes.forEach((whale, index) => {
            // Place whale skeletons in different areas
            const x = (Math.random() - 0.5) * this.terrainSize * 0.6;
            const z = (Math.random() - 0.5) * this.terrainSize * 0.6;
            const terrainHeight = this.getHeightAtPosition(x, z);
            
            // Create elongated ellipsoid for whale skeleton
            const geometry = new THREE.CylinderGeometry(whale.width/2, whale.width/2, whale.length, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: whale.color,
                wireframe: true,
                transparent: true,
                opacity: 0.7
            });
            
            const skeleton = new THREE.Mesh(geometry, material);
            skeleton.position.set(x, terrainHeight + whale.height/2, z);
            
            // Lay skeleton on side like it fell to ocean floor
            skeleton.rotation.z = Math.PI / 2;
            skeleton.rotation.y = Math.random() * Math.PI * 2;
            
            skeleton.name = `whale_skeleton_${whale.name}_${whale.length}m`;
            this.terrainGroup.add(skeleton);
        });
    }

    createCoralReefs() {
        // Add coral reef formations for natural scale reference
        const reefSizes = [
            { radius: 50, height: 8, color: 0x00ff88 },   // Small reef patch
            { radius: 100, height: 12, color: 0x00dd77 }, // Medium reef
            { radius: 200, height: 15, color: 0x00bb66 }, // Large reef
            { radius: 300, height: 20, color: 0x009955 }  // Huge reef system
        ];

        reefSizes.forEach((reef, index) => {
            // Place reefs in shallow areas (they need sunlight)
            let x, z, terrainHeight;
            let attempts = 0;
            
            // Try to find a suitable shallow location
            do {
                x = (Math.random() - 0.5) * this.terrainSize * 0.7;
                z = (Math.random() - 0.5) * this.terrainSize * 0.7;
                terrainHeight = this.getHeightAtPosition(x, z);
                attempts++;
            } while (terrainHeight < -500 && attempts < 20); // Prefer shallow areas
            
            // Create irregular coral formation using multiple small spheres
            const reefGroup = new THREE.Group();
            const numCorals = Math.floor(reef.radius / 10); // More corals for larger reefs
            
            for (let i = 0; i < numCorals; i++) {
                const coralRadius = 3 + Math.random() * 8;
                const geometry = new THREE.SphereGeometry(coralRadius, 6, 4);
                const material = new THREE.MeshBasicMaterial({ 
                    color: reef.color,
                    transparent: true,
                    opacity: 0.6
                });
                
                const coral = new THREE.Mesh(geometry, material);
                
                // Random position within reef area
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * reef.radius;
                coral.position.x = Math.cos(angle) * distance;
                coral.position.z = Math.sin(angle) * distance;
                coral.position.y = Math.random() * reef.height;
                
                reefGroup.add(coral);
            }
            
            reefGroup.position.set(x, terrainHeight, z);
            reefGroup.name = `coral_reef_${reef.radius}m_radius`;
            this.terrainGroup.add(reefGroup);
        });
        
        console.log('🐠 Added coral reefs in shallow areas for scale reference');
    }

    toggleWireframe() {
        // Smart toggle: if currently in wireframe mode, return to previous non-wireframe mode
        // If in solid/shader mode, switch to wireframe
        
        if (this.wireframeMode) {
            // Currently in wireframe, switch back to previous mode (default to shader)
            const previousMode = (this.currentMode === 'wireframe') ? 'shader' : this.currentMode;
            console.log(`🔧 Toggling OFF wireframe, returning to ${previousMode} mode`);
            this.setVisualizationMode(previousMode);
        } else {
            // Currently in solid/shader mode, switch to wireframe
            console.log(`🔧 Toggling ON wireframe mode`);
            this.setVisualizationMode('wireframe');
        }
    }

    toggleVisibility() {
        if (this.terrainGroup) {
            this.isVisible = !this.isVisible;
            this.terrainGroup.visible = this.isVisible;
            console.log(`👁️ Terrain visibility: ${this.isVisible ? 'ON' : 'OFF'}`);
        }
    }

    setVisualizationMode(mode) {
        console.log('🎮 setVisualizationMode called with mode:', mode);
        
        // Update current mode tracking
        this.currentMode = mode;
        
        switch (mode) {
            case 'wireframe':
                this.wireframeMode = true;
                this.createTerrain();
                console.log('🎨 Terrain mode: WIREFRAME');
                break;
            case 'solid':
                this.wireframeMode = false;
                this.createTerrain();
                console.log('🎨 Terrain mode: SOLID (realistic seafloor)');
                break;
            case 'shader':
            case 'textured':
                this.wireframeMode = false;
                this.createTerrain();
                console.log('🎨 Terrain mode: REALISTIC SEAFLOOR (brown sandy bottom)');
                break;
        }
    }

    removeTerrain() {
        if (this.terrainGroup) {
            // Remove from scene
            this.scene.remove(this.terrainGroup);
            
            // Dispose of geometries and materials
            this.terrainGroup.traverse((child) => {
                if (child.geometry) {
                    child.geometry.dispose();
                }
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            
            this.terrainGroup = null;
            console.log('🗑️ Terrain removed and disposed');
        }
    }

    getTerrainInfo() {
        return {
            visible: this.isVisible,
            wireframe: this.wireframeMode,
            size: this.terrainSize,
            position: this.terrainGroup ? this.terrainGroup.position : null,
            children: this.terrainGroup ? this.terrainGroup.children.length : 0
        };
    }

    createEnhancedTerrainShader() {
        // Create advanced depth-based shader material for better terrain visualization
        const vertexShader = `
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying float vDepth;
            varying vec2 vUv;
            
            void main() {
                vPosition = position;
                vNormal = normalize(normalMatrix * normal);
                vDepth = position.y; // Y is depth after terrain rotation
                vUv = uv;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            uniform float time;
            uniform bool wireframeMode;
            uniform vec3 submarinePosition;
            uniform float passiveRange;
            uniform float activeSonarRange;
            uniform bool isActiveSonarActive;
            uniform float sonarFadeAlpha;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying float vDepth;
            varying vec2 vUv;
            
            // Simplified depth-based color zones (no texture sampling for performance)
            vec3 getDepthColor(float depth) {
                // Continental Shelf: Light blue-green (shallow water)
                if (depth > -200.0) {
                    float factor = (depth + 200.0) / 200.0; // 0 to 1
                    return mix(vec3(0.0, 0.8, 0.6), vec3(0.2, 0.9, 0.8), factor);
                }
                // Continental Slope: Blue to dark blue
                else if (depth > -2000.0) {
                    float factor = (depth + 2000.0) / 1800.0; // 0 to 1
                    return mix(vec3(0.0, 0.3, 0.8), vec3(0.0, 0.8, 0.6), factor);
                }
                // Abyssal Plain: Dark blue to purple
                else if (depth > -6000.0) {
                    float factor = (depth + 6000.0) / 4000.0; // 0 to 1
                    return mix(vec3(0.1, 0.0, 0.5), vec3(0.0, 0.3, 0.8), factor);
                }
                // Deep Trench: Purple to black
                else {
                    float factor = clamp((depth + 11000.0) / 5000.0, 0.0, 1.0);
                    return mix(vec3(0.05, 0.0, 0.1), vec3(0.1, 0.0, 0.5), factor);
                }
            }
            
            void main() {
                // Calculate slope for shading
                float slope = 1.0 - abs(dot(vNormal, vec3(0.0, 1.0, 0.0)));
                
                // Get depth-based color (no texture sampling for performance)
                vec3 baseColor = getDepthColor(vDepth);
                
                // Add subtle slope-based shading for better 3D perception
                vec3 slopeShading = vec3(slope * 0.2);
                baseColor += slopeShading;
                
                // Depth fog for distance perception
                float fogFactor = clamp(abs(vDepth) / 8000.0, 0.0, 0.4);
                baseColor = mix(baseColor, vec3(0.0, 0.1, 0.3), fogFactor);

                // SENSOR-BASED VISIBILITY CALCULATION
                float distanceToSubmarine = distance(vPosition.xz, submarinePosition.xz);
                float visibility = 0.0;
                
                // Default: 500m visibility
                if (distanceToSubmarine <= passiveRange) {
                    visibility = 1.0;
                }
                // Active sonar ping: 6000m range with timing-based fade
                else if (isActiveSonarActive && distanceToSubmarine <= activeSonarRange) {
                    // Apply fade alpha from JavaScript (1.0 = fully visible, 0.0 = invisible)
                    visibility = sonarFadeAlpha;
                }

                // Apply sensor visibility (0 = invisible, 1 = visible)
                float finalAlpha = visibility;

                // Discard fragments with very low alpha to prevent color artifacts
                if (finalAlpha < 0.01) {
                    discard;
                }

                if (wireframeMode) {
                    // Enhanced wireframe with depth coloring and sensor visibility
                    gl_FragColor = vec4(baseColor * 1.2, 0.9 * finalAlpha);
                } else {
                    // Solid mode with depth-based colors and sensor visibility
                    gl_FragColor = vec4(baseColor, finalAlpha);
                }
            }
        `;
        
        // Simplified shader material without textures for better performance
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                time: { value: 0.0 },
                wireframeMode: { value: this.wireframeMode },
                submarinePosition: { value: new THREE.Vector3(0, 0, 0) },
                passiveRange: { value: 500.0 },
                activeSonarRange: { value: 6000.0 },
                isActiveSonarActive: { value: false },
                sonarFadeAlpha: { value: 1.0 } // Alpha for sonar ping fade (1.0 = fully visible, 0.0 = invisible)
            },
            wireframe: this.wireframeMode,
            side: THREE.FrontSide,
            transparent: true,
            alphaTest: 0.01, // Discard fragments with alpha < 0.01 (fully invisible)
            depthWrite: false, // Don't write depth for transparent fragments
            depthTest: true
        });
        
        // Store reference for animation updates
        this.shaderMaterial = material;
        
        console.log('🎨 Enhanced textured terrain shader created with:');
        console.log('  🏖️ Sand texture for Continental Shelf');
        console.log('  🏔️ Mud texture for Continental Slope and Abyssal Plain');
        console.log('  ⛰️ Rock texture for steep slopes, canyons, and trenches');
        console.log('  💙 Depth-based color blending');
        console.log('  📏 Contour lines every 200m for depth reference');
        console.log('  🌊 Underwater caustics animation');
        console.log('  🏔️ Slope-based texture selection');
        console.log('  🌫️ Depth fog for distance visualization');
        
        return material;
    }

    // NEW: Create textured terrain shader (wrapper for compatibility)
    createTexturedTerrainShader() {
        return this.createEnhancedTerrainShader();
    }

    update(deltaTime) {
        // Animate the terrain shader for underwater effects
        if (this.shaderMaterial && this.shaderMaterial.uniforms && this.shaderMaterial.uniforms.time) {
            this.shaderMaterial.uniforms.time.value += deltaTime * 0.5; // Slow underwater animation

            // Update submarine position for sensor-based visibility
            if (window.playerSubmarine && window.playerSubmarine()) {
                const submarine = window.playerSubmarine();
                if (submarine && submarine.mesh && submarine.mesh.position) {
                    this.shaderMaterial.uniforms.submarinePosition.value.copy(submarine.mesh.position);
                }
            }

            // Update active sonar status from ocean environment
            if (window.oceanInstance) {
                // Check if sonar ping is still active (handles 30s visible, fade 30-40s)
                const isActive = window.oceanInstance.isSonarPingActive ? 
                    window.oceanInstance.isSonarPingActive() : 
                    (window.oceanInstance.isActiveSonarActive || false);
                this.shaderMaterial.uniforms.isActiveSonarActive.value = isActive;
                
                // Update fade alpha based on sonar ping timing
                if (window.oceanInstance.getSonarPingAlpha) {
                    this.shaderMaterial.uniforms.sonarFadeAlpha.value = window.oceanInstance.getSonarPingAlpha();
                } else {
                    // Default to fully visible if active, invisible if not
                    this.shaderMaterial.uniforms.sonarFadeAlpha.value = isActive ? 1.0 : 0.0;
                }
                
                // Update ranges
                if (window.oceanInstance.passiveRange !== undefined) {
                    this.shaderMaterial.uniforms.passiveRange.value = window.oceanInstance.passiveRange;
                }
                if (window.oceanInstance.activeSonarRange !== undefined) {
                    this.shaderMaterial.uniforms.activeSonarRange.value = window.oceanInstance.activeSonarRange;
                }
            }
        }
    }

    addWesternDepressionMarkers() {
        // Add visible markers for the western depression boundaries
        const depressionMarkers = [
            // Depression center
            { x: -15000, z: 0, y: -800, color: 0xFFFF00, name: 'Depression Center' },
            
            // Oval boundary markers (8 points around the oval)
            { x: -27000, z: 0, y: -600, color: 0xFF8800, name: 'West Edge' },      // West edge
            { x: -3000, z: 0, y: -600, color: 0xFF8800, name: 'East Edge' },       // East edge
            { x: -15000, z: 8000, y: -600, color: 0xFF8800, name: 'North Edge' },  // North edge
            { x: -15000, z: -8000, y: -600, color: 0xFF8800, name: 'South Edge' }, // South edge
            
            // Intermediate points
            { x: -21000, z: 5600, y: -700, color: 0xFF4400, name: 'NW Point' },    // Northwest
            { x: -9000, z: 5600, y: -700, color: 0xFF4400, name: 'NE Point' },     // Northeast
            { x: -21000, z: -5600, y: -700, color: 0xFF4400, name: 'SW Point' },   // Southwest
            { x: -9000, z: -5600, y: -700, color: 0xFF4400, name: 'SE Point' }     // Southeast
        ];
        
        depressionMarkers.forEach((marker, index) => {
            // Create a bright colored marker at each depression boundary
            const markerGeometry = new THREE.SphereGeometry(200, 8, 6);
            const markerMaterial = new THREE.MeshBasicMaterial({ 
                color: marker.color,
                transparent: true,
                opacity: 0.9
            });
            const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
            
            // Position marker at depression boundary
            markerMesh.position.set(marker.x, marker.y, marker.z);
            markerMesh.name = `depression_marker_${marker.name}`;
            
            this.terrainGroup.add(markerMesh);
            
            console.log(`🟡 Depression marker ${marker.name} added at (${marker.x}, ${marker.y}, ${marker.z})`);
        });
        
        console.log('✅ All western depression debug markers added');
    }

    getSubmarineRidgeHeight(x, z) {
        // MASSIVE CHAOTIC SUBMARINE RIDGE - Dramatically enhanced for realism
        // WINDING NE-SW ridge with extreme height variations and jagged chaos

        // Base ridge centerline with EXTREME sinuous winding
        const baseStartX = -20000;
        const baseStartZ = 25000;
        const baseEndX = 20000;
        const baseEndZ = 45000;

        // Calculate base progress along ridge
        const baseVecX = baseEndX - baseStartX;
        const baseVecZ = baseEndZ - baseStartZ;
        const baseLength = Math.sqrt(baseVecX * baseVecX + baseVecZ * baseVecZ);

        const pointVecX = x - baseStartX;
        const pointVecZ = z - baseStartZ;
        const dotProduct = (pointVecX * baseVecX + pointVecZ * baseVecZ) / (baseLength * baseLength);
        const baseProgress = Math.max(0, Math.min(1, dotProduct));

        // EXTREME WINDING AND MEANDERING - Multiple scales
        const largeMeander = Math.sin(baseProgress * Math.PI * 4) * 4000; // 4km amplitude meanders
        const mediumWind = Math.sin(baseProgress * Math.PI * 12) * 2000; // 2km amplitude twists
        const smallWind = Math.sin(baseProgress * Math.PI * 30) * 800; // 800m amplitude chaos
        const microWind = Math.sin(baseProgress * Math.PI * 80) * 300; // 300m micro-chaos

        // Calculate actual winding ridge centerline
        const windingOffsetX = largeMeander + mediumWind + smallWind + microWind;
        const windingOffsetZ = Math.cos(baseProgress * Math.PI * 6) * 2500 + Math.cos(baseProgress * Math.PI * 20) * 1000;

        const actualRidgeX = baseStartX + baseProgress * baseVecX + windingOffsetX;
        const actualRidgeZ = baseStartZ + baseProgress * baseVecZ + windingOffsetZ;

        // Distance to the WINDING ridge centerline
        const distanceToRidge = Math.sqrt(Math.pow(x - actualRidgeX, 2) + Math.pow(z - actualRidgeZ, 2));

        // Variable ridge width - narrows and widens chaotically
        const baseWidth = 3000; // 3km base width
        const widthVariation = Math.sin(baseProgress * Math.PI * 8) * 1500 + Math.sin(baseProgress * Math.PI * 25) * 800;
        const ridgeHalfWidth = Math.max(1000, baseWidth + widthVariation); // 2km to 10km width variation

        if (distanceToRidge <= ridgeHalfWidth) {
            // ON THE MASSIVE CHAOTIC RIDGE
            const ridgeProfile = 1 - (distanceToRidge / ridgeHalfWidth); // 1 at center, 0 at edge

            // EXTREME HEIGHT VARIATIONS - Much taller and more chaotic
            const baseRidgeHeight = 2000; // 2km base height
            const heightChaos = Math.sin(baseProgress * Math.PI * 6) * 2500 + // Major height variations
                               Math.sin(baseProgress * Math.PI * 18) * 1200 + // Medium variations
                               Math.sin(baseProgress * Math.PI * 45) * 600;   // Fine variations

            const totalRidgeHeight = baseRidgeHeight + heightChaos; // Up to 6.3km high!

            // JAGGED PROFILE - Sharp peaks and steep sides instead of smooth
            let jaggedProfile;
            if (ridgeProfile > 0.7) {
                // Sharp central peaks
                jaggedProfile = Math.pow(ridgeProfile, 0.3); // Sharp peak shape
            } else {
                // Steep jagged sides
                jaggedProfile = Math.pow(ridgeProfile, 2.5); // Very steep dropoff
            }

            const heightModification = jaggedProfile * totalRidgeHeight;

            // EXTREME JAGGED CREST VARIATIONS
            const jaggedCrest = Math.sin(baseProgress * Math.PI * 40) * 400 + // Large jagged features
                               Math.sin(baseProgress * Math.PI * 120) * 200 + // Medium jagged features
                               Math.sin(baseProgress * Math.PI * 300) * 100;  // Fine jagged texture

            // Side ridge spurs jutting out chaotically
            const spurChaos = Math.abs(Math.sin(x * 0.002) * Math.cos(z * 0.0015)) > 0.8 ?
                             Math.sin(baseProgress * Math.PI * 15) * 800 : 0; // Chaotic spurs

            // Fault lines and geological fractures
            const faultLines = Math.abs(Math.sin(x * 0.001 + z * 0.0008)) > 0.9 ?
                              -Math.sin(baseProgress * Math.PI * 25) * 300 : 0; // Deep fault cuts

            const totalVariation = jaggedCrest + spurChaos + faultLines;

            return {
                onRidge: true,
                heightModification: heightModification,
                variation: totalVariation,
                ridgeIntensity: ridgeProfile,
                chaosLevel: 'extreme'
            };
        }

        return {
            onRidge: false,
            heightModification: 0,
            variation: 0
        };
    }

    getWesternDepressionDepth(x, z, slopePosition) {
        // WESTERN CONTINENTAL SLOPE DEPRESSION - oval-shaped with stepped shelves and undulating hills
        // Located on the western side of the continental slope
        
        // Oval depression parameters
        const depressionCenterX = -15000; // 15km west of origin
        const depressionCenterZ = 0; // At middle of slope zone
        const ovalRadiusX = 12000; // 12km east-west radius
        const ovalRadiusZ = 8000;  // 8km north-south radius
        
        // Calculate normalized distance in oval coordinates
        const normalizedX = (x - depressionCenterX) / ovalRadiusX;
        const normalizedZ = (z - depressionCenterZ) / ovalRadiusZ;
        const ovalDistance = Math.sqrt(normalizedX * normalizedX + normalizedZ * normalizedZ);
        
        if (ovalDistance <= 1.0) {
            // Inside the oval depression
            const depressionProfile = 1 - ovalDistance; // 1 at center, 0 at edge
            
            // STEPPED SHELVES - create terraced effect
            const numShelves = 4;
            const shelfHeight = 400; // 400m per shelf
            
            // Determine which shelf we're on
            const shelfPosition = depressionProfile * numShelves;
            const currentShelf = Math.floor(shelfPosition);
            const withinShelf = shelfPosition - currentShelf;
            
            let baseShelfDepth;
            if (withinShelf < 0.8) {
                // Flat shelf area (80% of shelf width)
                baseShelfDepth = currentShelf * shelfHeight;
            } else {
                // Steep drop to next shelf (20% of shelf width)
                const dropProgress = (withinShelf - 0.8) / 0.2;
                baseShelfDepth = currentShelf * shelfHeight + dropProgress * shelfHeight;
            }
            
            // Depression depth based on slope position and shelf depth
            const baseSlopeDepth = -600 - (slopePosition * 1000); // Base slope depth
            const totalDepthModification = -800 - baseShelfDepth; // Additional depression depth
            const absoluteDepth = baseSlopeDepth + totalDepthModification;
            
            // SMOOTH UNDULATING HILLS AND NOISE on shelves and floor
            // Multi-scale gentle variations for naturalistic terrain
            const hillScale1 = 0.0005; // Large gentle hills
            const hillScale2 = 0.0012; // Medium gentle hills  
            const hillScale3 = 0.003;  // Small gentle features
            const noiseScale = 0.006;  // Fine gentle noise
            
            const undulatingHills = 
                Math.sin(x * hillScale1) * Math.cos(z * hillScale1 * 0.7) * 150 * depressionProfile +
                Math.sin(x * hillScale2 * 1.3) * Math.cos(z * hillScale2) * 80 * depressionProfile +
                Math.sin(x * hillScale3) * Math.sin(z * hillScale3 * 1.1) * 40 * depressionProfile;
                
            // Gentle random noise overlay
            const randomNoise = 
                Math.sin(x * noiseScale * 1.8) * Math.cos(z * noiseScale * 1.5) * 25 +
                Math.sin(x * noiseScale * 2.5) * Math.sin(z * noiseScale * 2.2) * 15 +
                Math.sin(x * noiseScale * 3.8) * Math.cos(z * noiseScale * 3.2) * 8;
            
            // Combine shelf depth with hills and noise
            const totalVariation = undulatingHills + (randomNoise * depressionProfile);
            
            return {
                inDepression: true,
                absoluteDepth: absoluteDepth,
                variation: totalVariation
            };
        }
        
        return {
            inDepression: false,
            absoluteDepth: 0,
            variation: 0
        };
    }

}

// Global terrain instance
window.simpleTerrain = null;

// Initialize simple terrain
function initSimpleTerrain(scene) {
    if (!scene) {
        console.error('❌ Scene not provided for terrain initialization');
        return null;
    }
    
    try {
        window.simpleTerrain = new SimpleTerrain(scene);
        const terrain = window.simpleTerrain.createTerrain();
        
        // Make globally accessible for controls
        window.terrainGenerator = window.simpleTerrain;
        
        console.log('✅ Simple terrain system initialized');
        return terrain;
    } catch (error) {
        console.error('❌ Simple terrain initialization failed:', error);
        return null;
    }
}

// Export for global access
window.SimpleTerrain = SimpleTerrain;
window.initSimpleTerrain = initSimpleTerrain;