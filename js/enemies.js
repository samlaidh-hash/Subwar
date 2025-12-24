// Sub War 2060 - Enemies Module

// Enemy submarine AI system
class EnemySubmarine {
    constructor(scene, position = new THREE.Vector3(0, -10, 0), type = 'attack') {
        this.scene = scene;
        this.type = type; // 'attack', 'patrol', 'hunter-killer'
        this.submarineClass = type.toUpperCase(); // For logging/debugging
        this.mesh = null;
        this.position = position.clone();
        this.rotation = new THREE.Euler(0, Math.random() * Math.PI * 2, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.destroyed = false; // Initialize destroyed flag
        this.targetDirection = null; // Initialize target direction

        // Submarine stats
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 0;
        this.maxSpeed = 85; // High-speed fighter submarine (slightly slower than player)
        this.detectionRange = 120; // DOUBLED: AI sonar range (was 60)
        this.weaponRange = 40;

        // AI state machine
        this.state = 'patrol'; // patrol, hunt, attack, evade, damaged
        this.target = null;
        this.lastKnownTargetPos = null;
        this.lastSonarPing = 0;
        this.sonarCooldown = 3000; // AI pings every 3 seconds
        this.stateTimer = 0;
        this.searchPatternIndex = 0;

        // AI behavior parameters
        this.aggressiveness = 0.7; // 0-1, affects engagement distance
        this.intelligence = 0.8; // 0-1, affects decision quality
        this.caution = 0.6; // 0-1, affects retreat behavior
        this.patrolRadius = 40;
        this.patrolCenter = position.clone();
        this.currentWaypoint = null;

        // Sonar detection (no cheating - uses same sonar rules as player)
        this.knownContacts = new Map();
        this.lastPlayerDetection = 0;
        this.playerDetectionTimeout = 30000; // 30 seconds

        // Enhanced sensor capability (for recon units)
        this.sensorMultiplier = 1.0; // Default, can be enhanced via mesh userData

        this.init();
    }

    init() {
        this.createEnemyMesh();
        this.generatePatrolRoute();
        console.log(`Enemy submarine ${this.type} initialized at ${this.position.x}, ${this.position.z}`);
    }

    createEnemyMesh() {
        const submarineGroup = new THREE.Group();

        // Enemy vector wireframe material (white lines, slightly dimmer than player)
        const vectorMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 1,
            transparent: true,
            opacity: 0.8
        });

        // Enemy hull outline (slightly different shape than player)
        const hullGeometry = new THREE.CylinderGeometry(0.4, 0.3, 3.5, 8);
        const hullEdges = new THREE.EdgesGeometry(hullGeometry);
        const hull = new THREE.LineSegments(hullEdges, vectorMaterial);
        hull.rotation.z = Math.PI / 2;
        submarineGroup.add(hull);

