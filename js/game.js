// Sub War 2060 - Core Game Module

// Global game state
let gameState = {
    scene: null,
    camera: null,
    renderer: null,
    animationId: null,
    isRunning: false,
    isPaused: false,
    // Mouse controls
    mouse: {
        x: 0,
        y: 0,
        isDown: false,
        sensitivity: 0.005,
        rightClickActive: false,
        previousMode: 'follow'
    },
    cameraMode: 'follow', // 'follow' or 'free'
    freeCamera: {
        position: new THREE.Vector3(0, 0, 10),
        rotation: new THREE.Euler(0, 0, 0)
    },
    keys: {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false
    },
    timeMultiplier: 1.0, // Time acceleration factor
    debugHideElements: false // Debug toggle for hiding game elements (J key)
};

// HUD Elements
let hudElements = {
    status: null,
    depth: null,
    speed: null,
    health: null
};


// Game initialization
function initGame() {
    try {
        console.log('Initializing Sub War 2060...');

        // Initialize HUD elements
        initHUD();

        // Initialize Three.js
        if (!initThreeJS()) {
            throw new Error('Failed to initialize Three.js');
        }

        // Start the game loop
        startGameLoop();

        // Initialize input handling
        initInput();

        console.log('Game initialized successfully');
        updateStatus('Sub War 2060 - Active');

    } catch (error) {
        console.error('Game initialization failed:', error);
        updateStatus('Initialization Failed');
    }
}

// Initialize HUD references and visibility
function initHUD() {
    hudElements.status = document.getElementById('status');
    hudElements.depth = document.getElementById('depth');
    hudElements.speed = document.getElementById('speed');
    hudElements.health = document.getElementById('health');

    // Verify HUD elements exist
    if (!hudElements.status || !hudElements.depth || !hudElements.speed || !hudElements.health) {
        console.warn('Some HUD elements not found');
    }

    // Show HUD elements that start hidden
    showGameHUD();
}

// Show game HUD elements when game starts
function showGameHUD() {
    // Show SCAV pipper system
    const scavPipper = document.getElementById('scavPipper');
    if (scavPipper) {
        scavPipper.style.display = 'block';
        console.log('✅ SCAV pipper system activated');
    }

    // Show reticle HUD
    const reticleHUD = document.getElementById('reticleHUD');
    if (reticleHUD) {
        reticleHUD.style.display = 'block';
        console.log('✅ Reticle HUD system activated');
    }

    // Show minimap
    const minimapContainer = document.getElementById('minimapContainer');
    if (minimapContainer) {
        minimapContainer.style.display = 'block';
        console.log('✅ Minimap system activated');
    }

    // Show armor systems panel
    const armorSystems = document.getElementById('armorSystems');
    if (armorSystems) {
        armorSystems.style.display = 'block';
        console.log('✅ Armor systems panel activated');
    }

    console.log('🎮 Game HUD fully activated');
}

// Initialize Three.js scene, camera, and renderer
function initThreeJS() {
    try {
        // Create scene with pure black background (Elite-style)
        gameState.scene = new THREE.Scene();
        gameState.scene.background = new THREE.Color(0x000000);

        // Create camera (underwater perspective)
        const aspect = window.innerWidth / window.innerHeight;
        gameState.camera = new THREE.PerspectiveCamera(75, aspect, 1, 500000); // Increased from 150km to 500km viewing distance
        gameState.camera.position.set(0, 0, 10);
        gameState.camera.lookAt(0, 0, 0);

        // Create renderer
        gameState.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });
        gameState.renderer.setSize(window.innerWidth, window.innerHeight);
        gameState.renderer.shadowMap.enabled = true;
        gameState.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Add renderer to DOM
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(gameState.renderer.domElement);
            console.log('Canvas added to gameContainer');
        } else {
            document.body.appendChild(gameState.renderer.domElement);
            console.log('Canvas added to document body');
        }

        // Minimal lighting for wireframe visibility (Elite-style)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        gameState.scene.add(ambientLight);


        // Initialize simple terrain fix (ENABLED - shaded contour terrain)
        console.log('🔍 DEBUG: Enabling simple terrain for shaded contour visualization');
        if (window.initSimpleTerrain) {
            console.log('🌊 Creating base shaded contour terrain...');
            initSimpleTerrain(gameState.scene);
            console.log('✅ Base shaded contour terrain created');
        }

        // Initialize procedural terrain (backup - disabled to avoid conflicts)
        // if (window.ProceduralTerrain) {
        //     initProceduralTerrain();
        // }

        // Initialize ocean environment for active sonar functionality
        console.log('🔍 DEBUG: Checking ocean environment availability...');
        console.log('🔍 DEBUG: window.initOcean exists:', !!window.initOcean);
        console.log('🔍 DEBUG: typeof window.initOcean:', typeof window.initOcean);

        if (window.initOcean) {
            console.log('🌊 Calling initOcean() for active sonar support...');
            window.initOcean(gameState.scene);
            console.log('✅ Ocean environment initialized for G key active sonar functionality');
        } else {
            console.error('❌ window.initOcean is not available - ocean.js may not have loaded properly');
        }

        // Initialize sealife system
        if (window.initSealife) {
            window.initSealife(gameState.scene);
        }

        // Initialize tactical system
        if (window.initTactical) {
            window.initTactical();
        }

        // Initialize enemy system
        if (window.initEnemies) {
            window.initEnemies(gameState.scene);
        }

        // Initialize submarine after scene is ready
        if (window.initSubmarine) {
            // Get selected submarine from scenario system or use default
            const selectedSubmarine = gameState.selectedSubmarine || 'COBRA';
            window.initSubmarine(gameState.scene, selectedSubmarine);
        }

        // Initialize weapons system after submarine
        if (window.initWeapons && window.playerSubmarine) {
            window.initWeapons(gameState.scene, window.playerSubmarine());
        }

        // Handle window resize
        window.addEventListener('resize', onWindowResize);

        console.log('Three.js initialized successfully');
        return true;

    } catch (error) {
        console.error('Three.js initialization failed:', error);
        return false;
    }
}

