// Test script for Oolite model system integration with Sub War 2060
// Tests parser, converter, and Three.js loader

const { OoliteDatParser, convertDatToJSON } = require('./oolite_dat_parser.js');
const { OoliteConverter } = require('./convert_oolite_models.js');
const fs = require('fs');
const path = require('path');

class OoliteSystemTester {
    constructor() {
        this.testResults = [];
        this.modelsDir = './models/';
    }

    async runAllTests() {
        console.log('🧪 Starting Oolite System Tests...\n');

        try {
            // Test 1: Parser functionality
            await this.testParser();

            // Test 2: Converter functionality
            await this.testConverter();

            // Test 3: Model validation
            await this.testValidation();

            // Test 4: Integration test
            await this.testIntegration();

            // Summary
            this.printSummary();

        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    async testParser() {
        console.log('📝 Test 1: Parser Functionality');

        try {
            const datPath = path.join(this.modelsDir, 'test_ship.dat');

            if (!fs.existsSync(datPath)) {
                throw new Error('Test .dat file not found');
            }

            const datContent = fs.readFileSync(datPath, 'utf8');
            const parser = new OoliteDatParser();

            const modelData = parser.parse(datContent);

            // Validate parsed data
            const tests = [
                { name: 'Has vertices', condition: modelData.vertices.length > 0 },
                { name: 'Has indices', condition: modelData.indices.length > 0 },
                { name: 'Has normals', condition: modelData.normals.length > 0 },
                { name: 'Has colors', condition: modelData.colors.length > 0 },
                { name: 'Has bounds', condition: modelData.bounds !== undefined },
                { name: 'Has metadata', condition: modelData.metadata !== undefined },
                { name: 'Correct vertex count', condition: modelData.vertices.length === 18 }, // 6 vertices * 3 coords
                { name: 'Triangles generated', condition: modelData.indices.length > 0 }
            ];

            let passed = 0;
            tests.forEach(test => {
                if (test.condition) {
                    console.log(`  ✅ ${test.name}`);
                    passed++;
                } else {
                    console.log(`  ❌ ${test.name}`);
                }
            });

            console.log(`  📊 Parser: ${passed}/${tests.length} tests passed\n`);

            this.testResults.push({
                name: 'Parser',
                passed: passed,
                total: tests.length,
                success: passed === tests.length
            });

        } catch (error) {
            console.error(`  ❌ Parser test failed: ${error.message}\n`);
            this.testResults.push({ name: 'Parser', passed: 0, total: 1, success: false });
        }
    }

    async testConverter() {
        console.log('🔄 Test 2: Converter Functionality');

        try {
            const converter = new OoliteConverter();
            const inputPath = path.join(this.modelsDir, 'test_ship.dat');
            const outputPath = path.join(this.modelsDir, 'test_ship.json');

            const result = await converter.convertSingle(inputPath, outputPath, {
                maxSize: 8,
                verbose: true
            });

            if (!result.success) {
                throw new Error(result.error);
            }

            // Verify output file exists and is valid JSON
            if (!fs.existsSync(outputPath)) {
                throw new Error('Output JSON file was not created');
            }

            const jsonData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

            const tests = [
                { name: 'JSON file created', condition: fs.existsSync(outputPath) },
                { name: 'Valid JSON format', condition: jsonData !== null },
                { name: 'Has vertex array', condition: Array.isArray(jsonData.vertices) },
                { name: 'Has indices array', condition: Array.isArray(jsonData.indices) },
                { name: 'Has bounds object', condition: jsonData.bounds && typeof jsonData.bounds === 'object' },
                { name: 'Has metadata', condition: jsonData.metadata && typeof jsonData.metadata === 'object' },
                { name: 'Model scaled correctly', condition: jsonData.bounds.maxDimension <= 8.1 } // Allow small margin
            ];

            let passed = 0;
            tests.forEach(test => {
                if (test.condition) {
                    console.log(`  ✅ ${test.name}`);
                    passed++;
                } else {
                    console.log(`  ❌ ${test.name}`);
                }
            });

            console.log(`  📊 Converter: ${passed}/${tests.length} tests passed\n`);

            this.testResults.push({
                name: 'Converter',
                passed: passed,
                total: tests.length,
                success: passed === tests.length
            });

        } catch (error) {
            console.error(`  ❌ Converter test failed: ${error.message}\n`);
            this.testResults.push({ name: 'Converter', passed: 0, total: 1, success: false });
        }
    }

    async testValidation() {
        console.log('✅ Test 3: Model Validation');

        try {
            const converter = new OoliteConverter();
            const jsonPath = path.join(this.modelsDir, 'test_ship.json');

            const validation = converter.validateModel(jsonPath);

            const tests = [
                { name: 'Model is valid', condition: validation.isValid },
                { name: 'Has vertices', condition: validation.hasVertices },
                { name: 'Has indices', condition: validation.hasIndices },
                { name: 'Has normals', condition: validation.hasNormals },
                { name: 'Has colors', condition: validation.hasColors },
                { name: 'Vertex count > 0', condition: validation.vertexCount > 0 },
                { name: 'Triangle count > 0', condition: validation.triangleCount > 0 }
            ];

            let passed = 0;
            tests.forEach(test => {
                if (test.condition) {
                    console.log(`  ✅ ${test.name}`);
                    passed++;
                } else {
                    console.log(`  ❌ ${test.name}`);
                }
            });

            console.log(`  📊 Validation: ${passed}/${tests.length} tests passed\n`);

            this.testResults.push({
                name: 'Validation',
                passed: passed,
                total: tests.length,
                success: passed === tests.length
            });

        } catch (error) {
            console.error(`  ❌ Validation test failed: ${error.message}\n`);
            this.testResults.push({ name: 'Validation', passed: 0, total: 1, success: false });
        }
    }

    async testIntegration() {
        console.log('🔗 Test 4: Integration Test');

        try {
            // Test if all required files exist
            const requiredFiles = [
                'js/oolite_loader.js',
                'oolite_dat_parser.js',
                'convert_oolite_models.js',
                'models/test_ship.json'
            ];

            const tests = [];

            requiredFiles.forEach(file => {
                const exists = fs.existsSync(file);
                tests.push({
                    name: `File exists: ${file}`,
                    condition: exists
                });
            });

            // Test HTML integration
            const indexHtml = fs.readFileSync('index.html', 'utf8');
            tests.push({
                name: 'oolite_loader.js included in HTML',
                condition: indexHtml.includes('oolite_loader.js')
            });

            let passed = 0;
            tests.forEach(test => {
                if (test.condition) {
                    console.log(`  ✅ ${test.name}`);
                    passed++;
                } else {
                    console.log(`  ❌ ${test.name}`);
                }
            });

            console.log(`  📊 Integration: ${passed}/${tests.length} tests passed\n`);

            this.testResults.push({
                name: 'Integration',
                passed: passed,
                total: tests.length,
                success: passed === tests.length
            });

        } catch (error) {
            console.error(`  ❌ Integration test failed: ${error.message}\n`);
            this.testResults.push({ name: 'Integration', passed: 0, total: 1, success: false });
        }
    }

    printSummary() {
        console.log('📋 Test Summary');
        console.log('================');

        let totalPassed = 0;
        let totalTests = 0;
        let allSuccess = true;

        this.testResults.forEach(result => {
            const status = result.success ? '✅' : '❌';
            console.log(`${status} ${result.name}: ${result.passed}/${result.total}`);
            totalPassed += result.passed;
            totalTests += result.total;
            if (!result.success) allSuccess = false;
        });

        console.log('================');
        console.log(`📊 Overall: ${totalPassed}/${totalTests} tests passed`);

        if (allSuccess) {
            console.log('🎉 All tests passed! Oolite system is ready for use.');
            console.log('\n🚀 Next steps:');
            console.log('1. Download real Oolite .dat files');
            console.log('2. Convert them using: node convert_oolite_models.js ship.dat');
            console.log('3. Load them in game using: loadEnemyFleet()');
        } else {
            console.log('⚠️  Some tests failed. Please check the issues above.');
        }
    }

    // Create additional test models
    createTestModels() {
        console.log('Creating additional test models...');

        // Simple cube
        const cubeData = `// Simple Cube
NVERTS 8
-1, -1, -1
1, -1, -1  
1, 1, -1
-1, 1, -1
-1, -1, 1
1, -1, 1
1, 1, 1
-1, 1, 1

NFACES 12
// Front face (2 triangles)
1, 0, 0, -1, 0, 1, 2
1, 0, 0, -1, 0, 2, 3
// Back face
2, 0, 0, 1, 4, 7, 6
2, 0, 0, 1, 4, 6, 5
// Left face  
3, -1, 0, 0, 0, 4, 5
3, -1, 0, 0, 0, 5, 1
// Right face
4, 1, 0, 0, 2, 6, 7
4, 1, 0, 0, 2, 7, 3
// Top face
5, 0, 1, 0, 3, 7, 6
5, 0, 1, 0, 3, 6, 2
// Bottom face
6, 0, -1, 0, 0, 5, 4
6, 0, -1, 0, 0, 1, 5`;

        fs.writeFileSync(path.join(this.modelsDir, 'test_cube.dat'), cubeData);
        console.log('Created test_cube.dat');
    }
}

// Run tests
async function main() {
    const tester = new OoliteSystemTester();

    // Create additional test models
    tester.createTestModels();

    // Run all tests
    await tester.runAllTests();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { OoliteSystemTester };
