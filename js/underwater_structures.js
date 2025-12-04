/**
 * Underwater Structures System - Man-made installations that act as stationary contacts
 * Features: Colonies, Power Station, Mine Site, Research Stations
 * Properties: HP, Destructibility, Sonar Signatures, Visual Geometry
 */

class UnderwaterStructuresManager {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
        this.structures = [];
        this.structureGeometries = new Map(); // Cache for reusable geometries
        
        this.initializeGeometries();
        this.createAllStructures();
    }
    
    initializeGeometries() {
        // Basic building block geometries
        this.structureGeometries.set('dome', new THREE.SphereGeometry(25, 16, 12));
        this.structureGeometries.set('smallDome', new THREE.SphereGeometry(15, 12, 8));
        this.structureGeometries.set('tunnel', new THREE.CylinderGeometry(8, 8, 60, 8));
        this.structureGeometries.set('reactor', new THREE.SphereGeometry(40, 20, 16));
        this.structureGeometries.set('building', new THREE.BoxGeometry(30, 20, 40));
        this.structureGeometries.set('dish', new THREE.SphereGeometry(20, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2));
        this.structureGeometries.set('derrick', new THREE.BoxGeometry(8, 80, 8));
        this.structureGeometries.set('miningMachine', new THREE.BoxGeometry(20, 12, 35));
        this.structureGeometries.set('aquaculturePen', new THREE.RingGeometry(40, 50, 8));
        this.structureGeometries.set('hangar', new THREE.BoxGeometry(60, 25, 120));
        this.structureGeometries.set('armoredDome', new THREE.SphereGeometry(35, 16, 12));
        
        // Materials for different structure types
        this.materials = {
            colony: new THREE.MeshBasicMaterial({ color: 0x4444ff, wireframe: true }),
            nuclear: new THREE.MeshBasicMaterial({ color: 0xff4444, wireframe: true }),
            mine: new THREE.MeshBasicMaterial({ color: 0x888844, wireframe: true }),
            research: new THREE.MeshBasicMaterial({ color: 0x44ff44, wireframe: true }),
            aquaculture: new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true }),
            military: new THREE.MeshBasicMaterial({ color: 0xff8800, wireframe: true })
        };
    }
    
    createAllStructures() {
        // Position structures based on terrain features instead of circular pattern
        // Mine: Middle of western depression
        // Colony 1: Lip of western depression
        // Colony 2: 50% along canyon edge
        // Spires: Relocated to east
        // Research station: Halfway down trench on north shelf
        const structures = [
            {
                type: 'COLONY',
                name: 'New Atlantis Colony',
                position: { x: -4000, z: -12000 }, // Lip of western depression
                classification: 'CIVILIAN_INSTALLATION',
                hp: 1500,
                maxHp: 1500,
                components: [
                    { type: 'dome', offset: { x: 0, y: 0, z: 0 } },
                    { type: 'dome', offset: { x: 80, y: 0, z: 0 } },
                    { type: 'dome', offset: { x: -60, y: 0, z: 70 } },
                    { type: 'tunnel', offset: { x: 40, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
                    { type: 'tunnel', offset: { x: -30, y: 0, z: 35 }, rotation: { x: 0, y: Math.PI / 4, z: 0 } },
                    { type: 'aquaculturePen', offset: { x: 150, y: 15, z: 0 } },
                    { type: 'aquaculturePen', offset: { x: -120, y: 15, z: 120 } },
                    { type: 'aquaculturePen', offset: { x: 0, y: 15, z: -100 } }
                ]
            },
            {
                type: 'MARSHALL_STATION',
                name: 'Leviathan Marshall Station',
                position: { x: 8000, z: 5000 }, // East of trench system
                classification: 'MILITARY_INSTALLATION',
                hp: 3000,
                maxHp: 3000,
                components: [
                    { type: 'armoredDome', offset: { x: 0, y: 0, z: 0 } },
                    { type: 'hangar', offset: { x: 100, y: 0, z: 0 } },
                    { type: 'hangar', offset: { x: -100, y: 0, z: 0 } },
                    { type: 'hangar', offset: { x: 0, y: 0, z: 120 } },
                    { type: 'hangar', offset: { x: 0, y: 0, z: -120 } },
                    { type: 'tunnel', offset: { x: 50, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
                    { type: 'tunnel', offset: { x: -50, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
                    { type: 'tunnel', offset: { x: 0, y: 0, z: 60 }, rotation: { x: 0, y: Math.PI / 2, z: 0 } },
                    { type: 'tunnel', offset: { x: 0, y: 0, z: -60 }, rotation: { x: 0, y: Math.PI / 2, z: 0 } }
                ]
            },
            {
                type: 'NUCLEAR_POWER',
                name: 'Poseidon Nuclear Facility',
                position: { x: 12000, z: 0 }, // Far east
                classification: 'INDUSTRIAL_INSTALLATION',
                hp: 2500,
                maxHp: 2500,
                components: [
                    { type: 'reactor', offset: { x: 0, y: 0, z: 0 } },
                    { type: 'building', offset: { x: 80, y: 0, z: 0 } },
                    { type: 'building', offset: { x: -80, y: 0, z: 0 } },
                    { type: 'building', offset: { x: 0, y: 0, z: 90 } },
                    { type: 'tunnel', offset: { x: 40, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
                    { type: 'tunnel', offset: { x: -40, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
                    { type: 'tunnel', offset: { x: 0, y: 0, z: 45 }, rotation: { x: 0, y: Math.PI / 2, z: 0 } }
                ]
            },
            {
                type: 'RESEARCH_STATION',
                name: 'Coral Reef Research Lab',
                position: { x: 0, z: 18000 }, // Halfway down trench on north shelf
                classification: 'SCIENTIFIC_INSTALLATION',
                hp: 1200,
                maxHp: 1200,
                components: [
                    { type: 'dome', offset: { x: 0, y: 0, z: 0 } },
                    { type: 'smallDome', offset: { x: 70, y: 0, z: 0 } },
                    { type: 'tunnel', offset: { x: 35, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
                    { type: 'dish', offset: { x: 0, y: 30, z: 0 }, rotation: { x: -Math.PI / 6, y: 0, z: 0 } }
                ]
            },
            {
                type: 'COLONY',
                name: 'Pacifica Settlement',
                position: { x: -2500, z: -12500 }, // 50% along canyon edge
                classification: 'CIVILIAN_INSTALLATION',
                hp: 1800,
                maxHp: 1800,
                components: [
                    { type: 'dome', offset: { x: 0, y: 0, z: 0 } },
                    { type: 'dome', offset: { x: -90, y: 0, z: 0 } },
                    { type: 'dome', offset: { x: 45, y: 0, z: 80 } },
                    { type: 'smallDome', offset: { x: 0, y: -10, z: -50 } },
                    { type: 'tunnel', offset: { x: -45, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
                    { type: 'tunnel', offset: { x: 22, y: 0, z: 40 }, rotation: { x: 0, y: Math.PI / 3, z: 0 } },
                    { type: 'aquaculturePen', offset: { x: 0, y: 15, z: 150 } },
                    { type: 'aquaculturePen', offset: { x: -150, y: 15, z: -80 } }
                ]
            },
            {
                type: 'MINING_OPERATION',
                name: 'Abyssal Mining Complex',
                position: { x: -5000, z: -15000 }, // Middle of western depression
                classification: 'INDUSTRIAL_INSTALLATION',
                hp: 2000,
                maxHp: 2000,
                components: [
                    { type: 'dome', offset: { x: 0, y: 0, z: 0 } },
                    { type: 'smallDome', offset: { x: 60, y: 0, z: 0 } },
                    { type: 'tunnel', offset: { x: 30, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
                    { type: 'miningMachine', offset: { x: 0, y: -15, z: 80 } },
                    { type: 'miningMachine', offset: { x: -70, y: -10, z: 40 } },
                    { type: 'miningMachine', offset: { x: 90, y: -20, z: -30 } }
                ],
                terrainModification: {
                    radius: 200,
                    type: 'jagged_excavation',
                    intensity: 0.8
                }
            },
            {
                type: 'RESEARCH_STATION',
                name: 'Mariana Deep Lab',
                position: { x: -8000, z: 8000 }, // Northwest position
                classification: 'SCIENTIFIC_INSTALLATION',
                hp: 1600,
                maxHp: 1600,
                components: [
                    { type: 'dome', offset: { x: 0, y: 0, z: 0 } },
                    { type: 'dome', offset: { x: -80, y: 0, z: 0 } },
                    { type: 'tunnel', offset: { x: -40, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
                    { type: 'derrick', offset: { x: 0, y: 40, z: 80 } }
                ]
            }
        ];
        
        // Create each structure at specified position
        structures.forEach(config => {
            this.createStructure(config);
        });
    }
    
    createStructure(config) {
        const structure = {
            id: `STRUCT_${this.structures.length + 1}`,
            type: config.type,
            name: config.name,
            position: config.position,
            classification: config.classification,
            hp: config.hp,
            maxHp: config.maxHp,
            isDestroyed: false,
            meshGroup: new THREE.Group(),
            sonarSignature: this.calculateSonarSignature(config),
            terrainModification: config.terrainModification || null
        };
        
        // Get terrain height at structure position
        let terrainHeight = 0;
        if (window.simpleTerrain && window.simpleTerrain.getHeightAtPosition) {
            terrainHeight = window.simpleTerrain.getHeightAtPosition(structure.position.x, structure.position.z);
        }
        
        // Position structure on seabed
        structure.meshGroup.position.set(
            structure.position.x,
            terrainHeight,
            structure.position.z
        );
        
        // Create visual components
        this.buildStructureComponents(structure, config.components);
        
        // Apply terrain modification if specified
        if (structure.terrainModification) {
            this.applyTerrainModification(structure);
        }
        
        // Add to scene and register
        this.scene.add(structure.meshGroup);
        this.structures.push(structure);
        
        // Register as contact in game systems
        this.registerAsContact(structure);
        
        console.log(`🏭 Created ${structure.type}: ${structure.name} at (${structure.position.x}, ${structure.position.z})`);
    }
    
    buildStructureComponents(structure, components) {
        const materialType = this.getStructureMaterialType(structure.type);
        const material = this.materials[materialType];
        
        components.forEach(component => {
            const geometry = this.structureGeometries.get(component.type);
            if (!geometry) {
                console.warn(`Unknown component type: ${component.type}`);
                return;
            }
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Apply offset position
            mesh.position.set(
                component.offset.x || 0,
                component.offset.y || 0,
                component.offset.z || 0
            );
            
            // Apply rotation if specified
            if (component.rotation) {
                mesh.rotation.set(
                    component.rotation.x || 0,
                    component.rotation.y || 0,
                    component.rotation.z || 0
                );
            }
            
            structure.meshGroup.add(mesh);
        });
    }
    
    getStructureMaterialType(structureType) {
        switch (structureType) {
            case 'COLONY': return 'colony';
            case 'NUCLEAR_POWER': return 'nuclear';
            case 'MINING_OPERATION': return 'mine';
            case 'RESEARCH_STATION': return 'research';
            case 'MARSHALL_STATION': return 'military';
            default: return 'colony';
        }
    }
    
    calculateSonarSignature(config) {
        // Calculate sonar signature based on structure size and type
        const baseSignature = config.components.length * 15;
        const typeMultiplier = {
            'COLONY': 1.0,
            'NUCLEAR_POWER': 1.5, // Nuclear reactor creates more noise
            'MINING_OPERATION': 1.8, // Mining machines are very noisy
            'RESEARCH_STATION': 0.7, // Research stations are quieter
            'MARSHALL_STATION': 1.3 // Military station with submarine activity
        };
        
        return Math.floor(baseSignature * (typeMultiplier[config.type] || 1.0));
    }
    
    applyTerrainModification(structure) {
        // This would modify the terrain around mining sites
        // For now, we'll just log the intention - full implementation would require
        // modifying the terrain generation system
        if (structure.terrainModification.type === 'jagged_excavation') {
            console.log(`🏔️ Applied jagged excavation terrain modification around ${structure.name}`);
            // TODO: Integrate with SimpleTerrain to create excavated, jagged terrain
        }
    }
    
    registerAsContact(structure) {
        // Create a contact entry that integrates with existing enemy/contact systems
        const contact = {
            id: structure.id,
            type: 'STRUCTURE',
            classification: structure.classification,
            name: structure.name,
            position: structure.position,
            hp: structure.hp,
            maxHp: structure.maxHp,
            isDestroyed: structure.isDestroyed,
            sonarSignature: structure.sonarSignature,
            isStationary: true,
            lastDetected: Date.now(),
            structure: structure // Reference back to structure object
        };
        
        // Add to game state contacts if available
        if (this.gameState && this.gameState.contacts) {
            this.gameState.contacts.push(contact);
        }
        
        // Integrate with existing contact/enemy systems
        if (window.tacticalSystem && window.tacticalSystem.addContact) {
            window.tacticalSystem.addContact(contact);
        }
    }
    
    takeDamage(structureId, damage) {
        const structure = this.structures.find(s => s.id === structureId);
        if (!structure || structure.isDestroyed) return false;
        
        structure.hp = Math.max(0, structure.hp - damage);
        
        if (structure.hp <= 0) {
            this.destroyStructure(structure);
            return true; // Structure destroyed
        }
        
        // Update visual damage state
        this.updateDamageVisuals(structure);
        return false; // Structure damaged but not destroyed
    }
    
    destroyStructure(structure) {
        structure.isDestroyed = true;
        structure.hp = 0;
        
        // Change visual appearance to indicate destruction
        structure.meshGroup.children.forEach(mesh => {
            if (mesh.material) {
                mesh.material = new THREE.MeshBasicMaterial({ 
                    color: 0x666666, 
                    wireframe: true,
                    transparent: true,
                    opacity: 0.3 
                });
            }
        });
        
        console.log(`💥 Structure destroyed: ${structure.name}`);
        
        // Remove from active contacts
        if (this.gameState && this.gameState.contacts) {
            const contactIndex = this.gameState.contacts.findIndex(c => c.id === structure.id);
            if (contactIndex !== -1) {
                this.gameState.contacts.splice(contactIndex, 1);
            }
        }
    }
    
    updateDamageVisuals(structure) {
        const damagePercent = 1 - (structure.hp / structure.maxHp);
        const opacity = 1 - (damagePercent * 0.4); // Fade as damage increases
        
        structure.meshGroup.children.forEach(mesh => {
            if (mesh.material && mesh.material.transparent !== undefined) {
                mesh.material.opacity = opacity;
                mesh.material.transparent = true;
            }
        });
    }
    
    getStructureAt(position, radius = 100) {
        return this.structures.find(structure => {
            const distance = Math.sqrt(
                Math.pow(structure.position.x - position.x, 2) +
                Math.pow(structure.position.z - position.z, 2)
            );
            return distance <= radius && !structure.isDestroyed;
        });
    }
    
    getAllActiveStructures() {
        return this.structures.filter(s => !s.isDestroyed);
    }
    
    getStructureInfo(structureId) {
        const structure = this.structures.find(s => s.id === structureId);
        if (!structure) return null;
        
        return {
            id: structure.id,
            type: structure.type,
            name: structure.name,
            hp: structure.hp,
            maxHp: structure.maxHp,
            position: structure.position,
            classification: structure.classification,
            isDestroyed: structure.isDestroyed
        };
    }
}

// Export for global access
window.UnderwaterStructuresManager = UnderwaterStructuresManager;