// Handle window resize
function onWindowResize() {
    if (gameState.camera && gameState.renderer) {
        gameState.camera.aspect = window.innerWidth / window.innerHeight;
        gameState.camera.updateProjectionMatrix();
        gameState.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Game loop
function gameLoop() {
    if (!gameState.isRunning || gameState.isPaused) {
        return;
    }

    // Safety check for Three.js objects
    if (!gameState.scene || !gameState.camera || !gameState.renderer) {
        console.error('Missing Three.js objects in game loop');
        stopGame();
        return;
    }

    try {
        // Update game logic with time acceleration
        const acceleratedDeltaTime = 0.016 * gameState.timeMultiplier;
        update(acceleratedDeltaTime);

        // Render the scene
        gameState.renderer.render(gameState.scene, gameState.camera);

        // Schedule next frame
        gameState.animationId = requestAnimationFrame(gameLoop);

    } catch (error) {
        console.error('Error in game loop:', error);
        stopGame();
    }
}

// Update game state
function update(deltaTime = 0.016) {
    // Get submarine position for other systems
    const submarinePos = window.playerSubmarine && window.playerSubmarine() ?
        window.playerSubmarine().getPosition() : null;
    const submarineRotation = window.playerSubmarine && window.playerSubmarine() ?
        window.playerSubmarine().getRotation() : null;

    // Update ocean environment
    if (window.updateOcean) {
        window.updateOcean(deltaTime);
    }

    // Update simple terrain system (for sensor-based visibility)
    if (window.simpleTerrain && window.simpleTerrain.update) {
        window.simpleTerrain.update(deltaTime);
    }

    // Update sealife with submarine position
    if (window.updateSealife && submarinePos) {
        window.updateSealife(deltaTime, submarinePos);
        
        // Update sonar contacts display periodically
        if (window.playerSubmarine && window.sealifeSystem && window.sealifeSystem()) {
            const sealifeSystem = window.sealifeSystem();
            const contacts = sealifeSystem.getSonarContacts();
            window.playerSubmarine().updateSonarContactsDisplay(contacts);
        }
    }

    // Update enemies (they need ocean current when implemented)
    if (window.updateEnemies && submarinePos) {
        const oceanCurrent = new THREE.Vector3(0, 0, 0); // Will be updated when currents are implemented
        window.updateEnemies(deltaTime, submarinePos, oceanCurrent);
    }

    // Update tactical system
    if (window.updateTactical && submarinePos && submarineRotation) {
        const contacts = window.getSonarContacts ? window.getSonarContacts() : [];
        window.updateTactical(deltaTime, submarinePos, submarineRotation, contacts);
    }

    // Update submarine
    if (window.updateSubmarine) {
        window.updateSubmarine(deltaTime);
        
        // Update launcher display
        if (window.playerSubmarine && window.playerSubmarine().updateLauncherDisplay) {
            window.playerSubmarine().updateLauncherDisplay();
        }
    }

    // Update weapons system
    if (window.updateWeapons) {
        window.updateWeapons(deltaTime);
    }

    // Update camera to follow submarine
    updateCamera();
}

// Update camera to follow submarine
function updateCamera() {
    if (!gameState.camera) return;

    if (gameState.cameraMode === 'follow') {
        // Lock camera focus on submarine with dynamic positioning
        if (window.playerSubmarine && window.playerSubmarine()) {
            const submarine = window.playerSubmarine();
            const submarinePos = submarine.getPosition();

            // Speed-based camera positioning: every 5 knots increases distance by +0.2 units
            const baseDistance = 8; // Basic camera position at speed 0
            const currentSpeed = Math.abs(submarine.speed || 0);

            // Add dead zone: treat speeds under 3 knots as 0
            const adjustedSpeed = currentSpeed < 3 ? 0 : currentSpeed;

            const speedIntervals = Math.floor(adjustedSpeed / 5); // Number of 5-knot intervals
            const distanceIncrease = speedIntervals * 0.2; // +0.2 units per interval
            const dynamicDistance = baseDistance + distanceIncrease;

            // Debug the distance calculation occasionally
            if (Math.random() < 0.02) {
                console.log(`🎯 Speed=${currentSpeed.toFixed(1)} → Adjusted=${adjustedSpeed.toFixed(1)} → Distance=${dynamicDistance.toFixed(1)}`);
            }


            // Position camera behind and above submarine
            // Behind: negative Z in submarine's local space
            // Above: positive Y offset
            const behindDistance = dynamicDistance; // Distance behind submarine
            const aboveHeight = 5; // Height above submarine (increased from 3)
            const offset = new THREE.Vector3(0, aboveHeight, -behindDistance);
            offset.applyQuaternion(submarine.mesh.quaternion);

            const targetPos = submarinePos.clone().add(offset);
            gameState.camera.position.lerp(targetPos, 0.8); // Faster following to reach target distance
            gameState.camera.lookAt(submarinePos);

            // Debug logging (remove after testing)
            if (Math.random() < 0.01) { // Log occasionally to avoid spam
                console.log('Camera following - Sub pos:', submarinePos, 'Camera pos:', gameState.camera.position);
            }
        }
    } else if (gameState.cameraMode === 'free') {
        // Free camera mode
        gameState.camera.position.copy(gameState.freeCamera.position);
        gameState.camera.rotation.copy(gameState.freeCamera.rotation);

        // Handle WASD movement in free camera mode
        const moveSpeed = 2.0;
        const forward = new THREE.Vector3(0, 0, -1);
        const right = new THREE.Vector3(1, 0, 0);
        const up = new THREE.Vector3(0, 1, 0);

        // Apply camera rotation to movement vectors
        forward.applyQuaternion(gameState.camera.quaternion);
        right.applyQuaternion(gameState.camera.quaternion);

        // Check for movement keys (we'll need to track these)
        if (gameState.keys && gameState.keys.forward) {
            gameState.freeCamera.position.add(forward.multiplyScalar(moveSpeed));
        }
        if (gameState.keys && gameState.keys.backward) {
            gameState.freeCamera.position.add(forward.multiplyScalar(-moveSpeed));
        }
        if (gameState.keys && gameState.keys.left) {
            gameState.freeCamera.position.add(right.multiplyScalar(-moveSpeed));
        }
        if (gameState.keys && gameState.keys.right) {
            gameState.freeCamera.position.add(right.multiplyScalar(moveSpeed));
        }
        if (gameState.keys && gameState.keys.up) {
            gameState.freeCamera.position.add(up.multiplyScalar(moveSpeed));
        }
        if (gameState.keys && gameState.keys.down) {
            gameState.freeCamera.position.add(up.multiplyScalar(-moveSpeed));
        }
    }
}

// Start the game loop
function startGameLoop() {
    if (gameState.isRunning) {
        return;
    }

    gameState.isRunning = true;
    gameState.isPaused = false;
    gameLoop();
    console.log('Game loop started');
}

// Stop the game loop
function stopGame() {
    gameState.isRunning = false;
    if (gameState.animationId) {
        cancelAnimationFrame(gameState.animationId);
        gameState.animationId = null;
    }
    console.log('Game stopped');
}

// Pause/unpause game
function togglePause() {
    if (gameState.isRunning) {
        gameState.isPaused = !gameState.isPaused;

        // Add visual feedback for pause state
        if (gameState.isPaused) {
            console.log('Game paused - Press ESC to resume');
            // Create or show pause overlay
            showPauseOverlay();
        } else {
            console.log('Game resumed');
            // Hide pause overlay
            hidePauseOverlay();
            // Restart the game loop
            gameLoop();
        }
    }
}

// Show pause overlay
function showPauseOverlay() {
    let pauseOverlay = document.getElementById('pauseOverlay');
    if (!pauseOverlay) {
        pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'pauseOverlay';
        pauseOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
            font-size: 24px;
            color: #00ffff;
            text-shadow: 0 0 10px #00ffff;
        `;
        pauseOverlay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 36px; margin-bottom: 20px;">GAME PAUSED</div>
                <div style="font-size: 18px;">Press ESC to resume</div>
            </div>
        `;
        document.body.appendChild(pauseOverlay);
    }
    pauseOverlay.style.display = 'flex';
}

// Hide pause overlay
function hidePauseOverlay() {
    const pauseOverlay = document.getElementById('pauseOverlay');
    if (pauseOverlay) {
        pauseOverlay.style.display = 'none';
    }
}

// Basic input handling
function initInput() {
    // Use capture phase to get priority over submarine system
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp);

    // Mouse controls
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('contextmenu', (e) => e.preventDefault()); // Disable right-click menu

    // Set up pointer lock for mouse control
    document.addEventListener('click', () => {
        document.body.requestPointerLock();
    });

    console.log('Input system initialized with mouse controls and pointer lock');
}

// Handle key press
function handleKeyDown(event) {
    // Debug logging for terrain controls
    if (['KeyV', 'KeyB', 'KeyN'].includes(event.code)) {
        console.log(`🎯 Game.js received key event: ${event.code}`);
        console.log('🎯 Event details:', event);
        console.log('🎯 Event target:', event.target);
        console.log('🎯 Event currentTarget:', event.currentTarget);
    }
    
    // Track movement keys for camera
    switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
        gameState.keys.forward = true;
        break;
    case 'KeyS':
    case 'ArrowDown':
        gameState.keys.backward = true;
        break;
    case 'KeyA':
    case 'ArrowLeft':
        gameState.keys.left = true;
        break;
    case 'KeyD':
    case 'ArrowRight':
        gameState.keys.right = true;
        break;
    case 'KeyQ':
        gameState.keys.up = true;
        break;
    case 'KeyE':
        gameState.keys.down = true;
        break;
    case 'KeyK':
        // Toggle camera mode (K for Kamera)
        gameState.cameraMode = gameState.cameraMode === 'follow' ? 'free' : 'follow';
        updateStatus(`Camera: ${gameState.cameraMode} mode`);
        if (gameState.cameraMode === 'free') {
            gameState.freeCamera.position.copy(gameState.camera.position);
            gameState.freeCamera.rotation.copy(gameState.camera.rotation);
        }
        break;
    }

    // Handle other keys
    switch (event.code) {
    case 'Space':
        event.preventDefault();
        if (window.fireWeapon) {
            window.fireWeapon();
        }
        break;
    // Digit1-4 keys handled by submarine.js to avoid conflicts
    case 'F1':
    case 'F2':
    case 'F3':
    case 'F4':
        event.preventDefault();
        if (window.applyWeaponPreset) {
            const presetNumber = parseInt(event.code.replace('F', ''));
            window.applyWeaponPreset(presetNumber);
        }
        break;
    case 'KeyP':
        togglePause();
        break;
    case 'Escape':
        togglePause();
        break;
    case 'KeyC':
        // Toggle camera mode
        gameState.cameraMode = gameState.cameraMode === 'follow' ? 'free' : 'follow';
        updateStatus(`Camera: ${gameState.cameraMode} mode`);
        if (gameState.cameraMode === 'free') {
            gameState.freeCamera.position.copy(gameState.camera.position);
            gameState.freeCamera.rotation.copy(gameState.camera.rotation);
        }
        break;
    case 'KeyY':
        // Time accelerator (moved from T key to avoid conflict with terrain wireframe)
        if (gameState.timeMultiplier === 1.0) {
            gameState.timeMultiplier = 5.0;
            updateStatus('Time acceleration: 5x');
        } else {
            gameState.timeMultiplier = 1.0;
            updateStatus('Time acceleration: Normal');
        }
        break;
    case 'KeyI':
        // Single active sonar ping
        if (window.playerSubmarine && window.playerSubmarine()) {
            window.playerSubmarine().performSonarPing();
        }
        break;
    case 'KeyV':
        // Toggle terrain wireframe (delegate to terrain system)
        console.log('🔧 V key pressed - toggling terrain wireframe');
        if (window.simpleTerrain && window.simpleTerrain.toggleWireframe) {
            console.log('🏔️ Calling simpleTerrain.toggleWireframe()');
            window.simpleTerrain.toggleWireframe();
        } else if (window.terrainGenerator && window.terrainGenerator.toggleWireframe) {
            console.log('🏔️ Calling terrainGenerator.toggleWireframe()');
            window.terrainGenerator.toggleWireframe();
        } else {
            console.log('❌ No terrain system available for wireframe toggle');
        }
        event.preventDefault();
        event.stopPropagation();
        break;
    case 'KeyH':
        // Spawn enemy 400m ahead (for testing) - handled by submarine.js
        // H key now used for enemy spawn instead of thermoclines
        event.preventDefault();
        event.stopPropagation();
        break;
    case 'KeyU':
        // Toggle thermoclines (moved from H to U key)
        console.log('🔧 U key pressed - toggling thermoclines');
        // Fixed: Check if oceanEnvironment() returns a valid object before calling methods
        if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
            const oceanEnv = window.oceanEnvironment();
            if (oceanEnv && oceanEnv.toggleThermoclines) {
                console.log('🌊 Calling oceanEnvironment().toggleThermoclines()');
                oceanEnv.toggleThermoclines();
            } else {
                console.log('🔍 DEBUG: oceanEnvironment() returned null or missing toggleThermoclines method');
            }
        } else {
            console.log('❌ No ocean system available');
        }
        event.preventDefault();
        event.stopPropagation();
        break;
    case 'KeyT':
        // Toggle terrain wireframe
        console.log('🔧 T key pressed - toggling terrain wireframe');
        console.log('🔧 Available terrain systems:');
        console.log('🔧 window.oceanEnvironment:', window.oceanEnvironment);
        console.log('🔧 window.simpleTerrain:', window.simpleTerrain);
        console.log('🔧 window.terrainGenerator:', window.terrainGenerator);
        
        // Fixed: Check if oceanEnvironment() returns a valid object before calling methods
        if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
            const oceanEnv = window.oceanEnvironment();
            if (oceanEnv && oceanEnv.toggleTerrainWireframe) {
                console.log('🌊 Calling oceanEnvironment().toggleTerrainWireframe()');
                oceanEnv.toggleTerrainWireframe();
            } else {
                console.log('🔍 DEBUG: oceanEnvironment() returned null or missing toggleTerrainWireframe method');
            }
        } else if (window.simpleTerrain && window.simpleTerrain.toggleWireframe) {
            console.log('🏔️ Calling simpleTerrain.toggleWireframe()');
            window.simpleTerrain.toggleWireframe();
        } else if (window.terrainGenerator && window.terrainGenerator.toggleWireframe) {
            console.log('🏔️ Calling terrainGenerator.toggleWireframe()');
            window.terrainGenerator.toggleWireframe();
        } else {
            console.log('❌ No terrain system available or no toggleWireframe method');
        }
        event.preventDefault();
        event.stopPropagation();
        break;
    case 'KeyB':
        // Switch to wireframe visualization (for overlaying shaders/textures on wireframe)
        console.log('B key pressed - switching to wireframe mode');
        // Fixed: Check if oceanEnvironment() returns a valid object before calling methods
        if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
            const oceanEnv = window.oceanEnvironment();
            if (oceanEnv && oceanEnv.setTerrainVisualizationMode) {
                oceanEnv.setTerrainVisualizationMode('wireframe');
            } else {
                console.log('🔍 DEBUG: oceanEnvironment() returned null or missing method');
            }
        } else if (window.simpleTerrain && window.simpleTerrain.setVisualizationMode) {
            window.simpleTerrain.setVisualizationMode('wireframe');
        } else if (window.terrainGenerator && window.terrainGenerator.setVisualizationMode) {
            window.terrainGenerator.setVisualizationMode('wireframe');
        } else {
            console.log('❌ No terrain system available');
        }
        event.preventDefault();
        event.stopPropagation();
        break;
    case 'KeyN':
        // Switch to solid visualization with shaders/textures
        console.log('N key pressed - switching to solid/shader mode');
        console.log('🔍 DEBUG: window.oceanEnvironment exists:', !!window.oceanEnvironment);
        console.log('🔍 DEBUG: window.simpleTerrain exists:', !!window.simpleTerrain);
        console.log('🔍 DEBUG: window.terrainGenerator exists:', !!window.terrainGenerator);

        // Fixed: Check if oceanEnvironment() returns a valid object before calling methods
        if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
            const oceanEnv = window.oceanEnvironment();
            if (oceanEnv && oceanEnv.setTerrainVisualizationMode) {
                console.log('🔍 DEBUG: Using oceanEnvironment');
                oceanEnv.setTerrainVisualizationMode('shader');
            } else {
                console.log('🔍 DEBUG: oceanEnvironment() returned null or missing method');
            }
        } else if (window.simpleTerrain && window.simpleTerrain.setVisualizationMode) {
            console.log('🔍 DEBUG: Using simpleTerrain');
            window.simpleTerrain.setVisualizationMode('shader');
        } else if (window.terrainGenerator && window.terrainGenerator.setVisualizationMode) {
            console.log('🔍 DEBUG: Using terrainGenerator');
            window.terrainGenerator.setVisualizationMode('shader');
        } else {
            console.log('❌ No terrain system available or methods missing');
        }
        event.preventDefault();
        event.stopPropagation();
        break;
    case 'KeyG':
        // Active sonar ping for extended terrain visibility
        console.log('🔊 G key pressed - Activating sonar ping');
        if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
            const oceanEnv = window.oceanEnvironment();
            if (oceanEnv && oceanEnv.activateSonarPing) {
                oceanEnv.activateSonarPing();
            } else {
                console.log('🔍 DEBUG: oceanEnvironment() returned null or missing activateSonarPing method');
            }
        } else {
            console.log('❌ No ocean environment available for sonar ping');
        }
        event.preventDefault();
        event.stopPropagation();
        break;
    case 'Tab':
        // Cycle through sonar contacts
        event.preventDefault();
        event.stopPropagation();

        const submarine = window.playerSubmarine && window.playerSubmarine();
        if (submarine && submarine.cycleSonarContacts) {
            submarine.cycleSonarContacts();
        } else {
            console.log('No submarine available for sonar cycling');
        }
        break;
    case 'KeyJ':
        // Toggle visibility of all game elements for debugging
        gameState.debugHideElements = !gameState.debugHideElements;

        // Toggle visibility of all scene children except lights and camera
        gameState.scene.children.forEach(child => {
            if (child.type !== 'AmbientLight' && child.type !== 'DirectionalLight' &&
                child.type !== 'PointLight' && child.type !== 'SpotLight' &&
                child.type !== 'PerspectiveCamera' && child.type !== 'OrthographicCamera') {
                child.visible = !gameState.debugHideElements;
            }
        });

        // Force terrain chunks visible if showing elements
        if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
            const oceanEnv = window.oceanEnvironment();
            if (oceanEnv && oceanEnv.terrainChunks) {
                console.log(`🔍 DEBUG: Forcing ${oceanEnv.terrainChunks.size} terrain chunks ${gameState.debugHideElements ? 'HIDDEN' : 'VISIBLE'}`);
                oceanEnv.terrainChunks.forEach(chunk => {
                    if (chunk.group) {
                        chunk.group.visible = !gameState.debugHideElements;
                        chunk.visible = !gameState.debugHideElements;
                    }
                });
            } else {
                console.log('🔍 DEBUG: No terrain chunks found in oceanEnvironment');
            }
        } else {
            console.log('🔍 DEBUG: No oceanEnvironment available');
        }

        // Debug: Show scene structure
        console.log(`🔍 DEBUG: Scene has ${gameState.scene.children.length} children:`);
        gameState.scene.children.forEach((child, i) => {
            console.log(`  ${i}: ${child.name || 'unnamed'} (${child.type}) - visible: ${child.visible}`);
        });

        // COMPREHENSIVE TERRAIN DEBUG
        if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
            const oceanEnv = window.oceanEnvironment();
            if (oceanEnv) {
                console.log(`🔍 DETAILED TERRAIN DEBUG:`);
                console.log(`  - terrainChunks.size: ${oceanEnv.terrainChunks ? oceanEnv.terrainChunks.size : 'UNDEFINED'}`);
                console.log(`  - seaFloor children: ${oceanEnv.seaFloor ? oceanEnv.seaFloor.children.length : 'NO SEAFLOOR'}`);
                console.log(`  - heightData length: ${oceanEnv.heightData ? oceanEnv.heightData.length : 'NO HEIGHTDATA'}`);
                console.log(`  - gridSize: ${oceanEnv.gridSize || 'UNDEFINED'}`);

                if (oceanEnv.terrainChunks && oceanEnv.terrainChunks.size > 0) {
                    let visibleChunks = 0;
                    let chunksWithGeometry = 0;
                    oceanEnv.terrainChunks.forEach((chunk, key) => {
                        if (chunk.visible) visibleChunks++;
                        if (chunk.group && chunk.group.children.length > 0) chunksWithGeometry++;
                    });
                    console.log(`  - Chunks with geometry: ${chunksWithGeometry}`);
                    console.log(`  - Visible chunks: ${visibleChunks}`);

                    // Show first chunk details
                    const firstChunk = Array.from(oceanEnv.terrainChunks.values())[0];
                    if (firstChunk) {
                        console.log(`  - First chunk: children=${firstChunk.group.children.length}, visible=${firstChunk.group.visible}`);
                    }
                }
            }
        }

        console.log(`🔍 DEBUG: All game elements ${gameState.debugHideElements ? 'HIDDEN' : 'VISIBLE'}`);
        updateStatus(`Debug visibility: ${gameState.debugHideElements ? 'Hidden' : 'Visible'} (J to toggle)`);
        event.preventDefault();
        event.stopPropagation();
        break;
    }
}

