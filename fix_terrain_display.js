const { chromium } = require('playwright');

async function fixTerrainDisplay() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Open the game
        await page.goto('file://' + __dirname + '/index.html');
        console.log('Loading game...');
        await page.waitForTimeout(3000);

        // Select patrol mission
        console.log('Selecting patrol mission...');
        await page.click('[data-scenario="PATROL_MISSION"]');
        
        // Wait longer for full initialization
        console.log('Waiting for game initialization...');
        await page.waitForTimeout(5000);

        // Take initial screenshot
        await page.screenshot({ path: 'fix_attempt_1_initial.png', fullPage: true });
        
        console.log('=== CHECKING CURRENT TERRAIN STATE ===');
        
        // Check current terrain state
        const terrainState = await page.evaluate(() => {
            let info = {
                gameExists: !!window.game,
                terrainSystemExists: !!window.game?.terrainSystem,
                bathymetryLoaded: !!window.MONTEREY_CANYON_BATHYMETRY,
                terrainMesh: null,
                currentMode: 'unknown'
            };
            
            if (window.game && window.game.terrainSystem) {
                const terrain = window.game.terrainSystem;
                info.terrainMesh = {
                    exists: !!terrain.terrainMesh,
                    visible: terrain.terrainMesh ? terrain.terrainMesh.visible : false,
                    wireframe: terrain.terrainMesh ? terrain.terrainMesh.material.wireframe : null,
                    materialType: terrain.terrainMesh ? terrain.terrainMesh.material.type : null
                };
                
                // Try to determine current mode
                if (terrain.terrainMesh && terrain.terrainMesh.material) {
                    if (terrain.terrainMesh.material.wireframe) {
                        info.currentMode = 'wireframe';
                    } else {
                        info.currentMode = 'solid';
                    }
                }
            }
            
            return info;
        });
        
        console.log('Current terrain state:', JSON.stringify(terrainState, null, 2));
        
        if (!terrainState.gameExists || !terrainState.terrainSystemExists) {
            console.log('Game or terrain system not loaded. Waiting longer...');
            await page.waitForTimeout(3000);
        }
        
        // Try to force terrain into solid mode with bathymetric colors
        console.log('=== ATTEMPTING TERRAIN MODE FIXES ===');
        
        // Method 1: Press N for solid mode
        console.log('Trying N key (Terrain Solid Mode)...');
        await page.keyboard.press('n');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'fix_attempt_2_solid_mode.png', fullPage: true });
        
        // Method 2: Press B for bathymetric shader mode
        console.log('Trying B key (Terrain Shader Mode)...');
        await page.keyboard.press('b');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'fix_attempt_3_shader_mode.png', fullPage: true });
        
        // Method 3: Direct JavaScript intervention
        console.log('Trying direct JavaScript terrain fixing...');
        const directFix = await page.evaluate(() => {
            let results = [];
            
            try {
                if (window.game && window.game.terrainSystem && window.game.terrainSystem.terrainMesh) {
                    const terrain = window.game.terrainSystem;
                    
                    // Force wireframe off
                    terrain.terrainMesh.material.wireframe = false;
                    results.push('Set wireframe = false');
                    
                    // Try to apply bathymetric coloring if method exists
                    if (typeof terrain.applyBathymetricColorScheme === 'function') {
                        terrain.applyBathymetricColorScheme();
                        results.push('Applied bathymetric color scheme');
                    }
                    
                    // Try to regenerate terrain if method exists  
                    if (typeof terrain.regenerateTerrainMesh === 'function') {
                        terrain.regenerateTerrainMesh();
                        results.push('Regenerated terrain mesh');
                    }
                    
                    // Check if there's a method to switch to bathymetric mode
                    if (typeof terrain.setBathymetricMode === 'function') {
                        terrain.setBathymetricMode();
                        results.push('Set bathymetric mode');
                    }
                    
                } else {
                    results.push('Terrain system not available for direct manipulation');
                }
            } catch (error) {
                results.push('Error: ' + error.message);
            }
            
            return results;
        });
        
        console.log('Direct fix results:', directFix);
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'fix_attempt_4_direct_fix.png', fullPage: true });
        
        // Method 4: Try to create new bathymetric material
        console.log('Trying to create new bathymetric material...');
        const materialFix = await page.evaluate(() => {
            let results = [];
            
            try {
                if (window.game && window.game.terrainSystem && window.game.terrainSystem.terrainMesh && window.THREE) {
                    const terrain = window.game.terrainSystem;
                    const mesh = terrain.terrainMesh;
                    
                    // Create a new material with depth-based coloring
                    const newMaterial = new THREE.ShaderMaterial({
                        vertexShader: `
                            varying vec3 vPosition;
                            void main() {
                                vPosition = position;
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            }
                        `,
                        fragmentShader: `
                            varying vec3 vPosition;
                            void main() {
                                float depth = -vPosition.y;
                                vec3 color;
                                
                                if (depth < 100.0) {
                                    color = mix(vec3(0.0, 0.5, 1.0), vec3(0.0, 0.3, 0.8), depth / 100.0);
                                } else if (depth < 1000.0) {
                                    color = mix(vec3(0.0, 0.3, 0.8), vec3(0.0, 0.1, 0.4), (depth - 100.0) / 900.0);
                                } else {
                                    color = vec3(0.0, 0.05, 0.2);
                                }
                                
                                gl_FragColor = vec4(color, 1.0);
                            }
                        `
                    });
                    
                    // Apply the new material
                    if (mesh.material) mesh.material.dispose();
                    mesh.material = newMaterial;
                    
                    results.push('Created and applied bathymetric shader material');
                } else {
                    results.push('Cannot create material - missing dependencies');
                }
            } catch (error) {
                results.push('Material creation error: ' + error.message);
            }
            
            return results;
        });
        
        console.log('Material fix results:', materialFix);
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'fix_attempt_5_shader_material.png', fullPage: true });
        
        // Final state check
        console.log('=== FINAL STATE CHECK ===');
        const finalState = await page.evaluate(() => {
            let info = {
                gameExists: !!window.game,
                terrainVisible: false,
                terrainWireframe: null,
                materialType: 'unknown',
                sceneChildren: 0
            };
            
            if (window.game && window.game.scene) {
                info.sceneChildren = window.game.scene.children.length;
                
                if (window.game.terrainSystem && window.game.terrainSystem.terrainMesh) {
                    const mesh = window.game.terrainSystem.terrainMesh;
                    info.terrainVisible = mesh.visible;
                    info.terrainWireframe = mesh.material.wireframe;
                    info.materialType = mesh.material.type;
                }
            }
            
            return info;
        });
        
        console.log('Final terrain state:', JSON.stringify(finalState, null, 2));
        
    } catch (error) {
        console.error('Error during terrain fixing:', error);
        await page.screenshot({ path: 'terrain_fix_error.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

fixTerrainDisplay();