// Oolite .dat File Parser and Three.js Converter
// Converts Oolite ship models to Three.js compatible format

class OoliteDatParser {
    constructor() {
        this.vertices = [];
        this.faces = [];
        this.normals = [];
        this.textures = [];
        this.materials = [];
        this.modelName = '';
        this.maxX = 0;
        this.maxY = 0;
        this.maxZ = 0;
    }

    /**
     * Parse an Oolite .dat file content
     * @param {string} datContent - The content of the .dat file
     * @returns {Object} Parsed model data
     */
    parse(datContent) {
        const lines = datContent.split('\n').map(line => line.trim());
        let currentSection = '';

        console.log(`Parsing .dat file with ${lines.length} lines`);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Skip empty lines and comments
            if (!line || line.startsWith('//') || line.startsWith('#')) {
                continue;
            }

            // Detect sections
            if (line.toUpperCase().includes('NVERTS')) {
                currentSection = 'VERTICES';
                const vertexCount = parseInt(line.match(/\d+/)[0]);
                console.log(`Expected vertices: ${vertexCount}`);
                continue;
            }

            if (line.toUpperCase().includes('NFACES')) {
                currentSection = 'FACES';
                const faceCount = parseInt(line.match(/\d+/)[0]);
                console.log(`Expected faces: ${faceCount}`);
                continue;
            }

            if (line.toUpperCase().includes('VERTEX')) {
                currentSection = 'VERTICES';
                continue;
            }

            if (line.toUpperCase().includes('FACES')) {
                currentSection = 'FACES';
                continue;
            }

            if (line.toUpperCase().includes('TEXTURES')) {
                currentSection = 'TEXTURES';
                continue;
            }

            // Parse content based on current section
            if (currentSection === 'VERTICES') {
                this.parseVertex(line);
            } else if (currentSection === 'FACES') {
                this.parseFace(line);
            } else if (currentSection === 'TEXTURES') {
                this.parseTexture(line);
            }
        }

        console.log(`Parsed: ${this.vertices.length} vertices, ${this.faces.length} faces`);

        // Calculate model bounds
        this.calculateBounds();