        // Conning tower (wireframe)
        const towerGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.5);
        const towerEdges = new THREE.EdgesGeometry(towerGeometry);
        const tower = new THREE.LineSegments(towerEdges, vectorMaterial);
        tower.position.set(0, 0.35, 0);
        submarineGroup.add(tower);

        // Propeller (wireframe)
        const propellerGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 6);
        const propellerEdges = new THREE.EdgesGeometry(propellerGeometry);
        const propeller = new THREE.LineSegments(propellerEdges, vectorMaterial);
        propeller.position.set(-1.8, 0, 0);
        propeller.rotation.z = Math.PI / 2;
        submarineGroup.add(propeller);

        // Enemy identification markers (X symbols instead of crosses)
        const enemyMarkerGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-0.08, -0.08, 0),
            new THREE.Vector3(0.08, 0.08, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-0.08, 0.08, 0),
            new THREE.Vector3(0.08, -0.08, 0)
        ]);

        const leftMarker = new THREE.Line(enemyMarkerGeometry, vectorMaterial);
        leftMarker.position.set(1.5, 0, -0.4);
        submarineGroup.add(leftMarker);

        const rightMarker = new THREE.Line(enemyMarkerGeometry, vectorMaterial);
        rightMarker.position.set(1.5, 0, 0.4);
        submarineGroup.add(rightMarker);

        // Enemy directional indicator (double arrow for hostility)
        const enemyArrowGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(1.8, 0, 0),
            new THREE.Vector3(1.5, 0.08, 0),
            new THREE.Vector3(1.8, 0, 0),
            new THREE.Vector3(1.5, -0.08, 0),
            new THREE.Vector3(1.8, 0, 0),
            new THREE.Vector3(1.6, 0, 0),
            new THREE.Vector3(1.9, 0, 0),
            new THREE.Vector3(1.65, 0.06, 0),
            new THREE.Vector3(1.9, 0, 0),
            new THREE.Vector3(1.65, -0.06, 0)
        ]);
        const enemyArrow = new THREE.Line(enemyArrowGeometry, vectorMaterial);
        submarineGroup.add(enemyArrow);

        this.mesh = submarineGroup;
        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);
        this.mesh.name = `enemySubmarine_${this.type}`;
        this.scene.add(this.mesh);
    }

    calculateDetectionRange(targetSignature, targetPosition) {
        // AI detection range calculation with wake shadow and aspect angle effects
        const baseRange = this.detectionRange; // Base AI detection range
        const signatureMultiplier = Math.sqrt(targetSignature / 6); // Scale relative to average signature
        const sensorMultiplier = this.sensorMultiplier || 1.0; // Enhanced sensors for recon units

        let finalRange = baseRange * signatureMultiplier * sensorMultiplier;

        // Apply wake shadow and aspect angle effects from enemy's perspective
        const enemyPos = this.position;
        const enemyForward = new THREE.Vector3(1, 0, 0);
        enemyForward.applyQuaternion(this.rotation);

        // Vector from enemy to target (player)
        const toTarget = targetPosition.clone().sub(enemyPos).normalize();

        // Calculate aspect angle from enemy's perspective
        const aspectAngle = enemyForward.dot(toTarget);

        // Check if target is in our wake shadow
        const isInWake = aspectAngle < -0.7; // Within ~45 degrees of directly astern

        if (isInWake) {
            const distance = enemyPos.distanceTo(targetPosition);
            const enemyLength = 25; // Estimated enemy submarine length
            const wakeLength = enemyLength * 6; // 6x submarine length wake shadow

            if (distance < wakeLength) {
                // Target is in our wake shadow - severely reduced detection
                finalRange *= 0.25; // 75% reduction
            }
        }

        // Aspect angle effects - beam aspect is best for detection
        let aspectModifier = 1.0;
        if (aspectAngle > 0.8) {
            // Target ahead - good detection
            aspectModifier = 0.9;
        } else if (aspectAngle < -0.3) {
            // Target behind - reduced detection due to engine noise
            aspectModifier = 0.75;
        } else {
            // Target on beam - optimal detection
            aspectModifier = 1.1;
        }

        return finalRange * aspectModifier;
    }

    generatePatrolRoute() {
        // Generate linear patrol routes instead of circular
        this.patrolWaypoints = [];
        const numWaypoints = 3 + Math.floor(Math.random() * 3);

        // Create waypoints in a line or L-shape pattern
        for (let i = 0; i < numWaypoints; i++) {
            const progress = i / (numWaypoints - 1);
            const randomOffset = (Math.random() - 0.5) * this.patrolRadius * 0.5;

            const waypoint = new THREE.Vector3(
                this.patrolCenter.x + progress * this.patrolRadius - this.patrolRadius/2,
                this.patrolCenter.y + (Math.random() - 0.5) * 10,
                this.patrolCenter.z + randomOffset
            );
            this.patrolWaypoints.push(waypoint);
        }

        this.currentWaypoint = this.patrolWaypoints[0];
    }

    // AI sonar system (follows same rules as player - no cheating!)
    performSonarScan(playerPosition) {
        const currentTime = Date.now();

        // Check if player just used active sonar - immediate detection!
        if (window.playerSubmarine && window.playerSubmarine()) {
            const player = window.playerSubmarine();
            const timeSincePlayerPing = currentTime - (player.firingReticle?.lastSonarPing || 0);

            // If player pinged with active sonar within last 2 seconds, we get perfect detection
            if (player.sonarMode === 'Active' && timeSincePlayerPing < 2000) {
                const distanceToPlayer = this.position.distanceTo(playerPosition);

                // Active sonar pings can be detected at very long range (up to 3km)
                if (distanceToPlayer <= 3000) {
                    this.knownContacts.set('player', {
                        position: playerPosition.clone(), // Perfect position from active ping
                        lastDetected: currentTime,
                        confidence: 1.0 // Perfect confidence
                    });

                    this.lastPlayerDetection = currentTime;
                    this.lastSonarPing = currentTime; // Update our cooldown

                    // Immediately enter hunt/attack mode
                    if (this.state === 'patrol') {
                        this.state = 'hunt';
                        this.target = playerPosition.clone();
                        console.log(`🚨 ${this.submarineClass} detected player's active sonar ping at ${Math.round(distanceToPlayer)}m!`);
                    } else if (this.state === 'hunt') {
                        this.state = 'attack';
                        this.target = playerPosition.clone();
                    }

                    return; // Early return - we already detected them perfectly
                }
            }
        }

        if (currentTime - this.lastSonarPing < this.sonarCooldown) {
            return;
        }

        this.lastSonarPing = currentTime;

        // Get dynamic player signature and calculate detection range with wake/aspect effects
        const playerSignature = window.playerSubmarine && window.playerSubmarine().getSonarSignature ?
            window.playerSubmarine().getSonarSignature() : 6; // Default if no signature available

        const distanceToPlayer = this.position.distanceTo(playerPosition);

        // Calculate effective detection range based on player's signature and our position relative to them
        const baseDetectionRange = this.calculateDetectionRange(playerSignature, playerPosition);

        if (distanceToPlayer <= baseDetectionRange) {
            // AI detected player - add some realistic uncertainty
            const detectionAccuracy = Math.max(0.3, 1 - (distanceToPlayer / this.detectionRange));
            const positionError = (1 - detectionAccuracy) * 5; // Up to 5m error

            const detectedPos = playerPosition.clone().add(new THREE.Vector3(
                (Math.random() - 0.5) * positionError,
                0,
                (Math.random() - 0.5) * positionError
            ));

            this.knownContacts.set('player', {
                position: detectedPos,
                lastDetected: currentTime,
                confidence: detectionAccuracy
            });

            this.lastPlayerDetection = currentTime;

            // Change state based on detection
            if (this.state === 'patrol') {
                this.state = 'hunt';
                this.target = detectedPos;
            }
        }
    }

    // Intelligent AI decision making
    updateAI(deltaTime, playerPosition, oceanCurrent = new THREE.Vector3(0, 0, 0)) {
        this.stateTimer += deltaTime;

        // Perform sonar scan
        this.performSonarScan(playerPosition);

        // Clean up old contacts
        const currentTime = Date.now();
        for (let [key, contact] of this.knownContacts) {
            if (currentTime - contact.lastDetected > this.playerDetectionTimeout) {
                this.knownContacts.delete(key);
            }
        }

        // State machine
        switch (this.state) {
        case 'patrol':
            this.doPatrol(deltaTime, oceanCurrent);
            break;
        case 'hunt':
            this.doHunt(deltaTime, playerPosition, oceanCurrent);
            break;
        case 'attack':
            this.doAttack(deltaTime, playerPosition, oceanCurrent);
            break;
        case 'evade':
            this.doEvade(deltaTime, playerPosition, oceanCurrent);
            break;
        case 'damaged':
            this.doDamaged(deltaTime, oceanCurrent);
            break;
        }

        // Apply movement
        this.applyMovement(deltaTime, oceanCurrent);
    }

    doPatrol(deltaTime, oceanCurrent) {
        if (!this.currentWaypoint) {
            this.generatePatrolRoute();
            return;
        }

        // Navigate to current waypoint
        const distanceToWaypoint = this.position.distanceTo(this.currentWaypoint);

        if (distanceToWaypoint < 5) {
            // Reached waypoint, move to next
            this.searchPatternIndex = (this.searchPatternIndex + 1) % this.patrolWaypoints.length;
            this.currentWaypoint = this.patrolWaypoints[this.searchPatternIndex];
        }

        // Steer toward waypoint
        const direction = this.currentWaypoint.clone().sub(this.position).normalize();
        this.targetDirection = direction;
        this.speed = Math.min(this.speed + 0.3, this.maxSpeed * 0.6); // Patrol at 60% speed
    }

    doHunt(deltaTime, playerPosition, oceanCurrent) {
        const playerContact = this.knownContacts.get('player');

        if (!playerContact || Date.now() - playerContact.lastDetected > 10000) {
            // Lost contact, return to patrol
            this.state = 'patrol';
            return;
        }

        const targetPos = playerContact.position;
        const distanceToTarget = this.position.distanceTo(targetPos);

        if (distanceToTarget < this.weaponRange * this.aggressiveness) {
            this.state = 'attack';
            return;
        }

        // Intelligent pursuit - predict player movement
        if (this.lastKnownTargetPos) {
            const playerVelocity = targetPos.clone().sub(this.lastKnownTargetPos);
            const predictedPos = targetPos.clone().add(playerVelocity.multiplyScalar(2));
            this.targetDirection = predictedPos.sub(this.position).normalize();
        } else {
            this.targetDirection = targetPos.clone().sub(this.position).normalize();
        }

        this.lastKnownTargetPos = targetPos.clone();
        this.speed = Math.min(this.speed + 0.5, this.maxSpeed * 0.9);
    }

    doAttack(deltaTime, playerPosition, oceanCurrent) {
        const playerContact = this.knownContacts.get('player');

        if (!playerContact) {
            this.state = 'hunt';
            return;
        }

        const targetPos = playerContact.position;
        const distanceToTarget = this.position.distanceTo(targetPos);

        if (distanceToTarget > this.weaponRange * 1.2) {
            this.state = 'hunt';
            return;
        }

        // Face target for attack
        this.targetDirection = targetPos.clone().sub(this.position).normalize();

        // Maintain attack distance
        if (distanceToTarget < this.weaponRange * 0.7) {
            this.speed = Math.max(this.speed - 0.3, this.maxSpeed * 0.3);
        } else {
            this.speed = Math.min(this.speed + 0.2, this.maxSpeed * 0.8);
        }

        // Simulate torpedo firing (visual/audio effect only for now)
        if (Math.random() < 0.001 && distanceToTarget < this.weaponRange) {
            console.log(`Enemy submarine fires torpedo at distance ${distanceToTarget.toFixed(1)}m`);
        }
    }

    doEvade(deltaTime, playerPosition, oceanCurrent) {
        // Evasive maneuvers - zigzag pattern away from player
        const avoidDirection = this.position.clone().sub(playerPosition).normalize();

        // Add zigzag component
        const zigzagAngle = Math.sin(this.stateTimer * 0.002) * Math.PI / 4;
        avoidDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), zigzagAngle);

        this.targetDirection = avoidDirection;
        this.speed = Math.min(this.speed + 0.7, this.maxSpeed);

        // Return to hunt after evasion
        if (this.stateTimer > 15000) { // 15 seconds
            this.state = 'hunt';
            this.stateTimer = 0;
        }
    }

    doDamaged(deltaTime, oceanCurrent) {
        // Damaged behavior - try to reach nearest friendly base or retreat
        this.speed = Math.max(this.speed - 0.1, this.maxSpeed * 0.3);

        // Simple retreat toward patrol center
        this.targetDirection = this.patrolCenter.clone().sub(this.position).normalize();

        if (this.health > 50) {
            this.state = 'patrol';
        }
    }

    applyMovement(deltaTime, oceanCurrent) {
        if (!this.targetDirection) return;

        // Smooth rotation toward target direction
        const targetRotationY = Math.atan2(this.targetDirection.x, this.targetDirection.z);
        const currentRotationY = this.rotation.y;
        let rotationDiff = targetRotationY - currentRotationY;

        // Handle angle wrapping
        if (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
        if (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;

        // Apply smooth rotation - slower for realistic submarine maneuvering
        const rotationSpeed = 0.012; // Reduced from 0.03 for more realistic turning
        this.rotation.y += rotationDiff * rotationSpeed;

        // Apply movement in facing direction
        if (this.speed > 0.1) {
            const moveDirection = new THREE.Vector3(
                Math.sin(this.rotation.y),
                0,
                Math.cos(this.rotation.y)
            );

            const movement = moveDirection.multiplyScalar(this.speed * deltaTime * 10);

            // Apply ocean current
            movement.add(oceanCurrent.clone().multiplyScalar(deltaTime * 10));

            // Store old position for collision detection
            const oldPosition = this.position.clone();
            this.position.add(movement);

            // Check seabed collision
            this.checkSeabedCollision(oldPosition);
        }

        // Update mesh position and rotation
        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.mesh.rotation.copy(this.rotation);
        }

        // Keep within ocean bounds
        const maxBounds = 100;
        if (Math.abs(this.position.x) > maxBounds || Math.abs(this.position.z) > maxBounds) {
            this.targetDirection = new THREE.Vector3(0, 0, 0).sub(this.position).normalize();
        }
    }

    checkSeabedCollision(oldPosition) {
        // Get ocean instance to check seabed height
        const oceanInstance = window.oceanInstance;
        if (!oceanInstance || !oceanInstance.getSeabedHeight) return;

        const seabedHeight = oceanInstance.getSeabedHeight(this.position.x, this.position.z);
        const submarineBottom = this.position.y - 2; // Enemy submarine hull extends 2 units down

        if (submarineBottom <= seabedHeight) {
            // Collision detected - calculate impact speed
            const impactSpeed = this.speed;
            const speedThreshold = 3; // Lower threshold for AI (they're more fragile)

            if (impactSpeed > speedThreshold) {
                // Calculate damage based on speed
                const damage = Math.floor((impactSpeed - speedThreshold) * 3);
                this.takeDamage(damage);
                console.log(`Enemy seabed impact! Speed: ${impactSpeed.toFixed(1)}, Damage: ${damage}`);
            }

            // Prevent submarine from going below seabed
            this.position.y = seabedHeight + 2;
            this.speed *= 0.3; // Reduce speed more than player after impact

            // Change behavior after impact
            if (this.state === 'patrol') {
                this.state = 'damaged';
                this.stateTimer = 0;
            }
        }
    }

    takeDamage(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.destroy();
        } else if (this.health < 30) {
            this.state = 'damaged';
        } else if (this.health < 60 && this.state !== 'evade') {
            this.state = 'evade';
            this.stateTimer = 0;
        }
    }

    destroy() {
        console.log(`Enemy submarine destroyed at ${this.position.x}, ${this.position.z}`);

        if (this.mesh) {
            // Create destruction effect (implosion and sinking)
            this.createDestructionEffect();

            setTimeout(() => {
                if (this.mesh.parent) {
                    this.mesh.parent.remove(this.mesh);
                }
            }, 5000); // Remove after 5 seconds
        }
    }

    createDestructionEffect() {
        // Implosion effect
        this.mesh.scale.set(0.1, 0.1, 0.1);

        // Start sinking
        this.sinkingSpeed = -2; // 2 units per second downward
        this.destroyed = true;
    }

    getPosition() {
        return this.position.clone();
    }

    getRotation() {
        return this.rotation.clone();
    }

    isDestroyed() {
        return this.destroyed || false;
    }
}

