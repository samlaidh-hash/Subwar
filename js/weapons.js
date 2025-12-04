// Sub War 2060 - Weapons Module
// Elite-Style Submarine Fighter Weapons System

// New Weapon Types Configuration
const WEAPON_TYPES = {
    // Rockets (Unguided)
    HIVELOC_ROCKETS: {
        name: 'HiVeloc Rockets',
        type: 'rocket',
        speed: 300, // knots (~154 m/s)
        damage: 40,
        penetration: 25, // light armor pen
        reloadTime: 500, // ms - very fast
        range: 1500, // meters
        lockRequired: false,
        ammoCount: 100,
        color: 0xff6600,
        trail: true
    },

    // SCAV (Supercavitating) Rockets - Ultra-high speed straight-firing
    SCAV_ROCKETS: {
        name: 'SCAV Rockets',
        type: 'scav_rocket',
        speed: 400, // knots (~206 m/s) - extremely fast
        damage: 60,
        penetration: 35, // moderate armor pen but high speed impact
        reloadTime: 1000, // ms - faster than torpedoes
        range: 1000, // meters - shorter range due to straight-line trajectory
        lockRequired: false, // Straight-firing, no guidance
        ammoCount: 50, // Limited ammo due to advanced technology
        color: 0x00ffff, // Cyan for supercavitation effect
        trail: true,
        supercavitating: true, // Special physics - travels in bubble
        straightFiring: true, // No homing, pure ballistic
        cavitationBubbles: true // Creates visible supercavitation effect
    },

    // SCAV Cannons - Replaces launcher slots, right-click to fire
    SCAV_AUTOCANNON: {
        name: 'SCAV Autocannon',
        type: 'scav_cannon',
        projectileSpeed: 1300, // m/s - constant speed
        damage: 25, // Medium damage
        penetration: 15,
        fireRate: 600, // rounds per minute
        magazineSize: 300,
        range: 400, // meters
        accuracy: 0.85, // 85% accuracy baseline
        convergenceDistance: 200, // meters for multiple cannons
        color: 0x00aaff,
        muzzleFlash: true,
        rightClickFire: true,
        weaponSlot: 'launcher_replacement'
    },

    SCAV_GATLING: {
        name: 'SCAV Gatling Gun',
        type: 'scav_cannon',
        projectileSpeed: 1300, // m/s
        damage: 8, // Low damage, high volume
        penetration: 5,
        fireRate: 3000, // rounds per minute
        magazineSize: 2000,
        range: 300, // meters
        accuracy: 0.65, // 65% accuracy - least accurate
        convergenceDistance: 200,
        color: 0x0088ff,
        muzzleFlash: true,
        rightClickFire: true,
        weaponSlot: 'launcher_replacement'
    },

    SCAV_FIELD_GUN: {
        name: 'SCAV Field Gun',
        type: 'scav_cannon',
        projectileSpeed: 1300, // m/s
        damage: 80, // High damage
        penetration: 40,
        fireRate: 100, // rounds per minute
        magazineSize: 50,
        range: 500, // meters
        accuracy: 0.95, // 95% accuracy - most accurate
        convergenceDistance: 200,
        color: 0x0066ff,
        muzzleFlash: true,
        rightClickFire: true,
        weaponSlot: 'launcher_replacement'
    },

    // SCAV Point Defense Turret - Automatic torpedo defense
    SCAV_POINT_DEFENSE: {
        name: 'SCAV Point Defense Turret',
        type: 'scav_point_defense',
        projectileSpeed: 1200, // m/s
        damage: 2, // Very low damage, but torpedo kill on hit
        penetration: 1,
        fireRate: 1200, // rounds per minute
        magazineSize: 2400,
        range: 200, // meters
        accuracy: 0.75, // Low-medium accuracy
        autoTarget: true, // Automatically engages torpedoes
        mountType: 'dorsal_ventral', // Can be mounted dorsal or ventral
        priorityTargets: ['torpedo'],
        color: 0x44aaff,
        weaponSlot: 'launcher_replacement'
    },

    // WISKR Drones - Available early campaign from Research Alliance
    WISKR_DRONES: {
        name: 'WISKR Active Sonar Drones',
        type: 'wiskr_drone',
        speed: 80, // knots - moderate speed for extended range
        damage: 0, // No damage - reconnaissance only
        penetration: 0,
        reloadTime: 3000, // ms - like torpedoes
        range: 20000, // meters - 20km maximum range
        lockRequired: false, // Fired like torpedo but doesn't need target lock
        ammoCount: 8, // Limited ammo - advanced technology
        color: 0x00ffaa, // Green-cyan for friendly reconnaissance
        trail: true,
        activationRange: 300, // meters - when active sonar starts
        sonarRange: 1000, // meters - 1km sonar sphere radius
        sonarExclusionAngle: 90, // degrees - rear cone that isn't illuminated
        weaponSlot: 'launcher_replacement'
    },

    // Torpedoes (Guided)
    HEAVY_TORPEDOES: {
        name: 'Heavy Torpedoes',
        type: 'torpedo',
        speed: 100, // knots (~51 m/s)
        damage: 150,
        penetration: 60, // heavy armor pen
        reloadTime: 8000, // ms - long lock-on time
        range: 4000, // meters
        lockRequired: true,
        lockTime: 8000, // ms
        ammoCount: 6,
        maneuverability: 0.4, // low
        color: 0xff0000,
        trail: true
    },

    LIGHT_TORPEDOES: {
        name: 'Light Torpedoes',
        type: 'torpedo',
        speed: 150, // knots (~77 m/s)
        damage: 75,
        penetration: 35,
        reloadTime: 4000, // ms - medium lock-on time
        range: 2500, // meters
        lockRequired: true,
        lockTime: 4000, // ms
        ammoCount: 12,
        maneuverability: 0.7, // medium
        color: 0x00ff00,
        trail: true
    },

    INTERCEPTOR_TORPEDOES: {
        name: 'Interceptor Torpedoes',
        type: 'interceptor',
        speed: 200, // knots (~103 m/s)
        damage: 30,
        penetration: 20,
        reloadTime: 2000, // ms - no lock-on needed
        range: 2000, // meters
        lockRequired: false,
        ammoCount: 20,
        maneuverability: 0.9, // high
        color: 0x0088ff,
        trail: true,
        autoTarget: true // Homes on nearest torpedo or sub
    },

    // Cannons (Direct fire) - Realistic ballistics with velocity drop-off
    LIGHT_CANNON: {
        name: 'Light Cannon',
        type: 'cannon',
        speed: 2700, // knots (~1400 m/s) - realistic cannon projectile velocity
        damage: 15,
        penetration: 10,
        reloadTime: 200, // ms - very fast
        range: 400, // meters - realistic effective range
        maxRange: 400, // velocity drops to zero
        lockRequired: false,
        fastLock: true, // Fast lock for lead calculation
        lockTime: 500, // ms
        ammoCount: 500,
        color: 0xffff00,
        trail: false
    },

    MEDIUM_CANNON: {
        name: 'Medium Cannon',
        type: 'cannon',
        speed: 2700, // knots (~1400 m/s) - consistent ballistic velocity
        damage: 35,
        penetration: 25,
        reloadTime: 800, // ms - medium fire rate
        range: 300, // meters - medium effective range
        maxRange: 300, // velocity drops to zero
        lockRequired: false,
        fastLock: true,
        lockTime: 1000, // ms
        ammoCount: 200,
        color: 0xff8800,
        trail: false
    },

    HEAVY_CANNON: {
        name: 'Heavy Cannon',
        type: 'cannon',
        speed: 2700, // knots (~1400 m/s) - consistent ballistic velocity
        damage: 60,
        penetration: 40,
        reloadTime: 2000, // ms - low fire rate
        range: 250, // meters - heavy cannon shorter range
        maxRange: 250, // velocity drops to zero
        lockRequired: false,
        fastLock: true,
        lockTime: 1500, // ms
        ammoCount: 80,
        color: 0xff4400,
        trail: false
    },

    // Point Defense (Auto-firing)
    POINT_DEFENSE: {
        name: 'Point Defense Turret',
        type: 'pointdefense',
        speed: 3000, // knots (~1550 m/s) - very high velocity for point defense
        damage: 8,
        penetration: 5,
        reloadTime: 50, // ms - very high rate of fire
        range: 200, // meters - short range point defense
        maxRange: 200, // velocity drops to zero
        lockRequired: false,
        autoFire: true,
        accuracy: 0.95, // 95% hit chance
        ammoCount: 2000,
        color: 0xffffff,
        trail: false,
        accuracy: 0.95 // Very accurate
    }
};

// Base Projectile Class
class Projectile {
    constructor(scene, position, rotation, weaponType, target = null) {
        this.scene = scene;
        this.position = position.clone();
        this.rotation = rotation.clone();
        this.weaponType = weaponType;
        this.target = target;
        this.originalTarget = target; // Store original target for retargeting after countermeasures

        // Physics
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.initialSpeed = weaponType.speed * 0.514444; // Convert knots to m/s
        this.speed = this.initialSpeed; // Current speed (will decrease over time)
        this.maxRange = weaponType.range;

        // State
        this.distanceTraveled = 0;
        this.lifeTime = 0;
        this.shouldDestroy = false;
        this.mesh = null;

        this.createMesh();
        this.initializeVelocity();
    }

