// Sub War 2060 - Submarine Module

// Submarine Class Specifications from SUBMARINE_SPECIFICATIONS.txt
// VERSION: 2025-09-15-COBRA - Updated with COBRA specifications
const SUBMARINE_SPECIFICATIONS = {
    TORNADO: {
        // Physical Characteristics (updated from SUBMARINE_SPECIFICATIONS.txt)
        hullLength: 22.0, // 22.0 meters
        hullWidth: 8, // 8 meters
        hullHeight: 6, // 6 meters
        displacement: 1200, // 1200 tons
        crew: 3,
        launchers: 3,
        noisemakers: 4,

        // Performance Specifications (Medium Fighter Sub)
        maxSpeedForward: 100, // 100 knots
        maxSpeedReverse: 100, // MHD Drive - symmetric
        accelerationRate: 0.8,
        crushDepth: 1500, // 1500 meters
        emergencyDepth: 1600, // 1600 meters
        minimumDepth: 0,

        // Torpedo Capabilities
        torpedoTubes: 4,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: true, // TORNADO has mine laying capability for testing

        // Maneuverability
        baseTurnRate: 0.008,
        pitchRate: 0.002,
        rollRate: 0.0015,
        turnRateDecay: 0.7,
        dragTurnMultiplier: 1.3,
        dragTurnDamageRate: 5,

        // Defensive Systems
        hullArmorHP: 100,
        hullArmorPenThreshold: 50,
        oobleckPolymerLayer: 50,
        metaMaterialLayer: 50,
        shieldHP: 0,
        sonarSignatureBase: 6,

        // Sonar Signature Modifiers
        sonarModifiers: {
            speedMultiplier: 0.1, // +0.1 per 10 knots above 20 knots
            accelerationPenalty: 2,
            maneuveringPenalty: 3,
            dragTurnPenalty: 8,
            weaponsFirePenalty: 5,
            torpedoLaunchPenalty: 10,
            sonarPingPenalty: 15,
            depthChangePenalty: 2,
            emergencySurfacePenalty: 20,
            cavitationThreshold: 80,
            minimumSignature: 1
        },

        // Systems HP
        hullHP: 100,
        engineHP: 50,
        weaponsHP: 40,
        sensorsHP: 30,
        lifeSupportHP: 25,
        navigationHP: 35,

        // System PEN Thresholds (% of starting HP)
        systemPenThresholds: {
            hull: 0.10,
            engines: 0.70,
            weapons: 0.30,
            sensors: 0.30,
            lifeSupport: 0.30,
            navigation: 0.50
        }
    },

    LIGHTNING: {
        // Physical Characteristics (updated from SUBMARINE_SPECIFICATIONS.txt)
        hullLength: 18.0, // 18.0 meters
        hullWidth: 6.0, // 6.0 meters
        hullHeight: 4.0, // 4.0 meters
        displacement: 900, // 900 tons
        crew: 2,
        launchers: 2,
        noisemakers: 2,

        // Performance Specifications (Light Fighter Sub - NPC ONLY)
        maxSpeedForward: 120, // 120 knots (fastest class)
        maxSpeedReverse: 120, // MHD Drive - symmetric
        accelerationRate: 1.0,
        crushDepth: 950, // 950 meters
        emergencyDepth: 1050, // 1050 meters
        minimumDepth: 0,

        // Torpedo Capabilities
        torpedoTubes: 2,
        canCarryHeavyTorpedoes: false,

        // Maneuverability (most agile)
        baseTurnRate: 0.010,
        pitchRate: 0.0025,
        rollRate: 0.002,
        turnRateDecay: 0.6,
        dragTurnMultiplier: 1.4,
        dragTurnDamageRate: 8,

        // Defensive Systems
        hullArmorHP: 75,
        hullArmorPenThreshold: 38,
        oobleckPolymerLayer: 38,
        metaMaterialLayer: 37,
        shieldHP: 0,
        sonarSignatureBase: 4,

        // Sonar Signature Modifiers (Lightning - stealthiest)
        sonarModifiers: {
            speedMultiplier: 0.08, // +0.08 per 10 knots (streamlined)
            accelerationPenalty: 1.5,
            maneuveringPenalty: 2,
            dragTurnPenalty: 6,
            weaponsFirePenalty: 4,
            torpedoLaunchPenalty: 8,
            sonarPingPenalty: 12,
            depthChangePenalty: 1.5,
            emergencySurfacePenalty: 15,
            cavitationThreshold: 90,
            minimumSignature: 0.5
        },

        // Systems HP
        hullHP: 75,
        engineHP: 60,
        weaponsHP: 30,
        sensorsHP: 35,
        lifeSupportHP: 20,
        navigationHP: 40,

        systemPenThresholds: {
            hull: 0.10,
            engines: 0.70,
            weapons: 0.30,
            sensors: 0.30,
            lifeSupport: 0.30,
            navigation: 0.50
        }
    },

    TYPHOON: {
        // Physical Characteristics (updated from SUBMARINE_SPECIFICATIONS.txt)
        hullLength: 24, // 24 meters
        hullWidth: 10, // 10 meters
        hullHeight: 4, // 4 meters
        displacement: 1800, // 1800 tons
        crew: 4,
        launchers: 4,
        noisemakers: 6,

        // Performance Specifications (Heavy Fighter Sub)
        maxSpeedForward: 80, // 80 knots (slowest)
        maxSpeedReverse: 80, // MHD Drive - symmetric
        accelerationRate: 0.6,
        crushDepth: 1600, // 1600 meters (deepest rated)
        emergencyDepth: 1750, // 1750 meters
        minimumDepth: 0,

        // Torpedo Capabilities
        torpedoTubes: 4,
        canCarryHeavyTorpedoes: true,

        // Maneuverability (sluggish)
        baseTurnRate: 0.006,
        pitchRate: 0.0015,
        rollRate: 0.001,
        turnRateDecay: 0.8,
        dragTurnMultiplier: 1.1,
        dragTurnDamageRate: 3,

        // Defensive Systems (heaviest armor)
        hullArmorHP: 150,
        hullArmorPenThreshold: 40,
        oobleckPolymerLayer: 75,
        metaMaterialLayer: 75,
        shieldHP: 0,
        sonarSignatureBase: 12,

        // Sonar Signature Modifiers (Typhoon - very loud)
        sonarModifiers: {
            speedMultiplier: 0.15, // +0.15 per 10 knots (bulky)
            accelerationPenalty: 3,
            maneuveringPenalty: 4,
            dragTurnPenalty: 10,
            weaponsFirePenalty: 6,
            torpedoLaunchPenalty: 12,
            sonarPingPenalty: 18,
            depthChangePenalty: 3,
            emergencySurfacePenalty: 25,
            cavitationThreshold: 65,
            minimumSignature: 2
        },

        // Systems HP
        hullHP: 150,
        engineHP: 80,
        weaponsHP: 70,
        sensorsHP: 40,
        lifeSupportHP: 35,
        navigationHP: 30,

        systemPenThresholds: {
            hull: 0.10,
            engines: 0.70,
            weapons: 0.30,
            sensors: 0.30,
            lifeSupport: 0.30,
            navigation: 0.50
        }
    },

    HURRICANE: {
        // Physical Characteristics (corrected)
        hullLength: 69, // 69 feet = 21.0 meters
        hullWidth: 11, // Estimated beam
        hullHeight: 7, // Estimated height
        displacement: 140, // 140 tonnes
        crew: 3,

        // Performance Specifications (balanced)
        maxSpeedForward: 68, // 90 * 0.75 = 67.5 -> 68
        maxSpeedReverse: 68, // Reduced by 25%
        accelerationRate: 0.7,
        crushDepth: 18000 * 0.3048, // 18000 feet = 5486 meters (deep dive capable)
        emergencyDepth: 18500 * 0.3048,
        minimumDepth: 0,

        // Torpedo Capabilities
        torpedoTubes: 3,
        canCarryHeavyTorpedoes: true,

        // Maneuverability (balanced)
        baseTurnRate: 0.007,
        pitchRate: 0.00175,
        rollRate: 0.00125,
        turnRateDecay: 0.7,
        dragTurnMultiplier: 1.2,
        dragTurnDamageRate: 4,

        // Defensive Systems (balanced)
        hullArmorHP: 120,
        hullArmorPenThreshold: 30,
        oobleckPolymerLayer: 60,
        metaMaterialLayer: 60,
        shieldHP: 0,
        sonarSignatureBase: 8,

        // Sonar Signature Modifiers (Hurricane - balanced)
        sonarModifiers: {
            speedMultiplier: 0.12, // +0.12 per 10 knots
            accelerationPenalty: 2.5,
            maneuveringPenalty: 3.5,
            dragTurnPenalty: 9,
            weaponsFirePenalty: 5.5,
            torpedoLaunchPenalty: 11,
            sonarPingPenalty: 16,
            depthChangePenalty: 2.5,
            emergencySurfacePenalty: 22,
            cavitationThreshold: 75,
            minimumSignature: 1.5
        },

        // Systems HP
        hullHP: 120,
        engineHP: 60,
        weaponsHP: 55,
        sensorsHP: 35,
        lifeSupportHP: 30,
        navigationHP: 40,

        systemPenThresholds: {
            hull: 0.10,
            engines: 0.70,
            weapons: 0.30,
            sensors: 0.30,
            lifeSupport: 0.30,
            navigation: 0.50
        }
    },

    TEMPEST: {
        // Physical Characteristics (corrected)
        hullLength: 220, // 220 feet = 67.1 meters
        hullWidth: 24, // Estimated beam
        hullHeight: 16, // Estimated height
        displacement: 1200, // 1200 tonnes
        crew: 5,

        // Performance Specifications (command vessel)
        maxSpeedForward: 50, // 67 * 0.75 = 50.25 -> 50
        maxSpeedReverse: 50, // Reduced by 25%
        accelerationRate: 0.5,
        crushDepth: 5300 * 0.3048, // 5300 feet = 1615 meters
        emergencyDepth: 5500 * 0.3048,
        minimumDepth: 0,

        // Torpedo Capabilities
        torpedoTubes: 4,
        canCarryHeavyTorpedoes: true,

        // Maneuverability (most sluggish)
        baseTurnRate: 0.005,
        pitchRate: 0.001,
        rollRate: 0.001,
        turnRateDecay: 0.9,
        dragTurnMultiplier: 1.05,
        dragTurnDamageRate: 2,

        // Defensive Systems (command armor)
        hullArmorHP: 200,
        hullArmorPenThreshold: 45,
        oobleckPolymerLayer: 100,
        metaMaterialLayer: 100,
        shieldHP: 0,
        sonarSignatureBase: 15,

        // Sonar Signature Modifiers (Tempest - loudest)
        sonarModifiers: {
            speedMultiplier: 0.2, // +0.2 per 10 knots (command systems)
            accelerationPenalty: 4,
            maneuveringPenalty: 5,
            dragTurnPenalty: 12,
            weaponsFirePenalty: 7,
            torpedoLaunchPenalty: 15,
            sonarPingPenalty: 20,
            depthChangePenalty: 4,
            emergencySurfacePenalty: 30,
            cavitationThreshold: 60,
            minimumSignature: 3
        },

        // Systems HP
        hullHP: 200,
        engineHP: 100,
        weaponsHP: 60,
        sensorsHP: 80,
        lifeSupportHP: 50,
        navigationHP: 60,
        commandSystemsHP: 40,

        systemPenThresholds: {
            hull: 0.10,
            engines: 0.70,
            weapons: 0.30,
            sensors: 0.30,
            lifeSupport: 0.30,
            navigation: 0.50,
            commandSystems: 0.30
        }
    },

    // Deep Ocean Submarines - 6-10km crush depths for abyssal plains operation
    THUNDER: {
        // Physical Characteristics - Deep dive specialist
        hullLength: 95, // 95 feet = 29.0 meters
        hullWidth: 16, // Wider for pressure hull
        hullHeight: 12, // Taller pressure hull
        displacement: 450, // 450 tonnes - reinforced construction
        crew: 4,

        // Performance Specifications - Deep ocean capable
        maxSpeedForward: 42, // Slower due to heavy construction
        maxSpeedReverse: 42,
        accelerationRate: 0.4,
        crushDepth: 19500 * 0.3048, // 19500 feet = 5944 meters - ultra-deep ocean
        emergencyDepth: 21000 * 0.3048,
        minimumDepth: 0,

        // Torpedo Capabilities
        torpedoTubes: 3,
        canCarryHeavyTorpedoes: true,

        // Maneuverability - Heavy but stable
        baseTurnRate: 0.006,
        pitchRate: 0.0015,
        rollRate: 0.001,
        turnRateDecay: 0.8,
        dragTurnMultiplier: 1.3,
        dragTurnDamageRate: 5,

        // Defensive Systems - Reinforced for deep ocean
        hullArmorHP: 180,
        hullArmorPenThreshold: 40,
        oobleckPolymerLayer: 90,
        metaMaterialLayer: 90,
        shieldHP: 0,
        sonarSignatureBase: 12,

        // Sonar Signature Modifiers - Deep ocean stealth
        sonarModifiers: {
            speedMultiplier: 0.15, // Quiet running
            accelerationPenalty: 3.0,
            maneuveringPenalty: 4.0,
            dragTurnPenalty: 10,
            weaponsFirePenalty: 6,
            torpedoLaunchPenalty: 12,
            sonarPingPenalty: 18,
            depthChangePenalty: 2.0,
            emergencySurfacePenalty: 25,
            cavitationThreshold: 65,
            minimumSignature: 2.0
        },

        // Systems HP
        hullHP: 160,
        engineHP: 80,
        weaponsHP: 70,
        sensorsHP: 60,
        lifeSupportHP: 45,
        navigationHP: 55,

        systemPenThresholds: {
            hull: 0.10,
            engines: 0.70,
            weapons: 0.30,
            sensors: 0.30,
            lifeSupport: 0.30,
            navigation: 0.50
        }
    },

    CYCLONE: {
        // Physical Characteristics (updated from SUBMARINE_SPECIFICATIONS.txt)
        hullLength: 50.2, // 50.2 meters
        hullWidth: 21, // 21 meters
        hullHeight: 6.0, // 6.0 meters
        displacement: 1900, // 1900 tons
        crew: 4,
        launchers: 1,
        noisemakers: 3,

        // Performance Specifications (Ultra Deep Sub)
        maxSpeedForward: 70, // 70 knots (slowest for stability)
        maxSpeedReverse: 70, // MHD Drive - symmetric
        accelerationRate: 0.55,
        crushDepth: 12000, // 12000 meters (ultra deep capability)
        emergencyDepth: 12500, // 12500 meters
        minimumDepth: 0,

        // Torpedo Capabilities
        torpedoTubes: 4,
        canCarryHeavyTorpedoes: true,

        // Maneuverability - Heavily armored, slow turning
        baseTurnRate: 0.004,
        pitchRate: 0.001,
        rollRate: 0.0008,
        turnRateDecay: 0.9,
        dragTurnMultiplier: 1.4,
        dragTurnDamageRate: 6,

        // Defensive Systems - Maximum armor for deep ocean
        hullArmorHP: 250,
        hullArmorPenThreshold: 50,
        oobleckPolymerLayer: 125,
        metaMaterialLayer: 125,
        shieldHP: 0,
        sonarSignatureBase: 14,

        // Sonar Signature Modifiers - Heavy but stealthy
        sonarModifiers: {
            speedMultiplier: 0.18,
            accelerationPenalty: 3.5,
            maneuveringPenalty: 4.5,
            dragTurnPenalty: 11,
            weaponsFirePenalty: 6.5,
            torpedoLaunchPenalty: 13,
            sonarPingPenalty: 19,
            depthChangePenalty: 3.0,
            emergencySurfacePenalty: 28,
            cavitationThreshold: 55,
            minimumSignature: 2.5
        },

        // Systems HP
        hullHP: 200,
        engineHP: 90,
        weaponsHP: 80,
        sensorsHP: 70,
        lifeSupportHP: 60,
        navigationHP: 65,

        systemPenThresholds: {
            hull: 0.10,
            engines: 0.70,
            weapons: 0.30,
            sensors: 0.30,
            lifeSupport: 0.30,
            navigation: 0.50
        }
    },

    WHIRLWIND: {
        // Physical Characteristics (updated from SUBMARINE_SPECIFICATIONS.txt)
        hullLength: 60.0, // 60.0 meters
        hullWidth: 40.0, // 40.0 meters
        hullHeight: 8.0, // 8.0 meters
        displacement: 1600, // 1600 tons
        crew: 3,
        launchers: 2,
        noisemakers: 4,

        // Performance Specifications (Deep Sub)
        maxSpeedForward: 85, // 85 knots
        maxSpeedReverse: 85, // MHD Drive - symmetric
        accelerationRate: 0.65,
        crushDepth: 10000, // 10000 meters (deep diving specialist)
        emergencyDepth: 10500, // 10500 meters
        minimumDepth: 0,

        // Torpedo Capabilities
        torpedoTubes: 4,
        canCarryHeavyTorpedoes: true,

        // Maneuverability - Massive, sluggish but stable
        baseTurnRate: 0.003,
        pitchRate: 0.0008,
        rollRate: 0.0006,
        turnRateDecay: 0.95,
        dragTurnMultiplier: 1.5,
        dragTurnDamageRate: 8,

        // Defensive Systems - Ultimate deep ocean armor
        hullArmorHP: 300,
        hullArmorPenThreshold: 60,
        oobleckPolymerLayer: 150,
        metaMaterialLayer: 150,
        shieldHP: 0,
        sonarSignatureBase: 18,

        // Sonar Signature Modifiers - Large but sophisticated stealth
        sonarModifiers: {
            speedMultiplier: 0.25, // Loudest when moving due to size
            accelerationPenalty: 4.0,
            maneuveringPenalty: 5.0,
            dragTurnPenalty: 15,
            weaponsFirePenalty: 8.0,
            torpedoLaunchPenalty: 16,
            sonarPingPenalty: 22,
            depthChangePenalty: 4.0,
            emergencySurfacePenalty: 35,
            cavitationThreshold: 45,
            minimumSignature: 3.5
        },

        // Systems HP
        hullHP: 250,
        engineHP: 120,
        weaponsHP: 100,
        sensorsHP: 90,
        lifeSupportHP: 80,
        navigationHP: 85,

        systemPenThresholds: {
            hull: 0.10,
            engines: 0.70,
            weapons: 0.30,
            sensors: 0.30,
            lifeSupport: 0.30,
            navigation: 0.50
        }
    },

    // NAUTILUS - Based on TORNADO specifications for compatibility
    NAUTILUS: {
        // Physical Characteristics (corrected)
        hullLength: 86, // 86 feet = 26.2 meters
        hullWidth: 12, // Estimated beam
        hullHeight: 8, // Estimated height
        displacement: 220, // 220 tonnes
        crew: 3,

        // Performance Specifications
        maxSpeedForward: 64, // 85 * 0.75 = 63.75 -> 64
        maxSpeedReverse: 64, // Reduced by 25%
        accelerationRate: 0.8,
        crushDepth: 4600 * 0.3048, // 4600 feet = 1402 meters
        emergencyDepth: 4800 * 0.3048,
        minimumDepth: 0,

        // Torpedo Capabilities
        torpedoTubes: 4,
        canCarryHeavyTorpedoes: false,
        hasMineLayer: true, // TORNADO has mine laying capability for testing

        // Maneuverability
        baseTurnRate: 0.008,
        pitchRate: 0.002,
        rollRate: 0.0015,
        turnRateDecay: 0.7,
        dragTurnMultiplier: 1.3,
        dragTurnDamageRate: 5,

        // Defensive Systems
        hullArmorHP: 100,
        hullArmorPenThreshold: 50,
        oobleckPolymerLayer: 50,
        metaMaterialLayer: 50,
        shieldHP: 0,
        sonarSignatureBase: 6,

        // Sonar Signature Modifiers
        sonarModifiers: {
            speedMultiplier: 0.1, // +0.1 per 10 knots above 20 knots
            accelerationPenalty: 2,
            maneuveringPenalty: 3,
            dragTurnPenalty: 8,
            weaponsFirePenalty: 5,
            torpedoLaunchPenalty: 10,
            sonarPingPenalty: 15,
            depthChangePenalty: 2,
            emergencySurfacePenalty: 20,
            cavitationThreshold: 80,
            bottomBouncingReduction: 0.3
        },

        // System Health Characteristics
        systemFailureRates: {
            weapons: 0.15,
            propulsion: 0.12,
            sonar: 0.18,
            sensors: 0.20,
            lifeSupport: 0.25,
            navigation: 0.10
        },

        // Combat Systems
        weaponsHP: 95,
        propulsionHP: 90,
        sensorsHP: 80,
        sonarHP: 85,
        lifeSupportHP: 75,
        navigationHP: 85,

        systemPenThresholds: {
            hull: 0.10,
            engines: 0.70,
            weapons: 0.30,
            sensors: 0.30,
            lifeSupport: 0.30,
            navigation: 0.50
        }
    },

    COBRA: {
        // Cobra Mk III adapted for submarine warfare
        // Based on Oolite's iconic ship design
        hullLength: 65, // Compact and maneuverable
        hullWidth: 15, // Wide for stability
        hullHeight: 8,
        displacement: 180, // Lighter than TORNADO
        crew: 2, // Minimal crew like Elite ships

        // Performance Specifications
        maxSpeedForward: 75, // Fast and agile like the space version
        maxSpeedReverse: 60,
        accelerationRate: 1.0, // Better acceleration than TORNADO
        crushDepth: 3500 * 0.3048, // 3500 feet = ~1067 meters
        emergencyDepth: 3800 * 0.3048,
        minimumDepth: 0,

        // Torpedo Capabilities
        torpedoTubes: 4, // Same as TORNADO
        canCarryHeavyTorpedoes: true, // Cobra can handle heavy weapons
        hasMineLayer: false, // No mine layer capability

        // Maneuverability - Enhanced for Cobra's agility
        baseTurnRate: 0.012, // Better turn rate than TORNADO
        pitchRate: 0.003,
        rollRate: 0.002,
        turnRateDecay: 0.6, // Better handling
        dragTurnMultiplier: 1.2,
        dragTurnDamageRate: 4,

        // Defensive Systems
        hullArmorHP: 90, // Slightly less armor than TORNADO
        hullArmorPenThreshold: 45,
        oobleckPolymerLayer: 45,
        metaMaterialLayer: 45,
        shieldHP: 0,
        sonarSignatureBase: 5, // Quieter than TORNADO

        // Sonar Signature Modifiers
        sonarModifiers: {
            speedMultiplier: 0.08, // Better stealth characteristics
            accelerationPenalty: 1.5,
            maneuveringPenalty: 2.5,
            dragTurnPenalty: 6,
            weaponsFirePenalty: 4,
            torpedoLaunchPenalty: 8,
            sonarPingPenalty: 12,
            depthChangePenalty: 1.5,
            emergencySurfacePenalty: 15,
            cavitationThreshold: 85, // Better cavitation resistance
            bottomBouncingReduction: 0.4
        },

        // System Health Characteristics
        systemFailureRates: {
            weapons: 0.12, // More reliable systems
            propulsion: 0.10,
            sonar: 0.15,
            sensors: 0.18,
            lifeSupport: 0.20,
            navigation: 0.08
        },

        // Combat Systems
        weaponsHP: 100, // Strong weapons systems
        propulsionHP: 95,
        sensorsHP: 85,
        sonarHP: 90,
        lifeSupportHP: 80,
        navigationHP: 90,

        systemPenThresholds: {
            hull: 0.12,
            engines: 0.65,
            weapons: 0.25,
            sensors: 0.28,
            lifeSupport: 0.25,
            navigation: 0.45
        }
    },

    // NPC-ONLY SUBMARINE CLASSES FROM SUBMARINE_SPECIFICATIONS.txt

    THUNDER: {
        hullLength: 16.0, hullWidth: 5.0, hullHeight: 3.5, displacement: 700, crew: 2,
        launchers: 2, noisemakers: 2, maxSpeedForward: 110, maxSpeedReverse: 110,
        accelerationRate: 0.9, crushDepth: 1000, emergencyDepth: 1100, minimumDepth: 0,
        torpedoTubes: 2, canCarryHeavyTorpedoes: false, baseTurnRate: 0.009,
        hullArmorHP: 80, sonarSignatureBase: 5,
        // System HP
        hullHP: 75, engineHP: 45, weaponsHP: 35, sensorsHP: 30, lifeSupportHP: 20, navigationHP: 35
    },

    SQUALL: {
        hullLength: 20.0, hullWidth: 7.0, hullHeight: 5.0, displacement: 1000, crew: 3,
        launchers: 3, noisemakers: 4, maxSpeedForward: 90, maxSpeedReverse: 90,
        accelerationRate: 0.7, crushDepth: 1100, emergencyDepth: 1200, minimumDepth: 0,
        torpedoTubes: 3, canCarryHeavyTorpedoes: false, baseTurnRate: 0.007,
        hullArmorHP: 110, sonarSignatureBase: 8,
        // System HP
        hullHP: 100, engineHP: 55, weaponsHP: 45, sensorsHP: 35, lifeSupportHP: 25, navigationHP: 40
    },

    FURY: {
        hullLength: 80.0, hullWidth: 15.0, hullHeight: 12.0, displacement: 3500, crew: 10,
        launchers: 0, noisemakers: 3, maxSpeedForward: 40, maxSpeedReverse: 40,
        accelerationRate: 0.3, crushDepth: 5500, emergencyDepth: 6000, minimumDepth: 0,
        torpedoTubes: 0, canCarryHeavyTorpedoes: false, baseTurnRate: 0.003,
        hullArmorHP: 200, sonarSignatureBase: 15,
        // System HP (Transport - Heavy life support, no weapons)
        hullHP: 180, engineHP: 90, weaponsHP: 0, sensorsHP: 60, lifeSupportHP: 120, navigationHP: 70
    },

    HAILSTORM: {
        hullLength: 25.0, hullWidth: 8.0, hullHeight: 6.0, displacement: 1200, crew: 3,
        launchers: 1, noisemakers: 2, maxSpeedForward: 70, maxSpeedReverse: 70,
        accelerationRate: 0.6, crushDepth: 1100, emergencyDepth: 1200, minimumDepth: 0,
        torpedoTubes: 1, canCarryHeavyTorpedoes: false, baseTurnRate: 0.006,
        hullArmorHP: 90, sonarSignatureBase: 9,
        // System HP (Light Trader)
        hullHP: 85, engineHP: 50, weaponsHP: 20, sensorsHP: 40, lifeSupportHP: 30, navigationHP: 45
    },

    JUMBO: {
        hullLength: 120.0, hullWidth: 25.0, hullHeight: 18.0, displacement: 8000, crew: 8,
        launchers: 0, noisemakers: 2, maxSpeedForward: 30, maxSpeedReverse: 30,
        accelerationRate: 0.2, crushDepth: 700, emergencyDepth: 800, minimumDepth: 0,
        torpedoTubes: 0, canCarryHeavyTorpedoes: false, baseTurnRate: 0.002,
        hullArmorHP: 300, sonarSignatureBase: 20,
        // System HP (Massive Cargo - No weapons, huge engines)
        hullHP: 250, engineHP: 150, weaponsHP: 0, sensorsHP: 40, lifeSupportHP: 60, navigationHP: 50
    },

    TSUNAMI: {
        hullLength: 150.0, hullWidth: 35.0, hullHeight: 20.0, displacement: 12000, crew: 25,
        launchers: 10, noisemakers: 20, maxSpeedForward: 60, maxSpeedReverse: 60,
        accelerationRate: 0.4, crushDepth: 4500, emergencyDepth: 5000, minimumDepth: 0,
        torpedoTubes: 10, canCarryHeavyTorpedoes: true, baseTurnRate: 0.002,
        hullArmorHP: 500, sonarSignatureBase: 25,
        // System HP (Strategic Carrier - Maximum systems)
        hullHP: 400, engineHP: 200, weaponsHP: 150, sensorsHP: 120, lifeSupportHP: 100, navigationHP: 90
    },

    QUEST: {
        hullLength: 100.0, hullWidth: 30.0, hullHeight: 15.0, displacement: 6000, crew: 15,
        launchers: 6, noisemakers: 20, maxSpeedForward: 50, maxSpeedReverse: 50,
        accelerationRate: 0.4, crushDepth: 12000, emergencyDepth: 12500, minimumDepth: 0,
        torpedoTubes: 6, canCarryHeavyTorpedoes: true, baseTurnRate: 0.003,
        hullArmorHP: 400, sonarSignatureBase: 18,
        // System HP (Ultra Deep Strategic)
        hullHP: 320, engineHP: 120, weaponsHP: 100, sensorsHP: 100, lifeSupportHP: 80, navigationHP: 85
    },

    ADVENTURE: {
        hullLength: 85.0, hullWidth: 25.0, hullHeight: 12.0, displacement: 4500, crew: 12,
        launchers: 4, noisemakers: 10, maxSpeedForward: 60, maxSpeedReverse: 60,
        accelerationRate: 0.5, crushDepth: 9000, emergencyDepth: 9500, minimumDepth: 0,
        torpedoTubes: 4, canCarryHeavyTorpedoes: true, baseTurnRate: 0.004,
        hullArmorHP: 350, sonarSignatureBase: 15,
        // System HP (Deep Strategic)
        hullHP: 280, engineHP: 100, weaponsHP: 80, sensorsHP: 85, lifeSupportHP: 70, navigationHP: 75
    },

    MISSION: {
        hullLength: 70.0, hullWidth: 20.0, hullHeight: 10.0, displacement: 3200, crew: 8,
        launchers: 3, noisemakers: 6, maxSpeedForward: 65, maxSpeedReverse: 65,
        accelerationRate: 0.6, crushDepth: 8000, emergencyDepth: 8500, minimumDepth: 0,
        torpedoTubes: 3, canCarryHeavyTorpedoes: true, baseTurnRate: 0.005,
        hullArmorHP: 280, sonarSignatureBase: 12,
        // System HP (Deep Tactical)
        hullHP: 220, engineHP: 85, weaponsHP: 70, sensorsHP: 75, lifeSupportHP: 55, navigationHP: 65
    }
};

// Torpedo Type Specifications
const TORPEDO_SPECIFICATIONS = {
    LT: { // Light Torpedo
        name: 'Light Torpedo',
        damage: 50,
        maxSpeed: 200, // knots - fastest
        scavSpeed: 100,
        maneuverability: 0.9, // High maneuverability - most maneuverable
        lockTime: 2000, // ms for active sonar - quick lock-on
        passiveLockTime: 4000, // ms for passive
        terminalRange: 300, // meters
        maxRange: 4000, // meters
        loadTime: 30000, // 30 seconds load time (torpedo type change time)
        restrictedTo: [], // All subs can carry
        canInterceptTorpedoes: true // Can shoot down other torpedoes
    },
    MT: { // Medium Torpedo
        name: 'Medium Torpedo',
        damage: 100, // Half way between Light and Heavy
        maxSpeed: 160, // knots - medium speed
        scavSpeed: 80,
        maneuverability: 0.6, // Medium maneuverability
        lockTime: 5000, // ms for active sonar - medium lock-on
        passiveLockTime: 10000, // ms for passive
        terminalRange: 400, // meters
        maxRange: 6000, // meters
        loadTime: 30000, // 30 seconds load time (torpedo type change time)
        restrictedTo: [] // All subs can carry
    },
    HT: { // Heavy Torpedo
        name: 'Heavy Torpedo',
        damage: 150, // highest damage
        maxSpeed: 130, // knots - slowest
        scavSpeed: 60, // Speed when entering terminal attack
        maneuverability: 0.3, // Low maneuverability - least maneuverable
        lockTime: 8000, // ms for active sonar - slowest lock-on
        passiveLockTime: 15000, // ms for passive
        terminalRange: 500, // meters - when to go active/SCAV
        maxRange: 8000, // meters
        loadTime: 30000, // 30 seconds load time (torpedo type change time)
        restrictedTo: [] // All subs can carry (removed restrictions)
    },
    DN: { // Drone Torpedo
        name: 'Drone',
        damage: 0, // No damage - reconnaissance only
        maxSpeed: 100, // knots - moderate speed
        scavSpeed: 100, // Same speed throughout
        maneuverability: 0.0, // No maneuverability - travels straight
        lockTime: 0, // No lock required
        passiveLockTime: 0, // No lock required
        terminalRange: 0, // Not applicable
        maxRange: Infinity, // Travels until map edge or terrain collision
        loadTime: 30000, // 30 seconds load time
        restrictedTo: [], // All subs can carry
        isDrone: true, // Flag to identify drone torpedoes
        activationRange: 1000, // 1km - when bubble rendering starts
        bubbleRadius: 2000 // 2km diameter bubble around drone
    }
};

// AudioManager class for comprehensive sound system
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.sfxGain = null;
        this.musicGain = null;
        this.ambientGain = null;
        
        // Volume settings (0.0 to 1.0)
        this.volumes = {
            master: 0.7,
            sfx: 0.8,
            music: 0.6,
            ambient: 0.5
        };
        
        // Audio sources
        this.engineOscillator = null;
        this.ambientSources = [];
        this.activeSources = new Set();
        
        // Sound file cache
        this.soundCache = new Map();
        this.soundDirectory = 'SOUNDS/';
        
        // Active sound loops
        this.activeSonarLoop = null;
        this.ambienceLoop = null;
        this.deepAmbienceLoop = null;
        this.proximityLoop = null;
        
        // Torpedo ping timers
        this.torpedoPingTimers = new Map(); // Map of torpedo ID -> ping timer data
        
        // Engine sound parameters
        this.engineParams = {
            baseFrequency: 60,    // Low submarine engine rumble
            speedMultiplier: 2.0, // How much speed affects frequency
            noiseAmount: 0.3      // Engine noise/vibration amount
        };
        
        // Background tension music parameters
        this.musicParams = {
            baseFrequency: 220,   // A3 note
            tensionLevel: 0.0,    // 0.0 = calm, 1.0 = maximum tension
            lastTensionUpdate: 0
        };
        
        this.init();
    }
    
    init() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create gain nodes for volume control
            this.masterGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();
            this.musicGain = this.audioContext.createGain();
            this.ambientGain = this.audioContext.createGain();
            
            // Connect gain nodes
            this.sfxGain.connect(this.masterGain);
            this.musicGain.connect(this.masterGain);
            this.ambientGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);
            
            // Set initial volumes
            this.updateVolumes();
            
            // Preload sound files
            this.preloadSounds();
            
            console.log('🔊 AudioManager initialized successfully');
        } catch (error) {
            console.warn('AudioManager: Web Audio API not supported', error);
        }
    }
    
    // Preload common sound files
    preloadSounds() {
        const soundsToPreload = [
            'active_constant_pinging',
            'active_single_ping',
            'torpedo_launch',
            'underwater_ambience',
            'deep_underwater_ambience',
            'knuckle',
            'underwater_explosion',
            'underwater_impact',
            'hit',
            'proximity'
        ];
        
        soundsToPreload.forEach(soundName => {
            this.loadSoundFile(soundName);
        });
    }
    
    // Load sound file (supports .wav and .mp3)
    async loadSoundFile(filename) {
        if (this.soundCache.has(filename)) {
            return this.soundCache.get(filename);
        }
        
        return new Promise((resolve, reject) => {
            // Try .wav first, then .mp3
            const extensions = ['.wav', '.mp3'];
            let currentExtension = 0;
            
            const tryLoad = () => {
                const fullPath = this.soundDirectory + filename + extensions[currentExtension];
                const audio = new Audio();
                
                audio.addEventListener('canplaythrough', () => {
                    this.soundCache.set(filename, audio);
                    resolve(audio);
                });
                
                audio.addEventListener('error', () => {
                    currentExtension++;
                    if (currentExtension < extensions.length) {
                        tryLoad();
                    } else {
                        console.warn(`Failed to load sound file: ${filename} (tried .wav and .mp3)`);
                        reject(new Error(`Could not load ${filename}`));
                    }
                });
                
                audio.src = fullPath;
                audio.load();
            };
            
            tryLoad();
        });
    }
    
    // Play sound file (one-shot)
    async playSoundFile(filename, volume = 1.0, loop = false) {
        try {
            let audio = this.soundCache.get(filename);
            if (!audio) {
                audio = await this.loadSoundFile(filename);
            }
            
            // Clone audio for one-shot playback (allows overlapping sounds)
            const audioClone = audio.cloneNode();
            audioClone.volume = Math.max(0, Math.min(1, volume)) * this.volumes.sfx;
            audioClone.loop = loop;
            
            // Connect to SFX gain node if possible
            if (this.audioContext && audioClone.setSinkId) {
                // Modern browsers
                audioClone.play().catch(err => console.warn(`Failed to play ${filename}:`, err));
            } else {
                // Fallback for older browsers
                audioClone.play().catch(err => console.warn(`Failed to play ${filename}:`, err));
            }
            
            // Track active source
            this.activeSources.add(audioClone);
            audioClone.addEventListener('ended', () => {
                this.activeSources.delete(audioClone);
            });
            
            return audioClone;
        } catch (error) {
            console.warn(`Failed to play sound file ${filename}:`, error);
            return null;
        }
    }
    
    // Stop a specific sound file
    stopSoundFile(audioInstance) {
        if (audioInstance) {
            audioInstance.pause();
            audioInstance.currentTime = 0;
            this.activeSources.delete(audioInstance);
        }
    }
    
    updateVolumes() {
        if (!this.masterGain) return;
        
        this.masterGain.gain.value = this.volumes.master;
        this.sfxGain.gain.value = this.volumes.sfx;
        this.musicGain.gain.value = this.volumes.music;
        this.ambientGain.gain.value = this.volumes.ambient;
    }
    
    setVolume(type, value) {
        this.volumes[type] = Math.max(0, Math.min(1, value));
        this.updateVolumes();
    }
    
    // Engine sound management
    startEngine() {
        if (!this.audioContext || this.engineOscillator) return;
        
        try {
            // Create main engine oscillator (low frequency rumble)
            this.engineOscillator = this.audioContext.createOscillator();
            const engineGain = this.audioContext.createGain();
            const engineFilter = this.audioContext.createBiquadFilter();
            
            // Set up engine sound characteristics
            this.engineOscillator.type = 'sawtooth';
            this.engineOscillator.frequency.value = this.engineParams.baseFrequency;
            
            // Low-pass filter for realistic engine muffling underwater
            engineFilter.type = 'lowpass';
            engineFilter.frequency.value = 200;
            engineFilter.Q.value = 0.5;
            
            // Connect audio chain
            this.engineOscillator.connect(engineFilter);
            engineFilter.connect(engineGain);
            engineGain.connect(this.ambientGain);
            
            // Set engine volume
            engineGain.gain.value = 0.15;
            
            // Start engine
            this.engineOscillator.start();
            
            console.log('🚢 Engine audio started');
        } catch (error) {
            console.warn('Failed to start engine audio:', error);
        }
    }
    
    updateEngineSound(speed, isAccelerating = false) {
        if (!this.engineOscillator) return;
        
        try {
            // Calculate frequency based on speed (higher speed = higher pitch)
            const speedFactor = Math.min(speed / 50, 2.0); // Cap at 2x base frequency
            const targetFrequency = this.engineParams.baseFrequency * (1 + speedFactor * this.engineParams.speedMultiplier);
            
            // Add acceleration modifier
            const accelModifier = isAccelerating ? 1.2 : 1.0;
            
            // Smooth frequency transition
            this.engineOscillator.frequency.setTargetAtTime(
                targetFrequency * accelModifier,
                this.audioContext.currentTime,
                0.1
            );
        } catch (error) {
            console.warn('Failed to update engine sound:', error);
        }
    }
    
    stopEngine() {
        if (this.engineOscillator) {
            try {
                this.engineOscillator.stop();
                this.engineOscillator = null;
                console.log('🚢 Engine audio stopped');
            } catch (error) {
                console.warn('Failed to stop engine audio:', error);
            }
        }
    }
    
    // Sound effect methods
    playTorpedoLaunch() {
        // Play torpedo launch sound file
        this.playSoundFile('torpedo_launch', 0.8);
        console.log('🚀 Torpedo launch sound played');
    }
    
    // Start active sonar constant pinging loop
    startActiveSonarPinging() {
        if (this.activeSonarLoop) return; // Already playing
        
        this.playSoundFile('active_constant_pinging', 0.6, true).then(audio => {
            if (audio) {
                this.activeSonarLoop = audio;
            }
        });
        console.log('📡 Active sonar constant pinging started');
    }
    
    // Stop active sonar constant pinging
    stopActiveSonarPinging() {
        if (this.activeSonarLoop) {
            this.stopSoundFile(this.activeSonarLoop);
            this.activeSonarLoop = null;
            console.log('📡 Active sonar constant pinging stopped');
        }
    }
    
    // Play single active ping
    playActiveSinglePing() {
        this.playSoundFile('active_single_ping', 0.7);
        console.log('📡 Active single ping played');
    }
    
    // Start ambience (underwater_ambience down to 3000m, then fade to deep_underwater_ambience)
    startAmbience(depth) {
        const depthThreshold = -3000; // 3000m depth
        
        if (depth >= depthThreshold) {
            // Above 3000m - play underwater_ambience
            if (!this.ambienceLoop) {
                this.playSoundFile('underwater_ambience', 0.5, true).then(audio => {
                    if (audio) {
                        this.ambienceLoop = audio;
                    }
                });
            }
            // Stop deep ambience if playing
            if (this.deepAmbienceLoop) {
                this.stopSoundFile(this.deepAmbienceLoop);
                this.deepAmbienceLoop = null;
            }
        } else {
            // Below 3000m - fade to deep_underwater_ambience
            const fadeProgress = Math.min(1, Math.abs(depth - depthThreshold) / 1000); // Fade over 1km
            
            // Start deep ambience if not playing
            if (!this.deepAmbienceLoop) {
                this.playSoundFile('deep_underwater_ambience', 0.5 * fadeProgress, true).then(audio => {
                    if (audio) {
                        this.deepAmbienceLoop = audio;
                    }
                });
            }
            
            // Fade ambience volumes
            if (this.ambienceLoop) {
                this.ambienceLoop.volume = 0.5 * (1 - fadeProgress);
            }
            if (this.deepAmbienceLoop) {
                this.deepAmbienceLoop.volume = 0.5 * fadeProgress;
            }
        }
    }
    
    // Play knuckle sound (2 seconds)
    playKnuckle() {
        this.playSoundFile('knuckle', 0.7).then(audio => {
            if (audio && audio.duration > 2) {
                // Stop after 2 seconds if longer
                setTimeout(() => {
                    this.stopSoundFile(audio);
                }, 2000);
            }
        });
        console.log('🌀 Knuckle sound played (2 seconds)');
    }
    
    // Play underwater explosion (submarine/structure implosion)
    playUnderwaterExplosion() {
        this.playSoundFile('underwater_explosion', 0.8);
        console.log('💥 Underwater explosion sound played');
    }
    
    // Play underwater impact (sub collision)
    playUnderwaterImpact() {
        this.playSoundFile('underwater_impact', 0.7);
        console.log('💥 Underwater impact sound played');
    }
    
    // Play hit sound (torpedo hits but doesn't destroy)
    playHit() {
        this.playSoundFile('hit', 0.6);
        console.log('💥 Hit sound played');
    }
    
    // Start proximity sound (fades with distance, starts at 1000m)
    updateProximitySound(distance) {
        const proximityRange = 1000; // Start at 1000m
        
        if (distance <= proximityRange) {
            // Calculate volume based on distance (closer = louder)
            const volume = Math.max(0.1, 1.0 - (distance / proximityRange));
            
            if (!this.proximityLoop) {
                this.playSoundFile('proximity', volume, true).then(audio => {
                    if (audio) {
                        this.proximityLoop = audio;
                    }
                });
            } else {
                // Update volume smoothly
                this.proximityLoop.volume = volume * this.volumes.sfx;
            }
        } else {
            // Stop proximity sound if too far
            if (this.proximityLoop) {
                this.stopSoundFile(this.proximityLoop);
                this.proximityLoop = null;
            }
        }
    }
    
    // Start torpedo ping sound (distance-based ping rate)
    startTorpedoPing(torpedoId, distanceToTarget, hasTarget = true) {
        // Stop existing ping for this torpedo
        this.stopTorpedoPing(torpedoId);
        
        if (!hasTarget || distanceToTarget > 2000) {
            // Too far or no target - don't ping
            return;
        }
        
        // Calculate ping interval: starts at 3 seconds (2km), reduces to 0.2 seconds (close)
        // Linear interpolation
        const maxDistance = 2000; // 2km
        const minDistance = 50; // 50m (very close)
        const maxInterval = 3.0; // 3 seconds
        const minInterval = 0.2; // 0.2 seconds
        
        const clampedDistance = Math.max(minDistance, Math.min(maxDistance, distanceToTarget));
        const pingInterval = maxInterval - ((maxInterval - minInterval) * (1 - (clampedDistance - minDistance) / (maxDistance - minDistance)));
        
        // Store ping timer data
        const pingData = {
            torpedoId: torpedoId,
            interval: pingInterval,
            lastPingTime: Date.now(),
            audioInstance: null,
            targetDistance: distanceToTarget,
            hasTarget: hasTarget
        };
        
        // Play first ping immediately
        this.playTorpedoPingSound(torpedoId, pingData);
        
        this.torpedoPingTimers.set(torpedoId, pingData);
    }
    
    // Play individual torpedo ping sound
    playTorpedoPingSound(torpedoId, pingData) {
        this.playSoundFile('active_single_pings', 0.5).then(audio => {
            if (audio && pingData) {
                pingData.audioInstance = audio;
                pingData.lastPingTime = Date.now();
            }
        });
    }
    
    // Update torpedo ping (call every frame to update ping rate)
    updateTorpedoPing(torpedoId, distanceToTarget, hasTarget = true) {
        const pingData = this.torpedoPingTimers.get(torpedoId);
        if (!pingData) {
            // Start ping if in range
            if (hasTarget && distanceToTarget <= 2000) {
                this.startTorpedoPing(torpedoId, distanceToTarget, hasTarget);
            }
            return;
        }
        
        // Update target distance
        pingData.targetDistance = distanceToTarget;
        pingData.hasTarget = hasTarget;
        
        // If target lost or too far, slow down and stop
        if (!hasTarget || distanceToTarget > 2000) {
            // Gradually increase interval until it stops
            pingData.interval = Math.min(10, pingData.interval * 1.1); // Slow down gradually
            
            // Stop if interval gets too long
            if (pingData.interval >= 10) {
                this.stopTorpedoPing(torpedoId);
                return;
            }
        } else {
            // Recalculate ping interval based on distance
            const maxDistance = 2000;
            const minDistance = 50;
            const maxInterval = 3.0;
            const minInterval = 0.2;
            
            const clampedDistance = Math.max(minDistance, Math.min(maxDistance, distanceToTarget));
            pingData.interval = maxInterval - ((maxInterval - minInterval) * (1 - (clampedDistance - minDistance) / (maxDistance - minDistance)));
        }
        
        // Check if it's time for next ping
        const timeSinceLastPing = Date.now() - pingData.lastPingTime;
        if (timeSinceLastPing >= pingData.interval * 1000) {
            this.playTorpedoPingSound(torpedoId, pingData);
        }
    }
    
    // Stop torpedo ping
    stopTorpedoPing(torpedoId) {
        const pingData = this.torpedoPingTimers.get(torpedoId);
        if (pingData) {
            if (pingData.audioInstance) {
                this.stopSoundFile(pingData.audioInstance);
            }
            this.torpedoPingTimers.delete(torpedoId);
        }
    }
    
    playTorpedoExplosion(distance = 1000) {
        // Volume decreases with distance
        const volume = Math.max(0.1, Math.min(0.8, 1000 / distance));
        
        this.playSoundEffect({
            type: 'noise',
            frequency: 80,
            duration: 2.0,
            volume: volume,
            filterSweep: { start: 200, end: 50 }
        });
        console.log(`💥 Torpedo explosion sound played (distance: ${distance.toFixed(0)}m)`);
    }
    
    playSonarPing() {
        this.playSoundEffect({
            type: 'sine',
            frequency: 1000,
            duration: 0.3,
            volume: 0.3,
            frequencySweep: { start: 1200, end: 800 }
        });
        console.log('📡 Sonar ping sound played');
    }
    
    playContactDetected() {
        this.playSoundEffect({
            type: 'triangle',
            frequency: 600,
            duration: 0.5,
            volume: 0.25
        });
        console.log('🎯 Contact detected sound played');
    }
    
    playHullStress() {
        this.playSoundEffect({
            type: 'sawtooth',
            frequency: 45,
            duration: 1.2,
            volume: 0.2,
            filterSweep: { start: 80, end: 40 }
        });
        console.log('🏗️ Hull stress sound played');
    }
    
    // Ambient underwater soundscape
    startAmbientSounds() {
        if (!this.audioContext) return;
        
        // Create subtle underwater ambience
        this.createAmbientSource('water', {
            type: 'noise',
            frequency: 30,
            volume: 0.08,
            continuous: true
        });
        
        // Occasional distant creaking/settling sounds
        this.createAmbientSource('creaking', {
            type: 'sawtooth',
            frequency: 120,
            volume: 0.05,
            intermittent: true,
            interval: { min: 8000, max: 20000 } // 8-20 second intervals
        });
        
        console.log('🌊 Ambient underwater sounds started');
    }
    
    createAmbientSource(name, params) {
        if (!this.audioContext) return;
        
        try {
            const source = {
                name: name,
                oscillator: null,
                gain: null,
                filter: null,
                params: params,
                nextTrigger: 0
            };
            
            if (params.continuous) {
                source.oscillator = this.audioContext.createOscillator();
                source.gain = this.audioContext.createGain();
                source.filter = this.audioContext.createBiquadFilter();
                
                source.oscillator.type = params.type === 'noise' ? 'sawtooth' : params.type;
                source.oscillator.frequency.value = params.frequency;
                
                source.filter.type = 'lowpass';
                source.filter.frequency.value = params.frequency * 2;
                
                source.oscillator.connect(source.filter);
                source.filter.connect(source.gain);
                source.gain.connect(this.ambientGain);
                
                source.gain.gain.value = params.volume;
                source.oscillator.start();
            }
            
            this.ambientSources.push(source);
        } catch (error) {
            console.warn(`Failed to create ambient source ${name}:`, error);
        }
    }
    
    updateAmbientSounds() {
        const currentTime = Date.now();
        
        this.ambientSources.forEach(source => {
            if (source.params.intermittent && currentTime > source.nextTrigger) {
                this.playIntermittentAmbient(source);
                
                // Schedule next trigger
                const min = source.params.interval.min;
                const max = source.params.interval.max;
                source.nextTrigger = currentTime + min + Math.random() * (max - min);
            }
        });
    }
    
    playIntermittentAmbient(source) {
        this.playSoundEffect({
            type: source.params.type,
            frequency: source.params.frequency + (Math.random() - 0.5) * 40,
            duration: 0.3 + Math.random() * 0.7,
            volume: source.params.volume * (0.5 + Math.random() * 0.5),
            gainNode: this.ambientGain
        });
    }
    
    // Background music system
    updateTensionLevel(threatLevel, contacts, combatState) {
        let newTension = 0.0;
        
        // Base tension from threat level
        const threatTension = {
            'NONE': 0.0,
            'LOW': 0.2,
            'MEDIUM': 0.4,
            'HIGH': 0.7,
            'CRITICAL': 1.0
        };
        newTension += threatTension[threatLevel] || 0.0;
        
        // Add tension for contacts
        newTension += Math.min(contacts * 0.1, 0.3);
        
        // Combat state modifier
        if (combatState === 'ENGAGED') newTension += 0.4;
        else if (combatState === 'ALERT') newTension += 0.2;
        
        // Clamp tension level
        this.musicParams.tensionLevel = Math.max(0.0, Math.min(1.0, newTension));
    }
    
    // Generic sound effect player
    playSoundEffect(params) {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const targetGain = params.gainNode || this.sfxGain;
            
            oscillator.type = params.type || 'sine';
            oscillator.frequency.value = params.frequency || 440;
            
            // Set up filter if specified
            if (params.filterSweep) {
                const filter = this.audioContext.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = params.filterSweep.start;
                filter.frequency.setTargetAtTime(
                    params.filterSweep.end,
                    this.audioContext.currentTime,
                    params.duration * 0.3
                );
                oscillator.connect(filter);
                filter.connect(gain);
            } else {
                oscillator.connect(gain);
            }
            
            gain.connect(targetGain);
            
            // Set up volume envelope
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(params.volume, this.audioContext.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + params.duration);
            
            // Frequency sweep if specified
            if (params.frequencySweep) {
                oscillator.frequency.setTargetAtTime(
                    params.frequencySweep.end,
                    this.audioContext.currentTime,
                    params.duration * 0.3
                );
            }
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + params.duration);
            
            // Track active sources for cleanup
            this.activeSources.add(oscillator);
            oscillator.addEventListener('ended', () => {
                this.activeSources.delete(oscillator);
            });
            
        } catch (error) {
            console.warn('Failed to play sound effect:', error);
        }
    }
    
    // Cleanup method
    dispose() {
        if (this.engineOscillator) {
            this.stopEngine();
        }
        
        // Stop all ambient sources
        this.ambientSources.forEach(source => {
            if (source.oscillator) {
                try {
                    source.oscillator.stop();
                } catch (error) {
                    // Oscillator may already be stopped
                }
            }
        });
        
        // Stop all active sources
        this.activeSources.forEach(source => {
            try {
                source.stop();
            } catch (error) {
                // Source may already be stopped
            }
        });
        
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        
        console.log('🔊 AudioManager disposed');
    }
}

// Submarine class for player vessel
class Submarine {
    constructor(scene, submarineClass = 'COBRA', isNPC = false) {
        this.scene = scene;
        this.mesh = null;
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isNPC = isNPC;

        // Initialize Audio Manager
        this.audioManager = new AudioManager();

        // Initialize Integrated Mapping System
        this.mappingSystem = null; // Will be initialized after game state is ready

        // Submarine fighter class and stats
        this.submarineClass = submarineClass; // Use provided class or default

        // Initialize submarine with class specifications
        this.initializeSubmarineClass(this.submarineClass);

        // Initialize dynamic values (not set by class specifications)
        this.speed = 0;
        this.depth = 0;
        this.dragTurnActive = false;
        this.oobleckRedistributionRate = 1.0; // 1% per second

        // Movement state - New control scheme
        this.keys = {
            pitchDown: false,      // W - pitch down (dive)
            pitchUp: false,        // S - pitch up (climb)
            yawLeft: false,        // A - yaw left
            yawRight: false,       // D - yaw right
            decreaseDepth: false,  // Q - decrease depth (up)
            increaseDepth: false,  // E - increase depth (down)
            dragTurnLeft: false,   // Double-tap A for drag turn
            dragTurnRight: false,  // Double-tap D for drag turn
            throttleUp: false,     // Arrow Up - increase throttle
            throttleDown: false    // Arrow Down - decrease throttle
        };

        // Double-tap detection for drag turns and armor redistribution
        this.lastKeyPress = {};
        this.doubleTapDelay = 300; // milliseconds
        this.armorRedistributionCooldown = {}; // Per-facing cooldown

        // Fixed center submarine positioning
        this.fixedCenter = true; // Submarine stays in center of screen

        // Maneuver icon system
        this.maneuverIcon = {
            x: 0, // Screen position (-1 to 1)
            y: 0,
            deadZoneRadius: 0.05, // Smaller dead zone for better responsiveness
            maxDistance: 1.0, // Allow full range of movement for better control
            position3D: new THREE.Vector3(0, 0, 0) // 3D world position
        };

        // Submarine orientation controls
        this.orientationControl = {
            targetYaw: 0,
            targetPitch: 0,
            targetRoll: 0,
            turnRateMultiplier: 1.0, // Distance-based turn rate multiplier
            deadZoneActive: false
        };

        // Reticle control system
        this.firingReticle = {
            position: new THREE.Vector3(0, 0, 0), // Projected ahead of submarine
            distance: 50, // 50 meters directly ahead of submarine
            // Target lock system
            target: null,
            lockProgress: 0, // 0-1, how close to lock
            isLocked: false,
            lockDistance: 2.0, // Distance for full lock
            maxLockRange: 8.0, // Maximum range for lock attempt
            spinSpeed: 0,
            currentScale: 1.0,
            baseScale: 1.0,
            minScale: 0.3,
            currentRotation: 0,
            // Sonar-dependent lock system
            baseLockRate: 0.2, // Base lock rate with no active sonar (per second)
            lastSonarPing: 0,   // Track when last sonar ping occurred
            sonarLockBonus: 0   // Current lock rate bonus from sonar
        };

        // Remove maneuver reticle system - using direct keyboard control now

        // Direct control rates (reduced for submarine realism) - now using spec-based values
        this.turnRate = this.baseTurnRate; // Use spec-based turn rate instead of hardcoded
        // pitchRate and rollRate already set from specs above
        this.thrustRate = 0.3;    // Much slower thrust acceleration rate

        // Current movement values
        this.currentThrust = 0;   // Current thrust level (-100 to 100)
        this.targetSpeed = 0;     // Target speed set by mouse wheel
        this.accelerationRate = 0.3; // How quickly speed approaches target (per second) - slower for realism
        this.currentRoll = 0;     // Current roll angle
        
        // Mouse wheel deadzone for precise zero speed control
        this.wheelDeadzone = {
            range: 2,  // ±2 wheel clicks around zero
            inputBuffer: 0  // Count wheel inputs in deadzone
        };

        this.bubbleTimer = 0;

        // Advanced submarine warfare systems
        this.knuckles = []; // Turbulence pockets created by sharp turns
        this.knuckleTimer = 0;
        this.knuckleNoiseReduction = 0; // Temporary noise reduction after creating knuckle
        this.lastYaw = 0;
        this.turnRate = 0;

        // Emergency blow system
        this.emergencyBlow = {
            used: false,           // Has emergency blow been used?
            depthChangePenalty: 0, // Permanent penalty to depth change rate
            lastKeyPress: {        // Track double-tap timing
                Q: 0,
                E: 0
            },
            doubleTapWindow: 300   // 300ms window for double-tap detection
        };

        // Thermal layer system
        this.thermalLayers = {
            layer1Depth: 200,      // First thermocline at 200m
            layer2Depth: 1100,     // Second thermocline at 1100m
            hidingRange: 25,       // Range within thermocline for hiding effect
            isHidden: false,       // Currently hidden in thermal layer
            sonarReduction: 0.7,   // 70% sonar signature reduction when hidden
            activeLayer: null      // Which layer is providing cover
        };

        // Bottom bouncing system
        this.bottomBouncing = {
            isActive: false,       // Currently using bottom bounce
            bottomRange: 30,       // Range from seafloor for bottom bounce effect
            sonarReduction: 0.8,   // 80% sonar signature reduction near bottom
            lastDepth: 0,          // Track depth changes for bounce detection
            bounceTimer: 0         // Timer for bounce effect duration
        };

        // Towed array system
        this.towedArray = {
            deployed: false,
            available: true,    // False if broken off and lost
            sensitivity: 1.8,   // Multiplier for passive and active sonar when deployed
            speedPenalty: 0.7,  // Max speed when deployed (70% max speed)
            breakoffRisk: 0,    // Current breakoff risk percentage
            lastSpeed: 0,       // Track speed changes for risk calculation
            lastTurnRate: 0,    // Track maneuver intensity for risk calculation
            riskAccumulation: 0 // Accumulated stress over time
        };


        // Passive sonar sensitivity
        this.passiveSensitivity = 1.0;

        // Sonar system configuration
        this.sonarSettings = {
            power: 2, // 0=Low(200m), 1=Medium(500m), 2=High(1000m), 3=Maximum(2000m)
            rate: 1   // 0=Fast(1s), 1=Normal(2s), 2=Slow(3s), 3=Veryslow(5s)
        };

        this.init();
    }

    // Initialize submarine with class-specific specifications
    initializeSubmarineClass(className) {
        let specs = SUBMARINE_SPECIFICATIONS[className];
        if (!specs) {
            console.warn(`Unknown submarine class: ${className}, using TORNADO defaults`);
            specs = SUBMARINE_SPECIFICATIONS.TORNADO;
        }

        // Performance characteristics
        this.maxSpeed = specs.maxSpeedForward;
        this.maxReverseSpeed = -specs.maxSpeedReverse;
        
        // Supercavitation (SCAV) mode
        this.scavMode = {
            active: false,
            threshold: specs.cavitationThreshold || 70, // Speed threshold for SCAV activation (knots)
            bubbleIntensity: 0, // Visual bubble effect intensity
            passiveSonarPenalty: 0.95 // 95% reduction in passive sonar when in SCAV
        };
        this.accelerationRate = specs.accelerationRate;
        this.maxDepth = specs.crushDepth;
        this.emergencyDepth = specs.emergencyDepth;
        
        // Crush depth warning timers
        this.lastCrushDepthWarning = 0;
        this.lastCriticalDepthWarning = 0;
        this.lastHullStressSound = 0;

        // Maneuverability characteristics
        this.baseTurnRate = specs.baseTurnRate;
        this.pitchRate = specs.pitchRate;        // Use spec-based pitch rate instead of hardcoded
        this.rollRate = specs.rollRate;          // Use spec-based roll rate instead of hardcoded
        this.turnRateDecay = specs.turnRateDecay;
        this.dragTurnMultiplier = specs.dragTurnMultiplier;
        this.dragTurnDamageRate = specs.dragTurnDamageRate;

        // Armor system setup with proper specifications
        this.armor = {
            fore: {
                oobleck: specs.oobleckPolymerLayer,
                metaMaterial: specs.metaMaterialLayer,
                maxHP: specs.hullArmorHP
            },
            port: {
                oobleck: specs.oobleckPolymerLayer,
                metaMaterial: specs.metaMaterialLayer,
                maxHP: specs.hullArmorHP
            },
            starboard: {
                oobleck: specs.oobleckPolymerLayer,
                metaMaterial: specs.metaMaterialLayer,
                maxHP: specs.hullArmorHP
            },
            aft: {
                oobleck: specs.oobleckPolymerLayer,
                metaMaterial: specs.metaMaterialLayer,
                maxHP: specs.hullArmorHP
            },
            top: {
                oobleck: specs.oobleckPolymerLayer,
                metaMaterial: specs.metaMaterialLayer,
                maxHP: specs.hullArmorHP
            },
            bottom: {
                oobleck: specs.oobleckPolymerLayer,
                metaMaterial: specs.metaMaterialLayer,
                maxHP: specs.hullArmorHP
            }
        };
        this.armorPenThreshold = specs.hullArmorPenThreshold;

        // Internal systems setup
        this.systems = {
            hull: {
                hp: specs.hullHP,
                maxHP: specs.hullHP,
                penThreshold: specs.hullHP * specs.systemPenThresholds.hull
            },
            engines: {
                hp: specs.engineHP,
                maxHP: specs.engineHP,
                penThreshold: specs.engineHP * specs.systemPenThresholds.engines
            },
            weapons: {
                hp: specs.weaponsHP,
                maxHP: specs.weaponsHP,
                penThreshold: specs.weaponsHP * specs.systemPenThresholds.weapons
            },
            sensors: {
                hp: specs.sensorsHP,
                maxHP: specs.sensorsHP,
                penThreshold: specs.sensorsHP * specs.systemPenThresholds.sensors
            },
            lifeSupport: {
                hp: specs.lifeSupportHP,
                maxHP: specs.lifeSupportHP,
                penThreshold: specs.lifeSupportHP * specs.systemPenThresholds.lifeSupport
            },
            navigation: {
                hp: specs.navigationHP,
                maxHP: specs.navigationHP,
                penThreshold: specs.navigationHP * specs.systemPenThresholds.navigation
            }
        };

        // Add command systems for Tempest class
        if (className === 'TEMPEST' && specs.commandSystemsHP) {
            this.systems.commandSystems = {
                hp: specs.commandSystemsHP,
                maxHP: specs.commandSystemsHP,
                penThreshold: specs.commandSystemsHP * specs.systemPenThresholds.commandSystems
            };
        }

        // Sonar signature with class-specific modifiers
        this.sonarSignature = {
            base: specs.sonarSignatureBase,
            current: specs.sonarSignatureBase,
            speedMultiplier: 0,
            modifiers: {
                acceleration: 0,
                maneuvering: 0,
                dragTurn: 0,
                weaponsFire: 0,
                torpedoLaunch: 0,
                sonarPing: 0,
                depthChange: 0,
                surfacePenalty: 0,
                cavitation: 0
            },
            timers: {
                weaponsFire: 0,
                torpedoLaunch: 0,
                sonarPing: 0
            },
            // Store class-specific modifier values for calculations
            classModifiers: specs.sonarModifiers
        };

        // Sonar operating modes
        this.sonarMode = 'Passive'; // Active, Passive (Silent mode removed)
        this.sonarPower = 'High';  // High (100m), Medium (50m), Low (25m)
        this.sonarPingRate = 'Normal'; // Fast (1s), Normal (2s), Slow (3s), Very Slow (5s)
        
        // QMAD (Quantum Magnetic Anomaly Detectors) System
        this.qmadSystem = {
            enabled: true,
            sensitivity: 1.0,
            range: 5000, // 5km detection range
            updateRate: 5000, // Update every 5 seconds
            lastUpdate: 0,
            contacts: [],
            interferenceLevel: 0 // Electrical interference affects accuracy
        };
        this.sonarPingRates = {
            'Fast': 1000,
            'Normal': 2000,
            'Slow': 3000,
            'Very Slow': 5000
        };
        this.sonarPowerRanges = {
            'High': 100,
            'Medium': 50,
            'Low': 25
        };
        this.lastSonarUpdate = 0;

        // Set health to match hull HP
        this.health = specs.hullHP;
        this.maxHealth = specs.hullHP;

        // Maneuver Icon System
        this.maneuverIcon = {
            x: 0, // Screen coordinates (-1 to 1)
            y: 0,
            screenX: window.innerWidth / 2, // Pixel coordinates
            screenY: window.innerHeight / 2,
            maxDistance: 0.8, // Maximum distance from center (0-1)
            dragTurnThreshold: 0.6, // Distance threshold for drag turns
            deadZoneRadius: 0.15, // Dead zone radius to prevent continuous movement
            lastMouseMoveTime: Date.now(), // Track last mouse movement
            driftSpeed: 0.8, // Speed at which icon drifts back to center
            driftDelay: 500 // Wait 500ms after last mouse movement before drifting
        };

        // SCAV (Super Cavitation) Mode
        this.scavMode = {
            active: false,
            speedMultiplier: 2.0, // Double normal max speed
            maneuverabilityPenalty: 0.3, // Reduced turn rates
            noiseMultiplier: 10.0, // Massive sonar signature increase
            bubbleEffects: [],
            canActivate: false // Only at >50% max speed, forward only
        };

        // Mouse control state
        this.mouseState = {
            leftDown: false,
            rightDown: false,
            wheelDelta: 0
        };

        // Continuous fire system
        this.continuousFire = {
            active: false,
            type: null,
            lastFire: 0
        };

        // Initialize torpedo system after class specs are loaded
        this.initializeTorpedoSystem();
    }

    init() {
        this.createSubmarineMesh();
        this.setupControls();

        // Start audio systems
        // DISABLED: Engine and ambient sounds (humming noise)
        // this.audioManager.startEngine();
        // this.audioManager.startAmbientSounds();

        // Initialize AI for NPC submarines
        if (this.isNPC) {
            this.initializeAI(this.submarineClass);
            console.log(`AI initialized for NPC submarine: ${this.submarineClass}`);
        }

        console.log(this.isNPC ? `NPC submarine ${this.submarineClass} initialized` : 'Player submarine initialized');
    }

    initializeTorpedoSystem() {
        const specs = SUBMARINE_SPECIFICATIONS[this.submarineClass];

        // Horizontal Torpedo Box Launchers (7 boxes each: 0 always empty, 1-6 contain torpedoes)
        this.launchers = [];
        for (let i = 0; i < specs.torpedoTubes; i++) {
            this.launchers.push({
                id: i + 1,
                chambers: new Array(6).fill(null), // 6 chambers for torpedoes (boxes 1-6)
                currentBox: -1, // -1 = no box highlighted, 0-6 = box positions
                cycling: false,
                lastCycleTime: 0,
                rotationAnimation: 0 // For visual highlighting animation
            });
        }

        // Torpedo type codes (2-letter system) - torpedoes only
        this.torpedoCodes = {
            'LIGHT_TORPEDO': 'LT',
            'MEDIUM_TORPEDO': 'MT',
            'HEAVY_TORPEDO': 'HT'
        };

        // Initialize default loadouts for each launcher
        this.initializeDefaultLoadouts();
        
        // Initialize visual display
        setTimeout(() => {
            this.updateLauncherDisplay();
        }, 100); // Small delay to ensure DOM is ready

        // Torpedo storage/inventory - torpedoes only
        this.torpedoStorage = {
            LT: specs.torpedoTubes * 4,  // Light torpedoes - most common
            MT: specs.torpedoTubes * 3,  // Medium torpedoes
            HT: specs.canCarryHeavyTorpedoes ? specs.torpedoTubes * 2 : 0, // Heavy torpedoes
            DN: specs.torpedoTubes * 1  // Drone torpedoes - 1 per launcher
        };

        // Currently selected launcher
        this.selectedLauncher = 1;

        // Sequential firing system - tracks which tube fires next
        this.sequentialFiring = {
            nextTubeToFire: 1, // 1-4, cycles through tubes
            firedTubes: new Set(), // Track which tubes have been fired
            allFired: false // True when all 4 tubes have been fired
        };

        // Launcher interaction tracking
        this.launcherInteraction = {
            lastPressTime: 0,
            lastPressedLauncher: 0,
            cycleDelay: 2000, // 2 second delay before selection locks in
            showingInfo: false
        };

        // Lock-on system
        this.torpedoLockSystem = {
            target: null,
            lockProgress: 0,
            lockStartTime: 0,
            isLocked: false
        };

        // Countermeasures
        this.countermeasures = {
            noisemakers: specs.hasInterceptors ? 6 : 3, // All subs have noisemakers
            interceptors: specs.hasInterceptors ? 4 : 0
        };

        // Sonar contact management
        this.selectedSonarContact = -1; // Index of currently selected contact (-1 = none)
        this.expandedContacts = new Set(); // Set of expanded contact indices
        this.lastTabTime = 0; // For Tab cycling rate limiting

        // Mine laying system
        this.mineCount = specs.hasMineLayer ? 6 : 0; // 6 mines for mine-capable subs


        // Skill System
        this.skills = {
            piloting: 5,    // 1-10: Affects turn rate, yaw, pitch, roll
            gunnery: 5,     // 1-10: Affects lock-on speed
            engineering: 5, // 1-10: Affects damage control repair speed
            sensors: 5      // 1-10: Affects passive sonar detection range and sensitivity
        };
        
        // Sonar contact cycling system
        this.selectedSonarContact = -1; // -1 means no selection
        this.currentSonarContacts = [];
        this.sonarHighlightMarker = null; // 3D marker for highlighting selected contact

        // Initialize scenarios system
        this.initializeScenariosSystem();

        // Damage Control System
        this.damageControl = {
            activeRepairs: {},  // Which systems are being repaired
            repairRate: 2,      // Base HP per second repair rate
            lastRepairTime: 0
        };
        
        // Threat Warning System
        this.threatWarning = {
            incomingTorpedoes: [],
            activeSonarThreats: [],
            lastWarningSound: 0,
            warningLevel: 'NONE', // NONE, LOW, MEDIUM, HIGH, CRITICAL
            hudFlashTimer: 0,
            audioWarningTimer: 0
        };
        
        // Torpedo Launch Signature System
        this.torpedoLaunchSignature = {
            active: false,
            startTime: 0,
            duration: 5000, // 5 second signature spike
            signatureMultiplier: 3.0, // 3x normal signature during launch
            decayRate: 0.8 // How quickly the signature fades
        };
    }

    initializeDefaultLoadouts() {
        // Set up default torpedo loadouts for each launcher (torpedoes only)
        // Slot 6 (index 5) contains DN (Drone) by default
        const defaultLoadouts = [
            ['HT', 'LT', 'MT', 'LT', 'HT', 'DN'], // Launcher 1: Mixed combat loadout + DN
            ['LT', 'LT', 'LT', 'MT', 'LT', 'DN'], // Launcher 2: Light torpedo focused + DN
            ['HT', 'MT', 'MT', 'HT', 'HT', 'DN'], // Launcher 3: Heavy weapons focused + DN
            ['MT', 'LT', 'LT', 'MT', 'LT', 'DN']  // Launcher 4: Balanced engagement + DN
        ];

        this.launchers.forEach((launcher, index) => {
            const loadout = defaultLoadouts[index] || ['LT', 'LT', 'LT', 'LT', 'LT', 'DN'];
            for (let i = 0; i < 6; i++) {
                launcher.chambers[i] = loadout[i];
            }
        });

        console.log('Initialized default launcher loadouts (DN in slot 6)');
    }

    getAvailableTorpedoTypes() {
        const specs = SUBMARINE_SPECIFICATIONS[this.submarineClass];
        let types = ['MT', 'LT', 'DN']; // All subs can carry Medium, Light, and Drone
        if (specs.canCarryHeavyTorpedoes) {
            types.push('HT');
        }
        return types;
    }

    createSubmarineMesh() {
        console.log('🔨 Creating submarine mesh...');

        try {
            // Create Elite-style submarine fighter geometry
            console.log('🏗️ Building submarine model for class:', this.submarineClass || 'COBRA');
            this.mesh = this.createSubmarineModel(this.submarineClass || 'COBRA');

            if (!this.mesh) {
                throw new Error('createSubmarineModel returned null/undefined');
            }

            this.mesh.name = 'playerSubmarine';

            // Initialize mesh rotation to level (ensure submarine starts straight and level)
            this.mesh.rotation.set(0, 0, 0);
            
            // Set initial position at safe shallow depth to avoid terrain collision
            // Spawn submarine at 300m depth (well above any terrain features)
            this.mesh.position.set(0, -300, 18000); // X=0, Y=-300m (300m depth), Z=18000 (2km north of trench)

            console.log('➕ Adding submarine mesh to scene...');
            this.scene.add(this.mesh);

            console.log('✅ Submarine mesh created and added to scene successfully');

        } catch (error) {
            console.error('❌ Failed to create submarine mesh:', error);
            throw error;
        }


        // Create reticle visuals
        this.createReticleVisuals();

        // Remove any existing submarine models and test objects
        const existingSubmarines = this.scene.children.filter(obj => 
            (obj.name === 'playerSubmarine' && obj !== this.mesh) ||
            (obj.type === 'Mesh' && obj.geometry.type === 'BoxGeometry') ||
            (obj.type === 'Group' && obj.userData && obj.userData.submarineClass)
        );
        
        existingSubmarines.forEach(submarine => {
            console.log('Removing duplicate submarine model:', submarine.name || submarine.type);
            this.scene.remove(submarine);
        });
    }

    createSubmarineModel(submarineClass) {
        console.log('🚢 createSubmarineModel called with class:', submarineClass);
        const submarineGroup = new THREE.Group();

        // Elite-style solid material (changed from wireframe to solid)
        const solidMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff, // Cyan like Elite ships
            side: THREE.DoubleSide
        });

        switch(submarineClass) {
        case 'TORNADO':
            return this.createTornadoClass(solidMaterial);
        case 'LIGHTNING':
            return this.createLightningClass(solidMaterial);
        case 'TYPHOON':
            return this.createTyphoonClass(solidMaterial);
        case 'HURRICANE':
            return this.createHurricaneClass(solidMaterial);
        case 'TEMPEST':
            return this.createTempestClass(solidMaterial);
        case 'THUNDER':
            return this.createThunderClass(solidMaterial);
        case 'CYCLONE':
            return this.createCycloneClass(solidMaterial);
        case 'WHIRLWIND':
            return this.createWhirlwindClass(solidMaterial);
        case 'NAUTILUS':
            return this.createNautilusClass(solidMaterial);
        case 'SQUALL':
            return this.createSquallClass(solidMaterial);
        case 'FURY':
            return this.createFuryClass(solidMaterial);
        case 'HAILSTORM':
            return this.createHailstormClass(solidMaterial);
        case 'JUMBO':
            return this.createJumboClass(solidMaterial);
        case 'TSUNAMI':
            return this.createTsunamiClass(solidMaterial);
        case 'QUEST':
            return this.createQuestClass(solidMaterial);
        case 'ADVENTURE':
            return this.createAdventureClass(solidMaterial);
        case 'MISSION':
            return this.createMissionClass(solidMaterial);
        case 'COBRA':
        case 'COBRA3':
            return this.createCobraClass(solidMaterial);
        default:
            return this.createTornadoClass(solidMaterial);
        }
    }

    createTornadoClass(material) {
        // Tornado-class: Oolite Cobra-inspired submarine
        const group = new THREE.Group();

        // Create the perfected Cobra geometry
        const cobraGeometry = this.createCobraGeometry();

        // Create material that supports vertex colors for panel variation
        const cobraMaterial = new THREE.MeshBasicMaterial({
            vertexColors: true,
            side: THREE.DoubleSide
        });

        const cobra = new THREE.Mesh(cobraGeometry, cobraMaterial);

        // Scale and orient for submarine use
        // Cobra width (24 units) becomes Tornado length, maintain proportions
        const cobraWidth = 24; // Distance from left wing to right wing
        const tornadoLength = 5; // Desired submarine length
        const scale = tornadoLength / cobraWidth;

        cobra.scale.set(scale, scale, scale);
        cobra.rotation.y = 0; // Face forward (no rotation)
        cobra.position.set(0, 0, 0);

        group.add(cobra);

        // Add wireframe overlay to show the geometry structure
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(cobraGeometry, wireframeMaterial);
        wireframe.scale.set(scale, scale, scale);
        wireframe.rotation.y = 0; // Face forward (no rotation)
        wireframe.position.set(0, 0, 0);

        group.add(wireframe);

        console.log('✅ Tornado-class submarine created using perfected Oolite Cobra geometry');
        return group;
    }

    createCobraGeometry() {
        // Create the exact Oolite Cobra geometry that we perfected
        const geometry = new THREE.BufferGeometry();

        // Exact Oolite Cobra vertex data
        const cobraVertices = [
            0, 2.769230842590332, 0,                    // 0: top front
            2.9538462162017822, -0.0923076942563057, 6, // 1: right front
            -2.9538462162017822, -0.0923076942563057, 6, // 2: left front
            2.9538462162017822, -2.769230842590332, -6, // 3: right rear
            -2.9538462162017822, -2.769230842590332, -6, // 4: left rear
            -8.123077392578125, 1.8461538553237915, -6, // 5: left wing tip
            -11.076923370361328, -0.5538461804389954, -2.4000000953674316, // 6: left wing rear
            -12, -0.5538461804389954, -6,               // 7: left wing end
            8.123077392578125, 1.8461538553237915, -6,  // 8: right wing tip
            11.076923370361328, -0.5538461804389954, -2.4000000953674316, // 9: right wing rear
            12, -0.5538461804389954, -6,                // 10: right wing end
            0, 2.769230842590332, -6                    // 11: top rear
        ];

        // Complete triangular faces with proper connectivity
        const cobraFaces = [
            // Front nose triangles
            [0, 2, 1],    // front face

            // Main hull to wing connections
            [1, 8, 3],    // right front to wing
            [2, 4, 5],    // left front to wing

            // Wing tip triangles
            [8, 9, 10],   // right wing tip
            [5, 6, 7],    // left wing tip

            // Main body triangles
            [3, 8, 9],    // right mid section
            [4, 6, 5],    // left mid section
            [3, 9, 4],    // center rear connection
            [4, 9, 6],    // rear left connection
            [9, 10, 6],   // wing rear connection
            [6, 10, 7],   // left wing rear

            // Top surface triangles
            [0, 1, 8],    // right front top
            [0, 8, 11],   // right rear top
            [0, 11, 5],   // left rear top
            [0, 5, 2],    // left front top
            [8, 10, 11],  // right wing top
            [5, 11, 7],   // left wing top
            [11, 10, 7],  // rear wing connection

            // Bottom surface triangles
            [1, 3, 9],    // right front bottom
            [2, 6, 4],    // left front bottom
            [1, 9, 8],    // right mid bottom
            [2, 5, 6],    // left mid bottom

            // Additional closure triangles
            [3, 4, 9],    // rear center bottom
            [9, 6, 10],   // wing connection bottom
            [10, 6, 7],   // wing rear bottom

            // Missing bottom center faces
            [1, 2, 3],    // front bottom center
            [2, 4, 3],    // center bottom connection
        ];

        // Convert face list to vertex array for non-indexed geometry with panel colors
        const vertices = [];
        const colors = [];

        // Define color variations for different sections
        const panelColors = {
            nose: [0.4, 0.7, 0.9],        // Light blue for nose
            hull: [0.3, 0.6, 0.8],        // Medium blue for main hull
            wings: [0.25, 0.55, 0.75],    // Slightly darker for wings
            top: [0.35, 0.65, 0.85],      // Lighter for top surfaces
            bottom: [0.2, 0.5, 0.7],      // Darker for bottom surfaces
            rear: [0.28, 0.58, 0.78]      // Medium-dark for rear sections
        };

        for (let i = 0; i < cobraFaces.length; i++) {
            const face = cobraFaces[i];
            let color;

            // Assign colors based on face type
            if (i === 0) color = panelColors.nose;           // Front nose
            else if (i >= 1 && i <= 2) color = panelColors.hull;    // Hull connections
            else if (i >= 3 && i <= 4) color = panelColors.wings;   // Wing tips
            else if (i >= 5 && i <= 10) color = panelColors.hull;   // Main body
            else if (i >= 11 && i <= 17) color = panelColors.top;   // Top surfaces
            else if (i >= 18 && i <= 21) color = panelColors.bottom; // Bottom surfaces
            else color = panelColors.rear;                   // Rear sections

            for (let vertexIndex of face) {
                vertices.push(
                    cobraVertices[vertexIndex * 3],     // x
                    cobraVertices[vertexIndex * 3 + 1], // y
                    cobraVertices[vertexIndex * 3 + 2]  // z
                );
                colors.push(color[0], color[1], color[2]); // Add color for this vertex
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        geometry.computeVertexNormals();

        console.log('🚢 Created exact Oolite Cobra geometry with', vertices.length / 3, 'triangulated vertices');
        return geometry;
    }

    createLightningClass(material) {
        // Lightning-class: Fast attack fighter, narrow needle-like profile (solid version)
        const group = new THREE.Group();

        // Sleek needle-like fuselage
        const fuselageGeometry = new THREE.CylinderGeometry(0.15, 0.3, 6, 8);
        fuselageGeometry.rotateZ(Math.PI / 2);
        const fuselage = new THREE.Mesh(fuselageGeometry, material);
        group.add(fuselage);

        // Minimal side wings as thin triangular fins
        const wingGeometry = new THREE.ConeGeometry(0.2, 1.2, 3);
        wingGeometry.rotateZ(Math.PI / 2);

        const leftWing = new THREE.Mesh(wingGeometry, material);
        leftWing.position.set(0, 0, 0.6);
        leftWing.rotateY(0.2);
        group.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, material);
        rightWing.position.set(0, 0, -0.6);
        rightWing.rotateY(-0.2);
        group.add(rightWing);

        // Single central engine
        const engineGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
        engineGeometry.rotateZ(Math.PI / 2);
        const engine = new THREE.Mesh(engineGeometry, material);
        engine.position.set(-2.2, 0, 0);
        group.add(engine);
        
        // Wing struts connecting fuselage to wings (3D printing support)
        const strutGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
        const leftStrut = new THREE.Mesh(strutGeometry, material);
        leftStrut.position.set(0.2, 0, 0.35);
        leftStrut.rotateX(Math.PI / 2);
        group.add(leftStrut);
        
        const rightStrut = new THREE.Mesh(strutGeometry, material);
        rightStrut.position.set(0.2, 0, -0.35);
        rightStrut.rotateX(Math.PI / 2);
        group.add(rightStrut);

        return group;
    }

    createTyphoonClass(material) {
        // Typhoon-class: Angular fighter submarine with diamond hull and dual nacelles
        const group = new THREE.Group();
        console.log('🔧 Creating angular TYPHOON fighter submarine');

        // MAIN DIAMOND HULL - Angular cross-section instead of cylindrical
        // Create diamond-shaped hull using rotated box geometry
        const mainHullGeometry = new THREE.BoxGeometry(4.5, 1.2, 1.8);
        const mainHull = new THREE.Mesh(mainHullGeometry, material);
        mainHull.rotation.z = Math.PI / 4; // 45 degree rotation for diamond profile
        group.add(mainHull);

        // TRIANGULAR NOSE SECTION - Sharp angular nose
        const noseGeometry = new THREE.ConeGeometry(0.8, 2.2, 4); // 4 sides for angular appearance
        noseGeometry.rotateZ(Math.PI / 2); // Point forward
        const nose = new THREE.Mesh(noseGeometry, material);
        nose.position.set(3.35, 0, 0); // Position at front of main hull
        group.add(nose);

        // DUAL NACELLES - Angular pods on either side
        const nacelleGeometry = new THREE.BoxGeometry(3.0, 0.8, 0.8);

        // Left nacelle
        const leftNacelle = new THREE.Mesh(nacelleGeometry, material);
        leftNacelle.position.set(-0.5, 0, 1.8);
        leftNacelle.rotation.z = Math.PI / 6; // 30 degree cant for angular look
        leftNacelle.rotation.y = 0.1; // Slight outward angle
        group.add(leftNacelle);

        // Right nacelle
        const rightNacelle = new THREE.Mesh(nacelleGeometry, material);
        rightNacelle.position.set(-0.5, 0, -1.8);
        rightNacelle.rotation.z = -Math.PI / 6; // -30 degree cant for angular look
        rightNacelle.rotation.y = -0.1; // Slight outward angle
        group.add(rightNacelle);

        // ANGULAR WING STRUTS - Connect nacelles to main hull
        const strutGeometry = new THREE.BoxGeometry(1.8, 0.3, 0.4);

        const leftStrut = new THREE.Mesh(strutGeometry, material);
        leftStrut.position.set(0.2, 0, 0.9); // Bridge between hull and left nacelle
        leftStrut.rotation.y = 0.2; // Angle toward nacelle
        group.add(leftStrut);

        const rightStrut = new THREE.Mesh(strutGeometry, material);
        rightStrut.position.set(0.2, 0, -0.9); // Bridge between hull and right nacelle
        rightStrut.rotation.y = -0.2; // Angle toward nacelle
        group.add(rightStrut);

        // SWEPT-BACK ANGULAR FINS - Sharp vertical stabilizers
        const finGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.2);

        // Upper fin
        const upperFin = new THREE.Mesh(finGeometry, material);
        upperFin.position.set(-1.5, 0.8, 0); // Above rear hull
        upperFin.rotation.x = -0.3; // Swept back angle
        group.add(upperFin);

        // Lower fin
        const lowerFin = new THREE.Mesh(finGeometry, material);
        lowerFin.position.set(-1.5, -0.8, 0); // Below rear hull
        lowerFin.rotation.x = 0.3; // Swept back angle
        group.add(lowerFin);

        // NACELLE ENGINE OUTLETS - Angular exhaust ports
        const exhaustGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.4);

        // Left nacelle exhaust
        const leftExhaust = new THREE.Mesh(exhaustGeometry, material);
        leftExhaust.position.set(-2.2, 0, 1.8);
        leftExhaust.rotation.z = Math.PI / 6; // Match nacelle angle
        group.add(leftExhaust);

        // Right nacelle exhaust
        const rightExhaust = new THREE.Mesh(exhaustGeometry, material);
        rightExhaust.position.set(-2.2, 0, -1.8);
        rightExhaust.rotation.z = -Math.PI / 6; // Match nacelle angle
        group.add(rightExhaust);

        // ANGULAR SENSOR ARRAY - Faceted sensor pod on top
        const sensorGeometry = new THREE.BoxGeometry(1.0, 0.6, 0.6);
        const sensorPod = new THREE.Mesh(sensorGeometry, material);
        sensorPod.position.set(1.0, 0.9, 0); // Top-mounted forward sensor array
        sensorPod.rotation.z = Math.PI / 8; // Slight angle for stealth profile
        group.add(sensorPod);

        // HULL REINFORCEMENT PLATES - Angular armor sections
        const armorGeometry = new THREE.BoxGeometry(2.5, 0.3, 1.0);

        // Upper armor plate
        const upperArmor = new THREE.Mesh(armorGeometry, material);
        upperArmor.position.set(0, 0.7, 0);
        upperArmor.rotation.z = Math.PI / 4; // Match hull diamond angle
        group.add(upperArmor);

        // Lower armor plate
        const lowerArmor = new THREE.Mesh(armorGeometry, material);
        lowerArmor.position.set(0, -0.7, 0);
        lowerArmor.rotation.z = Math.PI / 4; // Match hull diamond angle
        group.add(lowerArmor);

        // ANGULAR TORPEDO TUBES - Faceted weapon ports
        const tubeGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.3);

        // Forward torpedo tubes (4 total in angular arrangement)
        const topLeftTube = new THREE.Mesh(tubeGeometry, material);
        topLeftTube.position.set(2.0, 0.5, 0.4);
        group.add(topLeftTube);

        const topRightTube = new THREE.Mesh(tubeGeometry, material);
        topRightTube.position.set(2.0, 0.5, -0.4);
        group.add(topRightTube);

        const bottomLeftTube = new THREE.Mesh(tubeGeometry, material);
        bottomLeftTube.position.set(2.0, -0.5, 0.4);
        group.add(bottomLeftTube);

        const bottomRightTube = new THREE.Mesh(tubeGeometry, material);
        bottomRightTube.position.set(2.0, -0.5, -0.4);
        group.add(bottomRightTube);

        console.log('✅ TYPHOON angular fighter submarine created with diamond hull and dual nacelles');
        return group;
    }

    createHurricaneClass(material) {
        // Hurricane-class: Balanced fighter-bomber (solid version)
        const group = new THREE.Group();

        // Balanced fuselage design
        const fuselageGeometry = new THREE.ConeGeometry(0.5, 5.2, 6);
        fuselageGeometry.rotateZ(Math.PI / 2);
        const fuselage = new THREE.Mesh(fuselageGeometry, material);
        group.add(fuselage);

        // Swept wing design as solid triangular wings
        const wingGeometry = new THREE.ConeGeometry(0.4, 2.2, 4);
        wingGeometry.rotateZ(Math.PI / 2);

        const leftWing = new THREE.Mesh(wingGeometry, material);
        leftWing.position.set(-0.3, 0, 1.0);
        leftWing.rotateY(0.5);
        leftWing.scale.set(1, 0.4, 1);
        group.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, material);
        rightWing.position.set(-0.3, 0, -1.0);
        rightWing.rotateY(-0.5);
        rightWing.scale.set(1, 0.4, 1);
        group.add(rightWing);

        // Dual engines
        const engineGeometry = new THREE.CylinderGeometry(0.18, 0.18, 1.6);
        engineGeometry.rotateZ(Math.PI / 2);

        const leftEngine = new THREE.Mesh(engineGeometry, material);
        leftEngine.position.set(-2.0, 0.05, 0.6);
        group.add(leftEngine);

        const rightEngine = new THREE.Mesh(engineGeometry, material);
        rightEngine.position.set(-2.0, 0.05, -0.6);
        group.add(rightEngine);
        
        // Wing struts connecting fuselage to wings (3D printing support)
        const strutGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.8);
        const leftStrut = new THREE.Mesh(strutGeometry, material);
        leftStrut.position.set(-0.1, 0.1, 0.7);
        leftStrut.rotateX(Math.PI / 2);
        group.add(leftStrut);
        
        const rightStrut = new THREE.Mesh(strutGeometry, material);
        rightStrut.position.set(-0.1, 0.1, -0.7);
        rightStrut.rotateX(Math.PI / 2);
        group.add(rightStrut);
        
        // Engine pylons connecting fuselage to engines (3D printing support)
        const pylonGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.9);
        const leftPylon = new THREE.Mesh(pylonGeometry, material);
        leftPylon.position.set(-1.5, 0.03, 0.4);
        leftPylon.rotateX(Math.PI / 2);
        group.add(leftPylon);
        
        const rightPylon = new THREE.Mesh(pylonGeometry, material);
        rightPylon.position.set(-1.5, 0.03, -0.4);
        rightPylon.rotateX(Math.PI / 2);
        group.add(rightPylon);

        return group;
    }

    createTempestClass(material) {
        // Tempest-class: Command fighter, largest and most complex (solid version)
        const group = new THREE.Group();

        // Large command hull - broader design
        const fuselageGeometry = new THREE.CylinderGeometry(0.8, 0.5, 4.8, 8);
        fuselageGeometry.rotateZ(Math.PI / 2);
        const fuselage = new THREE.Mesh(fuselageGeometry, material);
        group.add(fuselage);

        // Large delta wings as solid triangular shapes
        const wingGeometry = new THREE.ConeGeometry(0.6, 3.5, 4);
        wingGeometry.rotateZ(Math.PI / 2);

        const leftWing = new THREE.Mesh(wingGeometry, material);
        leftWing.position.set(-0.5, 0.2, 1.7);
        leftWing.rotateY(0.6);
        leftWing.scale.set(1, 0.2, 1);
        group.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, material);
        rightWing.position.set(-0.5, 0.2, -1.7);
        rightWing.rotateY(-0.6);
        rightWing.scale.set(1, 0.2, 1);
        group.add(rightWing);

        // Command bridge as small cylinder on top
        const bridgeGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.0, 6);
        const bridge = new THREE.Mesh(bridgeGeometry, material);
        bridge.position.set(0.8, 0.9, 0);
        group.add(bridge);

        // Quad engine array
        const engineGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5);
        engineGeometry.rotateZ(Math.PI / 2);

        const engine1 = new THREE.Mesh(engineGeometry, material);
        engine1.position.set(-2.2, 0.3, 0.8);
        group.add(engine1);

        const engine2 = new THREE.Mesh(engineGeometry, material);
        engine2.position.set(-2.2, 0.3, -0.8);
        group.add(engine2);

        const engine3 = new THREE.Mesh(engineGeometry, material);
        engine3.position.set(-2.2, -0.3, 0.8);
        group.add(engine3);

        const engine4 = new THREE.Mesh(engineGeometry, material);
        engine4.position.set(-2.2, -0.3, -0.8);
        group.add(engine4);
        
        // Wing struts connecting fuselage to wings (3D printing support)
        const strutGeometry = new THREE.CylinderGeometry(0.06, 0.06, 1.2);
        const leftStrut = new THREE.Mesh(strutGeometry, material);
        leftStrut.position.set(-0.3, 0.15, 1.0);
        leftStrut.rotateX(Math.PI / 2);
        group.add(leftStrut);
        
        const rightStrut = new THREE.Mesh(strutGeometry, material);
        rightStrut.position.set(-0.3, 0.15, -1.0);
        rightStrut.rotateX(Math.PI / 2);
        group.add(rightStrut);
        
        // Bridge support struts (3D printing support)
        const bridgeSupportGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7);
        const frontBridgeSupport = new THREE.Mesh(bridgeSupportGeometry, material);
        frontBridgeSupport.position.set(0.6, 0.45, 0);
        group.add(frontBridgeSupport);
        
        const rearBridgeSupport = new THREE.Mesh(bridgeSupportGeometry, material);
        rearBridgeSupport.position.set(1.0, 0.45, 0);
        group.add(rearBridgeSupport);
        
        // Engine cluster support struts (3D printing support)
        const engineStrutGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.6);
        const engineStrut1 = new THREE.Mesh(engineStrutGeometry, material);
        engineStrut1.position.set(-1.6, 0, 0.5);
        engineStrut1.rotateX(Math.PI / 2);
        group.add(engineStrut1);
        
        const engineStrut2 = new THREE.Mesh(engineStrutGeometry, material);
        engineStrut2.position.set(-1.6, 0, -0.5);
        engineStrut2.rotateX(Math.PI / 2);
        group.add(engineStrut2);

        return group;
    }

    createThunderClass(material) {
        // Thunder-class: Deep ocean specialist with reinforced pressure hull
        const group = new THREE.Group();
        
        // Reinforced cylindrical hull designed for deep ocean pressure
        const hullGeometry = new THREE.CylinderGeometry(0.6, 0.6, 6.0, 12);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        group.add(hull);
        
        // Reinforced pressure dome at front
        const domeGeometry = new THREE.SphereGeometry(0.6, 8, 6, 0, Math.PI);
        domeGeometry.rotateY(Math.PI / 2);
        const dome = new THREE.Mesh(domeGeometry, material);
        dome.position.set(3.0, 0, 0);
        group.add(dome);
        
        // Heavy diving planes for deep ocean control
        const planeGeometry = new THREE.ConeGeometry(0.4, 2.5, 4);
        planeGeometry.rotateZ(Math.PI / 2);
        const leftPlane = new THREE.Mesh(planeGeometry, material);
        leftPlane.position.set(0.8, 0, 1.0);
        leftPlane.rotateY(0.3);
        leftPlane.scale.set(1, 0.3, 1);
        group.add(leftPlane);
        
        const rightPlane = new THREE.Mesh(planeGeometry, material);
        rightPlane.position.set(0.8, 0, -1.0);
        rightPlane.rotateY(-0.3);
        rightPlane.scale.set(1, 0.3, 1);
        group.add(rightPlane);
        
        // Heavy triple engine configuration
        const engineGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2.0);
        engineGeometry.rotateZ(Math.PI / 2);
        
        const mainEngine = new THREE.Mesh(engineGeometry, material);
        mainEngine.position.set(-2.5, 0, 0);
        group.add(mainEngine);
        
        const leftEngine = new THREE.Mesh(engineGeometry, material);
        leftEngine.position.set(-2.5, -0.3, 0.5);
        group.add(leftEngine);
        
        const rightEngine = new THREE.Mesh(engineGeometry, material);
        rightEngine.position.set(-2.5, -0.3, -0.5);
        group.add(rightEngine);
        
        // Diving plane struts (3D printing support)
        const planeStrutGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
        const leftPlaneStrut = new THREE.Mesh(planeStrutGeometry, material);
        leftPlaneStrut.position.set(0.6, 0, 0.6);
        leftPlaneStrut.rotateX(Math.PI / 2);
        group.add(leftPlaneStrut);
        
        const rightPlaneStrut = new THREE.Mesh(planeStrutGeometry, material);
        rightPlaneStrut.position.set(0.6, 0, -0.6);
        rightPlaneStrut.rotateX(Math.PI / 2);
        group.add(rightPlaneStrut);
        
        // Engine cluster support struts (3D printing support)
        const engineStrutGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.8);
        const engineStrut1 = new THREE.Mesh(engineStrutGeometry, material);
        engineStrut1.position.set(-1.8, -0.15, 0.3);
        engineStrut1.rotateX(Math.PI / 2);
        group.add(engineStrut1);
        
        const engineStrut2 = new THREE.Mesh(engineStrutGeometry, material);
        engineStrut2.position.set(-1.8, -0.15, -0.3);
        engineStrut2.rotateX(Math.PI / 2);
        group.add(engineStrut2);
        
        return group;
    }

    createCycloneClass(material) {
        // Cyclone-class: Ultra-deep specialist with maximum reinforcement
        const group = new THREE.Group();
        
        // Ultra-reinforced spherical pressure hull sections
        const frontHullGeometry = new THREE.SphereGeometry(0.8, 10, 8);
        const frontHull = new THREE.Mesh(frontHullGeometry, material);
        frontHull.position.set(1.5, 0, 0);
        frontHull.scale.set(1.5, 1, 1);
        group.add(frontHull);
        
        const rearHullGeometry = new THREE.CylinderGeometry(0.7, 0.8, 4.0, 12);
        rearHullGeometry.rotateZ(Math.PI / 2);
        const rearHull = new THREE.Mesh(rearHullGeometry, material);
        rearHull.position.set(-0.5, 0, 0);
        group.add(rearHull);
        
        // Massive stabilizing wings for ultra-deep operations
        const wingGeometry = new THREE.ConeGeometry(0.6, 3.0, 5);
        wingGeometry.rotateZ(Math.PI / 2);
        const leftWing = new THREE.Mesh(wingGeometry, material);
        leftWing.position.set(-0.2, 0, 1.4);
        leftWing.rotateY(0.4);
        leftWing.scale.set(1, 0.2, 1);
        group.add(leftWing);
        
        const rightWing = new THREE.Mesh(wingGeometry, material);
        rightWing.position.set(-0.2, 0, -1.4);
        rightWing.rotateY(-0.4);
        rightWing.scale.set(1, 0.2, 1);
        group.add(rightWing);
        
        // Reinforced dorsal fin for stability
        const finGeometry = new THREE.ConeGeometry(0.4, 2.0, 4);
        const dorsalFin = new THREE.Mesh(finGeometry, material);
        dorsalFin.position.set(-0.5, 1.0, 0);
        dorsalFin.rotateZ(Math.PI / 2);
        dorsalFin.scale.set(0.3, 1, 1);
        group.add(dorsalFin);
        
        // Quad engine array for power
        const engineGeometry = new THREE.CylinderGeometry(0.18, 0.18, 1.8);
        engineGeometry.rotateZ(Math.PI / 2);
        
        const engine1 = new THREE.Mesh(engineGeometry, material);
        engine1.position.set(-2.8, 0.2, 0.7);
        group.add(engine1);
        
        const engine2 = new THREE.Mesh(engineGeometry, material);
        engine2.position.set(-2.8, 0.2, -0.7);
        group.add(engine2);
        
        const engine3 = new THREE.Mesh(engineGeometry, material);
        engine3.position.set(-2.8, -0.2, 0.7);
        group.add(engine3);
        
        const engine4 = new THREE.Mesh(engineGeometry, material);
        engine4.position.set(-2.8, -0.2, -0.7);
        group.add(engine4);
        
        // Wing support struts (3D printing support)
        const wingStrutGeometry = new THREE.CylinderGeometry(0.07, 0.07, 1.0);
        const leftWingStrut = new THREE.Mesh(wingStrutGeometry, material);
        leftWingStrut.position.set(-0.1, 0, 0.9);
        leftWingStrut.rotateX(Math.PI / 2);
        group.add(leftWingStrut);
        
        const rightWingStrut = new THREE.Mesh(wingStrutGeometry, material);
        rightWingStrut.position.set(-0.1, 0, -0.9);
        rightWingStrut.rotateX(Math.PI / 2);
        group.add(rightWingStrut);
        
        // Dorsal fin support strut (3D printing support)
        const finStrutGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
        const finStrut = new THREE.Mesh(finStrutGeometry, material);
        finStrut.position.set(-0.5, 0.5, 0);
        group.add(finStrut);
        
        // Engine cluster support framework (3D printing support)
        const engineFrameGeometry = new THREE.CylinderGeometry(0.04, 0.04, 1.0);
        const engineFrame1 = new THREE.Mesh(engineFrameGeometry, material);
        engineFrame1.position.set(-2.2, 0, 0.5);
        engineFrame1.rotateX(Math.PI / 2);
        group.add(engineFrame1);
        
        const engineFrame2 = new THREE.Mesh(engineFrameGeometry, material);
        engineFrame2.position.set(-2.2, 0, -0.5);
        engineFrame2.rotateX(Math.PI / 2);
        group.add(engineFrame2);
        
        return group;
    }

    createWhirlwindClass(material) {
        // Whirlwind-class: Abyssal plains behemoth with maximum systems (scaled to proper 1:1 size)
        const group = new THREE.Group();

        // Massive central pressure hull - largest submarine (scaled down)
        const hullGeometry = new THREE.CylinderGeometry(0.45, 0.5, 4.0, 16);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        group.add(hull);

        // Reinforced nose cone for abyssal pressure (scaled down)
        const noseGeometry = new THREE.ConeGeometry(0.45, 1.25, 12);
        noseGeometry.rotateZ(Math.PI / 2);
        const nose = new THREE.Mesh(noseGeometry, material);
        nose.position.set(2.625, 0, 0);
        group.add(nose);
        
        // Large delta wings for stability at extreme depth (scaled down)
        const wingGeometry = new THREE.ConeGeometry(0.4, 2.0, 6);
        wingGeometry.rotateZ(Math.PI / 2);
        const leftWing = new THREE.Mesh(wingGeometry, material);
        leftWing.position.set(-0.25, 0.15, 1.0);
        leftWing.rotateY(0.5);
        leftWing.scale.set(1, 0.15, 1);
        group.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, material);
        rightWing.position.set(-0.25, 0.15, -1.0);
        rightWing.rotateY(-0.5);
        rightWing.scale.set(1, 0.15, 1);
        group.add(rightWing);
        
        // Command tower/sail structure (scaled down)
        const towerGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.25, 8);
        const tower = new THREE.Mesh(towerGeometry, material);
        tower.position.set(0.5, 0.65, 0);
        group.add(tower);

        // Massive engine cluster - six engines for power (scaled down)
        const engineGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.1);
        engineGeometry.rotateZ(Math.PI / 2);

        // Main engine cluster (all positions scaled down by half)
        const engine1 = new THREE.Mesh(engineGeometry, material);
        engine1.position.set(-1.75, 0.2, 0.45);
        group.add(engine1);

        const engine2 = new THREE.Mesh(engineGeometry, material);
        engine2.position.set(-1.75, 0.2, -0.45);
        group.add(engine2);

        const engine3 = new THREE.Mesh(engineGeometry, material);
        engine3.position.set(-1.75, 0, 0.65);
        group.add(engine3);

        const engine4 = new THREE.Mesh(engineGeometry, material);
        engine4.position.set(-1.75, 0, -0.65);
        group.add(engine4);

        const engine5 = new THREE.Mesh(engineGeometry, material);
        engine5.position.set(-1.75, -0.2, 0.45);
        group.add(engine5);
        
        const engine6 = new THREE.Mesh(engineGeometry, material);
        engine6.position.set(-1.75, -0.2, -0.45);
        group.add(engine6);
        
        // Wing support structure (3D printing support)
        const wingStrutGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.4);
        const leftWingStrut = new THREE.Mesh(wingStrutGeometry, material);
        leftWingStrut.position.set(-0.3, 0.2, 1.3);
        leftWingStrut.rotateX(Math.PI / 2);
        group.add(leftWingStrut);
        
        const rightWingStrut = new THREE.Mesh(wingStrutGeometry, material);
        rightWingStrut.position.set(-0.3, 0.2, -1.3);
        rightWingStrut.rotateX(Math.PI / 2);
        group.add(rightWingStrut);
        
        // Tower support struts (3D printing support)
        const towerStrutGeometry = new THREE.CylinderGeometry(0.06, 0.06, 1.0);
        const frontTowerStrut = new THREE.Mesh(towerStrutGeometry, material);
        frontTowerStrut.position.set(1.5, 0.65, 0);
        group.add(frontTowerStrut);
        
        const rearTowerStrut = new THREE.Mesh(towerStrutGeometry, material);
        rearTowerStrut.position.set(0.5, 0.65, 0);
        group.add(rearTowerStrut);
        
        // Massive engine support framework (3D printing support)
        const engineFrameGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.6);
        const engineFrame1 = new THREE.Mesh(engineFrameGeometry, material);
        engineFrame1.position.set(-2.8, 0.2, 0.7);
        engineFrame1.rotateX(Math.PI / 2);
        group.add(engineFrame1);
        
        const engineFrame2 = new THREE.Mesh(engineFrameGeometry, material);
        engineFrame2.position.set(-2.8, 0.2, -0.7);
        engineFrame2.rotateX(Math.PI / 2);
        group.add(engineFrame2);
        
        const engineFrame3 = new THREE.Mesh(engineFrameGeometry, material);
        engineFrame3.position.set(-2.8, -0.2, 0.7);
        engineFrame3.rotateX(Math.PI / 2);
        group.add(engineFrame3);
        
        const engineFrame4 = new THREE.Mesh(engineFrameGeometry, material);
        engineFrame4.position.set(-2.8, -0.2, -0.7);
        engineFrame4.rotateX(Math.PI / 2);
        group.add(engineFrame4);
        
        return group;
    }

    createNautilusClass(material) {
        // Nautilus-class: Modern nuclear submarine with realistic proportions and detail
        const group = new THREE.Group();
        
        // Enhanced materials for realistic submarine appearance
        const hullMaterial = new THREE.MeshPhongMaterial({
            color: 0x2c3e50,        // Dark steel blue
            shininess: 30,
            specular: 0x446688
        });
        
        const accentMaterial = new THREE.MeshPhongMaterial({
            color: 0x34495e,        // Slightly lighter steel
            shininess: 20
        });
        
        const conningTowerMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a252f,        // Darker for contrast
            shininess: 40
        });

        // Main pressure hull - realistic submarine shape
        const hullLength = 8;
        const hullRadius = 0.6;
        
        // Create hull using multiple cylinder sections for realistic tapering
        const forwardHullGeometry = new THREE.CylinderGeometry(0.3, hullRadius, hullLength * 0.4, 12);
        forwardHullGeometry.rotateZ(Math.PI / 2);
        const forwardHull = new THREE.Mesh(forwardHullGeometry, hullMaterial);
        forwardHull.position.set(hullLength * 0.25, 0, 0);
        group.add(forwardHull);
        
        // Mid-section (largest part)
        const midHullGeometry = new THREE.CylinderGeometry(hullRadius, hullRadius, hullLength * 0.4, 16);
        midHullGeometry.rotateZ(Math.PI / 2);
        const midHull = new THREE.Mesh(midHullGeometry, hullMaterial);
        midHull.position.set(-0.3, 0, 0);
        group.add(midHull);
        
        // Aft section (tapering toward propeller)
        const aftHullGeometry = new THREE.CylinderGeometry(hullRadius, 0.25, hullLength * 0.3, 12);
        aftHullGeometry.rotateZ(Math.PI / 2);
        const aftHull = new THREE.Mesh(aftHullGeometry, hullMaterial);
        aftHull.position.set(-hullLength * 0.35, 0, 0);
        group.add(aftHull);

        // Conning tower/sail - realistic proportions
        const sailGeometry = new THREE.BoxGeometry(2.0, 1.8, 0.6);
        const sail = new THREE.Mesh(sailGeometry, conningTowerMaterial);
        sail.position.set(0.5, 0.9, 0);
        group.add(sail);
        
        // Sail top with periscopes and masts
        const sailTopGeometry = new THREE.BoxGeometry(1.6, 0.3, 0.5);
        const sailTop = new THREE.Mesh(sailTopGeometry, conningTowerMaterial);
        sailTop.position.set(0.5, 1.8, 0);
        group.add(sailTop);

        // Periscope masts
        const periscopeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
        
        const periscope1 = new THREE.Mesh(periscopeGeometry, accentMaterial);
        periscope1.position.set(0.2, 2.4, -0.1);
        group.add(periscope1);
        
        const periscope2 = new THREE.Mesh(periscopeGeometry, accentMaterial);
        periscope2.position.set(0.8, 2.4, 0.1);
        group.add(periscope2);

        // Bow sonar dome
        const sonarDomeGeometry = new THREE.SphereGeometry(0.4, 12, 8);
        sonarDomeGeometry.scale(1.5, 1, 1); // Elongate forward
        const sonarDome = new THREE.Mesh(sonarDomeGeometry, accentMaterial);
        sonarDome.position.set(hullLength * 0.45, 0, 0);
        group.add(sonarDome);

        // Torpedo tube doors (6 tubes arranged in circle)
        const tubeRadius = 0.08;
        const tubePositions = [
            [0, 0.15], [0.13, 0.075], [0.13, -0.075], 
            [0, -0.15], [-0.13, -0.075], [-0.13, 0.075]
        ];
        
        tubePositions.forEach((pos, i) => {
            const tubeGeometry = new THREE.CylinderGeometry(tubeRadius, tubeRadius, 0.1, 8);
            tubeGeometry.rotateZ(Math.PI / 2);
            const tube = new THREE.Mesh(tubeGeometry, accentMaterial);
            tube.position.set(hullLength * 0.42, pos[1], pos[0]);
            group.add(tube);
        });

        // Diving planes (forward)
        const forwardPlaneGeometry = new THREE.BoxGeometry(0.05, 1.8, 0.3);
        const forwardPlaneL = new THREE.Mesh(forwardPlaneGeometry, accentMaterial);
        forwardPlaneL.position.set(2.5, 0, -0.9);
        forwardPlaneL.rotateY(Math.PI * 0.1);
        group.add(forwardPlaneL);
        
        const forwardPlaneR = new THREE.Mesh(forwardPlaneGeometry, accentMaterial);
        forwardPlaneR.position.set(2.5, 0, 0.9);
        forwardPlaneR.rotateY(-Math.PI * 0.1);
        group.add(forwardPlaneR);

        // Stern diving planes
        const sternPlaneGeometry = new THREE.BoxGeometry(0.05, 1.2, 0.25);
        const sternPlaneL = new THREE.Mesh(sternPlaneGeometry, accentMaterial);
        sternPlaneL.position.set(-2.8, 0, -0.6);
        group.add(sternPlaneL);
        
        const sternPlaneR = new THREE.Mesh(sternPlaneGeometry, accentMaterial);
        sternPlaneR.position.set(-2.8, 0, 0.6);
        group.add(sternPlaneR);

        // Vertical rudder/stabilizer
        const rudderGeometry = new THREE.BoxGeometry(0.05, 1.4, 0.25);
        const rudder = new THREE.Mesh(rudderGeometry, accentMaterial);
        rudder.position.set(-3.2, 0.7, 0);
        group.add(rudder);

        // Propeller hub (simplified)
        const propHubGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.3, 8);
        propHubGeometry.rotateZ(Math.PI / 2);
        const propHub = new THREE.Mesh(propHubGeometry, accentMaterial);
        propHub.position.set(-3.8, 0, 0);
        group.add(propHub);

        // Propeller blades
        const bladeGeometry = new THREE.BoxGeometry(0.02, 1.2, 0.3);
        for (let i = 0; i < 4; i++) {
            const blade = new THREE.Mesh(bladeGeometry, accentMaterial);
            blade.position.set(-3.8, 0, 0);
            blade.rotateX((Math.PI / 2) * i);
            blade.rotateZ(Math.PI * 0.2); // Pitched for thrust
            group.add(blade);
        }

        // Hull reinforcement rings (aesthetic detail)
        for (let i = 0; i < 6; i++) {
            const ringGeometry = new THREE.TorusGeometry(hullRadius + 0.02, 0.03, 8, 16);
            ringGeometry.rotateY(Math.PI / 2);
            const ring = new THREE.Mesh(ringGeometry, accentMaterial);
            ring.position.set(3 - i * 1.2, 0, 0);
            group.add(ring);
        }

        // Ballast tank vents (small details)
        const ventGeometry = new THREE.BoxGeometry(0.02, 0.1, 0.05);
        for (let i = 0; i < 8; i++) {
            const vent = new THREE.Mesh(ventGeometry, accentMaterial);
            vent.position.set(2 - i * 0.7, hullRadius + 0.05, 0);
            group.add(vent);
        }

        // Navigation lights
        const navLightGeometry = new THREE.SphereGeometry(0.05, 8, 6);
        
        // Red port light
        const redLightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
        const portLight = new THREE.Mesh(navLightGeometry, redLightMaterial);
        portLight.position.set(3.5, 0, -0.3);
        group.add(portLight);
        
        // Green starboard light  
        const greenLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
        const starboardLight = new THREE.Mesh(navLightGeometry, greenLightMaterial);
        starboardLight.position.set(3.5, 0, 0.3);
        group.add(starboardLight);
        
        // White stern light
        const whiteLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
        const sternLight = new THREE.Mesh(navLightGeometry, whiteLightMaterial);
        sternLight.position.set(-3.5, 0, 0);
        group.add(sternLight);

        console.log('🚢 NAUTILUS-class submarine created with realistic naval architecture');
        return group;
    }

    createCobraClass(material) {
        // Cobra Mk III - Classic Oolite ship adapted as submarine
        const group = new THREE.Group();

        // Try to get Oolite loader
        let ooliteLoader = null;
        if (window.getOoliteLoader) {
            ooliteLoader = window.getOoliteLoader();
        }
        
        // If no loader exists, try to initialize it
        if (!ooliteLoader && window.initOoliteLoader && this.scene) {
            console.log('🐍 Initializing Oolite loader...');
            ooliteLoader = window.initOoliteLoader(this.scene);
        }

        // Try to load Oolite Cobra model if loader is available
        if (ooliteLoader && ooliteLoader.loadModel) {
            console.log('🐍 Attempting to load Oolite Cobra model...');
            
            // Load the Cobra model asynchronously
            ooliteLoader.loadModel('models/cobra3.json', {
                scale: 0.1, // Scale down from ship to submarine size
                rotation: { x: 0, y: Math.PI, z: 0 }, // Face forward
                material: material
            })
                .then((cobraModel) => {
                    console.log('🐍 Oolite Cobra model loaded successfully');
                    
                    // Clear any existing fallback geometry
                    group.clear();
                    
                    // Add the loaded model
                    group.add(cobraModel);
                })
                .catch((error) => {
                    console.warn('⚠️ Failed to load Oolite Cobra model, using fallback:', error);
                    // Don't clear group here since fallback is already added
                });
        } else {
            console.log('🐍 Oolite loader not available, using fallback Cobra geometry');
        }
        
        // Always create fallback geometry first (will be replaced if Oolite model loads)
        this.createCobraFallback(group, material);

        console.log('🐍 COBRA-class submarine created');
        return group;
    }

    createCobraFallback(group, material) {
        // Fallback Cobra-inspired geometry if Oolite model fails to load
        
        // Main hull - sleek and angular like the Cobra Mk III (proper 1:1 scale)
        const hullGeometry = new THREE.CylinderGeometry(0.75, 0.375, 11.25, 6);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        hull.position.set(0, 0, 0);
        group.add(hull);

        // Cobra-style angular nose (proper 1:1 scale)
        const noseGeometry = new THREE.ConeGeometry(0.375, 3.0, 6);
        noseGeometry.rotateZ(Math.PI / 2);
        const nose = new THREE.Mesh(noseGeometry, material);
        nose.position.set(7.125, 0, 0);
        group.add(nose);

        // Angular wings/fins (Cobra signature feature) - proper 1:1 scale
        const wingGeometry = new THREE.BoxGeometry(2.0, 0.25, 3.0);
        const leftWing = new THREE.Mesh(wingGeometry, material);
        leftWing.position.set(-1.25, 0, 2.0);
        leftWing.rotation.z = 0.2;
        group.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, material);
        rightWing.position.set(-1.25, 0, -2.0);
        rightWing.rotation.z = -0.2;
        group.add(rightWing);

        // Cobra-style angular conning tower (proper 1:1 scale)
        const sailGeometry = new THREE.BoxGeometry(2.5, 1.5, 1.0);
        const sail = new THREE.Mesh(sailGeometry, material);
        sail.position.set(0.75, 1.0, 0);
        group.add(sail);

        // Engine nacelles (Cobra has twin engines) - proper 1:1 scale
        const engineGeometry = new THREE.CylinderGeometry(0.25, 0.375, 2.5, 6);
        engineGeometry.rotateZ(Math.PI / 2);

        const leftEngine = new THREE.Mesh(engineGeometry, material);
        leftEngine.position.set(-5.0, 0, 0.75);
        group.add(leftEngine);

        const rightEngine = new THREE.Mesh(engineGeometry, material);
        rightEngine.position.set(-5.0, 0, -0.75);
        group.add(rightEngine);

        // Cobra-style rear fins
        const finGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.1);
        const topFin = new THREE.Mesh(finGeometry, material);
        topFin.position.set(-1.8, 0.3, 0);
        group.add(topFin);

        console.log('🐍 Cobra fallback geometry created');
    }

    // NPC SUBMARINE CREATE METHODS WITH PLACEHOLDER GRAPHICS

    createSquallClass(material) {
        // Squall-class: Medium Fighter Sub - NPC ONLY
        const group = new THREE.Group();

        // Main hull - medium fighter design
        const hullGeometry = new THREE.CylinderGeometry(0.35, 0.28, 4.0, 8);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        group.add(hull);

        // Command tower
        const towerGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.25);
        const tower = new THREE.Mesh(towerGeometry, material);
        tower.position.set(0.3, 0.4, 0);
        group.add(tower);

        // Weapon mounts (3 launchers)
        for (let i = 0; i < 3; i++) {
            const launcherGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 6);
            const launcher = new THREE.Mesh(launcherGeometry, material);
            launcher.position.set(1.5, -0.2, (i - 1) * 0.3);
            group.add(launcher);
        }

        console.log('⚔️ SQUALL-class submarine created (Medium Fighter)');
        return group;
    }

    createFuryClass(material) {
        // Fury-class: Troop Transport - NPC ONLY
        const group = new THREE.Group();

        // Large transport hull
        const hullGeometry = new THREE.CylinderGeometry(0.75, 0.7, 16.0, 12);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        group.add(hull);

        // Large command section
        const commandGeometry = new THREE.BoxGeometry(2.0, 1.5, 0.8);
        const command = new THREE.Mesh(commandGeometry, material);
        command.position.set(2.0, 0.8, 0);
        group.add(command);

        // Troop compartments (visible external pods)
        for (let i = 0; i < 4; i++) {
            const podGeometry = new THREE.BoxGeometry(3.0, 0.8, 0.6);
            const pod = new THREE.Mesh(podGeometry, material);
            pod.position.set(-2 + i * 2, -0.6, 0);
            group.add(pod);
        }

        // No weapons - transport role
        console.log('🚢 FURY-class submarine created (Troop Transport)');
        return group;
    }

    createHailstormClass(material) {
        // Hailstorm-class: Light Trader Sub - NPC ONLY
        const group = new THREE.Group();

        // Small trader hull
        const hullGeometry = new THREE.CylinderGeometry(0.4, 0.35, 5.0, 8);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        group.add(hull);

        // Cargo section
        const cargoGeometry = new THREE.BoxGeometry(2.5, 0.8, 0.8);
        const cargo = new THREE.Mesh(cargoGeometry, material);
        cargo.position.set(-1.5, 0, 0);
        group.add(cargo);

        // Single launcher
        const launcherGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.25, 6);
        const launcher = new THREE.Mesh(launcherGeometry, material);
        launcher.position.set(2.0, -0.15, 0);
        group.add(launcher);

        console.log('📦 HAILSTORM-class submarine created (Light Trader)');
        return group;
    }

    createJumboClass(material) {
        // Jumbo-class: Bulk Cargo Sub - NPC ONLY
        const group = new THREE.Group();

        // Massive cargo hull
        const hullGeometry = new THREE.CylinderGeometry(1.25, 1.15, 24.0, 16);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        group.add(hull);

        // Massive cargo containers
        for (let i = 0; i < 6; i++) {
            const containerGeometry = new THREE.BoxGeometry(3.5, 1.8, 1.6);
            const container = new THREE.Mesh(containerGeometry, material);
            container.position.set(-8 + i * 3, 0, 0);
            group.add(container);
        }

        // Command section
        const commandGeometry = new THREE.BoxGeometry(2.5, 1.2, 1.0);
        const command = new THREE.Mesh(commandGeometry, material);
        command.position.set(10, 0.8, 0);
        group.add(command);

        // No weapons - cargo role
        console.log('🏗️ JUMBO-class submarine created (Bulk Cargo)');
        return group;
    }

    createTsunamiClass(material) {
        // Tsunami-class: Strategic Carrier Sub - NPC ONLY
        const group = new THREE.Group();

        // Massive strategic hull
        const hullGeometry = new THREE.CylinderGeometry(1.75, 1.5, 30.0, 20);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        group.add(hull);

        // Strategic command tower
        const towerGeometry = new THREE.BoxGeometry(4.0, 2.0, 1.5);
        const tower = new THREE.Mesh(towerGeometry, material);
        tower.position.set(5.0, 1.2, 0);
        group.add(tower);

        // Multiple weapon sections (10 launchers)
        for (let i = 0; i < 10; i++) {
            const weaponGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
            const weapon = new THREE.Mesh(weaponGeometry, material);
            weapon.position.set(8 + (i % 6) * 2, -0.3, (Math.floor(i / 6) - 0.5) * 1.2);
            group.add(weapon);
        }

        console.log('🏰 TSUNAMI-class submarine created (Strategic Carrier)');
        return group;
    }

    createQuestClass(material) {
        // Quest-class: Ultra Deep Strategic Sub - NPC ONLY
        const group = new THREE.Group();

        // Ultra-deep reinforced hull
        const hullGeometry = new THREE.CylinderGeometry(1.5, 1.4, 20.0, 16);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        group.add(hull);

        // Reinforced pressure sections
        for (let i = 0; i < 4; i++) {
            const sectionGeometry = new THREE.SphereGeometry(0.8, 8, 6);
            const section = new THREE.Mesh(sectionGeometry, material);
            section.position.set(-6 + i * 4, 0, 0);
            group.add(section);
        }

        // Strategic weapons (6 launchers)
        for (let i = 0; i < 6; i++) {
            const weaponGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.35, 8);
            const weapon = new THREE.Mesh(weaponGeometry, material);
            weapon.position.set(6 + (i % 4) * 1.5, -0.25, (Math.floor(i / 4) - 0.5) * 0.8);
            group.add(weapon);
        }

        console.log('🔱 QUEST-class submarine created (Ultra Deep Strategic)');
        return group;
    }

    createAdventureClass(material) {
        // Adventure-class: Deep Strategic Sub - NPC ONLY
        const group = new THREE.Group();

        // Deep strategic hull
        const hullGeometry = new THREE.CylinderGeometry(1.25, 1.15, 17.0, 14);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        group.add(hull);

        // Strategic command section
        const commandGeometry = new THREE.BoxGeometry(3.0, 1.5, 1.2);
        const command = new THREE.Mesh(commandGeometry, material);
        command.position.set(3.0, 0.9, 0);
        group.add(command);

        // Strategic weapons (4 launchers)
        for (let i = 0; i < 4; i++) {
            const weaponGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8);
            const weapon = new THREE.Mesh(weaponGeometry, material);
            weapon.position.set(6, -0.2, (i - 1.5) * 0.6);
            group.add(weapon);
        }

        console.log('🗺️ ADVENTURE-class submarine created (Deep Strategic)');
        return group;
    }

    createMissionClass(material) {
        // Mission-class: Deep Tactical Sub - NPC ONLY
        const group = new THREE.Group();

        // Deep tactical hull
        const hullGeometry = new THREE.CylinderGeometry(1.0, 0.9, 14.0, 12);
        hullGeometry.rotateZ(Math.PI / 2);
        const hull = new THREE.Mesh(hullGeometry, material);
        group.add(hull);

        // Tactical command section
        const commandGeometry = new THREE.BoxGeometry(2.5, 1.2, 0.8);
        const command = new THREE.Mesh(commandGeometry, material);
        command.position.set(2.5, 0.7, 0);
        group.add(command);

        // Tactical weapons (3 launchers)
        for (let i = 0; i < 3; i++) {
            const weaponGeometry = new THREE.CylinderGeometry(0.055, 0.055, 0.28, 8);
            const weapon = new THREE.Mesh(weaponGeometry, material);
            weapon.position.set(5.5, -0.18, (i - 1) * 0.5);
            group.add(weapon);
        }

        console.log('🎯 MISSION-class submarine created (Deep Tactical)');
        return group;
    }

    // NPC AI BEHAVIOR SYSTEM

    initializeAI(submarineClass) {
        // Initialize AI behavior based on submarine class and role
        this.ai = {
            enabled: true,
            submarineClass: submarineClass,
            state: 'patrolling', // patrolling, engaging, retreating, searching, escorting
            target: null,
            lastTargetPosition: null,
            patrolRoute: [],
            currentPatrolIndex: 0,
            detectionRange: this.getDetectionRange(submarineClass),
            engagementRange: this.getEngagementRange(submarineClass),
            maxSpeed: this.getMaxSpeed(submarineClass),
            aggressiveness: this.getAggressiveness(submarineClass),
            evasionSkill: this.getEvasionSkill(submarineClass),
            reactionTime: this.getReactionTime(submarineClass),
            lastDecisionTime: 0,
            decisionInterval: 1000, // Make decisions every 1 second
            lastSensorSweep: 0,
            sensorSweepInterval: 500, // Sensor sweep every 0.5 seconds
            engagementStartTime: 0,
            maxEngagementTime: 30000, // 30 seconds max engagement before retreat consideration
            lastWeaponFire: 0,
            weaponCooldown: this.getWeaponCooldown(submarineClass),
            formation: null, // For group behavior
            groupRole: this.getGroupRole(submarineClass)
        };

        // Generate patrol route based on submarine role
        this.generatePatrolRoute();

        console.log(`🤖 AI initialized for ${submarineClass}: ${this.ai.groupRole} role`);
    }

    getDetectionRange(submarineClass) {
        const ranges = {
            LIGHTNING: 2000, THUNDER: 1800, SQUALL: 2200,
            FURY: 1500, HAILSTORM: 1600, JUMBO: 1200,
            TSUNAMI: 4000, QUEST: 3500, ADVENTURE: 3000,
            MISSION: 2800, HURRICANE: 2500, TEMPEST: 3200
        };
        return ranges[submarineClass] || 2000;
    }

    getEngagementRange(submarineClass) {
        const ranges = {
            LIGHTNING: 1500, THUNDER: 1400, SQUALL: 1600,
            FURY: 0, HAILSTORM: 800, JUMBO: 0,
            TSUNAMI: 3000, QUEST: 2500, ADVENTURE: 2200,
            MISSION: 2000, HURRICANE: 1800, TEMPEST: 2400
        };
        return ranges[submarineClass] || 1500;
    }

    getMaxSpeed(submarineClass) {
        const specs = SUBMARINE_SPECIFICATIONS[submarineClass];
        return specs ? specs.maxSpeedForward : 50;
    }

    getAggressiveness(submarineClass) {
        const aggression = {
            LIGHTNING: 0.8, THUNDER: 0.7, SQUALL: 0.75,
            FURY: 0.1, HAILSTORM: 0.3, JUMBO: 0.1,
            TSUNAMI: 0.6, QUEST: 0.5, ADVENTURE: 0.55,
            MISSION: 0.7, HURRICANE: 0.6, TEMPEST: 0.4
        };
        return aggression[submarineClass] || 0.5;
    }

    getEvasionSkill(submarineClass) {
        const evasion = {
            LIGHTNING: 0.9, THUNDER: 0.8, SQUALL: 0.7,
            FURY: 0.3, HAILSTORM: 0.5, JUMBO: 0.2,
            TSUNAMI: 0.4, QUEST: 0.5, ADVENTURE: 0.6,
            MISSION: 0.7, HURRICANE: 0.6, TEMPEST: 0.5
        };
        return evasion[submarineClass] || 0.5;
    }

    getReactionTime(submarineClass) {
        const reaction = {
            LIGHTNING: 200, THUNDER: 300, SQUALL: 400,
            FURY: 800, HAILSTORM: 600, JUMBO: 1000,
            TSUNAMI: 600, QUEST: 500, ADVENTURE: 450,
            MISSION: 350, HURRICANE: 400, TEMPEST: 500
        };
        return reaction[submarineClass] || 500;
    }

    getWeaponCooldown(submarineClass) {
        const cooldown = {
            LIGHTNING: 2000, THUNDER: 2200, SQUALL: 2500,
            FURY: 0, HAILSTORM: 4000, JUMBO: 0,
            TSUNAMI: 1500, QUEST: 1800, ADVENTURE: 2000,
            MISSION: 2200, HURRICANE: 2400, TEMPEST: 2800
        };
        return cooldown[submarineClass] || 3000;
    }

    getGroupRole(submarineClass) {
        const roles = {
            LIGHTNING: 'scout', THUNDER: 'patrol', SQUALL: 'fighter',
            FURY: 'transport', HAILSTORM: 'trader', JUMBO: 'cargo',
            TSUNAMI: 'command', QUEST: 'strategic', ADVENTURE: 'explorer',
            MISSION: 'specialist', HURRICANE: 'patrol', TEMPEST: 'commander'
        };
        return roles[submarineClass] || 'patrol';
    }

    generatePatrolRoute() {
        // Generate patrol route based on submarine role and current position
        const role = this.ai.groupRole;
        const startPos = this.position.clone();
        this.ai.patrolRoute = [];

        switch (role) {
            case 'scout':
                // Wide perimeter patrol
                this.generatePerimeterPatrol(startPos, 3000, 8);
                break;
            case 'patrol':
                // Regular patrol pattern
                this.generatePerimeterPatrol(startPos, 2000, 6);
                break;
            case 'fighter':
                // Aggressive patrol with intercept points
                this.generateInterceptPatrol(startPos, 2500, 6);
                break;
            case 'transport':
            case 'trader':
            case 'cargo':
                // Point-to-point routes with waypoints
                this.generateCargoRoute(startPos);
                break;
            case 'command':
            case 'commander':
                // Central position with defensive patrol
                this.generateDefensivePatrol(startPos, 1500, 4);
                break;
            case 'strategic':
            case 'explorer':
                // Deep ocean exploration pattern
                this.generateExplorationPatrol(startPos, 4000, 8);
                break;
            case 'specialist':
                // Mission-specific patrol
                this.generateMissionPatrol(startPos, 2200, 6);
                break;
            default:
                this.generatePerimeterPatrol(startPos, 2000, 6);
        }
    }

    generatePerimeterPatrol(center, radius, points) {
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const x = center.x + Math.cos(angle) * radius;
            const z = center.z + Math.sin(angle) * radius;
            const y = center.y + (Math.random() - 0.5) * 200; // Depth variation
            this.ai.patrolRoute.push(new THREE.Vector3(x, y, z));
        }
    }

    generateInterceptPatrol(center, radius, points) {
        // Aggressive patrol with intercept positions
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const x = center.x + Math.cos(angle) * radius * (0.8 + Math.random() * 0.4);
            const z = center.z + Math.sin(angle) * radius * (0.8 + Math.random() * 0.4);
            const y = center.y + (Math.random() - 0.5) * 300;
            this.ai.patrolRoute.push(new THREE.Vector3(x, y, z));
        }
    }

    generateCargoRoute(start) {
        // Simple point-to-point with safety waypoints
        const waypoints = [
            start.clone(),
            new THREE.Vector3(start.x + 2000, start.y, start.z + 1000),
            new THREE.Vector3(start.x + 4000, start.y - 100, start.z + 2000),
            new THREE.Vector3(start.x + 6000, start.y, start.z + 1000),
            new THREE.Vector3(start.x + 4000, start.y + 100, start.z - 1000)
        ];
        this.ai.patrolRoute = waypoints;
    }

    generateDefensivePatrol(center, radius, points) {
        // Tight defensive pattern
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const x = center.x + Math.cos(angle) * radius * 0.7;
            const z = center.z + Math.sin(angle) * radius * 0.7;
            const y = center.y + Math.sin(i) * 100;
            this.ai.patrolRoute.push(new THREE.Vector3(x, y, z));
        }
    }

    generateExplorationPatrol(center, radius, points) {
        // Wide exploration pattern
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2 + Math.random() * 0.5;
            const x = center.x + Math.cos(angle) * radius * (1 + Math.random() * 0.5);
            const z = center.z + Math.sin(angle) * radius * (1 + Math.random() * 0.5);
            const y = center.y + (Math.random() - 0.5) * 500; // Deep exploration
            this.ai.patrolRoute.push(new THREE.Vector3(x, y, z));
        }
    }

    generateMissionPatrol(center, radius, points) {
        // Mission-specific tactical patrol
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const x = center.x + Math.cos(angle) * radius;
            const z = center.z + Math.sin(angle) * radius;
            const y = center.y + Math.sin(i * 2) * 150;
            this.ai.patrolRoute.push(new THREE.Vector3(x, y, z));
        }
    }

    updateAI(deltaTime) {
        if (!this.ai || !this.ai.enabled) return;

        const now = Date.now();

        // Sensor sweep for targets
        if (now - this.ai.lastSensorSweep > this.ai.sensorSweepInterval) {
            this.performSensorSweep();
            this.ai.lastSensorSweep = now;
        }

        // Make decisions at intervals
        if (now - this.ai.lastDecisionTime > this.ai.decisionInterval) {
            this.makeAIDecision();
            this.ai.lastDecisionTime = now;
        }

        // Execute current behavior
        this.executeAIBehavior(deltaTime);

        // Update AI state timers
        this.updateAITimers(now);
    }

    performSensorSweep() {
        // Detect nearby targets (player submarine, other NPCs)
        if (!window.gameState || !window.gameState.playerSubmarine) return;

        const playerPos = window.gameState.playerSubmarine.getPosition();
        const distance = this.position.distanceTo(playerPos);

        // Check if player is within detection range
        if (distance <= this.ai.detectionRange) {
            // Detection probability based on distance and stealth
            const detectionProb = Math.max(0.1, 1 - (distance / this.ai.detectionRange));

            if (Math.random() < detectionProb) {
                this.ai.target = window.gameState.playerSubmarine;
                this.ai.lastTargetPosition = playerPos.clone();

                if (this.ai.state === 'patrolling' && distance <= this.ai.engagementRange) {
                    this.ai.state = 'engaging';
                    this.ai.engagementStartTime = Date.now();
                    console.log(`🎯 ${this.ai.submarineClass} detected and engaging target at ${Math.round(distance)}m`);
                }
            }
        } else if (this.ai.target && distance > this.ai.detectionRange * 1.5) {
            // Lost target
            this.ai.target = null;
            if (this.ai.state === 'engaging') {
                this.ai.state = 'searching';
                console.log(`❓ ${this.ai.submarineClass} lost target, searching...`);
            }
        }
    }

    makeAIDecision() {
        const now = Date.now();

        switch (this.ai.state) {
            case 'patrolling':
                this.decidePatrolAction();
                break;
            case 'engaging':
                this.decideEngagementAction(now);
                break;
            case 'retreating':
                this.decideRetreatAction();
                break;
            case 'searching':
                this.decideSearchAction();
                break;
            case 'escorting':
                this.decideEscortAction();
                break;
        }
    }

    decidePatrolAction() {
        // Continue patrol unless target detected
        if (this.ai.target && this.ai.aggressiveness > 0.3) {
            this.ai.state = 'engaging';
        }
    }

    decideEngagementAction(now) {
        if (!this.ai.target) {
            this.ai.state = 'searching';
            return;
        }

        const distance = this.position.distanceTo(this.ai.target.getPosition());
        const engagementTime = now - this.ai.engagementStartTime;

        // Check if should retreat
        if (engagementTime > this.ai.maxEngagementTime ||
            (this.getHealthPercentage() < 0.3 && this.ai.aggressiveness < 0.7)) {
            this.ai.state = 'retreating';
            console.log(`🏃 ${this.ai.submarineClass} retreating after ${engagementTime/1000}s engagement`);
            return;
        }

        // Decide on combat tactics
        if (distance > this.ai.engagementRange * 1.2) {
            this.ai.state = 'searching';
        } else if (distance <= this.ai.engagementRange && now - this.ai.lastWeaponFire > this.ai.weaponCooldown) {
            this.attemptWeaponFire();
        }
    }

    decideRetreatAction() {
        // Continue retreating until safe distance or health recovered
        if (!this.ai.target || this.getHealthPercentage() > 0.7) {
            this.ai.state = 'patrolling';
            console.log(`✅ ${this.ai.submarineClass} retreat complete, resuming patrol`);
        }
    }

    decideSearchAction() {
        // Search for lost target or return to patrol
        if (this.ai.target) {
            this.ai.state = 'engaging';
        } else if (Date.now() - this.ai.lastDecisionTime > 10000) {
            this.ai.state = 'patrolling';
            console.log(`🔄 ${this.ai.submarineClass} search timeout, resuming patrol`);
        }
    }

    decideEscortAction() {
        // Escort behavior for transport/cargo subs
        if (this.ai.target && this.ai.aggressiveness > 0.5) {
            this.ai.state = 'engaging';
        }
    }

    executeAIBehavior(deltaTime) {
        switch (this.ai.state) {
            case 'patrolling':
                this.executePatrolBehavior(deltaTime);
                break;
            case 'engaging':
                this.executeEngagementBehavior(deltaTime);
                break;
            case 'retreating':
                this.executeRetreatBehavior(deltaTime);
                break;
            case 'searching':
                this.executeSearchBehavior(deltaTime);
                break;
            case 'escorting':
                this.executeEscortBehavior(deltaTime);
                break;
        }
    }

    executePatrolBehavior(deltaTime) {
        if (this.ai.patrolRoute.length === 0) return;

        const currentWaypoint = this.ai.patrolRoute[this.ai.currentPatrolIndex];
        const distance = this.position.distanceTo(currentWaypoint);

        if (distance < 50) {
            // Reached waypoint, move to next
            this.ai.currentPatrolIndex = (this.ai.currentPatrolIndex + 1) % this.ai.patrolRoute.length;
        } else {
            // Move toward current waypoint
            this.moveTowardsPosition(currentWaypoint, this.ai.maxSpeed * 0.6, deltaTime);
        }
    }

    executeEngagementBehavior(deltaTime) {
        if (!this.ai.target) {
            this.ai.state = 'searching';
            return;
        }

        const targetPos = this.ai.target.getPosition();
        const distance = this.position.distanceTo(targetPos);

        // Combat maneuvering with evasion
        const evasionFactor = this.ai.evasionSkill * Math.random();
        const optimalRange = this.ai.engagementRange * 0.8;

        if (distance > optimalRange) {
            // Close to optimal range
            this.moveTowardsPosition(targetPos, this.ai.maxSpeed * 0.9, deltaTime);
        } else {
            // Maintain range with evasive maneuvers
            const evasionOffset = new THREE.Vector3(
                (Math.random() - 0.5) * 200 * evasionFactor,
                (Math.random() - 0.5) * 100 * evasionFactor,
                (Math.random() - 0.5) * 200 * evasionFactor
            );
            const evasiveTarget = targetPos.clone().add(evasionOffset);
            this.moveTowardsPosition(evasiveTarget, this.ai.maxSpeed * 0.7, deltaTime);
        }
    }

    executeRetreatBehavior(deltaTime) {
        if (!this.ai.target) {
            this.ai.state = 'patrolling';
            return;
        }

        // Move away from target at maximum speed
        const targetPos = this.ai.target.getPosition();
        const retreatDirection = this.position.clone().sub(targetPos).normalize();
        const retreatTarget = this.position.clone().add(retreatDirection.multiplyScalar(1000));

        this.moveTowardsPosition(retreatTarget, this.ai.maxSpeed, deltaTime);
    }

    executeSearchBehavior(deltaTime) {
        if (this.ai.lastTargetPosition) {
            // Search around last known target position
            const searchOffset = new THREE.Vector3(
                (Math.random() - 0.5) * 500,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 500
            );
            const searchTarget = this.ai.lastTargetPosition.clone().add(searchOffset);
            this.moveTowardsPosition(searchTarget, this.ai.maxSpeed * 0.8, deltaTime);
        } else {
            this.executePatrolBehavior(deltaTime);
        }
    }

    executeEscortBehavior(deltaTime) {
        // Simple escort behavior - follow patrol route but be ready to defend
        this.executePatrolBehavior(deltaTime);
    }

    moveTowardsPosition(targetPosition, speed, deltaTime) {
        const direction = targetPosition.clone().sub(this.position).normalize();
        const movement = direction.multiplyScalar(speed * deltaTime * 0.016); // 60fps normalization

        this.position.add(movement);

        // Update submarine orientation to face movement direction
        if (direction.length() > 0.1) {
            const targetRotation = Math.atan2(direction.x, direction.z);
            this.rotation.y = THREE.MathUtils.lerp(this.rotation.y, targetRotation, deltaTime * 2);
        }

        // Update mesh position if it exists
        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.mesh.rotation.y = this.rotation.y;
        }
    }

    attemptWeaponFire() {
        if (!this.ai.target || this.ai.engagementRange === 0) return;

        const now = Date.now();
        if (now - this.ai.lastWeaponFire < this.ai.weaponCooldown) return;

        const distance = this.position.distanceTo(this.ai.target.getPosition());
        if (distance > this.ai.engagementRange) return;

        // Simulate weapon fire
        this.ai.lastWeaponFire = now;
        console.log(`💥 ${this.ai.submarineClass} firing at target (${Math.round(distance)}m)`);

        // TODO: Integrate with actual weapon system
        // this.fireWeapon(this.ai.target);
    }

    getHealthPercentage() {
        // Calculate overall health percentage
        const maxHP = this.hullHP + this.engineHP + this.weaponsHP + this.sensorsHP + this.lifeSupportHP + this.navigationHP;
        const currentHP = Object.values(this.systemHP || {}).reduce((sum, hp) => sum + hp, maxHP);
        return currentHP / maxHP;
    }

    updateAITimers(now) {
        // Update various AI timers and states
        if (this.ai.state === 'engaging' && now - this.ai.engagementStartTime > this.ai.maxEngagementTime * 2) {
            // Force state change if stuck in engagement too long
            this.ai.state = 'patrolling';
            this.ai.target = null;
        }
    }

    setupControls() {
        // Mouse controls for maneuver icon
        document.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        document.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        document.addEventListener('mouseup', (event) => this.handleMouseUp(event));
        document.addEventListener('wheel', (event) => this.handleWheel(event));

        // Keyboard controls for sonar, torpedoes, and emergency systems
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));

        // Create maneuver icon visual
        this.createManeuverIcon();
    }

    createManeuverIcon() {
        // Create a simple HTML element for the maneuver icon
        this.maneuverIconElement = document.createElement('div');
        this.maneuverIconElement.style.position = 'fixed';
        this.maneuverIconElement.style.width = '20px';
        this.maneuverIconElement.style.height = '20px';
        this.maneuverIconElement.style.border = '2px solid #00ffff';
        this.maneuverIconElement.style.borderRadius = '50%';
        this.maneuverIconElement.style.backgroundColor = 'rgba(0, 255, 255, 0.3)';
        this.maneuverIconElement.style.pointerEvents = 'none';
        this.maneuverIconElement.style.zIndex = '1000';
        this.maneuverIconElement.style.left = (window.innerWidth / 2 - 10) + 'px';
        this.maneuverIconElement.style.top = (window.innerHeight / 2 - 10) + 'px';
        document.body.appendChild(this.maneuverIconElement);

        // Create dead zone indicator
        const deadZoneRadius = this.maneuverIcon.deadZoneRadius * (window.innerWidth / 2) * 0.8; // Convert to pixels
        this.deadZoneElement = document.createElement('div');
        this.deadZoneElement.style.position = 'fixed';
        this.deadZoneElement.style.width = (deadZoneRadius * 2) + 'px';
        this.deadZoneElement.style.height = (deadZoneRadius * 2) + 'px';
        this.deadZoneElement.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        this.deadZoneElement.style.borderRadius = '50%';
        this.deadZoneElement.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        this.deadZoneElement.style.pointerEvents = 'none';
        this.deadZoneElement.style.zIndex = '998';
        this.deadZoneElement.style.left = (window.innerWidth / 2 - deadZoneRadius) + 'px';
        this.deadZoneElement.style.top = (window.innerHeight / 2 - deadZoneRadius) + 'px';
        document.body.appendChild(this.deadZoneElement);

        // Create center reference point
        this.centerIconElement = document.createElement('div');
        this.centerIconElement.style.position = 'fixed';
        this.centerIconElement.style.width = '6px';
        this.centerIconElement.style.height = '6px';
        this.centerIconElement.style.border = '1px solid #ffffff';
        this.centerIconElement.style.borderRadius = '50%';
        this.centerIconElement.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        this.centerIconElement.style.pointerEvents = 'none';
        this.centerIconElement.style.zIndex = '999';
        this.centerIconElement.style.left = (window.innerWidth / 2 - 3) + 'px';
        this.centerIconElement.style.top = (window.innerHeight / 2 - 3) + 'px';
        document.body.appendChild(this.centerIconElement);
    }

    handleKeyDown(event) {
        // Prevent Tab key from losing focus
        if (event.code === 'Tab') {
            event.preventDefault();
            return;
        }

        switch (event.code) {
        case 'KeyW':
            this.keys.pitchDown = true; // Pitch down (dive)
            break;
        case 'KeyS':
            this.keys.pitchUp = true; // Pitch up (climb)
            break;
        case 'KeyA':
            this.handleYawInput('left', true);
            break;
        case 'KeyD':
            this.handleYawInput('right', true);
            break;
        case 'KeyQ':
            this.keys.decreaseDepth = true; // Decrease depth (up)
            this.handleEmergencyBlowKey('Q');
            break;
        case 'KeyE':
            this.keys.increaseDepth = true; // Increase depth (down)
            this.handleEmergencyBlowKey('E');
            break;
        case 'KeyR':
            this.performSonarPing();
            break;
        case 'KeyM':
            this.cycleSonarMode(); // Active/Passive only (M key)
            break;
        case 'KeyQ':
            this.toggleQMADSystem();
            break;
        case 'KeyH':
            this.adjustSonarRate(-1);
            break;
        case 'Minus':
            this.toggleTowedArray();
            break;
        case 'Tab':
            event.preventDefault();
            this.cycleSelectedSonarContact();
            break;
        case 'OldTab': // Keeping old code for reference
            event.preventDefault();
            console.log('TAB pressed - cycling targets');
            // Cycle targets
            if (window.weaponsSystem) {
                console.log('Weapons system found');
                if (window.weaponsSystem.updateTargets) {
                    window.weaponsSystem.updateTargets();
                }
                if (window.weaponsSystem.cycleTarget) {
                    window.weaponsSystem.cycleTarget();
                }
            } else {
                console.log('No weapons system found!');
            }
            break;
        case 'KeyC':
            // Cycle weapons
            if (window.weaponsSystem && window.weaponsSystem.cycleWeapon) {
                window.weaponsSystem.cycleWeapon();
            }
            break;
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
            // Check if Shift is held for armor redistribution
            if (event.shiftKey) {
                const facings = ['fore', 'port', 'starboard', 'aft', 'top', 'bottom'];
                const digitNum = parseInt(event.code.replace('Digit', '')) - 1;
                if (digitNum < facings.length) {
                    this.handleEmergencyArmorRedistribution(facings[digitNum]);
                }
            } else {
                // Number keys cycle through torpedoes left to right, one press = one box
                const launcherNum = parseInt(event.code.replace('Digit', ''));
                if (launcherNum >= 1 && launcherNum <= 4) {
                    this.cycleTorpedoBox(launcherNum);
                }
            }
            break;
        case 'Digit9':
            // Mine deployment (only for mine-capable submarines)
            this.deployMine();
            break;
        case 'Digit0':
            // Noisemaker deployment
            this.deployNoisemaker();
            break;
        case 'KeyC':
            // Emergency damage control - repair most damaged system
            this.startEmergencyRepair();
            break;
        case 'Space':
            event.preventDefault();
            this.fireSequentialTorpedo();
            break;
        case 'ArrowUp':
            this.keys.throttleUp = true;
            break;
        case 'ArrowDown':
            this.keys.throttleDown = true;
            break;
        case 'F1':
            event.preventDefault();
            this.startScenario('PATROL_MISSION');
            break;
        case 'F2':
            event.preventDefault();
            this.startScenario('STEALTH_OPERATION');
            break;
        case 'F3':
            event.preventDefault();
            this.startScenario('COMBAT_TRAINING');
            break;
        case 'F4':
            event.preventDefault();
            this.startScenario('RESCUE_MISSION');
            break;
        }
    }

    handleKeyUp(event) {
        switch (event.code) {
        case 'KeyW':
            this.keys.pitchDown = false;
            break;
        case 'KeyS':
            this.keys.pitchUp = false;
            break;
        case 'KeyA':
            this.handleYawInput('left', false);
            break;
        case 'KeyD':
            this.handleYawInput('right', false);
            break;
        case 'KeyQ':
            this.keys.decreaseDepth = false;
            break;
        case 'KeyE':
            this.keys.increaseDepth = false;
            break;
        case 'ArrowUp':
            this.keys.throttleUp = false;
            break;
        case 'ArrowDown':
            this.keys.throttleDown = false;
            break;
        }
    }

    handleYawInput(direction, isPressed) {
        const currentTime = Date.now();
        const keyCode = direction === 'left' ? 'KeyA' : 'KeyD';

        if (isPressed) {
            // Check for double-tap
            if (this.lastKeyPress[keyCode] &&
                (currentTime - this.lastKeyPress[keyCode]) < this.doubleTapDelay) {
                // Double-tap detected - activate drag turn
                if (direction === 'left') {
                    this.keys.dragTurnLeft = true;
                    this.keys.yawLeft = false;
                } else {
                    this.keys.dragTurnRight = true;
                    this.keys.yawRight = false;
                }
            } else {
                // Single tap - normal yaw
                if (direction === 'left') {
                    this.keys.yawLeft = true;
                    this.keys.dragTurnLeft = false;
                } else {
                    this.keys.yawRight = true;
                    this.keys.dragTurnRight = false;
                }
            }
            this.lastKeyPress[keyCode] = currentTime;
        } else {
            // Key released
            if (direction === 'left') {
                this.keys.yawLeft = false;
                this.keys.dragTurnLeft = false;
            } else {
                this.keys.yawRight = false;
                this.keys.dragTurnRight = false;
            }
        }
    }

    handleMouseMove(event) {
        // Don't process mouse movement if scenario overlay is visible
        const scenarioOverlay = document.getElementById('scenarioOverlay');
        if (scenarioOverlay) {
            const computedStyle = window.getComputedStyle(scenarioOverlay);
            const isVisible = computedStyle.display !== 'none' && 
                             !scenarioOverlay.classList.contains('hidden') &&
                             computedStyle.visibility !== 'hidden';
            if (isVisible) {
                return; // Overlay is blocking - don't process mouse movement
            }
        }

        // Record mouse movement time for auto-drift
        this.maneuverIcon.lastMouseMoveTime = Date.now();

        // Define center coordinates for screen position calculation
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Use pointer lock movement if available, otherwise fallback to client position
        if (document.pointerLockElement === document.body) {
            // Pointer lock mode - use movement deltas for relative control
            const sensitivity = 0.002;
            this.maneuverIcon.x += event.movementX * sensitivity;
            this.maneuverIcon.y += event.movementY * sensitivity;
            
            // Clamp to bounds
            this.maneuverIcon.x = Math.max(-this.maneuverIcon.maxDistance,
                Math.min(this.maneuverIcon.maxDistance, this.maneuverIcon.x));
            this.maneuverIcon.y = Math.max(-this.maneuverIcon.maxDistance,
                Math.min(this.maneuverIcon.maxDistance, this.maneuverIcon.y));
        } else {
            // Fallback to client position mode
            // Calculate normalized position (-1 to 1) - FIXED calculation
            const normalizedX = (event.clientX - centerX) / centerX;
            const normalizedY = (event.clientY - centerY) / centerY;

            // Clamp to maximum distance and apply to maneuver icon
            this.maneuverIcon.x = Math.max(-this.maneuverIcon.maxDistance,
                Math.min(this.maneuverIcon.maxDistance, normalizedX));
            this.maneuverIcon.y = Math.max(-this.maneuverIcon.maxDistance,
                Math.min(this.maneuverIcon.maxDistance, normalizedY));
        }

        // Calculate distance from center (reticle)
        const distance = Math.sqrt(this.maneuverIcon.x * this.maneuverIcon.x + this.maneuverIcon.y * this.maneuverIcon.y);

        // Check if in dead zone
        this.orientationControl.deadZoneActive = distance <= this.maneuverIcon.deadZoneRadius;

        if (!this.orientationControl.deadZoneActive) {
            // Calculate turn rate multiplier based on distance from reticle
            this.orientationControl.turnRateMultiplier = Math.min(5.0, distance * 6.0); // Max 5x turn rate

            // Calculate target orientation - DIRECT mouse control
            // Left mouse move → rotate left (positive yaw in Three.js)
            // Right mouse move → rotate right (negative yaw in Three.js)
            // Up mouse move → pitch up (positive pitch in Three.js)
            // Down mouse move → pitch down (negative pitch in Three.js)
            // Note: maneuverIcon.x is positive when mouse is RIGHT of center
            //       maneuverIcon.y is positive when mouse is BELOW center (screen Y inverted)
            this.orientationControl.targetYaw = -this.maneuverIcon.x * Math.PI * 0.25; // Left = positive yaw, Right = negative yaw

            // Pitch: vertical movement - up = positive pitch (nose up)
            this.orientationControl.targetPitch = -this.maneuverIcon.y * Math.PI * 0.12; // Up = positive pitch, Down = negative pitch

            // Roll: calculated from combined movement for banking effect
            this.orientationControl.targetRoll = -this.maneuverIcon.x * Math.PI * 0.1; // Max 18 degrees roll
        } else {
            // In dead zone - gradually return to neutral (keep submarine level)
            this.orientationControl.turnRateMultiplier = 0.1; // Very slow return to center
            this.orientationControl.targetYaw = 0;
            this.orientationControl.targetPitch = 0; // Keep submarine on horizontal plane
            this.orientationControl.targetRoll = 0;
        }

        // Update screen coordinates
        this.maneuverIcon.screenX = centerX + (this.maneuverIcon.x * centerX);
        this.maneuverIcon.screenY = centerY + (this.maneuverIcon.y * centerY);

        // Update visual position
        if (this.maneuverIconElement) {
            this.maneuverIconElement.style.left = (this.maneuverIcon.screenX - 10) + 'px';
            this.maneuverIconElement.style.top = (this.maneuverIcon.screenY - 10) + 'px';

            // Change icon color based on dead zone and turn intensity
            if (this.orientationControl.deadZoneActive) {
                this.maneuverIconElement.style.borderColor = '#888888'; // Gray in dead zone
            } else if (distance > 0.6) {
                this.maneuverIconElement.style.borderColor = '#ff8800'; // Orange for high turn rate
            } else {
                this.maneuverIconElement.style.borderColor = '#00ffff'; // Cyan for normal
            }
        }
    }

    handleMouseDown(event) {
        event.preventDefault();
        if (event.button === 0) { // Left click
            this.mouseState.leftDown = true;
            // Start continuous cannon fire
            this.startContinuousFire('cannons');
        } else if (event.button === 2) { // Right click
            this.mouseState.rightDown = true;
            // Fire SCAV rockets using weapons system
            this.fireSCAVRockets();
        }
    }

    handleMouseUp(event) {
        event.preventDefault();
        if (event.button === 0) { // Left click
            this.mouseState.leftDown = false;
            // Stop continuous cannon fire
            this.stopContinuousFire('cannons');
        } else if (event.button === 2) { // Right click
            this.mouseState.rightDown = false;
            // Stop continuous rocket fire
            this.stopContinuousFire('rockets');
        }
    }

    handleWheel(event) {
        event.preventDefault();

        // Advanced throttle progression: 1 knot (0-5), 2 knots (5-10), 5 knots (10+)
        const wheelDirection = event.deltaY > 0 ? -1 : 1; // -1 for down/reverse, +1 for up/forward
        const currentKnots = Math.abs(this.currentThrust);

        let knotChange;
        if (currentKnots < 5) {
            knotChange = 1; // 1 knot increments when below 5 knots
        } else if (currentKnots < 10) {
            knotChange = 2; // 2 knot increments when 5-10 knots
        } else {
            knotChange = 5; // 5 knot increments when above 10 knots
        }

        // Calculate theoretical new thrust
        const newThrust = this.currentThrust + (wheelDirection * knotChange);

        // Deadzone around zero: require multiple wheel clicks to move away from zero
        if (this.currentThrust === 0) {
            // At zero speed - accumulate wheel inputs
            this.wheelDeadzone.inputBuffer += wheelDirection;
            
            // Only change speed if we've accumulated enough inputs to break deadzone
            if (Math.abs(this.wheelDeadzone.inputBuffer) > this.wheelDeadzone.range) {
                // Break out of deadzone
                const direction = Math.sign(this.wheelDeadzone.inputBuffer);
                this.currentThrust = direction * knotChange;
                this.wheelDeadzone.inputBuffer = 0; // Reset buffer
                console.log(`🚢 Breaking deadzone: ${this.currentThrust} knots`);
            } else {
                console.log(`🚢 Deadzone: ${this.wheelDeadzone.inputBuffer}/${this.wheelDeadzone.range} inputs buffered`);
                return; // Stay at zero
            }
        } else if (newThrust === 0 || (this.currentThrust > 0 && newThrust < 0) || (this.currentThrust < 0 && newThrust > 0)) {
            // Moving toward or through zero - go directly to zero
            this.currentThrust = 0;
            this.wheelDeadzone.inputBuffer = 0; // Reset buffer when reaching zero
            console.log(`🚢 Throttle: 0 knots (stopped)`);
        } else {
            // Normal speed change away from zero
            this.currentThrust = Math.max(-100, Math.min(100, newThrust));
            this.wheelDeadzone.inputBuffer = 0; // Reset buffer when away from zero
            console.log(`🚢 Throttle: ${this.currentThrust} knots (change: ${wheelDirection > 0 ? '+' : ''}${wheelDirection * knotChange})`);
        }

        this.targetSpeed = this.currentThrust; // Set target speed, actual speed will gradually approach this
    }

    update(deltaTime = 0.016) {
        if (!this.mesh) return;

        // Update gradual acceleration/deceleration system
        this.updateSpeedControl(deltaTime);
        
        // Update audio systems
        const isAccelerating = Math.abs(this.currentAcceleration) > 0.1;
        this.audioManager.updateEngineSound(this.speed, isAccelerating);
        
        // Update ambience based on depth (underwater_ambience down to 3000m, then fade to deep_underwater_ambience)
        const currentDepth = Math.abs(this.mesh.position.y);
        this.audioManager.startAmbience(-currentDepth); // Pass negative depth (below surface)
        
        // Update proximity sound for nearby submarines
        this.updateProximitySound();
        
        // Update drone torpedoes
        this.updateDrones(deltaTime);
        
        // Update torpedo ping sounds
        this.updateTorpedoPingSounds(deltaTime);
        
        // Update supercavitation (SCAV) mode based on speed
        this.updateSCAVMode(deltaTime);

        // Update orientation control (NEW fixed center system) - DISABLED: conflicts with updateManeuverControl
        // this.updateOrientationControl(deltaTime);

        // Update firing reticle system only
        this.updateFiringReticle(deltaTime);

        // Maneuver icon control for submarine movement
        this.updateManeuverControl(deltaTime);

        // Calculate turn rate for knuckles system
        const currentYaw = this.mesh.rotation.y;
        this.turnRate = Math.abs(currentYaw - this.lastYaw) / deltaTime;
        this.lastYaw = currentYaw;
        
        // Initialize knuckle flag if not set
        if (this.knuckleActive === undefined) {
            this.knuckleActive = false;
        }

        // Update submarine warfare systems
        this.updateWarfareSystems(deltaTime);

        // Update oobleck armor redistribution
        this.updateOobleckRedistribution(deltaTime);

        // Update system performance based on damage
        this.updateSystemPerformance();

        // Update crush depth damage system
        this.updateCrushDepthDamage(deltaTime);

        // Update thermal layer detection
        this.updateThermalLayerDetection();

        // Update bottom bouncing detection
        this.updateBottomBouncing(deltaTime);

        // Update dynamic sonar signature
        this.updateSonarSignature(deltaTime);
        
        // Update torpedo launch signature effects
        this.updateTorpedoLaunchSignature(deltaTime);

        // Update torpedo lock-on system
        this.updateTorpedoLockSystem(deltaTime);

        // Update threat warning system
        this.updateThreatWarningSystem(deltaTime);
        
        // Update background music tension based on current threat state
        const contactCount = this.currentSonarContacts ? this.currentSonarContacts.length : 0;
        const combatState = this.threatWarning.warningLevel === 'CRITICAL' ? 'ENGAGED' : 
                          this.threatWarning.warningLevel === 'HIGH' ? 'ALERT' : 'PATROL';
        this.audioManager.updateTensionLevel(this.threatWarning.warningLevel, contactCount, combatState);
        
        // Update towed array breakoff risk
        this.updateTowedArrayRisk(deltaTime);

        // Update under-reticle HUD display
        this.updateReticleHUD();

        // Update integrated mapping system
        if (this.mappingSystem) {
            this.mappingSystem.update();
        }

        // Update AI behavior for NPC submarines
        if (this.isNPC && this.ai && this.ai.enabled) {
            this.updateAIBehavior(deltaTime);
        }
        
        // Check for knuckle formation (high turn rate)
        this.checkKnuckleFormation();
    }
    
    // Update drone torpedoes
    updateDrones(deltaTime) {
        if (!this.activeDrones) return;
        
        // Update each drone
        for (let i = this.activeDrones.length - 1; i >= 0; i--) {
            const drone = this.activeDrones[i];
            if (!drone.update(deltaTime)) {
                // Drone destroyed or left map - remove from list
                this.activeDrones.splice(i, 1);
                continue;
            }
            
            // Update drone mesh position
            if (drone.mesh) {
                drone.mesh.position.copy(drone.position);
            }
            
            // If drone is active, reveal terrain/enemies in bubble
            if (drone.isActive && drone.getRevealBubble) {
                const bubble = drone.getRevealBubble();
                if (bubble && window.oceanInstance) {
                    // Reveal terrain in bubble (integrate with terrain visibility system)
                    this.revealTerrainInBubble(bubble.center, bubble.radius);
                    
                    // Reveal enemies in bubble (update sonar contacts)
                    this.revealEnemiesInBubble(bubble.center, bubble.radius);
                }
            }
        }
    }
    
    // Reveal terrain in drone bubble
    revealTerrainInBubble(center, radius) {
        // This will be integrated with ocean.js terrain visibility system
        // For now, we'll trigger a temporary sonar ping effect at the drone location
        if (window.oceanInstance && window.oceanInstance.updateTerrainLOD) {
            // Force terrain visibility update at drone position
            window.oceanInstance.updateTerrainLOD(center);
        }
    }
    
    // Reveal enemies in drone bubble
    revealEnemiesInBubble(center, radius) {
        // Perform sonar sweep at drone location
        if (window.performAdvancedSonarSweep) {
            const contacts = window.performAdvancedSonarSweep(
                center,
                radius,
                this.passiveSensitivity,
                [],
                'Active' // Drone uses active sonar
            );
            
            // Add contacts to sonar display
            this.updateSonarContactsDisplay(contacts);
        }
    }
    
    // Update torpedo ping sounds
    updateTorpedoPingSounds(deltaTime) {
        // Get all active torpedoes
        const allTorpedoes = window.weaponsSystem?.getAllTorpedoes ? window.weaponsSystem.getAllTorpedoes() : [];
        
        allTorpedoes.forEach(torpedo => {
            if (!torpedo || !torpedo.id) return;
            
            // Check if torpedo has a target
            const hasTarget = torpedo.target && torpedo.target.getPosition;
            let distanceToTarget = Infinity;
            
            if (hasTarget) {
                const targetPos = torpedo.target.getPosition();
                const torpedoPos = torpedo.position || torpedo.getPosition();
                if (targetPos && torpedoPos) {
                    distanceToTarget = torpedoPos.distanceTo(targetPos);
                }
            }
            
            // Update ping sound for this torpedo
            this.audioManager.updateTorpedoPing(torpedo.id, distanceToTarget, hasTarget);
        });
    }
    
    // Update proximity sound for nearby submarines
    updateProximitySound() {
        const enemies = window.getEnemySubmarines ? window.getEnemySubmarines() : [];
        if (enemies.length === 0) {
            // No enemies - stop proximity sound
            this.audioManager.updateProximitySound(Infinity);
            return;
        }
        
        // Find closest enemy
        let closestDistance = Infinity;
        enemies.forEach(enemy => {
            if (enemy && enemy.getPosition) {
                const distance = this.mesh.position.distanceTo(enemy.getPosition());
                if (distance < closestDistance) {
                    closestDistance = distance;
                }
            }
        });
        
        // Update proximity sound
        this.audioManager.updateProximitySound(closestDistance);
    }
    
    // Check for knuckle formation (high turn rate)
    checkKnuckleFormation() {
        // Knuckle is formed when turning at high rate (creating cavitation bubble)
        const knuckleThreshold = 0.5; // radians per second turn rate threshold
        
        if (this.turnRate > knuckleThreshold && !this.knuckleActive) {
            // Knuckle formed - play sound
            this.audioManager.playKnuckle();
            this.knuckleActive = true;
        } else if (this.turnRate <= knuckleThreshold) {
            this.knuckleActive = false;
        }

        // Update off-screen contact indicators
        this.updateOffScreenIndicators();


        // Update damage control repairs
        this.updateDamageControl(deltaTime);

        // Update scenarios system
        this.updateScenariosSystem(deltaTime);

        // Apply throttle-based movement (affected by towed array)
        let effectiveMaxSpeed = this.maxSpeed;
        if (this.towedArray.deployed) {
            effectiveMaxSpeed *= this.towedArray.speedPenalty;
            this.speed = Math.min(Math.abs(this.speed), effectiveMaxSpeed) * Math.sign(this.speed);
        }

        if (Math.abs(this.speed) > 0.1) {
            // Speed conversion: knots to meters per second
            // 1 knot = 0.5144 m/s
            // With deltaTime in seconds, multiply speed (knots) by 0.5144 to get m/s
            // Then multiply by deltaTime to get movement per frame
            const knotsToMetersPerSecond = 0.5144;
            const moveSpeed = this.speed * knotsToMetersPerSecond * deltaTime;

            // Forward/backward movement
            const forwardDirection = new THREE.Vector3(1, 0, 0);
            forwardDirection.applyQuaternion(this.mesh.quaternion);
            const forwardMovement = forwardDirection.multiplyScalar(moveSpeed);

            // Strafe movement
            let strafeMovement = new THREE.Vector3(0, 0, 0);
            if (this.keys.strafeLeft || this.keys.strafeRight) {
                const strafeDirection = new THREE.Vector3(0, 0, this.keys.strafeLeft ? 1 : -1);
                strafeDirection.applyQuaternion(this.mesh.quaternion);
                const strafeSpeed = Math.abs(this.speed) * knotsToMetersPerSecond * deltaTime * 0.5;
                strafeMovement = strafeDirection.multiplyScalar(strafeSpeed);
            }

            // Store old position for collision detection
            const oldPosition = this.mesh.position.clone();
            this.mesh.position.add(forwardMovement);
            this.mesh.position.add(strafeMovement);

            // Check collisions
            this.checkSeabedCollision(oldPosition);
            this.checkSurfaceCollision();

            // Create wake effect at high speeds
            if (Math.abs(this.speed) > 6) {
                this.createWakeEffect();
            }
        }

        // Update HUD
        this.updateHUD();
    }

    updateOrientationControl(deltaTime) {
        if (!this.mesh) return;

        // NEW FIXED CENTER SUBMARINE SYSTEM
        // Submarine stays in center, orientation changes to align reticle with maneuver icon

        // Get submarine-specific turn rates from specifications
        const baseYawRate = this.specs?.baseTurnRate || 0.008; // Default: 0.008 rad/s
        const basePitchRate = this.specs?.pitchRate || 0.004; // Default: 0.004 rad/s
        const baseRollRate = this.specs?.rollRate || 0.003; // Default: 0.003 rad/s

        // Apply distance-based turn rate multiplier
        const effectiveYawRate = baseYawRate * this.orientationControl.turnRateMultiplier;
        const effectivePitchRate = basePitchRate * this.orientationControl.turnRateMultiplier;
        const effectiveRollRate = baseRollRate * this.orientationControl.turnRateMultiplier;

        // Smoothly interpolate to target orientation
        const lerpFactor = Math.min(deltaTime * 2.0, 1.0); // Smooth interpolation

        // Current euler angles
        let currentYaw = this.mesh.rotation.y;
        let currentPitch = this.mesh.rotation.x;
        let currentRoll = this.mesh.rotation.z;

        // Lerp towards target angles with submarine-specific rates
        const yawDelta = (this.orientationControl.targetYaw - currentYaw) * lerpFactor * effectiveYawRate * 100;
        const pitchDelta = (this.orientationControl.targetPitch - currentPitch) * lerpFactor * effectivePitchRate * 100;
        const rollDelta = (this.orientationControl.targetRoll - currentRoll) * lerpFactor * effectiveRollRate * 100;

        // Apply rotation changes
        this.mesh.rotation.y += yawDelta;
        this.mesh.rotation.x += pitchDelta;
        this.mesh.rotation.z += rollDelta;

        // Keep submarine position fixed at origin (center of screen) - DISABLED for movement testing
        // this.mesh.position.set(0, 0, 0);
    }

    updateManeuverControl(deltaTime) {
        // NEW RETICLE-BASED STEERING SYSTEM
        // Submarine turns to align firing reticle with maneuver icon

        // Check for SCAV mode activation/deactivation
        this.updateScavMode(deltaTime);

        // Auto-drift maneuver icon back to center when no mouse input
        const timeSinceLastMouseMove = Date.now() - this.maneuverIcon.lastMouseMoveTime;
        if (timeSinceLastMouseMove > this.maneuverIcon.driftDelay) {
            // Drift back to center
            const driftAmount = this.maneuverIcon.driftSpeed * (deltaTime / 1000);

            // Drift X back to 0
            if (Math.abs(this.maneuverIcon.x) > 0.01) {
                const driftX = Math.sign(this.maneuverIcon.x) * -driftAmount;
                this.maneuverIcon.x += driftX;
                // Clamp to 0 if we've drifted past center
                if (Math.sign(this.maneuverIcon.x) !== Math.sign(this.maneuverIcon.x + driftX)) {
                    this.maneuverIcon.x = 0;
                }
            } else {
                this.maneuverIcon.x = 0;
            }

            // Drift Y back to 0
            if (Math.abs(this.maneuverIcon.y) > 0.01) {
                const driftY = Math.sign(this.maneuverIcon.y) * -driftAmount;
                this.maneuverIcon.y += driftY;
                // Clamp to 0 if we've drifted past center
                if (Math.sign(this.maneuverIcon.y) !== Math.sign(this.maneuverIcon.y + driftY)) {
                    this.maneuverIcon.y = 0;
                }
            } else {
                this.maneuverIcon.y = 0;
            }

            // Update visual position to reflect drift
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            this.maneuverIcon.screenX = centerX + (this.maneuverIcon.x * centerX);
            this.maneuverIcon.screenY = centerY + (this.maneuverIcon.y * centerY);

            if (this.maneuverIconElement) {
                this.maneuverIconElement.style.left = (this.maneuverIcon.screenX - 10) + 'px';
                this.maneuverIconElement.style.top = (this.maneuverIcon.screenY - 10) + 'px';
            }
        }

        // FREELANCER-STYLE STEERING (Adapted from brihernandez/FreelancerFlightExample)
        // Calculate distance from center for dead zone
        const iconDistance = Math.sqrt(this.maneuverIcon.x * this.maneuverIcon.x + this.maneuverIcon.y * this.maneuverIcon.y);
        const inDeadZone = iconDistance <= this.maneuverIcon.deadZoneRadius;

        // Get camera if available
        const camera = window.gameState ? window.gameState.camera : null;

        if (!inDeadZone && camera) {
            // STEP 1: Convert screen position to world point (like ShipInput.TurnTowardsPoint)
            // Project icon position to a point in world space
            const aimDistance = 500; // Distance ahead to project aim point
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Convert normalized coords (-1 to 1) to screen pixels
            const screenX = (this.maneuverIcon.x * 0.5 + 0.5) * screenWidth;
            const screenY = (-this.maneuverIcon.y * 0.5 + 0.5) * screenHeight;

            // Create mouse world position by projecting from screen
            const mouseVector = new THREE.Vector3(
                (screenX / screenWidth) * 2 - 1,
                -(screenY / screenHeight) * 2 + 1,
                0.5
            );
            mouseVector.unproject(camera);

            // Create target point at aim distance from submarine
            const direction = mouseVector.sub(this.mesh.position).normalize();
            const targetWorldPos = this.mesh.position.clone().add(direction.multiplyScalar(aimDistance));

            // STEP 2: Transform target to submarine's local coordinate space
            const worldToLocal = new THREE.Matrix4().copy(this.mesh.matrixWorld).invert();
            const localTarget = targetWorldPos.clone().applyMatrix4(worldToLocal);

            // STEP 3: Calculate pitch and yaw from local coordinates
            // This is the key Freelancer technique - local coords directly give us rotation inputs
            const pitchSensitivity = 2.0;
            const yawSensitivity = 2.0;
            const rollSensitivity = 1.5;

            // Normalize local target
            const localTargetNorm = localTarget.normalize();

            // Calculate pitch and yaw inputs (clamped -1 to 1)
            // In local space: X=forward, Y=up, Z=right
            let pitchInput = Math.max(-1, Math.min(1, localTargetNorm.y));
            let yawInput = Math.max(-1, Math.min(1, localTargetNorm.z));

            // DEBUG: Log values occasionally
            if (Math.random() < 0.01) {
                console.log(`🎮 Control Debug: icon=(${this.maneuverIcon.x.toFixed(2)}, ${this.maneuverIcon.y.toFixed(2)}) localNorm=(${localTargetNorm.x.toFixed(2)}, ${localTargetNorm.y.toFixed(2)}, ${localTargetNorm.z.toFixed(2)}) pitch=${pitchInput.toFixed(2)} yaw=${yawInput.toFixed(2)}`);
            }

            // STEP 4: Apply rotation based on inputs
            // NOTE: Due to submarine model being rotated 90° on Z-axis, pitch is Z rotation
            this.mesh.rotation.z += pitchInput * pitchSensitivity * deltaTime;
            this.mesh.rotation.y += yawInput * yawSensitivity * deltaTime;

            // Clamp pitch to reasonable limits
            this.mesh.rotation.z = Math.max(Math.min(this.mesh.rotation.z, Math.PI / 3), -Math.PI / 3);

            // Normalize yaw rotation
            while (this.mesh.rotation.y > Math.PI) this.mesh.rotation.y -= 2 * Math.PI;
            while (this.mesh.rotation.y < -Math.PI) this.mesh.rotation.y += 2 * Math.PI;

            // STEP 5: Banking based on horizontal screen position (like BankShipRelativeToUpVector)
            // Calculate signed angle between submarine up and camera up
            const subUp = new THREE.Vector3(0, 1, 0).applyQuaternion(this.mesh.quaternion);
            const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
            const subForward = new THREE.Vector3(1, 0, 0).applyQuaternion(this.mesh.quaternion);

            // Project both up vectors onto plane perpendicular to forward
            const subUpProjected = subUp.clone().sub(subForward.clone().multiplyScalar(subUp.dot(subForward))).normalize();
            const cameraUpProjected = cameraUp.clone().sub(subForward.clone().multiplyScalar(cameraUp.dot(subForward))).normalize();

            // Calculate angle between projected vectors
            const cross = new THREE.Vector3().crossVectors(cameraUpProjected, subUpProjected);
            const dot = cameraUpProjected.dot(subUpProjected);
            const angle = Math.atan2(cross.length(), dot);
            const sign = Math.sign(cross.dot(subForward));
            const signedAngle = angle * sign;

            // Apply banking proportional to horizontal input and current speed
            const horizontalInput = this.maneuverIcon.x;
            const speedFactor = Math.min(1.0, Math.abs(this.speed) / this.maxSpeed);
            const targetRoll = -horizontalInput * (Math.PI / 4) * speedFactor; // Max 45° bank

            // Smooth roll interpolation
            const rollDiff = targetRoll - this.mesh.rotation.x;
            this.mesh.rotation.x += rollDiff * rollSensitivity * deltaTime;

        } else {
            // In dead zone - auto-level submarine
            this.mesh.rotation.x *= (1 - deltaTime * 2); // Auto-level roll
            this.mesh.rotation.z *= (1 - deltaTime * 2); // Auto-level pitch
        }

        // Handle QE depth controls
        this.updateDepthControls(deltaTime);

        // Apply movement based on maneuver icon position and thrust
        if (Math.abs(this.speed) > 0.01) { // Lower threshold for movement
            let effectiveSpeed = this.speed;

            // Apply SCAV speed multiplier
            if (this.scavMode.active && this.speed > 0) {
                effectiveSpeed *= this.scavMode.speedMultiplier;
            }

            const moveSpeed = 1.03; // Realistic speed scaling: 100 knots = 51.44 m/s, scaled to 53.03 m/s for 70km in 22 minutes
            const iconDistance = Math.sqrt(this.maneuverIcon.x * this.maneuverIcon.x + this.maneuverIcon.y * this.maneuverIcon.y);
            const iconInDeadZone = iconDistance <= this.maneuverIcon.deadZoneRadius;

            // FREELANCER-STYLE MOVEMENT
            // Submarine ALWAYS moves in the direction its nose is pointing
            // Icon position controls rotation only, not direct movement
            const forwardDirection = new THREE.Vector3(1, 0, 0);
            forwardDirection.applyQuaternion(this.mesh.quaternion);
            const totalMovement = forwardDirection.multiplyScalar(effectiveSpeed * moveSpeed * deltaTime);

            // Store old position for collision detection
            const oldPosition = this.mesh.position.clone();
            this.mesh.position.add(totalMovement);

            // Check collisions
            this.checkSeabedCollision(oldPosition);
            this.checkSurfaceCollision();

            // Create wake effect at high speeds (or SCAV bubble effects)
            if (this.scavMode.active || Math.abs(this.speed) > 60) {
                this.createWakeEffect();
            }
        }
    }

    updateDepthControls(deltaTime) {
        // Handle Q/E depth controls
        let depthChangeRate = 30; // meters per second
        
        // Apply emergency blow penalty if used
        if (this.emergencyBlow.used) {
            depthChangeRate *= (1 - this.emergencyBlow.depthChangePenalty);
        }
        
        if (this.keys.decreaseDepth) {
            // Q key - go up (decrease depth)
            this.mesh.position.y += depthChangeRate * deltaTime;
            // Clamp to surface (y=300)
            this.mesh.position.y = Math.min(this.mesh.position.y, 300);
        }
        
        if (this.keys.increaseDepth) {
            // E key - go down (increase depth)
            this.mesh.position.y -= depthChangeRate * deltaTime;
            // Clamp to maximum depth (y = 300 - maxDepth)
            const minY = 300 - this.maxDepth;
            this.mesh.position.y = Math.max(this.mesh.position.y, minY);
        }
    }

    updateScavMode(deltaTime) {
        // Check if SCAV mode can be activated
        const forwardSpeed = this.speed > 0 ? this.speed : 0;
        const speedThreshold = this.maxSpeed * 0.5;

        this.scavMode.canActivate = forwardSpeed > speedThreshold;

        // Auto-activate SCAV mode when at maximum throttle and high speed
        if (this.scavMode.canActivate && this.currentThrust >= 90 && !this.scavMode.active) {
            this.activateScavMode();
        }

        // Deactivate SCAV mode if conditions not met
        if (this.scavMode.active && (!this.scavMode.canActivate || this.currentThrust < 70)) {
            this.deactivateScavMode();
        }

        // Update bubble effects
        if (this.scavMode.active) {
            this.updateScavEffects(deltaTime);
        }
    }

    activateScavMode() {
        this.scavMode.active = true;
        console.log('SCAV MODE ACTIVATED - Super Cavitation Engaged');

        // Create bubble effects
        this.createScavBubbles();

        // Massive sonar signature increase
        this.sonarSignature.modifiers.scav = this.scavMode.noiseMultiplier;
    }

    deactivateScavMode() {
        this.scavMode.active = false;
        console.log('SCAV MODE DEACTIVATED');

        // Remove sonar penalty
        this.sonarSignature.modifiers.scav = 0;

        // Clear bubble effects
        this.clearScavBubbles();
    }

    createScavBubbles() {
        // Create SCAV bubble visual effects
        // TODO: Implement Three.js particle system for bubble effects
        console.log('Creating SCAV bubble effects');
    }

    updateScavEffects(deltaTime) {
        // Update SCAV bubble particle positions and effects
        // TODO: Update particle system positions relative to submarine
    }

    clearScavBubbles() {
        // Remove SCAV bubble effects
        // TODO: Dispose of particle system resources
        console.log('Clearing SCAV bubble effects');
    }

    startContinuousFire(weaponType) {
        if (weaponType === 'cannons') {
            this.continuousFire = { active: true, type: 'cannons', lastFire: 0 };
            console.log('Starting continuous cannon fire');
        } else if (weaponType === 'rockets') {
            this.continuousFire = { active: true, type: 'rockets', lastFire: 0 };
            console.log('Starting continuous rocket fire');
        }
    }

    stopContinuousFire(weaponType) {
        if (this.continuousFire && this.continuousFire.type === weaponType) {
            this.continuousFire = { active: false, type: null, lastFire: 0 };
            console.log(`Stopped continuous ${weaponType} fire`);
        }
    }

    fireSCAVRockets() {
        // Fire SCAV rockets using the weapons system
        if (window.weaponsSystem) {
            // Get SCAV rockets weapon type
            const scavWeapon = window.weaponsSystem.weapons.find(w => w.type.type === 'scav_rocket');
            
            if (scavWeapon && scavWeapon.ammo > 0) {
                // Check reload time
                const currentTime = Date.now();
                if (currentTime - scavWeapon.lastFired < scavWeapon.type.reloadTime) {
                    console.log('SCAV Rockets: Reloading...');
                    return;
                }
                
                // Fire SCAV rocket
                window.weaponsSystem.createProjectile(scavWeapon.type, window.weaponsSystem.selectedTarget);
                scavWeapon.ammo--;
                scavWeapon.lastFired = currentTime;
                
                // Trigger weapon signature
                if (this.triggerWeaponsFire) {
                    this.triggerWeaponsFire('scav_rockets');
                }
                
                console.log(`SCAV Rocket fired! (${scavWeapon.ammo} remaining)`);
                
                // Show visual feedback
                this.showWeaponFireFeedback('SCAV Rocket');
            } else {
                console.log('SCAV Rockets: Out of ammo!');
                // Could add audio cue for empty weapon here
            }
        } else {
            console.log('SCAV Rockets: Weapons system not found!');
        }
    }

    showWeaponFireFeedback(weaponName) {
        // Simple visual feedback for weapon firing
        // Could be enhanced with screen flash, UI indicators, etc.
        console.log(`🚀 ${weaponName} FIRED!`);
        
        // Add brief visual indicator to reticle area if it exists
        const reticleHUD = document.getElementById('reticleHUD');
        if (reticleHUD) {
            // Create temporary fire indicator
            const fireIndicator = document.createElement('div');
            fireIndicator.style.position = 'absolute';
            fireIndicator.style.top = '10px';
            fireIndicator.style.left = '50%';
            fireIndicator.style.transform = 'translateX(-50%)';
            fireIndicator.style.color = '#ff4444';
            fireIndicator.style.fontSize = '12px';
            fireIndicator.style.fontWeight = 'bold';
            fireIndicator.style.textShadow = '0 0 5px #ff4444';
            fireIndicator.style.zIndex = '9999';
            fireIndicator.textContent = `${weaponName} FIRED`;
            
            reticleHUD.appendChild(fireIndicator);
            
            // Remove after 2 seconds
            setTimeout(() => {
                if (fireIndicator.parentNode) {
                    fireIndicator.parentNode.removeChild(fireIndicator);
                }
            }, 2000);
        }
    }

    handleLauncherSelection(launcherNumber) {
        if (launcherNumber < 1 || launcherNumber > this.launchers.length) {
            return; // Invalid launcher number
        }

        const launcher = this.launchers[launcherNumber - 1];
        const currentTime = Date.now();

        // Check if this is the same launcher pressed recently for cycling
        const isSameLauncher = this.launcherInteraction.lastPressedLauncher === launcherNumber;
        const timeSinceLastPress = currentTime - this.launcherInteraction.lastPressTime;
        const isSubsequentPress = isSameLauncher && timeSinceLastPress < 5000; // 5 second window

        // Update interaction tracking
        this.launcherInteraction.lastPressTime = currentTime;
        this.launcherInteraction.lastPressedLauncher = launcherNumber;

        if (isSameLauncher && timeSinceLastPress < 2000) {
            // Subsequent press of same launcher within 2 seconds - rotate chamber
            this.rotateLauncher(launcherNumber);
            console.log(`Rotating launcher ${launcherNumber} to chamber ${launcher.currentChamber + 1}`);
        } else {
            // First press or different launcher - select launcher
            this.selectedLauncher = launcherNumber;
            console.log(`Selected launcher ${launcherNumber}: ${this.getCurrentTorpedoCode(launcherNumber)} ready`);
        }

        // Start lock-on system if current chamber has torpedo
        const currentTorpedoCode = this.getCurrentTorpedoCode(launcherNumber);
        if (currentTorpedoCode && currentTorpedoCode !== '') {
            // TODO: Fix torpedo lock system - temporarily disabled to prevent crash
            console.log(`Starting ${this.getFullTorpedoType(currentTorpedoCode)} lock-on: 2.0s (Active sonar)`);
        }

        // Update visual display
        this.updateLauncherDisplay();
    }

    rotateLauncher(launcherNumber) {
        const launcher = this.launchers[launcherNumber - 1];
        
        // If no box is highlighted, start at box 0 (first/leftmost box)
        if (launcher.currentBox === -1) {
            launcher.currentBox = 0;
        } else {
            // Move highlight one box to the right
            launcher.currentBox++;
            // If we're past the rightmost box (6), wrap back to leftmost box (0)
            if (launcher.currentBox > 6) {
                launcher.currentBox = 0;
            }
        }
        
        launcher.rotationAnimation = Date.now(); // For visual highlighting
        launcher.cycling = true;
        
        // Auto-stop cycling after delay
        setTimeout(() => {
            launcher.cycling = false;
        }, this.launcherInteraction.cycleDelay);
        
        console.log(`🎯 Launcher ${launcherNumber} - Highlighted box ${launcher.currentBox}`);
    }

    // NEW: Cycle torpedo box left to right, one press = one box
    cycleTorpedoBox(launcherNumber) {
        if (launcherNumber < 1 || launcherNumber > this.launchers.length) {
            return;
        }

        const launcher = this.launchers[launcherNumber - 1];
        
        // If all tubes fired, reload instead
        if (this.sequentialFiring.allFired) {
            this.reloadTube(launcherNumber);
            return;
        }

        // Start at box 0 if no box highlighted, otherwise move one box right
        if (launcher.currentBox === -1) {
            launcher.currentBox = 0;
        } else {
            launcher.currentBox++;
            // Wrap around: after box 6, go back to box 0
            if (launcher.currentBox > 6) {
                launcher.currentBox = 0;
            }
        }

        console.log(`🎯 Launcher ${launcherNumber} - Box ${launcher.currentBox} highlighted`);
        this.updateLauncherDisplay();
    }

    // NEW: Fire torpedoes sequentially (tube 1, then 2, then 3, then 4)
    fireSequentialTorpedo() {
        // If all tubes fired, don't fire
        if (this.sequentialFiring.allFired) {
            console.log('All tubes fired - reload with number keys');
            return;
        }

        const tubeNumber = this.sequentialFiring.nextTubeToFire;
        const launcher = this.launchers[tubeNumber - 1];
        
        if (!launcher) {
            console.log(`Tube ${tubeNumber} not available`);
            return;
        }

        // Check if current box has a torpedo
        if (launcher.currentBox === 0 || launcher.currentBox === -1) {
            console.log(`Tube ${tubeNumber} - No torpedo selected in box ${launcher.currentBox}`);
            return;
        }

        const chamberIndex = launcher.currentBox - 1;
        const torpedoCode = launcher.chambers[chamberIndex];
        
        if (!torpedoCode || torpedoCode === '') {
            console.log(`Tube ${tubeNumber} - Box ${launcher.currentBox} is empty`);
            return;
        }

        // Check for lock (if required) - DN drones don't need lock
        const isDrone = torpedoCode === 'DN';
        if (!isDrone && (!this.torpedoLockSystem || !this.torpedoLockSystem.isLocked)) {
            console.log('No target lock - cannot fire torpedo (DN drones don\'t need lock)');
            return;
        }

        // Fire the torpedo (drone or smart torpedo)
        let torpedo;
        if (isDrone) {
            torpedo = this.createDroneTorpedo();
        } else {
            const torpedoType = this.getFullTorpedoType(torpedoCode);
            torpedo = this.createSmartTorpedo(torpedoType, this.torpedoLockSystem.target);
        }

        // Trigger torpedo launch signature spike
        this.torpedoLaunchSignature.active = true;
        this.torpedoLaunchSignature.startTime = Date.now();
        
        // Play torpedo launch sound
        this.audioManager.playTorpedoLaunch();

        // Clear the chamber
        launcher.chambers[chamberIndex] = '';
        
        // Remove highlight from this tube
        launcher.currentBox = -1;
        
        // Mark this tube as fired
        this.sequentialFiring.firedTubes.add(tubeNumber);
        
        // Reset lock system (only if not a drone)
        if (!isDrone) {
            this.torpedoLockSystem = {
                target: null,
                lockProgress: 0,
                lockStartTime: 0,
                isLocked: false
            };
        }
        
        // Move to next tube (1->2->3->4->1)
        this.sequentialFiring.nextTubeToFire = (tubeNumber % 4) + 1;
        
        // Check if all tubes fired
        if (this.sequentialFiring.firedTubes.size >= 4) {
            this.sequentialFiring.allFired = true;
            console.log('All 4 tubes fired - reload with number keys');
        }

        console.log(`${torpedoType} fired from tube ${tubeNumber}, next tube: ${this.sequentialFiring.nextTubeToFire}`);
        this.updateLauncherDisplay();
    }

    // NEW: Reload tube when all tubes fired
    reloadTube(tubeNumber) {
        if (tubeNumber < 1 || tubeNumber > 4) return;
        
        const launcher = this.launchers[tubeNumber - 1];
        if (!launcher) return;

        // Find first empty chamber and reload
        for (let i = 0; i < 6; i++) {
            if (!launcher.chambers[i] || launcher.chambers[i] === '') {
                // Reload with available torpedo type (prioritize MT)
                if (this.torpedoStorage.MT > 0) {
                    launcher.chambers[i] = 'MT';
                    this.torpedoStorage.MT--;
                    console.log(`Tube ${tubeNumber} reloaded with MT in chamber ${i + 1}`);
                } else if (this.torpedoStorage.LT > 0) {
                    launcher.chambers[i] = 'LT';
                    this.torpedoStorage.LT--;
                    console.log(`Tube ${tubeNumber} reloaded with LT in chamber ${i + 1}`);
                } else if (this.torpedoStorage.HT > 0) {
                    launcher.chambers[i] = 'HT';
                    this.torpedoStorage.HT--;
                    console.log(`Tube ${tubeNumber} reloaded with HT in chamber ${i + 1}`);
                } else {
                    console.log(`No torpedoes available to reload tube ${tubeNumber}`);
                    return;
                }
                
                // Reset firing state if all tubes reloaded
                if (this.sequentialFiring.firedTubes.has(tubeNumber)) {
                    this.sequentialFiring.firedTubes.delete(tubeNumber);
                }
                
                if (this.sequentialFiring.firedTubes.size === 0) {
                    this.sequentialFiring.allFired = false;
                    this.sequentialFiring.nextTubeToFire = 1;
                    console.log('All tubes reloaded - ready to fire');
                }
                
                this.updateLauncherDisplay();
                return;
            }
        }
        
        console.log(`Tube ${tubeNumber} is full`);
    }

    getCurrentTorpedoCode(launcherNumber) {
        const launcher = this.launchers[launcherNumber - 1];
        // Box 0 is always empty, boxes 1-6 map to chamber indices 0-5
        if (launcher.currentBox === 0 || launcher.currentBox === -1) {
            return ''; // Empty box
        }
        return launcher.chambers[launcher.currentBox - 1] || '';
    }

    getFullTorpedoType(code) {
        const codeMap = {
            'LT': 'LIGHT_TORPEDO',
            'MT': 'MEDIUM_TORPEDO',
            'HT': 'HEAVY_TORPEDO'
        };
        return codeMap[code] || 'LIGHT_TORPEDO';
    }

    updateLauncherDisplay() {
        // Update visual launcher display for all launchers (7-box system)
        this.launchers.forEach((launcher, index) => {
            const launcherRowElement = document.getElementById(`launcher${index + 1}`);
            const launcherContainerElement = launcherRowElement?.parentElement;
            if (!launcherRowElement) return;

            // Update each torpedo box in the row (7 boxes: 0-6)
            for (let i = 0; i <= 6; i++) {
                const torpedoBox = launcherRowElement.querySelector(`.torpedo-box-${i}`);
                if (!torpedoBox) continue;

                // Clear all state classes first
                torpedoBox.classList.remove('selected', 'fired');
                
                // Box 0 is always empty (leftmost)
                if (i === 0) {
                    torpedoBox.classList.add('empty');
                    torpedoBox.textContent = '';
                } else {
                    // Boxes 1-6 map to chamber indices 0-5
                    const chamberIndex = i - 1;
                    const torpedoCode = launcher.chambers[chamberIndex] || '';
                    torpedoBox.textContent = torpedoCode;
                }
                
                // Highlight ALL boxes that are highlighted (yellow highlight)
                // currentBox >= 0 means a box is highlighted
                if (i === launcher.currentBox && launcher.currentBox >= 0) {
                    torpedoBox.classList.add('selected'); // Yellow highlight
                }
            }

            // Update launcher row container selection highlighting
            if (launcherContainerElement) {
                launcherContainerElement.classList.remove('selected');
                if (launcher.id === this.selectedLauncher) {
                    launcherContainerElement.classList.add('selected');
                }
            }
        });
    }

    showTubeInformation(tubeNumber) {
        const tube = this.torpedoTubes[tubeNumber - 1];

        if (tube.loading) {
            if (tube.loadingPhase === 'removing' && tube.loadedType) {
                // Show what torpedo is being unloaded
                const torpedoSpec = TORPEDO_SPECIFICATIONS[tube.loadedType];
                console.log(`Tube ${tubeNumber}: ${torpedoSpec.name} [${tube.loadedType}] (Unloading...)`);
            } else if (tube.loadingPhase === 'loading' && tube.loadedType) {
                // Show what torpedo is being loaded
                const torpedoSpec = TORPEDO_SPECIFICATIONS[tube.loadedType];
                console.log(`Tube ${tubeNumber}: Loading ${torpedoSpec.name} [${tube.loadedType}]...`);
            } else {
                console.log(`Tube ${tubeNumber}: Loading...`);
            }
        } else if (tube.loaded && tube.loadedType) {
            const torpedoSpec = TORPEDO_SPECIFICATIONS[tube.loadedType];
            console.log(`Tube ${tubeNumber}: ${torpedoSpec.name} [${tube.loadedType}] (Ready)`);
        } else {
            console.log(`Tube ${tubeNumber}: Empty`);
        }
    }

    cycleTorpedoTypeNew(tubeNumber) {
        const tube = this.torpedoTubes[tubeNumber - 1];

        if (tube.loading) {
            console.log(`Tube ${tubeNumber} is currently loading`);
            return;
        }

        // Get next available type
        let currentIndex = tube.loadedType ?
            tube.availableTypes.indexOf(tube.loadedType) : -1;
        currentIndex = (currentIndex + 1) % tube.availableTypes.length;
        const newType = tube.availableTypes[currentIndex];

        // Check if we have this torpedo type in storage
        if (this.torpedoStorage[newType] <= 0) {
            console.log(`No ${TORPEDO_SPECIFICATIONS[newType].name} torpedoes remaining`);
            return;
        }

        // NEW BEHAVIOR: 1.5 second delay before reload begins
        console.log('Will begin torpedo change in 1.5 seconds...');
        console.log(`Changing tube ${tubeNumber} to ${TORPEDO_SPECIFICATIONS[newType].name}`);

        setTimeout(() => {
            this.startTorpedoReload(tubeNumber, newType);
        }, this.tubeInteraction.cycleDelay); // 1.5 second delay
    }

    startTorpedoReload(tubeNumber, newType) {
        const tube = this.torpedoTubes[tubeNumber - 1];

        // Start loading new torpedo type (30-second process: 15s remove + 15s load)
        console.log(`Removing current torpedo from tube ${tubeNumber}...`);
        tube.loading = true;
        tube.loaded = false;
        tube.loadStartTime = Date.now();
        tube.cycling = true;
        tube.loadingPhase = 'removing'; // Phase 1: Removing current torpedo

        // Phase 1: Remove current torpedo (15 seconds)
        setTimeout(() => {
            if (tube.loadedType) {
                this.torpedoStorage[tube.loadedType]++;
                console.log(`Torpedo removed from tube ${tubeNumber}, starting load of ${TORPEDO_SPECIFICATIONS[newType].name}...`);
            }

            tube.loadedType = newType;
            tube.loadingPhase = 'loading'; // Phase 2: Loading new torpedo
            this.torpedoStorage[newType]--;

            // Phase 2: Load new torpedo (15 seconds)
            setTimeout(() => {
                tube.loading = false;
                tube.loaded = true;
                tube.cycling = false;
                tube.loadingPhase = null;
                console.log(`${TORPEDO_SPECIFICATIONS[newType].name} loaded in tube ${tubeNumber}`);
                this.updateReticleHUD();
            }, 15000); // 15 seconds for loading
        }, 15000); // 15 seconds for removal
    }

    cycleTorpedoType(tubeNumber) {
        const tube = this.torpedoTubes[tubeNumber - 1];

        if (tube.loading) {
            console.log(`Tube ${tubeNumber} is currently loading`);
            return;
        }

        // Get next available type
        let currentIndex = tube.loadedType ?
            tube.availableTypes.indexOf(tube.loadedType) : -1;
        currentIndex = (currentIndex + 1) % tube.availableTypes.length;
        const newType = tube.availableTypes[currentIndex];

        // Check if we have this torpedo type in storage
        if (this.torpedoStorage[newType] <= 0) {
            console.log(`No ${TORPEDO_SPECIFICATIONS[newType].name} torpedoes remaining`);
            return;
        }

        // Start loading new torpedo type (30-second process: 15s remove + 15s load)
        console.log(`Removing current torpedo from tube ${tubeNumber}...`);
        tube.loading = true;
        tube.loaded = false;
        tube.loadStartTime = Date.now();
        tube.cycling = true;
        tube.loadingPhase = 'removing'; // Phase 1: Removing current torpedo

        // Phase 1: Remove current torpedo (15 seconds)
        setTimeout(() => {
            if (tube.loadedType) {
                this.torpedoStorage[tube.loadedType]++;
                console.log(`Torpedo removed from tube ${tubeNumber}, starting load of ${TORPEDO_SPECIFICATIONS[newType].name}...`);
            }

            tube.loadedType = newType;
            tube.loadingPhase = 'loading'; // Phase 2: Loading new torpedo
            this.torpedoStorage[newType]--;

            // Phase 2: Load new torpedo (15 seconds)
            setTimeout(() => {
                tube.loading = false;
                tube.loaded = true;
                tube.cycling = false;
                tube.loadingPhase = null;
                console.log(`${TORPEDO_SPECIFICATIONS[newType].name} loaded in tube ${tubeNumber}`);
                this.updateReticleHUD();
            }, 15000); // 15 seconds for loading
        }, 15000); // 15 seconds for removal
    }

    startTorpedoLockOn(torpedoType) {
        if (!torpedoType) return;

        // Get torpedo size
        const torpedoSize = this.getTorpedoSize(torpedoType);
        
        // Base lock times by torpedo size (in milliseconds)
        const baseLockTimes = {
            'LIGHT': 2000,   // 2 seconds
            'MEDIUM': 4000,  // 4 seconds  
            'HEAVY': 8000    // 8 seconds
        };
        
        let baseLockTime = baseLockTimes[torpedoSize] || 4000;
        
        // Calculate lock speed modifiers
        let lockSpeedMultiplier = 1.0;
        
        // Sonar conditions affect lock speed
        if (this.sonarMode === 'Active') {
            lockSpeedMultiplier *= 0.5; // 2x faster with active sonar
        }
        
        // Target's active sonar also helps (if they're pinging)
        const targetUsingActiveSonar = this.isTargetUsingActiveSonar();
        if (targetUsingActiveSonar) {
            lockSpeedMultiplier *= 0.7; // 1.4x faster if target is using active sonar
        }
        
        // Distance to reticle affects lock speed
        const reticleDistanceModifier = this.getReticleDistanceModifier();
        lockSpeedMultiplier *= reticleDistanceModifier;
        
        const finalLockTime = baseLockTime * lockSpeedMultiplier;

        this.torpedoLockSystem = {
            target: this.getClosestEnemy(),
            lockProgress: 0,
            lockStartTime: Date.now(),
            isLocked: false,
            lockTime: finalLockTime,
            torpedoType: torpedoType
        };

        console.log(`Starting ${torpedoType} lock-on: ${(finalLockTime/1000).toFixed(1)}s (${this.sonarMode} sonar)`);
    }
    
    createSmartTorpedo(torpedoType, target) {
        // Smart Torpedo Behavior Documentation:
        // 1. Torpedoes start at <50% speed for stealth approach
        // 2. Use passive homing initially to avoid detection
        // 3. Only switch to SCAV mode (full speed + active sonar) when needed
        // 4. All torpedoes show up on sonar due to impeller noise  
        // 5. Active torpedo mode alerts target (visual + audio warnings)
        // 6. SAFETY: Self-destruct if target leaves 90-degree forward arc
        
        const launchDirection = this.mesh.getWorldDirection(new THREE.Vector3());
        
        const torpedoData = {
            type: torpedoType,
            target: target,
            position: this.getPosition().clone(),
            speed: this.getTorpedoSpeed(torpedoType) * 0.4, // Start at 40% speed
            maxSpeed: this.getTorpedoSpeed(torpedoType),
            mode: 'PASSIVE_APPROACH', // PASSIVE_APPROACH, SCAV_MODE, SELF_DESTRUCT
            lockStrength: 1.0,
            timeToTarget: null,
            lastTargetPosition: target ? target.getPosition().clone() : null,
            switchToSCAVDistance: this.getSCAVSwitchDistance(torpedoType),
            
            // Safety Arc System
            launchDirection: launchDirection.clone(),
            launchPosition: this.getPosition().clone(),
            submarineId: this.id || 'player',
            safetyArcDegrees: 90, // 90-degree forward arc
            armingDistance: 50,   // Don't self-destruct until 50m from launch point
            selfDestructed: false,
            
            // Smart torpedo behavior methods
            checkSafetyArc: function() {
                if (this.selfDestructed || !this.target || this.mode === 'SELF_DESTRUCT') {
                    return false; // Already handled
                }
                
                // Don't check safety arc until armed (50m from launch)
                const distanceFromLaunch = this.position.distanceTo(this.launchPosition);
                if (distanceFromLaunch < this.armingDistance) {
                    return true; // Still safe, not armed yet
                }
                
                // Get current direction from torpedo to target
                const targetPos = this.target.getPosition ? this.target.getPosition() : this.target.position;
                if (!targetPos) {
                    this.initiateSelfDestruct('Target lost');
                    return false;
                }
                
                const torpedoToTarget = new THREE.Vector3()
                    .subVectors(targetPos, this.position)
                    .normalize();
                
                // Calculate angle between launch direction and current target direction
                const angle = Math.acos(
                    Math.max(-1, Math.min(1, this.launchDirection.dot(torpedoToTarget)))
                ) * (180 / Math.PI);
                
                // If target is outside 90-degree forward arc, self-destruct
                if (angle > this.safetyArcDegrees / 2) {
                    this.initiateSelfDestruct(`Target outside ${this.safetyArcDegrees}° arc (${angle.toFixed(1)}°)`);
                    return false;
                }
                
                return true; // Target still in safe arc
            },
            
            initiateSelfDestruct: function(reason) {
                if (this.selfDestructed) return;
                
                this.mode = 'SELF_DESTRUCT';
                this.selfDestructed = true;
                this.speed = 0;
                
                console.log(`🚨 TORPEDO SELF-DESTRUCT: ${reason}`);
                
                // Remove torpedo after brief delay
                setTimeout(() => {
                    if (window.weaponsSystem && window.weaponsSystem.removeTorpedo) {
                        window.weaponsSystem.removeTorpedo(this.id);
                    }
                }, 500);
            }
        };
        
        // Delegate actual torpedo creation to weapons system
        if (window.weaponsSystem && window.weaponsSystem.createSmartTorpedo) {
            return window.weaponsSystem.createSmartTorpedo(torpedoData);
        }
        
        console.log(`Smart ${torpedoType} created with 90° safety arc and SCAV switch at ${torpedoData.switchToSCAVDistance}m`);
        return torpedoData;
    }
    
    createDroneTorpedo() {
        // Drone (DN) Torpedo: Travels straight, reveals terrain/enemies in 2km bubble after 1km
        const launchDirection = this.mesh.getWorldDirection(new THREE.Vector3());
        const launchPosition = this.getPosition().clone();
        
        const droneData = {
            type: 'DRONE_TORPEDO',
            code: 'DN',
            position: launchPosition.clone(),
            direction: launchDirection.clone(),
            speed: TORPEDO_SPECIFICATIONS.DN.maxSpeed * 0.514444, // Convert knots to m/s
            distanceTraveled: 0,
            activationRange: TORPEDO_SPECIFICATIONS.DN.activationRange, // 1km
            bubbleRadius: TORPEDO_SPECIFICATIONS.DN.bubbleRadius, // 2km diameter
            isActive: false, // Becomes true after 1km
            mesh: null,
            id: 'drone_' + Date.now() + '_' + Math.random(),
            destroyed: false,
            
            // Map boundaries (will need to get from terrain system)
            mapBounds: {
                minX: -35000,
                maxX: 35000,
                minZ: -35000,
                maxZ: 35000
            },
            
            // Update method for game loop
            update: function(deltaTime) {
                if (this.destroyed) return false;
                
                // Move forward in launch direction
                const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
                this.position.add(movement);
                this.distanceTraveled += movement.length();
                
                // Activate bubble rendering after 1km
                if (!this.isActive && this.distanceTraveled >= this.activationRange) {
                    this.isActive = true;
                    console.log(`🚁 Drone activated at ${this.distanceTraveled.toFixed(0)}m - Revealing 2km bubble`);
                }
                
                // Check if left map bounds
                if (this.position.x < this.mapBounds.minX || this.position.x > this.mapBounds.maxX ||
                    this.position.z < this.mapBounds.minZ || this.position.z > this.mapBounds.maxZ) {
                    console.log('🚁 Drone left map bounds - removing');
                    this.destroy();
                    return false;
                }
                
                // Check terrain collision (simple check - will need terrain height)
                // TODO: Integrate with terrain collision system
                
                return true;
            },
            
            // Reveal terrain/enemies in bubble
            getRevealBubble: function() {
                if (!this.isActive) return null;
                return {
                    center: this.position.clone(),
                    radius: this.bubbleRadius // 2km diameter = 1km radius
                };
            },
            
            destroy: function() {
                if (this.destroyed) return;
                this.destroyed = true;
                
                // Play implosion sound (no explosion for drones)
                if (window.playerSubmarine && window.playerSubmarine().audioManager) {
                    window.playerSubmarine().audioManager.playSoundFile('underwater_explosion');
                }
                
                // Remove from scene
                if (this.mesh && this.scene) {
                    this.scene.remove(this.mesh);
                }
                
                // Remove from weapons system
                if (window.weaponsSystem && window.weaponsSystem.removeTorpedo) {
                    window.weaponsSystem.removeTorpedo(this.id);
                }
            }
        };
        
        // Create visual mesh for drone
        const droneGeometry = new THREE.BoxGeometry(2, 1, 4);
        const droneMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffaa }); // Green-cyan
        droneData.mesh = new THREE.Mesh(droneGeometry, droneMaterial);
        droneData.mesh.position.copy(launchPosition);
        droneData.mesh.lookAt(launchPosition.clone().add(launchDirection));
        droneData.scene = this.scene;
        this.scene.add(droneData.mesh);
        
        // Delegate to weapons system if available
        if (window.weaponsSystem && window.weaponsSystem.createDroneTorpedo) {
            return window.weaponsSystem.createDroneTorpedo(droneData);
        }
        
        // Store drone in submarine's active drones list
        if (!this.activeDrones) {
            this.activeDrones = [];
        }
        this.activeDrones.push(droneData);
        
        console.log(`🚁 Drone torpedo launched - will activate at ${droneData.activationRange}m`);
        return droneData;
    }
    
    getTorpedoSpeed(torpedoType) {
        // Base speeds for different torpedo sizes
        const speeds = {
            'LIGHT_TORPEDO': 45,   // m/s
            'MEDIUM_TORPEDO': 35,  // m/s  
            'HEAVY_TORPEDO': 25,   // m/s
            'DRONE_TORPEDO': 50    // m/s (100 knots = ~51 m/s)
        };
        return speeds[torpedoType] || 35;
    }
    
    getSCAVSwitchDistance(torpedoType) {
        // Distance at which torpedoes switch to SCAV mode for terminal guidance
        const distances = {
            'LIGHT_TORPEDO': 300,   // 300m
            'MEDIUM_TORPEDO': 400,  // 400m
            'HEAVY_TORPEDO': 500    // 500m - heaviest torpedoes need more time
        };
        return distances[torpedoType] || 400;
    }
    
    getTorpedoSize(torpedoType) {
        if (torpedoType.includes('LIGHT')) return 'LIGHT';
        if (torpedoType.includes('MEDIUM')) return 'MEDIUM';  
        if (torpedoType.includes('HEAVY')) return 'HEAVY';
        return 'MEDIUM'; // default
    }
    
    isTargetUsingActiveSonar() {
        // Check if current target is using active sonar
        // This would be integrated with enemy AI system
        return Math.random() < 0.3; // 30% chance for now
    }
    
    getReticleDistanceModifier() {
        const target = this.torpedoLockSystem?.target;
        if (!target) return 1.0;
        
        const targetPos = target.getPosition ? target.getPosition() : target.position;
        if (!targetPos) return 1.0;
        
        const reticlePos = this.firingReticle.position;
        const distanceToReticle = targetPos.distanceTo(reticlePos);
        
        // Closer to reticle = faster lock (distance in meters)
        if (distanceToReticle < 50) return 0.5;      // 2x faster if very close to reticle
        else if (distanceToReticle < 100) return 0.7; // 1.4x faster if close to reticle
        else if (distanceToReticle < 200) return 0.9; // 1.1x faster if moderately close
        else return 1.2; // 20% slower if far from reticle
    }

    launchTorpedo() {
        // Check if we have a selected launcher and current chamber has torpedo
        const launcher = this.launchers[this.selectedLauncher - 1];
        if (!launcher) {
            console.log(`No launcher ${this.selectedLauncher} available`);
            return;
        }

        // Box 0 is always empty, boxes 1-6 contain torpedoes
        if (launcher.currentBox === 0 || launcher.currentBox === -1) {
            console.log(`Box ${launcher.currentBox} in launcher ${this.selectedLauncher} is empty`);
            return;
        }
        
        const chamberIndex = launcher.currentBox - 1; // Box 1-6 maps to chamber 0-5
        const currentTorpedoCode = launcher.chambers[chamberIndex];
        if (!currentTorpedoCode || currentTorpedoCode === '') {
            console.log(`Box ${launcher.currentBox} in launcher ${this.selectedLauncher} is empty`);
            return;
        }
        
        // Validate that this is actually a torpedo (not a noisemaker or mine)
        const validTorpedoCodes = ['LT', 'MT', 'HT', 'DN'];
        if (!validTorpedoCodes.includes(currentTorpedoCode)) {
            console.log(`Invalid torpedo code in launcher: ${currentTorpedoCode}`);
            return;
        }

        // DN (Drone) torpedoes don't require lock-on - they travel straight
        const isDrone = currentTorpedoCode === 'DN';
        
        // Check if we have a lock-on (required for LT/MT/HT, not for DN)
        if (!isDrone && (!this.torpedoLockSystem || !this.torpedoLockSystem.isLocked)) {
            console.log('No target lock - cannot fire torpedo (DN drones don\'t need lock)');
            return;
        }

        const torpedoType = this.getFullTorpedoType(currentTorpedoCode);

        // Create and launch torpedo (smart torpedo for LT/MT/HT, drone for DN)
        let torpedo;
        if (isDrone) {
            // DN drones travel straight, no target needed
            torpedo = this.createDroneTorpedo();
        } else {
            // LT/MT/HT torpedoes use smart torpedo system with target
            torpedo = this.createSmartTorpedo(torpedoType, this.torpedoLockSystem.target);
        }

        // Trigger torpedo launch signature spike
        this.torpedoLaunchSignature.active = true;
        this.torpedoLaunchSignature.startTime = Date.now();
        
        // Play torpedo launch sound
        this.audioManager.playTorpedoLaunch();

        // Clear current chamber
        launcher.chambers[chamberIndex] = '';

        // Reset lock system (only if not a drone)
        if (!isDrone) {
            this.torpedoLockSystem = {
                target: null,
                lockProgress: 0,
                lockStartTime: 0,
                isLocked: false
            };
        }

        console.log(`${torpedoType} launched from launcher ${this.selectedLauncher}, box ${launcher.currentBox}`);

        // Update visual display
        this.updateLauncherDisplay();
    }

    autoReloadTube(tubeNumber) {
        const tube = this.torpedoTubes[tubeNumber - 1];

        // Auto-load Medium torpedo if available
        if (this.torpedoStorage.MT > 0) {
            setTimeout(() => {
                tube.loading = true;
                tube.loadStartTime = Date.now();
                tube.loadedType = 'MT';
                this.torpedoStorage.MT--;

                setTimeout(() => {
                    tube.loading = false;
                    tube.loaded = true;
                    console.log(`Auto-reloaded Medium Torpedo in tube ${tubeNumber}`);
                }, TORPEDO_SPECIFICATIONS.MT.loadTime);
            }, 1000); // 1 second delay before auto-reload starts
        }
    }

    getClosestEnemy() {
        // Placeholder - integrate with enemy system
        const enemies = window.getEnemySubmarines ? window.getEnemySubmarines() : [];
        if (enemies.length === 0) return null;

        let closest = null;
        let closestDistance = Infinity;

        enemies.forEach(enemy => {
            const distance = this.mesh.position.distanceTo(enemy.getPosition());
            if (distance < closestDistance) {
                closestDistance = distance;
                closest = enemy;
            }
        });

        return closest;
    }

    createTorpedo(type, target) {
        // TODO: Create actual torpedo entity
        console.log(`Creating ${type} torpedo with target:`, target ? 'Locked' : 'Dumbfire');

        // This would create a torpedo object with AI behavior
        // For now, just log the torpedo creation
    }

    updateSpeedControl(deltaTime) {
        // Handle keyboard throttle control
        if (this.keys.throttleUp || this.keys.throttleDown) {
            const throttleChange = this.keys.throttleUp ? 5 : -5;
            this.currentThrust = Math.max(-100, Math.min(100, this.currentThrust + throttleChange * deltaTime * 60));
            this.targetSpeed = this.currentThrust;
        }

        // MHD Drive: Symmetric acceleration and max speeds in both directions
        const speedDifference = this.targetSpeed - this.speed;
        const maxSpeedChange = this.accelerationRate * deltaTime * 60; // Scale by 60 for frame rate independence

        if (Math.abs(speedDifference) < 0.1) {
            // Close enough - snap to target to avoid oscillation
            this.speed = this.targetSpeed;
        } else {
            // Gradually approach target speed
            const speedChange = Math.sign(speedDifference) * Math.min(Math.abs(speedDifference), maxSpeedChange);
            this.speed += speedChange;
        }

        // Enforce symmetric speed limits (MHD drive characteristic) with engine damage
        const effectiveMaxSpeed = this.getEffectiveMaxSpeed();
        const effectiveMaxReverseSpeed = this.effectiveMaxReverseSpeed || this.maxReverseSpeed;
        this.speed = Math.max(effectiveMaxReverseSpeed, Math.min(effectiveMaxSpeed, this.speed));
    }

    updateFiringReticle(deltaTime) {
        // Update firing reticle position (always 5 sub lengths ahead) - follows submarine's full orientation
        const firingDirection = new THREE.Vector3(1, 0, 0); // Forward direction
        // Use submarine's full rotation (yaw AND pitch)
        const fullQuaternion = new THREE.Quaternion();
        fullQuaternion.setFromEuler(this.mesh.rotation);
        firingDirection.applyQuaternion(fullQuaternion);

        this.firingReticle.position.copy(this.mesh.position);
        this.firingReticle.position.add(firingDirection.multiplyScalar(this.firingReticle.distance));

        // Update firing reticle target lock system
        this.updateTargetLock(deltaTime);

        // Update visual firing reticle
        if (this.firingReticleMesh) {
            this.firingReticleMesh.position.copy(this.firingReticle.position);

            // Make firing reticle face the camera for consistent visibility
            const camera = window.gameState ? window.gameState.camera : null;
            if (camera) {
                this.firingReticleMesh.lookAt(camera.position);
            }

            // Apply spin animation
            this.firingReticle.currentRotation += this.firingReticle.spinSpeed * deltaTime;
            this.firingReticleMesh.rotation.z = this.firingReticle.currentRotation;

            // Apply scale animation
            this.firingReticleMesh.scale.setScalar(this.firingReticle.currentScale);

            // Update reticle color based on crush depth and lock status
            // Check if near crush depth (within 10% of crush depth)
            const currentDepth = 300 - this.mesh.position.y;
            const crushDepthWarning = currentDepth > (this.maxDepth * 0.9);

            // Flashing red logic for crush depth
            const flashTime = Date.now() * 0.01; // Fast flash
            const isFlashing = crushDepthWarning && (Math.sin(flashTime) > 0);

            if (crushDepthWarning && isFlashing) {
                // Rapid red flash near crush depth
                this.firingReticleMaterial.color.setHex(0xff0000);
            } else if (this.firingReticle.isLocked) {
                this.firingReticleMaterial.color.setHex(0xff8800); // Orange when locked
            } else if (this.firingReticle.lockProgress > 0) {
                // Interpolate from white to yellow during lock process
                const r = 1.0;
                const g = 1.0;
                const b = 1.0 - this.firingReticle.lockProgress;
                this.firingReticleMaterial.color.setRGB(r, g, b);
            } else {
                this.firingReticleMaterial.color.setHex(0xffffff); // White normally
            }
        }
    }

    updateTargetLock(deltaTime) {
        // Calculate sonar lock bonus based on active sonar ping rate
        this.updateSonarLockBonus();

        // Find closest enemy to firing reticle
        const enemies = window.getEnemySubmarines ? window.getEnemySubmarines() : [];
        let closestEnemy = null;
        let closestDistance = Infinity;

        enemies.forEach(enemy => {
            const distance = this.firingReticle.position.distanceTo(enemy.getPosition());
            if (distance < closestDistance && distance < this.firingReticle.maxLockRange) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });

        // Update target and lock progress
        if (closestEnemy && closestDistance < this.firingReticle.maxLockRange) {
            this.firingReticle.target = closestEnemy;

            // Calculate base lock progress based on distance to reticle center
            const proximityFactor = Math.max(0, 1 - (closestDistance / this.firingReticle.maxLockRange));

            // Apply sonar-dependent lock rate and gunnery skill bonus
            const totalLockRate = this.firingReticle.baseLockRate + this.firingReticle.sonarLockBonus;
            const gunneryBonus = this.getGunnerySkillModifier();
            const lockIncrement = totalLockRate * proximityFactor * deltaTime * gunneryBonus;

            // Accumulate lock progress over time
            this.firingReticle.lockProgress = Math.min(1.0,
                this.firingReticle.lockProgress + lockIncrement);

            // Check for full lock (requires sustained targeting)
            if (this.firingReticle.lockProgress >= 0.95 && closestDistance < this.firingReticle.lockDistance) {
                this.firingReticle.isLocked = true;
            } else {
                this.firingReticle.isLocked = false;
            }

            // Update spin speed based on lock progress (faster as lock progresses)
            this.firingReticle.spinSpeed = this.firingReticle.lockProgress * 8; // Max 8 radians per second

            // Update scale based on lock progress (shrink as lock progresses)
            const targetScale = this.firingReticle.baseScale -
                (this.firingReticle.baseScale - this.firingReticle.minScale) * this.firingReticle.lockProgress;
            this.firingReticle.currentScale = targetScale;

        } else {
            // No valid target - slowly decay lock progress
            this.firingReticle.target = null;
            this.firingReticle.lockProgress = Math.max(0, this.firingReticle.lockProgress - deltaTime * 2); // Decay at 2x rate
            this.firingReticle.isLocked = false;

            if (this.firingReticle.lockProgress === 0) {
                this.firingReticle.spinSpeed = 0;
                this.firingReticle.currentScale = this.firingReticle.baseScale;
            } else {
                // Keep spinning/scaling during decay
                this.firingReticle.spinSpeed = this.firingReticle.lockProgress * 4; // Slower decay spin
                const targetScale = this.firingReticle.baseScale -
                    (this.firingReticle.baseScale - this.firingReticle.minScale) * this.firingReticle.lockProgress;
                this.firingReticle.currentScale = targetScale;
            }
        }

        // Stop spinning when fully locked
        if (this.firingReticle.isLocked) {
            this.firingReticle.spinSpeed = 0;
        }
    }

    updateSonarLockBonus() {
        // Calculate lock rate bonus based on active sonar ping rate
        // Faster ping rates = faster lock-on, no sonar = slowest lock-on

        const sonarRateSettings = [
            { rate: 1.0, bonus: 2.0 },   // Fast (1s) - 2.0 lock bonus
            { rate: 2.0, bonus: 1.5 },   // Normal (2s) - 1.5 lock bonus
            { rate: 3.0, bonus: 1.0 },   // Slow (3s) - 1.0 lock bonus
            { rate: 5.0, bonus: 0.5 }    // Very Slow (5s) - 0.5 lock bonus
        ];

        // Check if sonar has pinged recently
        const currentTime = Date.now();
        const timeSinceLastPing = currentTime - this.firingReticle.lastSonarPing;
        const sonarCooldown = sonarRateSettings[this.sonarSettings.rate].rate * 1000; // Convert to ms

        // If sonar is actively pinging (within cooldown period), apply bonus
        if (timeSinceLastPing < sonarCooldown * 1.5) { // Give some grace period
            this.firingReticle.sonarLockBonus = sonarRateSettings[this.sonarSettings.rate].bonus;
        } else {
            // No recent sonar ping - use base lock rate only
            this.firingReticle.sonarLockBonus = 0;
        }
    }

    // Submarine orientation is now handled directly in updateDirectControl()

    createReticleVisuals() {
        // Firing reticle (crosshair ahead of submarine)
        const firingReticleGroup = new THREE.Group();
        this.firingReticleMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff, // White (changes to red near crush depth)
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });

        // Crosshair design - made larger and more visible
        const crosshairSize = 1.5;
        const crosshairGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-crosshairSize, 0, 0),
            new THREE.Vector3(crosshairSize, 0, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -crosshairSize, 0),
            new THREE.Vector3(0, crosshairSize, 0)
        ]);

        const firingCrosshair = new THREE.Line(crosshairGeometry, this.firingReticleMaterial);
        firingReticleGroup.add(firingCrosshair);

        // Circle around crosshair - made larger
        const circleGeometry = new THREE.RingGeometry(2.0, 2.2, 16);
        const circleEdges = new THREE.EdgesGeometry(circleGeometry);
        const firingCircle = new THREE.LineSegments(circleEdges, this.firingReticleMaterial);
        firingReticleGroup.add(firingCircle);

        this.firingReticleMesh = firingReticleGroup;
        this.scene.add(this.firingReticleMesh);

        // No maneuver reticle needed - using direct keyboard control
    }

    updateHUD() {
        // Calculate current depth based on position (surface is at y=300)
        this.depth = Math.max(0, 300 - this.mesh.position.y);

        // Update game HUD with submarine stats
        if (window.updateDepth) {
            window.updateDepth(Math.round(this.depth), this.maxDepth);
        }
        if (window.updateSpeed) {
            window.updateSpeed(Math.round(this.speed));
        }
        if (window.updateHealth) {
            window.updateHealth(this.health);
        }

        // Update sonar settings display
        this.updateSonarDisplay();

        // Update throttle display
        this.updateThrottleDisplay();

        // Update towed array and sonar signature display
        this.updateWarfareDisplay();

        // Update target lock display
        this.updateTargetLockDisplay();

        // Update advanced damage system displays
        this.updateArmorDisplay();
        this.updateSystemsDisplay();

        // Update compass
        this.updateCompass();

        // Update sonar signature display
        this.updateSonarSignatureDisplay();
    }

    updateCompass() {
        const needle = document.querySelector('.compass-needle');
        if (needle && this.mesh) {
            // Get submarine's Y rotation (yaw) in radians
            const submarineYaw = this.mesh.rotation.y;

            // Convert to degrees and adjust for compass (north = 0°, clockwise positive)
            // Three.js Y rotation: 0 = +X (east), π/2 = +Z (south), π = -X (west), 3π/2 = -Z (north)
            // Compass: 0° = north, 90° = east, 180° = south, 270° = west
            const compassAngle = ((submarineYaw * 180 / Math.PI) + 90) % 360;

            // Update needle rotation
            needle.style.transform = `translate(-50%, -100%) rotate(${compassAngle}deg)`;
        }
    }

    updateThrottleDisplay() {
        // Update speed display with target vs current
        const speedElement = document.getElementById('speed');
        if (speedElement) {
            const targetSpeedKnots = Math.round(this.targetSpeed);
            const currentSpeedKnots = Math.round(this.speed);

            // Show both target and current speed
            if (Math.abs(targetSpeedKnots - currentSpeedKnots) > 1) {
                speedElement.textContent = `Speed: ${currentSpeedKnots} → ${targetSpeedKnots} knots`;
                speedElement.style.color = '#ffaa00'; // Orange when accelerating
            } else {
                speedElement.textContent = `Speed: ${currentSpeedKnots} knots`;
                speedElement.style.color = currentSpeedKnots > 0 ? '#00ff00' : currentSpeedKnots < 0 ? '#ff0000' : '#ffffff';
            }
        }
    }

    updateWarfareDisplay() {
        // Update towed array status
        const towedArrayElement = document.getElementById('towedArray');
        if (towedArrayElement) {
            towedArrayElement.textContent = `Towed Array: ${this.towedArray.deployed ? 'DEPLOYED' : 'RETRACTED'}`;
            towedArrayElement.style.color = this.towedArray.deployed ? '#00ff00' : '#ffaa00';
        }

        // Update sonar signature
        const signatureElement = document.getElementById('signature');
        if (signatureElement) {
            signatureElement.textContent = `Noise: ${Math.round(this.sonarSignature.current)}`;
            const color = this.sonarSignature.current > 10 ? '#ff0000' :
                this.sonarSignature.current > 6 ? '#ffaa00' : '#00ff00';
            signatureElement.style.color = color;
        }

        // Update passive sensitivity
        const sensitivityElement = document.getElementById('sensitivity');
        if (sensitivityElement) {
            sensitivityElement.textContent = `Passive: ${Math.round(this.passiveSensitivity * 100)}%`;
            sensitivityElement.style.color = this.passiveSensitivity > 1.5 ? '#00ff00' :
                this.passiveSensitivity > 1.0 ? '#ffaa00' : '#ff0000';
        }
    }

    updateTargetLockDisplay() {
        const targetDetailsElement = document.getElementById('targetDetails');
        const lockStatusElement = document.getElementById('lockStatus');

        if (targetDetailsElement && lockStatusElement) {
            if (this.firingReticle.target) {
                const distance = this.firingReticle.position.distanceTo(this.firingReticle.target.getPosition());
                const sonarBonus = this.firingReticle.sonarLockBonus > 0 ? ` +${this.firingReticle.sonarLockBonus.toFixed(1)}x` : '';
                targetDetailsElement.innerHTML = `Target: Enemy Sub<br>Range: ${distance.toFixed(1)}m${sonarBonus}`;

                if (this.firingReticle.isLocked) {
                    lockStatusElement.innerHTML = 'Status: <span style="color: #ff0000">LOCKED</span>';
                } else {
                    const lockPercent = Math.round(this.firingReticle.lockProgress * 100);
                    const sonarStatus = this.firingReticle.sonarLockBonus > 0 ? ' (Sonar)' : ' (Passive)';
                    lockStatusElement.innerHTML = `Status: <span style="color: #ffff00">Locking... ${lockPercent}%</span>${sonarStatus}`;
                }
            } else {
                targetDetailsElement.textContent = 'No target locked';
                const sonarStatus = this.firingReticle.sonarLockBonus > 0 ? ' (Active Sonar)' : ' (Passive)';
                lockStatusElement.innerHTML = `Status: <span style="color: #00ff00">Scanning</span>${sonarStatus}`;
            }
        }
    }

    createBubbleEffect(direction) {
        // Throttle bubble creation
        this.bubbleTimer += 1;
        if (this.bubbleTimer < 10) return; // Create bubbles every 10 frames
        this.bubbleTimer = 0;

        // Create bubble particles
        const bubbleCount = 5;
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = this.createBubbleParticle();
            const submarinePos = this.mesh.position.clone();

            // Position bubbles near ballast tank vents
            bubble.position.set(
                submarinePos.x + (Math.random() - 0.5) * 2,
                submarinePos.y + (direction === 'up' ? -1 : 1),
                submarinePos.z + (Math.random() - 0.5) * 2
            );

            // Use gameState scene for consistency
            if (window.gameState && window.gameState.scene) {
                window.gameState.scene.add(bubble);
            } else {
                this.scene.add(bubble);
            }
            console.log('🫧 Bubble created, will dispose in 2 seconds');

            // Animate and remove bubble
            this.animateBubble(bubble, direction);
        }
    }

    createBubbleParticle() {
        const bubbleGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const bubbleMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.6
        });
        return new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    }

    animateBubble(bubble, direction) {
        const startY = bubble.position.y;
        const lifetime = 2000; // 2 seconds
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / lifetime;

            if (progress >= 1) {
                // Ensure proper cleanup using gameState scene
                if (window.gameState && window.gameState.scene) {
                    window.gameState.scene.remove(bubble);
                } else {
                    this.scene.remove(bubble);
                }
                bubble.geometry.dispose();
                bubble.material.dispose();
                console.log('🫧 Bubble disposed after 2 seconds');
                return;
            }

            // Bubble movement
            if (direction === 'up') {
                bubble.position.y = startY + progress * 10; // Rise up
            } else {
                bubble.position.y = startY - progress * 5; // Sink down
            }

            // Fade out
            bubble.material.opacity = 0.6 * (1 - progress);

            requestAnimationFrame(animate);
        };

        animate();
    }

    createWakeEffect() {
        // Simple wake trail effect
        if (!this.wakeParticles) this.wakeParticles = [];

        // Create wake particle
        const wakeGeometry = new THREE.SphereGeometry(0.2, 6, 4);
        const wakeMaterial = new THREE.MeshBasicMaterial({
            color: 0x88aaff,
            transparent: true,
            opacity: 0.3
        });
        const wakeParticle = new THREE.Mesh(wakeGeometry, wakeMaterial);

        // Position behind submarine
        const behindSub = new THREE.Vector3(-2, 0, 0);
        behindSub.applyQuaternion(this.mesh.quaternion);
        wakeParticle.position.copy(this.mesh.position.clone().add(behindSub));

        this.scene.add(wakeParticle);
        this.wakeParticles.push({
            particle: wakeParticle,
            startTime: Date.now()
        });

        // Clean up old wake particles
        this.wakeParticles = this.wakeParticles.filter(wake => {
            const age = Date.now() - wake.startTime;
            if (age > 3000) { // 3 second lifetime
                this.scene.remove(wake.particle);
                wake.particle.geometry.dispose();
                wake.particle.material.dispose();
                return false;
            }
            // Fade out over time
            wake.particle.material.opacity = 0.3 * (1 - age / 3000);
            return true;
        });
    }

    updateWarfareSystems(deltaTime) {
        // Update knuckles (turbulence pockets from sharp turns)
        this.updateKnuckles(deltaTime);

        // Update sonar signature based on speed and conditions
        this.updateSonarSignature();

        // Update passive sensitivity based on speed and towed array
        this.updatePassiveSensitivity();

        // Create knuckles on sharp turns
        if (this.turnRate > 50 && Math.abs(this.speed) > 3) { // Sharp turn at speed
            this.createKnuckle();
        }

        // Continuous passive sonar detection
        this.updatePassiveDetection(deltaTime);
    }

    updateKnuckles(deltaTime) {
        // Update existing knuckles (they fade over time)
        this.knuckles = this.knuckles.filter(knuckle => {
            knuckle.lifetime -= deltaTime;
            knuckle.mesh.material.opacity = Math.max(0, knuckle.lifetime / knuckle.maxLifetime);

            if (knuckle.lifetime <= 0) {
                this.scene.remove(knuckle.mesh);
                knuckle.mesh.geometry.dispose();
                knuckle.mesh.material.dispose();
                return false;
            }
            return true;
        });
    }

    createKnuckle() {
        // Don't create knuckles too frequently
        if (Date.now() - this.knuckleTimer < 2000) return;
        this.knuckleTimer = Date.now();

        // Create visual knuckle (turbulent water effect)
        const knuckleGeometry = new THREE.SphereGeometry(3, 8, 6);
        const knuckleMaterial = new THREE.MeshBasicMaterial({
            color: 0x4488ff,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });

        const knuckleMesh = new THREE.Mesh(knuckleGeometry, knuckleMaterial);
        knuckleMesh.position.copy(this.mesh.position);

        const knuckle = {
            mesh: knuckleMesh,
            position: this.mesh.position.clone(),
            lifetime: 8, // 8 seconds duration
            maxLifetime: 8,
            sonarBlocking: true,
            decoyStrength: 4, // Appears as submarine-sized contact
            noiseSignature: 20, // Strong noise signature to attract torpedoes
            isNoisemaker: true // Mark as countermeasure
        };

        this.knuckles.push(knuckle);
        this.scene.add(knuckleMesh);
        console.log(`💨 Created knuckle at ${this.mesh.position.x}, ${this.mesh.position.z} - lifetime: ${knuckle.lifetime}s, total knuckles: ${this.knuckles.length}`);

        // Play knuckle sound (2 seconds)
        this.audioManager.playKnuckle();

        // Knuckles slow you down significantly
        this.speed *= 0.6;

        // IMMEDIATELY drop submarine's noise signature
        this.knuckleNoiseReduction = 0.8; // 80% noise reduction for 2 seconds
        
        console.log('Knuckle created! Speed reduced - submarine noise dropped immediately for masking.');
    }

    handleEmergencyBlowKey(key) {
        const currentTime = Date.now();
        const lastPress = this.emergencyBlow.lastKeyPress[key];
        
        // Check if this is a double-tap
        if (lastPress && (currentTime - lastPress) <= this.emergencyBlow.doubleTapWindow) {
            this.performEmergencyBlow(key);
        }
        
        // Update last press time
        this.emergencyBlow.lastKeyPress[key] = currentTime;
    }

    performEmergencyBlow(key) {
        if (this.emergencyBlow.used) {
            console.log('⚠️ Emergency blow already used - systems damaged!');
            return;
        }

        const direction = key === 'Q' ? 'UP' : 'DOWN';
        const emergencyForce = 150; // Strong emergency movement
        
        console.log(`🚨 EMERGENCY BLOW ${direction}! Ballast tanks blown!`);
        
        // Apply immediate emergency movement
        if (key === 'Q') {
            // Emergency surface
            this.mesh.position.y += emergencyForce;
            this.mesh.position.y = Math.min(this.mesh.position.y, 300); // Don't go above surface
        } else {
            // Emergency dive
            this.mesh.position.y -= emergencyForce;
        }
        
        // Mark emergency blow as used and apply permanent penalty
        this.emergencyBlow.used = true;
        this.emergencyBlow.depthChangePenalty = 0.5; // 50% reduction in depth change rate
        
        // Create massive noise signature from blowing ballast
        this.triggerSonarPing(); // Loud noise from emergency blow
        
        // Temporary speed boost from emergency action, then reduction
        this.speed *= 1.3;
        setTimeout(() => {
            this.speed *= 0.7; // Net reduction after emergency
        }, 2000);
        
        console.log('⚠️ Emergency blow complete - depth control systems permanently damaged!');
        console.log('📉 Future depth changes will be 50% slower');
    }

    updateThermalLayerDetection() {
        const currentDepth = Math.max(0, 300 - this.mesh.position.y);
        const previousHidden = this.thermalLayers.isHidden;
        
        this.thermalLayers.isHidden = false;
        this.thermalLayers.activeLayer = null;
        
        // Check if we're within range of thermal layers
        const distToLayer1 = Math.abs(currentDepth - this.thermalLayers.layer1Depth);
        const distToLayer2 = Math.abs(currentDepth - this.thermalLayers.layer2Depth);
        
        if (distToLayer1 <= this.thermalLayers.hidingRange) {
            this.thermalLayers.isHidden = true;
            this.thermalLayers.activeLayer = 1;
            if (!previousHidden) {
                console.log(`🌊 Submarine hidden in thermal layer at ${this.thermalLayers.layer1Depth}m depth`);
                console.log(`📡 Sonar signature reduced by ${this.thermalLayers.sonarReduction * 100}%`);
            }
        } else if (distToLayer2 <= this.thermalLayers.hidingRange) {
            this.thermalLayers.isHidden = true;
            this.thermalLayers.activeLayer = 2;
            if (!previousHidden) {
                console.log(`🌊 Submarine hidden in thermal layer at ${this.thermalLayers.layer2Depth}m depth`);
                console.log(`📡 Sonar signature reduced by ${this.thermalLayers.sonarReduction * 100}%`);
            }
        } else if (previousHidden) {
            console.log('🌊 Submarine left thermal layer - sonar signature restored');
        }
    }

    updateBottomBouncing(deltaTime) {
        const currentDepth = Math.max(0, 300 - this.mesh.position.y);
        const previousActive = this.bottomBouncing.isActive;
        
        // Get seabed depth at current position
        let seabedDepth = 1000; // Default depth if ocean system unavailable
        if (window.oceanInstance && window.oceanInstance.getSeabedHeightAt) {
            const seabedHeight = window.oceanInstance.getSeabedHeightAt(this.mesh.position.x, this.mesh.position.z);
            seabedDepth = Math.abs(seabedHeight); // Convert to positive depth
        }
        
        // Check if we're close enough to seabed for bottom bouncing
        const distanceToBottom = Math.abs(seabedDepth - currentDepth);
        
        if (distanceToBottom <= this.bottomBouncing.bottomRange) {
            if (!this.bottomBouncing.isActive) {
                this.bottomBouncing.isActive = true;
                this.bottomBouncing.bounceTimer = 10; // 10 second effect duration
                console.log(`🪨 Bottom bouncing activated - ${distanceToBottom.toFixed(1)}m from seabed`);
                console.log(`📡 Sonar signature reduced by ${this.bottomBouncing.sonarReduction * 100}% (sound bouncing off seafloor)`);
            }
        } else {
            this.bottomBouncing.isActive = false;
        }
        
        // Update bounce timer
        if (this.bottomBouncing.bounceTimer > 0) {
            this.bottomBouncing.bounceTimer -= deltaTime;
            if (this.bottomBouncing.bounceTimer <= 0 && previousActive) {
                console.log('🪨 Bottom bouncing effect ended');
            }
        }
        
        this.bottomBouncing.lastDepth = currentDepth;
    }

    updateSCAVMode(deltaTime) {
        // Supercavitation (SCAV) mode - automatically activated at high speeds
        // Creates bubble cloud around submarine, severely reducing passive sonar effectiveness
        
        const currentSpeedKnots = Math.abs(this.speed);
        const wasActive = this.scavMode.active;
        
        // Check if SCAV should be active based on speed
        if (currentSpeedKnots > this.scavMode.threshold) {
            this.scavMode.active = true;
            
            // Increase bubble intensity gradually
            this.scavMode.bubbleIntensity = Math.min(1.0, this.scavMode.bubbleIntensity + deltaTime * 2);
            
            // Log SCAV activation
            if (!wasActive) {
                console.log(`⚡ SUPERCAVITATION ACTIVATED at ${currentSpeedKnots.toFixed(1)} knots (threshold: ${this.scavMode.threshold})`);
                console.log('🫧 Surrounded by bubble cloud - passive sonar severely degraded');
            }
        } else if (currentSpeedKnots < this.scavMode.threshold * 0.9) { // Hysteresis to prevent flickering
            this.scavMode.active = false;
            
            // Decrease bubble intensity gradually
            this.scavMode.bubbleIntensity = Math.max(0.0, this.scavMode.bubbleIntensity - deltaTime * 3);
            
            // Log SCAV deactivation
            if (wasActive) {
                console.log(`⚡ SUPERCAVITATION DEACTIVATED at ${currentSpeedKnots.toFixed(1)} knots`);
                console.log('🎧 Passive sonar effectiveness restored');
            }
        }
        
        // Update visual effects (bubble cloud intensity)
        this.updateSCAVVisuals();
    }
    
    updateSCAVVisuals() {
        // Update bubble cloud visual effects around submarine
        // This would integrate with particle systems or shader effects
        if (this.scavMode.bubbleIntensity > 0 && this.mesh) {
            // Add bubble cloud particle effects here
            // For now, just update the submarine's material opacity to indicate SCAV mode
            if (this.mesh.material && this.scavMode.active) {
                // Subtle visual indicator - could be expanded to full particle system
                const pulseEffect = 0.9 + (Math.sin(Date.now() * 0.005) * 0.1 * this.scavMode.bubbleIntensity);
                if (this.mesh.material.emissive) {
                    this.mesh.material.emissive.setRGB(0, 0.1 * this.scavMode.bubbleIntensity, 0.2 * this.scavMode.bubbleIntensity);
                }
            }
        } else if (this.mesh && this.mesh.material && this.mesh.material.emissive) {
            // Reset visual effects when not in SCAV mode
            this.mesh.material.emissive.setRGB(0, 0, 0);
        }
    }

    updatePassiveSensitivity() {
        const speedFactor = Math.abs(this.speed) / this.maxSpeed;
        const isMoving = Math.abs(this.speed) > 0.1; // Even very slow movement counts
        
        // Realistic submarine passive sonar behavior:
        // - Best detection when completely stationary 
        // - Severe degradation when moving due to own noise
        // - Exponential penalty for speed (flow noise increases dramatically)
        
        let baseSensitivity;
        if (!isMoving) {
            // Stationary submarine - optimal passive sonar conditions
            baseSensitivity = 3.0; // Excellent passive detection
        } else {
            // Moving submarine - own noise masks targets
            // Exponential degradation: even slow movement hurts badly
            const noisePenalty = Math.pow(speedFactor, 0.7); // Severe exponential penalty
            baseSensitivity = 0.8 - (noisePenalty * 0.6); // Heavily degraded when moving
            
            // Additional penalties for higher speeds (cavitation, flow noise)
            if (speedFactor > 0.3) {
                baseSensitivity *= 0.3; // Major degradation at medium speeds
            }
            if (speedFactor > 0.6) {
                baseSensitivity *= 0.2; // Passive sonar nearly useless at high speed
            }
        }

        // Towed array bonus (but only when deployed and available)
        if (this.towedArray.deployed && this.towedArray.available) {
            if (speedFactor < 0.2) {
                // Towed array works best at slow speeds
                baseSensitivity *= this.towedArray.sensitivity * 1.4; // 1.8 * 1.4 = 2.5x total boost
            } else {
                // Towed array effectiveness degrades with speed (array vibration/noise)
                const arrayEffectiveness = Math.max(0.3, 1.0 - (speedFactor * 1.5));
                baseSensitivity *= this.towedArray.sensitivity * arrayEffectiveness;
            }
        }

        // Skill bonus for passive sonar
        const sensorSkillBonus = this.getSensorSkillModifier();
        baseSensitivity *= sensorSkillBonus;

        // Engine noise penalty (running machinery creates noise)
        if (this.speed !== 0) {
            const engineNoiseFactor = 0.9 - (speedFactor * 0.4); // Engine noise masks contacts
            baseSensitivity *= engineNoiseFactor;
        }

        // Supercavitation (SCAV) mode penalties - bubble cloud blocks passive sonar
        if (this.scavMode.active) {
            // In supercavitation mode, bubble cloud severely blocks passive sonar
            const scavReduction = 1 - (this.scavMode.passiveSonarPenalty * this.scavMode.bubbleIntensity);
            baseSensitivity *= scavReduction; // Up to 95% reduction based on bubble intensity
            
            if (Math.random() < 0.01) { // Occasional logging
                console.log(`🫧 SCAV bubble cloud blocks passive sonar - ${(scavReduction * 100).toFixed(0)}% effectiveness`);
            }
        }
        
        this.passiveSensitivity = Math.max(0.05, baseSensitivity); // Very low minimum when moving
        
        // Debug logging for passive sonar states
        if (Math.random() < 0.01) { // Occasional logging
            let status;
            if (this.scavMode.active) {
                status = `SUPERCAVITATION (${(this.scavMode.bubbleIntensity * 100).toFixed(0)}% bubble intensity)`;
            } else {
                status = !isMoving ? 'SILENT RUNNING' : speedFactor > 0.6 ? 'HIGH SPEED' : speedFactor > 0.3 ? 'MEDIUM SPEED' : 'SLOW SPEED';
            }
            console.log(`🎧 Passive Sonar: ${status} - Sensitivity: ${this.passiveSensitivity.toFixed(2)}`);
        }
    }

    updatePassiveDetection(deltaTime) {
        // Only perform continuous detection in Passive mode
        if (this.sonarMode !== 'Passive') {
            return;
        }

        // Initialize timer if needed
        if (!this.passiveDetectionTimer) {
            this.passiveDetectionTimer = 0;
        }

        // Update timer
        this.passiveDetectionTimer += deltaTime;

        // Perform automatic detection every 3 seconds in Passive mode
        const detectionInterval = 3000; // 3 seconds
        if (this.passiveDetectionTimer >= detectionInterval) {
            this.passiveDetectionTimer = 0;

            if (window.performAdvancedSonarSweep && this.mesh) {
                // Passive detection uses shorter range
                const passiveRange = 500; // 500m passive detection range

                const contacts = window.performAdvancedSonarSweep(
                    this.mesh.position,
                    passiveRange,
                    this.passiveSensitivity,
                    this.knuckles,
                    'Passive'
                );

                this.updateSonarContactsDisplay(contacts);

                // No ping effect or signature penalty for passive detection
                // This is silent listening, not active pinging
                if (contacts.length > 0) {
                    console.log(`🎧 Passive detection: ${contacts.length} contacts detected at ${passiveRange}m range`);
                }
            }
        }
    }

    toggleTowedArray() {
        if (!this.towedArray.available) {
            console.log('❌ Towed array unavailable - lost due to excessive maneuvering/speed');
            return;
        }

        this.towedArray.deployed = !this.towedArray.deployed;

        if (this.towedArray.deployed) {
            // Reduce speed when deploying
            this.speed = Math.min(this.speed, this.maxSpeed * this.towedArray.speedPenalty);
            this.towedArray.riskAccumulation = 0; // Reset risk when deploying
            console.log('🎣 Towed array deployed - Sonar sensitivity x1.8, speed limited to 70%');
        } else {
            console.log('🎣 Towed array retracted - Full speed available, reduced sensitivity');
        }
        
        this.updateSonarDisplay();
    }
    
    updateTowedArrayRisk(deltaTime) {
        if (!this.towedArray.deployed || !this.towedArray.available) {
            return;
        }
        
        const currentSpeed = Math.abs(this.speed);
        const currentTurnRate = this.turnRate || 0;
        
        // Calculate risk factors
        let riskIncrease = 0;
        
        // Speed risk - exponential increase above safe operating speed (50% of max)
        const safeSpeed = this.maxSpeed * 0.5;
        if (currentSpeed > safeSpeed) {
            const speedRisk = Math.pow((currentSpeed - safeSpeed) / this.maxSpeed, 2) * 0.5; // 0-0.5% per second
            riskIncrease += speedRisk;
        }
        
        // Maneuvering risk - sharp turns stress the towed array cable
        if (currentTurnRate > 0.01) { // Threshold for dangerous maneuvering
            const maneuverRisk = Math.pow(currentTurnRate * 100, 1.5) * 0.3; // 0-0.3% per second
            riskIncrease += maneuverRisk;
        }
        
        // Accumulate risk over time
        this.towedArray.riskAccumulation += riskIncrease * deltaTime;
        this.towedArray.breakoffRisk = Math.min(100, this.towedArray.riskAccumulation * 10); // Scale to percentage
        
        // Check for catastrophic breakoff
        if (this.towedArray.riskAccumulation > 8) { // High risk threshold
            const breakoffChance = (this.towedArray.riskAccumulation - 8) * 0.02 * deltaTime; // 2% per second beyond threshold
            
            if (Math.random() < breakoffChance) {
                this.breakoffTowedArray();
            }
        }
        
        // Warning messages at risk thresholds
        if (this.towedArray.breakoffRisk > 75 && Math.random() < 0.01) {
            console.log('⚠️ CRITICAL: Towed array cable under extreme stress!');
        } else if (this.towedArray.breakoffRisk > 50 && Math.random() < 0.005) {
            console.log('⚠️ WARNING: Towed array stress increasing - reduce speed/maneuvering');
        }
        
        // Update tracking variables
        this.towedArray.lastSpeed = currentSpeed;
        this.towedArray.lastTurnRate = currentTurnRate;
    }
    
    breakoffTowedArray() {
        if (!this.towedArray.deployed) return;
        
        this.towedArray.deployed = false;
        this.towedArray.available = false;
        this.towedArray.breakoffRisk = 0;
        this.towedArray.riskAccumulation = 0;
        
        console.log('💥 TOWED ARRAY LOST! Cable broke due to excessive stress');
        console.log('🔧 Repair required to restore towed array capability');
        
        // Visual/audio feedback could be added here
        this.updateSonarDisplay();
    }

    checkSurfaceCollision() {
        // Submarines can now surface to depth 0 (y=300) if desired
        // No surface ceiling restriction - tactical choice to expose at surface
        if (this.mesh.position.y > 300) {
            this.mesh.position.y = 300; // At surface level (depth 0)
        }
    }

    updateSonarDisplay() {
        const sonarElement = document.getElementById('sonar');
        const sonarPowerElement = document.getElementById('sonarPower');
        const sonarRateElement = document.getElementById('sonarRate');

        if (sonarElement) {
            sonarElement.textContent = `Mode: ${this.sonarMode}`;
        }

        if (sonarPowerElement) {
            // Simplified system - Active mode has fixed settings
            sonarPowerElement.textContent = this.sonarMode === 'Active' ? 'Power: High (100m)' : 'Power: N/A';
        }

        if (sonarRateElement) {
            // Active mode pings every 2 seconds as requested
            sonarRateElement.textContent = this.sonarMode === 'Active' ? 'Rate: Normal (2.0s)' : 'Rate: N/A';
        }
    }

    adjustSonarPower(direction) {
        this.sonarSettings.power = Math.max(0, Math.min(3, this.sonarSettings.power + direction));
        this.updateSonarDisplay();
        console.log(`Sonar power adjusted to level ${this.sonarSettings.power}`);
    }

    adjustSonarRate(direction) {
        this.sonarSettings.rate = Math.max(0, Math.min(3, this.sonarSettings.rate + direction));
        this.updateSonarDisplay();
        console.log(`Sonar rate adjusted to level ${this.sonarSettings.rate}`);
    }

    showStatusMessage(message, type = 'info') {
        // Show status message to user
        if (window.updateStatus) {
            window.updateStatus(message);
        }
        
        // Also log to console with type indicator
        const prefix = type === 'critical' ? '🔴' : type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${prefix} ${message}`);
    }

    performSonarPing() {
        // Single active sonar ping - works in both Active and Passive modes
        if (window.performAdvancedSonarSweep && this.mesh) {
            // Record sonar ping time for target lock system
            this.firingReticle.lastSonarPing = Date.now();

            // Active sonar ping: 2km range
            const currentRange = 2000; // 2km active sonar ping range

            // Use advanced sonar system with warfare mechanics
            const contacts = window.performAdvancedSonarSweep(
                this.mesh.position,
                currentRange,
                this.passiveSensitivity,
                this.knuckles,
                'Active'  // Always use Active mode for ping
            );

            this.updateSonarContactsDisplay(contacts);
            this.triggerSonarPingEffect();

            // Trigger sonar signature penalty
            this.triggerSonarPing();
            
            // Play active single ping sound
            this.audioManager.playActiveSinglePing();

            // Activate terrain visibility extension (2km range, 30s visible, fade 30-40s)
            if (window.oceanInstance && window.oceanInstance.activateSonarPing) {
                window.oceanInstance.activateSonarPing();
                console.log('🔊 R key sonar ping: Extended terrain visibility to 2km for 30 seconds (fades 30-40s)');
            }

            console.log(`Advanced sonar ping: ${contacts.length} contacts detected at ${currentRange}m range`);
        }
    }

    cycleSonarMode() {
        // Only Active and Passive modes (Silent mode removed)
        const modes = ['Active', 'Passive'];
        const currentIndex = modes.indexOf(this.sonarMode);
        const previousMode = this.sonarMode;
        this.sonarMode = modes[(currentIndex + 1) % modes.length];
        
        // Update active sonar pinging sound
        if (this.sonarMode === 'Active' && previousMode !== 'Active') {
            // Switched to Active mode - start constant pinging
            this.audioManager.startActiveSonarPinging();
        } else if (this.sonarMode === 'Passive' && previousMode === 'Active') {
            // Switched from Active to Passive - stop constant pinging
            this.audioManager.stopActiveSonarPinging();
        }
        
        // Sonar mode descriptions
        let modeDescription = '';
        switch (this.sonarMode) {
            case 'Active':
                modeDescription = '(Press R for single ping)';
                break;
            case 'Passive':
                modeDescription = '(Continuous listening - 500m range)';
                break;
        }
        
        console.log(`Sonar mode: ${this.sonarMode} ${modeDescription}`);
        this.updateSonarDisplay();
    }

    cycleSonarPower() {
        const powers = ['Low', 'Medium', 'High'];
        const currentIndex = powers.indexOf(this.sonarPower);
        this.sonarPower = powers[(currentIndex + 1) % powers.length];
        console.log(`Sonar power: ${this.sonarPower} (${this.sonarPowerRanges[this.sonarPower]}m)`);
        this.updateSonarDisplay();
    }

    cycleSonarPingRate() {
        const rates = ['Fast', 'Normal', 'Slow', 'Very Slow'];
        const currentIndex = rates.indexOf(this.sonarPingRate);
        this.sonarPingRate = rates[(currentIndex + 1) % rates.length];
        console.log(`Ping rate: ${this.sonarPingRate} (${this.sonarPingRates[this.sonarPingRate] / 1000}s)`);
        this.updateSonarDisplay();
    }

    // QMAD (Quantum Magnetic Anomaly Detectors) Detection System
    performQMADScan() {
        if (!this.qmadSystem.enabled) return [];
        
        const currentTime = Date.now();
        if (currentTime - this.qmadSystem.lastUpdate < this.qmadSystem.updateRate) {
            return this.qmadSystem.contacts; // Return cached contacts
        }
        
        this.qmadSystem.lastUpdate = currentTime;
        this.qmadSystem.contacts = [];
        
        const submarinePos = this.getPosition();
        if (!submarinePos) return [];
        
        // Calculate electrical interference based on submarine systems
        this.qmadSystem.interferenceLevel = this.calculateQMADInterference();
        
        // Detect enemy submarines through magnetic signatures
        if (window.enemySystem) {
            const enemies = window.enemySystem.getActiveEnemies();
            enemies.forEach(enemy => {
                if (!enemy.mesh) return;
                
                const enemyPos = enemy.getPosition();
                const distance = submarinePos.distanceTo(enemyPos);
                
                if (distance <= this.qmadSystem.range) {
                    const detectionChance = this.calculateQMADDetectionChance(enemy, distance);
                    
                    if (Math.random() < detectionChance) {
                        const contact = {
                            id: `qmad_${enemy.id}`,
                            distance: Math.round(distance),
                            bearing: this.calculateBearing(submarinePos, enemyPos),
                            strength: this.calculateMagneticSignature(enemy, distance),
                            classification: this.classifyQMADContact(enemy, detectionChance),
                            isQMAD: true,
                            sourceType: 'submarine',
                            target: enemy,
                            confidence: detectionChance,
                            lastUpdate: currentTime,
                            interferenceAffected: this.qmadSystem.interferenceLevel > 0.3
                        };
                        
                        this.qmadSystem.contacts.push(contact);
                    }
                }
            });
        }
        
        // Detect large metallic objects (mines with significant metal content)
        if (window.sealifeSystem) {
            const sealife = window.sealifeSystem();
            if (sealife && sealife.sonarContacts) {
                sealife.sonarContacts.forEach(contact => {
                    if (contact.isMine && contact.isActive) {
                        const minePos = contact.position;
                        const distance = submarinePos.distanceTo(minePos);
                        
                        if (distance <= this.qmadSystem.range * 0.3) { // Mines have shorter QMAD range
                            const detectionChance = 0.8 * this.qmadSystem.sensitivity; // Mines easier to detect
                            
                            if (Math.random() < detectionChance) {
                                const qmadContact = {
                                    id: `qmad_mine_${contact.id}`,
                                    distance: Math.round(distance),
                                    bearing: this.calculateBearing(submarinePos, minePos),
                                    strength: 3, // Moderate magnetic signature
                                    classification: 'METALLIC ANOMALY',
                                    isQMAD: true,
                                    sourceType: 'mine',
                                    isMine: true,
                                    confidence: detectionChance,
                                    lastUpdate: currentTime,
                                    interferenceAffected: this.qmadSystem.interferenceLevel > 0.4
                                };
                                
                                this.qmadSystem.contacts.push(qmadContact);
                            }
                        }
                    }
                });
            }
        }
        
        console.log(`🧲 QMAD scan: ${this.qmadSystem.contacts.length} magnetic anomalies detected (interference: ${(this.qmadSystem.interferenceLevel * 100).toFixed(1)}%)`);
        return this.qmadSystem.contacts;
    }
    
    calculateQMADInterference() {
        let interference = 0;
        
        // Speed-based electrical interference
        const speedFactor = Math.abs(this.speed) / this.specs.maxSpeedForward;
        interference += speedFactor * 0.3;
        
        // Weapon systems cause interference
        if (this.weaponSystems && this.weaponSystems.cannons && this.weaponSystems.cannons.firing) {
            interference += 0.4;
        }
        
        // Active sonar causes electromagnetic interference
        if (this.sonarMode === 'Active') {
            interference += 0.2;
        }
        
        // Engine power level affects magnetic field
        const enginePowerFactor = Math.abs(this.currentThrust) / 100;
        interference += enginePowerFactor * 0.15;
        
        // Damaged systems cause magnetic anomalies
        if (this.systems.sensors.hp < this.systems.sensors.maxHP * 0.8) {
            interference += 0.1;
        }
        
        return Math.min(interference, 0.9); // Cap at 90% interference
    }
    
    calculateQMADDetectionChance(enemy, distance) {
        // Base detection chance depends on enemy submarine class and magnetic signature
        let baseChance = 0.7; // 70% base chance
        
        // Distance affects detection
        const distanceFactor = 1 - (distance / this.qmadSystem.range);
        baseChance *= distanceFactor;
        
        // Enemy submarine size affects magnetic signature
        if (enemy.specs) {
            const sizeFactor = (enemy.specs.displacement || 300) / 1000; // Larger subs easier to detect
            baseChance *= (0.8 + sizeFactor * 0.4);
        }
        
        // Enemy submarine speed affects detection (moving metal easier to detect)
        if (enemy.speed) {
            const speedFactor = Math.abs(enemy.speed) / 50; // Normalized to 50 knots
            baseChance *= (1 + speedFactor * 0.3);
        }
        
        // Apply system sensitivity
        baseChance *= this.qmadSystem.sensitivity;
        
        // Interference reduces detection chance
        baseChance *= (1 - this.qmadSystem.interferenceLevel * 0.6);
        
        return Math.max(0.05, Math.min(0.95, baseChance)); // Clamp between 5% and 95%
    }
    
    calculateMagneticSignature(enemy, distance) {
        let signature = 5; // Base magnetic signature
        
        // Larger submarines have stronger magnetic signatures
        if (enemy.specs && enemy.specs.displacement) {
            signature += (enemy.specs.displacement / 200); // Scale by displacement
        }
        
        // Distance reduces signature strength
        const distanceDecay = Math.max(0.1, 1 - (distance / this.qmadSystem.range));
        signature *= distanceDecay;
        
        // Add random variation
        signature += (Math.random() - 0.5) * 2;
        
        return Math.max(1, Math.min(10, Math.round(signature)));
    }
    
    classifyQMADContact(enemy, confidence) {
        if (confidence > 0.8) {
            // High confidence - can determine submarine class
            return enemy.submarineClass ? `${enemy.submarineClass}-CLASS` : 'SUBMARINE';
        } else if (confidence > 0.5) {
            // Medium confidence - know it's a submarine
            return 'SUBMARINE';
        } else {
            // Low confidence - just a magnetic anomaly
            return 'MAGNETIC ANOMALY';
        }
    }

    toggleQMADSystem() {
        this.qmadSystem.enabled = !this.qmadSystem.enabled;
        
        if (this.qmadSystem.enabled) {
            console.log('🧲 QMAD System ENABLED - Quantum Magnetic Anomaly Detection active');
            console.log(`   Range: ${this.qmadSystem.range}m | Sensitivity: ${this.qmadSystem.sensitivity} | Update Rate: ${this.qmadSystem.updateRate/1000}s`);
        } else {
            console.log('🧲 QMAD System DISABLED - Magnetic detection offline');
            this.qmadSystem.contacts = []; // Clear QMAD contacts
        }
        
        // Update display immediately
        this.cycleSonarContacts();
    }

    updateSonarContactsDisplay(contacts) {
        console.log(`📡 updateSonarContactsDisplay called with ${contacts.length} contacts`);
        const contactsList = document.getElementById('contactsList');
        const sonarStatus = document.getElementById('sonar');

        if (contactsList) {
            if (contacts.length === 0) {
                contactsList.innerHTML = 'No contacts detected';
            } else {
                let html = '';
                contacts.forEach((contact, index) => {
                    const isIdentified = contact.classification !== 'UNIDENTIFIED';
                    const isDecoy = contact.isDecoy || false;
                    const confidence = contact.confidence || 1.0;
                    const contactId = `contact-${index}`;
                    const isSelected = this.selectedSonarContact === index;
                    const isExpanded = this.expandedContacts && this.expandedContacts.has(index);

                    // Determine contact status based on signal strength
                    // Lower threshold for easier identification in passive mode
                    const signalThreshold = this.sonarMode === 'Passive' ? 4 : 6; // Easier in passive mode
                    let classification = contact.strength >= signalThreshold ?
                        (contact.classification || 'Identified') : 'Unidentified';
                    
                    // Enhance classification with QMAD data if available
                    if (contact.enhancedClassification || contact.isQMAD) {
                        if (contact.enhancedClassification) {
                            classification = contact.enhancedClassification;
                        }
                        if (contact.isQMAD) {
                            classification += ' [QMAD]';
                        }
                    }

                    html += `
                        <div class="contact ${isIdentified ? 'identified' : 'unidentified'} ${isDecoy ? 'decoy' : ''} ${isSelected ? 'selected' : ''}" 
                             data-contact-id="${index}" onclick="toggleContactDetails(${index})">
                            <div class="contact-header">
                                <span class="contact-expand-icon">${isExpanded ? '▼' : '▶'}</span>
                                ${classification}${isDecoy ? ' [DECOY]' : ''}
                                <span class="contact-distance">${contact.distance}m</span>
                            </div>
                            ${isExpanded ? `
                                <div class="contact-details expanded">
                                    Distance: ${contact.distance}m<br>
                                    Bearing: ${contact.bearing}°<br>
                                    Signal Strength: ${contact.strength}/10<br>
                                    ${contact.speed ? `Speed: ${contact.speed} kts<br>` : ''}
                                    ${contact.depth ? `Depth: ${contact.depth}m<br>` : ''}
                                    ${contact.course ? `Course: ${contact.course}°<br>` : ''}
                                    ${confidence < 1.0 ? `Confidence: ${Math.round(confidence * 100)}%<br>` : ''}
                                    ${contact.magneticSignature ? `Magnetic Signature: ${contact.magneticSignature}/10<br>` : ''}
                                    ${contact.qmadDetected ? `QMAD Enhancement: YES<br>` : ''}
                                    ${contact.interferenceAffected ? `QMAD Interference: HIGH<br>` : ''}
                                    Last Update: ${new Date(contact.lastUpdate).toLocaleTimeString()}
                                </div>
                            ` : ''}
                        </div>
                    `;
                });
                contactsList.innerHTML = html;
            }
        }

        if (sonarStatus) {
            const ghostCount = window.sealifeSystem ? window.sealifeSystem().ghostContacts.length : 0;
            const qmadCount = contacts.filter(c => c.isQMAD || c.qmadDetected).length;
            const qmadText = qmadCount > 0 ? ` | ${qmadCount} QMAD` : '';
            sonarStatus.textContent = `Mode: ${this.sonarMode} | ${contacts.length} contacts${ghostCount > 0 ? ` | ${ghostCount} ghosts` : ''}${qmadText}`;
        }
        
        // Store current contacts for TAB cycling
        this.currentSonarContacts = contacts;
        
        // Update 3D highlighting if a contact is selected
        this.updateSonarHighlighting();
    }
    
    cycleSonarContacts() {
        // Cycle through available sonar contacts with TAB key
        if (!this.currentSonarContacts || this.currentSonarContacts.length === 0) {
            this.selectedSonarContact = -1;
            console.log('🎯 No sonar contacts available to cycle through');
            return;
        }
        
        // Increment selection index (wraps around)
        this.selectedSonarContact = (this.selectedSonarContact + 1) % this.currentSonarContacts.length;
        
        const selectedContact = this.currentSonarContacts[this.selectedSonarContact];
        if (selectedContact) {
            console.log(`🎯 Selected contact ${this.selectedSonarContact + 1}/${this.currentSonarContacts.length}: ${selectedContact.classification} at ${selectedContact.distance}m, bearing ${selectedContact.bearing}°`);
        }
        
        // Force refresh the sonar display to show highlighting
        this.updateSonarContactsDisplay(this.currentSonarContacts);
    }
    
    updateSonarHighlighting() {
        // Remove existing highlight marker
        if (this.sonarHighlightMarker && this.sonarHighlightMarker.parent) {
            this.sonarHighlightMarker.parent.remove(this.sonarHighlightMarker);
            this.sonarHighlightMarker = null;
        }
        
        // Create new highlight marker if contact is selected
        if (this.selectedSonarContact >= 0 && this.currentSonarContacts[this.selectedSonarContact]) {
            const selectedContact = this.currentSonarContacts[this.selectedSonarContact];
            
            try {
                // Create a glowing highlight marker at the contact's position
                const highlightGeometry = new THREE.RingGeometry(8, 12, 16);
                const highlightMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
                
                this.sonarHighlightMarker = new THREE.Mesh(highlightGeometry, highlightMaterial);
                // Use mesh position if available, otherwise calculate from bearing/distance
                if (selectedContact.mesh) {
                    this.sonarHighlightMarker.position.copy(selectedContact.mesh.position);
                } else if (selectedContact.position) {
                    this.sonarHighlightMarker.position.copy(selectedContact.position);
                } else {
                    // Calculate position from bearing and distance
                    const bearingRad = (selectedContact.bearing * Math.PI) / 180;
                    const submarinePos = this.mesh.position;
                    this.sonarHighlightMarker.position.set(
                        submarinePos.x + Math.sin(bearingRad) * selectedContact.distance,
                        submarinePos.y,
                        submarinePos.z + Math.cos(bearingRad) * selectedContact.distance
                    );
                }
                this.sonarHighlightMarker.lookAt(this.mesh.position); // Face the submarine
                
                // Add to scene
                if (this.mesh && this.mesh.parent) {
                    this.mesh.parent.add(this.sonarHighlightMarker);
                }
                
                // Animate the highlight marker (pulsing effect)
                const animateHighlight = () => {
                    if (this.sonarHighlightMarker) {
                        const time = Date.now() * 0.005;
                        this.sonarHighlightMarker.material.opacity = 0.5 + 0.3 * Math.sin(time);
                        this.sonarHighlightMarker.rotation.z += 0.02;
                        requestAnimationFrame(animateHighlight);
                    }
                };
                animateHighlight();
                
            } catch (error) {
                console.warn('Failed to create sonar highlight marker:', error);
            }
        }
    }

    triggerSonarPingEffect() {
        // Add visual sonar ping effect
        const sonarPing = document.createElement('div');
        sonarPing.className = 'sonar-ping active';
        document.getElementById('gameContainer').appendChild(sonarPing);

        setTimeout(() => {
            sonarPing.remove();
        }, 2000);

        // Update HUD sonar status
        const sonarElement = document.getElementById('sonar');
        if (sonarElement) {
            sonarElement.style.color = '#00ff00';
            setTimeout(() => {
                sonarElement.style.color = '#00ffff';
            }, 1000);
        }
    }

    checkSeabedCollision(oldPosition) {
        if (!this.mesh) return;

        // Get ocean instance to check seabed height
        const oceanInstance = window.oceanInstance;
        if (!oceanInstance || !oceanInstance.getSeabedHeight) return;

        const currentPos = this.mesh.position;

        // CRITICAL SAFETY FIX: Only check collision for terrain within sensor range
        // This prevents collision with invisible terrain beyond sensor capabilities
        const sensorRange = oceanInstance.isActiveSonarActive ? oceanInstance.activeSonarRange : oceanInstance.passiveRange;
        const distanceToSubmarine = 0; // We're checking at submarine position

        // Only check collision if terrain should be visible to submarine's sensors
        if (distanceToSubmarine <= sensorRange) {
            const seabedHeight = oceanInstance.getSeabedHeight(currentPos.x, currentPos.z);
            const submarineBottom = currentPos.y - 2; // Submarine hull extends 2 units down
        
            // seabedHeight is negative (e.g. -1000m), submarineBottom should be above this
            // Collision occurs when submarine goes below (more negative than) seabed
            if (submarineBottom <= seabedHeight) {
                console.log(`🚨 SEABED COLLISION: Sub bottom=${submarineBottom.toFixed(1)}, Seabed height=${seabedHeight.toFixed(1)}, Sub Y=${currentPos.y.toFixed(1)}`);
                // Collision detected - calculate impact speed
                const impactSpeed = this.speed;
                const speedThreshold = 5; // Speed below which no damage occurs

                if (impactSpeed > speedThreshold) {
                    // Calculate damage based on speed
                    const damage = Math.floor((impactSpeed - speedThreshold) * 2);
                    this.takeDamage(damage);
                    console.log(`Seabed impact! Speed: ${impactSpeed.toFixed(1)}, Damage: ${damage}`);

                    // Show damage effect
                    this.triggerDamageEffect();
                }

                // Prevent submarine from going below seabed (push submarine above seabed)
                this.mesh.position.y = seabedHeight + 2;
                console.log(`Collision resolved: Sub moved to Y=${this.mesh.position.y.toFixed(1)} (seabed + 2)`);

                // Update depth display immediately after collision
                this.depth = this.mesh.position.y;
                this.speed *= 0.5; // Reduce speed after impact

                // Level out mouse pitch when hitting seabed
                this.mouse.pitch *= 0.8;

                // Update depth based on new position (surface is now at y=300)
                this.depth = Math.max(0, 300 - this.mesh.position.y);
            }
        }
    }

    triggerDamageEffect() {
        // Add visual damage effect
        const damageOverlay = document.createElement('div');
        damageOverlay.className = 'damage-overlay active';
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(damageOverlay);

            setTimeout(() => {
                damageOverlay.remove();
            }, 300);
        }
    }

    takeDamage(amount, hitLocation = 'fore') {
        // New directional damage system
        this.applyDirectionalDamage(amount, hitLocation);
    }

    applyDirectionalDamage(damage, facing) {
        // Step 1: Apply damage to armor on the hit facing
        const armor = this.armor[facing];
        const totalArmorHP = armor.oobleck + armor.metaMaterial;
        const penThreshold = this.armorPenThreshold;

        if (damage <= penThreshold) {
            // Damage only affects armor
            this.damageArmor(facing, damage);
        } else {
            // Damage penetrates - affects armor and internal systems
            this.damageArmor(facing, damage);
            const excessDamage = damage - Math.min(damage, totalArmorHP);

            if (excessDamage > 0) {
                this.applyInternalDamage(excessDamage, facing);
            }
        }

        this.updateHUD();
    }

    damageArmor(facing, damage) {
        const armor = this.armor[facing];
        let remainingDamage = damage;

        // First damage oobleck layer
        if (remainingDamage > 0 && armor.oobleck > 0) {
            const oobleckDamage = Math.min(remainingDamage, armor.oobleck);
            armor.oobleck -= oobleckDamage;
            remainingDamage -= oobleckDamage;
        }

        // Then damage meta-material layer
        if (remainingDamage > 0 && armor.metaMaterial > 0) {
            const metaDamage = Math.min(remainingDamage, armor.metaMaterial);
            armor.metaMaterial -= metaDamage;
            remainingDamage -= metaDamage;
        }
    }

    applyInternalDamage(damage, facing) {
        // Determine which system gets hit based on facing percentages from specifications
        const systemHitProbabilities = {
            fore: { navigation: 0.60, sensors: 0.40 },
            aft: { engines: 0.70, lifeSupport: 0.30 },
            port: { weapons: 0.50, navigation: 0.30, engines: 0.20 },
            starboard: { weapons: 0.50, navigation: 0.30, engines: 0.20 },
            top: { sensors: 0.50, lifeSupport: 0.30, navigation: 0.20 },
            bottom: { engines: 0.40, weapons: 0.40, lifeSupport: 0.20 }
        };

        // Select the system to hit based on probabilities
        const hitTable = systemHitProbabilities[facing];
        const randomValue = Math.random();
        let cumulativeProbability = 0;
        let targetSystem = 'hull'; // Default fallback

        for (const [systemName, probability] of Object.entries(hitTable)) {
            cumulativeProbability += probability;
            if (randomValue <= cumulativeProbability) {
                targetSystem = systemName;
                break;
            }
        }

        // Apply damage to the selected system
        const system = this.systems[targetSystem];
        let remainingDamage = damage;

        if (system && system.hp > 0) {
            if (remainingDamage <= system.penThreshold) {
                // Damage absorbed by this system
                system.hp -= remainingDamage;
                system.hp = Math.max(0, system.hp);
                remainingDamage = 0;
            } else {
                // Damage penetrates through this system
                const systemDamage = Math.min(remainingDamage, system.hp);
                system.hp -= systemDamage;
                remainingDamage -= systemDamage;
            }

            // Check for critical system failure
            this.checkSystemFailure(targetSystem);
        }

        // If damage remains, cascade to hull system
        if (remainingDamage > 0) {
            const hullSystem = this.systems.hull;
            if (hullSystem.hp > 0) {
                hullSystem.hp -= remainingDamage;
                hullSystem.hp = Math.max(0, hullSystem.hp);
                this.checkSystemFailure('hull');
            }
        }
    }

    checkSystemFailure(systemName) {
        const system = this.systems[systemName];

        if (system.hp <= 0) {
            switch(systemName) {
            case 'hull':
                this.implode();
                break;
            case 'lifeSupport':
                this.suffocate();
                break;
            default:
                console.log(`${systemName} system destroyed!`);
            }
        }
    }

    implode() {
        console.log('HULL BREACH - CATASTROPHIC IMPLOSION!');
        this.createImplosionEffect();
        this.destroy();
    }

    suffocate() {
        console.log('LIFE SUPPORT FAILURE - CREW SUFFOCATED!');
        this.destroy();
    }

    createImplosionEffect() {
        // Dramatic implosion visual effect
        if (this.mesh) {
            // Rapid shrinking animation
            const originalScale = this.mesh.scale.clone();
            let implosionTime = 0;

            const implodeAnimation = () => {
                implosionTime += 0.05;
                const scale = Math.max(0, 1 - implosionTime * 2);
                this.mesh.scale.setScalar(scale);

                if (scale > 0) {
                    setTimeout(implodeAnimation, 50);
                } else {
                    // Create shockwave effect
                    this.createShockwave();
                }
            };

            implodeAnimation();
        }
    }

    createShockwave() {
        // Create expanding shockwave sphere
        const shockwaveGeometry = new THREE.SphereGeometry(1, 16, 16);
        const shockwaveMaterial = new THREE.MeshBasicMaterial({
            color: 0x4488ff,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });

        const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial);
        shockwave.position.copy(this.mesh.position);
        this.scene.add(shockwave);

        // Animate shockwave expansion
        let expansionTime = 0;
        const expandShockwave = () => {
            expansionTime += 0.05;
            const scale = 1 + expansionTime * 10;
            const opacity = Math.max(0, 0.6 - expansionTime);

            shockwave.scale.setScalar(scale);
            shockwave.material.opacity = opacity;

            if (opacity > 0) {
                setTimeout(expandShockwave, 50);
            } else {
                this.scene.remove(shockwave);
                shockwave.geometry.dispose();
                shockwave.material.dispose();
            }
        };

        expandShockwave();
    }

    updateOobleckRedistribution(deltaTime) {
        // Automatic oobleck armor redistribution - 1% per second
        const redistributionAmount = (this.oobleckRedistributionRate / 100) * 50 * deltaTime; // 50 is max oobleck per facing

        const facings = ['fore', 'port', 'starboard', 'aft', 'top', 'bottom'];

        // Calculate total oobleck and average
        let totalOobleck = 0;
        facings.forEach(facing => {
            totalOobleck += this.armor[facing].oobleck;
        });
        const averageOobleck = totalOobleck / facings.length;

        // Redistribute from high to low
        facings.forEach(facing => {
            const armor = this.armor[facing];
            const difference = armor.oobleck - averageOobleck;

            if (Math.abs(difference) > 0.1) { // Only redistribute if meaningful difference
                const redistributeAmount = Math.min(redistributionAmount, Math.abs(difference));

                if (difference > 0) {
                    // This facing has more than average - give some away
                    armor.oobleck -= redistributeAmount;

                    // Find facing with least oobleck to give to
                    let lowestFacing = facings[0];
                    facings.forEach(checkFacing => {
                        if (this.armor[checkFacing].oobleck < this.armor[lowestFacing].oobleck) {
                            lowestFacing = checkFacing;
                        }
                    });

                    if (lowestFacing !== facing) {
                        this.armor[lowestFacing].oobleck += redistributeAmount;
                        this.armor[lowestFacing].oobleck = Math.min(50, this.armor[lowestFacing].oobleck); // Cap at max
                    }
                }
            }
        });
    }

    emergencyArmorRedistribution(targetFacing) {
        // Double-tap armor redistribution - double target facing by taking from 4 adjacent
        const adjacentFacings = this.getAdjacentFacings(targetFacing);
        const targetArmor = this.armor[targetFacing];
        const currentOobleck = targetArmor.oobleck;
        const doubleAmount = Math.min(50, currentOobleck * 2); // Cap at max armor
        const redistributeAmount = doubleAmount - currentOobleck;
        const perFacingAmount = redistributeAmount / adjacentFacings.length;

        // Check if we can redistribute (don't drain facings below 10)
        let canRedistribute = true;
        adjacentFacings.forEach(facing => {
            if (this.armor[facing].oobleck - perFacingAmount < 10) {
                canRedistribute = false;
            }
        });

        if (canRedistribute) {
            // Perform redistribution
            targetArmor.oobleck = doubleAmount;

            adjacentFacings.forEach(facing => {
                this.armor[facing].oobleck -= perFacingAmount;
                this.armor[facing].oobleck = Math.max(0, this.armor[facing].oobleck);
            });

            console.log(`Emergency armor redistribution: ${targetFacing} doubled!`);
            return true;
        } else {
            console.log('Cannot redistribute armor - adjacent facings too damaged!');
            return false;
        }
    }

    getAdjacentFacings(facing) {
        const adjacencyMap = {
            fore: ['port', 'starboard', 'top', 'bottom'],
            aft: ['port', 'starboard', 'top', 'bottom'],
            port: ['fore', 'aft', 'top', 'bottom'],
            starboard: ['fore', 'aft', 'top', 'bottom'],
            top: ['fore', 'aft', 'port', 'starboard'],
            bottom: ['fore', 'aft', 'port', 'starboard']
        };

        return adjacencyMap[facing] || [];
    }

    determineHitFacing(impactPosition, projectileDirection) {
        // Determine which armor facing should take damage based on impact angle
        if (!this.mesh) return 'fore'; // Default fallback

        // Get submarine's local coordinate system
        const submarinePosition = this.mesh.position.clone();
        const submarineRotation = this.mesh.quaternion.clone();

        // Convert impact position to submarine's local coordinate system
        const localImpactPosition = impactPosition.clone().sub(submarinePosition);
        localImpactPosition.applyQuaternion(submarineRotation.invert());

        // Determine facing based on which direction has the largest component
        const absX = Math.abs(localImpactPosition.x);
        const absY = Math.abs(localImpactPosition.y);
        const absZ = Math.abs(localImpactPosition.z);

        let hitFacing = 'fore'; // Default

        // Find the dominant axis and direction
        if (absX > absY && absX > absZ) {
            // Hit from front or rear
            hitFacing = localImpactPosition.x > 0 ? 'fore' : 'aft';
        } else if (absY > absX && absY > absZ) {
            // Hit from top or bottom
            hitFacing = localImpactPosition.y > 0 ? 'top' : 'bottom';
        } else if (absZ > absX && absZ > absY) {
            // Hit from left or right
            hitFacing = localImpactPosition.z > 0 ? 'starboard' : 'port';
        }

        return hitFacing;
    }

    getSubmarineHitbox() {
        // Return submarine bounding box for collision detection
        if (!this.mesh) return null;

        // Create a bounding box around the submarine
        const box = new THREE.Box3();
        box.setFromObject(this.mesh);

        return {
            box: box,
            center: this.mesh.position.clone(),
            rotation: this.mesh.quaternion.clone()
        };
    }

    handleEmergencyArmorRedistribution(facing) {
        const currentTime = Date.now();
        const keyCode = `armor_${facing}`;

        // Check cooldown (5 seconds per facing)
        if (this.armorRedistributionCooldown[facing] &&
            (currentTime - this.armorRedistributionCooldown[facing]) < 5000) {
            console.log(`${facing} armor redistribution on cooldown!`);
            return;
        }

        // Check for double-tap
        if (this.lastKeyPress[keyCode] &&
            (currentTime - this.lastKeyPress[keyCode]) < this.doubleTapDelay) {
            // Double-tap detected - perform emergency redistribution
            if (this.emergencyArmorRedistribution(facing)) {
                this.armorRedistributionCooldown[facing] = currentTime;
                console.log(`Emergency armor redistribution: ${facing} facing reinforced!`);
            }
        }

        this.lastKeyPress[keyCode] = currentTime;
    }

    updateSystemPerformance() {
        // Apply performance penalties based on system HP loss

        // Engine damage - reduce max speed
        const engineEfficiency = this.systems.engines.hp / this.systems.engines.maxHP;
        this.effectiveMaxSpeed = this.maxSpeed * engineEfficiency;
        this.effectiveMaxReverseSpeed = this.maxReverseSpeed * engineEfficiency;

        // Navigation damage - reduce turn rates
        const navEfficiency = this.systems.navigation.hp / this.systems.navigation.maxHP;
        this.effectiveTurnRate = this.turnRate * navEfficiency;
        this.effectivePitchRate = this.pitchRate * navEfficiency;
        this.effectiveRollRate = this.rollRate * navEfficiency;

        // Weapons damage - reduce reload speed (handled in weapons system)
        this.weaponsEfficiency = this.systems.weapons.hp / this.systems.weapons.maxHP;

        // Sensors damage - reduce detection range and sonar effectiveness
        this.sensorsEfficiency = this.systems.sensors.hp / this.systems.sensors.maxHP;
        this.effectiveSonarRange = this.sensorsEfficiency; // Multiplier for sonar range

        // Life support damage - no performance impact until death
        // Hull damage - no performance impact until implosion
    }

    updateCrushDepthDamage(deltaTime) {
        // Get current depth (negative values for underwater)
        const currentDepth = Math.abs(this.mesh.position.y);

        // Get submarine crush depth from specifications
        const crushDepth = this.maxDepth || 500; // Use this.maxDepth which is set from specs.crushDepth

        // WARNING: Check if approaching maximum depth (within 10% of crush depth)
        const warningThreshold = crushDepth * 0.9; // 90% of crush depth
        if (currentDepth >= warningThreshold && currentDepth < crushDepth) {
            const depthRemaining = crushDepth - currentDepth;
            const percentRemaining = ((crushDepth - currentDepth) / (crushDepth - warningThreshold)) * 100;
            
            // Show warning message periodically (every 2 seconds)
            if (!this.lastCrushDepthWarning || Date.now() - this.lastCrushDepthWarning > 2000) {
                this.showStatusMessage(
                    `⚠️ APPROACHING MAXIMUM DEPTH! ${Math.round(depthRemaining)}m remaining (${Math.round(percentRemaining)}% margin)`,
                    'warning'
                );
                this.lastCrushDepthWarning = Date.now();
                
                // Play warning sound
                if (this.audioManager && this.audioManager.playHullStress) {
                    this.audioManager.playHullStress();
                }
            }
        }

        // DAMAGE: Check if below crush depth
        if (currentDepth > crushDepth) {
            const depthExcess = currentDepth - crushDepth;

            // Base damage rate: 1% hull HP per second at crush depth
            // Increases with depth excess (the further below, the greater the damage)
            const baseDamageRate = 0.01; // 1% per second at crush depth
            const depthMultiplier = 1 + (depthExcess / 100); // +1% per meter below crush depth
            
            // Example: At crushDepth+50m, multiplier = 1.5 (50% more damage)
            // Example: At crushDepth+100m, multiplier = 2.0 (100% more damage)

            // Calculate damage per second with random variation (±20%)
            const randomVariation = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2 multiplier
            const damagePerSecond = baseDamageRate * depthMultiplier * randomVariation;

            // Apply damage to hull system every second
            const damageAmount = damagePerSecond * this.systems.hull.maxHP * deltaTime;
            this.systems.hull.hp = Math.max(0, this.systems.hull.hp - damageAmount);

            // Warning messages and hull stress audio
            if (this.systems.hull.hp <= 0) {
                this.showStatusMessage('💥 HULL IMPLOSION! Submarine destroyed by crushing pressure!', 'critical');
                console.log('💥 HULL IMPLOSION! Submarine destroyed by crushing pressure!');
                // Trigger submarine destruction
                this.triggerImplosion();
            } else if (currentDepth > crushDepth + 50) {
                // Critical depth - play hull stress sounds more frequently
                if (!this.lastHullStressSound || Date.now() - this.lastHullStressSound > 2000) {
                    if (this.audioManager && this.audioManager.playHullStress) {
                        this.audioManager.playHullStress();
                    }
                    this.lastHullStressSound = Date.now();
                }
                // Show critical warning every second
                if (!this.lastCriticalDepthWarning || Date.now() - this.lastCriticalDepthWarning > 1000) {
                    this.showStatusMessage(
                        `🌊 CRITICAL DEPTH! ${Math.round(depthExcess)}m over limit - Taking ${(damagePerSecond * 100).toFixed(1)}% hull damage/sec`,
                        'critical'
                    );
                    this.lastCriticalDepthWarning = Date.now();
                }
                console.warn(`🌊 CRITICAL DEPTH! Hull taking ${(damagePerSecond * 100).toFixed(1)}% damage/sec at ${currentDepth.toFixed(0)}m`);
            } else {
                // Normal crush depth damage - play hull stress sounds occasionally
                if (!this.lastHullStressSound || Date.now() - this.lastHullStressSound > 5000) {
                    if (this.audioManager && this.audioManager.playHullStress) {
                        this.audioManager.playHullStress();
                    }
                    this.lastHullStressSound = Date.now();
                }
                // Show warning every 2 seconds
                if (!this.lastCrushDepthWarning || Date.now() - this.lastCrushDepthWarning > 2000) {
                    this.showStatusMessage(
                        `⚠️ EXCEEDING MAXIMUM DEPTH! ${Math.round(depthExcess)}m over limit - Taking ${(damagePerSecond * 100).toFixed(1)}% hull damage/sec`,
                        'warning'
                    );
                    this.lastCrushDepthWarning = Date.now();
                }
                console.warn(`⚠️ Below crush depth! Hull damage at ${currentDepth.toFixed(0)}m (crush: ${crushDepth}m)`);
            }
        } else {
            // Reset warning timers when safe
            this.lastCrushDepthWarning = 0;
            this.lastCriticalDepthWarning = 0;
        }
    }

    triggerImplosion() {
        // Handle submarine implosion due to crush depth
        this.isDestroyed = true;
        this.speed = 0;
        
        // Clean up audio systems
        if (this.audioManager) {
            this.audioManager.dispose();
        }
        this.targetSpeed = 0;

        // Visual effect could be added here
        console.log('🔥 Submarine imploded due to excessive depth pressure!');

        // Reset to surface or respawn logic could go here
        this.mesh.position.y = -10; // Emergency surface
        this.systems.hull.hp = this.systems.hull.maxHP * 0.1; // 10% hull remaining
    }

    getEffectiveMaxSpeed() {
        // Return speed limited by engine damage and towed array
        let speed = this.effectiveMaxSpeed || this.maxSpeed;
        if (this.towedArray.deployed) {
            speed *= this.towedArray.speedPenalty;
        }
        return speed;
    }

    getEffectiveTurnRate() {
        // Return turn rate affected by navigation damage, speed, and piloting skill
        const baseRate = this.effectiveTurnRate || this.baseTurnRate;
        const speedFactor = Math.abs(this.speed) / this.maxSpeed;
        const skillBonus = this.getPilotingSkillModifier();
        return baseRate * (1 - speedFactor * this.turnRateDecay) * skillBonus;
    }

    getEffectiveRollRate() {
        // Return roll rate affected by navigation damage and piloting skill
        const baseRate = this.effectiveRollRate || this.rollRate;
        const skillBonus = this.getPilotingSkillModifier();
        return baseRate * skillBonus;
    }

    getEffectivePitchRate() {
        // Return pitch rate affected by navigation damage and piloting skill
        const baseRate = this.effectivePitchRate || this.pitchRate;
        const skillBonus = this.getPilotingSkillModifier();
        return baseRate * skillBonus;
    }

    getPilotingSkillModifier() {
        // Piloting skill 1-10, with 5 being baseline (1.0x)
        // Skill 1 = 0.8x, Skill 5 = 1.0x, Skill 10 = 1.4x
        return 0.8 + (this.skills.piloting - 1) * 0.067; // ~6.7% per skill level
    }

    getGunnerySkillModifier() {
        // Gunnery skill affects lock-on speed
        // Skill 1 = 0.7x lock speed, Skill 5 = 1.0x, Skill 10 = 1.6x
        return 0.7 + (this.skills.gunnery - 1) * 0.1; // 10% per skill level
    }

    getEngineeringSkillModifier() {
        // Engineering skill affects repair speed
        // Skill 1 = 0.5x repair speed, Skill 5 = 1.0x, Skill 10 = 2.0x
        return 0.5 + (this.skills.engineering - 1) * 0.167; // ~16.7% per skill level
    }

    getSensorSkillModifier() {
        // Sensor skill affects passive sonar detection range and sensitivity
        // Skill 1 = 0.8x detection range, Skill 5 = 1.0x, Skill 10 = 1.4x
        return 0.8 + (this.skills.sensors - 1) * 0.067; // ~6.7% per skill level
    }

    updateSonarSignature(deltaTime) {
        // SIMPLIFIED LINEAR NOISE SYSTEM
        // Base noise signature for this submarine class
        let totalNoise = this.sonarSignature.base;
        
        // 1. LINEAR SPEED RELATIONSHIP
        const currentSpeed = Math.abs(this.speed);
        const speedNoise = currentSpeed * 0.1; // 0.1 noise per knot
        totalNoise += speedNoise;
        
        // 2. SUPERCAVITATION JUMP AT >50 KNOTS
        if (currentSpeed > 50) {
            totalNoise += 15; // Sudden jump for supercavitation
        }
        
        // 3. TURN-BASED NOISE (tighter turn = more noise)
        const turnNoise = Math.min(this.turnRate * 0.2, 10); // Max 10 noise from turning
        totalNoise += turnNoise;
        
        // 4. KNUCKLE NOISE MASKING
        if (this.knuckleNoiseReduction > 0) {
            totalNoise *= (1 - this.knuckleNoiseReduction); // Reduce noise after knuckle creation
            this.knuckleNoiseReduction -= deltaTime * 0.5; // Fade over 2 seconds
            if (this.knuckleNoiseReduction <= 0) {
                this.knuckleNoiseReduction = 0;
            }
        }

        // 5. THERMAL LAYER HIDING
        if (this.thermalLayers.isHidden) {
            totalNoise *= (1 - this.thermalLayers.sonarReduction);
        }

        // 6. BOTTOM BOUNCING
        if (this.bottomBouncing.isActive && this.bottomBouncing.bounceTimer > 0) {
            totalNoise *= (1 - this.bottomBouncing.sonarReduction);
        }
        
        // 7. TORPEDO LAUNCH SIGNATURE SPIKE
        if (this.torpedoLaunchSignature.active) {
            totalNoise *= (this.currentLaunchSignatureMultiplier || 1.0);
        }

        // Set current signature (no smoothing for immediate response)
        this.sonarSignature.current = totalNoise;
    }

    triggerWeaponsFire() {
        // Called when kinetic weapons are fired
        this.sonarSignature.timers.weaponsFire = 3000; // 3 seconds
    }

    triggerTorpedoLaunch() {
        // Called when torpedoes are launched
        this.sonarSignature.timers.torpedoLaunch = 5000; // 5 seconds
    }

    triggerSonarPing() {
        // Called when active sonar is used
        this.sonarSignature.timers.sonarPing = 2000; // 2 seconds
    }

    getSonarSignature() {
        // Get current total sonar signature
        return this.sonarSignature.current;
    }

    getSonarDetectionRange(targetSignature, targetPosition = null) {
        // Calculate detection range based on target's signature and our sensor efficiency
        const baseRange = 200; // DOUBLED: Base detection range in meters (was 100)
        const sensorMultiplier = this.sensorsEfficiency || 1;
        const signatureMultiplier = Math.sqrt(targetSignature / 10); // Square root scaling
        const skillMultiplier = this.getSensorSkillModifier(); // Pilot sensor skill bonus

        let finalRange = baseRange * sensorMultiplier * signatureMultiplier * skillMultiplier;

        // Apply wake shadow and aspect angle effects if target position is provided
        if (targetPosition && this.mesh) {
            const wakeAspectModifier = this.calculateWakeAndAspectEffects(targetPosition);
            finalRange *= wakeAspectModifier;
        }

        return finalRange;
    }

    calculateWakeAndAspectEffects(targetPosition) {
        // Calculate wake shadow and aspect angle effects on sonar detection
        const submarinePos = this.mesh.position;
        const submarineForward = new THREE.Vector3(1, 0, 0);
        submarineForward.applyQuaternion(this.mesh.quaternion);

        // Vector from submarine to target
        const toTarget = targetPosition.clone().sub(submarinePos).normalize();

        // Calculate aspect angle (0 = dead ahead, 1 = beam, -1 = dead astern)
        const aspectAngle = submarineForward.dot(toTarget);

        // WAKE SHADOW EFFECT
        // Targets directly behind submarine (in wake) are much harder to detect
        const isInWake = aspectAngle < -0.7; // Within ~45 degrees of directly astern

        if (isInWake) {
            const distance = submarinePos.distanceTo(targetPosition);
            const submarineLength = 28; // Typhoon length in meters

            // Wake shadow extends several submarine lengths behind
            const wakeLength = submarineLength * 8; // 8x submarine length (~224m for Typhoon)

            if (distance < wakeLength) {
                // Strong wake shadow - detection range severely reduced
                const wakeShadowFactor = 0.2; // 80% reduction in detection range
                return wakeShadowFactor;
            }
        }

        // ASPECT ANGLE EFFECTS
        // Beam aspect (side) = best detection, bow/stern = reduced detection
        let aspectModifier = 1.0;

        if (aspectAngle > 0.8) {
            // Target is ahead (bow aspect) - slightly reduced detection due to flow noise
            aspectModifier = 0.85;
        } else if (aspectAngle < -0.3) {
            // Target is behind (stern aspect) - reduced detection due to engine noise and wake
            aspectModifier = 0.7;
        } else {
            // Target is on beam (side) - optimal detection
            aspectModifier = 1.1; // 10% bonus for beam aspect
        }

        return aspectModifier;
    }

    repair(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
        this.updateHUD();
    }

    updateArmorDisplay() {
        // Update armor facing displays (create elements if they don't exist)
        const facings = ['fore', 'port', 'starboard', 'aft', 'top', 'bottom'];

        facings.forEach(facing => {
            const elementId = `armor-${facing}`;
            let element = document.getElementById(elementId);

            if (!element) {
                // Create armor display element
                element = document.createElement('div');
                element.id = elementId;
                element.style.cssText = `
                    position: absolute;
                    font-size: 10px;
                    color: #00ffff;
                    font-family: monospace;
                    background: rgba(0,0,0,0.7);
                    padding: 2px;
                    border: 1px solid #00ffff;
                `;
                document.body.appendChild(element);
            }

            const armor = this.armor[facing];
            const totalArmor = armor.oobleck + armor.metaMaterial;
            const maxArmor = armor.maxHP;
            const percentage = Math.round((totalArmor / maxArmor) * 100);

            element.textContent = `${facing.toUpperCase()}: ${percentage}% (O:${Math.round(armor.oobleck)} M:${Math.round(armor.metaMaterial)})`;

            // Color code based on damage
            let color = '#00ffff'; // Cyan for healthy
            if (percentage < 75) color = '#ffff00'; // Yellow for damaged
            if (percentage < 50) color = '#ff8800'; // Orange for heavily damaged
            if (percentage < 25) color = '#ff0000'; // Red for critical

            element.style.color = color;
        });

        // Position armor displays around screen edges
        const positions = {
            fore: { top: '10px', left: '50%', transform: 'translateX(-50%)' },
            aft: { bottom: '50px', left: '50%', transform: 'translateX(-50%)' },
            port: { top: '50%', left: '10px', transform: 'translateY(-50%)' },
            starboard: { top: '50%', right: '10px', transform: 'translateY(-50%)' },
            top: { top: '30px', right: '10px' },
            bottom: { bottom: '70px', right: '10px' }
        };

        facings.forEach(facing => {
            const element = document.getElementById(`armor-${facing}`);
            if (element) {
                Object.assign(element.style, positions[facing]);
            }
        });
    }

    updateSystemsDisplay() {
        // Update internal systems display
        const systems = ['hull', 'engines', 'weapons', 'sensors', 'lifeSupport', 'navigation'];

        systems.forEach((systemName, index) => {
            const elementId = `system-${systemName}`;
            let element = document.getElementById(elementId);

            if (!element) {
                // Create system display element
                element = document.createElement('div');
                element.id = elementId;
                element.style.cssText = `
                    position: absolute;
                    left: 10px;
                    top: ${100 + index * 25}px;
                    font-size: 11px;
                    color: #00ff00;
                    font-family: monospace;
                    background: rgba(0,0,0,0.7);
                    padding: 2px;
                    border: 1px solid #00ff00;
                    width: 150px;
                `;
                document.body.appendChild(element);
            }

            const system = this.systems[systemName];
            const percentage = Math.round((system.hp / system.maxHP) * 100);

            element.textContent = `${systemName.toUpperCase()}: ${percentage}% (${Math.round(system.hp)}/${system.maxHP})`;

            // Color code based on damage
            let color = '#00ff00'; // Green for healthy
            if (percentage < 75) color = '#ffff00'; // Yellow for damaged
            if (percentage < 50) color = '#ff8800'; // Orange for heavily damaged
            if (percentage < 25) color = '#ff0000'; // Red for critical

            element.style.color = color;

            // Special highlighting for critical systems
            if (systemName === 'hull' && percentage < 50) {
                element.style.animation = 'blink 1s infinite';
            }
            if (systemName === 'lifeSupport' && percentage < 25) {
                element.style.animation = 'blink 0.5s infinite';
            }
        });
    }

    updateSonarSignatureDisplay() {
        // Create visual sonar signature indicator
        let signatureElement = document.getElementById('sonar-signature');

        if (!signatureElement) {
            signatureElement = document.createElement('div');
            signatureElement.id = 'sonar-signature';
            signatureElement.style.cssText = `
                position: absolute;
                top: 10px;
                right: 200px;
                font-size: 14px;
                font-family: monospace;
                background: rgba(0,0,0,0.8);
                padding: 8px;
                border: 2px solid #00ff00;
                border-radius: 5px;
                text-align: center;
                min-width: 120px;
            `;
            document.body.appendChild(signatureElement);
        }

        const currentSignature = this.getSonarSignature();
        const averageEnemyDetectionThreshold = 15; // Average enemy detection baseline

        // Create stealth level categories
        let stealthLevel, color, symbol, description;

        if (currentSignature <= 3) {
            stealthLevel = 'GHOST';
            color = '#0066ff';
            symbol = '◊';
            description = 'Nearly invisible';
        } else if (currentSignature <= 6) {
            stealthLevel = 'SILENT';
            color = '#0099ff';
            symbol = '◊◊';
            description = 'Very quiet';
        } else if (currentSignature <= 10) {
            stealthLevel = 'QUIET';
            color = '#00ccff';
            symbol = '◊◊◊';
            description = 'Detectable up close';
        } else if (currentSignature <= 15) {
            stealthLevel = 'NORMAL';
            color = '#ffff00';
            symbol = '▲';
            description = 'Standard signature';
        } else if (currentSignature <= 25) {
            stealthLevel = 'LOUD';
            color = '#ff8800';
            symbol = '▲▲';
            description = 'Easily detectable';
        } else if (currentSignature <= 40) {
            stealthLevel = 'NOISY';
            color = '#ff4400';
            symbol = '▲▲▲';
            description = 'Very loud';
        } else {
            stealthLevel = 'BEACON';
            color = '#ff0000';
            symbol = '████';
            description = 'Maximum signature';
        }

        // Calculate approximate detection range for average enemy
        const detectionRange = Math.round(averageEnemyDetectionThreshold * Math.sqrt(currentSignature / 10));

        // Show active modifiers
        const activeModifiers = [];
        const modifiers = this.sonarSignature.modifiers;

        if (modifiers.acceleration > 0) activeModifiers.push('ACCEL');
        if (modifiers.maneuvering > 0) activeModifiers.push('TURN');
        if (modifiers.dragTurn > 0) activeModifiers.push('DRAG');
        if (modifiers.weaponsFire > 0) activeModifiers.push('GUNS');
        if (modifiers.torpedoLaunch > 0) activeModifiers.push('TORP');
        if (modifiers.sonarPing > 0) activeModifiers.push('PING');
        if (modifiers.cavitation > 0) activeModifiers.push('CAVIT');
        if (modifiers.surfacePenalty > 0) activeModifiers.push('SURF');

        const modifierText = activeModifiers.length > 0 ? `\n[${activeModifiers.join(' ')}]` : '';

        signatureElement.innerHTML = `
            <div style="color: ${color}; font-size: 16px; font-weight: bold;">
                ${symbol} ${stealthLevel} ${symbol}
            </div>
            <div style="color: #ffffff; font-size: 11px; margin-top: 2px;">
                ${description}
            </div>
            <div style="color: #cccccc; font-size: 10px; margin-top: 2px;">
                Signature: ${currentSignature.toFixed(1)}
            </div>
            <div style="color: #ffcccc; font-size: 10px;">
                Det Range: ~${detectionRange}m
            </div>
            <div style="color: #ff8888; font-size: 9px;">
                ${modifierText}
            </div>
        `;

        // Add pulsing animation for high signatures
        if (currentSignature > 25) {
            signatureElement.style.animation = 'pulse 1s infinite';
        } else {
            signatureElement.style.animation = 'none';
        }
    }

    cycleSelectedSonarContact() {
        // Rate limiting - prevent rapid Tab spamming
        const currentTime = Date.now();
        if (currentTime - this.lastTabTime < 200) { // 200ms cooldown
            return;
        }
        this.lastTabTime = currentTime;

        // Get current sonar contacts
        const sealifeSystem = window.sealifeSystem();
        if (!sealifeSystem) return;

        const sonarContacts = sealifeSystem.getSonarContacts();
        const qmadContacts = this.performQMADScan();
        
        // Combine sonar and QMAD contacts, avoiding duplicates
        const contacts = [...sonarContacts];
        qmadContacts.forEach(qmadContact => {
            // Check if this QMAD contact corresponds to an existing sonar contact
            const existingSonar = contacts.find(sonar => 
                Math.abs(sonar.distance - qmadContact.distance) < 100 && 
                Math.abs(sonar.bearing - qmadContact.bearing) < 15
            );
            
            if (!existingSonar) {
                // Add unique QMAD contact
                contacts.push(qmadContact);
            } else {
                // Enhance existing sonar contact with QMAD data
                existingSonar.qmadDetected = true;
                existingSonar.magneticSignature = qmadContact.strength;
                if (qmadContact.confidence > 0.6) {
                    existingSonar.enhancedClassification = qmadContact.classification;
                }
            }
        });
        if (contacts.length === 0) {
            this.selectedSonarContact = -1;
            return;
        }

        // Cycle to next contact
        this.selectedSonarContact = (this.selectedSonarContact + 1) % contacts.length;

        // Start automatic lock-on for selected contact
        const selectedContact = contacts[this.selectedSonarContact];
        if (selectedContact && this.selectedLauncher > 0) {
            const currentTorpedoCode = this.getCurrentTorpedoCode(this.selectedLauncher);
            if (currentTorpedoCode && currentTorpedoCode !== '') {
                this.startContactLockOn(selectedContact);
            }
        }

        console.log(`Selected sonar contact ${this.selectedSonarContact + 1}/${contacts.length}`);

        // Force update display
        this.updateSonarContactsDisplay(contacts);
    }

    startContactLockOn(contact) {
        if (!contact) return;

        const currentTorpedoCode = this.getCurrentTorpedoCode(this.selectedLauncher);
        if (!currentTorpedoCode || currentTorpedoCode === '') return;

        const torpedoType = this.getFullTorpedoType(currentTorpedoCode);
        const torpedoSpec = TORPEDO_SPECIFICATIONS[torpedoType];

        // Calculate distance from contact to screen center (reticle position)
        const contactDistance = this.calculateContactDistanceFromReticle(contact);

        // Base lock time from torpedo specs
        const baseLockTime = this.sonarMode === 'Active' ?
            torpedoSpec.lockTime : torpedoSpec.passiveLockTime;

        // Distance modifier: faster lock when near center, slower at edges
        const distanceModifier = Math.max(0.5, Math.min(2.0, 1.0 + contactDistance));

        // Sonar signature modifier: stronger signatures lock faster
        const signatureModifier = Math.max(0.5, Math.min(1.5, contact.strength / 10));

        // Apply gunnery skill modifier to lock time
        const gunneryBonus = this.getGunnerySkillModifier();

        // Calculate final lock time (gunnery skill reduces lock time)
        const finalLockTime = (baseLockTime * distanceModifier / signatureModifier) / gunneryBonus;

        this.torpedoLockSystem = {
            target: contact,
            lockProgress: 0,
            lockStartTime: Date.now(),
            isLocked: false,
            lockTime: finalLockTime,
            originalLockTime: baseLockTime
        };

        console.log(`Starting lock-on: Base ${baseLockTime/1000}s, Final ${finalLockTime/1000}s (Dist: ${distanceModifier.toFixed(2)}x, Sig: ${signatureModifier.toFixed(2)}x)`);
    }

    calculateContactDistanceFromReticle(contact) {
        // For now, use a simple approximation based on bearing
        // In a real implementation, this would use 3D positioning
        const centerBearing = 0; // Straight ahead
        const bearingDiff = Math.abs(contact.bearing - centerBearing);
        const normalizedDistance = bearingDiff / 180; // 0-1, where 1 is max distance
        return normalizedDistance;
    }

    deployMine() {
        // Check if submarine has mine laying capability
        const specs = SUBMARINE_SPECIFICATIONS[this.submarineClass];
        if (!specs.hasMineLayer) {
            console.log(`${this.submarineClass} does not have mine laying capability`);
            return;
        }

        // Check if we have mines available (simplified - could add mine storage later)
        if (!this.mineCount || this.mineCount <= 0) {
            console.log('No mines remaining');
            return;
        }

        // Deploy mine at current position
        const currentPos = this.getPosition();
        const mine = {
            id: `mine_${Date.now()}`,
            position: currentPos.clone(),
            depth: currentPos.y, // Store depth
            deployTime: Date.now(),
            classification: 'Mine (Friendly)',
            distance: 0, // Will be calculated relative to submarine
            bearing: 0,
            strength: 10, // Always max strength since it's our mine
            isDecoy: false,
            isMine: true,
            isIdentified: true,
            lastUpdate: Date.now(),
            // Mine-specific properties for collision and explosion
            isActive: true,
            activationDelay: 3000, // 3 second activation delay after deployment
            detectionRadius: 50, // 50m detection radius
            explosionRadius: 30, // 30m damage radius
            damage: 150, // High damage potential
            ownerClass: this.submarineClass, // Track who deployed it
            isEnemyMine: false // Friendly mine
        };

        // Add mine to sonar contacts immediately (friendly mines are always identified)
        const sealifeSystem = window.sealifeSystem();
        if (sealifeSystem) {
            // Add to sonar contacts directly
            sealifeSystem.sonarContacts.push(mine);
            console.log(`Mine deployed at position (${currentPos.x.toFixed(1)}, ${currentPos.y.toFixed(1)}, ${currentPos.z.toFixed(1)})`);
        }

        // Decrement mine count
        this.mineCount--;
        console.log(`Mine deployed. Mines remaining: ${this.mineCount}`);
    }

    deployNoisemaker() {
        // Check if we have noisemakers available
        if (!this.countermeasures.noisemakers || this.countermeasures.noisemakers <= 0) {
            console.log('No noisemakers remaining');
            return;
        }

        // Deploy noisemaker at current position with slight offset
        const currentPos = this.getPosition();
        const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 20, // Random X offset
            0, 
            (Math.random() - 0.5) * 20  // Random Z offset
        );
        
        const noisemakerPos = currentPos.clone().add(offset);
        
        const noisemaker = {
            id: `noisemaker_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            position: noisemakerPos,
            depth: currentPos.y,
            deployTime: Date.now(),
            lifetime: 120000, // 2 minutes active time
            classification: 'NOISEMAKER',
            distance: 0, 
            bearing: 0,
            strength: 8, // High acoustic signature
            noiseSignature: 8,
            isDecoy: true,
            isNoisemaker: true,
            isIdentified: false,
            lastUpdate: Date.now(),
            // Noisemaker specific properties
            cycleTime: 3000, // 3 second noise burst cycle
            burstDuration: 1500, // 1.5 second noise bursts
            nextCycle: Date.now() + 1000 // Start first cycle after 1 second
        };

        // Add to weapons system for tracking
        if (window.weaponsSystem && window.weaponsSystem.addCountermeasure) {
            window.weaponsSystem.addCountermeasure(noisemaker);
        }

        this.countermeasures.noisemakers--;
        console.log(`Noisemaker deployed. Noisemakers remaining: ${this.countermeasures.noisemakers}`);
    }
    
    updateThreatWarningSystem(deltaTime) {
        const currentTime = Date.now();
        
        // Update incoming torpedo threats
        this.updateIncomingTorpedoThreats(currentTime);
        
        // Update active sonar threats
        this.updateActiveSonarThreats(currentTime);
        
        // Calculate overall threat level
        this.calculateThreatLevel();
        
        // Update visual and audio warnings
        this.updateWarningIndicators(deltaTime, currentTime);
    }
    
    updateIncomingTorpedoThreats(currentTime) {
        // Get all active torpedoes from weapons system
        const allTorpedoes = window.weaponsSystem?.getAllTorpedoes ? window.weaponsSystem.getAllTorpedoes() : [];
        
        this.threatWarning.incomingTorpedoes = allTorpedoes.filter(torpedo => {
            if (!torpedo.target || !torpedo.position) return false;
            
            // Check if torpedo is targeting this submarine
            const isTargetingUs = torpedo.target === this || 
                                  (torpedo.target.id && torpedo.target.id === this.id);
            
            if (!isTargetingUs) return false;
            
            // Calculate distance and time to impact
            const submarinePos = this.getPosition();
            const distance = submarinePos.distanceTo(torpedo.position);
            const timeToImpact = distance / (torpedo.speed || 30); // Estimate based on torpedo speed
            
            torpedo.distanceToTarget = distance;
            torpedo.timeToImpact = timeToImpact;
            
            return distance < 2000; // Only warn about torpedoes within 2km
        });
    }
    
    updateActiveSonarThreats(currentTime) {
        // Get all enemy submarines using active sonar
        const enemies = window.getEnemySubmarines ? window.getEnemySubmarines() : [];
        
        this.threatWarning.activeSonarThreats = enemies.filter(enemy => {
            if (!enemy.sonarMode || enemy.sonarMode !== 'Active') return false;
            
            const submarinePos = this.getPosition();
            const enemyPos = enemy.getPosition();
            const distance = submarinePos.distanceTo(enemyPos);
            
            // Check if we're within their active sonar range
            const sonarRange = this.getActiveSonarRange(enemy.sonarSettings?.power || 2);
            
            return distance < sonarRange;
        });
    }
    
    getActiveSonarRange(powerLevel) {
        const ranges = [200, 500, 1000, 2000]; // Low, Medium, High, Maximum
        return ranges[powerLevel] || 1000;
    }
    
    calculateThreatLevel() {
        let level = 'NONE';
        
        const closestTorpedo = this.threatWarning.incomingTorpedoes
            .sort((a, b) => a.timeToImpact - b.timeToImpact)[0];
        
        if (closestTorpedo) {
            const timeToImpact = closestTorpedo.timeToImpact;
            if (timeToImpact < 10) level = 'CRITICAL';        // Less than 10 seconds
            else if (timeToImpact < 30) level = 'HIGH';       // Less than 30 seconds
            else if (timeToImpact < 60) level = 'MEDIUM';     // Less than 1 minute
            else level = 'LOW';                               // More than 1 minute
        } else if (this.threatWarning.activeSonarThreats.length > 0) {
            level = 'LOW'; // Being pinged by active sonar
        }
        
        this.threatWarning.warningLevel = level;
    }
    
    updateWarningIndicators(deltaTime, currentTime) {
        // Update HUD flash timer
        if (this.threatWarning.warningLevel !== 'NONE') {
            this.threatWarning.hudFlashTimer += deltaTime * 1000;
        } else {
            this.threatWarning.hudFlashTimer = 0;
        }
        
        // Update audio warning timer based on threat level
        const audioIntervals = {
            'CRITICAL': 200,  // Very rapid beeps
            'HIGH': 500,      // Rapid beeps
            'MEDIUM': 1000,   // Moderate beeps
            'LOW': 2000       // Slow beeps
        };
        
        const interval = audioIntervals[this.threatWarning.warningLevel];
        if (interval && currentTime - this.threatWarning.lastWarningSound > interval) {
            this.playThreatWarningSound();
            this.threatWarning.lastWarningSound = currentTime;
        }
        
        // Update visual HUD warning
        this.updateHUDThreatWarning();
    }
    
    playThreatWarningSound() {
        // Use the new AudioManager threat warning system
        const frequencies = {
            'CRITICAL': 1000,
            'HIGH': 800,
            'MEDIUM': 600,
            'LOW': 400
        };
        
        this.audioManager.playSoundEffect({
            type: 'sine',
            frequency: frequencies[this.threatWarning.warningLevel] || 400,
            duration: 0.1,
            volume: 0.1,
            gainNode: this.audioManager.sfxGain
        });
    }
    
    updateHUDThreatWarning() {
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) return;
        
        // Apply red flash effect based on threat level and timer
        if (this.threatWarning.warningLevel !== 'NONE') {
            const flashSpeed = {
                'CRITICAL': 200,
                'HIGH': 400,
                'MEDIUM': 800,
                'LOW': 1600
            }[this.threatWarning.warningLevel] || 1600;
            
            const flash = Math.sin(this.threatWarning.hudFlashTimer / flashSpeed * Math.PI * 2);
            const intensity = flash > 0 ? flash * 0.3 : 0; // Max 30% red overlay
            
            gameContainer.style.backgroundColor = `rgba(255, 0, 0, ${intensity})`;
        } else {
            gameContainer.style.backgroundColor = 'transparent';
        }
    }
    
    updateTorpedoLaunchSignature(deltaTime) {
        if (!this.torpedoLaunchSignature.active) return;
        
        const currentTime = Date.now();
        const timeSinceLaunch = currentTime - this.torpedoLaunchSignature.startTime;
        
        if (timeSinceLaunch >= this.torpedoLaunchSignature.duration) {
            // Launch signature effect has expired
            this.torpedoLaunchSignature.active = false;
            return;
        }
        
        // Calculate signature decay over time
        const progress = timeSinceLaunch / this.torpedoLaunchSignature.duration;
        const decayFactor = Math.pow(this.torpedoLaunchSignature.decayRate, progress);
        
        // The signature starts high and decays over time
        this.currentLaunchSignatureMultiplier = 1.0 + 
            (this.torpedoLaunchSignature.signatureMultiplier - 1.0) * decayFactor;
    }

    updateTorpedoLockSystem(deltaTime) {
        if (!this.torpedoLockSystem || !this.torpedoLockSystem.target) return;

        const currentTime = Date.now();
        const elapsedTime = currentTime - this.torpedoLockSystem.lockStartTime;

        // Calculate lock progress (0 to 1)
        this.torpedoLockSystem.lockProgress = Math.min(1.0, elapsedTime / this.torpedoLockSystem.lockTime);

        // Check if fully locked
        if (this.torpedoLockSystem.lockProgress >= 1.0) {
            this.torpedoLockSystem.isLocked = true;
        }

        // If changing launchers, reset lock progress
        const currentTorpedoCode = this.getCurrentTorpedoCode(this.selectedLauncher);
        if (!currentTorpedoCode || currentTorpedoCode === '') {
            this.torpedoLockSystem = {
                target: null,
                lockProgress: 0,
                lockStartTime: 0,
                isLocked: false
            };
        }
    }

    updateOffScreenIndicators() {
        // Hide all arrows by default
        const arrows = ['Top', 'Bottom', 'Left', 'Right'];
        arrows.forEach(dir => {
            const arrow = document.getElementById(`contactArrow${dir}`);
            if (arrow) arrow.classList.remove('visible');
        });

        // Check if we have a selected contact
        if (this.selectedSonarContact < 0) return;

        const sealifeSystem = window.sealifeSystem();
        if (!sealifeSystem) return;

        const contacts = sealifeSystem.getSonarContacts();
        if (this.selectedSonarContact >= contacts.length) return;

        const selectedContact = contacts[this.selectedSonarContact];
        if (!selectedContact || !selectedContact.mesh) return;

        // Use 3D projection to determine if contact is off-screen
        const camera = window.gameState?.camera;
        if (!camera) return;

        // Project contact 3D position to screen coordinates
        const contactWorldPos = selectedContact.mesh.position.clone();
        const vector = contactWorldPos.clone();
        vector.project(camera);

        // Convert normalized device coordinates (-1 to +1) to screen coordinates
        const canvas = window.gameState?.renderer?.domElement;
        if (!canvas) return;

        const screenX = (vector.x * 0.5 + 0.5) * canvas.clientWidth;
        const screenY = (-vector.y * 0.5 + 0.5) * canvas.clientHeight;

        // Check if contact is off-screen
        const margin = 50; // Pixels from edge to consider "off-screen"
        const isOffScreen = 
            screenX < margin || 
            screenX > canvas.clientWidth - margin ||
            screenY < margin || 
            screenY > canvas.clientHeight - margin ||
            vector.z > 1; // Behind camera

        if (isOffScreen) {
            // Determine which edge is closest
            const centerX = canvas.clientWidth / 2;
            const centerY = canvas.clientHeight / 2;
            
            let arrowToShow = null;
            
            // Clamp screen position to screen bounds for arrow positioning
            const clampedX = Math.max(margin, Math.min(canvas.clientWidth - margin, screenX));
            const clampedY = Math.max(margin, Math.min(canvas.clientHeight - margin, screenY));
            
            // Determine arrow direction based on which edge the contact is closest to
            const distToLeft = clampedX;
            const distToRight = canvas.clientWidth - clampedX;
            const distToTop = clampedY;
            const distToBottom = canvas.clientHeight - clampedY;
            
            const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
            
            if (minDist === distToLeft) arrowToShow = 'Left';
            else if (minDist === distToRight) arrowToShow = 'Right';
            else if (minDist === distToTop) arrowToShow = 'Top';
            else if (minDist === distToBottom) arrowToShow = 'Bottom';

            if (arrowToShow) {
                const arrow = document.getElementById(`contactArrow${arrowToShow}`);
                if (arrow) {
                    arrow.classList.add('visible');
                    
                    // Position arrow at edge of screen pointing toward contact
                    const rect = canvas.getBoundingClientRect();
                    let arrowX, arrowY;
                    
                    switch (arrowToShow) {
                        case 'Left':
                            arrowX = 20;
                            arrowY = Math.max(50, Math.min(canvas.clientHeight - 50, clampedY));
                            break;
                        case 'Right':
                            arrowX = canvas.clientWidth - 20;
                            arrowY = Math.max(50, Math.min(canvas.clientHeight - 50, clampedY));
                            break;
                        case 'Top':
                            arrowX = Math.max(50, Math.min(canvas.clientWidth - 50, clampedX));
                            arrowY = 20;
                            break;
                        case 'Bottom':
                            arrowX = Math.max(50, Math.min(canvas.clientWidth - 50, clampedX));
                            arrowY = canvas.clientHeight - 20;
                            break;
                    }
                    
                    arrow.style.left = arrowX + 'px';
                    arrow.style.top = arrowY + 'px';
                    
                    // Update arrow with contact info
                    const distance = Math.round(selectedContact.distance);
                    const bearing = Math.round(selectedContact.bearing);
                    arrow.title = `${selectedContact.classification} - ${distance}m - Bearing ${bearing}°`;
                }
            }
        }
    }

    updateReticleHUD() {
        // Update advanced reticle HUD with all elements
        this.updateTorpedoData();
        this.updateNoiseIndicator();
        this.updateSpeedBar();
        this.updateDepthBar();
    }

    updateTorpedoData() {
        const reticleTubeInfo = document.getElementById('reticleTubeInfo');
        const reticleLockStatus = document.getElementById('reticleLockStatus');

        if (!reticleTubeInfo || !reticleLockStatus) return;

        // Use revolver launcher system instead of old torpedo tube system
        if (this.selectedLauncher > 0 && this.selectedLauncher <= this.launchers.length) {
            const launcher = this.launchers[this.selectedLauncher - 1];
            const currentTorpedoCode = this.getCurrentTorpedoCode(this.selectedLauncher);
            
            if (currentTorpedoCode && currentTorpedoCode !== '') {
                // Show launcher with current torpedo type
                const torpedoType = this.getFullTorpedoType(currentTorpedoCode);
                reticleTubeInfo.textContent = `Launcher ${this.selectedLauncher} [${currentTorpedoCode}]`;

                // Update lock status
                if (this.torpedoLockSystem && this.torpedoLockSystem.isLocked) {
                    reticleTubeInfo.classList.add('locked');
                    reticleLockStatus.textContent = 'LOCKED';
                } else if (this.torpedoLockSystem && this.torpedoLockSystem.lockProgress > 0) {
                    reticleTubeInfo.classList.remove('locked');
                    const progress = Math.round(this.torpedoLockSystem.lockProgress * 100);
                    reticleLockStatus.textContent = `Locking... ${progress}%`;
                } else {
                    reticleTubeInfo.classList.remove('locked');
                    reticleLockStatus.textContent = '';
                }
            } else {
                // Show launcher with empty chamber
                reticleTubeInfo.textContent = `Launcher ${this.selectedLauncher} [Empty]`;
                reticleTubeInfo.classList.remove('locked');
                reticleLockStatus.textContent = '';
            }
        } else {
            reticleTubeInfo.textContent = 'No Launcher Selected';
            reticleTubeInfo.classList.remove('locked');
            reticleLockStatus.textContent = '';
        }
    }

    updateNoiseIndicator() {
        const noiseLevel = document.getElementById('noiseLevel');
        const noiseValue = document.querySelector('.noise-value');
        const noiseBar = document.querySelector('.noise-bar');

        if (!noiseLevel || !noiseValue || !noiseBar) return;

        const currentSignature = this.sonarSignature.current;
        const maxSignature = 30; // Reasonable maximum for display
        const percentage = Math.min((currentSignature / maxSignature) * 100, 100);

        noiseLevel.style.width = `${percentage}%`;
        noiseValue.textContent = `${Math.round(currentSignature)}`;

        // Color coding and danger warning
        if (currentSignature > 20) {
            noiseLevel.style.background = '#ff0000';
            noiseBar.classList.add('danger');
        } else if (currentSignature > 12) {
            noiseLevel.style.background = '#ff8800';
            noiseBar.classList.remove('danger');
        } else {
            noiseLevel.style.background = '#00ff88';
            noiseBar.classList.remove('danger');
        }
    }

    updateSpeedBar() {
        const speedBarFill = document.getElementById('speedBarFill');
        const speedTargetCaret = document.getElementById('speedTargetCaret');
        const speedCurrent = document.querySelector('.speed-current');
        const speedMax = document.querySelector('.speed-max');

        if (!speedBarFill || !speedTargetCaret || !speedCurrent || !speedMax) return;

        const currentSpeed = Math.abs(this.speed);
        const targetSpeed = Math.abs(this.targetSpeed);
        const maxSpeed = this.maxSpeed;

        // Update current speed bar (fills upward from bottom)
        const currentPercentage = (currentSpeed / maxSpeed) * 100;
        speedBarFill.style.height = `${Math.min(currentPercentage, 100)}%`;
        
        // Change color based on speed direction (blue for negative/reverse speed)
        if (this.speed < 0) {
            speedBarFill.style.background = '#0088ff'; // Blue for reverse speed
        } else {
            speedBarFill.style.background = '#00ff88'; // Green for forward speed (original)
        }

        // Update target speed caret
        const targetPercentage = (targetSpeed / maxSpeed) * 100;
        speedTargetCaret.style.top = `${100 - Math.min(targetPercentage, 100)}%`;

        // Update text values
        speedCurrent.textContent = Math.round(currentSpeed);
        speedMax.textContent = Math.round(maxSpeed);
    }

    updateDepthBar() {
        const depthBarFill = document.getElementById('depthBarFill');
        const depthBarContainer = document.querySelector('.depth-bar-container');
        const depthCurrent = document.querySelector('.depth-current');
        const depthBottom = document.querySelector('.depth-bottom');
        const depthCrush = document.querySelector('.depth-crush');
        const bottomDepthMarker = document.getElementById('bottomDepthMarker');

        if (!depthBarFill || !depthBarContainer || !depthCurrent || !depthCrush || !depthBottom || !bottomDepthMarker) return;

        const currentDepth = Math.abs(this.depth);
        const crushDepth = this.maxDepth;

        // Get seabed depth at current position
        let seabedDepth = crushDepth; // Default to crush depth if can't get seabed
        try {
            const oceanInstance = window.oceanInstance;
            if (oceanInstance && oceanInstance.getSeabedHeight && this.mesh) {
                const seabedHeight = oceanInstance.getSeabedHeight(this.mesh.position.x, this.mesh.position.z);
                // seabedHeight is negative (e.g. -1000m), so convert to positive depth
                // Surface is at y=0, so depth = Math.abs(seabedHeight)
                seabedDepth = Math.abs(seabedHeight); // Convert negative height to positive depth
                seabedDepth = Math.max(0, seabedDepth); // Ensure positive depth
                // Log seabed depth occasionally for debugging
                if (Math.random() < 0.001) { // ~0.1% chance per frame
                    console.log(`📊 Seabed at (${this.mesh.position.x.toFixed(0)}, ${this.mesh.position.z.toFixed(0)}): height=${seabedHeight}m, depth=${seabedDepth}m`);
                }
            }
        } catch (error) {
            // Fallback to crush depth if seabed calculation fails
            seabedDepth = crushDepth;
            console.warn('Failed to get seabed depth:', error);
        }

        // Use the deeper of seabed or crush depth for bar scaling
        const maxBarDepth = Math.max(crushDepth, seabedDepth * 1.1); // Add 10% padding

        // Update depth bar (fills downward from top)
        const depthPercentage = (currentDepth / maxBarDepth) * 100;
        depthBarFill.style.height = `${Math.min(depthPercentage, 100)}%`;

        // Position bottom depth marker
        const bottomPercentage = (seabedDepth / maxBarDepth) * 100;
        bottomDepthMarker.style.top = `${Math.min(bottomPercentage, 100)}%`;

        // Danger warning when near crush depth
        if (depthPercentage > 85) {
            depthBarContainer.classList.add('danger');
        } else {
            depthBarContainer.classList.remove('danger');
        }

        // Update text values
        depthCurrent.textContent = `${Math.round(currentDepth)}m`;
        depthBottom.textContent = `${Math.round(seabedDepth)}m`;
        depthCrush.textContent = `${Math.round(crushDepth)}m`;
    }

    updateDamageControl(deltaTime) {
        const currentTime = Date.now();
        const engineeringBonus = this.getEngineeringSkillModifier();
        const effectiveRepairRate = this.damageControl.repairRate * engineeringBonus;

        // Process active repairs
        for (const [systemName, startTime] of Object.entries(this.damageControl.activeRepairs)) {
            const repairDuration = currentTime - startTime;
            const system = this.systems[systemName];

            if (system && system.hp < system.maxHP) {
                // Apply repair over time
                const repairAmount = effectiveRepairRate * deltaTime;
                system.hp = Math.min(system.maxHP, system.hp + repairAmount);

                console.log(`Repairing ${systemName}: ${system.hp.toFixed(1)}/${system.maxHP} HP`);

                // Repair complete?
                if (system.hp >= system.maxHP) {
                    delete this.damageControl.activeRepairs[systemName];
                    console.log(`${systemName} repair completed!`);
                }
            } else {
                // System already at full HP
                delete this.damageControl.activeRepairs[systemName];
            }
        }
    }

    startEmergencyRepair() {
        // Find the most damaged system (by percentage)
        let mostDamagedSystem = null;
        let lowestHealthPercent = 1.0;

        for (const [systemName, system] of Object.entries(this.systems)) {
            if (system.hp < system.maxHP) {
                const healthPercent = system.hp / system.maxHP;
                if (healthPercent < lowestHealthPercent) {
                    lowestHealthPercent = healthPercent;
                    mostDamagedSystem = systemName;
                }
            }
        }

        if (mostDamagedSystem) {
            // Start or restart repair
            this.damageControl.activeRepairs[mostDamagedSystem] = Date.now();
            console.log(`Starting emergency repair on ${mostDamagedSystem} (${(lowestHealthPercent * 100).toFixed(1)}% health)`);
        } else {
            console.log('All systems are at full health');
        }
    }


    updateMinimap() {
        if (!this.minimapEnabled || this.fullscreenMapOpen) return;

        const canvas = document.getElementById('minimapCanvas');
        if (!canvas) {
            console.warn('🗺️ Minimap canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas with dark tactical background
        ctx.fillStyle = '#001122';
        ctx.fillRect(0, 0, width, height);

        // Get player position
        const playerPos = this.getPosition();

        // Get ocean terrain data - check both possible ocean instances
        const oceanInstance = window.oceanInstance || window.ocean;
        if (!oceanInstance) {
            console.warn('🗺️ No ocean instance found for minimap');
            return;
        }

        const getTerrainHeight = oceanInstance.getTerrainHeight || oceanInstance.getSeabedHeight;
        if (!getTerrainHeight) {
            console.warn('🗺️ No terrain height function found');
            return;
        }

        console.log('🗺️ Minimap: Ocean instance found, starting terrain rendering...');

        // ISOMETRIC MINIMAP SYSTEM
        // 2x2km tactical view from 20x20km terrain: 1 pixel = 10 meters, 200x200 canvas = 2km x 2km
        const scale = 10; // meters per pixel (2km / 200px = 10m/px)
        const viewRadius = (width / 2) * scale; // 1km radius from center

        // Isometric projection parameters - adjusted for realistic deep ocean depths
        const isoScale = 0.8; // Isometric scaling factor
        const heightScale = 0.001; // Much smaller scale for deep ocean depths (5000m -> 5px)

        // Draw terrain using wireframe style like tactical display
        this.drawWireframeTerrain(ctx, width, height, playerPos, scale, oceanInstance, getTerrainHeight);

        // Draw player submarine as directional arrow (pointing bow direction)
        const subX = width / 2;
        const subY = height / 2;
        const subSize = 6;

        // Get submarine's current rotation (bow direction)
        const bowDirection = this.mesh.rotation.y; // Y rotation is yaw

        // Calculate arrow points
        const cos = Math.cos(bowDirection);
        const sin = Math.sin(bowDirection);

        // Arrow vertices (pointing forward)
        const points = [
            { x: subSize, y: 0 },      // Bow (front point)
            { x: -subSize/2, y: -subSize/2 }, // Port stern
            { x: -subSize/3, y: 0 },   // Stern center (notch)
            { x: -subSize/2, y: subSize/2 }  // Starboard stern
        ];

        // Rotate and translate points
        const rotatedPoints = points.map(p => ({
            x: subX + (p.x * cos - p.y * sin),
            y: subY + (p.x * sin + p.y * cos)
        }));

        // Draw submarine arrow
        ctx.fillStyle = '#00ffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(rotatedPoints[0].x, rotatedPoints[0].y);
        for (let i = 1; i < rotatedPoints.length; i++) {
            ctx.lineTo(rotatedPoints[i].x, rotatedPoints[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw sonar contacts with tactical symbols
        this.drawTacticalContacts(ctx, width, height, playerPos, scale);
    }

    drawWireframeTerrain(ctx, width, height, playerPos, scale, oceanInstance, getTerrainHeight) {
        // WIREFRAME TACTICAL DISPLAY - like the image
        const gridRes = 15; // Resolution for wireframe grid
        const viewRadius = Math.min(width, height) / 2;

        // Set wireframe style - cyan/teal lines on dark background
        ctx.strokeStyle = '#00FFFF'; // Bright cyan like the image
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.8;

        // Sample terrain in a grid around player position
        const terrainGrid = [];
        const gridSize = Math.ceil(Math.max(width, height) / gridRes);

        for (let gx = 0; gx <= gridSize; gx++) {
            terrainGrid[gx] = [];
            for (let gy = 0; gy <= gridSize; gy++) {
                // Convert grid to world coordinates
                const worldX = playerPos.x + (gx - gridSize/2) * scale * gridRes;
                const worldZ = playerPos.z + (gy - gridSize/2) * scale * gridRes;

                try {
                    const terrainBounds = 5000; // 5km from center (10km terrain = ±5km bounds)
                    if (Math.abs(worldX) <= terrainBounds && Math.abs(worldZ) <= terrainBounds) {
                        const height = getTerrainHeight.call(oceanInstance, worldX, worldZ);
                        terrainGrid[gx][gy] = height;
                    } else {
                        terrainGrid[gx][gy] = -5000; // Deep ocean default
                    }
                } catch (error) {
                    terrainGrid[gx][gy] = -5000;
                }
            }
        }

        // Draw wireframe mesh - horizontal lines
        for (let gy = 0; gy <= gridSize; gy++) {
            ctx.beginPath();
            let firstPoint = true;

            for (let gx = 0; gx <= gridSize; gx++) {
                const screenX = width/2 + (gx - gridSize/2) * gridRes;
                const screenY = height/2 + (gy - gridSize/2) * gridRes;

                // Add height displacement for 3D effect (enhanced for dramatic terrain)
                const terrainHeight = terrainGrid[gx][gy] || -5000;
                const heightOffset = (terrainHeight + 5000) * 0.05; // Increased scale for more dramatic terrain
                const finalY = screenY - heightOffset;

                if (firstPoint) {
                    ctx.moveTo(screenX, finalY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(screenX, finalY);
                }
            }
            ctx.stroke();
        }

        // Draw wireframe mesh - vertical lines
        for (let gx = 0; gx <= gridSize; gx++) {
            ctx.beginPath();
            let firstPoint = true;

            for (let gy = 0; gy <= gridSize; gy++) {
                const screenX = width/2 + (gx - gridSize/2) * gridRes;
                const screenY = height/2 + (gy - gridSize/2) * gridRes;

                // Add height displacement for 3D effect (enhanced for dramatic terrain)
                const terrainHeight = terrainGrid[gx][gy] || -5000;
                const heightOffset = (terrainHeight + 5000) * 0.05; // Increased scale for more dramatic terrain
                const finalY = screenY - heightOffset;

                if (firstPoint) {
                    ctx.moveTo(screenX, finalY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(screenX, finalY);
                }
            }
            ctx.stroke();
        }

        // Draw contour lines for major depth changes
        ctx.strokeStyle = '#00CCCC'; // Slightly darker cyan for contours
        ctx.lineWidth = 1.5;

        const contourIntervals = [-4000, -3000, -2000, -1000, -500, -200]; // Depth contours

        for (const contourDepth of contourIntervals) {
            ctx.beginPath();

            // Find points at this depth and connect them
            for (let gx = 0; gx < gridSize; gx++) {
                for (let gy = 0; gy < gridSize; gy++) {
                    const h1 = terrainGrid[gx][gy];
                    const h2 = terrainGrid[gx + 1] && terrainGrid[gx + 1][gy];
                    const h3 = terrainGrid[gx][gy + 1];

                    // Check if contour passes through this grid cell
                    if (h1 && h2 && ((h1 >= contourDepth && h2 <= contourDepth) || (h1 <= contourDepth && h2 >= contourDepth))) {
                        // Draw horizontal contour segment
                        const x1 = width/2 + (gx - gridSize/2) * gridRes;
                        const x2 = width/2 + (gx + 1 - gridSize/2) * gridRes;
                        const y = height/2 + (gy - gridSize/2) * gridRes;

                        // Interpolate position along edge
                        const t = (contourDepth - h1) / (h2 - h1);
                        const contourX = x1 + t * (x2 - x1);
                        const heightOffset = (contourDepth + 5000) * 0.05;

                        ctx.moveTo(contourX, y - heightOffset);
                        ctx.lineTo(contourX + 2, y - heightOffset);
                    }

                    if (h1 && h3 && ((h1 >= contourDepth && h3 <= contourDepth) || (h1 <= contourDepth && h3 >= contourDepth))) {
                        // Draw vertical contour segment
                        const x = width/2 + (gx - gridSize/2) * gridRes;
                        const y1 = height/2 + (gy - gridSize/2) * gridRes;
                        const y2 = height/2 + (gy + 1 - gridSize/2) * gridRes;

                        // Interpolate position along edge
                        const t = (contourDepth - h1) / (h3 - h1);
                        const contourY = y1 + t * (y2 - y1);
                        const heightOffset = (contourDepth + 5000) * 0.05;

                        ctx.moveTo(x, contourY - heightOffset);
                        ctx.lineTo(x, contourY - heightOffset + 2);
                    }
                }
            }
            ctx.stroke();
        }

        // Reset alpha
        ctx.globalAlpha = 1.0;
    }

    drawFullscreenWireframeTerrain(ctx, width, height) {
        // FULL 100x100km WIREFRAME TERRAIN - Strategic overview
        const gridRes = 50; // Higher resolution for detailed bathymetry wireframe (50x50 grid)

        // Set wireframe style - cyan/teal lines on dark background
        ctx.strokeStyle = '#00FFFF'; // Bright cyan like the image
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;

        // Get ocean terrain data - check both possible ocean instances
        const oceanInstance = window.oceanInstance || window.ocean;
        if (!oceanInstance) {
            console.warn('🗺️ No ocean instance found for fullscreen map');
            return;
        }

        const getTerrainHeight = oceanInstance.getTerrainHeight || oceanInstance.getSeabedHeight;
        if (!getTerrainHeight) {
            console.warn('🗺️ No terrain height function found');
            return;
        }

        // Check if real bathymetry data is loaded
        if (oceanInstance.bathymetryTerrain && !oceanInstance.bathymetryTerrain.loaded) {
            console.warn('🗺️ Bathymetry data not yet loaded, showing fallback terrain');
        } else {
            console.log('🗺️ Using real bathymetry data for fullscreen map');
        }

        // Sample terrain across the FULL 100x100km area
        const terrainGrid = [];
        const gridSize = Math.ceil(Math.max(width, height) / gridRes);

        for (let gx = 0; gx <= gridSize; gx++) {
            terrainGrid[gx] = [];
            for (let gy = 0; gy <= gridSize; gy++) {
                // Convert grid to world coordinates covering full 100x100km (-50km to +50km)
                const worldX = (gx / gridSize - 0.5) * 100000; // -50km to +50km  
                const worldZ = (gy / gridSize - 0.5) * 100000; // -50km to +50km

                try {
                    const height = getTerrainHeight.call(oceanInstance, worldX, worldZ);
                    terrainGrid[gx][gy] = height;
                } catch (error) {
                    terrainGrid[gx][gy] = -5000;
                }
            }
        }

        // Draw wireframe mesh - horizontal lines
        for (let gy = 0; gy <= gridSize; gy++) {
            ctx.beginPath();
            let firstPoint = true;

            for (let gx = 0; gx <= gridSize; gx++) {
                const screenX = (gx / gridSize) * width;
                const screenY = (gy / gridSize) * height;

                // Add height displacement for 3D effect (scaled for full area)
                const terrainHeight = terrainGrid[gx][gy] || -5000;
                const heightOffset = (terrainHeight + 5000) * 0.02; // Moderate scale for full area
                const finalY = screenY - heightOffset;

                if (firstPoint) {
                    ctx.moveTo(screenX, finalY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(screenX, finalY);
                }
            }
            ctx.stroke();
        }

        // Draw wireframe mesh - vertical lines
        for (let gx = 0; gx <= gridSize; gx++) {
            ctx.beginPath();
            let firstPoint = true;

            for (let gy = 0; gy <= gridSize; gy++) {
                const screenX = (gx / gridSize) * width;
                const screenY = (gy / gridSize) * height;

                // Add height displacement for 3D effect
                const terrainHeight = terrainGrid[gx][gy] || -5000;
                const heightOffset = (terrainHeight + 5000) * 0.02; // Moderate scale for full area
                const finalY = screenY - heightOffset;

                if (firstPoint) {
                    ctx.moveTo(screenX, finalY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(screenX, finalY);
                }
            }
            ctx.stroke();
        }

        // Draw major terrain contours for strategic view
        ctx.strokeStyle = '#00CCCC'; // Slightly darker cyan for contours
        ctx.lineWidth = 2;

        const contourIntervals = [-6000, -4000, -2000, -500, -100]; // Major depth contours

        for (const contourDepth of contourIntervals) {
            ctx.beginPath();

            // Find points at this depth and connect them
            for (let gx = 0; gx < gridSize; gx++) {
                for (let gy = 0; gy < gridSize; gy++) {
                    const h1 = terrainGrid[gx][gy];
                    const h2 = terrainGrid[gx + 1] && terrainGrid[gx + 1][gy];
                    const h3 = terrainGrid[gx][gy + 1];

                    // Check if contour passes through this grid cell
                    if (h1 && h2 && ((h1 >= contourDepth && h2 <= contourDepth) || (h1 <= contourDepth && h2 >= contourDepth))) {
                        // Draw horizontal contour segment
                        const x1 = (gx / gridSize) * width;
                        const x2 = ((gx + 1) / gridSize) * width;
                        const y = (gy / gridSize) * height;

                        // Interpolate position along edge
                        const t = (contourDepth - h1) / (h2 - h1);
                        const contourX = x1 + t * (x2 - x1);
                        const heightOffset = (contourDepth + 5000) * 0.02;

                        ctx.moveTo(contourX, y - heightOffset);
                        ctx.lineTo(contourX + 4, y - heightOffset);
                    }

                    if (h1 && h3 && ((h1 >= contourDepth && h3 <= contourDepth) || (h1 <= contourDepth && h3 >= contourDepth))) {
                        // Draw vertical contour segment
                        const x = (gx / gridSize) * width;
                        const y1 = (gy / gridSize) * height;
                        const y2 = ((gy + 1) / gridSize) * height;

                        // Interpolate position along edge
                        const t = (contourDepth - h1) / (h3 - h1);
                        const contourY = y1 + t * (y2 - y1);
                        const heightOffset = (contourDepth + 5000) * 0.02;

                        ctx.moveTo(x, contourY - heightOffset);
                        ctx.lineTo(x, contourY - heightOffset + 4);
                    }
                }
            }
            ctx.stroke();
        }

        // Reset alpha
        ctx.globalAlpha = 1.0;
    }

    drawTacticalContacts(ctx, width, height, playerPos, scale) {
        if (!this.sonarContacts || this.sonarContacts.length === 0) return;

        this.sonarContacts.forEach(contact => {
            if (contact && typeof contact.x === 'number' && typeof contact.z === 'number') {
                // Convert world coordinates to minimap pixels
                const screenX = width/2 + (contact.x - playerPos.x) / scale;
                const screenY = height/2 + (contact.z - playerPos.z) / scale;

                // Only draw if within minimap bounds
                if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
                    // Tactical symbols for different contact types
                    if (contact.isSubmarine) {
                        // Submarine symbol (diamond)
                        ctx.fillStyle = contact.isPlayer ? '#00ff00' : '#ff4444';
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1;

                        ctx.beginPath();
                        ctx.moveTo(screenX, screenY - 4);
                        ctx.lineTo(screenX + 4, screenY);
                        ctx.lineTo(screenX, screenY + 4);
                        ctx.lineTo(screenX - 4, screenY);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();

                    } else if (contact.isNoisemaker || contact.classification === 'TURBULENCE') {
                        // Countermeasure symbol (X)
                        ctx.strokeStyle = '#ffff00';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(screenX - 3, screenY - 3);
                        ctx.lineTo(screenX + 3, screenY + 3);
                        ctx.moveTo(screenX + 3, screenY - 3);
                        ctx.lineTo(screenX - 3, screenY + 3);
                        ctx.stroke();

                    } else {
                        // Unknown contact (circle)
                        ctx.fillStyle = '#ffffff';
                        ctx.strokeStyle = '#888888';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            }
        });
    }

    updateTerrainExploration() {
        // Update terrain exploration based on current position and sonar range
        const currentTime = Date.now();
        if (currentTime - this.lastExplorationUpdate < 500) return; // Update every 500ms

        this.lastExplorationUpdate = currentTime;
        const playerPos = this.mesh ? this.mesh.position : { x: 0, z: 0 };

        // Current sonar range (based on power setting and environment)
        let sonarRange = 100; // Base range in meters
        if (this.sonarPower === 'High') sonarRange = 200;
        else if (this.sonarPower === 'Medium') sonarRange = 100;
        else if (this.sonarPower === 'Low') sonarRange = 50;

        // Exploration grid resolution: 50m x 50m cells
        const gridSize = 50;
        const explorationRadius = sonarRange + 100; // Extended exploration for movement

        // Mark grid cells as explored
        for (let x = -explorationRadius; x <= explorationRadius; x += gridSize) {
            for (let z = -explorationRadius; z <= explorationRadius; z += gridSize) {
                const worldX = Math.floor((playerPos.x + x) / gridSize) * gridSize;
                const worldZ = Math.floor((playerPos.z + z) / gridSize) * gridSize;
                const distance = Math.sqrt(x*x + z*z);

                if (distance <= explorationRadius) {
                    const gridKey = `${worldX},${worldZ}`;
                    if (!this.exploredTerrain.has(gridKey)) {
                        this.exploredTerrain.set(gridKey, {
                            x: worldX,
                            z: worldZ,
                            exploredTime: currentTime,
                            confidence: distance <= sonarRange ? 1.0 : 0.5 // High confidence within sonar range
                        });
                    }
                }
            }
        }
    }

    updateFullscreenMap() {
        const canvas = document.getElementById('fullscreenMapCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas with dark background
        ctx.fillStyle = '#001122';
        ctx.fillRect(0, 0, width, height);

        // Draw full 20x20km wireframe terrain
        this.drawFullscreenWireframeTerrain(ctx, width, height);

        // Draw all contacts
        this.drawFullmapContacts(ctx, width, height);

        // Draw player submarine
        this.drawFullmapPlayer(ctx, width, height);
    }

    drawMinimapGrid(ctx, width, height) {
        ctx.strokeStyle = '#004444';
        ctx.lineWidth = 1;

        // Draw grid lines every 100m (1km = 1000m, canvas = 200px, so 100m = 20px)
        for (let i = 0; i <= width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        for (let j = 0; j <= height; j += 20) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(width, j);
            ctx.stroke();
        }
    }

    drawMinimapTerrain(ctx, width, height) {
        // Get current player position
        const playerPos = this.mesh ? this.mesh.position : { x: 0, z: 0 };
        const oceanInstance = window.oceanInstance;

        if (!oceanInstance || !oceanInstance.getSeabedHeight) {
            // Fallback to simplified terrain if no ocean data
            ctx.fillStyle = 'rgba(0, 100, 0, 0.3)';
            ctx.fillRect(20, 30, 40, 60);
            ctx.fillRect(140, 120, 50, 40);
            ctx.fillRect(60, 160, 80, 30);
            return;
        }

        // Minimap scale: 1 pixel = 10 meters, 200x200 pixel minimap = 2km x 2km view
        const scale = 10; // meters per pixel
        const viewRadius = (width / 2) * scale; // Half the view distance in meters

        // Sample terrain in a grid
        const sampleRes = 8; // Sample every 8 pixels for performance
        for (let px = 0; px < width; px += sampleRes) {
            for (let py = 0; py < height; py += sampleRes) {
                // Convert minimap pixel to world coordinates relative to player
                const worldX = playerPos.x + (px - width/2) * scale;
                const worldZ = playerPos.z + (py - height/2) * scale;

                // Get terrain height at this position
                const terrainHeight = oceanInstance.getSeabedHeight(worldX, worldZ);

                // Check if this area has been explored using our tracking system
                const gridSize = 50; // Match the exploration grid size
                const gridX = Math.floor(worldX / gridSize) * gridSize;
                const gridZ = Math.floor(worldZ / gridSize) * gridSize;
                const gridKey = `${gridX},${gridZ}`;
                const exploredData = this.exploredTerrain.get(gridKey);
                const explored = exploredData !== undefined;

                if (explored) {
                    // Color-code terrain by depth/elevation
                    let terrainColor;
                    if (terrainHeight > -10) {
                        terrainColor = 'rgba(139, 69, 19, 0.8)'; // Shallow/ridge - brown
                    } else if (terrainHeight > -50) {
                        terrainColor = 'rgba(0, 100, 0, 0.6)'; // Continental shelf - green
                    } else if (terrainHeight > -150) {
                        terrainColor = 'rgba(0, 50, 100, 0.5)'; // Deep water - dark blue
                    } else {
                        terrainColor = 'rgba(0, 0, 50, 0.4)'; // Abyssal - very dark blue
                    }

                    ctx.fillStyle = terrainColor;
                    ctx.fillRect(px, py, sampleRes, sampleRes);
                }
            }
        }
    }

    drawMinimapContacts(ctx, width, height) {
        const sealifeSystem = window.sealifeSystem();
        if (!sealifeSystem) return;

        const contacts = sealifeSystem.getSonarContacts();
        const playerPos = this.getPosition();

        contacts.forEach((contact, index) => {
            // Calculate relative position (1km = 1000m scale)
            const relativeX = contact.distance * Math.cos(contact.bearing * Math.PI / 180);
            const relativeZ = contact.distance * Math.sin(contact.bearing * Math.PI / 180);

            // Convert to canvas coordinates (500m radius = 100px)
            const canvasX = width / 2 + (relativeX / 500) * 100;
            const canvasY = height / 2 + (relativeZ / 500) * 100;

            if (canvasX >= 0 && canvasX <= width && canvasY >= 0 && canvasY <= height) {
                // Draw contact with depth stick
                const isSelected = this.selectedSonarContact === index;
                const isIdentified = contact.classification !== 'UNIDENTIFIED';

                // Contact color
                ctx.fillStyle = isSelected ? '#ff8800' : (isIdentified ? '#00ff00' : '#ffff00');

                // Draw depth stick (vertical line showing depth)
                const stickHeight = Math.min(20, contact.depth / 10); // Scale depth
                ctx.beginPath();
                ctx.moveTo(canvasX, canvasY);
                ctx.lineTo(canvasX, canvasY + stickHeight);
                ctx.strokeStyle = ctx.fillStyle;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw contact dot
                ctx.beginPath();
                ctx.arc(canvasX, canvasY, isSelected ? 4 : 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }

    drawMinimapPlayer(ctx, width, height) {
        // Draw player submarine at center
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.fillStyle = '#00ffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        // Draw submarine shape
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Draw heading indicator
        const headingX = centerX + Math.cos(-Math.PI / 2) * 12;
        const headingY = centerY + Math.sin(-Math.PI / 2) * 12;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(headingX, headingY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawFullmapGrid(ctx, width, height) {
        ctx.strokeStyle = '#004444';
        ctx.lineWidth = 1;

        // FULL 20x20km GRID SYSTEM
        // Major grid lines every 5km (800px / 20km = 40px per km, so 5km = 200px)
        // Minor grid lines every 1km (40px)

        // Major grid lines (5km intervals)
        ctx.strokeStyle = '#006666';
        ctx.lineWidth = 2;
        for (let i = 0; i <= width; i += 200) {  // Every 5km
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        for (let j = 0; j <= height; j += 150) {  // Every 5km (600px / 20km = 30px per km, so 5km = 150px)
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(width, j);
            ctx.stroke();
        }

        // Minor grid lines (1km intervals)
        ctx.strokeStyle = '#004444';
        ctx.lineWidth = 1;
        for (let i = 0; i <= width; i += 40) {  // Every 1km
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        for (let j = 0; j <= height; j += 30) {  // Every 1km
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(width, j);
            ctx.stroke();
        }

        // Draw scale labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('20km x 20km TACTICAL OVERVIEW', width/2, 20);
    }

    drawFullmapTerrain(ctx, width, height) {
        const playerPos = this.getPosition();
        const oceanInstance = window.oceanInstance;

        if (!oceanInstance || !oceanInstance.getSeabedHeight) {
            return;
        }

        // FULL 20x20km MAP SCALE
        // 800x600 canvas showing 20x20km = 25 meters per pixel horizontally, 33.3 meters per pixel vertically
        const scaleX = 25;  // meters per pixel (20km / 800px = 25m/px)
        const scaleY = 33.3; // meters per pixel (20km / 600px = 33.3m/px)

        // Sample terrain in a grid (lower resolution for performance)
        const sampleRes = 16; // Sample every 16 pixels for full map performance
        for (let px = 0; px < width; px += sampleRes) {
            for (let py = 0; py < height; py += sampleRes) {
                // Convert fullmap pixel to world coordinates (center map on player)
                const worldX = playerPos.x + (px - width/2) * scaleX;
                const worldZ = playerPos.z + (py - height/2) * scaleY;

                // Get terrain height at this position
                const terrainHeight = oceanInstance.getSeabedHeight(worldX, worldZ);

                // Color based on terrain depth
                if (terrainHeight > -50) {
                    ctx.fillStyle = 'rgba(139, 69, 19, 0.6)'; // Shallow/land areas
                } else if (terrainHeight > -200) {
                    ctx.fillStyle = 'rgba(0, 100, 0, 0.4)'; // Medium depth
                } else if (terrainHeight > -500) {
                    ctx.fillStyle = 'rgba(0, 50, 100, 0.3)'; // Deep water
                } else {
                    ctx.fillStyle = 'rgba(0, 0, 50, 0.2)'; // Abyssal depths
                }

                ctx.fillRect(px, py, sampleRes, sampleRes);
            }
        }
    }

    drawFullmapContacts(ctx, width, height) {
        if (!this.sonarContacts || this.sonarContacts.length === 0) return;

        const playerPos = this.getPosition();

        // FULL 100x100km MAP SCALE - same as terrain
        const scaleX = 125;  // meters per pixel (100km / 800px = 125m/px)
        const scaleY = 166.7; // meters per pixel (100km / 600px = 166.7m/px)

        this.sonarContacts.forEach((contact, index) => {
            if (contact && typeof contact.x === 'number' && typeof contact.z === 'number') {
                // Convert world coordinates to fullmap pixels (same system as terrain)
                const mapX = width/2 + (contact.x - playerPos.x) / scaleX;
                const mapY = height/2 + (contact.z - playerPos.z) / scaleY;

                // Only draw if within map bounds
                if (mapX >= 0 && mapX <= width && mapY >= 0 && mapY <= height) {
                    const isSelected = this.selectedSonarContact === index;
                    const isIdentified = contact.classification !== 'UNIDENTIFIED';

                    ctx.fillStyle = isSelected ? '#ff8800' : (isIdentified ? '#00ff00' : '#ffff00');

                    // Draw depth stick
                    const stickHeight = Math.min(15, contact.depth / 15);
                    ctx.beginPath();
                    ctx.moveTo(mapX, mapY);
                    ctx.lineTo(mapX, mapY + stickHeight);
                    ctx.strokeStyle = ctx.fillStyle;
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Draw contact dot
                    ctx.beginPath();
                    ctx.arc(mapX, mapY, isSelected ? 5 : 3, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        });
    }

    drawFullmapPlayer(ctx, width, height) {
        // Draw player submarine in full map
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.fillStyle = '#00ffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Draw heading
        const headingX = centerX + Math.cos(-Math.PI / 2) * 16;
        const headingY = centerY + Math.sin(-Math.PI / 2) * 16;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(headingX, headingY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Scenarios System
    initializeScenariosSystem() {
        this.scenarios = {
            current: null,
            available: {
                'PATROL_MISSION': {
                    name: 'Patrol Mission',
                    description: 'Patrol the designated area and identify any contacts',
                    objectives: [
                        { type: 'PATROL_AREA', description: 'Patrol assigned area for 5 minutes', completed: false, progress: 0, target: 300 },
                        { type: 'IDENTIFY_CONTACTS', description: 'Identify at least 3 contacts', completed: false, progress: 0, target: 3 }
                    ],
                    timeLimit: 600, // 10 minutes
                    reward: { experience: 100, skillPoints: 2 }
                },
                'STEALTH_OPERATION': {
                    name: 'Stealth Operation',
                    description: 'Navigate through hostile waters without being detected',
                    objectives: [
                        { type: 'MAINTAIN_STEALTH', description: 'Keep sonar signature below 10dB for 3 minutes', completed: false, progress: 0, target: 180 },
                        { type: 'REACH_WAYPOINT', description: 'Reach the target coordinates', completed: false, progress: 0, target: 1 }
                    ],
                    timeLimit: 480, // 8 minutes
                    reward: { experience: 150, skillPoints: 3 }
                },
                'COMBAT_TRAINING': {
                    name: 'Combat Training',
                    description: 'Destroy enemy targets in combat simulation',
                    objectives: [
                        { type: 'DESTROY_TARGETS', description: 'Destroy 2 enemy submarines', completed: false, progress: 0, target: 2 },
                        { type: 'SURVIVE_DAMAGE', description: 'Maintain hull integrity above 50%', completed: false, progress: 0, target: 50 }
                    ],
                    timeLimit: 900, // 15 minutes
                    reward: { experience: 200, skillPoints: 4 },
                    enemies: [
                        { type: 'THUNDER', behavior: 'patrol', alertLevel: 'medium', position: { x: 100, y: -30, z: -80 } },
                        { type: 'LIGHTNING', behavior: 'scout', alertLevel: 'high', position: { x: 150, y: -20, z: 50 } }
                    ]
                },
                'RESCUE_MISSION': {
                    name: 'Rescue Mission',
                    description: 'Locate and assist a damaged friendly submarine',
                    objectives: [
                        { type: 'LOCATE_TARGET', description: 'Find the damaged submarine', completed: false, progress: 0, target: 1 },
                        { type: 'PROVIDE_AID', description: 'Stay within 50m for 2 minutes to provide aid', completed: false, progress: 0, target: 120 }
                    ],
                    timeLimit: 720, // 12 minutes
                    reward: { experience: 175, skillPoints: 3 },
                    allies: [
                        { type: 'ADVENTURE', name: 'Distressed-Alpha', behavior: 'damaged', hull: 25, position: { x: 200, y: -60, z: -100 } }
                    ],
                    enemies: [
                        { type: 'SQUALL', behavior: 'guard', alertLevel: 'medium', position: { x: 250, y: -40, z: -50 } }
                    ]
                },
                'ESCORT_CONVOY': {
                    name: 'Cargo Escort',
                    description: 'Protect valuable cargo submarines from pirate attacks',
                    objectives: [
                        { type: 'ESCORT_CARGO', description: 'Escort JUMBO cargo submarine safely', completed: false, progress: 0, target: 1 },
                        { type: 'ELIMINATE_PIRATES', description: 'Destroy attacking pirate submarines', completed: false, progress: 0, target: 3 },
                        { type: 'CARGO_SURVIVAL', description: 'Ensure cargo survives with >70% hull', completed: false, progress: 0, target: 70 }
                    ],
                    timeLimit: 1200, // 20 minutes
                    reward: { experience: 300, skillPoints: 5, reputation: { 'MINING_CONSORTIUM': 5 } },
                    allies: [
                        { type: 'JUMBO', name: 'Cargo-Prime', behavior: 'convoy', hull: 150, speed: 5, position: { x: -50, y: -40, z: -60 } },
                        { type: 'HAILSTORM', name: 'Escort-Beta', behavior: 'escort', hull: 90, position: { x: -70, y: -35, z: -80 } }
                    ],
                    enemies: [
                        { type: 'LIGHTNING', behavior: 'raider', alertLevel: 'high', position: { x: 120, y: -25, z: -100 } },
                        { type: 'THUNDER', behavior: 'pirate', alertLevel: 'high', position: { x: 180, y: -30, z: 20 } },
                        { type: 'MISSION', behavior: 'interceptor', alertLevel: 'maximum', position: { x: 200, y: -45, z: -40 } }
                    ]
                },
                'DEEP_EXPLORATION': {
                    name: 'Abyssal Depths',
                    description: 'Explore deep ocean territories and establish research outpost',
                    objectives: [
                        { type: 'REACH_DEPTH', description: 'Descend to 3000m depth safely', completed: false, progress: 0, target: 3000 },
                        { type: 'ESCORT_RESEARCH', description: 'Escort QUEST research submarine', completed: false, progress: 0, target: 1 },
                        { type: 'DEFEND_OUTPOST', description: 'Defend against deep-sea hostiles', completed: false, progress: 0, target: 2 }
                    ],
                    timeLimit: 1800, // 30 minutes
                    reward: { experience: 400, skillPoints: 6, reputation: { 'DEEP_RESEARCH_ALLIANCE': 10 } },
                    allies: [
                        { type: 'QUEST', name: 'Research-Deep', behavior: 'research', hull: 120, position: { x: -80, y: -200, z: -60 } }
                    ],
                    enemies: [
                        { type: 'WHIRLWIND', behavior: 'deep_patrol', alertLevel: 'high', position: { x: 150, y: -280, z: 100 } },
                        { type: 'CYCLONE', behavior: 'guardian', alertLevel: 'maximum', position: { x: -100, y: -300, z: -150 } }
                    ]
                },
                'FACTION_DIPLOMACY': {
                    name: 'Diplomatic Transport',
                    description: 'Transport faction representatives safely through hostile waters',
                    objectives: [
                        { type: 'TRANSPORT_VIP', description: 'Transport VIP in FURY diplomatic vessel', completed: false, progress: 0, target: 1 },
                        { type: 'AVOID_INCIDENTS', description: 'Complete without hostile engagement', completed: false, progress: 0, target: 0 },
                        { type: 'STEALTH_PASSAGE', description: 'Maintain diplomatic immunity', completed: false, progress: 0, target: 1 }
                    ],
                    timeLimit: 1500, // 25 minutes
                    reward: { experience: 250, skillPoints: 4, reputation: { 'PACIFICA_FEDERATION': 8, 'MARSHALL_AUTHORITY': 3 } },
                    allies: [
                        { type: 'FURY', name: 'Diplomatic-One', behavior: 'vip_transport', hull: 100, position: { x: -100, y: -25, z: -40 } }
                    ],
                    neutrals: [
                        { type: 'TEMPEST', behavior: 'patrol', faction: 'MARSHALL_AUTHORITY', position: { x: 100, y: -30, z: 80 } },
                        { type: 'ADVENTURE', behavior: 'research', faction: 'DEEP_RESEARCH_ALLIANCE', position: { x: 50, y: -50, z: -120 } }
                    ]
                },
                'STRATEGIC_ASSAULT': {
                    name: 'Fleet Command',
                    description: 'Lead strategic assault with TSUNAMI carrier support',
                    objectives: [
                        { type: 'COORDINATE_FLEET', description: 'Coordinate with TSUNAMI strategic carrier', completed: false, progress: 0, target: 1 },
                        { type: 'ELIMINATE_COMMAND', description: 'Destroy enemy TEMPEST command submarine', completed: false, progress: 0, target: 1 },
                        { type: 'SECURE_ZONE', description: 'Clear area of all hostile forces', completed: false, progress: 0, target: 4 }
                    ],
                    timeLimit: 2400, // 40 minutes
                    reward: { experience: 500, skillPoints: 8, reputation: { 'MARSHALL_AUTHORITY': 15 } },
                    allies: [
                        { type: 'TSUNAMI', name: 'Carrier-Alpha', behavior: 'carrier_support', hull: 300, position: { x: -200, y: -50, z: -100 } }
                    ],
                    enemies: [
                        { type: 'TEMPEST', behavior: 'command', alertLevel: 'maximum', position: { x: 150, y: -40, z: 50 } },
                        { type: 'MISSION', behavior: 'tactical_strike', alertLevel: 'high', position: { x: 200, y: -35, z: -80 } },
                        { type: 'SQUALL', behavior: 'fighter_escort', alertLevel: 'high', position: { x: 120, y: -30, z: 100 } },
                        { type: 'THUNDER', behavior: 'support', alertLevel: 'medium', position: { x: 180, y: -45, z: 20 } }
                    ]
                }
            },
            stats: {
                missionsCompleted: 0,
                totalExperience: 0,
                availableSkillPoints: 0
            }
        };

        this.scenarioTimer = 0;
        this.patrolTimer = 0;
        this.stealthTimer = 0;
        this.aidTimer = 0;
        this.lastStealthCheck = 0;
    }

    startScenario(scenarioId) {
        const scenario = this.scenarios.available[scenarioId];
        if (!scenario) {
            console.warn(`Scenario ${scenarioId} not found`);
            return;
        }

        // Reset scenario state
        this.scenarios.current = {
            id: scenarioId,
            ...JSON.parse(JSON.stringify(scenario)), // Deep copy
            startTime: Date.now(),
            timeElapsed: 0
        };

        this.scenarioTimer = 0;
        this.patrolTimer = 0;
        this.stealthTimer = 0;
        this.aidTimer = 0;
        this.lastStealthCheck = 0;

        // Spawn NPC submarines for the scenario
        this.scenarios.current.npcs = this.spawnScenarioNPCs(this.scenarios.current);

        console.log(`Started scenario: ${scenario.name}`);
        if (this.scenarios.current.npcs.length > 0) {
            console.log(`📡 Spawned ${this.scenarios.current.npcs.length} NPC submarines for scenario`);
        }
        this.updateScenarioDisplay();
    }

    updateScenariosSystem(deltaTime) {
        if (!this.scenarios.current) return;

        this.scenarioTimer += deltaTime;
        this.scenarios.current.timeElapsed = this.scenarioTimer;

        // Check time limit
        if (this.scenarioTimer >= this.scenarios.current.timeLimit) {
            this.failScenario('Time limit exceeded');
            return;
        }

        // Update objectives based on scenario type
        const scenario = this.scenarios.current;
        let allCompleted = true;

        for (let objective of scenario.objectives) {
            if (!objective.completed) {
                this.updateObjective(objective, deltaTime);
                if (!objective.completed) {
                    allCompleted = false;
                }
            }
        }

        // Check for scenario completion
        if (allCompleted) {
            this.completeScenario();
        }

        // Update display every 0.5 seconds
        if (this.scenarioTimer % 0.5 < deltaTime) {
            this.updateScenarioDisplay();
        }
    }

    updateObjective(objective, deltaTime) {
        switch (objective.type) {
        case 'PATROL_AREA':
            this.patrolTimer += deltaTime;
            objective.progress = this.patrolTimer;
            if (objective.progress >= objective.target) {
                objective.completed = true;
            }
            break;

        case 'IDENTIFY_CONTACTS':
            const sealifeSystem = window.sealifeSystem ? window.sealifeSystem() : null;
            if (sealifeSystem) {
                const contacts = sealifeSystem.getSonarContacts();
                const identifiedCount = contacts.filter(contact => contact.identified).length;
                objective.progress = identifiedCount;
                if (objective.progress >= objective.target) {
                    objective.completed = true;
                }
            }
            break;

        case 'MAINTAIN_STEALTH':
            const currentSignature = this.getCurrentSonarSignature();
            if (currentSignature <= 10) {
                this.stealthTimer += deltaTime;
                objective.progress = this.stealthTimer;
                if (objective.progress >= objective.target) {
                    objective.completed = true;
                }
            } else {
                // Reset stealth timer if detected
                this.stealthTimer = 0;
                objective.progress = 0;
            }
            break;

        case 'REACH_WAYPOINT':
            // For now, just mark as completed after 30 seconds of movement
            if (this.speed > 5) {
                objective.progress += deltaTime;
                if (objective.progress >= 30) {
                    objective.completed = true;
                }
            }
            break;

        case 'DESTROY_TARGETS':
            // This would need integration with combat system
            // For now, simulate progress based on torpedo launches
            break;

        case 'SURVIVE_DAMAGE':
            const hullPercent = (this.systems.hull.hp / this.systems.hull.maxHP) * 100;
            if (hullPercent >= objective.target) {
                objective.progress = hullPercent;
            } else {
                this.failScenario('Hull integrity too low');
            }
            break;

        case 'LOCATE_TARGET':
            // Simulate finding target after some time exploring
            if (this.speed > 0) {
                objective.progress += deltaTime;
                if (objective.progress >= 60) { // Found after 1 minute
                    objective.completed = true;
                }
            }
            break;

        case 'PROVIDE_AID':
            // Simulate providing aid when stationary or slow
            if (this.speed < 5) {
                this.aidTimer += deltaTime;
                objective.progress = this.aidTimer;
                if (objective.progress >= objective.target) {
                    objective.completed = true;
                }
            }
            break;
        }
    }

    completeScenario() {
        const scenario = this.scenarios.current;
        console.log(`Scenario completed: ${scenario.name}`);

        // Award rewards
        this.scenarios.stats.totalExperience += scenario.reward.experience;
        this.scenarios.stats.availableSkillPoints += scenario.reward.skillPoints;
        this.scenarios.stats.missionsCompleted++;

        // Apply reputation rewards if available
        if (scenario.reward.reputation && window.reputationSystem) {
            for (const [faction, amount] of Object.entries(scenario.reward.reputation)) {
                window.reputationSystem.modifyReputation(faction, amount, `Scenario: ${scenario.name}`);
                console.log(`🏆 Reputation gained: ${faction} +${amount}`);
            }
        }

        // End scenario
        this.scenarios.current = null;
        this.updateScenarioDisplay();
    }

    failScenario(reason) {
        console.log(`Scenario failed: ${reason}`);
        this.scenarios.current = null;
        this.updateScenarioDisplay();
    }

    updateScenarioDisplay() {
        const statusElement = document.getElementById('status');
        if (!statusElement) return;

        if (!this.scenarios.current) {
            statusElement.textContent = 'Sub War 2060 - Ready';
            return;
        }

        const scenario = this.scenarios.current;
        const timeRemaining = Math.max(0, scenario.timeLimit - this.scenarioTimer);
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = Math.floor(timeRemaining % 60);

        let statusText = `Mission: ${scenario.name} | Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Show current objective
        const activeObjective = scenario.objectives.find(obj => !obj.completed);
        if (activeObjective) {
            let progressText = '';
            switch (activeObjective.type) {
            case 'PATROL_AREA':
                progressText = `${Math.floor(activeObjective.progress)}s/${activeObjective.target}s`;
                break;
            case 'IDENTIFY_CONTACTS':
                progressText = `${activeObjective.progress}/${activeObjective.target}`;
                break;
            case 'MAINTAIN_STEALTH':
                progressText = `${Math.floor(activeObjective.progress)}s/${activeObjective.target}s`;
                break;
            default:
                progressText = `${Math.floor((activeObjective.progress / activeObjective.target) * 100)}%`;
            }
            statusText += ` | ${activeObjective.description} (${progressText})`;
        }

        statusElement.textContent = statusText;
    }

    // Skill point spending system
    spendSkillPoint(skill) {
        if (this.scenarios.stats.availableSkillPoints <= 0) {
            console.log('No skill points available');
            return false;
        }

        if (this.skills[skill] >= 10) {
            console.log(`${skill} already at maximum level`);
            return false;
        }

        this.skills[skill]++;
        this.scenarios.stats.availableSkillPoints--;
        console.log(`${skill} increased to level ${this.skills[skill]}`);
        return true;
    }

    // Spawn NPC submarines for scenario
    spawnScenarioNPCs(scenario) {
        if (!scenario || !window.gameState || !window.gameState.scene) {
            console.warn('Cannot spawn NPCs - missing scenario or game scene');
            return [];
        }

        const npcs = [];

        // Spawn enemy submarines
        if (scenario.enemies) {
            scenario.enemies.forEach((enemyData, index) => {
                try {
                    const npc = new Submarine(window.gameState.scene, enemyData.type, true);
                    if (enemyData.position) {
                        npc.position.set(enemyData.position.x, enemyData.position.y || -30, enemyData.position.z);
                    }
                    npc.alertLevel = enemyData.alertLevel || 'medium';
                    npc.behavior = enemyData.behavior || 'patrol';
                    npc.isHostile = true;
                    npc.init();
                    npcs.push(npc);
                    console.log(`🚁 Spawned enemy NPC: ${enemyData.type} (${enemyData.behavior})`);
                } catch (error) {
                    console.error(`Failed to spawn enemy NPC ${enemyData.type}:`, error);
                }
            });
        }

        // Spawn allied submarines
        if (scenario.allies) {
            scenario.allies.forEach((allyData, index) => {
                try {
                    const npc = new Submarine(window.gameState.scene, allyData.type, true);
                    if (allyData.position) {
                        npc.position.set(allyData.position.x, allyData.position.y || -30, allyData.position.z);
                    }
                    npc.name = allyData.name || `Ally-${index}`;
                    npc.behavior = allyData.behavior || 'escort';
                    npc.hull = allyData.hull || npc.hull;
                    npc.isHostile = false;
                    npc.init();
                    npcs.push(npc);
                    console.log(`🤝 Spawned ally NPC: ${allyData.type} (${allyData.name})`);
                } catch (error) {
                    console.error(`Failed to spawn ally NPC ${allyData.type}:`, error);
                }
            });
        }

        // Spawn neutral submarines
        if (scenario.neutrals) {
            scenario.neutrals.forEach((neutralData, index) => {
                try {
                    const npc = new Submarine(window.gameState.scene, neutralData.type, true);
                    if (neutralData.position) {
                        npc.position.set(neutralData.position.x, neutralData.position.y || -30, neutralData.position.z);
                    }
                    npc.behavior = neutralData.behavior || 'patrol';
                    npc.faction = neutralData.faction || 'NEUTRAL';
                    npc.isHostile = false;
                    npc.isNeutral = true;
                    npc.init();
                    npcs.push(npc);
                    console.log(`⚪ Spawned neutral NPC: ${neutralData.type} (${neutralData.faction})`);
                } catch (error) {
                    console.error(`Failed to spawn neutral NPC ${neutralData.type}:`, error);
                }
            });
        }

        return npcs;
    }

    destroy() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh = null;
        }

        // Clean up reticles
        if (this.firingReticleMesh) {
            this.scene.remove(this.firingReticleMesh);
            this.firingReticleMesh = null;
        }

        if (this.maneuverReticleMesh) {
            this.scene.remove(this.maneuverReticleMesh);
            this.maneuverReticleMesh = null;
        }

        // Clean up maneuver icon elements
        if (this.maneuverIconElement) {
            document.body.removeChild(this.maneuverIconElement);
            this.maneuverIconElement = null;
        }

        if (this.centerIconElement) {
            document.body.removeChild(this.centerIconElement);
            this.centerIconElement = null;
        }

        if (this.deadZoneElement) {
            document.body.removeChild(this.deadZoneElement);
            this.deadZoneElement = null;
        }

        console.log('Submarine destroyed!');
    }

    getPosition() {
        return this.mesh ? this.mesh.position.clone() : new THREE.Vector3(0, 0, 0);
    }

    getRotation() {
        return this.mesh ? this.mesh.rotation.clone() : new THREE.Euler(0, 0, 0);
    }
}

// Global submarine instance
let playerSubmarine = null;

// Initialize submarine (called from game.js)
function initSubmarine(scene, submarineClass = 'COBRA') {
    console.log('🚀 Starting submarine initialization...');
    console.log('🚢 Selected submarine class:', submarineClass);
    
    // Clean up existing submarine first
    if (playerSubmarine) {
        console.log('🗑️ Cleaning up existing submarine...');
        if (playerSubmarine.mesh && playerSubmarine.mesh.parent) {
            playerSubmarine.mesh.parent.remove(playerSubmarine.mesh);
        }
        playerSubmarine = null;
    }

    if (!scene) {
        console.error('❌ Scene is null/undefined - cannot create submarine');
        return null;
    }

    if (playerSubmarine) {
        console.log('🔄 Destroying existing submarine...');
        playerSubmarine.destroy();
    }

    try {
        console.log('🛠️ Creating new Submarine instance...');
        playerSubmarine = new Submarine(scene, submarineClass);

        console.log('⚙️ Initializing submarine (mesh, controls, etc.)...');
        playerSubmarine.init();

        // Initialize integrated mapping system
        console.log('🗺️ Initializing integrated mapping system...');
        if (window.gameState && window.IntegratedMappingSystem) {
            playerSubmarine.mappingSystem = new IntegratedMappingSystem(window.gameState, playerSubmarine);
            console.log('✅ Mapping system initialized successfully');
        } else {
            console.warn('⚠️ Could not initialize mapping system - gameState or IntegratedMappingSystem not available');
        }
        
        // Initialize underwater structures system
        console.log('🏭 Initializing underwater structures...');
        if (window.UnderwaterStructuresManager && scene) {
            window.gameState.structuresManager = new UnderwaterStructuresManager(scene, window.gameState);
            console.log('✅ Underwater structures initialized successfully');
        } else {
            console.warn('⚠️ Could not initialize structures - UnderwaterStructuresManager not available');
        }

        console.log('✅ Submarine module loaded and initialized successfully');
        console.log('🎯 Submarine position:', playerSubmarine.getPosition());
        console.log('🎯 Submarine mesh:', playerSubmarine.mesh);

        return playerSubmarine;
    } catch (error) {
        console.error('❌ Submarine initialization failed:', error);
        return null;
    }
}

// Update submarine (called from game loop)
function updateSubmarine(deltaTime) {
    if (playerSubmarine) {
        playerSubmarine.update(deltaTime);
    }
    
    // Update terrain shader animation
    if (window.simpleTerrain && window.simpleTerrain.update) {
        window.simpleTerrain.update(deltaTime);
    }
}

// Global functions for contact management
function toggleContactDetails(contactIndex) {
    if (playerSubmarine) {
        if (playerSubmarine.expandedContacts.has(contactIndex)) {
            playerSubmarine.expandedContacts.delete(contactIndex);
        } else {
            playerSubmarine.expandedContacts.add(contactIndex);
        }
        // Force update display
        const sealifeSystem = window.sealifeSystem();
        if (sealifeSystem) {
            const contacts = sealifeSystem.getSonarContacts();
            playerSubmarine.updateSonarContactsDisplay(contacts);
        }
    }
}

function selectSonarContact(contactIndex) {
    if (playerSubmarine) {
        playerSubmarine.selectedSonarContact = contactIndex;
        // Force update display
        const sealifeSystem = window.sealifeSystem();
        if (sealifeSystem) {
            const contacts = sealifeSystem.getSonarContacts();
            playerSubmarine.updateSonarContactsDisplay(contacts);
        }
    }
}

// Scenario management functions
function startScenario(scenarioId) {
    if (playerSubmarine) {
        playerSubmarine.startScenario(scenarioId);
    }
}

function getScenarioStats() {
    if (playerSubmarine) {
        return playerSubmarine.scenarios.stats;
    }
    return null;
}

function spendSkillPoint(skill) {
    if (playerSubmarine) {
        return playerSubmarine.spendSkillPoint(skill);
    }
    return false;
}

function getAvailableScenarios() {
    if (playerSubmarine) {
        return Object.keys(playerSubmarine.scenarios.available);
    }
    return [];
}

function getCurrentScenario() {
    if (playerSubmarine) {
        return playerSubmarine.scenarios.current;
    }
    return null;
}

// Export functions
window.initSubmarine = initSubmarine;
window.updateSubmarine = updateSubmarine;
window.playerSubmarine = () => playerSubmarine;

// Force submarine recreation for debugging
window.forceRecreateCobra = function() {
    console.log('🐍 Force recreating Cobra submarine...');
    if (window.gameState && window.gameState.scene) {
        initSubmarine(window.gameState.scene, 'COBRA');
    } else {
        console.error('❌ No scene available for submarine recreation');
    }
};

// Debug function to check submarine specifications
window.checkSubmarineSpecs = function() {
    console.log('🔍 Available submarine specifications:');
    console.log('Available classes:', Object.keys(SUBMARINE_SPECIFICATIONS));
    console.log('COBRA specs available:', !!SUBMARINE_SPECIFICATIONS.COBRA);
    if (SUBMARINE_SPECIFICATIONS.COBRA) {
        console.log('COBRA details:', SUBMARINE_SPECIFICATIONS.COBRA);
    }
    return SUBMARINE_SPECIFICATIONS;
};
window.toggleContactDetails = toggleContactDetails;
window.selectSonarContact = selectSonarContact;
window.startScenario = startScenario;
window.getScenarioStats = getScenarioStats;
window.spendSkillPoint = spendSkillPoint;
window.getAvailableScenarios = getAvailableScenarios;
window.getCurrentScenario = getCurrentScenario;

// Export Submarine class for testing
window.Submarine = Submarine;
