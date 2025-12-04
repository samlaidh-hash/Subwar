// Oolite Fleet Configurations for Sub War 2060
// Pre-defined enemy fleet configurations using converted Oolite ships

// Detailed Submarine Specifications for Oolite Ships
const OOLITE_SUBMARINE_SPECIFICATIONS = {
    // Light Fighters
    VIPER: {
        // Physical Characteristics
        hullLength: 22, // Compact interceptor
        hullWidth: 8,
        hullHeight: 5,
        displacement: 45, // tonnes
        crew: 1,

        // Performance
        maxSpeedForward: 100,
        maxSpeedReverse: 95,
        accelerationRate: 1.2,
        crushDepth: 2400 * 0.3048, // 732 meters
        emergencyDepth: 2600 * 0.3048,

        // Torpedo Capabilities
        torpedoTubes: 2,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: false,
        maxMines: 0,

        // Standard Loadout
        standardLoadout: {
            lightTorpedoes: 4,  // MT (Mark Torpedo)
            noisemakers: 6,
            mines: 0
        },

        // Maneuverability (Very Agile)
        baseTurnRate: 0.012,
        pitchRate: 0.006,
        rollRate: 0.005,
        dragTurnMultiplier: 1.5,
        turnDecay: 0.6, // Light fighter - moderate drift

        // Defensive Systems (REBALANCED: 45 tons * 0.67 HP/ton = 30 HP)
        hullArmorHP: 30,
        hullArmorPenThreshold: 20,
        sonarSignatureBase: 4, // Very quiet

        // Systems HP
        hullHP: 30,
        engineHP: 20,
        weaponsHP: 15,
        sensorsHP: 12,
        lifeSupportHP: 8,
        navigationHP: 12
    },

    SIDEWINDER: {
        hullLength: 18, // Ultra-compact
        hullWidth: 6,
        hullHeight: 4,
        displacement: 28,
        crew: 1,

        maxSpeedForward: 115,
        maxSpeedReverse: 105,
        accelerationRate: 1.5,
        crushDepth: 1800 * 0.3048,
        emergencyDepth: 2000 * 0.3048,

        torpedoTubes: 1,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: false,
        maxMines: 0,

        standardLoadout: {
            lightTorpedoes: 2,
            noisemakers: 4,
            mines: 0
        },

        baseTurnRate: 0.015,
        pitchRate: 0.008,
        rollRate: 0.006,
        dragTurnMultiplier: 1.6,
        turnDecay: 0.5, // Ultra-light fighter - most drift

        // Defensive Systems (REBALANCED: 28 tons * 0.5 HP/ton = 14 HP)
        hullArmorHP: 14,
        hullArmorPenThreshold: 12,
        sonarSignatureBase: 3, // Extremely quiet

        hullHP: 14,
        engineHP: 12,
        weaponsHP: 8,
        sensorsHP: 15,
        lifeSupportHP: 5,
        navigationHP: 10
    },

    // Medium Fighters
    COBRA3: {
        hullLength: 35, // Multi-role fighter
        hullWidth: 12,
        hullHeight: 8,
        displacement: 85,
        crew: 2,

        maxSpeedForward: 88,
        maxSpeedReverse: 82,
        accelerationRate: 0.9,
        crushDepth: 3200 * 0.3048,
        emergencyDepth: 3400 * 0.3048,

        torpedoTubes: 3,
        canCarryHeavyTorpedoes: true,
        hasMineLayer: false,
        maxMines: 0,

        standardLoadout: {
            lightTorpedoes: 4,
            heavyTorpedoes: 2,
            noisemakers: 8,
            mines: 0
        },

        baseTurnRate: 0.009,
        pitchRate: 0.005,
        rollRate: 0.004,
        dragTurnMultiplier: 1.2,
        turnDecay: 0.7, // Medium multi-role - balanced

        // Defensive Systems (REBALANCED: 85 tons * 0.6 HP/ton = 51 HP)
        hullArmorHP: 51,
        hullArmorPenThreshold: 30,
        sonarSignatureBase: 6, // Moderate signature

        hullHP: 51,
        engineHP: 30,
        weaponsHP: 25,
        sensorsHP: 20,
        lifeSupportHP: 15,
        navigationHP: 18
    },

    KRAIT: {
        hullLength: 28,
        hullWidth: 10,
        hullHeight: 7,
        displacement: 65,
        crew: 2,

        maxSpeedForward: 92,
        maxSpeedReverse: 85,
        accelerationRate: 1.0,
        crushDepth: 2800 * 0.3048,
        emergencyDepth: 3000 * 0.3048,

        torpedoTubes: 2,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: true, // Stealth mine layer
        maxMines: 8,

        standardLoadout: {
            lightTorpedoes: 6,
            noisemakers: 10,
            mines: 4
        },

        baseTurnRate: 0.010,
        pitchRate: 0.005,
        rollRate: 0.004,
        dragTurnMultiplier: 1.3,
        turnDecay: 0.7, // Medium stealth - balanced

        // Defensive Systems (REBALANCED: 65 tons * 0.6 HP/ton = 39 HP)
        hullArmorHP: 39,
        hullArmorPenThreshold: 25,
        sonarSignatureBase: 5,

        hullHP: 39,
        engineHP: 25,
        weaponsHP: 20,
        sensorsHP: 22,
        lifeSupportHP: 12,
        navigationHP: 16
    },

    // Reconnaissance
    ASP: {
        hullLength: 42, // Explorer/Recon
        hullWidth: 14,
        hullHeight: 10,
        displacement: 120,
        crew: 3,

        maxSpeedForward: 82,
        maxSpeedReverse: 75,
        accelerationRate: 0.7,
        crushDepth: 4000 * 0.3048,
        emergencyDepth: 4200 * 0.3048,

        torpedoTubes: 4,
        canCarryHeavyTorpedoes: true,
        hasMineLayer: true,
        maxMines: 12,

        standardLoadout: {
            lightTorpedoes: 6,
            heavyTorpedoes: 2,
            noisemakers: 15, // Enhanced countermeasures
            mines: 6
        },

        baseTurnRate: 0.007,
        pitchRate: 0.004,
        rollRate: 0.003,
        dragTurnMultiplier: 1.1,
        turnDecay: 0.8, // Heavy recon - stable

        // Defensive Systems (REBALANCED: 120 tons * 0.6 HP/ton = 72 HP)
        hullArmorHP: 72,
        hullArmorPenThreshold: 35,
        sonarSignatureBase: 7, // Larger signature

        hullHP: 72,
        engineHP: 40,
        weaponsHP: 30,
        sensorsHP: 45, // ENHANCED SENSORS
        lifeSupportHP: 20,
        navigationHP: 28
    },

    // Heavy Units
    ANACONDA: {
        hullLength: 68, // Heavy cruiser
        hullWidth: 20,
        hullHeight: 15,
        displacement: 280,
        crew: 8,

        maxSpeedForward: 75,
        maxSpeedReverse: 65,
        accelerationRate: 0.5,
        crushDepth: 5000 * 0.3048,
        emergencyDepth: 5200 * 0.3048,

        torpedoTubes: 6,
        canCarryHeavyTorpedoes: true,
        hasMineLayer: true,
        maxMines: 20,

        standardLoadout: {
            lightTorpedoes: 8,
            heavyTorpedoes: 6,
            noisemakers: 20,
            mines: 12
        },

        baseTurnRate: 0.005,
        pitchRate: 0.003,
        rollRate: 0.002,
        dragTurnMultiplier: 0.9,
        turnDecay: 0.9, // Heavy cruiser - quick stop

        // Defensive Systems (REBALANCED: 280 tons * 0.5 HP/ton = 140 HP - kept same, reasonable for heavy)
        hullArmorHP: 140,
        hullArmorPenThreshold: 50,
        sonarSignatureBase: 10, // Large signature

        hullHP: 140,
        engineHP: 60,
        weaponsHP: 50,
        sensorsHP: 35,
        lifeSupportHP: 30,
        navigationHP: 40
    },

    PYTHON: {
        hullLength: 48, // Heavy transport/gunboat
        hullWidth: 16,
        hullHeight: 12,
        displacement: 180,
        crew: 5,

        maxSpeedForward: 78,
        maxSpeedReverse: 70,
        accelerationRate: 0.6,
        crushDepth: 4200 * 0.3048,
        emergencyDepth: 4400 * 0.3048,

        torpedoTubes: 4,
        canCarryHeavyTorpedoes: true,
        hasMineLayer: false,
        maxMines: 0,

        standardLoadout: {
            lightTorpedoes: 8,
            heavyTorpedoes: 4,
            noisemakers: 12,
            mines: 0
        },

        baseTurnRate: 0.006,
        pitchRate: 0.003,
        rollRate: 0.003,
        dragTurnMultiplier: 1.0,
        turnDecay: 0.8, // Heavy gunboat - stable

        // Defensive Systems (REBALANCED: 180 tons * 0.6 HP/ton = 108 HP)
        hullArmorHP: 108,
        hullArmorPenThreshold: 45,
        sonarSignatureBase: 8,

        hullHP: 108,
        engineHP: 50,
        weaponsHP: 40,
        sensorsHP: 30,
        lifeSupportHP: 25,
        navigationHP: 35
    },

    FERDELANCE: {
        hullLength: 32, // Fast attack craft
        hullWidth: 11,
        hullHeight: 8,
        displacement: 75,
        crew: 2,

        maxSpeedForward: 98,
        maxSpeedReverse: 88,
        accelerationRate: 1.1,
        crushDepth: 3000 * 0.3048,
        emergencyDepth: 3200 * 0.3048,

        torpedoTubes: 3,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: false,
        maxMines: 0,

        standardLoadout: {
            lightTorpedoes: 8,
            noisemakers: 8,
            mines: 0
        },

        baseTurnRate: 0.011,
        pitchRate: 0.006,
        rollRate: 0.005,
        dragTurnMultiplier: 1.4,
        turnDecay: 0.5, // Light/fast ship - more drift

        // Defensive Systems (REBALANCED: 75 tons * 0.6 HP/ton = 45 HP)
        hullArmorHP: 45,
        hullArmorPenThreshold: 27, // ~60% of hull HP
        sonarSignatureBase: 5,

        hullHP: 45,
        engineHP: 27, // Scaled proportionally
        weaponsHP: 20,
        sensorsHP: 15,
        lifeSupportHP: 12,
        navigationHP: 18
    },

    // Transport/Support
    BOA: {
        hullLength: 52, // Heavy transport
        hullWidth: 18,
        hullHeight: 14,
        displacement: 220,
        crew: 6,

        maxSpeedForward: 68,
        maxSpeedReverse: 60,
        accelerationRate: 0.4,
        crushDepth: 4800 * 0.3048,
        emergencyDepth: 5000 * 0.3048,

        torpedoTubes: 2,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: true,
        maxMines: 25, // Dedicated mine layer

        standardLoadout: {
            lightTorpedoes: 4,
            noisemakers: 18,
            mines: 15
        },

        baseTurnRate: 0.004,
        pitchRate: 0.002,
        rollRate: 0.002,
        dragTurnMultiplier: 0.8,
        turnDecay: 0.8, // Heavy ship - quick stop

        // Defensive Systems (REASONABLE: 220 tons - keeping ~120 HP as reasonable for heavy)
        hullArmorHP: 120,
        hullArmorPenThreshold: 72, // ~60% of hull HP
        sonarSignatureBase: 9,

        hullHP: 120, // Match armor HP
        engineHP: 50,
        weaponsHP: 25,
        sensorsHP: 40,
        lifeSupportHP: 35,
        navigationHP: 45
    },

    BOA2: {
        hullLength: 58, // Command cruiser
        hullWidth: 20,
        hullHeight: 16,
        displacement: 320,
        crew: 10,

        maxSpeedForward: 65,
        maxSpeedReverse: 55,
        accelerationRate: 0.35,
        crushDepth: 5200 * 0.3048,
        emergencyDepth: 5400 * 0.3048,

        torpedoTubes: 8, // Maximum firepower
        canCarryHeavyTorpedoes: true,
        hasMineLayer: true,
        maxMines: 30,

        standardLoadout: {
            lightTorpedoes: 12,
            heavyTorpedoes: 8,
            noisemakers: 25,
            mines: 18
        },

        baseTurnRate: 0.003,
        pitchRate: 0.002,
        rollRate: 0.001,
        dragTurnMultiplier: 0.7,
        turnDecay: 0.9, // Heavy ship - quick stop

        // Defensive Systems (REASONABLE: 320 tons - keeping ~160 HP as reasonable for heavy)
        hullArmorHP: 160,
        hullArmorPenThreshold: 96, // ~60% of hull HP
        sonarSignatureBase: 12, // Massive signature

        hullHP: 160, // Match armor HP
        engineHP: 80,
        weaponsHP: 75,
        sensorsHP: 55,
        lifeSupportHP: 50,
        navigationHP: 65
    },

    // Specialists
    CONSTRICTOR: {
        hullLength: 26, // Stealth hunter
        hullWidth: 9,
        hullHeight: 6,
        displacement: 55,
        crew: 2,

        maxSpeedForward: 85,
        maxSpeedReverse: 78,
        accelerationRate: 0.8,
        crushDepth: 3600 * 0.3048,
        emergencyDepth: 3800 * 0.3048,

        torpedoTubes: 2,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: false,
        maxMines: 0,

        standardLoadout: {
            lightTorpedoes: 6,
            noisemakers: 12, // Stealth emphasis
            mines: 0
        },

        baseTurnRate: 0.010,
        pitchRate: 0.005,
        rollRate: 0.004,
        dragTurnMultiplier: 1.2,
        turnDecay: 0.7, // Medium ship - balanced

        // Defensive Systems (REBALANCED: 55 tons * 0.6 HP/ton = 33 HP)
        hullArmorHP: 33,
        hullArmorPenThreshold: 20, // ~60% of hull HP
        sonarSignatureBase: 4, // Very quiet

        hullHP: 33,
        engineHP: 20, // Scaled proportionally
        weaponsHP: 15,
        sensorsHP: 22, // Enhanced for recon
        lifeSupportHP: 10,
        navigationHP: 12
    },

    GECKO: {
        hullLength: 20, // Fast scout
        hullWidth: 7,
        hullHeight: 5,
        displacement: 35,
        crew: 1,

        maxSpeedForward: 110,
        maxSpeedReverse: 100,
        accelerationRate: 1.4,
        crushDepth: 2200 * 0.3048,
        emergencyDepth: 2400 * 0.3048,

        torpedoTubes: 1,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: false,
        maxMines: 0,

        standardLoadout: {
            lightTorpedoes: 3,
            noisemakers: 8,
            mines: 0
        },

        baseTurnRate: 0.016,
        pitchRate: 0.010,
        rollRate: 0.008,
        dragTurnMultiplier: 1.8,
        turnDecay: 0.5, // Light/fast ship - more drift

        // Defensive Systems (REBALANCED: 35 tons * 0.5 HP/ton = 18 HP)
        hullArmorHP: 18,
        hullArmorPenThreshold: 11, // ~60% of hull HP
        sonarSignatureBase: 3,

        hullHP: 18,
        engineHP: 12, // Scaled proportionally
        weaponsHP: 8,
        sensorsHP: 15, // Scout sensors
        lifeSupportHP: 5,
        navigationHP: 8
    },

    MAMBA: {
        hullLength: 24, // Fast interceptor
        hullWidth: 8,
        hullHeight: 6,
        displacement: 48,
        crew: 1,

        maxSpeedForward: 105,
        maxSpeedReverse: 95,
        accelerationRate: 1.3,
        crushDepth: 2600 * 0.3048,
        emergencyDepth: 2800 * 0.3048,

        torpedoTubes: 2,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: false,
        maxMines: 0,

        standardLoadout: {
            lightTorpedoes: 5,
            noisemakers: 6,
            mines: 0
        },

        baseTurnRate: 0.013,
        pitchRate: 0.007,
        rollRate: 0.006,
        dragTurnMultiplier: 1.6,
        turnDecay: 0.5, // Light/fast ship - more drift

        // Defensive Systems (REBALANCED: 48 tons * 0.5 HP/ton = 24 HP)
        hullArmorHP: 24,
        hullArmorPenThreshold: 14, // ~60% of hull HP
        sonarSignatureBase: 4,

        hullHP: 24,
        engineHP: 15, // Scaled proportionally
        weaponsHP: 10,
        sensorsHP: 12,
        lifeSupportHP: 6,
        navigationHP: 10
    },

    MORAY: {
        hullLength: 30, // Raider
        hullWidth: 10,
        hullHeight: 7,
        displacement: 70,
        crew: 2,

        maxSpeedForward: 90,
        maxSpeedReverse: 82,
        accelerationRate: 0.9,
        crushDepth: 3400 * 0.3048,
        emergencyDepth: 3600 * 0.3048,

        torpedoTubes: 3,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: true, // Pirate mine layer
        maxMines: 10,

        standardLoadout: {
            lightTorpedoes: 7,
            noisemakers: 10,
            mines: 5
        },

        baseTurnRate: 0.009,
        pitchRate: 0.005,
        rollRate: 0.004,
        dragTurnMultiplier: 1.3,
        turnDecay: 0.7, // Medium ship - balanced

        // Defensive Systems (REBALANCED: 70 tons * 0.6 HP/ton = 42 HP)
        hullArmorHP: 42,
        hullArmorPenThreshold: 25, // ~60% of hull HP
        sonarSignatureBase: 6,

        hullHP: 42,
        engineHP: 25, // Scaled proportionally
        weaponsHP: 20,
        sensorsHP: 17,
        lifeSupportHP: 11,
        navigationHP: 16
    },

    ADDER: {
        hullLength: 38, // Utility transport
        hullWidth: 13,
        hullHeight: 9,
        displacement: 95,
        crew: 3,

        maxSpeedForward: 72,
        maxSpeedReverse: 65,
        accelerationRate: 0.6,
        crushDepth: 3800 * 0.3048,
        emergencyDepth: 4000 * 0.3048,

        torpedoTubes: 2,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: true,
        maxMines: 15,

        standardLoadout: {
            lightTorpedoes: 6,
            noisemakers: 14,
            mines: 8
        },

        baseTurnRate: 0.006,
        pitchRate: 0.003,
        rollRate: 0.003,
        dragTurnMultiplier: 1.0,
        turnDecay: 0.8, // Heavy ship - quick stop

        // Defensive Systems (REBALANCED: 95 tons * 0.6 HP/ton = 57 HP)
        hullArmorHP: 57,
        hullArmorPenThreshold: 34, // ~60% of hull HP
        sonarSignatureBase: 7,

        hullHP: 57,
        engineHP: 32, // Scaled proportionally
        weaponsHP: 21,
        sensorsHP: 23,
        lifeSupportHP: 17,
        navigationHP: 25
    },

    ESCPOD: {
        hullLength: 8, // Emergency escape pod
        hullWidth: 3,
        hullHeight: 3,
        displacement: 5,
        crew: 4, // Survivors

        maxSpeedForward: 25,
        maxSpeedReverse: 20,
        accelerationRate: 0.3,
        crushDepth: 1000 * 0.3048,
        emergencyDepth: 1200 * 0.3048,

        torpedoTubes: 0,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: false,
        maxMines: 0,

        standardLoadout: {
            lightTorpedoes: 0,
            noisemakers: 2, // Emergency only
            mines: 0
        },

        baseTurnRate: 0.002,
        pitchRate: 0.001,
        rollRate: 0.001,
        dragTurnMultiplier: 0.5,
        turnDecay: 0.9, // Emergency vessel - stable

        // Defensive Systems (REBALANCED: 5 tons * 1.6 HP/ton = 8 HP)
        hullArmorHP: 8,
        hullArmorPenThreshold: 5, // ~60% of hull HP
        sonarSignatureBase: 1, // Minimal signature

        hullHP: 8,
        engineHP: 4, // Scaled proportionally
        weaponsHP: 0,
        sensorsHP: 3,
        lifeSupportHP: 12, // Priority for survivors (kept higher)
        navigationHP: 6
    }
};

