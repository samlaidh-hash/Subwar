/**
 * Integrated Mapping System for Sub War 2060
 * Provides both full-screen map (M key) and real-time mini-map
 */

class IntegratedMappingSystem {
    constructor(gameState, submarine) {
        this.gameState = gameState;
        this.submarine = submarine;
        this.terrainSize = 50000; // Same as SimpleTerrain
        
        // Full-screen map
        this.fullMapVisible = false;
        this.fullMapCanvas = null;
        this.fullMapCtx = null;
        this.fullMapOverlay = null;
        
        // Mini-map
        this.miniMapCanvas = null;
        this.miniMapCtx = null;
        this.miniMapSize = 200; // 200x200 pixel mini-map
        this.miniMapRange = 2000; // 2km x 2km area (2000m)
        
        // Rendering settings
        this.isometricSettings = {
            verticalScale: 2.0,
            viewAngle: 45,
            showShading: false, // Disabled - wireframe only
            wireframeOnly: true, // Force wireframe rendering
            detailLevel: 100 // Lower for performance
        };
        
        // Terrain cache for performance
        this.terrainCache = new Map();
        this.lastCacheUpdate = 0;
        
        this.init();
    }

    init() {
        this.createFullMapOverlay();
        this.createMiniMap();
        this.setupKeyBindings();
        
        console.log('🗺️ Integrated mapping system initialized');
        console.log('📍 Press M for full map, mini-map active in bottom-right');
    }

    // Enhanced zoned terrain generation - same as SimpleTerrain for consistency
    getHeightAtPosition(x, z) {
        // STEP 1: Generate base smooth terrain (the excellent current system)
        let baseHeight = this.generateBaseTerrainHeight(x, z);
        
        // STEP 2: Add zoned detail overlay
        const detailHeight = this.generateZonedDetailOverlay(x, z);
        
        // STEP 3: Combine base + detail (allows islands!)
        return baseHeight + detailHeight;
    }

    generateBaseTerrainHeight(x, z) {
        let height = -1000;
        
        const continentalScale = 0.00005;
        const continentalShelf = Math.sin(x * continentalScale) * Math.cos(z * continentalScale) * 600;
        height += continentalShelf;
        
        const ridgeScale = 0.00008;
        const ridgeNoise = Math.sin(x * ridgeScale + z * ridgeScale * 0.7) * Math.cos(z * ridgeScale * 0.9);
        height += ridgeNoise * 500;
        
        const basinScale = 0.00006;
        const basinNoise = Math.cos(x * basinScale - z * basinScale * 0.8) * Math.sin(x * basinScale * 1.2);
        height += basinNoise * 400;
        
        const hillScale = 0.0002;
        height += Math.sin(x * hillScale) * Math.cos(z * hillScale * 0.8) * 250;
        height += Math.cos(x * hillScale * 1.3 + z * hillScale) * 200;
        
        const gentleScale = 0.0005;
        height += Math.sin(x * gentleScale * 1.5) * Math.cos(z * gentleScale) * 100;
        
        height = Math.max(height, -2000);
        height = Math.min(height, -150);
        
        return height;
    }

    generateZonedDetailOverlay(x, z) {
        const distanceFromOrigin = Math.sqrt(x * x + z * z);
        
        let meshSize, variationIntensity;
        
        if (distanceFromOrigin <= 5000) {
            meshSize = 50;
            variationIntensity = 1.0;
        } else if (distanceFromOrigin <= 15000) {
            meshSize = 100;
            variationIntensity = 0.7;
        } else {
            meshSize = 200;
            variationIntensity = 0.4;
        }
        
        // Smooth transitions between zones
        if (distanceFromOrigin > 4000 && distanceFromOrigin < 6000) {
            const factor = (distanceFromOrigin - 4000) / 2000;
            meshSize = 50 + (100 - 50) * factor;
            variationIntensity = 1.0 + (0.7 - 1.0) * factor;
        } else if (distanceFromOrigin > 14000 && distanceFromOrigin < 16000) {
            const factor = (distanceFromOrigin - 14000) / 2000;
            meshSize = 100 + (200 - 100) * factor;
            variationIntensity = 0.7 + (0.4 - 0.7) * factor;
        }
        
        return this.generateDetailMeshOverlay(x, z, meshSize, variationIntensity);
    }