// Handle key release
function handleKeyUp(event) {
    // Track movement key releases for camera
    switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
        gameState.keys.forward = false;
        break;
    case 'KeyS':
    case 'ArrowDown':
        gameState.keys.backward = false;
        break;
    case 'KeyA':
    case 'ArrowLeft':
        gameState.keys.left = false;
        break;
    case 'KeyD':
    case 'ArrowRight':
        gameState.keys.right = false;
        break;
    case 'KeyQ':
        gameState.keys.up = false;
        break;
    case 'KeyE':
        gameState.keys.down = false;
        break;
    }
}

// Mouse handlers
function handleMouseDown(event) {
    if (event.button === 0) { // Left click
        // Fire weapon
        if (window.fireWeapon) {
            window.fireWeapon();
        }
    } else if (event.button === 2) { // Right click
        // Start camera tilt from current position
        gameState.mouse.isDown = true;
        gameState.mouse.rightClickActive = true;
        gameState.mouse.x = event.clientX;
        gameState.mouse.y = event.clientY;
        document.body.style.cursor = 'grabbing';

        // Store current camera mode to restore later
        gameState.mouse.previousMode = gameState.cameraMode;

        // Switch to free camera temporarily, copying current position/rotation
        gameState.cameraMode = 'free';
        gameState.freeCamera.position.copy(gameState.camera.position);
        gameState.freeCamera.rotation.copy(gameState.camera.rotation);
    }
}