        return this.toThreeJSFormat();
    }

    /**
     * Parse a vertex line (x, y, z coordinates)
     */
    parseVertex(line) {
        // Oolite format: x, y, z (comma or space separated)
        const coords = line.split(/[,\s]+/).filter(val => val && !isNaN(parseFloat(val)));

        if (coords.length >= 3) {
            const x = parseFloat(coords[0]);
            const y = parseFloat(coords[1]);
            const z = parseFloat(coords[2]);

            this.vertices.push({
                x: x,
                y: y,
                z: z,
                index: this.vertices.length
            });

            // Track bounds
            this.maxX = Math.max(this.maxX, Math.abs(x));
            this.maxY = Math.max(this.maxY, Math.abs(y));
            this.maxZ = Math.max(this.maxZ, Math.abs(z));
        }
    }

    /**
     * Parse a face line (vertex indices and properties)
     */
    parseFace(line) {
        // Oolite format varies, but commonly: color, normal_x, normal_y, normal_z, v1, v2, v3, [v4]
        const parts = line.split(/[,\s]+/).filter(val => val);

        if (parts.length < 7) return; // Need at least color + normal + 3 vertices

        let colorIndex = 0;
        let normalIndex = 1;
        let vertexStartIndex = 4;

        // Try to parse as numbers
        const nums = parts.map(p => parseFloat(p)).filter(n => !isNaN(n));

        if (nums.length >= 7) {
            const face = {
                color: nums[0],
                normal: {
                    x: nums[1],
                    y: nums[2],
                    z: nums[3]
                },
                vertices: []
            };

            // Get vertex indices (usually 3 or 4 vertices per face)
            for (let i = 4; i < nums.length && face.vertices.length < 4; i++) {
                const vertexIndex = Math.floor(nums[i]);
                if (vertexIndex >= 0 && vertexIndex < this.vertices.length) {
                    face.vertices.push(vertexIndex);
                }
            }

            if (face.vertices.length >= 3) {
                this.faces.push(face);
            }
        }
    }

    /**
     * Parse texture information
     */
    parseTexture(line) {
        // Basic texture parsing - Oolite texture format varies
        if (line.includes('.png') || line.includes('.jpg') || line.includes('.tga')) {
            this.textures.push({
                name: line.trim(),
                path: line.trim()
            });
        }
    }

    /**
     * Calculate model bounds for scaling
     */
    calculateBounds() {
        this.bounds = {
            maxX: this.maxX,
            maxY: this.maxY,
            maxZ: this.maxZ,
            maxDimension: Math.max(this.maxX, this.maxY, this.maxZ)
        };

        console.log('Model bounds:', this.bounds);
    }

    /**
     * Convert parsed data to Three.js compatible format
     */
    toThreeJSFormat() {
        const vertices = [];
        const indices = [];
        const normals = [];
        const colors = [];

        // Convert vertices to flat array
        this.vertices.forEach(vertex => {
            vertices.push(vertex.x, vertex.y, vertex.z);
        });

        // Convert faces to triangles
        this.faces.forEach(face => {
            if (face.vertices.length === 3) {
                // Triangle
                indices.push(face.vertices[0], face.vertices[1], face.vertices[2]);

                // Add normals for each vertex (same normal for the face)
                for (let i = 0; i < 3; i++) {
                    normals.push(face.normal.x, face.normal.y, face.normal.z);
                }

                // Add colors (convert Oolite color index to RGB)
                const rgb = this.colorIndexToRGB(face.color);
                for (let i = 0; i < 3; i++) {
                    colors.push(rgb.r, rgb.g, rgb.b);
                }

            } else if (face.vertices.length === 4) {
                // Quad - split into two triangles
                // Triangle 1: 0,1,2
                indices.push(face.vertices[0], face.vertices[1], face.vertices[2]);
                // Triangle 2: 0,2,3
                indices.push(face.vertices[0], face.vertices[2], face.vertices[3]);

                // Add normals for both triangles
                for (let i = 0; i < 6; i++) {
                    normals.push(face.normal.x, face.normal.y, face.normal.z);
                }

                // Add colors for both triangles
                const rgb = this.colorIndexToRGB(face.color);
                for (let i = 0; i < 6; i++) {
                    colors.push(rgb.r, rgb.g, rgb.b);
                }
            }
        });

        return {
            vertices: new Float32Array(vertices),
            indices: new Uint16Array(indices),
            normals: new Float32Array(normals),
            colors: new Float32Array(colors),
            bounds: this.bounds,
            textures: this.textures,
            metadata: {
                originalVertexCount: this.vertices.length,
                originalFaceCount: this.faces.length,
                triangleCount: indices.length / 3,
                hasTextures: this.textures.length > 0
            }
        };
    }

    /**
     * Convert Oolite color index to RGB values
     */
    colorIndexToRGB(colorIndex) {
        // Oolite standard colors (approximation)
        const colors = [
            {r: 1.0, g: 1.0, b: 1.0}, // 0: White
            {r: 1.0, g: 0.0, b: 0.0}, // 1: Red
            {r: 0.0, g: 1.0, b: 0.0}, // 2: Green
            {r: 0.0, g: 0.0, b: 1.0}, // 3: Blue
            {r: 1.0, g: 1.0, b: 0.0}, // 4: Yellow
            {r: 1.0, g: 0.0, b: 1.0}, // 5: Magenta
            {r: 0.0, g: 1.0, b: 1.0}, // 6: Cyan
            {r: 0.5, g: 0.5, b: 0.5}, // 7: Gray
            {r: 0.8, g: 0.4, b: 0.2}, // 8: Orange
            {r: 0.6, g: 0.3, b: 0.1}  // 9: Brown
        ];

        const index = Math.floor(colorIndex) % colors.length;
        return colors[index];
    }

    /**
     * Create Three.js geometry from parsed data
     */
    createThreeJSGeometry(data) {
        const geometry = new THREE.BufferGeometry();

        // Set vertices
        geometry.setAttribute('position', new THREE.BufferAttribute(data.vertices, 3));

        // Set indices
        geometry.setIndex(new THREE.BufferAttribute(data.indices, 1));

        // Set normals
        geometry.setAttribute('normal', new THREE.BufferAttribute(data.normals, 3));

        // Set colors
        geometry.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));

        // Compute bounding sphere
        geometry.computeBoundingSphere();

        return geometry;
    }

    /**
     * Create Three.js material
     */
    createThreeJSMaterial(data) {
        return new THREE.MeshLambertMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            wireframe: false
        });
    }

    /**
     * Scale model to fit within specified bounds
     */
    scaleModelData(data, maxSize = 10) {
        const scale = maxSize / data.bounds.maxDimension;

        // Scale vertices
        for (let i = 0; i < data.vertices.length; i++) {
            data.vertices[i] *= scale;
        }

        // Update bounds
        data.bounds.maxX *= scale;
        data.bounds.maxY *= scale;
        data.bounds.maxZ *= scale;
        data.bounds.maxDimension *= scale;

        console.log(`Scaled model by factor ${scale} to max dimension ${maxSize}`);

        return data;
    }
}

/**
 * Utility function to load and parse a .dat file
 */
async function loadAndParseDatFile(filePath, maxSize = 10) {
    try {
        const fs = require('fs');
        const datContent = fs.readFileSync(filePath, 'utf8');

        console.log(`Loading .dat file: ${filePath}`);

        const parser = new OoliteDatParser();
        let modelData = parser.parse(datContent);

        // Scale model to reasonable size
        modelData = parser.scaleModelData(modelData, maxSize);

        return modelData;

    } catch (error) {
        console.error('Error loading .dat file:', error);
        throw error;
    }
}

/**
 * Convert .dat file to JSON format for easy loading
 */
function convertDatToJSON(inputPath, outputPath, maxSize = 10) {
    return loadAndParseDatFile(inputPath, maxSize)
        .then(modelData => {
            const fs = require('fs');

            // Convert typed arrays to regular arrays for JSON serialization
            const jsonData = {
                vertices: Array.from(modelData.vertices),
                indices: Array.from(modelData.indices),
                normals: Array.from(modelData.normals),
                colors: Array.from(modelData.colors),
                bounds: modelData.bounds,
                textures: modelData.textures,
                metadata: modelData.metadata
            };

            fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
            console.log(`Converted model saved to: ${outputPath}`);

            return jsonData;
        });
}

// Export for Node.js and browser use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        OoliteDatParser,
        loadAndParseDatFile,
        convertDatToJSON
    };
} else if (typeof window !== 'undefined') {
    window.OoliteDatParser = OoliteDatParser;
    window.loadAndParseDatFile = loadAndParseDatFile;
    window.convertDatToJSON = convertDatToJSON;
}
