// Sub War 2060 - Ocean Environment Module

// Ocean class for underwater environment
class Ocean {
    constructor(scene) {
        this.scene = scene;
        this.seaFloor = null;
        this.waterPlane = null;
        this.kelp = [];
        this.rocks = [];
        this.debris = [];

        this.init();
    }

    init() {
        this.createSeaFloor();
        this.createWaterSurface();
        this.createKelpForest();
        this.createRockFormations();
        this.createDebris();
        this.setupEnvironmentLighting();
        console.log('Ocean environment initialized');
    }

    createSeaFloor() {
        // Simple working seabed using PlaneGeometry
        const seaFloorGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);

        // Add random height variations
        const vertices = seaFloorGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 2] += (Math.random() - 0.5) * 2; // Random height -1 to +1
        }
        seaFloorGeometry.attributes.position.needsUpdate = true;
        seaFloorGeometry.computeVertexNormals();

        const seaFloorMaterial = new THREE.MeshLambertMaterial({
            color: 0x8B4513, // Brown color
            side: THREE.DoubleSide
        });

        this.seaFloor = new THREE.Mesh(seaFloorGeometry, seaFloorMaterial);
        this.seaFloor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        this.seaFloor.position.y = -25; // Position at depth
        this.seaFloor.receiveShadow = true;
        this.seaFloor.name = 'seaFloor';
        this.scene.add(this.seaFloor);

        console.log('Created simple seabed with PlaneGeometry');
    }

    // Function to get seabed height at any world position
    getSeabedHeight(worldX, worldZ) {
        if (!this.heightmapData) return -200;

        // Convert world coordinates to heightmap coordinates
        const normalizedX = (worldX + this.terrainSize / 2) / this.terrainSize;
        const normalizedZ = (worldZ + this.terrainSize / 2) / this.terrainSize;

        // Clamp to heightmap bounds
        const x = Math.max(0, Math.min(this.heightmapSize - 1, Math.floor(normalizedX * this.heightmapSize)));
        const z = Math.max(0, Math.min(this.heightmapSize - 1, Math.floor(normalizedZ * this.heightmapSize)));

        const index = z * this.heightmapSize + x;
        return this.heightmapData[index] - 200; // Adjust for seaFloor position.y
    }

    generateHeightmap(width, height) {
        const data = new Float32Array(width * height);

        // Generate dramatic 1980s-style wireframe terrain
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x;

                // Normalize coordinates
                const nx = (x / (width - 1)) - 0.5;
                const ny = (y / (height - 1)) - 0.5;

                let elevation = 0;

                // Create dramatic mountain ridges (80s style) - MUCH higher
                const ridge1 = Math.abs(Math.sin(nx * Math.PI * 3)) * Math.exp(-(ny * ny) * 8) * 200;
                const ridge2 = Math.abs(Math.cos(ny * Math.PI * 2)) * Math.exp(-(nx * nx) * 6) * 180;
                const ridge3 = Math.abs(Math.sin((nx + ny) * Math.PI * 4)) * Math.exp(-((nx*nx + ny*ny) * 4)) * 160;

                elevation += ridge1 + ridge2 + ridge3;

                // Add fractal noise for surface detail with multiple octaves
                elevation += this.noise(nx * 8, ny * 8) * 50;
                elevation += this.noise(nx * 16, ny * 16) * 25;
                elevation += this.noise(nx * 32, ny * 32) * 15;
                elevation += this.noise(nx * 64, ny * 64) * 8;

                // Create deep valleys between ridges
                const valleyMask = 1 - Math.exp(-((nx*nx + ny*ny) * 2));
                elevation *= valleyMask;

                // Add massive dramatic peaks (80s mountain style)
                const peak1 = Math.exp(-((nx - 0.3) ** 2 + (ny - 0.2) ** 2) * 25) * 350;
                const peak2 = Math.exp(-((nx + 0.2) ** 2 + (ny + 0.3) ** 2) * 20) * 320;
                const peak3 = Math.exp(-((nx + 0.1) ** 2 + (ny - 0.4) ** 2) * 30) * 300;
                const peak4 = Math.exp(-((nx - 0.1) ** 2 + (ny + 0.1) ** 2) * 35) * 280;
                const peak5 = Math.exp(-((nx - 0.4) ** 2 + (ny + 0.4) ** 2) * 40) * 260;

                elevation += peak1 + peak2 + peak3 + peak4 + peak5;

                // Create MUCH DEEPER and interconnected canyon systems
                const trench1 = Math.exp(-(((nx + 0.4) ** 2) * 50 + ((ny - 0.1) ** 2) * 8)) * -500;
                const trench2 = Math.exp(-(((nx - 0.1) ** 2) * 8 + ((ny + 0.2) ** 2) * 40)) * -450;
                const trench3 = Math.exp(-(((nx + 0.2) ** 2) * 30 + ((ny - 0.3) ** 2) * 15)) * -400;
                const trench4 = Math.exp(-(((nx - 0.3) ** 2) * 25 + ((ny + 0.1) ** 2) * 20)) * -380;

                // Create interconnected canyon network
                const canyonNetwork1 = Math.exp(-(Math.pow(Math.abs(nx + ny), 2) * 40)) * -300;
                const canyonNetwork2 = Math.exp(-(Math.pow(Math.abs(nx - ny), 2) * 35)) * -280;

                elevation += trench1 + trench2 + trench3 + trench4 + canyonNetwork1 + canyonNetwork2;

                // Add deep pits and cave entrances
                const pit1 = Math.exp(-((nx - 0.15) ** 2 + (ny - 0.25) ** 2) * 100) * -200;
                const pit2 = Math.exp(-((nx + 0.25) ** 2 + (ny + 0.15) ** 2) * 120) * -180;
                const pit3 = Math.exp(-((nx + 0.05) ** 2 + (ny - 0.35) ** 2) * 80) * -160;

                elevation += pit1 + pit2 + pit3;

                // Base seafloor level
                elevation -= 60;

                data[index] = elevation;
            }
        }

        return data;
    }

    // Simple noise function for terrain generation
    noise(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return (n - Math.floor(n)) * 2 - 1;
    }

    createSeafloorTopography() {
        // Create detailed geological wireframe seafloor like ChatGPT image
        const vectorMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 1,
            transparent: true,
            opacity: 0.8
        });

        const topographyGroup = new THREE.Group();

        // Create multiple deep trenches with detailed geological layers
        const trenches = [
            { x: -600, z: 0, width: 300, length: 800, depth: 150 },
            { x: 400, z: -600, width: 200, length: 600, depth: 120 },
            { x: 0, z: 400, width: 250, length: 700, depth: 130 }
        ];

        trenches.forEach(trench => {
            // Create trench with multiple depth layers (like geological strata)
            for (let layer = 0; layer < 8; layer++) {
                const layerDepth = -50 - (layer / 7) * trench.depth;
                const layerWidth = trench.width * (1 - layer * 0.1);

                // Horizontal layer lines (geological strata)
                for (let i = 0; i <= 20; i++) {
                    const progress = i / 20;
                    const x = trench.x + (progress - 0.5) * trench.length;

                    const layerGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(x, layerDepth, trench.z - layerWidth/2),
                        new THREE.Vector3(x, layerDepth, trench.z + layerWidth/2)
                    ]);
                    const layerLine = new THREE.Line(layerGeometry, vectorMaterial);
                    topographyGroup.add(layerLine);
                }

                // Vertical cliff faces (trench walls)
                for (let i = 0; i <= 15; i++) {
                    const progress = i / 15;
                    const z = trench.z + (progress - 0.5) * layerWidth;

                    const leftWallGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(trench.x - trench.length/2, -50, z),
                        new THREE.Vector3(trench.x - trench.length/2, layerDepth, z)
                    ]);
                    const leftWall = new THREE.Line(leftWallGeometry, vectorMaterial);
                    topographyGroup.add(leftWall);

                    const rightWallGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(trench.x + trench.length/2, -50, z),
                        new THREE.Vector3(trench.x + trench.length/2, layerDepth, z)
                    ]);
                    const rightWall = new THREE.Line(rightWallGeometry, vectorMaterial);
                    topographyGroup.add(rightWall);
                }
            }

            // Add jagged crevasses within trenches
            for (let c = 0; c < 5; c++) {
                const crevX = trench.x + (Math.random() - 0.5) * trench.length * 0.8;
                const crevZ = trench.z + (Math.random() - 0.5) * trench.width * 0.6;
                const crevDepth = 30 + Math.random() * 40;

                // Create irregular crevasse shape
                const crevPoints = [];
                for (let p = 0; p < 8; p++) {
                    const angle = (p / 8) * Math.PI * 2;
                    const radius = 10 + Math.random() * 15;
                    crevPoints.push(new THREE.Vector3(
                        crevX + Math.cos(angle) * radius,
                        -50 - Math.random() * crevDepth,
                        crevZ + Math.sin(angle) * radius
                    ));
                }

                // Connect crevasse points
                for (let p = 0; p < crevPoints.length; p++) {
                    const next = (p + 1) % crevPoints.length;
                    const crevGeometry = new THREE.BufferGeometry().setFromPoints([
                        crevPoints[p],
                        crevPoints[next]
                    ]);
                    const crevLine = new THREE.Line(crevGeometry, vectorMaterial);
                    topographyGroup.add(crevLine);
                }
            }
        });

        // Create detailed seafloor plains with elevation contours
        for (let contourLevel = 0; contourLevel < 12; contourLevel++) {
            const elevation = -40 - contourLevel * 3;
            const contourSize = 1500 + contourLevel * 100;

            // Create irregular contour lines
            for (let ring = 0; ring < 3; ring++) {
                const points = [];
                const numPoints = 32;

                for (let i = 0; i <= numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    const radius = contourSize/2 + ring * 200 + Math.sin(angle * 4) * 50;
                    const noise = (Math.random() - 0.5) * 30; // Natural irregularity

                    points.push(new THREE.Vector3(
                        Math.cos(angle) * radius + noise,
                        elevation + Math.sin(angle * 6) * 5,
                        Math.sin(angle) * radius + noise
                    ));
                }

                const contourGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const contour = new THREE.Line(contourGeometry, vectorMaterial);
                topographyGroup.add(contour);
            }
        }

        // Add detailed rock formations and ridges
        for (let ridge = 0; ridge < 15; ridge++) {
            const ridgeX = (Math.random() - 0.5) * 1800;
            const ridgeZ = (Math.random() - 0.5) * 1800;
            const ridgeLength = 100 + Math.random() * 200;
            const ridgeHeight = 20 + Math.random() * 30;

            // Create jagged ridge profile
            const ridgePoints = [];
            for (let r = 0; r <= 20; r++) {
                const progress = r / 20;
                const x = ridgeX + (progress - 0.5) * ridgeLength;
                const height = -50 + Math.sin(progress * Math.PI) * ridgeHeight + (Math.random() - 0.5) * 10;
                ridgePoints.push(new THREE.Vector3(x, height, ridgeZ));
            }

            const ridgeGeometry = new THREE.BufferGeometry().setFromPoints(ridgePoints);
            const ridge = new THREE.Line(ridgeGeometry, vectorMaterial);
            topographyGroup.add(ridge);

            // Add cross-sectional detail lines
            for (let cross = 0; cross < ridgePoints.length - 1; cross++) {
                const crossGeometry = new THREE.BufferGeometry().setFromPoints([
                    ridgePoints[cross],
                    new THREE.Vector3(ridgePoints[cross].x, -50, ridgePoints[cross].z - 20),
                    new THREE.Vector3(ridgePoints[cross].x, -50, ridgePoints[cross].z + 20)
                ]);
                const crossLine = new THREE.Line(crossGeometry, vectorMaterial);
                topographyGroup.add(crossLine);
            }
        }

        topographyGroup.name = 'detailedSeafloorTopography';
        this.scene.add(topographyGroup);
        console.log('Detailed geological seafloor topography created (ChatGPT style)');
    }

    createWaterSurface() {
        // Create wireframe water surface grid (much larger to match terrain)
        const vectorMaterial = new THREE.LineBasicMaterial({
            color: 0x0099ff, // Blue tint for water
            linewidth: 1,
            transparent: true,
            opacity: 0.3
        });

        const surfaceGroup = new THREE.Group();
        const surfaceSize = 4000; // Match terrain size
        const surfaceDivisions = 50; // More divisions for detail

        // Surface grid lines
        for (let i = 0; i <= surfaceDivisions; i++) {
            const x = (i / surfaceDivisions) * surfaceSize - surfaceSize/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x, 0, -surfaceSize/2),
                new THREE.Vector3(x, 0, surfaceSize/2)
            ]);
            const line = new THREE.Line(geometry, vectorMaterial);
            surfaceGroup.add(line);
        }

        for (let i = 0; i <= surfaceDivisions; i++) {
            const z = (i / surfaceDivisions) * surfaceSize - surfaceSize/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-surfaceSize/2, 0, z),
                new THREE.Vector3(surfaceSize/2, 0, z)
            ]);
            const line = new THREE.Line(geometry, vectorMaterial);
            surfaceGroup.add(line);
        }

        this.waterPlane = surfaceGroup;
        this.waterPlane.position.y = 300; // Move to top of 3D scene (above highest peaks)
        this.waterPlane.name = 'waterSurface';
        this.scene.add(this.waterPlane);

        // Add a single thermocline for testing
        this.createSingleThermocline();
    }

    createKelpForest() {
        // Create wireframe kelp plants (simplified vector style)
        const vectorMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 1,
            transparent: true,
            opacity: 0.6
        });

        for (let i = 0; i < 15; i++) { // Reduced count for cleaner look
            const kelpGroup = new THREE.Group();
            const height = 6 + Math.random() * 4;

            // Main stem (vertical line)
            const stemGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, -25, 0),
                new THREE.Vector3(0, -25 + height, 0)
            ]);
            const stem = new THREE.Line(stemGeometry, vectorMaterial);
            kelpGroup.add(stem);

            // Simple fronds (angled lines)
            const frondCount = 3 + Math.floor(Math.random() * 3);
            for (let j = 0; j < frondCount; j++) {
                const frondHeight = 0 + (j + 1) * (height / frondCount); // Start from local seabed (0)
                const angle = j * Math.PI / 3;
                const frondLength = 0.8 + Math.random() * 0.4;

                const frondGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, frondHeight, 0),
                    new THREE.Vector3(
                        Math.cos(angle) * frondLength,
                        frondHeight + 0.3,
                        Math.sin(angle) * frondLength
                    )
                ]);
                const frond = new THREE.Line(frondGeometry, vectorMaterial);
                kelpGroup.add(frond);
            }

            // Random position locked to seabed
            const kelpX = (Math.random() - 0.5) * 1000; // Spread across larger area
            const kelpZ = (Math.random() - 0.5) * 1000;
            const kelpSeabedY = this.getSeabedHeight(kelpX, kelpZ);
            kelpGroup.position.set(kelpX, kelpSeabedY, kelpZ);
            kelpGroup.name = 'kelp';

            this.kelp.push(kelpGroup);
            this.scene.add(kelpGroup);
        }
    }

    createRockFormations() {
        // Create rocky outcrops on the sea floor
        for (let i = 0; i < 20; i++) {
            const rockGroup = new THREE.Group();

            // Main rock
            const rockGeometry = new THREE.SphereGeometry(
                1 + Math.random() * 2,
                8,
                6
            );

            // Deform the sphere to make it more rock-like
            const vertices = rockGeometry.attributes.position.array;
            for (let j = 0; j < vertices.length; j += 3) {
                const scale = 0.8 + Math.random() * 0.4;
                vertices[j] *= scale;
                vertices[j + 1] *= scale;
                vertices[j + 2] *= scale;
            }
            rockGeometry.attributes.position.needsUpdate = true;
            rockGeometry.computeVertexNormals();

            const rockMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });

            const rockEdges = new THREE.EdgesGeometry(rockGeometry);
            const rock = new THREE.LineSegments(rockEdges, rockMaterial);
            rock.position.y = 2; // Slightly above local seabed (group will be positioned correctly)
            rock.castShadow = true;
            rockGroup.add(rock);

            // Add smaller rocks around main rock
            for (let k = 0; k < 2 + Math.random() * 3; k++) {
                const smallRockGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.5);
                const smallRockEdges = new THREE.EdgesGeometry(smallRockGeometry);
                const smallRock = new THREE.LineSegments(smallRockEdges, rockMaterial);
                smallRock.position.set(
                    (Math.random() - 0.5) * 4,
                    2 + Math.random() * 0.5,
                    (Math.random() - 0.5) * 4
                );
                smallRock.castShadow = true;
                rockGroup.add(smallRock);
            }

            // Random position locked to seabed
            const rockX = (Math.random() - 0.5) * 1600; // Spread across larger terrain
            const rockZ = (Math.random() - 0.5) * 1600;
            const rockSeabedY = this.getSeabedHeight(rockX, rockZ);
            rockGroup.position.set(rockX, rockSeabedY, rockZ);
            rockGroup.name = 'rocks';

            this.rocks.push(rockGroup);
            this.scene.add(rockGroup);
        }
    }

    createDebris() {
        // Create sunken ship debris and other underwater objects
        const shipDebris = new THREE.Group();

        // Ship hull fragment
        const hullGeometry = new THREE.BoxGeometry(8, 2, 3);
        const hullMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const hullEdges = new THREE.EdgesGeometry(hullGeometry);
        const hull = new THREE.LineSegments(hullEdges, hullMaterial);
        hull.rotation.z = Math.PI / 6; // Tilted
        hull.position.y = -23;
        shipDebris.add(hull);

        // Broken mast
        const mastGeometry = new THREE.CylinderGeometry(0.1, 0.15, 6);
        const mastMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const mastEdges = new THREE.EdgesGeometry(mastGeometry);
        const mast = new THREE.LineSegments(mastEdges, mastMaterial);
        mast.position.set(2, -20, 0);
        mast.rotation.z = Math.PI / 4;
        shipDebris.add(mast);

        // Scattered barrels
        for (let i = 0; i < 5; i++) {
            const barrelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.6);
            const barrelMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
            const barrelEdges = new THREE.EdgesGeometry(barrelGeometry);
            const barrel = new THREE.LineSegments(barrelEdges, barrelMaterial);
            barrel.position.set(
                (Math.random() - 0.5) * 15,
                -24.5,
                (Math.random() - 0.5) * 10
            );
            barrel.rotation.x = Math.random() * Math.PI;
            barrel.rotation.z = Math.random() * Math.PI;
            shipDebris.add(barrel);
        }

        const debrisX = -500, debrisZ = 600;
        const debrisSeabedY = this.getSeabedHeight(debrisX, debrisZ);
        shipDebris.position.set(debrisX, debrisSeabedY + 2, debrisZ); // Slightly above seabed
        shipDebris.name = 'shipwreck';
        this.debris.push(shipDebris);
        this.scene.add(shipDebris);

        // Add some modern debris (containers, etc.)
        for (let i = 0; i < 8; i++) {
            const containerGeometry = new THREE.BoxGeometry(
                2 + Math.random() * 2,
                1 + Math.random(),
                1 + Math.random()
            );
            const containerMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.4)
            });
            const container = new THREE.Mesh(containerGeometry, containerMaterial);

            container.position.set(
                (Math.random() - 0.5) * 100,
                -24.5,
                (Math.random() - 0.5) * 100
            );
            container.rotation.y = Math.random() * Math.PI * 2;
            container.castShadow = true;
            container.name = 'debris';

            this.debris.push(container);
            this.scene.add(container);
        }
    }

    createUnderwaterBases() {
        // Create different types of underwater bases

        // 1. Bottom-set base (friendly research station)
        const researchBase = this.createBottomBase('Research Station Alpha', true);
        const researchX = -1200, researchZ = 800;
        const researchSeabedY = this.getSeabedHeight(researchX, researchZ);
        researchBase.position.set(researchX, researchSeabedY, researchZ);
        this.bases.push({
            type: 'bottom',
            name: 'Research Station Alpha',
            friendly: true,
            position: researchBase.position.clone(),
            mesh: researchBase,
            services: ['refuel', 'repair', 'resupply'],
            dockingRange: 15
        });
        this.scene.add(researchBase);

        // 2. Free-floating base (military outpost)
        const militaryBase = this.createFloatingBase('Military Outpost Bravo', true);
        const militaryX = 1000, militaryZ = -600;
        const militarySeabedY = this.getSeabedHeight(militaryX, militaryZ);
        militaryBase.position.set(militaryX, militarySeabedY + 30, militaryZ); // Float above seabed
        this.bases.push({
            type: 'floating',
            name: 'Military Outpost Bravo',
            friendly: true,
            position: militaryBase.position.clone(),
            mesh: militaryBase,
            services: ['refuel', 'repair', 'resupply', 'torpedoes'],
            dockingRange: 20
        });
        this.scene.add(militaryBase);

        // 3. Ice-suspended base (arctic listening post)
        const iceGeometry = new THREE.BoxGeometry(400, 30, 300);
        const iceMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
        });
        const iceEdges = new THREE.EdgesGeometry(iceGeometry);
        const icePack = new THREE.LineSegments(iceEdges, iceMaterial);
        const iceX = -300, iceZ = -1200;
        icePack.position.set(iceX, 5, iceZ); // At surface
        this.scene.add(icePack);

        const arcticBase = this.createIceSuspendedBase('Arctic Listening Post Charlie', true);
        arcticBase.position.set(iceX, 0, iceZ); // Just below surface
        this.bases.push({
            type: 'ice_suspended',
            name: 'Arctic Listening Post Charlie',
            friendly: true,
            position: arcticBase.position.clone(),
            mesh: arcticBase,
            services: ['intelligence', 'repair'],
            dockingRange: 12
        });
        this.scene.add(arcticBase);

        // 4. Enemy bottom base (hostile)
        const enemyBase = this.createBottomBase('Enemy Installation Delta', false);
        const enemyX = 800, enemyZ = 1200;
        const enemySeabedY = this.getSeabedHeight(enemyX, enemyZ);
        enemyBase.position.set(enemyX, enemySeabedY, enemyZ);
        this.bases.push({
            type: 'bottom',
            name: 'Enemy Installation Delta',
            friendly: false,
            position: enemyBase.position.clone(),
            mesh: enemyBase,
            services: [],
            dockingRange: 0,
            threat: true
        });
        this.scene.add(enemyBase);

        console.log(`Created ${this.bases.length} underwater bases`);
    }

    createBottomBase(name, friendly) {
        const baseGroup = new THREE.Group();
        baseGroup.name = name;

        // Main dome structure
        const domeGeometry = new THREE.SphereGeometry(8, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: friendly ? 0.8 : 0.6
        });
        const domeEdges = new THREE.EdgesGeometry(domeGeometry);
        const dome = new THREE.LineSegments(domeEdges, domeMaterial);
        dome.position.y = 4;
        baseGroup.add(dome);

        // Support pillars
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const pillarGeometry = new THREE.CylinderGeometry(0.8, 1.2, 8);
            const pillarMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: friendly ? 0.7 : 0.5
            });
            const pillarEdges = new THREE.EdgesGeometry(pillarGeometry);
            const pillar = new THREE.LineSegments(pillarEdges, pillarMaterial);
            pillar.position.set(
                Math.cos(angle) * 6,
                0,
                Math.sin(angle) * 6
            );
            baseGroup.add(pillar);
        }

        // Central tower
        const towerGeometry = new THREE.CylinderGeometry(2, 3, 12);
        const towerMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: friendly ? 0.9 : 0.7
        });
        const towerEdges = new THREE.EdgesGeometry(towerGeometry);
        const tower = new THREE.LineSegments(towerEdges, towerMaterial);
        tower.position.y = 6;
        baseGroup.add(tower);

        // Docking arms
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const armGeometry = new THREE.BoxGeometry(8, 0.5, 1);
            const armMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7
            });
            const armEdges = new THREE.EdgesGeometry(armGeometry);
            const arm = new THREE.LineSegments(armEdges, armMaterial);
            arm.position.set(
                Math.cos(angle) * 10,
                2,
                Math.sin(angle) * 10
            );
            arm.rotation.y = angle;
            baseGroup.add(arm);
        }

        // Status lights
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const lightGeometry = new THREE.SphereGeometry(0.3);
            const lightMaterial = new THREE.LineBasicMaterial({
                color: friendly ? 0x00ff00 : 0xff0000,
                transparent: true,
                opacity: 1.0
            });
            const lightEdges = new THREE.EdgesGeometry(lightGeometry);
            const light = new THREE.LineSegments(lightEdges, lightMaterial);
            light.position.set(
                Math.cos(angle) * 8.5,
                8,
                Math.sin(angle) * 8.5
            );
            baseGroup.add(light);
        }

        return baseGroup;
    }

    createFloatingBase(name, friendly) {
        const baseGroup = new THREE.Group();
        baseGroup.name = name;

        // Main hull (submarine-like)
        const hullGeometry = new THREE.CylinderGeometry(4, 4, 20);
        const hullMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: friendly ? 0.8 : 0.6
        });
        const hullEdges = new THREE.EdgesGeometry(hullGeometry);
        const hull = new THREE.LineSegments(hullEdges, hullMaterial);
        hull.rotation.z = Math.PI / 2;
        baseGroup.add(hull);

        // Command tower
        const towerGeometry = new THREE.BoxGeometry(3, 6, 4);
        const towerMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const towerEdges = new THREE.EdgesGeometry(towerGeometry);
        const tower = new THREE.LineSegments(towerEdges, towerMaterial);
        tower.position.y = 5;
        baseGroup.add(tower);

        // Stabilizer fins
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const finGeometry = new THREE.BoxGeometry(0.5, 4, 6);
            const finMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            const fin = new THREE.Mesh(finGeometry, finMaterial);
            fin.position.set(
                Math.cos(angle) * 4.5,
                Math.sin(angle) * 4.5,
                0
            );
            baseGroup.add(fin);
        }

        // Docking tube
        const tubeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 6);
        const tubeMaterial = new THREE.MeshLambertMaterial({
            color: friendly ? 0x0099ff : 0xff9900
        });
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tube.position.y = -6;
        baseGroup.add(tube);

        // Navigation lights
        const lightPositions = [
            {x: 10, y: 2, color: friendly ? 0x00ff00 : 0xff0000},
            {x: -10, y: 2, color: friendly ? 0xff0000 : 0x00ff00},
            {x: 0, y: 8, color: 0xffffff}
        ];

        lightPositions.forEach(pos => {
            const lightGeometry = new THREE.SphereGeometry(0.4);
            const lightMaterial = new THREE.MeshBasicMaterial({ color: pos.color });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(pos.x, pos.y, 0);
            baseGroup.add(light);
        });

        return baseGroup;
    }

    createIceSuspendedBase(name, friendly) {
        const baseGroup = new THREE.Group();
        baseGroup.name = name;

        // Main pressure sphere
        const sphereGeometry = new THREE.SphereGeometry(5);
        const sphereMaterial = new THREE.MeshLambertMaterial({
            color: friendly ? 0x4466bb : 0xbb6644,
            transparent: true,
            opacity: 0.9
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.y = -8;
        baseGroup.add(sphere);

        // Support cables/tethers
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const cableGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8);
            const cableMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
            const cable = new THREE.Mesh(cableGeometry, cableMaterial);
            cable.position.set(
                Math.cos(angle) * 3,
                -4,
                Math.sin(angle) * 3
            );
            baseGroup.add(cable);
        }

        // Equipment pods
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
            const podGeometry = new THREE.CylinderGeometry(1.5, 1.5, 4);
            const podMaterial = new THREE.MeshLambertMaterial({
                color: friendly ? 0x336699 : 0x996633
            });
            const pod = new THREE.Mesh(podGeometry, podMaterial);
            pod.position.set(
                Math.cos(angle) * 6,
                -10,
                Math.sin(angle) * 6
            );
            pod.rotation.z = Math.PI / 2;
            baseGroup.add(pod);
        }

        // Antenna array
        const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3);
        const antennaMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        for (let i = 0; i < 6; i++) {
            const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
            antenna.position.set(
                (Math.random() - 0.5) * 4,
                -3,
                (Math.random() - 0.5) * 4
            );
            antenna.rotation.x = (Math.random() - 0.5) * 0.5;
            antenna.rotation.z = (Math.random() - 0.5) * 0.5;
            baseGroup.add(antenna);
        }

        // Status beacon
        const beaconGeometry = new THREE.SphereGeometry(0.5);
        const beaconMaterial = new THREE.MeshBasicMaterial({
            color: friendly ? 0x00ffff : 0xff8800
        });
        const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
        beacon.position.y = -2;
        baseGroup.add(beacon);

        return baseGroup;
    }

    createSingleThermocline() {
        // Create a single simple thermocline layer for testing
        const thermoclineMaterial = new THREE.LineBasicMaterial({
            color: 0x66aaff, // Light blue for temperature layers
            linewidth: 1,
            transparent: true,
            opacity: 0.5
        });

        const thermoclineGroup = new THREE.Group();
        const baseDepth = 50; // Base depth for thermocline
        const size = 2000; // Smaller size for testing
        const divisions = 20; // Simple grid

        // Store thermocline data for animation
        this.thermoclineData = {
            group: thermoclineGroup,
            baseDepth: baseDepth,
            size: size,
            divisions: divisions,
            lines: []
        };

        // Create horizontal grid lines
        for (let i = 0; i <= divisions; i++) {
            const x = (i / divisions) * size - size/2;
            const points = [];
            for (let j = 0; j <= divisions; j++) {
                const z = (j / divisions) * size - size/2;
                points.push(new THREE.Vector3(x, baseDepth, z));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, thermoclineMaterial);
            thermoclineGroup.add(line);
            this.thermoclineData.lines.push({line: line, type: 'horizontal', index: i, geometry: geometry});
        }

        // Create vertical grid lines
        for (let i = 0; i <= divisions; i++) {
            const z = (i / divisions) * size - size/2;
            const points = [];
            for (let j = 0; j <= divisions; j++) {
                const x = (j / divisions) * size - size/2;
                points.push(new THREE.Vector3(x, baseDepth, z));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, thermoclineMaterial);
            thermoclineGroup.add(line);
            this.thermoclineData.lines.push({line: line, type: 'vertical', index: i, geometry: geometry});
        }

        thermoclineGroup.name = 'single_thermocline';
        this.scene.add(thermoclineGroup);
        console.log('Single undulating thermocline created at depth', baseDepth);
    }

    createThermoclines() {
        // Create thermocline layers (simplified for debugging)
        const thermoclineMaterial = new THREE.LineBasicMaterial({
            color: 0x66aaff, // Light blue for temperature layers
            linewidth: 1,
            transparent: true,
            opacity: 0.4
        });

        const thermoclineGroup = new THREE.Group();
        const layers = [-20, -80, -150, -300];

        // Create simple horizontal grid layers
        layers.forEach((depth, index) => {
            for (let x = -1500; x <= 1500; x += 300) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(x, depth, -1500),
                    new THREE.Vector3(x, depth, 1500)
                ]);
                const line = new THREE.Line(geometry, thermoclineMaterial);
                thermoclineGroup.add(line);
            }

            for (let z = -1500; z <= 1500; z += 300) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-1500, depth, z),
                    new THREE.Vector3(1500, depth, z)
                ]);
                const line = new THREE.Line(geometry, thermoclineMaterial);
                thermoclineGroup.add(line);
            }
        });

        thermoclineGroup.name = 'thermoclines';
        this.scene.add(thermoclineGroup);
        console.log('Thermoclines created');
    }

    createUnderwaterCaves() {
        // Create underwater cave systems
        const caveMaterial = new THREE.LineBasicMaterial({
            color: 0x444444, // Dark grey for cave walls
            linewidth: 1,
            transparent: true,
            opacity: 0.8
        });

        const caveGroup = new THREE.Group();

        // Define cave locations near deep canyons and cliffs
        const caveLocations = [
            { x: -800, z: 200, depth: -150, size: 40, tunnels: 3 },
            { x: 400, z: -600, depth: -120, size: 35, tunnels: 4 },
            { x: -300, z: 800, depth: -180, size: 50, tunnels: 5 },
            { x: 600, z: 300, depth: -200, size: 45, tunnels: 3 },
            { x: -1000, z: -400, depth: -170, size: 30, tunnels: 2 }
        ];

        // Simplified caves for now to avoid JS errors - will create basic cave chambers
        caveLocations.forEach((cave, caveIndex) => {
            const caveSystem = new THREE.Group();

            // Create main cave chamber (ellipsoid wireframe)
            const chamberGeometry = new THREE.SphereGeometry(cave.size, 12, 8);
            chamberGeometry.scale(1, 0.6, 1.5);
            const chamberEdges = new THREE.EdgesGeometry(chamberGeometry);
            const chamber = new THREE.LineSegments(chamberEdges, caveMaterial);
            chamber.position.y = cave.depth;
            caveSystem.add(chamber);

            caveSystem.position.set(cave.x, 0, cave.z);
            caveSystem.name = `underwater_cave_${caveIndex}`;
            caveGroup.add(caveSystem);
        });

        caveGroup.name = 'underwaterCaves';
        this.scene.add(caveGroup);
        console.log('Underwater cave systems created');
    }

    setupEnvironmentLighting() {
        // Add underwater lighting effects

        // Dim ambient light for underwater feel
        const existingAmbient = this.scene.getObjectByName('ambientLight');
        if (existingAmbient) {
            existingAmbient.intensity = 0.2; // Very dim ambient
        }

        // Add blue-tinted directional light from above (sunlight filtering through water)
        const underwaterLight = new THREE.DirectionalLight(0x4466aa, 0.6);
        underwaterLight.position.set(0, 10, 0);
        underwaterLight.target.position.set(0, -10, 0);
        underwaterLight.castShadow = true;
        underwaterLight.name = 'underwaterLight';
        this.scene.add(underwaterLight);
        this.scene.add(underwaterLight.target);

        // Add some point lights for mysterious depth lighting
        for (let i = 0; i < 3; i++) {
            const depthLight = new THREE.PointLight(0x00ffff, 0.3, 20);
            depthLight.position.set(
                (Math.random() - 0.5) * 80,
                -15 - Math.random() * 5,
                (Math.random() - 0.5) * 80
            );
            depthLight.name = 'depthLight';
            this.scene.add(depthLight);
        }
    }

    update(deltaTime) {
        // Animate kelp swaying
        this.kelp.forEach((kelpGroup, index) => {
            if (kelpGroup.children) {
                kelpGroup.children.forEach((frond, frondIndex) => {
                    if (frond.type === 'Mesh' && frond.geometry.type === 'PlaneGeometry') {
                        frond.rotation.z = Math.sin(Date.now() * 0.001 + index + frondIndex) * 0.1;
                    }
                });
            }
        });

        // Gentle water surface animation (now at top of scene)
        if (this.waterPlane) {
            this.waterPlane.position.y = 300 + Math.sin(Date.now() * 0.0005) * 0.2;
        }

        // Animate thermocline undulation
        if (this.thermoclineData) {
            const time = Date.now() * 0.0003; // Very slow undulation
            const waveAmplitude = 8; // Gentle wave height

            this.thermoclineData.lines.forEach((lineData, lineIndex) => {
                const positions = lineData.geometry.attributes.position.array;

                // Update each point in the line
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i];
                    const z = positions[i + 2];

                    // Create slow, gentle waves
                    const wave1 = Math.sin(time + x * 0.003 + z * 0.002) * waveAmplitude;
                    const wave2 = Math.cos(time * 0.7 + x * 0.002 - z * 0.003) * waveAmplitude * 0.6;

                    positions[i + 1] = this.thermoclineData.baseDepth + wave1 + wave2;
                }

                lineData.geometry.attributes.position.needsUpdate = true;
            });
        }
    }

    getBases() {
        return this.bases;
    }

    cleanup() {
        // Clean up ocean environment objects
        [...this.kelp, ...this.rocks, ...this.debris, ...this.bases].forEach(obj => {
            const meshToRemove = obj.mesh || obj;
            if (meshToRemove && meshToRemove.parent) {
                meshToRemove.parent.remove(meshToRemove);
            }
            // Dispose of geometries and materials
            if (meshToRemove && meshToRemove.traverse) {
                meshToRemove.traverse((child) => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => mat.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
            }
        });

        if (this.seaFloor) {
            this.scene.remove(this.seaFloor);
            this.seaFloor.geometry.dispose();
            this.seaFloor.material.dispose();
        }

        if (this.waterPlane) {
            this.scene.remove(this.waterPlane);
            this.waterPlane.geometry.dispose();
            this.waterPlane.material.dispose();
        }
    }

    // New terrain generation method for varied seabed
    generateVariedHeightmap(width, height) {
        const data = new Float32Array(width * height);

        // Generate much more varied terrain with seamounts, canyons, and abyssal plains
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x;

                // Normalize coordinates
                const nx = (x / (width - 1)) - 0.5;
                const ny = (y / (height - 1)) - 0.5;
                const distance = Math.sqrt(nx * nx + ny * ny);

                let elevation = 0;

                // Base ocean floor - deeper for realism
                elevation = -800;

                // Create major seamount chains (that reach surface)
                const seamount1 = Math.exp(-((nx - 0.2) ** 2 + (ny + 0.1) ** 2) * 15) * 1200; // Breaks surface
                const seamount2 = Math.exp(-((nx + 0.3) ** 2 + (ny - 0.2) ** 2) * 20) * 1100; // Breaks surface
                const seamount3 = Math.exp(-((nx + 0.1) ** 2 + (ny + 0.3) ** 2) * 18) * 1000; // Breaks surface

                // Underwater mountains (don't break surface)
                const mountain1 = Math.exp(-((nx - 0.4) ** 2 + (ny - 0.1) ** 2) * 12) * 600;
                const mountain2 = Math.exp(-((nx + 0.2) ** 2 + (ny + 0.1) ** 2) * 14) * 550;
                const mountain3 = Math.exp(-((nx - 0.1) ** 2 + (ny - 0.3) ** 2) * 16) * 500;

                elevation += seamount1 + seamount2 + seamount3 + mountain1 + mountain2 + mountain3;

                // Create deep interconnected canyon system
                const canyon1 = Math.exp(-(Math.pow(Math.abs(nx + 0.4), 4) + Math.pow(Math.abs(ny - 0.2), 2)) * 8) * -600;
                const canyon2 = Math.exp(-(Math.pow(Math.abs(nx - 0.3), 2) + Math.pow(Math.abs(ny + 0.3), 4)) * 10) * -550;
                const canyon3 = Math.exp(-(Math.pow(Math.abs(nx + ny + 0.1), 2) * 12)) * -500;
                const canyon4 = Math.exp(-(Math.pow(Math.abs(nx - ny - 0.2), 2) * 15)) * -480;

                // Interconnected canyon network
                const networkCanyon1 = Math.exp(-(Math.pow(Math.sin(nx * 4 + ny * 2), 2) * 8)) * -400;
                const networkCanyon2 = Math.exp(-(Math.pow(Math.cos(nx * 2 + ny * 4), 2) * 10)) * -350;

                elevation += canyon1 + canyon2 + canyon3 + canyon4 + networkCanyon1 + networkCanyon2;

                // Abyssal plains (very deep flat areas)
                const abyssal1 = Math.exp(-((nx + 0.35) ** 2 + (ny - 0.35) ** 2) * 3) * -400;
                const abyssal2 = Math.exp(-((nx - 0.35) ** 2 + (ny + 0.35) ** 2) * 4) * -350;

                elevation += abyssal1 + abyssal2;

                // Add fractal noise for realistic detail
                elevation += this.noise(nx * 4, ny * 4) * 80;
                elevation += this.noise(nx * 8, ny * 8) * 40;
                elevation += this.noise(nx * 16, ny * 16) * 20;
                elevation += this.noise(nx * 32, ny * 32) * 10;

                data[index] = elevation;
            }
        }

        return data;
    }

    // Generate terrain chunks for LOD rendering
    generateAllTerrainChunks(wireframeMaterial) {
        for (let chunkZ = 0; chunkZ < this.chunksPerSide; chunkZ++) {
            for (let chunkX = 0; chunkX < this.chunksPerSide; chunkX++) {
                const chunkGroup = this.generateTerrainChunk(chunkX, chunkZ, wireframeMaterial);
                const chunkKey = `${chunkX}_${chunkZ}`;
                this.terrainChunks.set(chunkKey, {
                    group: chunkGroup,
                    visible: false,
                    centerX: (chunkX * this.chunkSize + this.chunkSize / 2) * (this.terrainSize / this.gridSize) - this.terrainSize / 2,
                    centerZ: (chunkZ * this.chunkSize + this.chunkSize / 2) * (this.terrainSize / this.gridSize) - this.terrainSize / 2
                });
            }
        }
    }

    // Generate individual terrain chunk
    generateTerrainChunk(chunkX, chunkZ, wireframeMaterial) {
        const chunkGroup = new THREE.Group();

        const startX = chunkX * this.chunkSize;
        const startZ = chunkZ * this.chunkSize;
        const endX = Math.min(startX + this.chunkSize, this.gridSize);
        const endZ = Math.min(startZ + this.chunkSize, this.gridSize);

        // Create horizontal grid lines for this chunk
        for (let z = startZ; z <= endZ; z++) {
            const points = [];
            for (let x = startX; x <= endX; x++) {
                const worldX = (x / this.gridSize) * this.terrainSize - this.terrainSize / 2;
                const worldZ = (z / this.gridSize) * this.terrainSize - this.terrainSize / 2;
                const height = this.heightData[z * (this.gridSize + 1) + x];
                points.push(new THREE.Vector3(worldX, height, worldZ));
            }

            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                chunkGroup.add(line);
            }
        }

        // Create vertical grid lines for this chunk
        for (let x = startX; x <= endX; x++) {
            const points = [];
            for (let z = startZ; z <= endZ; z++) {
                const worldX = (x / this.gridSize) * this.terrainSize - this.terrainSize / 2;
                const worldZ = (z / this.gridSize) * this.terrainSize - this.terrainSize / 2;
                const height = this.heightData[z * (this.gridSize + 1) + x];
                points.push(new THREE.Vector3(worldX, height, worldZ));
            }

            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                chunkGroup.add(line);
            }
        }

        return chunkGroup;
    }

    // Create seamounts that reach the surface as islands
    createSeamounts(wireframeMaterial) {
        const seamountPositions = [
            { x: 4000, z: -2000, height: 1200, radius: 800 },
            { x: -6000, z: 4000, height: 1100, radius: 900 },
            { x: -2000, z: -6000, height: 1000, radius: 700 }
        ];

        seamountPositions.forEach(seamount => {
            // Create seamount wireframe structure
            const seamountGroup = new THREE.Group();

            // Create circular contour lines at different heights
            for (let level = 0; level < 10; level++) {
                const height = seamount.height * (level / 10) - 200;
                const radius = seamount.radius * (1 - level * 0.08);

                const points = [];
                for (let i = 0; i <= 32; i++) {
                    const angle = (i / 32) * Math.PI * 2;
                    const x = seamount.x + Math.cos(angle) * radius;
                    const z = seamount.z + Math.sin(angle) * radius;
                    points.push(new THREE.Vector3(x, height, z));
                }

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                seamountGroup.add(line);

                // Add radial lines
                if (level % 2 === 0) {
                    for (let i = 0; i < 8; i++) {
                        const angle = (i / 8) * Math.PI * 2;
                        const radialPoints = [
                            new THREE.Vector3(seamount.x, height, seamount.z),
                            new THREE.Vector3(
                                seamount.x + Math.cos(angle) * radius,
                                height,
                                seamount.z + Math.sin(angle) * radius
                            )
                        ];

                        const radialGeometry = new THREE.BufferGeometry().setFromPoints(radialPoints);
                        const radialLine = new THREE.Line(radialGeometry, wireframeMaterial);
                        seamountGroup.add(radialLine);
                    }
                }
            }

            // Create surface island wireframe (above water level)
            const islandRadius = seamount.radius * 0.3;
            for (let level = 0; level < 5; level++) {
                const height = 50 + level * 20; // Above water surface
                const radius = islandRadius * (1 - level * 0.15);

                const points = [];
                for (let i = 0; i <= 16; i++) {
                    const angle = (i / 16) * Math.PI * 2;
                    const x = seamount.x + Math.cos(angle) * radius;
                    const z = seamount.z + Math.sin(angle) * radius;
                    points.push(new THREE.Vector3(x, height, z));
                }

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, wireframeMaterial);
                seamountGroup.add(line);
            }

            this.seaFloor.add(seamountGroup);
        });
    }

    // Create deep intertwining canyon system
    createCanyonSystem(wireframeMaterial) {
        const canyonGroup = new THREE.Group();

        // Define major canyon paths
        const canyons = [
            {
                path: [
                    { x: -8000, z: -6000 }, { x: -4000, z: -2000 },
                    { x: 0, z: 2000 }, { x: 4000, z: 6000 }
                ],
                width: 600,
                depth: 800
            },
            {
                path: [
                    { x: 6000, z: -8000 }, { x: 2000, z: -4000 },
                    { x: -2000, z: 0 }, { x: -6000, z: 4000 }
                ],
                width: 500,
                depth: 700
            },
            {
                path: [
                    { x: -6000, z: 8000 }, { x: -2000, z: 4000 },
                    { x: 2000, z: 0 }, { x: 6000, z: -4000 }
                ],
                width: 450,
                depth: 650
            }
        ];

        canyons.forEach((canyon, canyonIndex) => {
            // Create canyon walls and floor
            for (let i = 0; i < canyon.path.length - 1; i++) {
                const start = canyon.path[i];
                const end = canyon.path[i + 1];

                const dx = end.x - start.x;
                const dz = end.z - start.z;
                const length = Math.sqrt(dx * dx + dz * dz);
                const steps = Math.ceil(length / 200); // Detail level

                for (let step = 0; step <= steps; step++) {
                    const t = step / steps;
                    const x = start.x + dx * t;
                    const z = start.z + dz * t;

                    // Create canyon cross-section
                    const canyonDepth = -200 - canyon.depth * (1 - Math.abs(t - 0.5) * 2) * 0.8;

                    // Canyon walls
                    const wallPoints = [];
                    for (let side = -1; side <= 1; side += 2) {
                        const perpX = -dz / length * canyon.width * 0.5 * side;
                        const perpZ = dx / length * canyon.width * 0.5 * side;

                        // Wall from surface to floor
                        for (let h = 0; h >= canyonDepth; h -= 100) {
                            wallPoints.push(new THREE.Vector3(x + perpX, h, z + perpZ));
                        }

                        if (wallPoints.length > 1) {
                            const wallGeometry = new THREE.BufferGeometry().setFromPoints(wallPoints);
                            const wallLine = new THREE.Line(wallGeometry, wireframeMaterial);
                            canyonGroup.add(wallLine);
                            wallPoints.length = 0;
                        }
                    }

                    // Canyon floor cross-section
                    if (step % 3 === 0) {
                        const floorPoints = [];
                        for (let w = -1; w <= 1; w += 0.5) {
                            const perpX = -dz / length * canyon.width * 0.3 * w;
                            const perpZ = dx / length * canyon.width * 0.3 * w;
                            floorPoints.push(new THREE.Vector3(x + perpX, canyonDepth, z + perpZ));
                        }

                        const floorGeometry = new THREE.BufferGeometry().setFromPoints(floorPoints);
                        const floorLine = new THREE.Line(floorGeometry, wireframeMaterial);
                        canyonGroup.add(floorLine);
                    }
                }
            }
        });

        this.seaFloor.add(canyonGroup);
    }

    // Update terrain visibility based on player position (LOD culling)
    updateTerrainLOD(playerPosition) {
        if (!this.terrainChunks || !playerPosition) return;

        // Debug: Log first time to verify it's being called
        if (!this.lodDebugLogged) {
            console.log(`LOD: Player at ${playerPosition.x.toFixed(1)}, ${playerPosition.z.toFixed(1)}, draw distance: ${this.drawDistance}m`);
            this.lodDebugLogged = true;
        }

        this.terrainChunks.forEach((chunk, key) => {
            const distance = Math.sqrt(
                (playerPosition.x - chunk.centerX) ** 2 +
                (playerPosition.z - chunk.centerZ) ** 2
            );

            const shouldBeVisible = distance <= this.drawDistance;

            if (shouldBeVisible && !chunk.visible) {
                this.seaFloor.add(chunk.group);
                chunk.visible = true;
            } else if (!shouldBeVisible && chunk.visible) {
                this.seaFloor.remove(chunk.group);
                chunk.visible = false;
            }
        });
    }
}

// Global ocean instance
let oceanEnvironment = null;

// Initialize ocean environment
function initOcean(scene) {
    if (oceanEnvironment) {
        oceanEnvironment.cleanup();
    }
    oceanEnvironment = new Ocean(scene);
    // Make ocean instance globally available for collision detection
    window.oceanInstance = oceanEnvironment;
    console.log('Ocean module loaded and initialized');
    return oceanEnvironment;
}

// Update ocean environment
function updateOcean(deltaTime) {
    if (oceanEnvironment) {
        oceanEnvironment.update(deltaTime);
        // Update terrain LOD based on player position
        if (window.playerSubmarine && window.playerSubmarine()) {
            const submarine = window.playerSubmarine();
            if (submarine && submarine.mesh) {
                oceanEnvironment.updateTerrainLOD(submarine.mesh.position);
            }
        }
    }
}

// Get ocean bases
function getOceanBases() {
    return oceanEnvironment ? oceanEnvironment.getBases() : [];
}

// Export functions
window.initOcean = initOcean;
window.updateOcean = updateOcean;
window.getOceanBases = getOceanBases;
window.oceanEnvironment = () => oceanEnvironment;
