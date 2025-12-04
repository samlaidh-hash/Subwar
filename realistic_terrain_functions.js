// Complete realistic terrain calculation functions to be added to ocean.js

getGeologicalProvince(worldX) {
    if (worldX >= this.provinces.continental.extent.xMin && worldX <= this.provinces.continental.extent.xMax) {
        return 'continental';
    } else if (worldX >= this.provinces.abyssal.extent.xMin && worldX <= this.provinces.abyssal.extent.xMax) {
        return 'abyssal';
    } else if (worldX >= this.provinces.trench.extent.xMin && worldX <= this.provinces.trench.extent.xMax) {
        return 'trench';
    }
    return 'abyssal'; // Default
}

getProvinceBaseDepth(worldX, worldZ, province) {
    switch (province) {
        case 'continental':
            return this.getContinentalMarginDepth(worldX, worldZ);
        case 'abyssal':
            return this.getAbyssalPlainDepth(worldX, worldZ);
        case 'trench':
            return this.getTrenchDepth(worldX, worldZ);
        default:
            return this.provinces.abyssal.baseDepth;
    }
}

getContinentalMarginDepth(worldX, worldZ) {
    const continental = this.provinces.continental;
    
    // Distance from shore (normalized 0-1 across continental margin)
    const distanceFromShore = (worldX - continental.extent.xMin) / (continental.extent.xMax - continental.extent.xMin);
    
    if (distanceFromShore < 0.3) {
        // Continental shelf - very gentle slope
        const shelfDistance = distanceFromShore / 0.3;
        return continental.shelf.depth - (shelfDistance * 50); // 150m to 200m depth
    } else if (distanceFromShore < 0.7) {
        // Continental slope - steep descent
        const slopeDistance = (distanceFromShore - 0.3) / 0.4;
        const slopeDepth = -200 + (slopeDistance * -1800); // 200m to 2000m depth
        
        // Add realistic slope irregularities
        const slopeVariation = Math.sin(worldZ * 0.0001) * Math.cos(worldX * 0.00008) * 150;
        return slopeDepth + slopeVariation;
    } else {
        // Continental rise - gentler transition to abyssal
        const riseDistance = (distanceFromShore - 0.7) / 0.3;
        const riseDepth = -2000 + (riseDistance * -2500); // 2000m to 4500m depth
        
        // Add sediment fan variations
        const fanVariation = Math.sin(worldZ * 0.00005) * 100;
        return riseDepth + fanVariation;
    }
}

getAbyssalPlainDepth(worldX, worldZ) {
    const abyssal = this.provinces.abyssal;
    let depth = abyssal.baseDepth;
    
    // Very gentle abyssal hill variations (realistic scale)
    depth += Math.sin(worldX * 0.00003) * Math.cos(worldZ * 0.00002) * abyssal.variation;
    depth += Math.sin(worldX * 0.00001) * Math.sin(worldZ * 0.000015) * (abyssal.variation * 0.5);
    
    return depth;
}

getTrenchDepth(worldX, worldZ) {
    const trench = this.provinces.trench;
    const distanceFromAxis = Math.abs(worldX - trench.axis.position);
    
    if (distanceFromAxis < trench.walls.width / 2) {
        // Inside trench - V-shaped profile
        const normalizedDistance = distanceFromAxis / (trench.walls.width / 2);
        const trenchProfile = 1 - Math.pow(normalizedDistance, 1.5); // Steep V-shape
        const depth = trench.forearc.depth + (trench.axis.depth - trench.forearc.depth) * trenchProfile;
        
        // Add along-axis variations
        const axisVariation = Math.sin(worldZ * 0.00002) * 500;
        return depth + axisVariation;
    } else {
        // Trench walls and forearc
        return trench.forearc.depth + Math.sin(worldZ * 0.00005) * 200;
    }
}