    createMesh() {
        // Create basic projectile visual
        const geometry = new THREE.SphereGeometry(0.1, 6, 6);
        const material = new THREE.MeshBasicMaterial({
            color: this.weaponType.color,
            transparent: true,
            opacity: 0.8
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);

        // Add trail effect if specified
        if (this.weaponType.trail) {
            this.createTrail();
        }
    }

    createTrail() {
        // Simple line trail
        const trailGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-0.5, 0, 0) // Trail behind projectile
        ]);
        const trailMaterial = new THREE.LineBasicMaterial({
            color: this.weaponType.color,
            transparent: true,
            opacity: 0.6
        });
        this.trail = new THREE.Line(trailGeometry, trailMaterial);
        this.mesh.add(this.trail);
    }

    initializeVelocity() {
        // Set initial forward velocity
        const forward = new THREE.Vector3(1, 0, 0);
        forward.applyEuler(this.rotation);
        this.velocity = forward.multiplyScalar(this.speed);
    }

    update(deltaTime) {
        this.lifeTime += deltaTime;

        // Update velocity with ballistic drop-off for cannon projectiles
        if (this.weaponType.type === 'cannon' || this.weaponType.type === 'pointdefense') {
            this.updateBallisticVelocity();
        }

        // Move projectile
        const movement = this.velocity.clone().multiplyScalar(deltaTime);
        this.position.add(movement);
        this.distanceTraveled += movement.length();

        // Update mesh position
        if (this.mesh) {
            this.mesh.position.copy(this.position);
        }

        // Check for destruction conditions
        if (this.distanceTraveled > this.maxRange || this.speed < this.initialSpeed * 0.1) {
            this.shouldDestroy = true;
        }

        // Update guidance (override in subclasses)
        this.updateGuidance(deltaTime);

        // Check collisions
        this.checkCollisions();
    }

    updateBallisticVelocity() {
        // Calculate range progress (0 to 1)
        const rangeProgress = this.distanceTraveled / this.maxRange;

        if (rangeProgress < 0.9) {
            // Slow degradation over first 90% of range
            const slowDecay = 1 - (rangeProgress * 0.1); // Lose 10% speed over 90% of range
            this.speed = this.initialSpeed * slowDecay;
        } else {
            // Rapid drop in final 10%
            const finalProgress = (rangeProgress - 0.9) / 0.1; // 0 to 1 over final 10%
            const remainingSpeed = 0.9; // Start of final 10% at 90% speed
            const rapidDecay = remainingSpeed * (1 - Math.pow(finalProgress, 3)); // Cubic decay
            this.speed = this.initialSpeed * Math.max(0, rapidDecay);
        }

        // Update velocity magnitude while maintaining direction
        const direction = this.velocity.clone().normalize();
        this.velocity = direction.multiplyScalar(this.speed);
    }

    updateGuidance(deltaTime) {
        // Base class - no guidance (straight line)
    }

    checkCollisions() {
        // Enhanced collision check with directional damage
        if (window.getEnemySubmarines) {
            const enemies = window.getEnemySubmarines();
            enemies.forEach(enemy => {
                const distance = this.position.distanceTo(enemy.getPosition());
                if (distance < 2.0) { // Hit radius
                    this.onHit(enemy);
                }
            });
        }

        // Check collision with player submarine
        if (window.playerSubmarine && window.playerSubmarine()) {
            const player = window.playerSubmarine();
            const distance = this.position.distanceTo(player.getPosition());
            if (distance < 2.0) { // Hit radius
                this.onHit(player);
            }
        }

        // Check torpedo vs torpedo collisions
        if (this.type === 'torpedo' && window.getActiveTorpedoes) {
            const otherTorpedoes = window.getActiveTorpedoes().filter(t => t !== this);
            otherTorpedoes.forEach(otherTorpedo => {
                const distance = this.position.distanceTo(otherTorpedo.position);
                if (distance < 3.0) { // Torpedo collision radius
                    // Check if either torpedo evades
                    const thisEvaded = this.checkTorpedoEvasion(otherTorpedo);
                    const otherEvaded = otherTorpedo.checkTorpedoEvasion(this);
                    
                    // If neither evaded, they collide and both explode
                    if (!thisEvaded && !otherEvaded) {
                        console.log('Torpedo vs torpedo collision - both destroyed!');
                        this.explode();
                        otherTorpedo.explode();
                    }
                }
            });
        }
    }

    onHit(target) {
        // Apply damage with hit location detection
        if (target.takeDamage) {
            if (target.determineHitFacing) {
                // Advanced directional damage system
                const hitFacing = target.determineHitFacing(this.position, this.velocity);
                target.takeDamage(this.weaponType.damage, hitFacing);
                console.log(`${this.weaponType.name} hit ${hitFacing} facing for ${this.weaponType.damage} damage!`);
            } else {
                // Legacy damage system for enemies
                target.takeDamage(this.weaponType.damage);
                console.log(`${this.weaponType.name} hit for ${this.weaponType.damage} damage!`);
            }
        }
        this.shouldDestroy = true;
    }

    destroy() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            if (this.mesh.material) this.mesh.material.dispose();
        }
    }
}

// Rocket Class (Unguided)
class Rocket extends Projectile {
    createMesh() {
        // Rocket-specific visual
        const geometry = new THREE.CylinderGeometry(0.05, 0.08, 0.4, 8);
        const material = new THREE.MeshBasicMaterial({ color: this.weaponType.color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.z = Math.PI / 2; // Point forward
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);

        if (this.weaponType.trail) {
            this.createTrail();
        }
    }
}

// SCAV (Supercavitating) Rocket Class - Ultra-high speed straight-firing
class SCAVRocket extends Projectile {
    constructor(scene, position, rotation, weaponType) {
        super(scene, position, rotation, weaponType);
        this.supercavitationBubbles = [];
        this.bubbleUpdateTime = 0;
        this.bubbleSpawnRate = 0.05; // Spawn bubbles every 50ms
    }

    createMesh() {
        // SCAV rocket visual - sleeker, more advanced looking
        const geometry = new THREE.CylinderGeometry(0.04, 0.06, 0.5, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: this.weaponType.color,
            transparent: true,
            opacity: 0.9
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.z = Math.PI / 2; // Point forward
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);

        // Create supercavitation effect trail
        if (this.weaponType.trail) {
            this.createSCAVTrail();
        }
    }

    createSCAVTrail() {
        // Create supercavitation bubble trail effect
        const trailGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.3, 6);
        const trailMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x88ffff,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        this.trailMesh = new THREE.Mesh(trailGeometry, trailMaterial);
        this.trailMesh.rotation.z = Math.PI / 2;
        this.scene.add(this.trailMesh);
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Update supercavitation bubble effects
        if (this.weaponType.cavitationBubbles) {
            this.updateSupercavitationEffects(deltaTime);
        }

        // Update trail position
        if (this.trailMesh) {
            this.trailMesh.position.copy(this.position);
            this.trailMesh.position.x -= 0.4; // Trail behind rocket
            this.trailMesh.rotation.copy(this.mesh.rotation);
        }
    }

    updateSupercavitationEffects(deltaTime) {
        this.bubbleUpdateTime += deltaTime;
        
        // Spawn new cavitation bubbles
        if (this.bubbleUpdateTime >= this.bubbleSpawnRate) {
            this.spawnCavitationBubble();
            this.bubbleUpdateTime = 0;
        }

        // Update existing bubbles
        this.supercavitationBubbles.forEach((bubble, index) => {
            bubble.life += deltaTime;
            bubble.scale *= 0.98; // Bubbles shrink over time
            bubble.mesh.scale.setScalar(bubble.scale);
            bubble.mesh.material.opacity *= 0.95; // Fade out

            // Remove expired bubbles
            if (bubble.life > bubble.maxLife || bubble.mesh.material.opacity < 0.05) {
                this.scene.remove(bubble.mesh);
                this.supercavitationBubbles.splice(index, 1);
            }
        });
    }

    spawnCavitationBubble() {
        const bubbleGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.03, 6, 4);
        const bubbleMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaffff,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        const bubbleMesh = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        
        // Position bubble slightly behind and around the rocket
        const bubblePos = this.position.clone();
        bubblePos.x -= 0.2 + Math.random() * 0.3;
        bubblePos.y += (Math.random() - 0.5) * 0.1;
        bubblePos.z += (Math.random() - 0.5) * 0.1;
        bubbleMesh.position.copy(bubblePos);
        
        this.scene.add(bubbleMesh);
        
        this.supercavitationBubbles.push({
            mesh: bubbleMesh,
            life: 0,
            maxLife: 0.5 + Math.random() * 0.3, // 0.5-0.8 seconds
            scale: 1.0
        });
    }

    onDestroy() {
        super.onDestroy();
        
        // Clean up trail
        if (this.trailMesh) {
            this.scene.remove(this.trailMesh);
        }
        
        // Clean up cavitation bubbles
        this.supercavitationBubbles.forEach(bubble => {
            this.scene.remove(bubble.mesh);
        });
        this.supercavitationBubbles = [];
    }
}

// Guided Torpedo Class
class GuidedTorpedo extends Projectile {
    constructor(scene, position, rotation, weaponType, target) {
        super(scene, position, rotation, weaponType, target);
        this.maneuverability = weaponType.maneuverability || 0.7;
        this.searchRadius = 50; // meters
        this.hasLock = !!target;
    }

    createMesh() {
        // Torpedo-specific visual
        const geometry = new THREE.CylinderGeometry(0.1, 0.05, 0.6, 8);
        const material = new THREE.MeshBasicMaterial({ color: this.weaponType.color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.z = Math.PI / 2; // Point forward
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);

        if (this.weaponType.trail) {
            this.createTrail();
        }
    }

    updateGuidance(deltaTime) {
        if (!this.target) {
            // Search for nearest target
            this.acquireTarget();
        }

        if (this.target && this.hasLock) {
            const targetPos = this.target.getPosition();
            const directionToTarget = targetPos.clone().sub(this.position).normalize();

            // Calculate desired velocity
            const desiredVelocity = directionToTarget.multiplyScalar(this.speed);

            // Interpolate current velocity toward desired (limited by maneuverability)
            const steeringForce = desiredVelocity.sub(this.velocity).multiplyScalar(this.maneuverability * deltaTime);
            this.velocity.add(steeringForce);
            this.velocity.normalize().multiplyScalar(this.speed);

            // Update rotation to match velocity direction
            const lookDirection = this.velocity.clone().normalize();
            this.mesh.lookAt(this.position.clone().add(lookDirection));
        }
    }

    acquireTarget() {
        if (window.getEnemySubmarines) {
            const enemies = window.getEnemySubmarines();
            let closestEnemy = null;
            let closestDistance = this.searchRadius;

            enemies.forEach(enemy => {
                const distance = this.position.distanceTo(enemy.getPosition());
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            });

            if (closestEnemy) {
                this.target = closestEnemy;
                this.hasLock = true;
            }
        }
    }
}

// Interceptor Torpedo Class (Auto-targeting)
class InterceptorTorpedo extends GuidedTorpedo {
    updateGuidance(deltaTime) {
        // First priority: incoming enemy torpedoes
        const incomingThreats = this.findIncomingTorpedoes();
        if (incomingThreats.length > 0) {
            this.target = incomingThreats[0];
            this.hasLock = true;
        } else if (!this.target) {
            // Secondary: enemy submarines
            this.acquireTarget();
        }

        // Use parent guidance logic
        super.updateGuidance(deltaTime);
    }

    findIncomingTorpedoes() {
        // Find enemy torpedoes (would need to be implemented in enemy system)
        return [];
    }
}

// Cannon Round Class (Direct fire)
class CannonRound extends Projectile {
    constructor(scene, position, rotation, weaponType, target) {
        super(scene, position, rotation, weaponType, target);

        // Calculate lead if target exists
        if (target) {
            this.calculateLead(target);
        }
    }

    createMesh() {
        // Small, fast projectile
        const geometry = new THREE.SphereGeometry(0.03, 6, 6);
        const material = new THREE.MeshBasicMaterial({ color: this.weaponType.color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);
    }

    calculateLead(target) {
        // Simple lead calculation
        const targetPos = target.getPosition();
        const targetVel = target.velocity || new THREE.Vector3(0, 0, 0);
        const distance = this.position.distanceTo(targetPos);
        const timeToTarget = distance / this.speed;

        // Predicted target position
        const predictedPos = targetPos.clone().add(targetVel.clone().multiplyScalar(timeToTarget));

        // Adjust initial velocity toward predicted position
        const leadDirection = predictedPos.sub(this.position).normalize();
        this.velocity = leadDirection.multiplyScalar(this.speed);
    }
}

// Point Defense Round Class
class PointDefenseRound extends CannonRound {
    createMesh() {
        // Very small, very fast
        const geometry = new THREE.SphereGeometry(0.02, 4, 4);
        const material = new THREE.MeshBasicMaterial({ color: this.weaponType.color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);
    }
}

// SCAV Cannon Round Class - Supercavitating cannon projectiles
class SCAVCannonRound extends CannonRound {
    constructor(scene, position, rotation, weaponType, target, deviation = 0) {
        super(scene, position, rotation, weaponType, target);
        this.deviation = deviation; // Gunnery skill affects this
        this.hasSupercavitationBubbles = true;
        this.bubbleEffects = [];
        this.damageDropoffDistance = weaponType.range * 0.9; // 90% of max range
    }