    generateDetailMeshOverlay(x, z, meshSize, intensity) {
        const gridX = Math.floor(x / meshSize) * meshSize;
        const gridZ = Math.floor(z / meshSize) * meshSize;
        
        const corners = [
            { x: gridX, z: gridZ },
            { x: gridX + meshSize, z: gridZ },
            { x: gridX, z: gridZ + meshSize },
            { x: gridX + meshSize, z: gridZ + meshSize }
        ];
        
        const cornerHeights = corners.map(corner => {
            return this.getDeterministicVariation(corner.x, corner.z) * intensity;
        });
        
        // Determine smoothing level for this area based on deterministic criteria
        const smoothingSeed = Math.sin(gridX * 0.001 + gridZ * 0.0007) * 43758.5453;
        const smoothingRandom = smoothingSeed - Math.floor(smoothingSeed);
        
        let interpolationMethod;
        if (smoothingRandom < 0.3) {
            // 30% - Sharp angular terrain (linear interpolation)
            interpolationMethod = 'linear';
        } else if (smoothingRandom < 0.7) {
            // 40% - Moderately smooth terrain (cubic interpolation)  
            interpolationMethod = 'cubic';
        } else {
            // 30% - Very smooth rounded terrain (quintic interpolation)
            interpolationMethod = 'quintic';
        }
        
        // Apply chosen interpolation method
        const localX = (x - gridX) / meshSize;
        const localZ = (z - gridZ) / meshSize;
        
        let smoothX, smoothZ;
        
        if (interpolationMethod === 'linear') {
            smoothX = localX;
            smoothZ = localZ;
        } else if (interpolationMethod === 'cubic') {
            // Cubic smoothing: 3t² - 2t³
            smoothX = localX * localX * (3 - 2 * localX);
            smoothZ = localZ * localZ * (3 - 2 * localZ);
        } else { // quintic
            // Quintic smoothing: 6t⁵ - 15t⁴ + 10t³ (very smooth)
            smoothX = localX * localX * localX * (localX * (localX * 6 - 15) + 10);
            smoothZ = localZ * localZ * localZ * (localZ * (localZ * 6 - 15) + 10);
        }
        
        // Interpolation using smoothed coordinates
        const top = cornerHeights[0] * (1 - smoothX) + cornerHeights[1] * smoothX;
        const bottom = cornerHeights[2] * (1 - smoothX) + cornerHeights[3] * smoothX;
        
        return top * (1 - smoothZ) + bottom * smoothZ;
    }

    getDeterministicVariation(x, z) {
        const seed1 = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
        const seed2 = Math.sin((x + 1) * 92.9898 + (z + 1) * 45.233) * 23758.5453;
        const seed3 = Math.sin((x - 1) * 52.9898 + (z - 1) * 67.233) * 33758.5453;
        
        const random1 = seed1 - Math.floor(seed1);
        const random2 = seed2 - Math.floor(seed2);
        const random3 = seed3 - Math.floor(seed3);
        
        let combinedRandom = (random1 + random2 + random3) / 3;
        
        let variation;
        if (combinedRandom < 0.70) {
            variation = 2100; // 70% (7x more dramatic)
        } else if (combinedRandom < 0.775) {
            variation = 1400; // 7.5% (7x more dramatic)
        } else if (combinedRandom < 0.85) {
            variation = 700; // 7.5% (7x more dramatic)
        } else if (combinedRandom < 0.925) {
            variation = 2800; // 7.5% (7x more dramatic)
        } else {
            variation = 3500; // 7.5% (7x more dramatic)
        }
        
        const sign = (random1 > 0.5) ? 1 : -1;
        return variation * sign;
    }