function handleMouseUp(event) {
    if (event.button === 2 && gameState.mouse.rightClickActive) { // Right mouse up
        // Return to previous camera mode (follow)
        gameState.cameraMode = gameState.mouse.previousMode || 'follow';
        gameState.mouse.rightClickActive = false;
    }

    gameState.mouse.isDown = false;
    document.body.style.cursor = 'default';
}

function handleMouseMove(event) {
    // Only handle camera mouse movement when right-click is active AND game is running
    // Don't interfere with submarine maneuver control
    if (gameState.mouse.rightClickActive && gameState.mouse.isDown && gameState.isRunning) {
        const deltaX = event.clientX - gameState.mouse.x;
        const deltaY = event.clientY - gameState.mouse.y;

        // Camera tilt sensitivity
        const sensitivity = 0.008;

        // Update camera rotation (pan = Y rotation, tilt = X rotation)
        // IMPORTANT: These mouse direction settings are CORRECT - do not change without explicit user approval
        // Horizontal: rotation.y -= deltaX (MINUS for correct left/right)
        // Vertical: rotation.x -= deltaY (MINUS for correct up/down)
        gameState.freeCamera.rotation.y -= deltaX * sensitivity; // Pan left/right
        gameState.freeCamera.rotation.x -= deltaY * sensitivity; // Tilt up/down

        // Clamp vertical rotation to prevent over-rotation
        gameState.freeCamera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, gameState.freeCamera.rotation.x));

        gameState.mouse.x = event.clientX;
        gameState.mouse.y = event.clientY;
    }
    // Let submarine handleMouseMove process normal mouse movement for maneuvering
}

