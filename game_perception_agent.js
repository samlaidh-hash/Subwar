/**
 * Game Perception Agent - Visual Game State Analysis
 *
 * This tool provides AI-level perception of the actual game state,
 * bridging the gap between code expectations and visual reality.
 */

class GamePerceptionAgent {
    constructor() {
        this.screenshots = [];
        this.gameStateHistory = [];
        this.analysisResults = [];
        this.isRecording = false;
    }

    // CORE PERCEPTION METHODS
    async captureGameState() {
        const timestamp = Date.now();
        const state = {
            timestamp,
            camera: this.getCameraState(),
            scene: this.getSceneAnalysis(),
            rendering: this.getRenderingState(),
            controls: this.getControlState(),
            audio: this.getAudioState(),
            performance: this.getPerformanceMetrics()
        };

        this.gameStateHistory.push(state);
        return state;
    }

    getRenderingState() {
        try {
            const canvas = document.querySelector('canvas');
            if (!canvas) {
                return { error: 'No canvas found' };
            }

            return {
                canvasSize: {
                    width: canvas.width,
                    height: canvas.height
                },
                pixelRatio: window.devicePixelRatio || 1,
                webglContext: !!canvas.getContext('webgl') || !!canvas.getContext('webgl2'),
                isVisible: canvas.style.display !== 'none'
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    getControlState() {
        try {
            return {
                mousePosition: { x: 0, y: 0 }, // Would need event listeners to track
                keysPressed: [], // Would need event listeners to track
                pointerLocked: !!document.pointerLockElement
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    getAudioState() {
        try {
            return {
                audioContext: !!window.AudioContext || !!window.webkitAudioContext,
                masterVolume: 1.0 // Would need to check actual audio system
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    getPerformanceMetrics() {
        try {
            return {
                memory: performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize
                } : 'not available',
                timing: {
                    loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
                }
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    async takeScreenshot() {
        try {
            // Use browser's built-in screenshot capability
            const canvas = document.querySelector('canvas');
            if (!canvas) {
                throw new Error('No canvas element found - game not rendering');
            }

            const screenshot = {
                timestamp: Date.now(),
                dataURL: canvas.toDataURL('image/png'),
                dimensions: {
                    width: canvas.width,
                    height: canvas.height
                },
                analysis: await this.analyzeScreenshot(canvas)
            };

            this.screenshots.push(screenshot);
            return screenshot;
        } catch (error) {
            console.error('🚨 Screenshot failed:', error);
            return null;
        }
    }

    analyzeScreenshot(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const analysis = {
            dominantColors: this.analyzeDominantColors(data),
            visibleElements: this.detectVisibleElements(data),
            renderingQuality: this.assessRenderingQuality(data),
            terrainPresence: this.detectTerrainElements(data),
            submarinePresence: this.detectSubmarineElements(data)
        };

        return analysis;
    }

    analyzeDominantColors(imageData) {
        const colorCounts = {};
        const sampleRate = 100; // Analyze every 100th pixel for performance

        for (let i = 0; i < imageData.length; i += 4 * sampleRate) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];

            if (a > 128) { // Only count visible pixels
                const color = `${Math.floor(r/32)*32},${Math.floor(g/32)*32},${Math.floor(b/32)*32}`;
                colorCounts[color] = (colorCounts[color] || 0) + 1;
            }
        }

        const sortedColors = Object.entries(colorCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        return {
            topColors: sortedColors,
            totalPixelsAnalyzed: Math.floor(imageData.length / (4 * sampleRate)),
            interpretation: this.interpretColors(sortedColors)
        };
    }

    detectVisibleElements(imageData) {
        // Detect edges and shapes that might indicate game objects
        const edges = this.detectEdges(imageData);
        return {
            edgeCount: edges,
            hasGeometry: edges > 100,
            complexity: edges > 500 ? 'high' : edges > 100 ? 'medium' : 'low'
        };
    }

    detectEdges(imageData) {
        let edgeCount = 0;
        const width = Math.sqrt(imageData.length / 4);

        for (let i = 0; i < imageData.length - 4; i += 4) {
            const current = imageData[i] + imageData[i+1] + imageData[i+2];
            const next = imageData[i+4] + imageData[i+5] + imageData[i+6];

            if (Math.abs(current - next) > 50) {
                edgeCount++;
            }
        }

        return edgeCount;
    }

    assessRenderingQuality(imageData) {
        const totalPixels = imageData.length / 4;
        let nonBlackPixels = 0;

        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];

            if (r > 10 || g > 10 || b > 10) {
                nonBlackPixels++;
            }
        }

        const renderRatio = nonBlackPixels / totalPixels;

        return {
            nonBlackPixels,
            totalPixels,
            renderRatio,
            quality: renderRatio > 0.5 ? 'good' : renderRatio > 0.1 ? 'poor' : 'minimal'
        };
    }

    detectTerrainElements(imageData) {
        let terrainLikePixels = 0;

        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];

            // Look for terrain-like colors (browns, grays, greens)
            if ((g > r && g > b) || // Green terrain
                (r > 100 && g > 100 && b < 150) || // Brown terrain
                (r > 50 && r < 150 && Math.abs(r - g) < 30 && Math.abs(r - b) < 30)) { // Gray terrain
                terrainLikePixels++;
            }
        }

        return {
            terrainPixels: terrainLikePixels,
            terrainRatio: terrainLikePixels / (imageData.length / 4),
            hasTerrainColors: terrainLikePixels > 100
        };
    }

    detectSubmarineElements(imageData) {
        let submarinePixels = 0;

        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];

            // Look for submarine-like colors (metallic grays, dark colors)
            if ((r > 80 && r < 160 && Math.abs(r - g) < 20 && Math.abs(r - b) < 20) || // Gray metal
                (r < 50 && g < 50 && b < 50)) { // Dark submarine hull
                submarinePixels++;
            }
        }

        return {
            submarinePixels,
            submarineRatio: submarinePixels / (imageData.length / 4),
            hasSubmarineColors: submarinePixels > 50
        };
    }

    interpretColors(colors) {
        const interpretations = [];

        colors.forEach(([color, count]) => {
            const [r, g, b] = color.split(',').map(Number);

            // Ocean/water colors (blues)
            if (b > r && b > g && b > 100) {
                interpretations.push(`Ocean/water detected (${color})`);
            }
            // Terrain colors (greens, browns, grays)
            else if (g > r && g > b) {
                interpretations.push(`Terrain/seafloor detected (${color})`);
            }
            // UI elements (bright colors)
            else if (r > 200 || g > 200 || b > 200) {
                interpretations.push(`UI/debug elements detected (${color})`);
            }
            // Darkness (black/dark blue - deep water)
            else if (r < 50 && g < 50 && b < 100) {
                interpretations.push(`Deep water/darkness detected (${color})`);
            }
        });

        return interpretations;
    }

    // GAME STATE ANALYSIS
    getCameraState() {
        if (window.gameState && window.gameState.camera) {
            const camera = window.gameState.camera;
            return {
                position: {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z
                },
                rotation: {
                    x: camera.rotation.x,
                    y: camera.rotation.y,
                    z: camera.rotation.z
                },
                fov: camera.fov,
                near: camera.near,
                far: camera.far
            };
        }
        return { error: 'Camera not accessible' };
    }

    getSceneAnalysis() {
        if (window.gameState && window.gameState.scene) {
            const scene = window.gameState.scene;

            const analysis = {
                totalChildren: scene.children.length,
                objectsByType: {},
                terrainObjects: [],
                submarineObjects: [],
                debugObjects: []
            };

            scene.traverse((object) => {
                const type = object.constructor.name;
                analysis.objectsByType[type] = (analysis.objectsByType[type] || 0) + 1;

                // Categorize objects
                if (object.name && object.name.includes('terrain')) {
                    analysis.terrainObjects.push({
                        name: object.name,
                        type: type,
                        visible: object.visible,
                        position: object.position
                    });
                }

                if (object.name && object.name.includes('submarine')) {
                    analysis.submarineObjects.push({
                        name: object.name,
                        type: type,
                        visible: object.visible,
                        position: object.position
                    });
                }

                if (object.material && object.material.color) {
                    const color = object.material.color;
                    if ((color.r > 0.8 && color.g < 0.3 && color.b < 0.3) || // Red debug
                        (color.r < 0.3 && color.g > 0.8 && color.b > 0.8)) { // Cyan debug
                        analysis.debugObjects.push({
                            name: object.name || 'unnamed',
                            type: type,
                            color: `rgb(${Math.floor(color.r*255)},${Math.floor(color.g*255)},${Math.floor(color.b*255)})`,
                            visible: object.visible,
                            position: object.position
                        });
                    }
                }
            });

            return analysis;
        }
        return { error: 'Scene not accessible' };
    }

    // AUTOMATED TESTING SUITE
    async runComprehensiveAnalysis() {
        console.log('🔍 GAME PERCEPTION AGENT - Starting comprehensive analysis...');

        const analysis = {
            timestamp: Date.now(),
            gameState: await this.captureGameState(),
            screenshot: await this.takeScreenshot(),
            issues: [],
            recommendations: []
        };

        // Analyze for common issues
        this.detectCommonIssues(analysis);

        // Generate report
        this.generateReport(analysis);

        return analysis;
    }

    detectCommonIssues(analysis) {
        const issues = analysis.issues;
        const scene = analysis.gameState.scene;
        const screenshot = analysis.screenshot;

        // Issue 1: No terrain visible
        if (scene.terrainObjects.length === 0) {
            issues.push({
                severity: 'critical',
                issue: 'No terrain objects found in scene',
                solution: 'Check terrain initialization and scene.add() calls'
            });
        }

        // Issue 2: Terrain exists but not visible
        const invisibleTerrain = scene.terrainObjects.filter(obj => !obj.visible);
        if (invisibleTerrain.length > 0) {
            issues.push({
                severity: 'high',
                issue: `${invisibleTerrain.length} terrain objects exist but are invisible`,
                solution: 'Check object.visible properties and material transparency'
            });
        }

        // Issue 3: Camera positioning
        const camera = analysis.gameState.camera;
        if (camera.position) {
            const distanceFromOrigin = Math.sqrt(
                camera.position.x ** 2 +
                camera.position.y ** 2 +
                camera.position.z ** 2
            );

            if (distanceFromOrigin > 50000) {
                issues.push({
                    severity: 'medium',
                    issue: 'Camera very far from origin - may not see terrain',
                    solution: 'Check camera/submarine positioning relative to terrain'
                });
            }
        }

        // Issue 4: Rendering analysis
        if (screenshot && screenshot.analysis) {
            const colors = screenshot.analysis.dominantColors;
            const hasTerrainColors = colors.interpretation.some(i =>
                i.includes('Terrain') || i.includes('seafloor')
            );

            if (!hasTerrainColors) {
                issues.push({
                    severity: 'high',
                    issue: 'No terrain colors detected in rendered image',
                    solution: 'Terrain may not be rendering or may be outside camera view'
                });
            }
        }
    }

    generateReport(analysis) {
        console.log('📊 GAME PERCEPTION ANALYSIS REPORT');
        console.log('=====================================');
        console.log(`Timestamp: ${new Date(analysis.timestamp).toLocaleTimeString()}`);

        console.log('\n🎮 SCENE ANALYSIS:');
        const scene = analysis.gameState.scene;
        console.log(`  Total objects: ${scene.totalChildren}`);
        console.log(`  Terrain objects: ${scene.terrainObjects.length}`);
        console.log(`  Submarine objects: ${scene.submarineObjects.length}`);
        console.log(`  Debug objects: ${scene.debugObjects.length}`);

        console.log('\n📷 CAMERA STATE:');
        const camera = analysis.gameState.camera;
        if (camera.position) {
            console.log(`  Position: (${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)})`);
            console.log(`  Rotation: (${camera.rotation.x.toFixed(2)}, ${camera.rotation.y.toFixed(2)}, ${camera.rotation.z.toFixed(2)})`);
        }

        console.log('\n🎨 VISUAL ANALYSIS:');
        if (analysis.screenshot && analysis.screenshot.analysis) {
            const visual = analysis.screenshot.analysis;
            console.log(`  Dominant colors: ${visual.dominantColors.topColors.length} detected`);
            visual.dominantColors.interpretation.forEach(interp => {
                console.log(`    ${interp}`);
            });
        }

        console.log('\n🚨 ISSUES DETECTED:');
        if (analysis.issues.length === 0) {
            console.log('  ✅ No critical issues detected');
        } else {
            analysis.issues.forEach((issue, index) => {
                console.log(`  ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.issue}`);
                console.log(`     Solution: ${issue.solution}`);
            });
        }

        console.log('\n=====================================');

        // Store in global for access
        window.lastPerceptionAnalysis = analysis;
    }

    // UTILITY METHODS
    startRecording() {
        this.isRecording = true;
        console.log('🔴 Started recording game state...');
    }

    stopRecording() {
        this.isRecording = false;
        console.log('⏹️ Stopped recording game state');
        return this.gameStateHistory;
    }

    exportAnalysis() {
        const data = {
            screenshots: this.screenshots,
            gameStateHistory: this.gameStateHistory,
            analysisResults: this.analysisResults
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `game_analysis_${Date.now()}.json`;
        a.click();

        console.log('📁 Game analysis exported');
    }
}

// Initialize and make globally available
window.gamePerceptionAgent = new GamePerceptionAgent();

// Add convenient global functions
window.analyzeGame = () => window.gamePerceptionAgent.runComprehensiveAnalysis();
window.takeGameScreenshot = () => window.gamePerceptionAgent.takeScreenshot();
window.captureGameState = () => window.gamePerceptionAgent.captureGameState();

console.log('🤖 Game Perception Agent loaded');
console.log('Usage:');
console.log('  analyzeGame() - Run comprehensive analysis');
console.log('  takeGameScreenshot() - Capture and analyze screenshot');
console.log('  captureGameState() - Capture current game state');