// Enemy management system
class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.maxEnemies = 3;
        this.spawnTimer = 0;
        this.spawnInterval = 60000; // Spawn every 60 seconds

        this.init();
    }

    init() {
        // Spawn initial enemies
        this.spawnInitialEnemies();
        console.log('Enemy manager initialized');
    }

    spawnInitialEnemies() {
        const spawnPositions = [
            new THREE.Vector3(80, -15, 60),
            new THREE.Vector3(-70, -12, -50),
            new THREE.Vector3(40, -18, -80)
        ];

        spawnPositions.forEach((pos, index) => {
            const enemyType = ['attack', 'patrol', 'hunter-killer'][index];
            const enemy = new EnemySubmarine(this.scene, pos, enemyType);
            this.enemies.push(enemy);
        });
    }

    update(deltaTime, playerPosition, oceanCurrent) {
        this.spawnTimer += deltaTime;

        // Update existing enemies
        this.enemies = this.enemies.filter(enemy => {
            if (enemy.isDestroyed()) {
                // Handle sinking animation
                if (enemy.mesh && enemy.sinkingSpeed) {
                    enemy.mesh.position.y += enemy.sinkingSpeed * deltaTime;
                    if (enemy.mesh.position.y < -30) {
                        if (enemy.mesh.parent) {
                            enemy.mesh.parent.remove(enemy.mesh);
                        }
                        return false; // Remove from array
                    }
                }
                return true; // Keep in array during sinking
            }

            enemy.updateAI(deltaTime, playerPosition, oceanCurrent);
            return true;
        });

        // Spawn new enemies if needed
        if (this.spawnTimer > this.spawnInterval && this.enemies.length < this.maxEnemies) {
            this.spawnEnemy();
            this.spawnTimer = 0;
        }
    }

    spawnEnemy() {
        // Spawn enemy away from player
        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        const spawnPos = new THREE.Vector3(
            Math.cos(angle) * distance,
            -10 - Math.random() * 15,
            Math.sin(angle) * distance
        );

        const enemyTypes = ['attack', 'patrol', 'hunter-killer'];
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

        const enemy = new EnemySubmarine(this.scene, spawnPos, enemyType);
        this.enemies.push(enemy);

        console.log(`Spawned ${enemyType} submarine at ${spawnPos.x}, ${spawnPos.z}`);
    }

    getEnemies() {
        return this.enemies.filter(enemy => !enemy.isDestroyed());
    }

    // Spawn enemy at specific position relative to player (for testing)
    spawnEnemyAtPosition(position, type = 'attack') {
        const enemy = new EnemySubmarine(this.scene, position, type);
        this.enemies.push(enemy);
        console.log(`🎯 Spawned ${type} submarine at (${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)})`);
        return enemy;
    }

    // Spawn enemy 400m ahead of player submarine (for testing)
    spawnEnemyAhead(playerSubmarine, distance = 400, type = 'attack') {
        if (!playerSubmarine || !playerSubmarine.mesh) {
            console.warn('Cannot spawn enemy - player submarine not found');
            return null;
        }

        // Get player position and forward direction
        const playerPos = playerSubmarine.mesh.position.clone();
        const forwardDirection = new THREE.Vector3(1, 0, 0); // Forward is +X
        forwardDirection.applyQuaternion(playerSubmarine.mesh.quaternion);
        
        // Calculate spawn position 400m ahead
        const spawnPos = playerPos.clone().add(forwardDirection.multiplyScalar(distance));
        spawnPos.y = playerPos.y; // Same depth as player

        return this.spawnEnemyAtPosition(spawnPos, type);
    }

    cleanup() {
        this.enemies.forEach(enemy => {
            if (enemy.mesh && enemy.mesh.parent) {
                enemy.mesh.parent.remove(enemy.mesh);
            }
        });
        this.enemies = [];
    }
}

