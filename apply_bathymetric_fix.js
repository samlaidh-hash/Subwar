const { chromium } = require('playwright');

async function applyBathymetricFix() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Open the game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(2000);

        // Select patrol mission
        await page.click('[data-scenario="PATROL_MISSION"]');
        await page.waitForTimeout(4000); // Wait for full initialization

        console.log('=== APPLYING BATHYMETRIC TERRAIN FIX ===');
        
        // Take "before" screenshot
        await page.screenshot({ path: 'before_fix.png', fullPage: true });
        
        // Apply comprehensive terrain fix
        const fixResult = await page.evaluate(() => {
            let results = [];
            
            try {
                // Find the terrain system
                if (!window.game || !window.game.ocean) {
                    results.push('❌ Game or ocean system not found');
                    return results;
                }
                
                const ocean = window.game.ocean;
                results.push('✅ Found ocean system');
                
                // Check if terrain system exists
                if (ocean.terrainSystem) {
                    results.push('✅ Found terrain system');
                    
                    // Try to switch to bathymetric mode
                    if (typeof ocean.terrainSystem.setBathymetricMode === 'function') {
                        ocean.terrainSystem.setBathymetricMode();
                        results.push('✅ Called setBathymetricMode()');
                    }
                    
                    // Try to apply solid rendering
                    if (ocean.terrainSystem.terrainMesh) {
                        const mesh = ocean.terrainSystem.terrainMesh;
                        
                        // Switch to solid mode
                        if (mesh.material) {
                            mesh.material.wireframe = false;
                            results.push('✅ Disabled wireframe mode');
                        }
                        
                        // Try to apply depth-based colors
                        if (typeof ocean.terrainSystem.applyBathymetricColorScheme === 'function') {
                            ocean.terrainSystem.applyBathymetricColorScheme();
                            results.push('✅ Applied bathymetric color scheme');
                        }
                    }
                    
                    // Force terrain recreation in solid mode
                    if (typeof ocean.terrainSystem.regenerateTerrainMesh === 'function') {
                        ocean.terrainSystem.regenerateTerrainMesh();
                        results.push('✅ Regenerated terrain mesh');
                    }
                }
                
                // Alternative: Look for procedural terrain system
                if (window.game.terrainSystem) {
                    results.push('✅ Found game.terrainSystem');
                    
                    const terrain = window.game.terrainSystem;
                    
                    // Switch mode methods
                    if (typeof terrain.switchToSolidMode === 'function') {
                        terrain.switchToSolidMode();
                        results.push('✅ Called switchToSolidMode()');
                    }
                    
                    if (typeof terrain.toggleWireframe === 'function') {
                        terrain.toggleWireframe();
                        results.push('✅ Toggled wireframe');
                    }
                    
                    if (typeof terrain.applyBathymetricColorScheme === 'function') {
                        terrain.applyBathymetricColorScheme();
                        results.push('✅ Applied bathymetric colors');
                    }
                    
                    // Direct material fix
                    if (terrain.terrainMesh && terrain.terrainMesh.material) {
                        terrain.terrainMesh.material.wireframe = false;
                        results.push('✅ Disabled wireframe on terrainMesh');
                    }
                }
                
                // Create entirely new bathymetric material
                if (window.THREE && window.game.scene && window.MONTEREY_CANYON_BATHYMETRY) {
                    results.push('✅ Creating new bathymetric shader...');
                    
                    // Find terrain mesh in scene
                    let terrainMesh = null;
                    window.game.scene.traverse((child) => {
                        if (child.isMesh && (child.name.includes('terrain') || child.name.includes('Terrain'))) {
                            terrainMesh = child;
                        }
                    });
                    
                    if (terrainMesh) {
                        // Create depth-based material
                        const bathymetricMaterial = new THREE.ShaderMaterial({
                            uniforms: {
                                time: { value: 1.0 }
                            },
                            vertexShader: `
                                varying vec3 vPosition;
                                varying float vDepth;
                                void main() {
                                    vPosition = position;
                                    vDepth = -position.y; // Y is depth (negative = underwater)
                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                }
                            `,
                            fragmentShader: `
                                varying vec3 vPosition;
                                varying float vDepth;
                                
                                void main() {
                                    vec3 color;
                                    
                                    // Bathymetric color scheme based on depth
                                    if (vDepth < 50.0) {
                                        // Shallow water - light blue to blue
                                        color = mix(vec3(0.4, 0.8, 1.0), vec3(0.0, 0.6, 1.0), vDepth / 50.0);
                                    } else if (vDepth < 200.0) {
                                        // Continental shelf - blue to dark blue  
                                        color = mix(vec3(0.0, 0.6, 1.0), vec3(0.0, 0.3, 0.8), (vDepth - 50.0) / 150.0);
                                    } else if (vDepth < 1000.0) {
                                        // Slope - dark blue to blue-black
                                        color = mix(vec3(0.0, 0.3, 0.8), vec3(0.0, 0.1, 0.4), (vDepth - 200.0) / 800.0);
                                    } else if (vDepth < 3000.0) {
                                        // Abyssal - blue-black to black
                                        color = mix(vec3(0.0, 0.1, 0.4), vec3(0.0, 0.05, 0.2), (vDepth - 1000.0) / 2000.0);
                                    } else {
                                        // Deep ocean trenches - very dark
                                        color = vec3(0.0, 0.02, 0.1);
                                    }
                                    
                                    // Add subtle variation
                                    float variation = sin(vPosition.x * 0.001) * cos(vPosition.z * 0.001) * 0.1;
                                    color += variation * 0.2;
                                    
                                    gl_FragColor = vec4(color, 1.0);
                                }
                            `,
                            transparent: false,
                            side: THREE.DoubleSide
                        });
                        
                        // Apply new material
                        if (terrainMesh.material) terrainMesh.material.dispose();
                        terrainMesh.material = bathymetricMaterial;
                        
                        results.push('✅ Applied new bathymetric shader material');
                    } else {
                        results.push('❌ Could not find terrain mesh in scene');
                    }
                }
                
            } catch (error) {
                results.push('❌ Error: ' + error.message);
            }
            
            return results;
        });
        
        console.log('Fix results:', fixResult);
        
        // Wait for changes to apply
        await page.waitForTimeout(1000);
        
        // Take "after" screenshot
        await page.screenshot({ path: 'after_fix.png', fullPage: true });
        
        // Test the terrain mode keys
        console.log('Testing terrain mode keys...');
        
        // Try B key (shader mode)
        await page.keyboard.press('b');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'after_b_key.png', fullPage: true });
        
        // Try N key (solid mode)  
        await page.keyboard.press('n');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'after_n_key.png', fullPage: true });
        
        console.log('✅ Bathymetric terrain fix applied!');
        console.log('Screenshots saved: before_fix.png, after_fix.png, after_b_key.png, after_n_key.png');
        
    } catch (error) {
        console.error('Fix application error:', error);
    } finally {
        await browser.close();
    }
}

applyBathymetricFix();