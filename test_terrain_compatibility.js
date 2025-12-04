// Quick terrain compatibility test
console.log('=== Terrain Compatibility Test ===');

// Check Three.js version and available APIs
console.log('Three.js version check:');
console.log('THREE.REVISION:', THREE.REVISION || 'undefined');

// Check for required Math utilities
console.log('\nMath utilities check:');
console.log('THREE.MathUtils:', typeof THREE.MathUtils);
console.log('THREE.MathUtils.ceilPowerOfTwo:', typeof THREE.MathUtils?.ceilPowerOfTwo);

// Check if old Math is still there (should be undefined)
console.log('THREE.Math (deprecated):', typeof THREE.Math);

// Test terrain creation
console.log('\n=== Testing Terrain Creation ===');
try {
    const terrainOptions = {
        heightmap: THREE.Terrain.Perlin,
        material: new THREE.MeshBasicMaterial({color: 0x5566aa}),
        xSegments: 31,  // Smaller size for testing
        ySegments: 31,
        xSize: 100,
        ySize: 100
    };
    
    console.log('Creating terrain with options:', terrainOptions);
    const terrain = THREE.Terrain(terrainOptions);
    
    console.log('✅ Terrain created successfully!');
    console.log('Terrain type:', terrain.type);
    console.log('Terrain geometry:', terrain.geometry?.type || 'unknown');
    console.log('Vertex count:', terrain.geometry?.attributes?.position?.count || 'unknown');
    
} catch (error) {
    console.error('❌ Terrain creation failed:', error);
    console.error('Error stack:', error.stack);
}

console.log('\n=== Test Complete ===');