getTectonicEffect(worldX, worldZ) {
    let tectonicEffect = 0;
    
    // Apply fault system effects
    this.tectonicFeatures.faultSystems.forEach(fault => {
        const distance = this.distanceToLineSegment(worldX, worldZ, fault);
        if (distance < 5000) { // Within 5km of fault
            const effect = fault.displacement * Math.exp(-distance / 2000); // Exponential decay
            tectonicEffect += (Math.random() > 0.5 ? effect : -effect); // Up or down throw
        }
    });
    
    // Apply spreading center effect
    const ridge = this.tectonicFeatures.spreadingCenter;
    const ridgeDistance = this.distanceToRidge(worldX, worldZ, ridge);
    if (ridgeDistance < ridge.relief) {
        const ridgeEffect = ridge.relief * (1 - ridgeDistance / ridge.relief);
        tectonicEffect += ridgeEffect; // Ridge topography
    }
    
    return tectonicEffect;
}

getCanyonDepth(worldX, worldZ) {
    let minDepth = 0; // No canyon effect by default
    
    this.canyonSystems.forEach(canyon => {
        const canyonDistance = this.distanceToCanyonAxis(worldX, worldZ, canyon);
        if (canyonDistance < canyon.width) {
            // Canyon profile - U-shaped with steep walls
            const normalizedDistance = canyonDistance / canyon.width;
            const canyonProfile = 1 - Math.pow(normalizedDistance, 2);
            const canyonCut = -canyon.maxDepth * canyonProfile;
            minDepth = Math.min(minDepth, canyonCut);
        }
        
        // Add tributary effects
        canyon.tributaries.forEach(tributary => {
            const tribDistance = Math.sqrt(
                (worldX - tributary.branch.x) ** 2 + 
                (worldZ - tributary.branch.z) ** 2
            );
            if (tribDistance < 1000) { // 1km tributary width
                const tribProfile = 1 - (tribDistance / 1000);
                const tribCut = -tributary.depth * tribProfile;
                minDepth = Math.min(minDepth, tribCut);
            }
        });
    });
    
    return minDepth;
}

getVolcanicEffect(worldX, worldZ) {
    let maxHeight = -Infinity;
    
    // Seamount chain effects
    this.volcanicFeatures.seamountChain.forEach(seamount => {
        const distance = Math.sqrt(
            (worldX - seamount.position.x) ** 2 + 
            (worldZ - seamount.position.z) ** 2
        );
        
        if (distance < seamount.diameter) {
            // Gaussian volcanic edifice with age-related erosion
            const normalizedDistance = distance / seamount.diameter;
            const volcanicProfile = Math.exp(-normalizedDistance ** 2 * 5);
            const erosionFactor = 1 - (seamount.age * 0.1); // Older = more eroded
            const height = seamount.height * volcanicProfile * erosionFactor;
            maxHeight = Math.max(maxHeight, height);
        }
    });
    
    // Intraplate volcanoes
    this.volcanicFeatures.intraplatevolcanoes.forEach(volcano => {
        const distance = Math.sqrt(
            (worldX - volcano.position.x) ** 2 + 
            (worldZ - volcano.position.z) ** 2
        );
        
        if (distance < volcano.diameter) {
            const normalizedDistance = distance / volcano.diameter;
            const volcanicProfile = Math.exp(-normalizedDistance ** 2 * 4);
            const height = volcano.height * volcanicProfile;
            maxHeight = Math.max(maxHeight, height);
        }
    });
    
    return maxHeight === -Infinity ? 0 : maxHeight;
}