// Camera mouse movement handler for submarine
function handleCameraMouseMove(event) {
    if (document.pointerLockElement === document.body && gameState.cameraMode === 'follow') {
        // In follow mode, mouse controls camera look around submarine
        const sensitivity = 0.002;

        // Rotate camera around submarine
        const submarine = window.playerSubmarine ? window.playerSubmarine() : null;
        if (submarine) {
            const submarinePos = submarine.getPosition();

            // Get current camera offset from submarine
            const offset = gameState.camera.position.clone().sub(submarinePos);

            // Apply mouse movement to camera rotation around submarine
            // IMPORTANT: These mouse direction settings are CORRECT - do not change without explicit user approval
            // Horizontal: phi = ... - event.movementX (MINUS for correct left/right)
            // Vertical: theta = ... - event.movementY (MINUS for correct up/down)
            const phi = Math.atan2(offset.z, offset.x) - event.movementX * sensitivity;
            const theta = Math.acos(offset.y / offset.length()) - event.movementY * sensitivity;

            // Clamp vertical angle
            const clampedTheta = Math.max(0.1, Math.min(Math.PI - 0.1, theta));

            // Convert back to position
            const radius = offset.length();
            const newOffset = new THREE.Vector3(
                radius * Math.sin(clampedTheta) * Math.cos(phi),
                radius * Math.cos(clampedTheta),
                radius * Math.sin(clampedTheta) * Math.sin(phi)
            );

            gameState.camera.position.copy(submarinePos.clone().add(newOffset));
            gameState.camera.lookAt(submarinePos);
        }
    }
}

