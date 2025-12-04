// Convert ships from local Oolite installation
// Converts popular ships for Sub War 2060

const { convertDatToJSON } = require('./oolite_dat_parser.js');
const path = require('path');
const fs = require('fs');

// Your Oolite installation path
const OOLITE_MODELS_PATH = 'D:\\GAMES\\OOLITE\\oolite.app\\Resources\\Models';

// Popular ships to convert with their desired game sizes
const POPULAR_SHIPS = {
    'cobra3_redux.dat': { name: 'Cobra Mark III', size: 12, type: 'medium_fighter' },
    'asp_redux.dat': { name: 'Asp Explorer', size: 15, type: 'explorer' },
    'anaconda_redux.dat': { name: 'Anaconda', size: 20, type: 'heavy_transport' },
    'adder_redux.dat': { name: 'Adder', size: 8, type: 'light_transport' },
    'boa_redux.dat': { name: 'Boa', size: 18, type: 'transport' },
    'boa2_redux.dat': { name: 'Boa Class Cruiser', size: 25, type: 'cruiser' },
    'constrictor_redux.dat': { name: 'Constrictor', size: 14, type: 'fighter' },
    'escpod_redux.dat': { name: 'Escape Pod', size: 3, type: 'pod' },
    'viper_redux.dat': { name: 'Viper Interceptor', size: 10, type: 'interceptor' },
    'sidewinder_redux.dat': { name: 'Sidewinder', size: 7, type: 'light_fighter' },
    'krait_redux.dat': { name: 'Krait', size: 11, type: 'fighter' },
    'mamba_redux.dat': { name: 'Mamba', size: 11, type: 'fighter' },
    'moray_redux.dat': { name: 'Moray Star Boat', size: 9, type: 'light_fighter' },
    'python_redux.dat': { name: 'Python', size: 16, type: 'heavy_transport' },
    'ferdelance_redux.dat': { name: 'Fer-de-Lance', size: 13, type: 'fighter' },
    'gecko_redux.dat': { name: 'Gecko', size: 8, type: 'light_fighter' },
    'iguana_redux.dat': { name: 'Iguana Trader', size: 12, type: 'trader' }
};

async function convertLocalShips() {
    console.log('🚢 Converting Oolite ships from local installation...');
    console.log(`📁 Source: ${OOLITE_MODELS_PATH}`);

    let converted = 0;
    let failed = 0;

    // Ensure models directory exists
    const modelsDir = './models/';
    if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true });
    }

    // Check if Oolite path exists
    if (!fs.existsSync(OOLITE_MODELS_PATH)) {
        console.error('❌ Oolite models directory not found!');
        console.error(`   Expected: ${OOLITE_MODELS_PATH}`);
        console.error('   Please update OOLITE_MODELS_PATH in this script');
        return;
    }

    for (const [filename, config] of Object.entries(POPULAR_SHIPS)) {
        const inputPath = path.join(OOLITE_MODELS_PATH, filename);
        const outputName = filename.replace('_redux.dat', '').replace('.dat', '') + '.json';
        const outputPath = path.join(modelsDir, outputName);

        try {
            if (!fs.existsSync(inputPath)) {
                console.log(`⏭️  Skipping ${filename} (not found)`);
                continue;
            }

            if (fs.existsSync(outputPath)) {
                console.log(`⏭️  ${outputName} already exists, skipping`);
                continue;
            }

            console.log(`🔄 Converting ${config.name}...`);

            await convertDatToJSON(inputPath, outputPath, config.size);

            // Add metadata to the JSON file
            const modelData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
            modelData.shipInfo = {
                name: config.name,
                type: config.type,
                originalFile: filename,
                gameSize: config.size
            };

            fs.writeFileSync(outputPath, JSON.stringify(modelData, null, 2));

            console.log(`✅ ${config.name} -> ${outputName}`);
            converted++;

        } catch (error) {
            console.error(`❌ Failed to convert ${config.name}: ${error.message}`);
            failed++;
        }
    }

    console.log('\n📊 Conversion Summary:');
    console.log(`✅ Successfully converted: ${converted} ships`);
    console.log(`❌ Failed: ${failed} ships`);
    console.log(`📁 Output directory: ${path.resolve(modelsDir)}`);

    if (converted > 0) {
        console.log('\n🎮 Ships ready for game!');
        console.log('Start your game and press O to spawn enemy fleet');

        // List converted ships by type
        const shipsByType = {};
        for (const [filename, config] of Object.entries(POPULAR_SHIPS)) {
            const outputName = filename.replace('_redux.dat', '').replace('.dat', '') + '.json';
            const outputPath = path.join(modelsDir, outputName);

            if (fs.existsSync(outputPath)) {
                if (!shipsByType[config.type]) shipsByType[config.type] = [];
                shipsByType[config.type].push(config.name);
            }
        }

        console.log('\n🎯 Available Ships by Type:');
        Object.entries(shipsByType).forEach(([type, ships]) => {
            console.log(`  ${type}: ${ships.join(', ')}`);
        });
    }
}

// Run if called directly
if (require.main === module) {
    convertLocalShips().catch(console.error);
}

module.exports = { convertLocalShips };
