// Sub War 2060 - Tactical Systems Module

// Tactical display and targeting system
class TacticalSystem {
    constructor() {
        this.tacticalCanvas = null;
        this.tacticalCtx = null;
        this.minimapCanvas = null;
        this.minimapCtx = null;

        // Target lock system
        this.lockedTarget = null;
        this.lockMode = 'auto'; // 'auto' or 'manual'
        this.availableTargets = [];
        this.targetIndex = 0;
        this.lastTabTime = 0;
        this.tabDoubleTapDelay = 500; // ms for double tap detection

        // Life support system
        this.lifeSupport = {
            oxygen: 100,
            power: 100,
            temperature: 20, // Celsius
            maxOxygen: 24 * 60, // 24 hours in minutes
            maxPower: 100,
            oxygenDecayRate: 0.02, // % per minute
            powerDecayRate: 0.01 // % per minute
        };

        this.init();
    }

    init() {
        this.setupCanvases();
        this.setupTargetingSystem();
        this.setupLifeSupport();
        console.log('Tactical systems initialized');
    }

    setupCanvases() {
        // Initialize tactical display canvas
        this.tacticalCanvas = document.getElementById('tacticalCanvas');
        if (this.tacticalCanvas) {
            this.tacticalCtx = this.tacticalCanvas.getContext('2d');
        }

        // Initialize minimap canvas
        this.minimapCanvas = document.getElementById('minimapCanvas');
        if (this.minimapCanvas) {
            this.minimapCtx = this.minimapCanvas.getContext('2d');
        }
    }