    createMesh() {
        // Sleeker supercavitating projectile
        const geometry = new THREE.SphereGeometry(0.025, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: this.weaponType.color,
            emissive: this.weaponType.color,
            emissiveIntensity: 0.3
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);

        // Add supercavitation trail effect
        this.createSupercavitationTrail();
    }

    createSupercavitationTrail() {
        const trailGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.2, 6);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ddff,
            transparent: true,
            opacity: 0.6
        });
        this.trailMesh = new THREE.Mesh(trailGeometry, trailMaterial);
        this.scene.add(this.trailMesh);
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Update trail position
        if (this.trailMesh) {
            this.trailMesh.position.copy(this.position);
            this.trailMesh.rotation.copy(this.rotation);
        }

        // Check for damage dropoff
        if (this.distanceTraveled > this.damageDropoffDistance) {
            this.weaponType.damage *= 0.3; // Sudden damage drop at 90% range
        }
    }

    checkCollisions() {
        const result = super.checkCollisions();

        // SCAV rounds have high penetration and can damage multiple targets
        if (result.hit && result.target) {
            const actualDamage = this.weaponType.damage;

            // Apply torpedo kill effect for point defense
            if (this.weaponType.type === 'scav_point_defense' && result.target.type === 'torpedo') {
                result.target.destroy();
                console.log(`Point defense destroyed incoming torpedo!`);
            }
        }

        return result;
    }

    destroy() {
        super.destroy();
        if (this.trailMesh) {
            this.scene.remove(this.trailMesh);
        }
    }
}

// SCAV Point Defense System - Automated torpedo interception
class SCAVPointDefense {
    constructor(submarine, mountPosition, mountType = 'dorsal') {
        this.submarine = submarine;
        this.mountPosition = mountPosition;
        this.mountType = mountType; // 'dorsal' or 'ventral'
        this.weaponType = WEAPON_TYPES.SCAV_POINT_DEFENSE;
        this.currentAmmo = this.weaponType.magazineSize;
        this.lastFireTime = 0;
        this.targetingRange = this.weaponType.range;
        this.activeTargets = [];

        this.fireInterval = 60000 / this.weaponType.fireRate; // ms between shots
    }

    update(deltaTime) {
        const currentTime = Date.now();

        // Find and prioritize torpedo threats
        this.updateTargetList();

        // Fire at highest priority target if possible
        if (this.activeTargets.length > 0 &&
            currentTime - this.lastFireTime > this.fireInterval &&
            this.currentAmmo > 0) {

            this.fireAtTarget(this.activeTargets[0]);
            this.lastFireTime = currentTime;
            this.currentAmmo--;
        }
    }

    updateTargetList() {
        this.activeTargets = [];

        // Get all active torpedoes in the scene
        const torpedoes = window.getActiveTorpedoes ? window.getActiveTorpedoes() : [];

        for (const torpedo of torpedoes) {
            const distance = this.submarine.mesh.position.distanceTo(torpedo.position);

            if (distance <= this.targetingRange) {
                // Check if torpedo is in firing arc (hemisphere)
                const relativePos = torpedo.position.clone().sub(this.submarine.mesh.position);
                const isInArc = this.mountType === 'dorsal' ? relativePos.y > -50 : relativePos.y < 50;

                if (isInArc) {
                    // Priority: torpedoes locked on player get highest priority
                    const priority = torpedo.target === this.submarine ? 10 : 5;

                    this.activeTargets.push({
                        torpedo: torpedo,
                        distance: distance,
                        priority: priority
                    });
                }
            }
        }

        // Sort by priority then distance
        this.activeTargets.sort((a, b) => {
            if (a.priority !== b.priority) return b.priority - a.priority;
            return a.distance - b.distance;
        });
    }

    fireAtTarget(targetData) {
        const target = targetData.torpedo;
        const firePosition = this.submarine.mesh.position.clone().add(this.mountPosition);

        // Calculate intercept course
        const targetVelocity = target.velocity || new THREE.Vector3(0, 0, 0);
        const projectileSpeed = this.weaponType.projectileSpeed;
        const timeToIntercept = targetData.distance / projectileSpeed;

        // Lead the target
        const interceptPosition = target.position.clone()
            .add(targetVelocity.clone().multiplyScalar(timeToIntercept));

        // Fire direction
        const fireDirection = interceptPosition.sub(firePosition).normalize();
        const fireRotation = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(1, 0, 0),
                fireDirection
            )
        );

        // Create projectile
        const projectile = new SCAVCannonRound(
            this.submarine.scene,
            firePosition,
            fireRotation,
            this.weaponType,
            target
        );

        // Add to active projectiles
        if (window.weaponSystem) {
            window.weaponSystem.activeProjectiles.push(projectile);
        }
    }
}

// WISKR Drone Class - Active sonar reconnaissance drones
class WISKRDrone extends Projectile {
    constructor(scene, position, rotation, weaponType) {
        super(scene, position, rotation, weaponType);
        this.activationDistance = weaponType.activationRange || 300;
        this.sonarActive = false;
        this.sonarSphere = null;
        this.sonarEffects = [];
        this.illuminatedContacts = new Set();
        this.lastSonarPing = 0;
        this.sonarPingInterval = 2000; // 2 seconds between pings
        this.maxRange = weaponType.range || 20000;
    }

    createMesh() {
        // Sleek drone design - torpedo-like but smaller
        const geometry = new THREE.CylinderGeometry(0.08, 0.12, 1.2, 8);
        geometry.rotateZ(Math.PI / 2); // Align with forward direction

        const material = new THREE.MeshBasicMaterial({
            color: this.weaponType.color,
            emissive: this.weaponType.color,
            emissiveIntensity: this.sonarActive ? 0.4 : 0.1
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);

        // Add identification lights
        this.createIdentificationLights();

        // Create trail effect
        if (this.weaponType.trail) {
            this.createWISKRTrail();
        }
    }

    createIdentificationLights() {
        // Friendly green lights to distinguish from torpedoes
        const lightGeometry = new THREE.SphereGeometry(0.03, 6, 6);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.8
        });

        // Front and rear lights
        const frontLight = new THREE.Mesh(lightGeometry, lightMaterial);
        frontLight.position.set(0.6, 0, 0);
        this.mesh.add(frontLight);

        const rearLight = new THREE.Mesh(lightGeometry, lightMaterial);
        rearLight.position.set(-0.6, 0, 0);
        this.mesh.add(rearLight);
    }

    createWISKRTrail() {
        const trailGeometry = new THREE.CylinderGeometry(0.04, 0.08, 0.3, 6);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: this.weaponType.color,
            transparent: true,
            opacity: 0.4
        });
        this.trailMesh = new THREE.Mesh(trailGeometry, trailMaterial);
        this.scene.add(this.trailMesh);
    }

    activateSonar() {
        if (this.sonarActive) return;

        this.sonarActive = true;
        console.log('🔊 WISKR drone sonar activated - illuminating 1km sphere');

        // Create visible sonar sphere (partial - excludes rear cone)
        this.createSonarVisualization();

        // Update drone appearance
        if (this.mesh && this.mesh.material) {
            this.mesh.material.emissiveIntensity = 0.4;
        }
    }

    createSonarVisualization() {
        // Create partial sphere geometry (excludes 90-degree rear cone)
        const geometry = new THREE.SphereGeometry(
            this.weaponType.sonarRange,
            32, 32,
            0, Math.PI * 2, // Full azimuth
            0, Math.PI * 0.95 // 95% of full sphere (excludes rear)
        );

        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
            wireframe: false
        });

        this.sonarSphere = new THREE.Mesh(geometry, material);
        this.sonarSphere.position.copy(this.position);

        // Rotate to exclude rear cone relative to drone heading
        this.sonarSphere.rotation.copy(this.rotation);

        this.scene.add(this.sonarSphere);

        // Create pulsing effect
        this.createSonarPulseEffect();
    }

    createSonarPulseEffect() {
        const pulseGeometry = new THREE.RingGeometry(
            this.weaponType.sonarRange * 0.9,
            this.weaponType.sonarRange * 1.1,
            32
        );

        const pulseMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });

        const pulseRing = new THREE.Mesh(pulseGeometry, pulseMaterial);
        pulseRing.position.copy(this.position);
        this.scene.add(pulseRing);

        this.sonarEffects.push({
            mesh: pulseRing,
            life: 0,
            maxLife: 2.0,
            type: 'pulse'
        });
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Check for sonar activation
        if (!this.sonarActive && this.distanceTraveled >= this.activationDistance) {
            this.activateSonar();
        }

        // Update sonar sphere position
        if (this.sonarSphere) {
            this.sonarSphere.position.copy(this.position);
            this.sonarSphere.rotation.copy(this.rotation);
        }

        // Update trail
        if (this.trailMesh) {
            this.trailMesh.position.copy(this.position);
            this.trailMesh.rotation.copy(this.rotation);
        }

        // Active sonar pinging
        if (this.sonarActive) {
            const currentTime = Date.now();
            if (currentTime - this.lastSonarPing > this.sonarPingInterval) {
                this.performSonarPing();
                this.lastSonarPing = currentTime;
            }
        }

        // Update sonar effects
        this.updateSonarEffects(deltaTime);

        // Check if drone has reached maximum range
        if (this.distanceTraveled >= this.maxRange) {
            this.selfDestruct();
        }
    }

    performSonarPing() {
        // Find contacts within sonar range
        const contacts = this.getContactsInSonarRange();

        contacts.forEach(contact => {
            // Check if contact is in the illuminated area (not in rear cone)
            if (this.isContactInIlluminatedArea(contact)) {
                this.illuminateContact(contact);
            }
        });

        // Create visual ping effect
        this.createSonarPing();

        console.log(`🔊 WISKR sonar ping: ${contacts.length} contacts illuminated`);
    }

    getContactsInSonarRange() {
        // Get all submarines and other entities in the scene
        const contacts = [];

        // Get enemy submarines if available
        if (window.enemySubmarines) {
            window.enemySubmarines.forEach(enemy => {
                const distance = this.position.distanceTo(enemy.mesh.position);
                if (distance <= this.weaponType.sonarRange) {
                    contacts.push({
                        position: enemy.mesh.position,
                        type: 'submarine',
                        entity: enemy
                    });
                }
            });
        }

        // Get structures if available
        if (window.underwaterStructures) {
            window.underwaterStructures.structures.forEach(structure => {
                const distance = this.position.distanceTo(structure.position);
                if (distance <= this.weaponType.sonarRange) {
                    contacts.push({
                        position: structure.position,
                        type: 'structure',
                        entity: structure
                    });
                }
            });
        }

        return contacts;
    }

    isContactInIlluminatedArea(contact) {
        // Calculate angle from drone to contact
        const droneForward = new THREE.Vector3(1, 0, 0);
        droneForward.applyQuaternion(this.mesh.quaternion);

        const toContact = contact.position.clone().sub(this.position).normalize();
        const angle = droneForward.angleTo(toContact);

        // Check if angle is within illuminated cone (exclude 90-degree rear)
        const exclusionAngle = (this.weaponType.sonarExclusionAngle || 90) * Math.PI / 180;
        const rearConeStart = Math.PI - (exclusionAngle / 2);

        return angle < rearConeStart;
    }

    illuminateContact(contact) {
        // Add contact to player's tactical display
        if (window.playerSubmarineInstance && window.playerSubmarineInstance.sonarSystem) {
            window.playerSubmarineInstance.sonarSystem.addDroneContact(contact, this.position);
        }

        // Create visual indication
        this.createContactMarker(contact);
    }

    createContactMarker(contact) {
        const markerGeometry = new THREE.RingGeometry(20, 30, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: 0xff8800,
            transparent: true,
            opacity: 0.8
        });

        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.copy(contact.position);
        marker.position.y += 10; // Slightly above contact
        this.scene.add(marker);

        this.sonarEffects.push({
            mesh: marker,
            life: 0,
            maxLife: 5.0, // Marker visible for 5 seconds
            type: 'contact_marker'
        });
    }

    createSonarPing() {
        // Create expanding ring effect for ping visualization
        const pingGeometry = new THREE.RingGeometry(10, 20, 16);
        const pingMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.6
        });

        const ping = new THREE.Mesh(pingGeometry, pingMaterial);
        ping.position.copy(this.position);
        this.scene.add(ping);

        this.sonarEffects.push({
            mesh: ping,
            life: 0,
            maxLife: 1.5,
            type: 'ping',
            initialScale: 1,
            targetScale: 50 // Expands 50x
        });
    }

    updateSonarEffects(deltaTime) {
        this.sonarEffects.forEach((effect, index) => {
            effect.life += deltaTime;

            // Update effect based on type
            switch (effect.type) {
                case 'ping':
                    // Expanding ring effect
                    const progress = effect.life / effect.maxLife;
                    const scale = effect.initialScale + (effect.targetScale - effect.initialScale) * progress;
                    effect.mesh.scale.setScalar(scale);
                    effect.mesh.material.opacity = 0.6 * (1 - progress);
                    break;

                case 'contact_marker':
                    // Fading marker
                    const fadeProgress = Math.max(0, 1 - (effect.life - 3) / 2); // Fade in last 2 seconds
                    effect.mesh.material.opacity = 0.8 * fadeProgress;
                    break;

                case 'pulse':
                    // Pulsing sonar sphere outline
                    const pulseProgress = (effect.life / effect.maxLife);
                    effect.mesh.material.opacity = 0.3 * Math.sin(pulseProgress * Math.PI);
                    break;
            }

            // Remove expired effects
            if (effect.life >= effect.maxLife) {
                this.scene.remove(effect.mesh);
                this.sonarEffects.splice(index, 1);
            }
        });
    }

    selfDestruct() {
        console.log('🔊 WISKR drone reached maximum range - shutting down');

        // Create shutdown effect
        if (this.mesh) {
            const shutdownEffect = new THREE.Mesh(
                new THREE.SphereGeometry(5, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: 0x00ff88,
                    transparent: true,
                    opacity: 0.5
                })
            );
            shutdownEffect.position.copy(this.position);
            this.scene.add(shutdownEffect);

            // Fade out effect
            const fadeInterval = setInterval(() => {
                shutdownEffect.material.opacity -= 0.1;
                if (shutdownEffect.material.opacity <= 0) {
                    this.scene.remove(shutdownEffect);
                    clearInterval(fadeInterval);
                }
            }, 100);
        }

        this.destroy();
    }

    destroy() {
        super.destroy();

        // Clean up sonar visualization
        if (this.sonarSphere) {
            this.scene.remove(this.sonarSphere);
        }

        if (this.trailMesh) {
            this.scene.remove(this.trailMesh);
        }

        // Clean up all sonar effects
        this.sonarEffects.forEach(effect => {
            this.scene.remove(effect.mesh);
        });
        this.sonarEffects = [];
    }
}