    depthToColor(depth, shading = 1.0) {
        const normalizedDepth = (depth + 150) / (-2000 + 150);
        
        let r, g, b;
        if (normalizedDepth < 0.2) {
            const t = normalizedDepth / 0.2;
            r = Math.floor((255 - t * 119) * shading);
            g = Math.floor(255 * shading);
            b = Math.floor((136 - t * 136) * shading);
        } else if (normalizedDepth < 0.5) {
            const t = (normalizedDepth - 0.2) / 0.3;
            r = Math.floor((136 - t * 136) * shading);
            g = Math.floor(255 * shading);
            b = Math.floor((t * 255) * shading);
        } else if (normalizedDepth < 0.8) {
            const t = (normalizedDepth - 0.5) / 0.3;
            r = 0;
            g = Math.floor((255 - t * 119) * shading);
            b = Math.floor(255 * shading);
        } else {
            const t = (normalizedDepth - 0.8) / 0.2;
            r = 0;
            g = Math.floor((136 - t * 136) * shading);
            b = Math.floor((255 - t * 119) * shading);
        }
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    worldToIsometric(x, y, z, angle) {
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        
        const rotX = x * cos - z * sin;
        const rotZ = x * sin + z * cos;
        
        const isoX = (rotX - rotZ) * Math.cos(Math.PI / 6);
        const isoY = (rotX + rotZ) * Math.sin(Math.PI / 6) - y;
        
        return { x: isoX, y: isoY };
    }

    createFullMapOverlay() {
        // Create full-screen overlay
        this.fullMapOverlay = document.createElement('div');
        this.fullMapOverlay.id = 'fullMapOverlay';
        this.fullMapOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 1000;
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        `;

        // Create canvas for full map
        this.fullMapCanvas = document.createElement('canvas');
        this.fullMapCanvas.width = 1200;
        this.fullMapCanvas.height = 800;
        this.fullMapCanvas.style.cssText = `
            border: 2px solid #00ffff;
            background: linear-gradient(to bottom, #003366 0%, #000066 100%);
        `;
        this.fullMapCtx = this.fullMapCanvas.getContext('2d');

        // Create controls
        const controls = document.createElement('div');
        controls.style.cssText = `
            margin-top: 20px;
            color: white;
            text-align: center;
            font-family: Arial, sans-serif;
        `;
        controls.innerHTML = `
            <h2 style="color: #00ffff; margin: 10px 0;">🗺️ Tactical Navigation Map</h2>
            <p><strong>Controls:</strong> Arrow Keys: Rotate View | +/- Keys: Zoom | Space: Center on Sub | ESC/M: Close</p>
            <p><strong>Legend:</strong> <span style="color: #ffff00;">Yellow = Submarine</span> | <span style="color: #ff0000;">Red = Contacts</span> | <span style="color: #00ff00;">Green = Allies</span></p>
            <p><strong>Display:</strong> Wireframe Mode - Clean tactical visualization without shading</p>
        `;

        this.fullMapOverlay.appendChild(this.fullMapCanvas);
        this.fullMapOverlay.appendChild(controls);
        document.body.appendChild(this.fullMapOverlay);
    }

    createMiniMap() {
        // Create mini-map container
        const miniMapContainer = document.createElement('div');
        miniMapContainer.id = 'miniMapContainer';
        miniMapContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: ${this.miniMapSize + 10}px;
            height: ${this.miniMapSize + 30}px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #00ffff;
            border-radius: 5px;
            z-index: 100;
            padding: 5px;
        `;

        // Create mini-map title
        const title = document.createElement('div');
        title.style.cssText = `
            color: #00ffff;
            font-size: 10px;
            text-align: center;
            margin-bottom: 5px;
            font-family: monospace;
        `;
        title.textContent = 'TACTICAL MAP';

        // Create mini-map canvas
        this.miniMapCanvas = document.createElement('canvas');
        this.miniMapCanvas.width = this.miniMapSize;
        this.miniMapCanvas.height = this.miniMapSize;
        this.miniMapCanvas.style.cssText = `
            background: linear-gradient(to bottom, #001122 0%, #000044 100%);
            border: 1px solid #004466;
        `;
        this.miniMapCtx = this.miniMapCanvas.getContext('2d');

        miniMapContainer.appendChild(title);
        miniMapContainer.appendChild(this.miniMapCanvas);
        document.body.appendChild(miniMapContainer);
    }

    setupKeyBindings() {
        document.addEventListener('keydown', (event) => {
            if (this.fullMapVisible) {
                // Full map controls
                switch (event.code) {
                    case 'ArrowLeft':
                        this.isometricSettings.viewAngle -= 10;
                        this.renderFullMap();
                        event.preventDefault();
                        break;
                    case 'ArrowRight':
                        this.isometricSettings.viewAngle += 10;
                        this.renderFullMap();
                        event.preventDefault();
                        break;
                    case 'Equal':
                    case 'NumpadAdd':
                        this.isometricSettings.verticalScale = Math.min(5.0, this.isometricSettings.verticalScale + 0.2);
                        this.renderFullMap();
                        console.log(`🔧 Vertical scale: ${this.isometricSettings.verticalScale.toFixed(1)}x`);
                        event.preventDefault();
                        break;
                    case 'Minus':
                    case 'NumpadSubtract':
                        this.isometricSettings.verticalScale = Math.max(0.5, this.isometricSettings.verticalScale - 0.2);
                        this.renderFullMap();
                        console.log(`🔧 Vertical scale: ${this.isometricSettings.verticalScale.toFixed(1)}x`);
                        event.preventDefault();
                        break;
                    case 'Space':
                        this.centerMapOnSubmarine();
                        event.preventDefault();
                        break;
                    case 'Escape':
                    case 'KeyM':
                        this.toggleFullMap();
                        event.preventDefault();
                        break;
                }
            } else {
                // Global key bindings
                if (event.code === 'KeyM') {
                    this.toggleFullMap();
                    event.preventDefault();
                }
            }
        });
    }

    toggleFullMap() {
        this.fullMapVisible = !this.fullMapVisible;
        
        if (this.fullMapVisible) {
            this.fullMapOverlay.style.display = 'flex';
            this.renderFullMap();
            console.log('🗺️ Full tactical map opened');
        } else {
            this.fullMapOverlay.style.display = 'none';
            console.log('🗺️ Full tactical map closed');
        }
    }

    centerMapOnSubmarine() {
        // Reset view to center on submarine
        this.isometricSettings.viewAngle = 45;
        this.isometricSettings.verticalScale = 2.0;
        this.renderFullMap();
        console.log('🎯 Map centered on submarine (wireframe mode)');
    }

    renderFullMap() {
        if (!this.fullMapVisible) return;

        const canvas = this.fullMapCanvas;
        const ctx = this.fullMapCtx;
        
        // Clear canvas
        ctx.fillStyle = 'linear-gradient(to bottom, #003366 0%, #000066 100%)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render terrain around submarine
        this.renderIsometricTerrain(ctx, canvas, 20000, this.isometricSettings.detailLevel); // 20km view

        // Add submarine
        this.drawSubmarineOnMap(ctx, canvas, 20000);

        // Add contacts
        this.drawContactsOnMap(ctx, canvas, 20000);
    }

    renderIsometricTerrain(ctx, canvas, viewRange, resolution) {
        const subPos = this.submarine.position;
        const step = viewRange / resolution;
        const scale = Math.min(canvas.width, canvas.height) / (viewRange * 1.5);
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.7;

        for (let i = 0; i < resolution - 1; i++) {
            for (let j = 0; j < resolution - 1; j++) {
                const worldX1 = subPos.x - viewRange/2 + (i * step);
                const worldZ1 = subPos.z - viewRange/2 + (j * step);
                const worldX2 = worldX1 + step;
                const worldZ2 = worldZ1 + step;

                const h1 = this.getHeightAtPosition(worldX1, worldZ1) * this.isometricSettings.verticalScale;
                const h2 = this.getHeightAtPosition(worldX2, worldZ1) * this.isometricSettings.verticalScale;
                const h3 = this.getHeightAtPosition(worldX1, worldZ2) * this.isometricSettings.verticalScale;
                const h4 = this.getHeightAtPosition(worldX2, worldZ2) * this.isometricSettings.verticalScale;

                // Project to isometric
                const p1 = this.worldToIsometric(worldX1 - subPos.x, h1, worldZ1 - subPos.z, this.isometricSettings.viewAngle);
                const p2 = this.worldToIsometric(worldX2 - subPos.x, h2, worldZ1 - subPos.z, this.isometricSettings.viewAngle);
                const p3 = this.worldToIsometric(worldX1 - subPos.x, h3, worldZ2 - subPos.z, this.isometricSettings.viewAngle);
                const p4 = this.worldToIsometric(worldX2 - subPos.x, h4, worldZ2 - subPos.z, this.isometricSettings.viewAngle);

                const screenP1 = { x: centerX + p1.x * scale, y: centerY + p1.y * scale };
                const screenP2 = { x: centerX + p2.x * scale, y: centerY + p2.y * scale };
                const screenP3 = { x: centerX + p3.x * scale, y: centerY + p3.y * scale };
                const screenP4 = { x: centerX + p4.x * scale, y: centerY + p4.y * scale };

                // WIREFRAME ONLY - no fill, just outline
                const avgHeight = (h1 + h2 + h3 + h4) / (4 * this.isometricSettings.verticalScale);
                
                ctx.strokeStyle = this.depthToColor(avgHeight, 0.8); // Slightly dimmed for wireframe
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(screenP1.x, screenP1.y);
                ctx.lineTo(screenP2.x, screenP2.y);
                ctx.lineTo(screenP4.x, screenP4.y);
                ctx.lineTo(screenP3.x, screenP3.y);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }

    drawSubmarineOnMap(ctx, canvas, viewRange) {
        const scale = Math.min(canvas.width, canvas.height) / (viewRange * 1.5);
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.7;

        // Submarine is at center of view
        const isoPos = this.worldToIsometric(0, this.submarine.position.y * this.isometricSettings.verticalScale, 0, this.isometricSettings.viewAngle);
        const screenX = centerX + isoPos.x * scale;
        const screenY = centerY + isoPos.y * scale;

        ctx.save();
        
        // Bright submarine marker
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 5;

        // Draw submarine
        ctx.beginPath();
        ctx.ellipse(screenX, screenY, 15, 5, this.isometricSettings.viewAngle * Math.PI / 180, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Heading indicator
        const headingLength = 25;
        const headingRad = this.submarine.rotation.y + this.isometricSettings.viewAngle * Math.PI / 180;
        const headingX = screenX + Math.cos(headingRad) * headingLength;
        const headingY = screenY + Math.sin(headingRad) * headingLength;
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(headingX, headingY);
        ctx.stroke();

        ctx.restore();
    }

    drawContactsOnMap(ctx, canvas, viewRange) {
        // Get sonar contacts from sealife system
        const sealifeSystem = window.sealifeSystem ? window.sealifeSystem() : null;
        if (!sealifeSystem) return;

        const contacts = sealifeSystem.getSonarContacts();
        if (!contacts || contacts.length === 0) return;

        const subPos = this.submarine.position;
        const scale = Math.min(canvas.width, canvas.height) / (viewRange * 1.5);
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.7;

        contacts.forEach((contact, index) => {
            const relativeX = contact.x - subPos.x;
            const relativeZ = contact.z - subPos.z;
            const relativeY = contact.y * this.isometricSettings.verticalScale;

            // Only draw contacts within view range
            if (Math.abs(relativeX) < viewRange/2 && Math.abs(relativeZ) < viewRange/2) {
                const isoPos = this.worldToIsometric(relativeX, relativeY, relativeZ, this.isometricSettings.viewAngle);
                const screenX = centerX + isoPos.x * scale;
                const screenY = centerY + isoPos.y * scale;

                ctx.save();

                // Color based on classification
                let color = '#ff0000'; // Default red for unknown
                if (contact.classification === 'ALLIED') color = '#00ff00';
                else if (contact.classification === 'NEUTRAL') color = '#ffff00';
                else if (contact.classification === 'HOSTILE') color = '#ff4444';

                ctx.fillStyle = color;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.shadowColor = '#000000';
                ctx.shadowBlur = 2;

                // Draw contact marker
                ctx.beginPath();
                ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();

                // Draw contact ID
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText((index + 1).toString(), screenX, screenY - 10);

                ctx.restore();
            }
        });
    }

    updateMiniMap() {
        const ctx = this.miniMapCtx;
        const canvas = this.miniMapCanvas;
        
        // Clear mini-map
        ctx.fillStyle = '#001122';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render 2x2km area around submarine
        this.renderMiniMapTerrain(ctx, canvas);
        this.drawSubmarineOnMiniMap(ctx, canvas);
        this.drawContactsOnMiniMap(ctx, canvas);
    }

    renderMiniMapTerrain(ctx, canvas) {
        const subPos = this.submarine.position;
        const range = this.miniMapRange; // 2km
        const resolution = 25; // Reduced resolution for wireframe performance
        const step = range / resolution;

        // Create wireframe grid lines
        ctx.strokeStyle = '#004466';
        ctx.lineWidth = 0.5;

        // Draw horizontal grid lines with depth-based colors
        for (let j = 0; j <= resolution; j++) {
            const worldZ = subPos.z - range/2 + (j * step);
            
            ctx.beginPath();
            for (let i = 0; i <= resolution; i++) {
                const worldX = subPos.x - range/2 + (i * step);
                const height = this.getHeightAtPosition(worldX, worldZ);
                
                const pixelX = (i / resolution) * canvas.width;
                const pixelY = (j / resolution) * canvas.height;
                
                if (i === 0) {
                    ctx.moveTo(pixelX, pixelY);
                } else {
                    ctx.lineTo(pixelX, pixelY);
                }
                
                // Set line color based on depth
                ctx.strokeStyle = this.depthToColor(height, 0.7);
            }
            ctx.stroke();
        }

        // Draw vertical grid lines with depth-based colors  
        for (let i = 0; i <= resolution; i++) {
            const worldX = subPos.x - range/2 + (i * step);
            
            ctx.beginPath();
            for (let j = 0; j <= resolution; j++) {
                const worldZ = subPos.z - range/2 + (j * step);
                const height = this.getHeightAtPosition(worldX, worldZ);
                
                const pixelX = (i / resolution) * canvas.width;
                const pixelY = (j / resolution) * canvas.height;
                
                if (j === 0) {
                    ctx.moveTo(pixelX, pixelY);
                } else {
                    ctx.lineTo(pixelX, pixelY);
                }
                
                // Set line color based on depth
                ctx.strokeStyle = this.depthToColor(height, 0.7);
            }
            ctx.stroke();
        }
    }

    drawSubmarineOnMiniMap(ctx, canvas) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.save();
        
        // Submarine marker
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Heading indicator
        const headingLength = 8;
        const headingX = centerX + Math.cos(this.submarine.rotation.y) * headingLength;
        const headingY = centerY + Math.sin(this.submarine.rotation.y) * headingLength;
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(headingX, headingY);
        ctx.stroke();

        ctx.restore();
    }

    drawContactsOnMiniMap(ctx, canvas) {
        const sealifeSystem = window.sealifeSystem ? window.sealifeSystem() : null;
        if (!sealifeSystem) return;

        const contacts = sealifeSystem.getSonarContacts();
        if (!contacts || contacts.length === 0) return;

        const subPos = this.submarine.position;
        const range = this.miniMapRange;

        contacts.forEach((contact) => {
            const relativeX = contact.x - subPos.x;
            const relativeZ = contact.z - subPos.z;

            // Only draw contacts within mini-map range
            if (Math.abs(relativeX) < range/2 && Math.abs(relativeZ) < range/2) {
                const screenX = (relativeX / range + 0.5) * canvas.width;
                const screenY = (relativeZ / range + 0.5) * canvas.height;

                ctx.save();

                // Color based on classification
                let color = '#ff0000';
                if (contact.classification === 'ALLIED') color = '#00ff00';
                else if (contact.classification === 'NEUTRAL') color = '#ffff00';
                else if (contact.classification === 'HOSTILE') color = '#ff4444';

                ctx.fillStyle = color;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.arc(screenX, screenY, 3, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            }
        });
    }

    // Called from game loop
    update() {
        // Update mini-map every frame
        this.updateMiniMap();

        // Update full map if visible
        if (this.fullMapVisible) {
            // Update less frequently for performance
            if (Date.now() - this.lastCacheUpdate > 100) { // 10 FPS for full map
                this.renderFullMap();
                this.lastCacheUpdate = Date.now();
            }
        }
    }

    // Cleanup
    destroy() {
        if (this.fullMapOverlay) {
            this.fullMapOverlay.remove();
        }
        
        const miniMapContainer = document.getElementById('miniMapContainer');
        if (miniMapContainer) {
            miniMapContainer.remove();
        }
        
        console.log('🗑️ Integrated mapping system destroyed');
    }
}

// Export for global use
window.IntegratedMappingSystem = IntegratedMappingSystem;