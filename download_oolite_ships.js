#!/usr/bin/env node

// Oolite Ship Downloader for Sub War 2060
// Helps locate and download popular Oolite ship models

const fs = require('fs');
const path = require('path');
const https = require('https');

class OoliteShipDownloader {
    constructor() {
        this.modelsDir = './models/';
        this.downloadedCount = 0;
        this.failedCount = 0;

        // Ensure models directory exists
        if (!fs.existsSync(this.modelsDir)) {
            fs.mkdirSync(this.modelsDir, { recursive: true });
        }
    }

    /**
     * List of popular Oolite ships with known sources
     */
    getPopularShips() {
        return {
            // Core Oolite ships (from main repository)
            'cobra3': {
                name: 'Cobra Mark III',
                description: 'Iconic Elite ship - versatile medium fighter',
                type: 'fighter',
                github: 'https://raw.githubusercontent.com/OoliteProject/oolite/master/Resources/Models/cobra3-player.dat',
                alternative: 'https://raw.githubusercontent.com/OoliteProject/oolite/master/Resources/Models/cobra3.dat'
            },
            'viper': {
                name: 'Viper Interceptor',
                description: 'Fast police interceptor',
                type: 'interceptor',
                github: 'https://raw.githubusercontent.com/OoliteProject/oolite/master/Resources/Models/viper.dat'
            },
            'asp': {
                name: 'Asp Explorer',
                description: 'Long-range exploration ship',
                type: 'explorer',
                github: 'https://raw.githubusercontent.com/OoliteProject/oolite/master/Resources/Models/asp.dat'
            },
            'anaconda': {
                name: 'Anaconda',
                description: 'Large transport/cargo ship',
                type: 'transport',
                github: 'https://raw.githubusercontent.com/OoliteProject/oolite/master/Resources/Models/anaconda.dat'
            },
            'sidewinder': {
                name: 'Sidewinder',
                description: 'Small starter ship',
                type: 'light_fighter',
                github: 'https://raw.githubusercontent.com/OoliteProject/oolite/master/Resources/Models/sidewinder.dat'
            },
            'krait': {
                name: 'Krait',
                description: 'Medium fighter',
                type: 'fighter',
                github: 'https://raw.githubusercontent.com/OoliteProject/oolite/master/Resources/Models/krait.dat'
            },
            'ferdelance': {
                name: 'Fer-de-Lance',
                description: 'High-performance fighter',
                type: 'fighter',
                github: 'https://raw.githubusercontent.com/OoliteProject/oolite/master/Resources/Models/ferdelance.dat'
            },
            'python': {
                name: 'Python',
                description: 'Heavy transport ship',
                type: 'transport',
                github: 'https://raw.githubusercontent.com/OoliteProject/oolite/master/Resources/Models/python.dat'
            }
        };
    }

    /**
     * Display available ships
     */
    listAvailableShips() {
        const ships = this.getPopularShips();

        console.log('🚢 Available Oolite Ships for Download:');
        console.log('=====================================');

        Object.entries(ships).forEach(([key, ship]) => {
            console.log(`\n📦 ${ship.name} (${key})`);
            console.log(`   Type: ${ship.type}`);
            console.log(`   Description: ${ship.description}`);
            console.log('   Source: GitHub/Oolite Project');
        });

        console.log('\n🎯 Usage:');
        console.log('  node download_oolite_ships.js --download cobra3 viper asp');
        console.log('  node download_oolite_ships.js --download-all');
        console.log('  node download_oolite_ships.js --check-sources');
    }

    /**
     * Download a single ship model
     */
    async downloadShip(shipKey) {
        const ships = this.getPopularShips();
        const ship = ships[shipKey];

        if (!ship) {
            console.error(`❌ Ship '${shipKey}' not found in database`);
            this.failedCount++;
            return false;
        }

        console.log(`📥 Downloading ${ship.name}...`);

        const filename = `${shipKey}.dat`;
        const filepath = path.join(this.modelsDir, filename);

        // Skip if already exists
        if (fs.existsSync(filepath)) {
            console.log(`⏭️  ${filename} already exists, skipping`);
            return true;
        }

        try {
            const url = ship.github;
            const success = await this.downloadFile(url, filepath);

            if (success) {
                console.log(`✅ Downloaded: ${filename}`);
                this.downloadedCount++;

                // Auto-convert to JSON
                await this.autoConvert(filepath);

                return true;
            } else if (ship.alternative) {
                console.log('🔄 Trying alternative URL...');
                const altSuccess = await this.downloadFile(ship.alternative, filepath);

                if (altSuccess) {
                    console.log(`✅ Downloaded: ${filename} (alternative source)`);
                    this.downloadedCount++;
                    await this.autoConvert(filepath);
                    return true;
                }
            }

            this.failedCount++;
            return false;

        } catch (error) {
            console.error(`❌ Error downloading ${ship.name}: ${error.message}`);
            this.failedCount++;
            return false;
        }
    }

