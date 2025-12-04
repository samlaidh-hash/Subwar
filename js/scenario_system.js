// Scenario Selection System
// Handles mission selection, loadout customization, and scenario transitions

class ScenarioSelectionSystem {
    constructor() {
        this.selectedScenario = null;
        this.selectedSubmarine = null; // No default - must select mission first, then submarine
        this.isOverlayVisible = true;
        this.gameInitialized = false;
        this.gamePaused = true; // Game starts paused during setup
        
        // Initialize the system
        this.init();
    }
    
    init() {
        // Add event listeners for scenario and submarine selection
        this.setupEventListeners();
        
        // Show the overlay initially
        this.showOverlay();
        
        // Initialize UI state
        this.initializeUIState();
        
        console.log('🎯 Scenario Selection System initialized');
    }
    
    setupEventListeners() {
        const overlay = document.getElementById('scenarioOverlay');
        if (!overlay) return;
        
        // Scenario card click handlers
        const scenarioCards = overlay.querySelectorAll('.scenario-card');
        scenarioCards.forEach(card => {
            card.addEventListener('click', (event) => {
                const scenarioId = card.getAttribute('data-scenario');
                this.selectScenario(scenarioId);
            });
        });
        
        // Submarine card click handlers
        const submarineCards = overlay.querySelectorAll('.submarine-card');
        submarineCards.forEach(card => {
            card.addEventListener('click', (event) => {
                // Only allow submarine selection after scenario is selected
                if (!this.selectedScenario) {
                    this.showMessage('Please select a mission first', 'warning');
                    return;
                }
                
                const submarineId = card.getAttribute('data-submarine');
                this.selectSubmarine(submarineId);
            });
        });
        
        // Start Mission button click handler
        const startButton = document.getElementById('startMissionBtn');
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (!startButton.disabled && this.selectedScenario && this.selectedSubmarine) {
                    this.startSelectedScenario();
                }
            });
        }
        
        // Global keyboard handlers
        document.addEventListener('keydown', (event) => {
            if (!this.isOverlayVisible) return;
            
            switch (event.code) {
                case 'F1':
                    event.preventDefault();
                    this.selectScenario('PATROL_MISSION');
                    break;
                case 'F2':
                    event.preventDefault();
                    this.selectScenario('STEALTH_OPERATION');
                    break;
                case 'F3':
                    event.preventDefault();
                    this.selectScenario('COMBAT_TRAINING');
                    break;
                case 'F4':
                    event.preventDefault();
                    this.selectScenario('RESCUE_MISSION');
                    break;
                case 'Escape':
                    event.preventDefault();
                    this.startFreeRoam();
                    break;
            }
        });
    }
    
    selectScenario(scenarioId) {
        this.selectedScenario = scenarioId;
        
        // Visual feedback - highlight selected scenario
        const scenarioCards = document.querySelectorAll('.scenario-card');
        scenarioCards.forEach(card => {
            if (card.getAttribute('data-scenario') === scenarioId) {
                card.style.borderColor = '#ffff00';
                card.style.background = 'rgba(255, 255, 0, 0.2)';
                card.style.transform = 'translateY(-5px)';
            } else {
                card.style.borderColor = '#00ffff';
                card.style.background = 'rgba(0, 0, 0, 0.8)';
                card.style.transform = 'translateY(0)';
            }
        });
        
        console.log(`🎯 Selected scenario: ${scenarioId}`);
        
        // Enable submarine selection and show instruction
        this.enableSubmarineSelection();
        this.showMessage('Mission selected! Now choose your submarine.', 'success');
        
        // Don't auto-start - wait for submarine selection
    }
    
    selectSubmarine(submarineId) {
        // Map UI submarine names to actual submarine classes
        const submarineClassMap = {
            'TORNADO': 'TORNADO',     // Direct mapping
            'TYPHOON': 'TYPHOON',     // Direct mapping
            'WHIRLWIND': 'WHIRLWIND', // Direct mapping
            'CYCLONE': 'CYCLONE'      // Direct mapping
        };
        
        this.selectedSubmarine = submarineId;
        const submarineClass = submarineClassMap[submarineId] || 'COBRA';
        
        // Visual feedback - highlight selected submarine
        const submarineCards = document.querySelectorAll('.submarine-card');
        submarineCards.forEach(card => {
            if (card.getAttribute('data-submarine') === submarineId) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        
        console.log(`🚢 Selected submarine: ${submarineId} (class: ${submarineClass})`);
        
        // Store submarine class for game initialization
        this.selectedSubmarine = submarineClass;
        
        // Enable start button and show ready message
        this.enableStartButton();
        this.showMessage('Ready to start! Click "Start Mission" to begin.', 'success');
        
        // Don't auto-start - wait for explicit start button click
    }
    
    startSelectedScenario() {
        if (!this.selectedScenario) {
            console.warn('No scenario selected');
            return;
        }
        
        this.hideOverlay();
        
        // Initialize the game with selected submarine
        this.initializeGame();
        
        // Start the scenario
        setTimeout(() => {
            if (window.startScenario) {
                window.startScenario(this.selectedScenario);
                console.log(`🎮 Started scenario: ${this.selectedScenario} with submarine: ${this.selectedSubmarine}`);
            }
        }, 500);
    }
    
    startFreeRoam() {
        console.log('🌊 Starting Free Roam Mode');
        this.hideOverlay();
        
        // Initialize game without scenario
        this.initializeGame();
    }
    
    initializeGame() {
        // Only initialize if both scenario and submarine are selected
        if (!this.selectedScenario || !this.selectedSubmarine) {
            console.log('⏸️ Game initialization postponed - waiting for both mission and submarine selection');
            return;
        }
        
        // Store selections globally for game initialization
        if (typeof window.gameState !== 'undefined') {
            window.gameState.selectedSubmarine = this.selectedSubmarine;
            window.gameState.selectedScenario = this.selectedScenario;
            window.gameState.paused = false; // Unpause when starting
        } else {
            // Create gameState if it doesn't exist
            window.gameState = {
                selectedSubmarine: this.selectedSubmarine,
                selectedScenario: this.selectedScenario,
                paused: false
            };
        }
        
        // Initialize the main game if not already initialized
        if (typeof window.initGame === 'function' && !this.gameInitialized) {
            console.log('🎮 Initializing game with mission:', this.selectedScenario, 'and submarine:', this.selectedSubmarine);
            window.initGame();
            this.gameInitialized = true;
            this.gamePaused = false;
        }
    }
    
    showOverlay() {
        const overlay = document.getElementById('scenarioOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.isOverlayVisible = true;
        }
    }
    
    hideOverlay() {
        const overlay = document.getElementById('scenarioOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            this.isOverlayVisible = false;
        }
    }
    
    // Method to show overlay again (for returning to main menu)
    returnToMenu() {
        this.selectedScenario = null;
        this.showOverlay();
        
        // Reset visual states
        const scenarioCards = document.querySelectorAll('.scenario-card');
        scenarioCards.forEach(card => {
            card.style.borderColor = '#00ffff';
            card.style.background = 'rgba(0, 0, 0, 0.8)';
            card.style.transform = 'translateY(0)';
        });
        
        console.log('📋 Returned to scenario selection menu');
    }
    
    // Get submarine specifications for the selected submarine
    getSelectedSubmarineSpecs() {
        const submarineSpecs = {
            'TORNADO': {
                name: 'TORNADO Class',
                maxDepth: 1500,
                maxSpeed: 100,
                hullType: 'Medium Fighter',
                description: 'Balanced combat platform - sleek and angular like Elite Viper'
            },
            'TYPHOON': {
                name: 'TYPHOON Class',
                maxDepth: 1600,
                maxSpeed: 80,
                hullType: 'Heavy Fighter',
                description: 'Tank/assault submarine - broader, bulkier design for maximum firepower'
            },
            'WHIRLWIND': {
                name: 'WHIRLWIND Class',
                maxDepth: 10000,
                maxSpeed: 85,
                hullType: 'Deep Sub',
                description: 'Deep sea explorer - reinforced pressure hull for extreme depth operations'
            },
            'CYCLONE': {
                name: 'CYCLONE Class',
                maxDepth: 12000,
                maxSpeed: 70,
                hullType: 'Ultra Deep Sub',
                description: 'Ultra deep strategic - ultimate depth submarine with experimental pressure systems'
            }
        };

        return submarineSpecs[this.selectedSubmarine] || submarineSpecs['TORNADO'];
    }

    initializeUIState() {
        // Initialize the UI to the proper starting state
        
        // Disable submarine selection initially
        const submarineCards = document.querySelectorAll('.submarine-card');
        submarineCards.forEach(card => {
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
            card.style.filter = 'grayscale(50%)';
        });
        
        // Disable start button initially
        const startButton = document.getElementById('startMissionBtn');
        if (startButton) {
            startButton.disabled = true;
            startButton.style.opacity = '0.5';
            startButton.style.pointerEvents = 'none';
        }
        
        console.log('🎮 UI initialized - mission selection required first');
    }

    enableSubmarineSelection() {
        // Enable submarine cards for selection
        const submarineCards = document.querySelectorAll('.submarine-card');
        submarineCards.forEach(card => {
            card.style.opacity = '1.0';
            card.style.pointerEvents = 'auto';
            card.style.filter = 'none';
        });
        console.log('🚢 Submarine selection enabled');
    }

    enableStartButton() {
        // Enable start mission button
        const startButton = document.getElementById('startMissionBtn');
        if (startButton) {
            startButton.style.opacity = '1.0';
            startButton.style.pointerEvents = 'auto';
            startButton.disabled = false;
            
            // Update button text
            const btnText = startButton.querySelector('.btn-text');
            const btnSubtitle = startButton.querySelector('.btn-subtitle');
            if (btnText) btnText.textContent = 'Start Mission';
            if (btnSubtitle) btnSubtitle.textContent = 'Begin your submarine operation';
        }
        console.log('▶️ Start button enabled');
    }

    showMessage(text, type = 'info') {
        // Show status message to user
        const messageDiv = document.getElementById('statusMessage') || this.createStatusMessage();
        messageDiv.textContent = text;
        messageDiv.className = `status-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
        
        console.log(`💬 Message (${type}): ${text}`);
    }

    createStatusMessage() {
        // Create status message element if it doesn't exist
        const messageDiv = document.createElement('div');
        messageDiv.id = 'statusMessage';
        messageDiv.className = 'status-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            display: none;
            background: #333;
            border: 2px solid #00ffff;
        `;
        document.body.appendChild(messageDiv);
        return messageDiv;
    }

    pauseGame() {
        // Pause the game during setup
        if (window.gameState) {
            window.gameState.paused = true;
        }
        this.gamePaused = true;
        console.log('⏸️ Game paused for setup');
    }

    unpauseGame() {
        // Unpause the game when starting
        if (window.gameState) {
            window.gameState.paused = false;
        }
        this.gamePaused = false;
        console.log('▶️ Game unpaused');
    }
}

// Initialize the scenario selection system when DOM is ready
let scenarioSystem = null;

function initScenarioSystem() {
    scenarioSystem = new ScenarioSelectionSystem();
    return scenarioSystem;
}

// Export for global access
window.ScenarioSelectionSystem = ScenarioSelectionSystem;
window.initScenarioSystem = initScenarioSystem;
window.scenarioSystem = () => scenarioSystem;

console.log('📚 Scenario Selection System module loaded');