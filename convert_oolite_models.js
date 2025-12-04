#!/usr/bin/env node

// Command-line tool for converting Oolite .dat files to Three.js format
// Usage: node convert_oolite_models.js [input.dat] [output.json] [options]

const fs = require('fs');
const path = require('path');

// Import the parser
const { OoliteDatParser, convertDatToJSON } = require('./oolite_dat_parser.js');

class OoliteConverter {
    constructor() {
        this.processedCount = 0;
        this.errorCount = 0;
        this.outputDir = 'models/';
    }

    /**
     * Convert a single .dat file
     */
    async convertSingle(inputPath, outputPath = null, options = {}) {
        const { maxSize = 10, verbose = false } = options;

        if (!outputPath) {
            const baseName = path.basename(inputPath, '.dat');
            outputPath = path.join(this.outputDir, `${baseName}.json`);
        }

        try {
            // Ensure output directory exists
            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            if (verbose) {
                console.log(`Converting: ${inputPath} -> ${outputPath}`);
            }

            await convertDatToJSON(inputPath, outputPath, maxSize);
            this.processedCount++;

            return { success: true, outputPath };

        } catch (error) {
            console.error(`Error converting ${inputPath}:`, error.message);
            this.errorCount++;
            return { success: false, error: error.message };
        }
    }

    /**
     * Convert multiple .dat files from a directory
     */
    async convertBatch(inputDir, options = {}) {
        const { maxSize = 10, verbose = false, pattern = '*.dat' } = options;

        if (!fs.existsSync(inputDir)) {
            throw new Error(`Input directory not found: ${inputDir}`);
        }

        // Find all .dat files
        const files = fs.readdirSync(inputDir)
            .filter(file => file.toLowerCase().endsWith('.dat'))
            .map(file => path.join(inputDir, file));

        if (files.length === 0) {
            console.log('No .dat files found in directory');
            return;
        }

        console.log(`Found ${files.length} .dat files to convert`);

        const results = [];

        for (const filePath of files) {
            const result = await this.convertSingle(filePath, null, { maxSize, verbose });
            results.push({ file: filePath, ...result });
        }

        // Summary
        console.log('\nConversion complete:');
        console.log(`- Successful: ${this.processedCount}`);
        console.log(`- Failed: ${this.errorCount}`);
        console.log(`- Output directory: ${this.outputDir}`);

        return results;
    }

    /**
     * Download and convert popular Oolite ship models
     */
    async downloadPopularModels() {
        // List of popular Oolite ship models (URLs would need to be real)
        const popularShips = [
            {
                name: 'Cobra Mark III',
                url: 'https://example.com/cobra3.dat',
                file: 'cobra3.dat'
            },
            {
                name: 'Viper Interceptor',
                url: 'https://example.com/viper.dat',
                file: 'viper.dat'
            },
            {
                name: 'Asp Explorer',
                url: 'https://example.com/asp.dat',
                file: 'asp.dat'
            },
            {
                name: 'Anaconda',
                url: 'https://example.com/anaconda.dat',
                file: 'anaconda.dat'
            }
        ];

        console.log('Note: This function requires real URLs to Oolite model repositories');
        console.log('Popular Oolite ships you can manually download and convert:');

        popularShips.forEach(ship => {
            console.log(`- ${ship.name} (${ship.file})`);
        });

        console.log('\nRecommended sources:');
        console.log('- Oolite.org ship library');
        console.log('- Elite-style model repositories');
        console.log('- Open source game asset collections');
    }

    /**
     * Create sample .dat file for testing
     */
    createSampleDatFile(outputPath) {
        // Simple pyramid model in Oolite .dat format
        const sampleDat = `// Sample Oolite ship model - Simple Pyramid
// This is a basic pyramid for testing the parser

NVERTS 5

// Vertices (x, y, z)
0.0, 10.0, 0.0
-5.0, 0.0, -5.0  
5.0, 0.0, -5.0
5.0, 0.0, 5.0
-5.0, 0.0, 5.0

NFACES 6

// Faces: color, normal_x, normal_y, normal_z, v1, v2, v3, [v4]
// Base (quad)
1, 0.0, -1.0, 0.0, 1, 4, 3, 2
// Side faces (triangles)  
2, -0.707, 0.707, -0.707, 0, 1, 2
3, 0.707, 0.707, -0.707, 0, 2, 3  
4, 0.707, 0.707, 0.707, 0, 3, 4
5, -0.707, 0.707, 0.707, 0, 4, 1
`;

        fs.writeFileSync(outputPath, sampleDat);
        console.log(`Sample .dat file created: ${outputPath}`);
    }

