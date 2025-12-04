// Sub War 2060 - Pilot Skills System
// Manages pilot skills: Piloting, Gunnery, Sensors, Engineering

class PilotSkills {
    constructor() {
        this.skills = {
            piloting: 5,      // 1-10: Affects acceleration, deceleration, yaw/pitch rates, turning radius
            gunnery: 5,       // 1-10: Reduces SCAV weapon deviation, increases torpedo lock-on speed
            sensors: 5,       // 1-10: Increases passive and active sensor sensitivity
            engineering: 5    // 1-10: Increases polymer armor redistribution rate, reduces persistent damage %
        };

        this.experience = {
            piloting: 0,
            gunnery: 0,
            sensors: 0,
            engineering: 0
        };

        // XP required for each skill level
        this.xpRequirements = {
            1: 0,
            2: 100,
            3: 300,
            4: 600,
            5: 1000,
            6: 1500,
            7: 2200,
            8: 3000,
            9: 4000,
            10: 5500
        };
    }

    // Get current skill level based on experience
    getSkillLevel(skillName) {
        const xp = this.experience[skillName];
        for (let level = 10; level >= 1; level--) {
            if (xp >= this.xpRequirements[level]) {
                return level;
            }
        }
        return 1;
    }

    // Add experience to a skill
    addExperience(skillName, amount) {
        if (this.experience[skillName] !== undefined) {
            const oldLevel = this.getSkillLevel(skillName);
            this.experience[skillName] += amount;
            const newLevel = this.getSkillLevel(skillName);

            this.skills[skillName] = newLevel;

            if (newLevel > oldLevel) {
                this.onSkillLevelUp(skillName, newLevel);
            }
        }
    }

    onSkillLevelUp(skillName, newLevel) {
        console.log(`🎖️ Skill Level Up! ${skillName.toUpperCase()} is now level ${newLevel}`);

        // Show notification to player
        if (window.showNotification) {
            window.showNotification(`Skill Level Up: ${skillName.toUpperCase()} → ${newLevel}`, 'skill_levelup');
        }
    }

    // PILOTING SKILL EFFECTS
    getPilotingMultipliers() {
        const level = this.skills.piloting;
        return {
            accelerationMultiplier: 0.7 + (level * 0.05), // 75% to 120%
            decelerationMultiplier: 0.7 + (level * 0.05),
            yawRateMultiplier: 0.8 + (level * 0.04), // 80% to 120%
            pitchRateMultiplier: 0.8 + (level * 0.04),
            rollRateMultiplier: 0.8 + (level * 0.04),
            turningRadiusMultiplier: 1.3 - (level * 0.04) // 130% to 90% (lower is better)
        };
    }

    // GUNNERY SKILL EFFECTS
    getGunneryEffects() {
        const level = this.skills.gunnery;
        return {
            scavWeaponAccuracy: 0.5 + (level * 0.05), // 55% to 100% accuracy
            torpedoLockSpeedMultiplier: 0.7 + (level * 0.05), // 75% to 120% lock speed
            weaponDeviationReduction: level * 0.08, // 8% to 80% deviation reduction
            burstAccuracyRetention: 0.6 + (level * 0.04) // Sustained fire accuracy retention
        };
    }

    // SENSORS SKILL EFFECTS
    getSensorEffects() {
        const level = this.skills.sensors;
        return {
            passiveSonarSensitivity: 0.8 + (level * 0.04), // 80% to 120%
            activeSonarSensitivity: 0.8 + (level * 0.04),
            contactDetectionRange: 0.85 + (level * 0.025), // 85% to 110% range
            signatureAnalysisAccuracy: 0.7 + (level * 0.05), // 70% to 120%
            thermalLayerDetection: level >= 6 ? true : false, // Unlock at level 6
            acousticSignatureRecognition: level >= 8 ? true : false // Unlock at level 8
        };
    }

    // ENGINEERING SKILL EFFECTS
    getEngineeringEffects() {
        const level = this.skills.engineering;
        return {
            armorRedistributionRate: 0.7 + (level * 0.05), // 75% to 120% speed
            persistentDamageReduction: level * 0.015, // 1.5% to 15% less permanent damage
            repairEfficiency: 0.8 + (level * 0.03), // 80% to 110% repair effectiveness
            systemRecoveryRate: 0.8 + (level * 0.04), // 80% to 120% system recovery
            emergencyBlowRate: level >= 5 ? 1.2 : 1.0, // 20% faster emergency blow at level 5+
            fuelEfficiency: 0.95 + (level * 0.01) // 95% to 105% fuel efficiency
        };
    }

