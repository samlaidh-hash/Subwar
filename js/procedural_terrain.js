/**
 * Procedural Terrain Generation using THREE.Terrain
 * Sub War 2060 - Advanced ocean floor terrain generation
 */

class ProceduralTerrain {
    constructor() {
        this.terrainMesh = null;
        this.terrainSize = 10000; // 10km x 10km for detailed jagged terrain
        this.segments = 255; // Higher resolution for detailed peaks and valleys
        this.maxDepth = -1800; // Maximum depth for deep valleys
        this.minDepth = -150;   // Minimum depth for highest peaks
    }

    /**
     * Generate underwater terrain using various noise algorithms
     */
    generateTerrain(options = {}) {
        const {
            algorithm = 'perlin', // 'perlin', 'diamond-square', 'fault', 'combined'
            seed = Math.random(),
            roughness = 0.7,
            size = this.terrainSize,
            segments = this.segments
        } = options;

        // Set up terrain generation parameters
        const terrainOptions = {
            xSegments: segments,
            ySegments: segments,
            xSize: size,
            ySize: size,
            maxHeight: Math.abs(this.minDepth),
            minHeight: Math.abs(this.maxDepth),
            material: this.createOceanFloorMaterial({
                wireframe: options.wireframe === true, // Default to solid bathymetric mode
                useShader: options.useShader !== false, // Default to advanced bathymetric shader
                color: options.color || 0x00ffff
            }),
            // Use the terrain generation algorithm
            heightmap: this.getHeightmapFunction(algorithm, seed, roughness)
        };

        // Generate the terrain using safe method to avoid NaN issues
        try {
            this.terrainMesh = THREE.Terrain(terrainOptions);
        } catch (error) {
            console.warn('THREE.Terrain failed, creating simple plane terrain:', error);
            // Fallback: create a simple terrain plane
            this.terrainMesh = this.createSimpleTerrain(size, segments);
        }
        
        // ALWAYS create direct wireframe terrain for guaranteed visibility (bypass THREE.Terrain issues)
        this.createDirectWireframeTerrain();

        // Position the terrain below the water surface (use average depth for better visibility)
        const averageDepth = (this.maxDepth + this.minDepth) / 2; // Average between -1800 and -150 = -975
        this.terrainMesh.position.y = averageDepth;
        
        // Ensure terrain is added to scene
        console.log('🏔️ Procedural terrain positioned at Y:', averageDepth, 'Size:', size, 'Segments:', segments);
        
        // Force terrain visibility
        this.terrainMesh.visible = true;
        this.terrainMesh.frustumCulled = false; // Disable frustum culling

        // Add terrain features (temporarily disabled to avoid NaN issues)
        // this.addTerrainFeatures();

        // Use the same approach as Monterey Canyon terrain for visibility
        this.addProceduralTerrainToScene();
        
        return this.terrainMesh;
    }

