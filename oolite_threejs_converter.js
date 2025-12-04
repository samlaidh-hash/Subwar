// Oolite to Three.js Exact Converter
// Converts Oolite ship models to precise Three.js BufferGeometry

class OoliteThreeJSConverter {
    constructor() {
        this.models = new Map();
    }

    /**
     * Convert Oolite JSON model data to Three.js BufferGeometry
     * @param {Object} ooliteData - Parsed Oolite model data (from cobra3.json)
     * @param {string} modelName - Name of the model
     * @returns {THREE.BufferGeometry} Three.js geometry
     */
    convertToThreeJS(ooliteData, modelName = 'unknown') {
        console.log(`🔄 Converting ${modelName} to Three.js format...`);

        // Validate input data
        if (!ooliteData.vertices || !ooliteData.indices) {
            throw new Error(`Invalid Oolite data for ${modelName}: missing vertices or indices`);
        }

        const geometry = new THREE.BufferGeometry();

        // Convert vertices - Oolite uses different coordinate system
        const vertices = new Float32Array(ooliteData.vertices.length);
        for (let i = 0; i < ooliteData.vertices.length; i += 3) {
            // Oolite coordinate system conversion:
            // Oolite: X=right, Y=up, Z=forward
            // Three.js: X=right, Y=up, Z=forward (same)
            // But we need to scale and potentially flip axes for game orientation

            vertices[i] = ooliteData.vertices[i];     // X (right)
            vertices[i + 1] = ooliteData.vertices[i + 1]; // Y (up)
            vertices[i + 2] = ooliteData.vertices[i + 2]; // Z (forward)
        }

        // Convert face indices - handle Oolite's face format
        const indices = new Uint16Array(this.convertFaceIndices(ooliteData.indices));

        // Set geometry attributes
        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        // Add normals if available, otherwise compute them
        if (ooliteData.normals && ooliteData.normals.length > 0) {
            const normals = new Float32Array(ooliteData.normals.length);
            for (let i = 0; i < ooliteData.normals.length; i++) {
                normals[i] = ooliteData.normals[i];
            }
            geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        } else {
            geometry.computeVertexNormals();
        }

        // Add UV coordinates if available
        if (ooliteData.textures && ooliteData.textures.length > 0) {
            const uvs = this.extractUVCoordinates(ooliteData.textures, ooliteData.vertices.length / 3);
            if (uvs.length > 0) {
                geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
            }
        }

        // Store model metadata
        geometry.userData = {
            originalName: modelName,
            originalVertexCount: ooliteData.metadata?.originalVertexCount || (ooliteData.vertices.length / 3),
            originalFaceCount: ooliteData.metadata?.originalFaceCount || (indices.length / 3),
            bounds: ooliteData.bounds || this.calculateBounds(vertices)
        };

        console.log(`✅ Converted ${modelName}: ${vertices.length / 3} vertices, ${indices.length / 3} triangles`);

        this.models.set(modelName, geometry);
        return geometry;
    }

    /**
     * Convert Oolite face indices to Three.js triangle indices
     * @param {Array} ooliteIndices - Original Oolite face indices
     * @returns {Array} Triangle indices for Three.js
     */
    convertFaceIndices(ooliteIndices) {
        const triangleIndices = [];

        // Oolite faces can be triangles or quads
        // The indices array contains face definitions
        for (let i = 0; i < ooliteIndices.length; i += 3) {
            // Each set of 3 indices in Oolite represents one triangle
            const a = ooliteIndices[i];
            const b = ooliteIndices[i + 1];
            const c = ooliteIndices[i + 2];

            // Validate indices
            if (a !== undefined && b !== undefined && c !== undefined) {
                triangleIndices.push(a, b, c);
            }
        }

        return triangleIndices;
    }

    /**
     * Extract UV coordinates from Oolite texture data
     * @param {Array} textureData - Oolite texture information
     * @param {number} vertexCount - Number of vertices
     * @returns {Array} UV coordinates
     */
    extractUVCoordinates(textureData, vertexCount) {
        const uvs = [];

        // Create basic UV mapping if specific UV data isn't available
        // This is a fallback - real UV data would come from the texture definitions
        for (let i = 0; i < vertexCount; i++) {
            uvs.push(0.5, 0.5); // Default UV coordinates
        }

        return uvs;
    }

    /**
     * Calculate bounding box for the geometry
     * @param {Float32Array} vertices - Vertex position data
     * @returns {Object} Bounding box information
     */
    calculateBounds(vertices) {
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            const z = vertices[i + 2];

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            minZ = Math.min(minZ, z);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            maxZ = Math.max(maxZ, z);
        }

        return {
            minX, minY, minZ,
            maxX, maxY, maxZ,
            maxDimension: Math.max(maxX - minX, maxY - minY, maxZ - minZ)
        };
    }

    /**
     * Load and convert an Oolite model from JSON file
     * @param {string} jsonPath - Path to the JSON model file
     * @param {string} modelName - Name identifier for the model
     * @returns {Promise<THREE.BufferGeometry>} Converted Three.js geometry
     */
    async loadModel(jsonPath, modelName) {
        try {
            console.log(`📁 Loading Oolite model: ${jsonPath}`);

            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`Failed to load ${jsonPath}: ${response.statusText}`);
            }

            const ooliteData = await response.json();
            return this.convertToThreeJS(ooliteData, modelName);

        } catch (error) {
            console.error(`❌ Failed to load Oolite model ${modelName}:`, error);
            throw error;
        }
    }

    /**
     * Create a Three.js mesh with converted Oolite geometry
     * @param {string} modelName - Name of the model to create mesh for
     * @param {THREE.Material} material - Material to apply to the mesh
     * @param {Object} options - Scaling and positioning options
     * @returns {THREE.Mesh} Three.js mesh
     */
    createMesh(modelName, material, options = {}) {
        const {
            scale = 1.0,
            position = { x: 0, y: 0, z: 0 },
            rotation = { x: 0, y: 0, z: 0 }
        } = options;

        const geometry = this.models.get(modelName);
        if (!geometry) {
            throw new Error(`Model ${modelName} not found. Load it first with loadModel().`);
        }

        const mesh = new THREE.Mesh(geometry, material);

        // Apply transformations
        mesh.scale.setScalar(scale);
        mesh.position.set(position.x, position.y, position.z);
        mesh.rotation.set(rotation.x, rotation.y, rotation.z);

        // Add model metadata
        mesh.userData = {
            modelName: modelName,
            originalBounds: geometry.userData.bounds,
            isOoliteModel: true
        };

        return mesh;
    }

    /**
     * Get list of loaded models
     * @returns {Array} Array of model names
     */
    getLoadedModels() {
        return Array.from(this.models.keys());
    }

    /**
     * Get geometry for a specific model
     * @param {string} modelName - Name of the model
     * @returns {THREE.BufferGeometry} The geometry
     */
    getGeometry(modelName) {
        return this.models.get(modelName);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OoliteThreeJSConverter;
} else {
    window.OoliteThreeJSConverter = OoliteThreeJSConverter;
}

console.log('🚢 Oolite to Three.js converter loaded');