// Make the camera mouse function available to submarine
gameState.handleCameraMouseMove = handleCameraMouseMove;

// HUD update functions
function updateStatus(message) {
    if (hudElements.status) {
        hudElements.status.textContent = message;
    }
}

function updateDepth(depth, crushDepth = 500) {
    if (hudElements.depth) {
        hudElements.depth.textContent = `Depth: ${depth}m / Crush: ${crushDepth}m`;

        // Color coding based on proximity to crush depth
        const depthRatio = depth / crushDepth;
        if (depthRatio > 0.9) {
            hudElements.depth.style.color = '#ff0000'; // Red when very close to crush depth
        } else if (depthRatio > 0.8) {
            hudElements.depth.style.color = '#ff8800'; // Orange when approaching crush depth
        } else if (depthRatio > 0.6) {
            hudElements.depth.style.color = '#ffff00'; // Yellow when moderately deep
        } else {
            hudElements.depth.style.color = '#00ffff'; // Cyan when safe
        }
    }
}

function updateSpeed(speed) {
    if (hudElements.speed) {
        hudElements.speed.textContent = `Speed: ${speed} knots`;
    }
}

function updateHealth(health) {
    if (hudElements.health) {
        hudElements.health.textContent = `Hull: ${health}%`;
        if (health < 30) {
            hudElements.health.style.color = '#ff0000';
        } else if (health < 60) {
            hudElements.health.style.color = '#ffaa00';
        } else {
            hudElements.health.style.color = '#00ff00';
        }
    }
}