getSedimentThickness(worldX, worldZ) {
    // Calculate sediment thickness based on distance from sources
    const province = this.getGeologicalProvince(worldX);
    let sedimentThickness = 0;
    
    if (province === 'continental') {
        // Continental sediments - thicker near shore
        const distanceFromShore = worldX - this.provinces.continental.extent.xMin;
        const normalizedDistance = distanceFromShore / 35000; // 35km margin width
        sedimentThickness = this.sedimentModel.continentalSediments.shelfThickness * (1 - normalizedDistance);
    } else if (province === 'abyssal') {
        // Pelagic sediments - uniform thin layer
        sedimentThickness = this.sedimentModel.abyssalSediments.baseThickness;
        
        // Add turbidite deposits near canyon mouths
        this.canyonSystems.forEach(canyon => {
            const distanceToMouth = Math.sqrt(
                (worldX - canyon.mouth.x) ** 2 + 
                (worldZ - canyon.mouth.z) ** 2
            );
            if (distanceToMouth < 10000) { // 10km fan radius
                const fanThickness = this.sedimentModel.abyssalSediments.turbiditeThickness * 
                                   Math.exp(-distanceToMouth / 5000);
                sedimentThickness += fanThickness;
            }
        });
    }
    
    // Volcanic ash near volcanoes
    this.volcanicFeatures.seamountChain.forEach(seamount => {
        const distance = Math.sqrt(
            (worldX - seamount.position.x) ** 2 + 
            (worldZ - seamount.position.z) ** 2
        );
        if (distance < this.sedimentModel.volcanicSediments.proximity) {
            const ashThickness = this.sedimentModel.volcanicSediments.thickness * 
                               (1 - distance / this.sedimentModel.volcanicSediments.proximity);
            sedimentThickness += ashThickness;
        }
    });
    
    return -sedimentThickness; // Negative because sediment adds to depth
}

getSeafloorRoughness(worldX, worldZ) {
    // Multi-scale roughness for realistic seabed texture
    let roughness = 0;
    
    // Large-scale undulations (100m-1km)
    roughness += Math.sin(worldX * 0.00628) * Math.cos(worldZ * 0.00314) * 20; // 1km wavelength
    roughness += Math.sin(worldX * 0.0157) * Math.sin(worldZ * 0.0125) * 10;   // 400m wavelength
    
    // Medium-scale features (10m-100m)
    roughness += Math.cos(worldX * 0.0628) * Math.sin(worldZ * 0.0785) * 5;    // 100m wavelength
    roughness += Math.sin(worldX * 0.157) * Math.cos(worldZ * 0.125) * 3;      // 40m wavelength
    
    // Fine-scale texture (1m-10m)
    roughness += Math.sin(worldX * 0.628) * Math.cos(worldZ * 0.785) * 1;      // 10m wavelength
    
    return roughness;
}

// Helper functions for distance calculations
distanceToLineSegment(x, z, fault) {
    // Simplified distance to fault line
    const dx = Math.cos(fault.orientation) * fault.length / 2;
    const dz = Math.sin(fault.orientation) * fault.length / 2;
    const x1 = fault.position.x - dx;
    const z1 = fault.position.z - dz;
    const x2 = fault.position.x + dx;
    const z2 = fault.position.z + dz;
    
    const A = x - x1;
    const B = z - z1;
    const C = x2 - x1;
    const D = z2 - z1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, zz;
    if (param < 0) {
        xx = x1; zz = z1;
    } else if (param > 1) {
        xx = x2; zz = z2;
    } else {
        xx = x1 + param * C;
        zz = z1 + param * D;
    }
    
    return Math.sqrt((x - xx) ** 2 + (z - zz) ** 2);
}

distanceToRidge(x, z, ridge) {
    // Distance to spreading center axis
    return Math.abs((x - ridge.position.x) * Math.cos(ridge.orientation + Math.PI/2) + 
                   (z - ridge.position.z) * Math.sin(ridge.orientation + Math.PI/2));
}

distanceToCanyonAxis(x, z, canyon) {
    // Distance to canyon thalweg (central axis)
    const dx = canyon.mouth.x - canyon.head.x;
    const dz = canyon.mouth.z - canyon.head.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    
    const nx = dx / length;
    const nz = dz / length;
    
    const px = x - canyon.head.x;
    const pz = z - canyon.head.z;
    
    const dot = px * nx + pz * nz;
    const t = Math.max(0, Math.min(length, dot));
    
    const closestX = canyon.head.x + t * nx;
    const closestZ = canyon.head.z + t * nz;
    
    return Math.sqrt((x - closestX) ** 2 + (z - closestZ) ** 2);
}