// Oolite Model Loader for Sub War 2060
// Integrates Oolite ship models with the Three.js submarine game

class OoliteModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.loadedModels = new Map();
        this.modelCache = new Map();
    }

    /**
     * Load an Oolite model from converted JSON data
     * @param {string} modelPath - Path to the JSON model file
     * @param {Object} options - Loading options
     * @returns {Promise<THREE.Mesh>} The loaded Three.js mesh
     */
    async loadModel(modelPath, options = {}) {
        const {
            scale = 1.0,
            position = {x: 0, y: 0, z: 0},
            rotation = {x: 0, y: 0, z: 0},
            material = null,
            name = null
        } = options;

        try {
            // Check cache first
            const cacheKey = `${modelPath}_${scale}`;
            if (this.modelCache.has(cacheKey)) {
                console.log(`Loading cached model: ${modelPath}`);
                return this.createMeshFromCache(cacheKey, position, rotation, name);
            }

            console.log(`Loading Oolite model: ${modelPath}`);

            // Load JSON model data
            const response = await fetch(modelPath);
            if (!response.ok) {
                throw new Error(`Failed to load model: ${response.statusText}`);
            }

            const modelData = await response.json();
            console.log('Model metadata:', modelData.metadata);

            // Create Three.js geometry
            const geometry = this.createGeometry(modelData, scale);

            // Create material
            const meshMaterial = material || this.createMaterial(modelData);

            // Cache the geometry and material
            this.modelCache.set(cacheKey, {
                geometry: geometry,
                material: meshMaterial,
                originalData: modelData
            });

            // Create mesh
            const mesh = new THREE.Mesh(geometry, meshMaterial);

            // Set position and rotation
            mesh.position.set(position.x, position.y, position.z);
            mesh.rotation.set(rotation.x, rotation.y, rotation.z);

            if (name) {
                mesh.name = name;
                mesh.userData.modelType = 'oolite';
                mesh.userData.originalPath = modelPath;
            }

            // Add to scene if provided
            if (this.scene) {
                this.scene.add(mesh);
            }

            this.loadedModels.set(name || modelPath, mesh);

            console.log(`Successfully loaded Oolite model: ${modelPath}`);
            return mesh;

        } catch (error) {
            console.error(`Error loading Oolite model ${modelPath}:`, error);
            throw error;
        }
    }

    /**
     * Create Three.js geometry from model data
     */
    createGeometry(modelData, scale = 1.0) {
        const geometry = new THREE.BufferGeometry();

        // Convert arrays back to typed arrays and apply scale
        const vertices = new Float32Array(modelData.vertices.map(v => v * scale));
        const indices = new Uint16Array(modelData.indices);
        const normals = new Float32Array(modelData.normals);
        const colors = new Float32Array(modelData.colors);

        // Set attributes
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Compute additional properties
        geometry.computeBoundingSphere();
        geometry.computeBoundingBox();

        return geometry;
    }

    /**
     * Create appropriate material for the model
     */
    createMaterial(modelData, options = {}) {
        const {
            wireframe = false,
            transparent = false,
            opacity = 1.0,
            emissive = 0x000000,
            roughness = 0.5,
            metalness = 0.1
        } = options;

        // Use vertex colors from the Oolite model
        const material = new THREE.MeshLambertMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            wireframe: wireframe,
            transparent: transparent,
            opacity: opacity
        });

        // Add emissive for space ships
        if (emissive !== 0x000000) {
            material.emissive = new THREE.Color(emissive);
        }

        return material;
    }

    /**
     * Create mesh from cached data
     */
    createMeshFromCache(cacheKey, position, rotation, name) {
        const cached = this.modelCache.get(cacheKey);

        // Clone geometry and material for new instance
        const geometry = cached.geometry.clone();
        const material = cached.material.clone();

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(position.x, position.y, position.z);
        mesh.rotation.set(rotation.x, rotation.y, rotation.z);

        if (name) {
            mesh.name = name;
            mesh.userData.modelType = 'oolite';
        }

        if (this.scene) {
            this.scene.add(mesh);
        }

        this.loadedModels.set(name || `cached_${Date.now()}`, mesh);

        return mesh;
    }

    /**
     * Load multiple models for enemy fleets
     */
    async loadFleet(modelConfigs) {
        const fleet = [];

        for (const config of modelConfigs) {
            try {
                const mesh = await this.loadModel(config.path, {
                    scale: config.scale || 1.0,
                    position: config.position || {x: 0, y: 0, z: 0},
                    rotation: config.rotation || {x: 0, y: 0, z: 0},
                    name: config.name,
                    material: config.material
                });

                // Add fleet-specific properties
                if (config.enemyType) {
                    mesh.userData.enemyType = config.enemyType;
                    mesh.userData.health = config.health || 100;
                    mesh.userData.speed = config.speed || 10;
                    mesh.userData.weaponRange = config.weaponRange || 50;
                    mesh.userData.sensorMultiplier = config.sensorMultiplier || 1.0; // Enhanced sensors for recon units

                    // Apply detailed submarine specifications from Oolite ships
                    this.applyOoliteSubmarineSpecs(mesh, config.path);
                }

                fleet.push(mesh);

            } catch (error) {
                console.warn(`Failed to load fleet model ${config.path}:`, error);
            }
        }

        console.log(`Loaded fleet with ${fleet.length} ships`);
        return fleet;
    }

    /**
     * Apply detailed submarine specifications to Oolite ships
     */
    applyOoliteSubmarineSpecs(mesh, modelPath) {
        // Extract ship type from model path (e.g., 'models/cobra3.json' -> 'COBRA3')
        const shipType = this.extractShipTypeFromPath(modelPath);

        if (!shipType || !window.OOLITE_SUBMARINE_SPECIFICATIONS || !window.OOLITE_SUBMARINE_SPECIFICATIONS[shipType]) {
            console.warn(`No submarine specifications found for ship type: ${shipType}`);
            return;
        }

        const specs = window.OOLITE_SUBMARINE_SPECIFICATIONS[shipType];

        // Apply physical characteristics
        mesh.userData.submarineSpecs = {
            // Physical
            hullLength: specs.hullLength,
            hullWidth: specs.hullWidth,
            hullHeight: specs.hullHeight,
            displacement: specs.displacement,
            crew: specs.crew,

            // Performance
            maxSpeedForward: specs.maxSpeedForward,
            maxSpeedReverse: specs.maxSpeedReverse,
            accelerationRate: specs.accelerationRate,
            crushDepth: specs.crushDepth,
            emergencyDepth: specs.emergencyDepth,

            // Torpedo Capabilities
            torpedoTubes: specs.torpedoTubes,
            canCarryHeavyTorpedoes: specs.canCarryHeavyTorpedoes,
            hasMineLayer: specs.hasMineLayer,
            maxMines: specs.maxMines,

            // Standard Loadout
            standardLoadout: { ...specs.standardLoadout },

            // Maneuverability
            baseTurnRate: specs.baseTurnRate,
            pitchRate: specs.pitchRate,
            rollRate: specs.rollRate,
            dragTurnMultiplier: specs.dragTurnMultiplier,

            // Defensive Systems
            hullArmorHP: specs.hullArmorHP,
            hullArmorPenThreshold: specs.hullArmorPenThreshold,
            sonarSignatureBase: specs.sonarSignatureBase,

            // Systems HP
            hullHP: specs.hullHP,
            engineHP: specs.engineHP,
            weaponsHP: specs.weaponsHP,
            sensorsHP: specs.sensorsHP,
            lifeSupportHP: specs.lifeSupportHP,
            navigationHP: specs.navigationHP
        };

        // Override mesh speed and health with submarine specifications
        mesh.userData.speed = specs.maxSpeedForward;
        mesh.userData.health = specs.hullHP;
        mesh.userData.sonarSignature = specs.sonarSignatureBase;
        mesh.userData.turnRate = specs.baseTurnRate;
        mesh.userData.armor = specs.hullArmorHP;

        console.log(`Applied ${shipType} submarine specifications to ${mesh.name}:`, {
            torpedoTubes: specs.torpedoTubes,
            loadout: specs.standardLoadout,
            sonarSignature: specs.sonarSignatureBase,
            speed: specs.maxSpeedForward
        });
    }

    /**
     * Extract ship type identifier from model path
     */
    extractShipTypeFromPath(modelPath) {
        // Extract filename without extension: 'models/cobra3.json' -> 'cobra3'
        const filename = modelPath.split('/').pop().replace(/\.(json|dat)$/i, '');

        // Convert to uppercase and handle special cases
        const shipType = filename.toUpperCase();

        // Handle naming variations
        const typeMap = {
            'COBRA3': 'COBRA3',
            'COBRA_3': 'COBRA3',
            'COBRA-3': 'COBRA3',
            'BOA2': 'BOA2',
            'BOA_2': 'BOA2',
            'BOA-2': 'BOA2',
            'FER-DE-LANCE': 'FERDELANCE',
            'FERDELANCE': 'FERDELANCE',
            'ESCAPE_POD': 'ESCPOD',
            'ESCAPEPOD': 'ESCPOD',
            'ESC_POD': 'ESCPOD'
        };

        return typeMap[shipType] || shipType;
    }

    /**
     * Get submarine specifications for a given ship type
     */
    getSubmarineSpecs(shipType) {
        if (!window.OOLITE_SUBMARINE_SPECIFICATIONS) {
            console.warn('OOLITE_SUBMARINE_SPECIFICATIONS not loaded');
            return null;
        }

        const normalizedType = shipType.toUpperCase();
        return window.OOLITE_SUBMARINE_SPECIFICATIONS[normalizedType] || null;
    }

    /**
     * Get submarine specifications from model path
     */
    getSubmarineSpecsFromPath(modelPath) {
        const shipType = this.extractShipTypeFromPath(modelPath);
        return this.getSubmarineSpecs(shipType);
    }

    /**
     * Update model animations (rotation, movement, etc.)
     */
    updateModels(deltaTime) {
        this.loadedModels.forEach((mesh, name) => {
            // Basic rotation animation for space ships
            if (mesh.userData.modelType === 'oolite' && mesh.userData.rotate) {
                mesh.rotation.y += deltaTime * mesh.userData.rotateSpeed || 0.5;
            }

            // Update enemy ship behaviors
            if (mesh.userData.enemyType) {
                this.updateEnemyBehavior(mesh, deltaTime);
            }
        });
    }

    /**
     * Update enemy ship behavior
     */
    updateEnemyBehavior(mesh, deltaTime) {
        // Basic AI behaviors - can be enhanced

        // Patrol movement
        if (mesh.userData.patrolPath) {
            // Simple back-and-forth patrol
            const speed = mesh.userData.speed || 5;
            mesh.position.z += Math.sin(Date.now() * 0.001) * speed * deltaTime;
        }

        // Face the player submarine
        if (window.playerSubmarine && mesh.userData.trackPlayer) {
            const playerPos = window.playerSubmarine().getPosition();
            mesh.lookAt(playerPos);
        }
    }

    /**
     * Remove a model from the scene
     */
    removeModel(nameOrMesh) {
        let mesh;

        if (typeof nameOrMesh === 'string') {
            mesh = this.loadedModels.get(nameOrMesh);
            this.loadedModels.delete(nameOrMesh);
        } else {
            mesh = nameOrMesh;
            // Find and remove from loaded models map
            for (const [key, value] of this.loadedModels.entries()) {
                if (value === mesh) {
                    this.loadedModels.delete(key);
                    break;
                }
            }
        }

        if (mesh && this.scene) {
            this.scene.remove(mesh);

            // Dispose geometry and material to free memory
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(mat => mat.dispose());
                } else {
                    mesh.material.dispose();
                }
            }
        }
    }

    /**
     * Get loaded model by name
     */
    getModel(name) {
        return this.loadedModels.get(name);
    }

    /**
     * List all loaded models
     */
    listModels() {
        return Array.from(this.loadedModels.keys());
    }

    /**
     * Clear all models
     */
    clearAll() {
        this.loadedModels.forEach((mesh, name) => {
            this.removeModel(mesh);
        });
        this.loadedModels.clear();
    }

    /**
     * Create sample enemy configurations
     */
    static createEnemyFleetConfig(playerPosition) {
        const configs = [
            {
                path: 'models/cobra3.json',
                name: 'enemy_cobra_1',
                scale: 0.8,
                position: {
                    x: playerPosition.x + 100,
                    y: playerPosition.y + 20,
                    z: playerPosition.z + 50
                },
                enemyType: 'fighter',
                health: 80,
                speed: 15,
                weaponRange: 75
            },
            {
                path: 'models/viper.json',
                name: 'enemy_viper_1',
                scale: 0.6,
                position: {
                    x: playerPosition.x - 80,
                    y: playerPosition.y - 10,
                    z: playerPosition.z + 120
                },
                enemyType: 'interceptor',
                health: 60,
                speed: 20,
                weaponRange: 60
            }
        ];

        return configs;
    }
}