    /**
     * Create direct wireframe terrain that bypasses THREE.Terrain completely
     */
    createDirectWireframeTerrain() {
        const terrainGroup = new THREE.Group();
        terrainGroup.name = 'proceduralTerrain';
        
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff, // Cyan
            transparent: true,
            opacity: 0.8
        });
        
        // Create simple procedural height function
        const getHeight = (x, z) => {
            // Simple sine wave terrain for guaranteed visibility
            const height1 = Math.sin(x * 0.001) * 200;
            const height2 = Math.cos(z * 0.001) * 150;
            const height3 = Math.sin(x * 0.003 + z * 0.002) * 100;
            return height1 + height2 + height3;
        };
        
        const size = this.terrainSize; // 10000 (10km)
        const gridSize = 50; // 50x50 grid
        const step = size / gridSize;
        
        // Create horizontal grid lines
        for (let z = 0; z <= gridSize; z += 2) { // Every 2nd line for performance
            const points = [];
            for (let x = 0; x <= gridSize; x++) {
                const worldX = (x - gridSize/2) * step; // -5000 to +5000
                const worldZ = (z - gridSize/2) * step; // -5000 to +5000
                const height = getHeight(worldX, worldZ);
                points.push(new THREE.Vector3(worldX, height, worldZ));
            }
            
            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                terrainGroup.add(line);
            }
        }
        
        // Create vertical grid lines
        for (let x = 0; x <= gridSize; x += 2) { // Every 2nd line for performance
            const points = [];
            for (let z = 0; z <= gridSize; z++) {
                const worldX = (x - gridSize/2) * step; // -5000 to +5000
                const worldZ = (z - gridSize/2) * step; // -5000 to +5000
                const height = getHeight(worldX, worldZ);
                points.push(new THREE.Vector3(worldX, height, worldZ));
            }
            
            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                terrainGroup.add(line);
            }
        }
        
        // Position at average depth
        const averageDepth = (this.maxDepth + this.minDepth) / 2; // -975
        terrainGroup.position.y = averageDepth;
        
        // Force visibility
        terrainGroup.visible = true;
        terrainGroup.children.forEach(child => {
            child.visible = true;
        });
        
        // Add to scene
        if (window.gameState && window.gameState.scene) {
            window.gameState.scene.add(terrainGroup);
            console.log(`🏔️ DIRECT procedural terrain created with ${terrainGroup.children.length} wireframe lines`);
            console.log(`🎯 Direct terrain positioned at Y: ${averageDepth}`);
            console.log(`📐 Terrain covers ${size}m x ${size}m (${size/1000}km x ${size/1000}km)`);
            
            // Add test line for visibility verification
            const testPoints = [
                new THREE.Vector3(-2000, averageDepth + 200, 0),
                new THREE.Vector3(2000, averageDepth + 200, 0)
            ];
            const testGeometry = new THREE.BufferGeometry().setFromPoints(testPoints);
            const testLine = new THREE.Line(testGeometry, wireframeMaterial);
            terrainGroup.add(testLine);
            console.log('🧪 Added bright test line for visibility verification');
        }
    }
    
    /**
     * Add procedural terrain to scene using Monterey Canyon approach for visibility
     */
    addProceduralTerrainToScene() {
        if (!this.terrainMesh) return;
        
        // Create terrain group similar to Monterey Canyon approach
        const terrainGroup = new THREE.Group();
        terrainGroup.name = 'proceduralTerrain';
        
        // Get the terrain geometry
        const geometry = this.terrainMesh.geometry;
        if (!geometry || !geometry.attributes || !geometry.attributes.position) {
            console.warn('🏔️ Terrain geometry not available, using original mesh');
            return;
        }
        
        // Create wireframe lines from the terrain geometry
        const vertices = geometry.attributes.position.array;
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff, // Cyan like Monterey Canyon
            transparent: true,
            opacity: 0.8
        });
        
        // Create grid lines similar to Monterey Canyon terrain
        const segments = Math.sqrt(vertices.length / 3); // Approximate segment count
        const size = this.terrainSize;
        
        // Create horizontal lines (X direction)
        for (let z = 0; z < segments; z += 5) { // Every 5th line for performance
            const points = [];
            for (let x = 0; x < segments; x++) {
                const index = (z * segments + x) * 3;
                if (index < vertices.length - 2) {
                    points.push(new THREE.Vector3(
                        vertices[index],     // X
                        vertices[index + 1], // Y (height)
                        vertices[index + 2]  // Z
                    ));
                }
            }
            
            if (points.length > 1) {
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeometry, wireframeMaterial);
                terrainGroup.add(line);
            }
        }
        
        // Create vertical lines (Z direction) 
        for (let x = 0; x < segments; x += 5) { // Every 5th line for performance
            const points = [];
            for (let z = 0; z < segments; z++) {
                const index = (z * segments + x) * 3;
                if (index < vertices.length - 2) {
                    points.push(new THREE.Vector3(
                        vertices[index],     // X
                        vertices[index + 1], // Y (height)
                        vertices[index + 2]  // Z
                    ));
                }
            }
            
            if (points.length > 1) {
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeometry, wireframeMaterial);
                terrainGroup.add(line);
            }
        }
        
        // Position the terrain group
        const averageDepth = (this.maxDepth + this.minDepth) / 2;
        terrainGroup.position.y = averageDepth;
        
        // Force visibility like Monterey Canyon
        terrainGroup.visible = true;
        terrainGroup.children.forEach(child => {
            child.visible = true;
        });
        
        // Add to global scene (like Monterey Canyon does)
        if (window.gameState && window.gameState.scene) {
            window.gameState.scene.add(terrainGroup);
            console.log(`🏔️ Procedural terrain added to scene with ${terrainGroup.children.length} wireframe lines`);
            console.log(`🎯 Terrain group positioned at Y: ${averageDepth}`);
            
            // Add test line for visibility verification (like Monterey Canyon)
            const testPoints = [
                new THREE.Vector3(-1000, averageDepth + 100, 0),
                new THREE.Vector3(1000, averageDepth + 100, 0)
            ];
            const testGeometry = new THREE.BufferGeometry().setFromPoints(testPoints);
            const testLine = new THREE.Line(testGeometry, wireframeMaterial);
            terrainGroup.add(testLine);
            console.log('🧪 Added procedural terrain test line for visibility verification');
        } else {
            console.warn('🏔️ No game scene available for procedural terrain');
        }
    }
    
    /**
     * Create simple terrain as fallback when THREE.Terrain fails
     */
    createSimpleTerrain(size, segments) {
        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
        
        // Apply procedural height variation
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            
            // Simple noise function for height variation
            const height = Math.sin(x * 0.001) * Math.cos(z * 0.001) * 200 +
                          Math.sin(x * 0.003) * Math.cos(z * 0.003) * 100 +
                          Math.sin(x * 0.007) * Math.cos(z * 0.007) * 50;
            
            vertices[i + 1] = height;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        // Rotate to be horizontal (same as THREE.Terrain)
        geometry.rotateX(-Math.PI / 2);
        
        const material = this.createOceanFloorMaterial({
            wireframe: true,
            color: 0x00ffff,
            opacity: 0.6
        });
        
        console.log('🌊 Created simple procedural terrain as fallback');
        return new THREE.Mesh(geometry, material);
    }
    
    /**
     * Get the appropriate heightmap function based on algorithm choice
     */
    getHeightmapFunction(algorithm, seed, roughness) {
        switch (algorithm) {
        case 'perlin':
            return THREE.Terrain.Perlin;

        case 'diamond-square':
            return THREE.Terrain.DiamondSquare;

        case 'fault':
            return (geometry) => {
                THREE.Terrain.Fault(geometry, {
                    iterations: 100,
                    minHeight: 0,
                    maxHeight: Math.abs(this.maxDepth - this.minDepth)
                });
            };

        case 'combined':
            return (geometry) => {
                // Create dramatic jagged seabed with peaks and valleys
                // Use only Perlin noise layers to avoid NaN issues from Fault algorithm
                THREE.Terrain.Perlin(geometry, { frequency: 0.01, amplitude: 0.8 });
                THREE.Terrain.Perlin(geometry, { frequency: 0.03, amplitude: 0.5 });
                THREE.Terrain.Perlin(geometry, { frequency: 0.08, amplitude: 0.3 });
                THREE.Terrain.Perlin(geometry, { frequency: 0.15, amplitude: 0.2 });
                
                // Add diamond-square for more variation
                THREE.Terrain.DiamondSquare(geometry, { roughness: roughness * 0.5 });
                
                // Light smoothing to preserve features but remove any potential NaN values
                THREE.Terrain.Smooth(geometry, { iterations: 2 });
            };

        default:
            return THREE.Terrain.Perlin;
        }
    }

    /**
     * Create material appropriate for ocean floor
     */
    createOceanFloorMaterial(options = {}) {
        const {
            wireframe = false,
            useShader = false,
            color = 0x00ffff, // Cyan wireframe for underwater visibility
            opacity = 0.8
        } = options;

        if (useShader) {
            // Advanced shader material with depth-based coloring
            return this.createDepthShaderMaterial();
        } else if (wireframe) {
            // Simple wireframe material for terrain visualization
            return new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: opacity,
                side: THREE.DoubleSide
            });
        } else {
            // Solid material with vertex colors
            return new THREE.MeshLambertMaterial({
                color: 0x4a4a3a,
                transparent: false,
                wireframe: false,
                vertexColors: true
            });
        }
    }

    /**
     * Create advanced depth-based shader material
     */
    createDepthShaderMaterial() {
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
                // Calculate depth with enhanced precision
                float depth = abs(vPosition.y);
                float normalizedDepth = clamp((depth - minDepth) / (maxDepth - minDepth), 0.0, 1.0);
                
                // Enhanced slope calculation for better topography visibility
                float slope = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 1.0, 0.0)));
                slope = pow(slope, 0.8); // Enhance slope contrast
                
                // Enhanced depth coloring for jagged 150m-1800m seabed terrain
                vec3 depthColor;
                if (normalizedDepth < 0.1) {
                    // Peaks around 150m - bright sandy/rocky
                    depthColor = mix(vec3(0.8, 0.7, 0.5), vec3(0.7, 0.6, 0.4), normalizedDepth * 10.0);
                } else if (normalizedDepth < 0.3) {
                    // Upper slopes - rocky brown to grey
                    depthColor = mix(vec3(0.7, 0.6, 0.4), vec3(0.5, 0.4, 0.3), (normalizedDepth - 0.1) * 5.0);
                } else if (normalizedDepth < 0.6) {
                    // Middle depths - transition to blue-grey
                    depthColor = mix(vec3(0.5, 0.4, 0.3), vec3(0.3, 0.4, 0.5), (normalizedDepth - 0.3) * 3.33);
                } else if (normalizedDepth < 0.85) {
                    // Lower slopes - deeper blue-grey
                    depthColor = mix(vec3(0.3, 0.4, 0.5), vec3(0.2, 0.3, 0.6), (normalizedDepth - 0.6) * 4.0);
                } else {
                    // Deep valleys around 1800m - very dark blue
                    depthColor = mix(vec3(0.2, 0.3, 0.6), vec3(0.1, 0.2, 0.4), (normalizedDepth - 0.85) * 6.67);
                }
                
                // Ridge and canyon enhancement
                vec3 slopeColor = mix(ridgeColor, canyonColor, slope);
                
                // Blend depth and slope colors
                vec3 baseColor = mix(depthColor, slopeColor, slope * 0.6);
                
                // Add subtle topographic contour lines
                float contours = sin(depth * 0.01) * 0.1;
                baseColor += vec3(contours * 0.3);
                
                // Add subtle shimmer for underwater effect
                float shimmer = sin(vPosition.x * 0.001 + time) * sin(vPosition.z * 0.001 + time * 1.2) * 0.05;
                baseColor += vec3(shimmer * 0.2, shimmer * 0.3, shimmer * 0.5);
                
                // Enhanced contrast and brightness
                baseColor = pow(baseColor, vec3(0.9)); // Slight gamma correction
                baseColor *= 1.2; // Increase brightness
                
                gl_FragColor = vec4(baseColor, 0.95);
            }
        `;

        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                minDepth: { value: Math.abs(this.minDepth) },
                maxDepth: { value: Math.abs(this.maxDepth) },
                deepColor: { value: new THREE.Color(0x001122) },    // Deep blue
                shallowColor: { value: new THREE.Color(0x4a6741) }, // Shallow green-brown
                ridgeColor: { value: new THREE.Color(0xcc8866) },   // Enhanced ridge color
                canyonColor: { value: new THREE.Color(0x223344) }, // Deep canyon blue-grey
                time: { value: 0.0 }                               // Animation time
            },
            transparent: true,
            side: THREE.DoubleSide
        });
    }

    /**
     * Update shader uniforms for animation
     */
    updateShader(time = 0) {
        if (this.terrainMesh && this.terrainMesh.material && this.terrainMesh.material.uniforms) {
            this.terrainMesh.material.uniforms.time.value = time * 0.001; // Slow animation
        }
    }

    /**
     * Add realistic underwater terrain features
     */
    addTerrainFeatures() {
        if (!this.terrainMesh) return;

        // Add underwater canyons
        this.addUnderwriterCanyons();

        // Add seamounts and ridges
        this.addSeamounts();

        // Add terrain texture variation
        this.addTextureBlending();
    }

    /**
     * Create underwater canyon features
     */
    addUnderwriterCanyons() {
        const geometry = this.terrainMesh.geometry;
        const vertices = geometry.attributes.position.array;

        // Create canyon-like depressions
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];

            // Create a canyon running diagonally across the terrain
            const canyonDistance = Math.abs(x - z) / this.terrainSize;
            if (canyonDistance < 0.1) {
                vertices[i + 1] -= 30 * (0.1 - canyonDistance) * 10; // Deepen canyon
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    /**
     * Add seamount features (underwater mountains)
     */
    addSeamounts() {
        const geometry = this.terrainMesh.geometry;
        const vertices = geometry.attributes.position.array;

        // Add a few seamounts
        const seamounts = [
            { x: 200, z: 300, height: 40, radius: 80 },
            { x: -150, z: -200, height: 25, radius: 60 },
            { x: 300, z: -100, height: 35, radius: 70 }
        ];

        for (let seamount of seamounts) {
            for (let i = 0; i < vertices.length; i += 3) {
                const x = vertices[i];
                const z = vertices[i + 2];

                const distance = Math.sqrt((x - seamount.x) ** 2 + (z - seamount.z) ** 2);
                if (distance < seamount.radius) {
                    const factor = 1 - (distance / seamount.radius);
                    vertices[i + 1] += seamount.height * factor * factor; // Smooth falloff
                }
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    /**
     * Add texture blending based on depth and slope
     */
    addTextureBlending() {
        // This would require more advanced shader materials
        // For now, we'll use vertex colors to simulate depth-based coloring
        const geometry = this.terrainMesh.geometry;
        const vertices = geometry.attributes.position.array;
        const colors = new Float32Array(vertices.length);

        for (let i = 0; i < vertices.length; i += 3) {
            const depth = Math.abs(vertices[i + 1]);
            const normalizedDepth = depth / Math.abs(this.maxDepth);

            // Deeper areas are darker
            const brightness = 1 - normalizedDepth * 0.7;
            colors[i] = brightness * 0.4;     // R
            colors[i + 1] = brightness * 0.4; // G
            colors[i + 2] = brightness * 0.3; // B
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.terrainMesh.material.vertexColors = true;
    }

    /**
     * Generate terrain chunks for larger world areas
     */
    generateTerrainChunks(worldSize = 5000, chunkSize = 1000) {
        const chunks = [];
        const chunksPerSide = Math.ceil(worldSize / chunkSize);

        for (let x = 0; x < chunksPerSide; x++) {
            for (let z = 0; z < chunksPerSide; z++) {
                const chunk = this.generateTerrain({
                    algorithm: 'combined',
                    size: chunkSize,
                    segments: 63 // Lower resolution for chunks
                });

                // Position chunk in world space
                chunk.position.x = (x - chunksPerSide / 2) * chunkSize;
                chunk.position.z = (z - chunksPerSide / 2) * chunkSize;
                chunk.position.y = this.maxDepth;

                chunks.push(chunk);
            }
        }

        return chunks;
    }

    /**
     * Get terrain height at specific world coordinates
     */
    getHeightAtPosition(x, z) {
        if (!this.terrainMesh) return this.maxDepth;

        // This would require raycasting or geometry analysis
        // For now, return a default depth
        return this.maxDepth + Math.random() * (this.minDepth - this.maxDepth);
    }

    /**
     * Update terrain LOD (Level of Detail) based on distance
     */
    updateLOD(cameraPosition, maxDistance = 2000) {
        if (!this.terrainMesh) return;

        const distance = cameraPosition.distanceTo(this.terrainMesh.position);
        const lodLevel = Math.min(3, Math.floor(distance / (maxDistance / 4)));

        // Adjust terrain detail based on distance
        // This would require multiple terrain meshes at different resolutions
        this.terrainMesh.visible = distance < maxDistance;
    }

    /**
     * Switch terrain visualization mode
     */
    setVisualizationMode(mode) {
        if (!this.terrainMesh) return;
        
        let newMaterial;
        switch (mode) {
            case 'wireframe':
                newMaterial = this.createOceanFloorMaterial({
                    wireframe: true,
                    color: 0x00ffff,
                    opacity: 0.8
                });
                break;
            case 'shader':
                newMaterial = this.createOceanFloorMaterial({
                    useShader: true,
                    wireframe: false
                });
                break;
            case 'solid':
                newMaterial = this.createOceanFloorMaterial({
                    wireframe: false,
                    useShader: false
                });
                break;
            default:
                console.warn('Unknown visualization mode:', mode);
                return;
        }
        
        // Dispose of old material
        if (this.terrainMesh.material) {
            this.terrainMesh.material.dispose();
        }
        
        this.terrainMesh.material = newMaterial;
        console.log('Terrain visualization mode changed to:', mode);
    }

    /**
     * Toggle wireframe mode on/off
     */
    toggleWireframe() {
        if (!this.terrainMesh || !this.terrainMesh.material) {
            console.log('Cannot toggle wireframe: no terrain mesh or material');
            return;
        }
        
        const currentWireframe = this.terrainMesh.material.wireframe;
        this.terrainMesh.material.wireframe = !currentWireframe;
        console.log('Terrain wireframe toggled:', !currentWireframe ? 'ON' : 'OFF');
        console.log('Current material:', this.terrainMesh.material);
    }
    
    /**
     * Get current visualization mode info
     */
    getVisualizationInfo() {
        if (!this.terrainMesh || !this.terrainMesh.material) {
            return 'No terrain available';
        }
        
        const material = this.terrainMesh.material;
        if (material.wireframe) {
            return 'Wireframe mode';
        } else if (material.uniforms) {
            return 'Shader mode';
        } else {
            return 'Solid mode';
        }
    }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProceduralTerrain;
} else {
    window.ProceduralTerrain = ProceduralTerrain;
}
