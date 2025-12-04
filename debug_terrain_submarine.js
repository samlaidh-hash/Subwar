// Debug script to check terrain and submarine status
// Run this in browser console to diagnose issues

function debugTerrainAndSubmarine() {
    console.log('🔍 DEBUGGING TERRAIN AND SUBMARINE STATUS');
    console.log('=' .repeat(50));
    
    // Check if game objects exist
    console.log('📋 GLOBAL OBJECTS:');
    console.log('- window.gameState:', !!window.gameState);
    console.log('- window.simpleTerrain:', !!window.simpleTerrain);
    console.log('- window.playerSubmarine:', !!window.playerSubmarine);
    console.log('- window.terrainGenerator:', !!window.terrainGenerator);
    
    // Check terrain status
    if (window.simpleTerrain) {
        console.log('\\n🌍 TERRAIN STATUS:');
        const info = window.simpleTerrain.getTerrainInfo();
        console.log('- Visible:', info.visible);
        console.log('- Wireframe Mode:', info.wireframe);
        console.log('- Size:', info.size);
        console.log('- Children:', info.children);
        console.log('- Position:', info.position);
        
        if (window.simpleTerrain.terrainGroup) {
            console.log('- Terrain Group in Scene:', window.gameState.scene.children.includes(window.simpleTerrain.terrainGroup));
        }
    } else {
        console.log('\\n❌ NO TERRAIN SYSTEM FOUND');
    }
    
    // Check submarine status
    if (window.playerSubmarine) {
        console.log('\\n🚢 SUBMARINE STATUS:');
        console.log('- Class:', window.playerSubmarine.submarineClass);
        console.log('- Mesh exists:', !!window.playerSubmarine.mesh);
        if (window.playerSubmarine.mesh) {
            console.log('- Position:', window.playerSubmarine.mesh.position);
            console.log('- Scale:', window.playerSubmarine.mesh.scale);
            console.log('- Visible:', window.playerSubmarine.mesh.visible);
            console.log('- Children:', window.playerSubmarine.mesh.children.length);
            console.log('- In Scene:', window.gameState.scene.children.includes(window.playerSubmarine.mesh));
        }
    } else {
        console.log('\\n❌ NO SUBMARINE FOUND');
    }
    
    // Check camera position
    if (window.gameState && window.gameState.camera) {
        console.log('\\n📹 CAMERA STATUS:');
        console.log('- Position:', window.gameState.camera.position);
        console.log('- Rotation:', window.gameState.camera.rotation);
        console.log('- Looking at:', {
            x: window.gameState.camera.position.x,
            y: window.gameState.camera.position.y,
            z: window.gameState.camera.position.z
        });
    }
    
    // Check scene objects
    if (window.gameState && window.gameState.scene) {
        console.log('\\n🎬 SCENE STATUS:');
        console.log('- Total children:', window.gameState.scene.children.length);
        console.log('- Object types:', window.gameState.scene.children.map(obj => obj.type || obj.constructor.name));
    }
    
    console.log('\\n🔧 SUGGESTED FIXES:');
    
    if (!window.simpleTerrain) {
        console.log('❌ Terrain system not initialized - call initSimpleTerrain(scene)');
    } else if (!window.simpleTerrain.isVisible) {
        console.log('⚠️ Terrain hidden - press T to toggle visibility');
    } else if (window.simpleTerrain.wireframeMode) {
        console.log('⚠️ Terrain in wireframe mode - press B for shader mode');
    }
    
    if (!window.playerSubmarine) {
        console.log('❌ Submarine not initialized - select scenario first');
    } else if (window.playerSubmarine.submarineClass !== 'COBRA') {
        console.log('⚠️ Using', window.playerSubmarine.submarineClass, 'instead of COBRA');
    }
}

// Auto-run debug
debugTerrainAndSubmarine();

// Also provide manual functions
window.debugTerrain = debugTerrainAndSubmarine;
window.fixTerrain = function() {
    console.log('🔧 ATTEMPTING TERRAIN FIX...');
    if (window.gameState && window.gameState.scene) {
        if (!window.simpleTerrain) {
            console.log('Creating new terrain...');
            if (window.initSimpleTerrain) {
                window.initSimpleTerrain(window.gameState.scene);
            }
        } else {
            console.log('Recreating terrain in shader mode...');
            window.simpleTerrain.wireframeMode = false;
            window.simpleTerrain.createTerrain();
        }
    }
};

window.fixSubmarine = function() {
    console.log('🔧 ATTEMPTING SUBMARINE FIX...');
    if (window.gameState && window.gameState.scene && window.initSubmarine) {
        console.log('Creating COBRA submarine...');
        window.initSubmarine(window.gameState.scene, 'COBRA');
    }
};