// Initialize Oolite loader when the game starts
let ooliteLoader = null;

function initOoliteLoader(scene) {
    ooliteLoader = new OoliteModelLoader(scene);
    console.log('Oolite model loader initialized');
    return ooliteLoader;
}

function getOoliteLoader() {
    return ooliteLoader;
}

// Example usage function
async function loadEnemyFleet() {
    if (!ooliteLoader) {
        console.warn('Oolite loader not initialized');
        return;
    }

    try {
        const playerSub = window.playerSubmarine();
        if (!playerSub) {
            console.warn('Player submarine not found');
            return;
        }

        const playerPos = playerSub.getPosition();
        const fleetConfig = OoliteModelLoader.createEnemyFleetConfig(playerPos);

        const fleet = await ooliteLoader.loadFleet(fleetConfig);
        console.log(`Enemy fleet loaded with ${fleet.length} ships`);

        return fleet;

    } catch (error) {
        console.error('Error loading enemy fleet:', error);
    }
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.OoliteModelLoader = OoliteModelLoader;
    window.initOoliteLoader = initOoliteLoader;
    window.getOoliteLoader = getOoliteLoader;
    window.loadEnemyFleet = loadEnemyFleet;
}

// Export for Node.js use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        OoliteModelLoader,
        initOoliteLoader,
        getOoliteLoader,
        loadEnemyFleet
    };
}
