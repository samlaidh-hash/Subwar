// Demo: Oolite Model Integration with Sub War 2060
// Shows how to load and use Oolite ships in the submarine game

class OoliteGameDemo {
    constructor() {
        this.ooliteLoader = null;
        this.enemyShips = [];
        this.demoRunning = false;
    }

    /**
     * Initialize the demo when the game loads
     */
    async initDemo() {
        console.log('🚀 Initializing Oolite Demo...');

        try {
            // Wait for game to be ready
            await this.waitForGame();

            // Initialize Oolite loader
            const scene = window.gameState?.scene;
            if (!scene) {
                throw new Error('Game scene not found');
            }

            this.ooliteLoader = window.initOoliteLoader(scene);
            console.log('✅ Oolite loader initialized');

            // Load test models
            await this.loadDemoModels();

            this.demoRunning = true;
            console.log('🎮 Oolite demo ready! Press O to spawn enemy ships');

            // Add key binding for demo
            this.addDemoControls();

        } catch (error) {
            console.error('❌ Demo initialization failed:', error);
        }
    }

    /**
     * Wait for game systems to be ready
     */
    async waitForGame() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;

            const checkGame = () => {
                attempts++;

                if (window.gameState?.scene && window.playerSubmarine) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Game failed to initialize within timeout'));
                } else {
                    setTimeout(checkGame, 100);
                }
            };

            checkGame();
        });
    }

    /**
     * Load demo models from converted JSON files
     */
    async loadDemoModels() {
        try {
            console.log('📦 Loading demo Oolite models...');

            // Load the test ship model
            const testShip = await this.ooliteLoader.loadModel('models/test_ship.json', {
                scale: 1.0,
                position: { x: 50, y: -20, z: 100 },
                rotation: { x: 0, y: Math.PI / 4, z: 0 },
                name: 'demo_test_ship'
            });

            // Add enemy behavior
            testShip.userData.enemyType = 'patrol';
            testShip.userData.health = 100;
            testShip.userData.patrolPath = true;
            testShip.userData.rotateSpeed = 0.5;
            testShip.userData.rotate = true;

            console.log('✅ Test ship loaded');

            // Convert and load cube model too
            await this.convertAndLoadCube();

        } catch (error) {
            console.error('❌ Error loading demo models:', error);
        }
    }

    /**
     * Convert the cube model and load it
     */
    async convertAndLoadCube() {
        try {
            // Convert cube.dat to JSON using our converter
            const { convertDatToJSON } = await import('./oolite_dat_parser.js');

            await convertDatToJSON('models/test_cube.dat', 'models/test_cube.json', 6);
            console.log('✅ Cube model converted');

            // Load the cube
            const cube = await this.ooliteLoader.loadModel('models/test_cube.json', {
                scale: 1.5,
                position: { x: -80, y: -30, z: 60 },
                rotation: { x: Math.PI / 6, y: 0, z: Math.PI / 8 },
                name: 'demo_cube_ship'
            });

            cube.userData.enemyType = 'guardian';
            cube.userData.health = 150;
            cube.userData.rotate = true;
            cube.userData.rotateSpeed = 0.3;

            console.log('✅ Cube ship loaded');

        } catch (error) {
            console.warn('⚠️ Could not load cube model:', error.message);
        }
    }

    /**
     * Spawn enemy fleet around player
     */
    async spawnEnemyFleet() {
        if (!this.ooliteLoader) {
            console.warn('Oolite loader not ready');
            return;
        }

        try {
            const playerSub = window.playerSubmarine();
            if (!playerSub) {
                console.warn('Player submarine not found');
                return;
            }

            const playerPos = playerSub.getPosition();
            console.log('🛸 Spawning enemy fleet around player...');

            // Create multiple enemy ships in formation
            const fleetConfigs = [
                {
                    path: 'models/test_ship.json',
                    name: 'enemy_ship_1',
                    scale: 1.2,
                    position: {
                        x: playerPos.x + 120,
                        y: playerPos.y + 30,
                        z: playerPos.z + 80
                    },
                    rotation: { x: 0, y: Math.PI, z: 0 },
                    enemyType: 'interceptor',
                    health: 80,
                    speed: 15
                },
                {
                    path: 'models/test_ship.json',
                    name: 'enemy_ship_2',
                    scale: 0.8,
                    position: {
                        x: playerPos.x - 100,
                        y: playerPos.y - 20,
                        z: playerPos.z + 150
                    },
                    rotation: { x: 0, y: Math.PI / 2, z: 0 },
                    enemyType: 'scout',
                    health: 60,
                    speed: 20
                },
                {
                    path: 'models/test_cube.json',
                    name: 'enemy_station',
                    scale: 2.0,
                    position: {
                        x: playerPos.x + 200,
                        y: playerPos.y,
                        z: playerPos.z + 200
                    },
                    rotation: { x: 0, y: 0, z: 0 },
                    enemyType: 'station',
                    health: 300,
                    speed: 0
                }
            ];

            const fleet = await this.ooliteLoader.loadFleet(fleetConfigs);
            this.enemyShips.push(...fleet);

            console.log(`✅ Spawned ${fleet.length} enemy ships`);

            // Add to sonar contacts for game integration
            this.addToSonarContacts(fleet);

        } catch (error) {
            console.error('❌ Error spawning fleet:', error);
        }
    }

    /**
     * Add spawned ships to sonar contacts system
     */
    addToSonarContacts(ships) {
        const sealifeSystem = window.sealifeSystem ? window.sealifeSystem() : null;
        if (!sealifeSystem) {
            console.warn('Sealife system not found');
            return;
        }

        ships.forEach(ship => {
            // Add as sonar contact
            const contact = {
                position: ship.position.clone(),
                mesh: ship,
                type: 'enemy_ship',
                classification: `${ship.userData.enemyType || 'Unknown'} (Oolite)`,
                distance: 0, // Will be calculated by sonar system
                bearing: 0,
                signature: 8 + Math.random() * 4, // Strong signature
                identified: false,
                isEnemy: true,
                health: ship.userData.health || 100
            };

            // Add to contacts (this integrates with existing sonar system)
            if (sealifeSystem.contacts) {
                sealifeSystem.contacts.push(contact);
            }
        });

        console.log(`🎯 Added ${ships.length} ships to sonar contacts`);
    }

    /**
     * Add demo key bindings
     */
    addDemoControls() {
        document.addEventListener('keydown', (event) => {
            if (!this.demoRunning) return;

            switch (event.code) {
            case 'KeyO':
                event.preventDefault();
                this.spawnEnemyFleet();
                break;

            case 'KeyK':
                event.preventDefault();
                this.clearEnemyShips();
                break;

            case 'KeyU':
                event.preventDefault();
                this.updateShipBehaviors();
                break;
            }
        });

        console.log('🎮 Demo controls added:');
        console.log('  O - Spawn enemy fleet');
        console.log('  K - Clear all enemies');
        console.log('  U - Update ship behaviors');
    }

    /**
     * Clear all enemy ships
     */
    clearEnemyShips() {
        if (!this.ooliteLoader) return;

        this.enemyShips.forEach(ship => {
            this.ooliteLoader.removeModel(ship);
        });

        this.enemyShips = [];
        console.log('🧹 Cleared all enemy ships');
    }

    /**
     * Update ship AI behaviors
     */
    updateShipBehaviors() {
        this.enemyShips.forEach(ship => {
            // Toggle rotation
            ship.userData.rotate = !ship.userData.rotate;
            ship.userData.rotateSpeed = Math.random() * 1.0 + 0.2;

            console.log(`🔄 Updated behavior for ${ship.name}`);
        });
    }

    /**
     * Update loop - call this from game loop
     */
    update(deltaTime) {
        if (!this.demoRunning || !this.ooliteLoader) return;

        // Update Oolite models
        this.ooliteLoader.updateModels(deltaTime);
    }

    /**
     * Show demo status
     */
    showStatus() {
        console.log('\n📊 Oolite Demo Status:');
        console.log(`- Running: ${this.demoRunning}`);
        console.log(`- Loader ready: ${this.ooliteLoader !== null}`);
        console.log(`- Enemy ships: ${this.enemyShips.length}`);
        console.log(`- Loaded models: ${this.ooliteLoader ? this.ooliteLoader.listModels().length : 0}`);

        if (this.ooliteLoader) {
            console.log('- Model names:', this.ooliteLoader.listModels());
        }
    }
}

// Create global demo instance
let ooliteDemo = null;

/**
 * Initialize Oolite demo - call this after game loads
 */
async function initOoliteDemo() {
    if (ooliteDemo) {
        console.log('Demo already initialized');
        return ooliteDemo;
    }

    ooliteDemo = new OoliteGameDemo();
    await ooliteDemo.initDemo();
    return ooliteDemo;
}

/**
 * Get demo instance
 */
function getOoliteDemo() {
    return ooliteDemo;
}

// Auto-initialize when page loads (with delay for game initialization)
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            initOoliteDemo().catch(error => {
                console.error('Auto-init failed:', error);
                console.log('You can manually initialize with: initOoliteDemo()');
            });
        }, 5000); // 5 second delay
    });

    // Export to global scope
    window.initOoliteDemo = initOoliteDemo;
    window.getOoliteDemo = getOoliteDemo;
    window.OoliteGameDemo = OoliteGameDemo;
}