    /**
     * Validate converted model
     */
    validateModel(jsonPath) {
        try {
            const modelData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

            const validation = {
                hasVertices: Array.isArray(modelData.vertices) && modelData.vertices.length > 0,
                hasIndices: Array.isArray(modelData.indices) && modelData.indices.length > 0,
                hasNormals: Array.isArray(modelData.normals) && modelData.normals.length > 0,
                hasColors: Array.isArray(modelData.colors) && modelData.colors.length > 0,
                hasBounds: modelData.bounds && typeof modelData.bounds === 'object',
                hasMetadata: modelData.metadata && typeof modelData.metadata === 'object',
                vertexCount: modelData.vertices.length / 3,
                triangleCount: modelData.indices.length / 3
            };

            const isValid = validation.hasVertices && validation.hasIndices &&
                           validation.hasNormals && validation.hasColors;

            console.log(`Model validation for ${jsonPath}:`);
            console.log(`- Valid: ${isValid ? 'YES' : 'NO'}`);
            console.log(`- Vertices: ${validation.vertexCount}`);
            console.log(`- Triangles: ${validation.triangleCount}`);
            console.log(`- Bounds: ${validation.hasBounds ? 'YES' : 'NO'}`);

            return { isValid, ...validation };

        } catch (error) {
            console.error(`Error validating model ${jsonPath}:`, error.message);
            return { isValid: false, error: error.message };
        }
    }
}

// Command-line interface
function main() {
    const args = process.argv.slice(2);
    const converter = new OoliteConverter();

    if (args.length === 0) {
        console.log(`
Oolite Model Converter for Sub War 2060

Usage:
  node convert_oolite_models.js <input.dat> [output.json] [--maxsize=10] [--verbose]
  node convert_oolite_models.js --batch <input_dir> [--maxsize=10] [--verbose]  
  node convert_oolite_models.js --sample <output.dat>
  node convert_oolite_models.js --validate <model.json>
  node convert_oolite_models.js --popular

Options:
  --maxsize=N    Scale model to maximum dimension of N units (default: 10)
  --verbose      Show detailed output
  --batch        Convert all .dat files in directory
  --sample       Create a sample .dat file for testing
  --validate     Validate a converted JSON model
  --popular      List popular Oolite ships to download

Examples:
  node convert_oolite_models.js cobra3.dat
  node convert_oolite_models.js --batch ./oolite_ships/ --maxsize=15
  node convert_oolite_models.js --sample test_pyramid.dat
`);
        return;
    }

    const options = {
        maxSize: 10,
        verbose: false
    };

    // Parse options
    args.forEach(arg => {
        if (arg.startsWith('--maxsize=')) {
            options.maxSize = parseFloat(arg.split('=')[1]) || 10;
        } else if (arg === '--verbose') {
            options.verbose = true;
        }
    });

    // Handle commands
    if (args.includes('--batch')) {
        const dirIndex = args.indexOf('--batch') + 1;
        const inputDir = args[dirIndex];

        if (!inputDir) {
            console.error('Error: --batch requires input directory');
            return;
        }

        converter.convertBatch(inputDir, options)
            .catch(error => console.error('Batch conversion failed:', error));

    } else if (args.includes('--sample')) {
        const outputIndex = args.indexOf('--sample') + 1;
        const outputPath = args[outputIndex] || 'sample_pyramid.dat';
        converter.createSampleDatFile(outputPath);

    } else if (args.includes('--validate')) {
        const jsonIndex = args.indexOf('--validate') + 1;
        const jsonPath = args[jsonIndex];

        if (!jsonPath) {
            console.error('Error: --validate requires JSON file path');
            return;
        }

        converter.validateModel(jsonPath);

    } else if (args.includes('--popular')) {
        converter.downloadPopularModels();

    } else {
        // Single file conversion
        const inputPath = args[0];
        const outputPath = args[1];

        if (!fs.existsSync(inputPath)) {
            console.error(`Error: Input file not found: ${inputPath}`);
            return;
        }

        converter.convertSingle(inputPath, outputPath, options)
            .then(result => {
                if (result.success) {
                    console.log(`Conversion successful: ${result.outputPath}`);

                    // Auto-validate
                    converter.validateModel(result.outputPath);
                } else {
                    console.error(`Conversion failed: ${result.error}`);
                }
            })
            .catch(error => console.error('Conversion error:', error));
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { OoliteConverter };