class OoliteFleetConfigs {

    /**
     * Light patrol - small, fast ships
     */
    static getLightPatrol(playerPos) {
        return [
            {
                path: 'models/viper.json',
                name: 'patrol_viper_1',
                scale: 1.0,
                position: {
                    x: playerPos.x + 80,
                    y: playerPos.y + 10,
                    z: playerPos.z + 60
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'interceptor',
                health: 65,
                speed: 95,
                weaponRange: 180
            },
            {
                path: 'models/sidewinder.json',
                name: 'patrol_sidewinder_1',
                scale: 1.2,
                position: {
                    x: playerPos.x - 70,
                    y: playerPos.y + 5,
                    z: playerPos.z + 80
                },
                rotation: { x: 0, y: Math.PI / 4, z: 0 },
                enemyType: 'light_fighter',
                health: 45,
                speed: 105,
                weaponRange: 150
            }
        ];
    }

    /**
     * Medium engagement - balanced force
     */
    static getMediumEngagement(playerPos) {
        return [
            {
                path: 'models/cobra3.json',
                name: 'cobra_leader',
                scale: 1.2,
                position: {
                    x: playerPos.x + 100,
                    y: playerPos.y + 20,
                    z: playerPos.z + 100
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'medium_fighter',
                health: 85,
                speed: 88,
                weaponRange: 220
            },
            {
                path: 'models/krait.json',
                name: 'krait_wingman_1',
                scale: 1.0,
                position: {
                    x: playerPos.x + 60,
                    y: playerPos.y + 10,
                    z: playerPos.z + 120
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'fighter',
                health: 70,
                speed: 92,
                weaponRange: 200
            },
            {
                path: 'models/asp.json',
                name: 'asp_recon',
                scale: 1.1,
                position: {
                    x: playerPos.x - 80,
                    y: playerPos.y + 15,
                    z: playerPos.z + 90
                },
                rotation: { x: 0, y: Math.PI / 2, z: 0 },
                enemyType: 'recon',
                health: 95,
                speed: 82,
                weaponRange: 240,
                sensorMultiplier: 1.5 // ENHANCED: 50% better passive sensors
            }
        ];
    }

    /**
     * Heavy assault - large ships with escorts
     */
    static getHeavyAssault(playerPos) {
        return [
            {
                path: 'models/anaconda.json',
                name: 'anaconda_flagship',
                scale: 1.0,
                position: {
                    x: playerPos.x + 150,
                    y: playerPos.y,
                    z: playerPos.z + 200
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'heavy_transport',
                health: 140,
                speed: 75,
                weaponRange: 280
            },
            {
                path: 'models/python.json',
                name: 'python_escort_1',
                scale: 0.9,
                position: {
                    x: playerPos.x + 100,
                    y: playerPos.y - 20,
                    z: playerPos.z + 180
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'heavy_transport',
                health: 110,
                speed: 78,
                weaponRange: 260
            },
            {
                path: 'models/ferdelance.json',
                name: 'ferdelance_escort_1',
                scale: 1.1,
                position: {
                    x: playerPos.x + 80,
                    y: playerPos.y + 25,
                    z: playerPos.z + 160
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'fighter',
                health: 80,
                speed: 98,
                weaponRange: 210
            },
            {
                path: 'models/ferdelance.json',
                name: 'ferdelance_escort_2',
                scale: 1.1,
                position: {
                    x: playerPos.x + 120,
                    y: playerPos.y - 15,
                    z: playerPos.z + 140
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'fighter',
                health: 80,
                speed: 98,
                weaponRange: 210
            }
        ];
    }

    /**
     * Mixed fleet - variety of ship types
     */
    static getMixedFleet(playerPos) {
        return [
            {
                path: 'models/boa.json',
                name: 'boa_transport',
                scale: 1.0,
                position: {
                    x: playerPos.x + 120,
                    y: playerPos.y + 30,
                    z: playerPos.z + 150
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'transport',
                health: 105,
                speed: 80,
                weaponRange: 250
            },
            {
                path: 'models/constrictor.json',
                name: 'constrictor_hunter',
                scale: 1.0,
                position: {
                    x: playerPos.x + 70,
                    y: playerPos.y - 10,
                    z: playerPos.z + 110
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'fighter',
                health: 75,
                speed: 90,
                weaponRange: 200
            },
            {
                path: 'models/gecko.json',
                name: 'gecko_scout_1',
                scale: 1.3,
                position: {
                    x: playerPos.x - 60,
                    y: playerPos.y + 20,
                    z: playerPos.z + 80
                },
                rotation: { x: 0, y: Math.PI / 3, z: 0 },
                enemyType: 'light_fighter',
                health: 55,
                speed: 102,
                weaponRange: 170
            },
            {
                path: 'models/mamba.json',
                name: 'mamba_interceptor',
                scale: 1.0,
                position: {
                    x: playerPos.x - 90,
                    y: playerPos.y + 5,
                    z: playerPos.z + 100
                },
                rotation: { x: 0, y: Math.PI / 6, z: 0 },
                enemyType: 'fighter',
                health: 68,
                speed: 96,
                weaponRange: 190
            }
        ];
    }

    /**
     * Pirate raiders - fast, aggressive ships
     */
    static getPirateRaiders(playerPos) {
        return [
            {
                path: 'models/cobra3.json',
                name: 'pirate_cobra_leader',
                scale: 1.1,
                position: {
                    x: playerPos.x + 90,
                    y: playerPos.y + 15,
                    z: playerPos.z + 70
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'pirate_leader',
                health: 90,
                speed: 86,
                weaponRange: 230
            },
            {
                path: 'models/moray.json',
                name: 'pirate_moray_1',
                scale: 1.2,
                position: {
                    x: playerPos.x + 50,
                    y: playerPos.y + 10,
                    z: playerPos.z + 90
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'pirate_raider',
                health: 70,
                speed: 94,
                weaponRange: 185
            },
            {
                path: 'models/adder.json',
                name: 'pirate_adder_1',
                scale: 1.0,
                position: {
                    x: playerPos.x + 130,
                    y: playerPos.y + 5,
                    z: playerPos.z + 50
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'pirate_transport',
                health: 80,
                speed: 84,
                weaponRange: 220
            }
        ];
    }

    /**
     * Boss encounter - single large ship with escort
     */
    static getBossEncounter(playerPos) {
        return [
            {
                path: 'models/boa2.json',
                name: 'boss_cruiser',
                scale: 1.5,
                position: {
                    x: playerPos.x + 200,
                    y: playerPos.y + 40,
                    z: playerPos.z + 300
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'boss_cruiser',
                health: 145,
                speed: 72,
                weaponRange: 300
            },
            {
                path: 'models/viper.json',
                name: 'boss_escort_1',
                scale: 0.8,
                position: {
                    x: playerPos.x + 160,
                    y: playerPos.y + 30,
                    z: playerPos.z + 280
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'elite_interceptor',
                health: 70,
                speed: 100,
                weaponRange: 180
            },
            {
                path: 'models/viper.json',
                name: 'boss_escort_2',
                scale: 0.8,
                position: {
                    x: playerPos.x + 240,
                    y: playerPos.y + 20,
                    z: playerPos.z + 320
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'elite_interceptor',
                health: 70,
                speed: 100,
                weaponRange: 180
            }
        ];
    }

    /**
     * Get random fleet configuration
     */
    static getRandomFleet(playerPos) {
        const fleets = [
            this.getLightPatrol,
            this.getMediumEngagement,
            this.getMixedFleet,
            this.getPirateRaiders
        ];

        const randomFleet = fleets[Math.floor(Math.random() * fleets.length)];
        return randomFleet(playerPos);
    }

    /**
     * Get fleet by difficulty
     */
    static getFleetByDifficulty(playerPos, difficulty = 'medium') {
        switch (difficulty.toLowerCase()) {
        case 'easy':
        case 'light':
            return this.getLightPatrol(playerPos);

        case 'medium':
        case 'normal':
            return this.getMediumEngagement(playerPos);

        case 'hard':
        case 'heavy':
            return this.getHeavyAssault(playerPos);

        case 'boss':
        case 'extreme':
            return this.getBossEncounter(playerPos);

        default:
            return this.getMixedFleet(playerPos);
        }
    }

    /**
     * Recon squadron - enhanced sensors and long-range detection
     */
    static getReconSquadron(playerPos) {
        return [
            {
                path: 'models/asp.json',
                name: 'recon_asp_leader',
                scale: 1.0,
                position: {
                    x: playerPos.x + 120,
                    y: playerPos.y + 25,
                    z: playerPos.z + 140
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'recon_leader',
                health: 90,
                speed: 85,
                weaponRange: 280,
                sensorMultiplier: 2.0 // ENHANCED: Double passive sensor range
            },
            {
                path: 'models/constrictor.json',
                name: 'recon_constrictor_1',
                scale: 0.9,
                position: {
                    x: playerPos.x + 80,
                    y: playerPos.y + 15,
                    z: playerPos.z + 160
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'recon_scout',
                health: 75,
                speed: 95,
                weaponRange: 220,
                sensorMultiplier: 1.5 // ENHANCED: 50% better passive sensors
            },
            {
                path: 'models/gecko.json',
                name: 'recon_gecko_fast',
                scale: 1.2,
                position: {
                    x: playerPos.x + 160,
                    y: playerPos.y + 10,
                    z: playerPos.z + 120
                },
                rotation: { x: 0, y: Math.PI, z: 0 },
                enemyType: 'fast_scout',
                health: 55,
                speed: 110,
                weaponRange: 180,
                sensorMultiplier: 1.8 // ENHANCED: 80% better passive sensors
            }
        ];
    }
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.OoliteFleetConfigs = OoliteFleetConfigs;
    window.OOLITE_SUBMARINE_SPECIFICATIONS = OOLITE_SUBMARINE_SPECIFICATIONS;
}

// Export for Node.js use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OoliteFleetConfigs, OOLITE_SUBMARINE_SPECIFICATIONS };
}