// Homing Modes Configuration
const HOMING_MODES = {
    HOMING: {
        name: 'Basic Homing',
        description: 'Heat-seeking guidance',
        accuracy: 0.7,
        detectability: 0.5,
        jamResistance: 0.3
    },
    PASSIVE: {
        name: 'Passive Homing',
        description: 'Follows engine signatures',
        accuracy: 0.6,
        detectability: 0.2,
        jamResistance: 0.8
    },
    SEMI_ACTIVE: {
        name: 'Semi-Active Homing',
        description: 'Uses launching sub\'s sonar',
        accuracy: 0.85,
        detectability: 0.7,
        jamResistance: 0.6
    },
    ACTIVE: {
        name: 'Active Homing',
        description: 'Own sonar guidance',
        accuracy: 0.9,
        detectability: 0.9,
        jamResistance: 0.5
    },
    WIRE_GUIDED: {
        name: 'Wire Guided',
        description: 'Manual control via wire',
        accuracy: 0.95,
        detectability: 0.3,
        jamResistance: 1.0
    },
    WAKE_FOLLOWING: {
        name: 'Wake Following',
        description: 'Tracks cavitation trail',
        accuracy: 0.8,
        detectability: 0.4,
        jamResistance: 0.9
    }
};

// Advanced Torpedo AI Class - Based on submarine specifications
class AdvancedTorpedo {
    constructor(scene, launchPosition, launchRotation, torpedoType, target = null) {
        this.scene = scene;
        this.position = launchPosition.clone();
        this.rotation = launchRotation.clone();
        this.type = this.getTorpedoSpecs(torpedoType);
        this.target = target;

        // Physics
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.speed = 20; // Initial launch speed (knots)
        this.maxSpeed = this.type.maxSpeed * 0.514444; // Convert knots to m/s
        this.scavSpeed = this.type.scavSpeed * 0.514444; // Terminal attack speed
        this.acceleration = this.maxSpeed * 1.5; // Acceleration rate

        // AI State Machine
        this.phase = 'LAUNCH'; // LAUNCH -> CRUISE -> TERMINAL -> IMPACT
        this.guidanceMode = 'PASSIVE'; // PASSIVE -> SEMI_ACTIVE -> ACTIVE -> SCAV

        // Guidance System
        this.lastTargetPosition = null;
        this.targetWake = []; // Store wake trail points
        this.searchRadius = 100; // meters
        this.guidanceTimer = 0;
        this.lockProgress = 0;

        // State
        this.distanceTraveled = 0;
        this.fuel = this.type.maxRange / (this.type.maxSpeed * 0.514444); // seconds of fuel
        this.armed = false;
        this.armingTime = 3; // seconds before torpedo arms
        this.lifeTime = 0;
        this.mesh = null;
        this.trailParticles = [];

        // Wake following system
        this.wakePoints = [];
        this.wakeFollowDistance = 50; // meters behind target

        this.init();
    }

    getTorpedoSpecs(torpedoType) {
        const specs = {
            HY: { // High Yield
                name: 'Heavy Torpedo',
                damage: 150,
                maxSpeed: 130, // knots
                scavSpeed: 60, // Speed when entering terminal attack
                maneuverability: 0.3, // Low maneuverability
                lockTime: 8000, // ms for active sonar
                passiveLockTime: 15000, // ms for passive
                terminalRange: 500, // meters - when to go active/SCAV
                maxRange: 8000, // meters
                color: 0xff0000
            },
            ST: { // Standard
                name: 'Standard Torpedo',
                damage: 100,
                maxSpeed: 160, // knots
                scavSpeed: 80,
                maneuverability: 0.6, // Medium maneuverability
                lockTime: 5000, // ms for active sonar
                passiveLockTime: 10000, // ms for passive
                terminalRange: 400, // meters
                maxRange: 6000, // meters
                color: 0x00ff00
            },
            HS: { // High Speed
                name: 'High Speed Torpedo',
                damage: 50,
                maxSpeed: 200, // knots
                scavSpeed: 100,
                maneuverability: 0.8, // High maneuverability
                lockTime: 3000, // ms for active sonar
                passiveLockTime: 6000, // ms for passive
                terminalRange: 300, // meters
                maxRange: 4000, // meters
                color: 0x0088ff
            }
        };
        return specs[torpedoType] || specs.ST;
    }

    init() {
        this.createTorpedoMesh();
        this.findInitialTarget();
        console.log(`${this.type.name} torpedo launched in ${this.phase} phase`);
    }

    createTorpedoMesh() {
        const torpedoGroup = new THREE.Group();

        // Torpedo wireframe material
        const torpedoMaterial = new THREE.LineBasicMaterial({
            color: this.type.color,
            linewidth: 2,
            transparent: true,
            opacity: 0.9
        });

        // Main torpedo body (elongated cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.08, 0.05, 1.2, 6);
        const bodyEdges = new THREE.EdgesGeometry(bodyGeometry);
        const body = new THREE.LineSegments(bodyEdges, torpedoMaterial);
        body.rotation.z = Math.PI / 2;
        torpedoGroup.add(body);

        // Propeller (spinning wireframe)
        const propGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 4);
        const propEdges = new THREE.EdgesGeometry(propGeometry);
        this.propeller = new THREE.LineSegments(propEdges, torpedoMaterial);
        this.propeller.position.set(-0.62, 0, 0);
        this.propeller.rotation.z = Math.PI / 2;
        torpedoGroup.add(this.propeller);