    /**
     * Download file from URL
     */
    downloadFile(url, filepath) {
        return new Promise((resolve) => {
            const file = fs.createWriteStream(filepath);

            https.get(url, (response) => {
                if (response.statusCode === 200) {
                    response.pipe(file);

                    file.on('finish', () => {
                        file.close();
                        resolve(true);
                    });
                } else {
                    fs.unlink(filepath, () => {}); // Clean up
                    resolve(false);
                }
            }).on('error', () => {
                fs.unlink(filepath, () => {}); // Clean up
                resolve(false);
            });
        });
    }

    /**
     * Auto-convert downloaded .dat to JSON
     */
    async autoConvert(datPath) {
        try {
            const { convertDatToJSON } = require('./oolite_dat_parser.js');

            const baseName = path.basename(datPath, '.dat');
            const jsonPath = path.join(this.modelsDir, `${baseName}.json`);

            await convertDatToJSON(datPath, jsonPath, 12); // Scale to 12 units max
            console.log(`🔄 Auto-converted: ${baseName}.json`);

        } catch (error) {
            console.warn(`⚠️  Auto-conversion failed for ${datPath}: ${error.message}`);
        }
    }

    /**
     * Download multiple ships
     */
    async downloadShips(shipKeys) {
        console.log(`🚀 Starting download of ${shipKeys.length} ships...`);

        for (const shipKey of shipKeys) {
            await this.downloadShip(shipKey);
            // Small delay to be nice to servers
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.printSummary();
    }

    /**
     * Download all available ships
     */
    async downloadAll() {
        const ships = this.getPopularShips();
        const shipKeys = Object.keys(ships);

        console.log(`🚀 Downloading ALL ${shipKeys.length} available ships...`);
        await this.downloadShips(shipKeys);
    }

    /**
     * Check if sources are still valid
     */
    async checkSources() {
        console.log('🔍 Checking source URLs...');

        const ships = this.getPopularShips();

        for (const [key, ship] of Object.entries(ships)) {
            const status = await this.checkUrl(ship.github);
            const statusIcon = status ? '✅' : '❌';
            console.log(`${statusIcon} ${ship.name}: ${ship.github}`);
        }
    }

    /**
     * Check if URL is accessible
     */
    checkUrl(url) {
        return new Promise((resolve) => {
            https.get(url, (response) => {
                resolve(response.statusCode === 200);
            }).on('error', () => {
                resolve(false);
            });
        });
    }

    /**
     * Print download summary
     */
    printSummary() {
        console.log('\n📊 Download Summary:');
        console.log(`✅ Downloaded: ${this.downloadedCount}`);
        console.log(`❌ Failed: ${this.failedCount}`);
        console.log(`📁 Location: ${path.resolve(this.modelsDir)}`);

        if (this.downloadedCount > 0) {
            console.log('\n🎮 Ready to use in game!');
            console.log('Press O in game to spawn enemy ships');
        }
    }

    /**
     * Show manual download instructions
     */
    showManualInstructions() {
        console.log(`
🔧 Manual Download Instructions:

1. **Official Oolite Repository**:
   Visit: https://github.com/OoliteProject/oolite/tree/master/Resources/Models
   Download: Right-click on .dat files → "Save link as"

2. **Oolite Shipyard**:
   Visit: https://www.oolite.org/shipyard/
   Browse ships and download .dat files

3. **Community Ships**:
   Visit: https://bb.oolite.space/
   Look for ship releases in forums

4. **Ship Pack Downloads**:
   Search for "Oolite OXP" files
   Extract .dat files from the Models/ folder

5. **Save Location**:
   Save all .dat files to: ${path.resolve(this.modelsDir)}

6. **Convert for Game**:
   Run: node convert_oolite_models.js --batch ${this.modelsDir}
`);
    }
}

// Command line interface
function main() {
    const args = process.argv.slice(2);
    const downloader = new OoliteShipDownloader();

    if (args.length === 0) {
        downloader.listAvailableShips();
        return;
    }

    if (args.includes('--download-all')) {
        downloader.downloadAll();

    } else if (args.includes('--download')) {
        const downloadIndex = args.indexOf('--download');
        const shipKeys = args.slice(downloadIndex + 1).filter(arg => !arg.startsWith('--'));

        if (shipKeys.length === 0) {
            console.error('❌ No ships specified for download');
            console.log('Usage: --download cobra3 viper asp');
            return;
        }

        downloader.downloadShips(shipKeys);

    } else if (args.includes('--check-sources')) {
        downloader.checkSources();

    } else if (args.includes('--manual')) {
        downloader.showManualInstructions();

    } else {
        console.log('❌ Unknown command. Use one of:');
        console.log('  --download <ships>   Download specific ships');
        console.log('  --download-all       Download all available ships');
        console.log('  --check-sources      Check if download URLs work');
        console.log('  --manual            Show manual download instructions');
    }
}

if (require.main === module) {
    main();
}

module.exports = { OoliteShipDownloader };