    setupTargetingSystem() {
        // Add keyboard listener for TAB key
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Tab') {
                event.preventDefault();
                this.handleTabPress();
            }
        });
    }

    setupLifeSupport() {
        // Initialize life support display
        this.updateLifeSupportDisplay();
    }

    handleTabPress() {
        const currentTime = Date.now();

        // Check for double tap
        if (currentTime - this.lastTabTime < this.tabDoubleTapDelay) {
            this.toggleLockMode();
        } else {
            this.cycleTarget();
        }

        this.lastTabTime = currentTime;
    }

    toggleLockMode() {
        this.lockMode = this.lockMode === 'auto' ? 'manual' : 'auto';
        this.updateTargetDisplay();
        console.log(`Target lock mode: ${this.lockMode.toUpperCase()}`);
    }

    cycleTarget() {
        this.updateAvailableTargets();

        if (this.availableTargets.length === 0) {
            this.lockedTarget = null;
            this.updateTargetDisplay();
            return;
        }

        if (this.lockMode === 'manual') {
            // Manual mode: cycle through all contacts
            this.targetIndex = (this.targetIndex + 1) % this.availableTargets.length;
            this.lockedTarget = this.availableTargets[this.targetIndex];
        } else {
            // Auto mode: lock onto nearest enemy
            this.lockedTarget = this.findNearestEnemy();
        }

        this.updateTargetDisplay();
    }

    updateAvailableTargets() {
        // Get current sonar contacts
        const contacts = window.getSonarContacts ? window.getSonarContacts() : [];

        // Filter for identified targets (enemies would be separate from marine life)
        this.availableTargets = contacts.filter(contact =>
            contact.classification !== 'UNIDENTIFIED' &&
            !contact.classification.includes('School') &&
            !contact.classification.includes('Whale') &&
            !contact.classification.includes('Dolphin')
        );

        // Add enemy submarines from sonar detection
        const enemies = window.getEnemySubmarines ? window.getEnemySubmarines() : [];
        enemies.forEach(enemy => {
            if (enemy && enemy.getPosition) {
                const enemyPos = enemy.getPosition();
                const distance = window.playerSubmarine && window.playerSubmarine() ?
                    window.playerSubmarine().getPosition().distanceTo(enemyPos) : 999;

                // Only add enemies within sonar range (simulating detection)
                if (distance <= this.sonarRange) {
                    this.availableTargets.push({
                        id: `enemy_${enemy.type}`,
                        classification: `Enemy ${enemy.type.charAt(0).toUpperCase() + enemy.type.slice(1)} Submarine`,
                        distance: Math.round(distance * 10) / 10,
                        bearing: this.calculateBearing(
                            window.playerSubmarine().getPosition(),
                            enemyPos
                        ),
                        strength: 9, // High signal strength for submarines
                        entity: enemy,
                        isEnemy: true
                    });
                }
            }
        });
    }

    calculateBearing(from, to) {
        const dx = to.x - from.x;
        const dz = to.z - from.z;
        let bearing = Math.atan2(dx, dz) * 180 / Math.PI;
        if (bearing < 0) bearing += 360;
        return Math.round(bearing);
    }

    findNearestEnemy() {
        if (this.availableTargets.length === 0) return null;

        // Sort by distance and return closest
        const sorted = this.availableTargets.sort((a, b) => a.distance - b.distance);
        return sorted[0];
    }

    updateTargetDisplay() {
        const targetDetails = document.getElementById('targetDetails');
        const lockMode = document.getElementById('lockMode');

        if (targetDetails) {
            if (this.lockedTarget) {
                targetDetails.innerHTML = `
                    <div><strong>${this.lockedTarget.classification}</strong></div>
                    <div>Distance: ${this.lockedTarget.distance}m</div>
                    <div>Bearing: ${this.lockedTarget.bearing}°</div>
                    <div>Strength: ${this.lockedTarget.strength}/10</div>
                `;
                this.updateTargetArrow();
            } else {
                targetDetails.textContent = 'No target locked';
                this.hideTargetArrow();
            }
        }

        if (lockMode) {
            lockMode.textContent = `Mode: ${this.lockMode.charAt(0).toUpperCase() + this.lockMode.slice(1)}`;
        }
    }

    updateTargetArrow() {
        let arrow = document.getElementById('targetArrow');

        if (!arrow) {
            arrow = document.createElement('div');
            arrow.id = 'targetArrow';
            document.getElementById('gameContainer').appendChild(arrow);
        }

        if (this.lockedTarget) {
            const bearing = this.lockedTarget.bearing;
            const distance = this.lockedTarget.distance;

            // Calculate arrow size based on distance (closer = bigger)
            const maxDistance = 150;
            const minSize = 16;
            const maxSize = 48;
            const size = Math.max(minSize, maxSize - (distance / maxDistance) * (maxSize - minSize));

            // Convert bearing to rotation (bearing is already 0-360°)
            const rotation = bearing;

            arrow.innerHTML = '▲';
            arrow.style.display = 'block';
            arrow.style.fontSize = `${size}px`;
            arrow.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

            // Color based on distance
            if (distance < 20) {
                arrow.style.color = '#ff0000';
                arrow.style.textShadow = '0 0 15px #ff0000';
            } else if (distance < 50) {
                arrow.style.color = '#ff8800';
                arrow.style.textShadow = '0 0 10px #ff8800';
            } else {
                arrow.style.color = '#ffaa00';
                arrow.style.textShadow = '0 0 8px #ffaa00';
            }
        }
    }

    hideTargetArrow() {
        const arrow = document.getElementById('targetArrow');
        if (arrow) {
            arrow.style.display = 'none';
        }
    }

    updateTacticalDisplay(submarinePos, contacts) {
        if (!this.tacticalCtx) return;

        const canvas = this.tacticalCanvas;
        const ctx = this.tacticalCtx;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 1; // 1 pixel per meter

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#003366';
        ctx.lineWidth = 1;

        // Draw concentric circles (range rings)
        const ranges = [25, 50, 75];
        ranges.forEach(range => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, range * scale, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Draw bearing lines (every 45 degrees)
        for (let angle = 0; angle < 360; angle += 45) {
            const rad = (angle - 90) * Math.PI / 180;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(rad) * 75 * scale,
                centerY + Math.sin(rad) * 75 * scale
            );
            ctx.stroke();
        }

        // Draw submarine (center)
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw contacts
        contacts.forEach(contact => {
            if (contact.distance <= 75) { // Only show contacts within display range
                const bearing = (contact.bearing - 90) * Math.PI / 180; // Convert to radians, north = up
                const x = centerX + Math.cos(bearing) * contact.distance * scale;
                const y = centerY + Math.sin(bearing) * contact.distance * scale;

                // Color based on contact type
                let color = '#ffff00'; // Default yellow
                if (contact.classification.includes('Whale')) {
                    color = '#0066ff'; // Blue for whales
                } else if (contact.classification.includes('Dolphin')) {
                    color = '#66ffff'; // Cyan for dolphins
                } else if (contact.classification.includes('School')) {
                    color = '#66ff66'; // Green for fish schools
                } else if (contact.isEnemy || contact.classification.includes('Enemy')) {
                    color = '#ff4400'; // Orange/red for enemy submarines
                } else if (contact === this.lockedTarget) {
                    color = '#ff0000'; // Red for locked target
                }

                ctx.fillStyle = color;
                ctx.beginPath();
                if (contact.isEnemy || contact.classification.includes('Enemy')) {
                    // Draw enemy submarines as triangles
                    const size = Math.max(3, contact.strength / 2);
                    ctx.moveTo(x, y - size);
                    ctx.lineTo(x - size, y + size);
                    ctx.lineTo(x + size, y + size);
                    ctx.closePath();
                } else {
                    // Draw other contacts as circles
                    ctx.arc(x, y, Math.max(2, contact.strength / 2), 0, Math.PI * 2);
                }
                ctx.fill();

                // Draw lock indicator
                if (contact === this.lockedTarget) {
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(x, y, 8, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        });

        // Draw enemy submarines detected by sonar but not in contacts list
        const enemies = window.getEnemySubmarines ? window.getEnemySubmarines() : [];

        enemies.forEach(enemy => {
            if (enemy && enemy.getPosition) {
                const enemyPos = enemy.getPosition();
                const distance = submarinePos.distanceTo(enemyPos);

                if (distance <= 75 && distance <= this.sonarRange) { // Within tactical display range and sonar range
                    const dx = enemyPos.x - submarinePos.x;
                    const dz = enemyPos.z - submarinePos.z;
                    const bearing = (Math.atan2(dx, dz) * 180 / Math.PI - 90) * Math.PI / 180;
                    const x = centerX + Math.cos(bearing) * distance * scale;
                    const y = centerY + Math.sin(bearing) * distance * scale;

                    // Check if this enemy is already in contacts (avoid duplicates)
                    const alreadyShown = contacts.some(contact =>
                        contact.isEnemy && contact.id === `enemy_${enemy.type}`
                    );

                    if (!alreadyShown) {
                        ctx.fillStyle = '#ff2200'; // Bright red for detected enemies
                        ctx.beginPath();
                        ctx.moveTo(x, y - 4);
                        ctx.lineTo(x - 4, y + 4);
                        ctx.lineTo(x + 4, y + 4);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        });
    }

    updateMinimap(submarinePos, submarineRotation) {
        if (!this.minimapCtx) return;

        const canvas = this.minimapCanvas;
        const ctx = this.minimapCtx;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 0.5; // 0.5 pixels per meter (wider view)

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw ocean boundaries
        ctx.strokeStyle = '#004488';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Draw depth contours
        ctx.strokeStyle = '#002244';
        ctx.lineWidth = 1;
        const contours = [50, 100];
        contours.forEach((depth, index) => {
            const size = 40 + index * 30;
            ctx.strokeRect(centerX - size/2, centerY - size/2, size, size);
        });

        // Draw submarine with heading indicator
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(submarineRotation.y);

        // Submarine body
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(-4, -2, 8, 4);

        // Heading indicator
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(4, 0);
        ctx.lineTo(12, 0);
        ctx.stroke();

        ctx.restore();

        // Add compass
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('N', centerX, 15);
        ctx.fillText('S', centerX, canvas.height - 5);
        ctx.textAlign = 'left';
        ctx.fillText('E', canvas.width - 15, centerY + 3);
        ctx.textAlign = 'right';
        ctx.fillText('W', 15, centerY + 3);
    }

    updateLifeSupport(deltaTime, damage = 0) {
        // Apply damage to systems
        if (damage > 0) {
            this.lifeSupport.power -= damage * 0.5;
            this.lifeSupport.oxygen -= damage * 0.3;
        }

        // Normal operation decay
        const decayMultiplier = deltaTime * (1/60); // Convert from frame time to minutes

        if (this.lifeSupport.power > 0) {
            this.lifeSupport.oxygen -= this.lifeSupport.oxygenDecayRate * decayMultiplier;
            this.lifeSupport.power -= this.lifeSupport.powerDecayRate * decayMultiplier;
        } else {
            // Faster oxygen depletion with no power
            this.lifeSupport.oxygen -= this.lifeSupport.oxygenDecayRate * 3 * decayMultiplier;
        }

        // Clamp values
        this.lifeSupport.oxygen = Math.max(0, Math.min(100, this.lifeSupport.oxygen));
        this.lifeSupport.power = Math.max(0, Math.min(100, this.lifeSupport.power));

        this.updateLifeSupportDisplay();
    }

    updateLifeSupportDisplay() {
        const oxygenElement = document.getElementById('oxygen');
        const powerElement = document.getElementById('power');
        const temperatureElement = document.getElementById('temperature');

        if (oxygenElement) {
            oxygenElement.textContent = `O2: ${Math.round(this.lifeSupport.oxygen)}%`;
            // Color coding based on levels
            if (this.lifeSupport.oxygen < 20) {
                oxygenElement.style.color = '#ff0000';
            } else if (this.lifeSupport.oxygen < 50) {
                oxygenElement.style.color = '#ffaa00';
            } else {
                oxygenElement.style.color = '#66ff66';
            }
        }

        if (powerElement) {
            powerElement.textContent = `Power: ${Math.round(this.lifeSupport.power)}%`;
            if (this.lifeSupport.power < 20) {
                powerElement.style.color = '#ff0000';
            } else if (this.lifeSupport.power < 50) {
                powerElement.style.color = '#ffaa00';
            } else {
                powerElement.style.color = '#ffff66';
            }
        }

        if (temperatureElement) {
            let tempStatus = 'Normal';
            let tempColor = '#6666ff';

            if (this.lifeSupport.power < 30) {
                tempStatus = 'Cold';
                tempColor = '#66ccff';
            } else if (this.lifeSupport.power < 10) {
                tempStatus = 'Freezing';
                tempColor = '#ffffff';
            }

            temperatureElement.textContent = `Temp: ${tempStatus}`;
            temperatureElement.style.color = tempColor;
        }
    }

    update(deltaTime, submarinePos, submarineRotation, contacts) {
        // Update tactical display
        this.updateTacticalDisplay(submarinePos, contacts || []);

        // Update minimap
        this.updateMinimap(submarinePos, submarineRotation);

        // Update life support
        this.updateLifeSupport(deltaTime);

        // Auto-lock in auto mode
        if (this.lockMode === 'auto' && (!this.lockedTarget || this.shouldUpdateAutoTarget())) {
            this.updateAvailableTargets();
            this.lockedTarget = this.findNearestEnemy();
            this.updateTargetDisplay();
        }

        // Update target arrow if locked
        if (this.lockedTarget) {
            this.updateTargetArrow();
        }
    }

    shouldUpdateAutoTarget() {
        // Check if current target is still valid
        if (!this.lockedTarget) return true;

        // Check if target is still in range and detectable
        const contacts = window.getSonarContacts ? window.getSonarContacts() : [];
        return !contacts.find(contact => contact.id === this.lockedTarget.id);
    }

    getLockedTarget() {
        return this.lockedTarget;
    }

    getLifeSupport() {
        return this.lifeSupport;
    }
}

// Global tactical system instance
let tacticalSystem = null;

// Initialize tactical system
function initTactical() {
    if (tacticalSystem) {
        // Cleanup existing system if needed
    }
    tacticalSystem = new TacticalSystem();
    console.log('Tactical module loaded and initialized');
    return tacticalSystem;
}

// Update tactical system
function updateTactical(deltaTime, submarinePos, submarineRotation, contacts) {
    if (tacticalSystem) {
        tacticalSystem.update(deltaTime, submarinePos, submarineRotation, contacts);
    }
}

// Get locked target for weapon systems
function getLockedTarget() {
    return tacticalSystem ? tacticalSystem.getLockedTarget() : null;
}

// Get life support status
function getLifeSupport() {
    return tacticalSystem ? tacticalSystem.getLifeSupport() : null;
}

// Export functions
window.initTactical = initTactical;
window.updateTactical = updateTactical;
window.getLockedTarget = getLockedTarget;
window.getLifeSupport = getLifeSupport;
window.tacticalSystem = () => tacticalSystem;