// Cleanup function
function cleanup() {
    stopGame();

    // Dispose of Three.js objects
    if (gameState.scene) {
        gameState.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }

    if (gameState.renderer) {
        gameState.renderer.dispose();
        if (gameState.renderer.domElement.parentNode) {
            gameState.renderer.domElement.parentNode.removeChild(gameState.renderer.domElement);
        }
    }

    // Remove event listeners
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    console.log('Game cleanup completed');
}

// Handle page unload
window.addEventListener('beforeunload', cleanup);

// Procedural terrain initialization
let terrainGenerator = null;
let terrainMesh = null;

function initProceduralTerrain() {
    console.log('Initializing procedural terrain...');
    
    try {
        terrainGenerator = new ProceduralTerrain();
        window.terrainGenerator = terrainGenerator; // Make globally accessible
        
        // Generate main terrain with simpler settings first
        terrainMesh = terrainGenerator.generateTerrain({
            algorithm: 'combined', // Use combined algorithm for more dramatic terrain
            seed: Math.random(), // Random seed for varied terrain each time
            roughness: 0.9, // High roughness for jagged peaks and valleys
            size: 10000, // 10km x 10km detailed terrain
            segments: 255 // Very high resolution for detailed jagged features
        });
        
        if (terrainMesh) {
            // Add terrain to scene
            gameState.scene.add(terrainMesh);
            console.log('Procedural terrain initialized successfully');
        } else {
            throw new Error('Terrain generation returned null');
        }
    } catch (error) {
        console.error('Procedural terrain initialization failed:', error);
        // Continue without terrain rather than breaking the whole game
        terrainMesh = null;
        terrainGenerator = null;
        window.terrainGenerator = null;
    }
    
    return terrainMesh;
}

