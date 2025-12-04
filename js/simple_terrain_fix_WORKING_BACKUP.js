/**
 * Simple Terrain Fix for Sub War 2060
 * Creates reliable terrain rendering without complex dependencies
 */

class SimpleTerrain {
    constructor(scene) {
        this.scene = scene;
        this.terrainGroup = null;
        this.terrainSize = 50000; // 50km x 50km
        this.gridSpacing = 1000; // 1km grid spacing for smoother appearance
        this.isVisible = true;
        this.wireframeMode = false; // Start with shaded mode for visual appeal
        this.currentMode = 'shader'; // Track current visualization mode: 'wireframe', 'solid', 'shader'
        this.shaderMaterial = null; // Store reference to shader for animation
        this.useFallbackMaterial = false; // Use shader material by default
    }

    createTerrain() {
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
        
        return this.terrainGroup;
    }

    createEmergencyTerrain() {
        console.log('🌊 Creating SIMPLE terrain with minimal height variations...');
        
        // Start with VERY SIMPLE height variation to ensure visibility
        const width = 10000;          
        const height = 10000;         
        const widthSegments = 8;      // Reduced segments to debug
        const heightSegments = 8;     // Reduced segments to debug
        
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
            
            // More obvious height variation for visibility
            const heightVariation1 = Math.sin(x * 0.0008) * 80;  // Larger hills
            const heightVariation2 = Math.sin(z * 0.0012) * 60;  // Cross-direction valleys
            const totalVariation = heightVariation1 + heightVariation2;
            const newHeight = -100 + totalVariation; // Base at -100m with significant variation
            
            vertices[i + 1] = newHeight; // Modify Y coordinate (height after rotation)
            
            // Log first few vertices for debugging
            if (i < 30) {
                console.log(`🔍 Vertex ${i/3}: (${x.toFixed(1)}, ${newHeight.toFixed(1)}, ${z.toFixed(1)})`);
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals(); // Recalculate normals
        console.log('✅ Height variations applied AFTER rotation');
        
        // Material respects current wireframe mode
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00FF00,  // Bright green
            wireframe: this.wireframeMode,  // Use current wireframe mode setting
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        
        this.terrainGroup.add(mesh);
        console.log(`✅ ENHANCED HEIGHT TERRAIN: Green terrain in ${this.wireframeMode ? 'WIREFRAME' : 'SOLID'} mode`);
        console.log('📊 Mesh info: position =', mesh.position, ', visible =', mesh.visible);
        console.log('📊 Height range: approximately -240m to +40m (140m total variation)');
        console.log('📊 Same geometry used for both wireframe and solid modes');
        
        // Add cyan reference plane above the terrain for comparison
        const testGeometry = new THREE.PlaneGeometry(2000, 2000);
        testGeometry.rotateX(-Math.PI / 2);
        const testMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00FFFF, 
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        });
        const testMesh = new THREE.Mesh(testGeometry, testMaterial);
        testMesh.position.set(0, -100, 0); // Above the tallest terrain parts
        this.terrainGroup.add(testMesh);
        console.log('✅ Cyan reference plane added at Y=-100 (above terrain)');
        
        // Add red debug box for reference  
        const debugBox = new THREE.Mesh(
            new THREE.BoxGeometry(200, 200, 200),
            new THREE.MeshBasicMaterial({ color: 0xFF0000 })
        );
        debugBox.position.set(0, -50, 0); // Well above terrain
        this.terrainGroup.add(debugBox);
        console.log('✅ Red debug box added at Y=-50');
        
        console.log('📊 HEIGHT VARIED TERRAIN SUMMARY:');
        console.log('  - Terrain: 10km x 10km with hills/valleys (-200m to 0m depth)');
        console.log('  - Segments: 32x32 for smooth height variation');
        console.log('  - Height algorithm: 3-layer sine waves for natural look');
        console.log('  - Cyan reference: 2km x 2km at Y=-100');  
        console.log('  - Red debug box: 200x200x200 at Y=-50');
        console.log('  - Total objects in terrainGroup:', this.terrainGroup.children.length);
    }

    createEmergencyWireframe() {
        console.log('🌊 Creating realistic wireframe terrain with shader overlay...');
        
        // Create a proper terrain mesh that can display wireframe + shaders
        const terrainSize = 5000; // 5km x 5km terrain
        const segments = 50; // 50x50 grid for good detail
        
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
            
            // Large flat plane
            const planeGeometry = new THREE.PlaneGeometry(5000, 5000);
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