        // Guidance fins
        const finGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0.4, 0, 0),
            new THREE.Vector3(0.3, 0.08, 0),
            new THREE.Vector3(0.4, 0, 0),
            new THREE.Vector3(0.3, -0.08, 0)
        ]);
        const fins = new THREE.Line(finGeometry, torpedoMaterial);
        torpedoGroup.add(fins);

        // Homing mode indicator
        const indicatorGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0.6, 0, 0),
            new THREE.Vector3(0.55, 0.03, 0),
            new THREE.Vector3(0.6, 0, 0),
            new THREE.Vector3(0.55, -0.03, 0)
        ]);
        const indicator = new THREE.Line(indicatorGeometry, torpedoMaterial);
        torpedoGroup.add(indicator);

        this.mesh = torpedoGroup;
        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);
        this.mesh.name = `torpedo_${this.type.name}`;
        this.scene.add(this.mesh);
    }

    findInitialTarget() {
        // Get enemy submarines from enemy manager
        const enemies = window.getEnemySubmarines ? window.getEnemySubmarines() : [];

        if (enemies.length === 0) return;

        // Find closest enemy within range
        let closestEnemy = null;
        let closestDistance = Infinity;

        enemies.forEach(enemy => {
            const distance = this.position.distanceTo(enemy.getPosition());
            if (distance < closestDistance && distance < this.type.range) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });

        if (closestEnemy) {
            this.target = closestEnemy;
            this.lastTargetPosition = closestEnemy.getPosition();
        }
    }

    update(deltaTime) {
        if (!this.mesh) return false;

        this.lifeTime += deltaTime;
        this.fuel -= deltaTime;

        // Check if torpedo has run out of fuel
        if (this.fuel <= 0) {
            this.destroy();
            return false;
        }

        // Arm torpedo after delay
        if (!this.armed && this.lifeTime > this.armingTime) {
            this.armed = true;
        }

        // Update AI state machine
        this.updateAIPhase();

        // Update guidance based on current phase
        this.updateGuidance(deltaTime);

        // Apply movement
        this.applyMovement(deltaTime);

        // Update visual effects
        this.updateEffects(deltaTime);

        // Check for impacts
        return this.checkImpacts();
    }

    updateAIPhase() {
        if (!this.target || !this.target.getPosition) return;

        const targetPos = this.target.getPosition();
        const distanceToTarget = this.position.distanceTo(targetPos);

        switch (this.phase) {
        case 'LAUNCH':
            // Initial launch phase - passive guidance
            this.guidanceMode = 'PASSIVE';
            this.speed = Math.min(this.maxSpeed * 0.6, this.speed + this.acceleration * 0.016);
            if (this.lifeTime > 5) { // 5 seconds after launch
                this.phase = 'CRUISE';
            }
            break;

        case 'CRUISE':
            // Cruise phase - wake following or semi-active
            this.guidanceMode = 'WAKE_FOLLOWING';
            this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration * 0.016);
            if (distanceToTarget < this.type.terminalRange) {
                this.phase = 'TERMINAL';
            }
            break;

        case 'TERMINAL':
            // Terminal attack phase - active guidance and SCAV mode
            this.guidanceMode = 'ACTIVE';
            // Slow down for terminal maneuvering
            const targetSpeed = this.scavSpeed;
            if (this.speed > targetSpeed) {
                this.speed = Math.max(targetSpeed, this.speed - this.acceleration * 0.5 * 0.016);
            } else {
                this.speed = Math.min(targetSpeed, this.speed + this.acceleration * 0.016);
            }
            if (distanceToTarget < 50) { // 50 meters - final approach
                this.phase = 'IMPACT';
            }
            break;

        case 'IMPACT':
            // Final impact phase - maximum maneuverability
            this.guidanceMode = 'ACTIVE';
            this.speed = Math.min(this.scavSpeed * 1.2, this.speed + this.acceleration * 2 * 0.016);
            break;
        }
    }

    updateGuidance(deltaTime) {
        this.guidanceTimer += deltaTime;

        // Check 90-degree arc constraints and target switching
        this.checkArcConstraints();
        this.checkTargetSwitching();

        // Update guidance based on homing mode
        switch (this.homingMode) {
        case HOMING_MODES.HOMING:
            this.updateBasicHoming();
            break;
        case HOMING_MODES.PASSIVE:
            this.updatePassiveHoming();
            break;
        case HOMING_MODES.SEMI_ACTIVE:
            this.updateSemiActiveHoming();
            break;
        case HOMING_MODES.ACTIVE:
            this.updateActiveHoming();
            break;
        case HOMING_MODES.WIRE_GUIDED:
            this.updateWireGuided();
            break;
        case HOMING_MODES.WAKE_FOLLOWING:
            this.updateWakeFollowing();
            break;
        }
    }

    updateBasicHoming() {
        if (!this.target || !this.target.getPosition) return;

        const targetPos = this.target.getPosition();
        const distanceToTarget = this.position.distanceTo(targetPos);

        // Lost target if too far
        if (distanceToTarget > this.searchRadius * 2) {
            this.target = null;
            return;
        }

        this.steerTowardTarget(targetPos);
    }

    updatePassiveHoming() {
        // Similar to basic but harder to detect
        this.updateBasicHoming();
    }

    updateSemiActiveHoming() {
        // Uses launching submarine's sonar data
        if (!this.target || !this.target.getPosition) return;

        const targetPos = this.target.getPosition();
        this.steerTowardTarget(targetPos, 1.2); // Higher accuracy
    }

    updateActiveHoming() {
        // Most accurate but detectable
        if (!this.target || !this.target.getPosition) return;

        const targetPos = this.target.getPosition();
        this.steerTowardTarget(targetPos, 1.5); // Highest accuracy
    }

    updateWireGuided() {
        // Manual control (simplified - follows target if available)
        if (!this.wireIntact) {
            this.updateBasicHoming();
            return;
        }

        if (this.target && this.target.getPosition) {
            const targetPos = this.target.getPosition();
            this.steerTowardTarget(targetPos, 2.0); // Perfect guidance
        }
    }

    updateWakeFollowing() {
        // Follows target's wake/cavitation trail
        if (!this.target || !this.target.getPosition) return;

        const targetPos = this.target.getPosition();

        // Add some lag for wake following
        if (this.lastTargetPosition) {
            const wakePos = this.lastTargetPosition.clone().lerp(targetPos, 0.7);
            this.steerTowardTarget(wakePos, 0.9);
        }

        this.lastTargetPosition = targetPos.clone();
    }

    steerTowardTarget(targetPosition, accuracyMultiplier = 1.0) {
        const direction = targetPosition.clone().sub(this.position).normalize();

        // Apply homing accuracy
        const accuracy = this.homingMode.accuracy * accuracyMultiplier;
        const error = (1 - accuracy) * 0.2; // Max 20% error

        // Add some random error
        direction.x += (Math.random() - 0.5) * error;
        direction.z += (Math.random() - 0.5) * error;
        direction.normalize();

        // Calculate target rotation
        const targetYaw = Math.atan2(direction.x, direction.z);
        const currentYaw = this.rotation.y;

        // Smooth steering based on maneuverability
        let yawDiff = targetYaw - currentYaw;
        if (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
        if (yawDiff < -Math.PI) yawDiff += Math.PI * 2;

        const maxTurnRate = this.type.maneuverability * 0.04; // Reduced from 0.1 for realistic torpedo steering
        this.rotation.y += Math.max(-maxTurnRate, Math.min(maxTurnRate, yawDiff));
    }

    checkArcConstraints() {
        if (!this.target || !this.target.getPosition) return;

        const targetPos = this.target.getPosition();
        const toTarget = targetPos.clone().sub(this.position).normalize();

        // Get torpedo's forward direction
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyEuler(this.rotation);

        // Calculate angle between forward direction and target
        const angle = Math.acos(forward.dot(toTarget));
        const angleInDegrees = angle * (180 / Math.PI);

        // If target is outside 90-degree forward arc, deactivate torpedo
        if (angleInDegrees > 45) { // 45 degrees from center = 90-degree total arc
            console.log('Target left 90-degree arc - torpedo deactivating');
            this.deactivate();
        }
    }

    checkTargetSwitching() {
        // Get all potential noisy targets within 90-degree forward arc
        const noisyTargets = this.findNoisyTargetsInArc();

        if (noisyTargets.length === 0) return;

        // Find loudest noise in arc
        let loudestTarget = null;
        let maxNoise = 0;

        noisyTargets.forEach(target => {
            const noiseLevel = target.noiseSignature || target.strength || 0;
            if (noiseLevel > maxNoise) {
                maxNoise = noiseLevel;
                loudestTarget = target;
            }
        });

        // Switch target based on noise differential
        if (loudestTarget && this.target) {
            const currentTargetNoise = this.target.noiseSignature || this.target.strength || 0;
            const noiseDifferential = maxNoise - currentTargetNoise;

            // Higher noise differential = higher chance to switch
            // 100% chance if new target is 10+ dB louder
            const switchChance = Math.min(1.0, noiseDifferential / 10);

            if (Math.random() < switchChance) {
                console.log(`Torpedo switching targets - new noise ${maxNoise} vs old ${currentTargetNoise}`);
                this.target = loudestTarget;
                this.lastTargetPosition = loudestTarget.getPosition ? loudestTarget.getPosition() : loudestTarget.position;
            }
        }
    }

    findNoisyTargetsInArc() {
        const targets = [];

        // Get torpedo's forward direction
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyEuler(this.rotation);

        // Check knuckles
        if (window.getPlayerSubmarine && window.getPlayerSubmarine().knuckles) {
            window.getPlayerSubmarine().knuckles.forEach(knuckle => {
                if (knuckle.lifetime > 0 && knuckle.noiseSignature) {
                    const toKnuckle = knuckle.position.clone().sub(this.position).normalize();
                    const angle = Math.acos(forward.dot(toKnuckle));

                    if (angle <= Math.PI / 4) { // Within 45-degree arc (90 total)
                        targets.push({
                            position: knuckle.position,
                            noiseSignature: knuckle.noiseSignature,
                            isKnuckle: true,
                            getPosition: () => knuckle.position
                        });
                    }
                }
            });
        }

        // Check noisemakers
        if (window.getActiveNoisemakers) {
            const noisemakers = window.getActiveNoisemakers();
            noisemakers.forEach(noisemaker => {
                const toNoisemaker = noisemaker.position.clone().sub(this.position).normalize();
                const angle = Math.acos(forward.dot(toNoisemaker));

                if (angle <= Math.PI / 4) { // Within 45-degree arc (90 total)
                    targets.push({
                        position: noisemaker.position,
                        noiseSignature: noisemaker.noiseSignature || 15, // Default noisemaker signature
                        isNoisemaker: true,
                        getPosition: () => noisemaker.position
                    });
                }
            });
        }

        return targets;
    }

    deactivate() {
        // Torpedo deactivates and drifts to bottom, then self-destructs
        this.active = false;
        this.target = null;
        this.speed *= 0.1; // Drastically reduce speed

        // Set timer for self-destruct (sink to bottom then explode)
        setTimeout(() => {
            this.selfDestruct();
        }, 5000); // 5 seconds to sink and explode
    }

    selfDestruct() {
        // Create explosion effect and remove torpedo
        this.explode();
        this.shouldDestroy = true;
    }

    explode() {
        // Wrapper for explosion effect - same as createExplosion
        this.createExplosion();
    }

    applyMovement(deltaTime) {
        // Forward movement in facing direction
        const moveDirection = new THREE.Vector3(
            Math.sin(this.rotation.y),
            0,
            Math.cos(this.rotation.y)
        );

        this.velocity = moveDirection.multiplyScalar(this.speed);
        const movement = this.velocity.clone().multiplyScalar(deltaTime);
        this.position.add(movement);

        // Update mesh position and rotation
        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);

        // Rotate propeller for visual effect
        if (this.propeller) {
            this.propeller.rotation.x += this.speed * deltaTime * 0.01;
        }
    }

    updateEffects(deltaTime) {
        // Create propulsion trail
        if (Math.random() < 0.3) {
            this.createTrailParticle();
        }

        // Update existing trail particles
        this.trailParticles = this.trailParticles.filter(particle => {
            particle.life -= deltaTime;
            particle.mesh.material.opacity = particle.life / particle.maxLife;

            if (particle.life <= 0) {
                this.scene.remove(particle.mesh);
                particle.mesh.geometry.dispose();
                particle.mesh.material.dispose();
                return false;
            }
            return true;
        });
    }

    createTrailParticle() {
        const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: this.type.color,
            transparent: true,
            opacity: 0.6
        });

        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(this.position);
        particle.position.x -= 0.6; // Behind torpedo
        particle.position.add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
        ));

        this.scene.add(particle);

        this.trailParticles.push({
            mesh: particle,
            life: 1.0,
            maxLife: 1.0
        });
    }

    checkImpacts() {
        if (!this.armed) return true;

        // Check impact with target
        if (this.target && this.target.getPosition) {
            const targetPos = this.target.getPosition();
            const distance = this.position.distanceTo(targetPos);

            if (distance < 2.0) { // 2 meter hit radius
                this.impact(this.target);
                return false;
            }
        }

        // Check collision with knuckles (countermeasure)
        if (this.checkKnuckleCollision()) {
            return false;
        }

        // Check collision with noisemakers (countermeasure)
        if (this.checkNoisemakerCollision()) {
            return false;
        }

        // Check seabed collision
        const oceanInstance = window.oceanInstance;
        if (oceanInstance && oceanInstance.getSeabedHeight) {
            const seabedHeight = oceanInstance.getSeabedHeight(this.position.x, this.position.z);
            if (this.position.y <= seabedHeight + 0.5) {
                this.impactSeabed();
                return false;
            }
        }

        // Check bounds
        if (Math.abs(this.position.x) > 200 || Math.abs(this.position.z) > 200) {
            this.destroy();
            return false;
        }

        return true;
    }

    checkKnuckleCollision() {
        if (!window.getPlayerSubmarine || !window.getPlayerSubmarine().knuckles) return false;

        const knuckles = window.getPlayerSubmarine().knuckles;
        for (let knuckle of knuckles) {
            if (knuckle.lifetime > 0) {
                const distance = this.position.distanceTo(knuckle.position);
                if (distance < 4.0) { // 4 meter collision radius for knuckles
                    // Probabilistic countermeasure success based on torpedo sophistication
                    const baseSuccessRate = 0.7; // 70% base success rate for knuckles
                    const sophisticationPenalty = this.homingMode.sophistication * 0.1; // More sophisticated torpedoes harder to fool
                    const successRate = Math.max(0.3, baseSuccessRate - sophisticationPenalty);
                    
                    if (Math.random() < successRate) {
                        console.log(`Torpedo fooled by knuckle! (${(successRate * 100).toFixed(0)}% chance)`);
                        this.explodeOnCountermeasure('knuckle');
                        return true;
                    } else {
                        console.log(`Torpedo saw through knuckle decoy! (${((1 - successRate) * 100).toFixed(0)}% chance)`);
                        // Torpedo continues but may retarget
                        this.retargetAfterCountermeasure();
                    }
                }
            }
        }
        return false;
    }

    checkNoisemakerCollision() {
        if (!window.getActiveNoisemakers) return false;

        const noisemakers = window.getActiveNoisemakers();
        for (let noisemaker of noisemakers) {
            const distance = this.position.distanceTo(noisemaker.position);
            if (distance < 3.0) { // 3 meter collision radius for noisemakers
                // Probabilistic countermeasure success - noisemakers more effective than knuckles
                const baseSuccessRate = 0.8; // 80% base success rate for noisemakers
                const sophisticationPenalty = this.homingMode.sophistication * 0.15; // More penalty for sophisticated guidance
                const successRate = Math.max(0.4, baseSuccessRate - sophisticationPenalty);
                
                if (Math.random() < successRate) {
                    console.log(`Torpedo fooled by noisemaker! (${(successRate * 100).toFixed(0)}% chance)`);
                    this.explodeOnCountermeasure('noisemaker');
                    return true;
                } else {
                    console.log(`Torpedo resisted noisemaker! (${((1 - successRate) * 100).toFixed(0)}% chance)`);
                    this.retargetAfterCountermeasure();
                }
            }
        }
        return false;
    }

    retargetAfterCountermeasure() {
        // Torpedo AI attempts to reacquire original target or find new one
        if (this.originalTarget && this.originalTarget.getPosition) {
            const distanceToOriginal = this.position.distanceTo(this.originalTarget.getPosition());
            if (distanceToOriginal < 100) { // Within 100m, try to reacquire
                this.target = this.originalTarget;
                console.log('Torpedo reacquired original target after countermeasure');
                return;
            }
        }
        
        // Look for alternative targets in the area
        const newTargets = this.findNoisyTargetsInArc();
        if (newTargets.length > 0) {
            // Prefer non-decoy targets
            const realTargets = newTargets.filter(t => !t.isKnuckle && !t.isNoisemaker);
            this.target = realTargets.length > 0 ? realTargets[0] : newTargets[0];
            console.log('Torpedo found alternative target after countermeasure');
        } else {
            console.log('Torpedo lost all targets after countermeasure - going ballistic');
            this.target = null;
        }
    }

    checkTorpedoEvasion(incomingTorpedo) {
        // Only torpedoes can evade other torpedoes
        if (this.type !== 'torpedo' || !incomingTorpedo || incomingTorpedo.type !== 'torpedo') {
            return false;
        }
        
        const distance = this.position.distanceTo(incomingTorpedo.position);
        if (distance > 25) return false; // Only evade when close
        
        // Calculate evasion probability based on torpedo characteristics
        const speedAdvantage = this.speed / incomingTorpedo.speed;
        const maneuverabilityRatio = this.maneuverability / (incomingTorpedo.maneuverability || 1);
        
        // Light torpedoes are more agile, heavy torpedoes are faster
        let baseEvasionChance = 0.15; // 15% base chance
        
        if (speedAdvantage > 1.2) baseEvasionChance += 0.1; // +10% if significantly faster
        if (maneuverabilityRatio > 1.5) baseEvasionChance += 0.15; // +15% if more maneuverable
        
        // Light vs heavy torpedo dynamics
        if (this.torpedoClass === 'light' && incomingTorpedo.torpedoClass === 'heavy') {
            baseEvasionChance += 0.2; // Light torpedoes better at dodging heavy ones
        } else if (this.torpedoClass === 'heavy' && incomingTorpedo.torpedoClass === 'light') {
            baseEvasionChance += 0.1; // Heavy torpedoes can power through light torpedo intercepts
        }
        
        if (Math.random() < baseEvasionChance) {
            console.log(`${this.torpedoClass} torpedo evaded ${incomingTorpedo.torpedoClass} torpedo! (${(baseEvasionChance * 100).toFixed(0)}% chance)`);
            
            // Perform evasive maneuver
            const evasionDirection = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                0,
                (Math.random() - 0.5) * 2
            ).normalize();
            
            this.velocity.add(evasionDirection.multiplyScalar(this.speed * 0.3));
            return true;
        }
        
        return false;
    }

    explodeOnCountermeasure(countermeasureType) {
        // Torpedo detonates when hitting countermeasure, causing proximity damage
        console.log(`Torpedo detonated on ${countermeasureType} - checking for nearby submarines`);

        // Create explosion effect
        this.createExplosion();

        // Check for nearby submarines to apply proximity damage
        this.applyProximityDamage();

        // Destroy torpedo
        this.destroy();
    }

    applyProximityDamage() {
        const blastRadius = 15; // 15 meter blast radius
        const proximityDamage = this.type.damage * 0.5; // Half damage for proximity hits

        // Check player submarine
        if (window.getPlayerSubmarine) {
            const playerSub = window.getPlayerSubmarine();
            const distance = this.position.distanceTo(playerSub.mesh.position);

            if (distance < blastRadius) {
                console.log(`Proximity blast damage to player submarine: ${proximityDamage}`);
                if (playerSub.takeDamage) {
                    playerSub.takeDamage(proximityDamage);
                }
            }
        }

        // Check enemy submarines
        if (window.getEnemySubmarines) {
            const enemies = window.getEnemySubmarines();
            enemies.forEach(enemy => {
                const distance = this.position.distanceTo(enemy.getPosition());
                if (distance < blastRadius) {
                    console.log(`Proximity blast damage to enemy submarine: ${proximityDamage}`);
                    if (enemy.takeDamage) {
                        enemy.takeDamage(proximityDamage);
                    }
                }
            });
        }
    }

    impact(target) {
        console.log(`${this.type.name} torpedo impact! Target hit for ${this.type.damage} damage.`);

        // Apply damage to target
        if (target.takeDamage) {
            target.takeDamage(this.type.damage);
        }

        // Create explosion effect
        this.createExplosion();
        this.destroy();
    }

    impactSeabed() {
        console.log(`${this.type.name} torpedo impacted seabed.`);
        this.createExplosion();
        this.destroy();
    }

    createExplosion() {
        // Create wireframe explosion sphere
        const explosionGeometry = new THREE.SphereGeometry(3, 8, 8);
        const explosionEdges = new THREE.EdgesGeometry(explosionGeometry);
        const explosionMaterial = new THREE.LineBasicMaterial({
            color: 0xff4400,
            transparent: true,
            opacity: 0.8
        });

        const explosion = new THREE.LineSegments(explosionEdges, explosionMaterial);
        explosion.position.copy(this.position);
        this.scene.add(explosion);

        // Animate explosion
        let explosionTime = 0;
        const explosionTimer = setInterval(() => {
            explosionTime += 0.05;
            explosion.scale.setScalar(1 + explosionTime * 2);
            explosion.material.opacity = Math.max(0, 0.8 - explosionTime);

            if (explosionTime > 1.0) {
                this.scene.remove(explosion);
                explosion.geometry.dispose();
                explosion.material.dispose();
                clearInterval(explosionTimer);
            }
        }, 50);
    }

    destroy() {
        // Clean up trail particles
        this.trailParticles.forEach(particle => {
            this.scene.remove(particle.mesh);
            particle.mesh.geometry.dispose();
            particle.mesh.material.dispose();
        });

        // Remove torpedo mesh
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
    }

    getPosition() {
        return this.position.clone();
    }
}