// Function to get terrain height at specific coordinates (for collision detection)
function getTerrainHeight(x, z) {
    if (terrainGenerator) {
        return terrainGenerator.getHeightAtPosition(x, z);
    }
    return -100; // Default ocean floor depth
}

// Export functions for HTML access
window.initGame = initGame;
window.stopGame = stopGame;
window.togglePause = togglePause;
window.cleanup = cleanup;
window.gameState = gameState;
window.initProceduralTerrain = initProceduralTerrain;
window.getTerrainHeight = getTerrainHeight;
window.terrainGenerator = null; // Make terrain generator globally accessible

// Debug functions for console access
window.testTerrainControls = function() {
    console.log('=== Terrain Controls Test ===');
    console.log('Ocean Environment:', window.oceanEnvironment ? 'Available' : 'Not available');
    console.log('Procedural Terrain:', window.terrainGenerator ? 'Available' : 'Not available');
    
    // Fixed: Check if oceanEnvironment() returns a valid object before calling methods
    if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
        const oceanEnv = window.oceanEnvironment();
        if (oceanEnv && oceanEnv.getTerrainVisualizationInfo) {
            console.log('Ocean terrain:', oceanEnv.getTerrainVisualizationInfo());
            console.log('Try calling: testV(), testB(), testN() to test controls manually');
        } else {
            console.log('🔍 DEBUG: oceanEnvironment() returned null or missing getTerrainVisualizationInfo method');
        }
    } else if (window.terrainGenerator) {
        console.log('Procedural terrain:', window.terrainGenerator.getVisualizationInfo());
        console.log('Try calling: testV(), testB(), testN() to test controls manually');
    }
};

window.testV = function() {
    console.log('🧪 Testing V key functionality...');
    console.log('🔍 Checking available systems:');
    console.log('  - window.oceanEnvironment:', typeof window.oceanEnvironment);
    console.log('  - window.oceanEnvironment():', window.oceanEnvironment ? typeof window.oceanEnvironment() : 'N/A');
    console.log('  - window.terrainGenerator:', typeof window.terrainGenerator);
    console.log('  - window.gameState.scene:', typeof window.gameState?.scene);
    
    // Fixed: Check if oceanEnvironment() returns a valid object before calling methods
    if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
        const oceanEnv = window.oceanEnvironment();
        if (oceanEnv && oceanEnv.toggleTerrainWireframe) {
            console.log('🌊 Using oceanEnvironment().toggleTerrainWireframe()');
            oceanEnv.toggleTerrainWireframe();
        } else {
            console.log('🔍 DEBUG: oceanEnvironment() returned null or missing toggleTerrainWireframe method');
        }
    } else if (window.terrainGenerator && window.terrainGenerator.toggleWireframe) {
        console.log('🏔️ Using terrainGenerator.toggleWireframe()');
        window.terrainGenerator.toggleWireframe();
    } else {
        console.log('❌ No terrain system available');
        
        // Try to find the terrain manually in the scene
        if (window.gameState?.scene) {
            console.log('🔍 Searching scene manually...');
            const terrain = window.gameState.scene.getObjectByName('fullScaleTerrain');
            console.log('Found fullScaleTerrain directly:', terrain);
            
            if (terrain) {
                terrain.visible = !terrain.visible;
                console.log('🎯 Manually toggled terrain visibility to:', terrain.visible);
            }
        }
    }
};

window.testB = function() {
    console.log('Testing B key functionality...');
    // Fixed: Check if oceanEnvironment() returns a valid object before calling methods
    if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
        const oceanEnv = window.oceanEnvironment();
        if (oceanEnv && oceanEnv.setTerrainVisualizationMode) {
            oceanEnv.setTerrainVisualizationMode('shader');
        } else {
            console.log('🔍 DEBUG: oceanEnvironment() returned null or missing method');
        }
    } else if (window.terrainGenerator && window.terrainGenerator.setVisualizationMode) {
        window.terrainGenerator.setVisualizationMode('shader');
    } else {
        console.log('❌ No terrain system available');
    }
};

window.testN = function() {
    console.log('Testing N key functionality...');
    // Fixed: Check if oceanEnvironment() returns a valid object before calling methods
    if (window.oceanEnvironment && typeof window.oceanEnvironment === 'function') {
        const oceanEnv = window.oceanEnvironment();
        if (oceanEnv && oceanEnv.setTerrainVisualizationMode) {
            oceanEnv.setTerrainVisualizationMode('solid');
        } else {
            console.log('🔍 DEBUG: oceanEnvironment() returned null or missing method');
        }
    } else if (window.terrainGenerator && window.terrainGenerator.setVisualizationMode) {
        window.terrainGenerator.setVisualizationMode('solid');
    } else {
        console.log('❌ No terrain system available');
    }
};