// Global enemy manager instance
let enemyManager = null;

// Initialize enemy system
function initEnemies(scene) {
    if (enemyManager) {
        enemyManager.cleanup();
    }
    enemyManager = new EnemyManager(scene);
    console.log('Enemies module loaded and initialized');
    return enemyManager;
}

// Update enemy system
function updateEnemies(deltaTime, playerPosition, oceanCurrent = new THREE.Vector3(0, 0, 0)) {
    if (enemyManager) {
        enemyManager.update(deltaTime, playerPosition, oceanCurrent);
    }
}

// Get enemy submarines for targeting system
function getEnemySubmarines() {
    return enemyManager ? enemyManager.getEnemies() : [];
}

// Export functions
window.initEnemies = initEnemies;
window.updateEnemies = updateEnemies;
window.getEnemySubmarines = getEnemySubmarines;
window.enemyManager = () => enemyManager;

// Global function to spawn enemy 400m ahead of player (for testing)
window.spawnEnemyAhead = function(distance = 400, type = 'attack') {
    const manager = window.enemyManager();
    const playerSub = window.playerSubmarine ? window.playerSubmarine() : null;
    
    if (!manager) {
        console.error('❌ Enemy manager not initialized');
        return null;
    }
    
    if (!playerSub) {
        console.error('❌ Player submarine not found');
        return null;
    }
    
    return manager.spawnEnemyAhead(playerSub, distance, type);
};