// Weapons System Manager
class WeaponsSystem {
    constructor(scene, submarine) {
        this.scene = scene;
        this.submarine = submarine;
        this.torpedoes = [];

        // Individual tube loadouts
        this.tubes = {
            tube1: {
                loaded: true,
                reloading: false,
                reloadTimer: 0,
                torpedoType: 'MHD_CONVENTIONAL',
                homingMode: 'ACTIVE'
            },
            tube2: {
                loaded: true,
                reloading: false,
                reloadTimer: 0,
                torpedoType: 'MHD_CONVENTIONAL',
                homingMode: 'ACTIVE'
            },
            tube3: {
                loaded: true,
                reloading: false,
                reloadTimer: 0,
                torpedoType: 'MHD_CONVENTIONAL',
                homingMode: 'ACTIVE'
            },
            tube4: {
                loaded: true,
                reloading: false,
                reloadTimer: 0,
                torpedoType: 'MHD_CONVENTIONAL',
                homingMode: 'ACTIVE'
            }
        };

        this.selectedTube = 'tube1';

        // Ammunition
        this.ammunition = {
            MHD_CONVENTIONAL: 8,
            SUPERCAVITATING: 4
        };

        this.init();
    }

    init() {
        this.updateWeaponsDisplay();
        console.log('Weapons system initialized');
    }

    selectTube(tubeKey) {
        if (this.tubes[tubeKey]) {
            this.selectedTube = tubeKey;
            this.updateWeaponsDisplay();
            console.log(`Selected ${tubeKey} for configuration`);
        }
    }

    setSelectedTubeTorpedoType(type) {
        if (TORPEDO_TYPES[type] && this.tubes[this.selectedTube]) {
            this.tubes[this.selectedTube].torpedoType = type;
            this.updateWeaponsDisplay();
            console.log(`Set ${this.selectedTube} to ${TORPEDO_TYPES[type].name} torpedo`);
        }
    }