    // Apply skill effects to submarine systems
    applySkillEffects(submarine) {
        const piloting = this.getPilotingMultipliers();
        const gunnery = this.getGunneryEffects();
        const sensors = this.getSensorEffects();
        const engineering = this.getEngineeringEffects();

        // Apply piloting effects
        if (submarine.specs) {
            submarine.specs.accelerationRate *= piloting.accelerationMultiplier;
            submarine.specs.decelerationRate *= piloting.decelerationMultiplier;
            submarine.specs.baseTurnRate *= piloting.yawRateMultiplier;
            submarine.specs.pitchRate *= piloting.pitchRateMultiplier;
            submarine.specs.rollRate *= piloting.rollRateMultiplier;
        }

        // Apply engineering effects to armor system
        if (submarine.armor) {
            submarine.armor.redistributionRate *= engineering.armorRedistributionRate;
            submarine.armor.persistentDamageMultiplier = 1.0 - engineering.persistentDamageReduction;
        }

        // Store skill effects for other systems to use
        submarine.skillEffects = {
            piloting: piloting,
            gunnery: gunnery,
            sensors: sensors,
            engineering: engineering
        };
    }

    // Award XP based on actions
    awardExperienceForAction(action, details = {}) {
        switch (action) {
            case 'successful_maneuver':
                this.addExperience('piloting', 5 + (details.difficulty || 0));
                break;
            case 'weapon_hit':
                this.addExperience('gunnery', 10 + (details.damage || 0) / 10);
                break;
            case 'torpedo_intercept':
                this.addExperience('gunnery', 25); // Point defense success
                break;
            case 'contact_detected':
                this.addExperience('sensors', 8 + (details.range || 0) / 100);
                break;
            case 'contact_identified':
                this.addExperience('sensors', 15);
                break;
            case 'successful_repair':
                this.addExperience('engineering', 12 + (details.damageRepaired || 0) / 5);
                break;
            case 'armor_redistribution':
                this.addExperience('engineering', 3);
                break;
            case 'mission_complete':
                // Award XP to all skills based on mission performance
                const baseXP = details.baseXP || 50;
                this.addExperience('piloting', baseXP * 0.3);
                this.addExperience('gunnery', baseXP * 0.3);
                this.addExperience('sensors', baseXP * 0.2);
                this.addExperience('engineering', baseXP * 0.2);
                break;
        }
    }

    // Get skill progress information for UI
    getSkillProgress() {
        const progress = {};

        for (const [skillName, xp] of Object.entries(this.experience)) {
            const currentLevel = this.getSkillLevel(skillName);
            const nextLevel = Math.min(currentLevel + 1, 10);
            const currentLevelXP = this.xpRequirements[currentLevel];
            const nextLevelXP = this.xpRequirements[nextLevel];

            progress[skillName] = {
                level: currentLevel,
                experience: xp,
                currentLevelXP: currentLevelXP,
                nextLevelXP: nextLevelXP,
                progressPercent: nextLevel <= 10 ?
                    ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 100
            };
        }

        return progress;
    }

    // Save/load system
    serialize() {
        return {
            skills: { ...this.skills },
            experience: { ...this.experience }
        };
    }

    deserialize(data) {
        if (data.skills) this.skills = { ...data.skills };
        if (data.experience) this.experience = { ...data.experience };

        // Update skill levels based on experience
        for (const skillName of Object.keys(this.skills)) {
            this.skills[skillName] = this.getSkillLevel(skillName);
        }
    }
}

// NPC Pilot Class - For enemy and friendly AI submarines
class NPCPilot {
    constructor(name, callsign, faction, skills = null) {
        this.name = name;
        this.callsign = callsign;
        this.faction = faction;
        this.personality = this.generatePersonality();

        // Initialize skills (random or specified)
        this.skills = skills || this.generateRandomSkills();
        this.combatExperience = Math.floor(Math.random() * 100);
        this.missionHistory = [];
        this.relationships = new Map(); // Reputation with player and other pilots
    }

