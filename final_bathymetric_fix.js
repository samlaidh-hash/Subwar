const { chromium } = require('playwright');

async function finalBathymetricFix() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Open game and wait for full initialization
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(2000);
        await page.click('[data-scenario="PATROL_MISSION"]');
        await page.waitForTimeout(5000);

        console.log('=== FINAL BATHYMETRIC VISUALIZATION FIX ===');
        
        // Explore and fix the actual game structure
        const finalFix = await page.evaluate(() => {
            let results = [];
            
            try {
                // Deep exploration of the game object
                results.push('🔍 Exploring game structure...');
                
                if (window.game) {
                    results.push('✅ Found window.game');
                    
                    // Log all properties of game object
                    const gameProps = Object.keys(window.game);
                    results.push(`Game properties: ${gameProps.join(', ')}`);
                    
                    // Check scene for terrain objects
                    if (window.game.scene) {
                        let terrainObjects = [];
                        let lineObjects = [];
                        let meshObjects = [];
                        
                        window.game.scene.traverse((child) => {
                            if (child.name && child.name.toLowerCase().includes('terrain')) {
                                terrainObjects.push(child);
                            }
                            if (child.type === 'LineSegments' || child.type === 'Line') {
                                lineObjects.push({
                                    name: child.name || 'unnamed',
                                    type: child.type,
                                    visible: child.visible,
                                    material: child.material ? child.material.type : 'none'
                                });
                            }
                            if (child.isMesh) {
                                meshObjects.push({
                                    name: child.name || 'unnamed',
                                    type: child.type,
                                    wireframe: child.material ? child.material.wireframe : false,
                                    material: child.material ? child.material.type : 'none'
                                });
                            }
                        });
                        
                        results.push(`Found ${terrainObjects.length} terrain objects`);
                        results.push(`Found ${lineObjects.length} line objects`);
                        results.push(`Found ${meshObjects.length} mesh objects`);
                        
                        // Try to convert wireframe terrain to solid
                        let converted = 0;
                        window.game.scene.traverse((child) => {
                            // Look for wireframe materials and convert them
                            if (child.material && (child.material.wireframe || child.type === 'LineSegments')) {
                                // Create new solid material
                                if (window.THREE) {
                                    const newMaterial = new THREE.ShaderMaterial({
                                        vertexShader: `
                                            varying vec3 vPosition;
                                            varying float vDepth;
                                            void main() {
                                                vPosition = position;
                                                vDepth = -position.y;
                                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                            }
                                        `,
                                        fragmentShader: `
                                            varying float vDepth;
                                            void main() {
                                                vec3 color;
                                                if (vDepth < 100.0) {
                                                    color = vec3(0.0, 0.8, 1.0);
                                                } else if (vDepth < 500.0) {
                                                    color = vec3(0.0, 0.5, 0.8);
                                                } else if (vDepth < 1500.0) {
                                                    color = vec3(0.0, 0.3, 0.6);
                                                } else if (vDepth < 3000.0) {
                                                    color = vec3(0.0, 0.1, 0.4);
                                                } else {
                                                    color = vec3(0.0, 0.05, 0.2);
                                                }
                                                gl_FragColor = vec4(color, 1.0);
                                            }
                                        `,
                                        side: THREE.DoubleSide
                                    });
                                    
                                    // If it's a wireframe mesh, just disable wireframe
                                    if (child.isMesh && child.material.wireframe) {
                                        child.material.wireframe = false;
                                        converted++;
                                    }
                                    // If it's line segments, try to replace with solid geometry
                                    else if (child.type === 'LineSegments' && child.geometry) {
                                        // Create a new mesh with the same geometry
                                        const solidMesh = new THREE.Mesh(child.geometry, newMaterial);
                                        solidMesh.position.copy(child.position);
                                        solidMesh.rotation.copy(child.rotation);
                                        solidMesh.scale.copy(child.scale);
                                        solidMesh.name = child.name + '_solid';
                                        
                                        // Add to parent and hide original
                                        child.parent.add(solidMesh);
                                        child.visible = false;
                                        converted++;
                                    }
                                }
                            }
                        });
                        
                        results.push(`✅ Converted ${converted} objects from wireframe to solid`);
                    }
                    
                    // Also check if there are specific terrain system objects
                    ['terrainSystem', 'ocean', 'terrain', 'bathymetryTerrain'].forEach(prop => {
                        if (window.game[prop]) {
                            results.push(`✅ Found game.${prop}`);
                            
                            const obj = window.game[prop];
                            if (obj.terrainMesh && obj.terrainMesh.material) {
                                obj.terrainMesh.material.wireframe = false;
                                results.push(`✅ Disabled wireframe on ${prop}.terrainMesh`);
                            }
                            
                            if (typeof obj.switchToSolidMode === 'function') {
                                obj.switchToSolidMode();
                                results.push(`✅ Called ${prop}.switchToSolidMode()`);
                            }
                            
                            if (typeof obj.setBathymetricColors === 'function') {
                                obj.setBathymetricColors();
                                results.push(`✅ Called ${prop}.setBathymetricColors()`);
                            }
                        }
                    });
                }
                
                // Force renderer to update
                if (window.game && window.game.renderer) {
                    window.game.renderer.render(window.game.scene, window.game.camera);
                    results.push('✅ Forced renderer update');
                }
                
            } catch (error) {
                results.push('❌ Error: ' + error.message);
            }
            
            return results;
        });
        
        console.log('Final fix results:');
        finalFix.forEach(result => console.log(result));
        
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'final_bathymetric_fix.png', fullPage: true });
        
        console.log('✅ Final bathymetric fix complete!');
        console.log('Screenshot: final_bathymetric_fix.png');
        
    } catch (error) {
        console.error('Final fix error:', error);
    } finally {
        await browser.close();
    }
}

finalBathymetricFix();