    setSelectedTubeHomingMode(mode) {
        if (HOMING_MODES[mode] && this.tubes[this.selectedTube]) {
            this.tubes[this.selectedTube].homingMode = mode;
            this.updateWeaponsDisplay();
            console.log(`Set ${this.selectedTube} to ${HOMING_MODES[mode].name} guidance`);
        }
    }

    cycleTorpedoType() {
        const tube = this.tubes[this.selectedTube];
        const types = Object.keys(TORPEDO_TYPES);
        const currentIndex = types.indexOf(tube.torpedoType);
        const nextIndex = (currentIndex + 1) % types.length;
        this.setSelectedTubeTorpedoType(types[nextIndex]);
    }

    cycleHomingMode() {
        const tube = this.tubes[this.selectedTube];
        const modes = Object.keys(HOMING_MODES);
        const currentIndex = modes.indexOf(tube.homingMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        this.setSelectedTubeHomingMode(modes[nextIndex]);
    }

    // Preset loadouts
    applyPreset(presetNumber) {
        const presets = {
            1: { // F1 - Balanced: All MHD/Active
                tube1: { torpedoType: 'MHD_CONVENTIONAL', homingMode: 'ACTIVE' },
                tube2: { torpedoType: 'MHD_CONVENTIONAL', homingMode: 'ACTIVE' },
                tube3: { torpedoType: 'MHD_CONVENTIONAL', homingMode: 'ACTIVE' },
                tube4: { torpedoType: 'MHD_CONVENTIONAL', homingMode: 'ACTIVE' }
            },
            2: { // F2 - Close Combat: All Super-Cav/Wire Guided
                tube1: { torpedoType: 'SUPERCAVITATING', homingMode: 'WIRE_GUIDED' },
                tube2: { torpedoType: 'SUPERCAVITATING', homingMode: 'WIRE_GUIDED' },
                tube3: { torpedoType: 'SUPERCAVITATING', homingMode: 'WIRE_GUIDED' },
                tube4: { torpedoType: 'SUPERCAVITATING', homingMode: 'WIRE_GUIDED' }
            },
            3: { // F3 - Mixed: Alternating types
                tube1: { torpedoType: 'MHD_CONVENTIONAL', homingMode: 'ACTIVE' },
                tube2: { torpedoType: 'SUPERCAVITATING', homingMode: 'PASSIVE' },
                tube3: { torpedoType: 'MHD_CONVENTIONAL', homingMode: 'ACTIVE' },
                tube4: { torpedoType: 'SUPERCAVITATING', homingMode: 'PASSIVE' }
            },
            4: { // F4 - Stealth: All MHD/Passive
                tube1: { torpedoType: 'MHD_CONVENTIONAL', homingMode: 'PASSIVE' },
                tube2: { torpedoType: 'MHD_CONVENTIONAL', homingMode: 'PASSIVE' },
                tube3: { torpedoType: 'MHD_CONVENTIONAL', homingMode: 'PASSIVE' },
                tube4: { torpedoType: 'MHD_CONVENTIONAL', homingMode: 'PASSIVE' }
            }
        };

        const preset = presets[presetNumber];
        if (preset) {
            Object.keys(preset).forEach(tubeKey => {
                if (this.tubes[tubeKey]) {
                    this.tubes[tubeKey].torpedoType = preset[tubeKey].torpedoType;
                    this.tubes[tubeKey].homingMode = preset[tubeKey].homingMode;
                }
            });
            this.updateWeaponsDisplay();
            console.log(`Applied preset ${presetNumber}: ${this.getPresetName(presetNumber)}`);
        }
    }

    getPresetName(presetNumber) {
        const names = {
            1: 'Balanced (All MHD/Active)',
            2: 'Close Combat (All Super-Cav/Wire)',
            3: 'Mixed (Alt MHD/Super-Cav)',
            4: 'Stealth (All MHD/Passive)'
        };
        return names[presetNumber] || 'Unknown';
    }

    fire() {
        const tube = this.tubes[this.selectedTube];

        // Check if tube is loaded and we have ammunition
        if (!tube.loaded || tube.reloading || this.ammunition[tube.torpedoType] <= 0) {
            console.log(`Cannot fire from ${this.selectedTube}: tube not ready or out of ammunition`);
            return false;
        }

        // Get submarine position and rotation
        const submarinePos = this.submarine.getPosition();
        const submarineRot = this.submarine.getRotation();

        // Calculate launch position (from torpedo tube)
        const launchOffset = new THREE.Vector3(2, -0.3, 0); // Front of submarine
        launchOffset.applyEuler(submarineRot);
        const launchPosition = submarinePos.clone().add(launchOffset);

        // Create torpedo using tube's specific configuration
        const torpedo = new Torpedo(
            this.scene,
            launchPosition,
            submarineRot,
            tube.torpedoType,
            tube.homingMode
        );

        this.torpedoes.push(torpedo);

        // Update tube status
        tube.loaded = false;
        tube.reloading = true;
        tube.reloadTimer = TORPEDO_TYPES[tube.torpedoType].reloadTime;

        // Consume ammunition
        this.ammunition[tube.torpedoType]--;

        // Auto-select next loaded tube for convenience
        this.selectNextLoadedTube();

        this.updateWeaponsDisplay();

        console.log(`Fired ${TORPEDO_TYPES[tube.torpedoType].name} torpedo with ${HOMING_MODES[tube.homingMode].name} from ${this.selectedTube}`);
        return true;
    }

    selectNextLoadedTube() {
        const tubes = Object.keys(this.tubes);
        const currentIndex = tubes.indexOf(this.selectedTube);

        // Find next available tube
        for (let i = 1; i < tubes.length; i++) {
            const nextIndex = (currentIndex + i) % tubes.length;
            const nextTube = tubes[nextIndex];

            if (this.tubes[nextTube].loaded && !this.tubes[nextTube].reloading) {
                this.selectedTube = nextTube;
                return;
            }
        }

        // If no loaded tubes, stay on current (will show in HUD as not ready)
    }

    update(deltaTime) {
        // Update torpedo tubes reloading
        Object.keys(this.tubes).forEach(tubeKey => {
            const tube = this.tubes[tubeKey];
            if (tube.reloading) {
                tube.reloadTimer -= deltaTime * 1000; // Convert to ms

                if (tube.reloadTimer <= 0) {
                    tube.reloading = false;
                    tube.loaded = true;
                    console.log(`${tubeKey} reloaded`);
                }
            }
        });

        // Update active torpedoes
        this.torpedoes = this.torpedoes.filter(torpedo => {
            return torpedo.update(deltaTime);
        });

        // Update weapons display periodically
        if (Math.random() < 0.1) { // 10% chance per frame
            this.updateWeaponsDisplay();
        }
    }

    updateWeaponsDisplay() {
        // Update selected tube display
        const selectedTube = this.tubes[this.selectedTube];
        const torpedoTypeElement = document.getElementById('torpedoType');
        if (torpedoTypeElement) {
            const typeInfo = TORPEDO_TYPES[selectedTube.torpedoType];
            torpedoTypeElement.innerHTML = `Tube ${this.selectedTube.replace('tube', '')}: ${typeInfo.name}<br>Speed: ${typeInfo.speed}kt | Range: ${typeInfo.range}m`;
        }

        // Update homing mode display
        const homingModeElement = document.getElementById('homingMode');
        if (homingModeElement) {
            const modeInfo = HOMING_MODES[selectedTube.homingMode];
            homingModeElement.innerHTML = `Guidance: ${modeInfo.name}<br>${modeInfo.description}`;
        }

        // Update ammunition display
        const ammoElement = document.getElementById('ammunition');
        if (ammoElement) {
            ammoElement.innerHTML = `Ammo: MHD ${this.ammunition.MHD_CONVENTIONAL} | SC ${this.ammunition.SUPERCAVITATING}`;
        }

        // Update individual tube status display
        const tubeStatusElement = document.getElementById('tubeStatus');
        if (tubeStatusElement) {
            let statusHtml = '';
            Object.keys(this.tubes).forEach(tubeKey => {
                const tube = this.tubes[tubeKey];
                const tubeNumber = tubeKey.replace('tube', '');
                const isSelected = tubeKey === this.selectedTube;

                // Color coding: selected=yellow, ready=green, reloading=orange, empty=red
                let color = '#ffffff';
                let status = '';

                if (isSelected) {
                    color = '#ffff00'; // Yellow for selected
                    status += `[${tubeNumber}] `;
                } else {
                    status += `${tubeNumber} `;
                }

                // Torpedo type abbreviation
                const typeAbbr = tube.torpedoType === 'MHD_CONVENTIONAL' ? 'M' : 'S';

                // Homing mode abbreviation
                const modeAbbr = {
                    'HOMING': 'H', 'PASSIVE': 'P', 'SEMI_ACTIVE': 'SA',
                    'ACTIVE': 'A', 'WIRE_GUIDED': 'W', 'WAKE_FOLLOWING': 'WF'
                }[tube.homingMode] || '?';

                if (tube.loaded && !tube.reloading) {
                    if (!isSelected) color = '#00ff00'; // Green for ready
                    status += `${typeAbbr}${modeAbbr}✓ `;
                } else if (tube.reloading) {
                    color = '#ff8800'; // Orange for reloading
                    const reloadSeconds = Math.ceil(tube.reloadTimer / 1000);
                    status += `${typeAbbr}${modeAbbr}(${reloadSeconds}s) `;
                } else {
                    color = '#ff0000'; // Red for empty/not ready
                    status += `${typeAbbr}${modeAbbr}✗ `;
                }

                statusHtml += `<span style="color: ${color}">${status}</span>`;
            });
            tubeStatusElement.innerHTML = `Tubes: ${statusHtml}`;
        }
    }

    // Get weapons info for tactical display
    getWeaponsInfo() {
        return {
            selectedTorpedo: TORPEDO_TYPES[this.selectedTorpedoType],
            selectedHoming: HOMING_MODES[this.selectedHomingMode],
            ammunition: this.ammunition,
            tubes: this.tubes,
            activeTorpedoes: this.torpedoes.length
        };
    }

    cleanup() {
        // Destroy all active torpedoes
        this.torpedoes.forEach(torpedo => torpedo.destroy());
        this.torpedoes = [];
    }
}

// Modern Fighter Submarine Weapons System
class FighterWeaponsSystem {
    constructor(scene, submarine) {
        this.scene = scene;
        this.submarine = submarine;

        // Current weapon selection
        this.selectedWeapon = 'LIGHT_TORPEDOES'; // Default weapon
        this.weapons = {};

        // Initialize all weapon loadouts
        Object.keys(WEAPON_TYPES).forEach(weaponKey => {
            const weaponType = WEAPON_TYPES[weaponKey];
            this.weapons[weaponKey] = {
                type: weaponType,
                ammo: weaponType.ammoCount,
                lastFired: 0,
                lockProgress: 0,
                isLocking: false,
                target: null
            };
        });

        // Active projectiles
        this.projectiles = [];

        // Target selection
        this.targets = [];
        this.selectedTarget = null;
        this.targetIndex = 0;

        console.log('Fighter weapons system loaded with 8 weapon types');
        this.updateHUD();
    }