    generatePersonality() {
        const personalities = [
            'PROFESSIONAL', 'COCKY', 'CAUTIOUS', 'AGGRESSIVE',
            'FRIENDLY', 'COLD', 'SARCASTIC', 'ROOKIE', 'VETERAN'
        ];
        return personalities[Math.floor(Math.random() * personalities.length)];
    }

    generateRandomSkills() {
        const baseSkill = 3 + Math.floor(Math.random() * 4); // 3-6 base
        const variation = () => Math.max(1, Math.min(10, baseSkill + Math.floor(Math.random() * 3) - 1));

        return {
            piloting: variation(),
            gunnery: variation(),
            sensors: variation(),
            engineering: variation()
        };
    }

    // Get skill-modified accuracy for this pilot
    getWeaponAccuracy(weaponType) {
        const baseAccuracy = weaponType.accuracy || 0.7;
        const gunneryBonus = (this.skills.gunnery - 5) * 0.05; // ±25% from skill
        const personalityModifier = this.getPersonalityModifier('accuracy');

        return Math.max(0.1, Math.min(0.98, baseAccuracy + gunneryBonus + personalityModifier));
    }

    // Get piloting skill effects
    getPilotingEffects() {
        const pilotingLevel = this.skills.piloting;
        const personalityModifier = this.getPersonalityModifier('piloting');

        return {
            reactionTime: Math.max(0.3, 1.0 - (pilotingLevel * 0.07) + personalityModifier.reactionTime),
            evasionSkill: Math.min(0.9, (pilotingLevel * 0.08) + personalityModifier.evasion),
            aggressiveness: Math.max(0.2, Math.min(0.9, 0.5 + personalityModifier.aggression))
        };
    }

    getPersonalityModifier(category) {
        switch (this.personality) {
            case 'PROFESSIONAL':
                return category === 'accuracy' ? 0.05 : { reactionTime: -0.1, evasion: 0.1, aggression: 0.0 };
            case 'COCKY':
                return category === 'accuracy' ? -0.05 : { reactionTime: 0.0, evasion: -0.05, aggression: 0.2 };
            case 'CAUTIOUS':
                return category === 'accuracy' ? 0.02 : { reactionTime: -0.05, evasion: 0.15, aggression: -0.2 };
            case 'AGGRESSIVE':
                return category === 'accuracy' ? -0.02 : { reactionTime: 0.05, evasion: -0.1, aggression: 0.3 };
            case 'ROOKIE':
                return category === 'accuracy' ? -0.15 : { reactionTime: 0.2, evasion: -0.1, aggression: -0.1 };
            case 'VETERAN':
                return category === 'accuracy' ? 0.1 : { reactionTime: -0.15, evasion: 0.2, aggression: 0.1 };
            default:
                return category === 'accuracy' ? 0.0 : { reactionTime: 0.0, evasion: 0.0, aggression: 0.0 };
        }
    }

    // Generate contextual dialog based on personality and situation
    generateDialog(context, playerReputation = 0) {
        const personalityDialogs = {
            'PROFESSIONAL': {
                greeting: "This is {callsign}, maintaining patrol pattern.",
                combat_start: "Contact confirmed. Engaging target.",
                hit_taken: "Taking damage. Adjusting tactics.",
                victory: "Target neutralized. Mission accomplished.",
                retreat: "Tactical withdrawal initiated."
            },
            'COCKY': {
                greeting: "Well, well... {callsign} here. Try to keep up.",
                combat_start: "Finally, some action! This'll be over quick.",
                hit_taken: "Lucky shot! You won't get another.",
                victory: "Did you really think you had a chance?",
                retreat: "This isn't over!"
            },
            'CAUTIOUS': {
                greeting: "This is {callsign}. Proceeding with caution.",
                combat_start: "Multiple contacts. Recommend careful approach.",
                hit_taken: "Heavy damage sustained. Requesting support.",
                victory: "Threat eliminated. Area secured.",
                retreat: "Situation untenable. Breaking contact."
            }
        };

        const dialogs = personalityDialogs[this.personality] || personalityDialogs['PROFESSIONAL'];
        const message = dialogs[context] || "No response.";

        return message.replace('{callsign}', this.callsign);
    }
}

// Global pilot skills instance for the player
window.playerSkills = new PilotSkills();

// Export classes for testing
window.PilotSkills = PilotSkills;
window.NPCPilot = NPCPilot;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PilotSkills, NPCPilot };
}