    update(deltaTime) {
        // Update all projectiles
        this.projectiles.forEach((projectile, index) => {
            projectile.update(deltaTime);
            if (projectile.shouldDestroy) {
                projectile.destroy();
                this.projectiles.splice(index, 1);
            }
        });

        // Update target lock progress
        this.updateTargetLock(deltaTime);

        // Update point defense systems (auto-fire)
        this.updatePointDefense(deltaTime);

        // Update HUD periodically
        if (Math.floor(this.projectiles.length / 10) !== Math.floor((this.projectiles.length - 1) / 10)) {
            this.updateHUD();
        }
    }

    updateTargetLock(deltaTime) {
        const currentWeapon = this.weapons[this.selectedWeapon];
        const weaponType = currentWeapon.type;

        if (weaponType.lockRequired && this.selectedTarget) {
            const distance = this.submarine.mesh.position.distanceTo(this.selectedTarget.getPosition());
            const lockTime = weaponType.lockTime || 2000;

            if (distance < weaponType.range) {
                currentWeapon.lockProgress += (1000 / lockTime) * deltaTime;
                currentWeapon.lockProgress = Math.min(1, currentWeapon.lockProgress);
                currentWeapon.isLocking = true;
            } else {
                currentWeapon.lockProgress *= 0.95; // Decay when out of range
                currentWeapon.isLocking = false;
            }
        } else if (!weaponType.lockRequired) {
            // Only reset lock for weapons that don't require locking
            currentWeapon.lockProgress = 0;
            currentWeapon.isLocking = false;
        } else {
            // For lock-required weapons with no target, just stop locking but preserve progress
            currentWeapon.isLocking = false;
        }
    }

    updatePointDefense(deltaTime) {
        // Auto-fire point defense at incoming threats
        const pdWeapon = this.weapons.POINT_DEFENSE;
        if (!pdWeapon || pdWeapon.ammo <= 0) return;

        const currentTime = Date.now();
        if (currentTime - pdWeapon.lastFired < pdWeapon.type.reloadTime) return;

        // Find incoming torpedoes/missiles
        const threats = this.findIncomingThreats();
        if (threats.length > 0) {
            const nearestThreat = threats[0];
            this.firePointDefense(nearestThreat);
            pdWeapon.lastFired = currentTime;
        }
    }

    fire() {
        const currentWeapon = this.weapons[this.selectedWeapon];
        const weaponType = currentWeapon.type;
        const currentTime = Date.now();

        // Check ammo
        if (currentWeapon.ammo <= 0) {
            console.log(`${weaponType.name}: Out of ammo!`);
            return false;
        }

        // Check reload time
        if (currentTime - currentWeapon.lastFired < weaponType.reloadTime) {
            return false;
        }

        // Check lock requirement
        if (weaponType.lockRequired && currentWeapon.lockProgress < 0.8) {
            console.log(`${weaponType.name}: Lock required!`);
            return false;
        }

        // Fire the weapon
        this.createProjectile(weaponType, this.selectedTarget);
        currentWeapon.ammo--;
        currentWeapon.lastFired = currentTime;

        // Trigger sonar signature based on weapon type
        if (this.submarine.triggerWeaponsFire) {
            if (weaponType.type === 'torpedo') {
                this.submarine.triggerTorpedoLaunch();
            } else {
                this.submarine.triggerWeaponsFire();
            }
        }

        // Reset lock after firing
        if (weaponType.lockRequired) {
            currentWeapon.lockProgress = 0;
            currentWeapon.isLocking = false;
        }

        console.log(`Fired ${weaponType.name} (${currentWeapon.ammo} remaining)`);
        return true;
    }

    createProjectile(weaponType, target) {
        const submarinePos = this.submarine.mesh.position.clone();
        const submarineRot = this.submarine.mesh.rotation.clone();

        // Create appropriate projectile type
        let projectile;
        switch(weaponType.type) {
        case 'rocket':
            projectile = new Rocket(this.scene, submarinePos, submarineRot, weaponType);
            break;
        case 'scav_rocket':
            projectile = new SCAVRocket(this.scene, submarinePos, submarineRot, weaponType);
            break;
        case 'torpedo':
            projectile = new GuidedTorpedo(this.scene, submarinePos, submarineRot, weaponType, target);
            break;
        case 'interceptor':
            projectile = new InterceptorTorpedo(this.scene, submarinePos, submarineRot, weaponType);
            break;
        case 'cannon':
            projectile = new CannonRound(this.scene, submarinePos, submarineRot, weaponType, target);
            break;
        case 'pointdefense':
            projectile = new PointDefenseRound(this.scene, submarinePos, submarineRot, weaponType, target);
            break;
        case 'scav_cannon':
            projectile = new SCAVCannonRound(this.scene, submarinePos, submarineRot, weaponType, target);
            break;
        case 'scav_point_defense':
            projectile = new SCAVCannonRound(this.scene, submarinePos, submarineRot, weaponType, target);
            break;
        case 'wiskr_drone':
            projectile = new WISKRDrone(this.scene, submarinePos, submarineRot, weaponType);
            break;
        }

        if (projectile) {
            this.projectiles.push(projectile);
        }
    }

    // Removed duplicate methods - using the ones with updateHUD() calls above

    updateTargets() {
        // Get enemy submarines from enemies system
        this.targets = window.getEnemySubmarines ? window.getEnemySubmarines() : [];
        console.log(`Found ${this.targets.length} enemy targets`);
        if (this.targets.length > 0) {
            console.log('Target 0 position:', this.targets[0].getPosition());
        }
    }

    findIncomingThreats() {
        // Find incoming projectiles that threaten the submarine
        return this.projectiles.filter(projectile => {
            if (projectile.isEnemyProjectile && !projectile.isDestroyed) {
                const distance = projectile.position.distanceTo(this.submarine.mesh.position);
                return distance < 500; // Within point defense range
            }
            return false;
        });
    }

    firePointDefense(target) {
        // Create point defense projectile
        this.createProjectile(WEAPON_TYPES.POINT_DEFENSE, target);
    }

    updateHUD() {
        // Update weapons display
        const weaponElement = document.getElementById('torpedoType');
        const ammoElement = document.getElementById('ammunition');

        if (weaponElement) {
            const currentWeapon = this.weapons[this.selectedWeapon];
            weaponElement.textContent = `Weapon: ${currentWeapon.type.name}`;
        }

        if (ammoElement) {
            const currentWeapon = this.weapons[this.selectedWeapon];
            let lockStatus = '';
            if (currentWeapon.type.lockRequired && this.selectedTarget) {
                const lockPercent = Math.round(currentWeapon.lockProgress * 100);
                lockStatus = currentWeapon.isLocking ? ` [Locking: ${lockPercent}%]` : ' [No Lock]';
            }
            ammoElement.textContent = `Ammo: ${currentWeapon.ammo}${lockStatus}`;
        }

        // Update target info
        const targetElement = document.getElementById('targetDetails');
        if (targetElement) {
            if (this.selectedTarget) {
                const distance = this.submarine.mesh.position.distanceTo(this.selectedTarget.getPosition());
                targetElement.textContent = `Target: Enemy Sub (${distance.toFixed(0)}m)`;
            } else {
                targetElement.textContent = 'No target selected - Press TAB';
            }
        }
    }

    cycleWeapon() {
        const weaponKeys = Object.keys(WEAPON_TYPES);
        const currentIndex = weaponKeys.indexOf(this.selectedWeapon);
        const nextIndex = (currentIndex + 1) % weaponKeys.length;
        this.selectedWeapon = weaponKeys[nextIndex];

        console.log(`Selected: ${WEAPON_TYPES[this.selectedWeapon].name}`);
        this.updateHUD();
    }

    cycleTarget() {
        console.log(`Cycling targets. Available: ${this.targets.length}`);
        if (this.targets.length === 0) {
            console.log('No targets available to cycle');
            return;
        }

        this.targetIndex = (this.targetIndex + 1) % this.targets.length;
        this.selectedTarget = this.targets[this.targetIndex];

        console.log(`Selected target ${this.targetIndex + 1}/${this.targets.length}`);
        console.log('Target position:', this.selectedTarget.getPosition());
        this.updateHUD();
    }

    cleanup() {
        this.projectiles.forEach(projectile => projectile.destroy());
        this.projectiles = [];
    }
}

// Global weapons system instance
let weaponsSystem = null;

// Initialize weapons system
function initWeapons(scene, submarine) {
    if (weaponsSystem) {
        weaponsSystem.cleanup();
    }
    weaponsSystem = new FighterWeaponsSystem(scene, submarine);
    window.weaponsSystem = weaponsSystem; // Make globally accessible
    console.log('Elite fighter weapons system loaded');
    return weaponsSystem;
}

// Update weapons system
function updateWeapons(deltaTime) {
    if (weaponsSystem) {
        weaponsSystem.update(deltaTime);
    }
}

// Fire current weapon
function fireWeapon() {
    if (weaponsSystem) {
        return weaponsSystem.fire();
    }
    return false;
}

// Weapon selection functions
function cycleWeapon() {
    if (weaponsSystem) {
        weaponsSystem.cycleWeapon();
    }
}

function cycleTarget() {
    if (weaponsSystem) {
        weaponsSystem.updateTargets();
        weaponsSystem.cycleTarget();
    }
}

// Legacy functions for compatibility
function cycleTorpedoType() {
    cycleWeapon(); // Map to new weapon cycling
}

function cycleHomingMode() {
    cycleWeapon(); // Map to new weapon cycling
}

// Individual tube control functions
function selectTube(tubeNumber) {
    if (weaponsSystem && tubeNumber >= 1 && tubeNumber <= 4) {
        weaponsSystem.selectTube(`tube${tubeNumber}`);
    }
}

// Preset loadout functions
function applyWeaponPreset(presetNumber) {
    if (weaponsSystem && presetNumber >= 1 && presetNumber <= 4) {
        weaponsSystem.applyPreset(presetNumber);
    }
}

// Export functions, classes, and constants
window.initWeapons = initWeapons;
window.updateWeapons = updateWeapons;
window.fireWeapon = fireWeapon;
window.cycleWeapon = cycleWeapon;
window.cycleTarget = cycleTarget;
window.cycleTorpedoType = cycleTorpedoType;
window.weaponsSystem = weaponsSystem; // Make globally accessible
window.cycleHomingMode = cycleHomingMode;
window.selectTube = selectTube;
window.applyWeaponPreset = applyWeaponPreset;
window.weaponsSystem = () => weaponsSystem;

// Export weapon types and classes for testing
window.WEAPON_TYPES = WEAPON_TYPES;
window.Projectile = Projectile;
window.GuidedTorpedo = GuidedTorpedo;
window.InterceptorTorpedo = InterceptorTorpedo;
window.Rocket = Rocket;
window.SCAVRocket = SCAVRocket;
window.CannonRound = CannonRound;
window.SCAVCannonRound = SCAVCannonRound;
window.SCAVPointDefense = SCAVPointDefense;
window.WISKRDrone = WISKRDrone;
window.WeaponsSystem = WeaponsSystem;

console.log('Weapons module loaded with high-speed torpedo combat system');
