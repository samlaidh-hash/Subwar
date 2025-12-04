// Sub War 2060 - Simple Ocean Environment Module

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

    createWaterSurface() {
        const waterGeometry = new THREE.PlaneGeometry(300, 300);
        const waterMaterial = new THREE.MeshLambertMaterial({
            color: 0x006699,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });

        this.waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
        this.waterPlane.rotation.x = -Math.PI / 2;
        this.waterPlane.position.y = 5; // Surface level
        this.waterPlane.name = 'waterSurface';
        this.scene.add(this.waterPlane);
    }

    createKelpForest() {
        const kelpMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });

        for (let i = 0; i < 30; i++) {
            const kelpGroup = new THREE.Group();

            // Kelp stem
            const stemGeometry = new THREE.CylinderGeometry(0.1, 0.2, 8);
            const stem = new THREE.Mesh(stemGeometry, kelpMaterial);
            stem.position.y = 4;
            kelpGroup.add(stem);

            // Kelp fronds
            for (let j = 0; j < 5; j++) {
                const frondGeometry = new THREE.PlaneGeometry(1, 2);
                const frondMaterial = new THREE.MeshLambertMaterial({
                    color: 0x32CD32,
                    side: THREE.DoubleSide
                });
                const frond = new THREE.Mesh(frondGeometry, frondMaterial);
                frond.position.set(
                    (Math.random() - 0.5) * 2,
                    2 + j * 1.5,
                    (Math.random() - 0.5) * 2
                );
                frond.rotation.y = Math.random() * Math.PI;
                kelpGroup.add(frond);
            }

            kelpGroup.position.set(
                (Math.random() - 0.5) * 180,
                -25,
                (Math.random() - 0.5) * 180
            );
            kelpGroup.name = 'kelp';
            this.scene.add(kelpGroup);
            this.kelp.push(kelpGroup);
        }
    }

    createRockFormations() {
        const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });

        for (let i = 0; i < 20; i++) {
            const rockGroup = new THREE.Group();

            // Main rock
            const rockGeometry = new THREE.SphereGeometry(2, 8, 6);
            // Deform the sphere
            const vertices = rockGeometry.attributes.position.array;
            for (let j = 0; j < vertices.length; j += 3) {
                const factor = 0.5 + Math.random() * 0.5;
                vertices[j] *= factor;
                vertices[j + 1] *= factor;
                vertices[j + 2] *= factor;
            }
            rockGeometry.attributes.position.needsUpdate = true;
            rockGeometry.computeVertexNormals();

            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.castShadow = true;
            rockGroup.add(rock);

            // Small rocks around it
            for (let k = 0; k < 3; k++) {
                const smallRockGeometry = new THREE.SphereGeometry(0.5, 6, 4);
                const smallRock = new THREE.Mesh(smallRockGeometry, rockMaterial);
                smallRock.position.set(
                    (Math.random() - 0.5) * 8,
                    Math.random() * 2,
                    (Math.random() - 0.5) * 8
                );
                smallRock.castShadow = true;
                rockGroup.add(smallRock);
            }

            rockGroup.position.set(
                (Math.random() - 0.5) * 160,
                -24,
                (Math.random() - 0.5) * 160
            );
            rockGroup.name = 'rocks';
            this.scene.add(rockGroup);
            this.rocks.push(rockGroup);
        }
    }

    createDebris() {
        // Shipwreck at specific location
        const wreckGroup = new THREE.Group();

        // Hull
        const hullGeometry = new THREE.BoxGeometry(15, 3, 4);
        const hullMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        hull.rotation.z = 0.3; // Tilted
        wreckGroup.add(hull);

        // Mast
        const mastGeometry = new THREE.CylinderGeometry(0.2, 0.3, 10);
        const mast = new THREE.Mesh(mastGeometry, hullMaterial);
        mast.position.set(0, 5, 0);
        mast.rotation.x = 0.5; // Broken
        wreckGroup.add(mast);

        wreckGroup.position.set(-30, -23, 40);
        wreckGroup.name = 'shipwreck';
        this.scene.add(wreckGroup);

        // Scattered debris
        for (let i = 0; i < 8; i++) {
            const debrisGeometry = new THREE.BoxGeometry(2, 2, 1);
            const debrisMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
            });
            const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
            debris.position.set(
                (Math.random() - 0.5) * 200,
                -24,
                (Math.random() - 0.5) * 200
            );
            debris.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            debris.name = 'debris';
            debris.castShadow = true;
            this.scene.add(debris);
            this.debris.push(debris);
        }
    }

    setupEnvironmentLighting() {
        // Ambient light (dimmed for underwater)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // Directional light (underwater sunlight)
        const directionalLight = new THREE.DirectionalLight(0x4466aa, 0.6);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.name = 'underwaterLight';
        this.scene.add(directionalLight);

        // Point lights for depth atmosphere
        for (let i = 0; i < 3; i++) {
            const pointLight = new THREE.PointLight(0x00ffff, 0.3, 20);
            pointLight.position.set(
                (Math.random() - 0.5) * 100,
                -15 - Math.random() * 5,
                (Math.random() - 0.5) * 100
            );
            pointLight.name = 'depthLight';
            this.scene.add(pointLight);
        }
    }

    update(deltaTime) {
        // Animate kelp fronds
        this.kelp.forEach((kelpGroup, index) => {
            const fronds = kelpGroup.children.slice(1); // Skip stem
            fronds.forEach((frond, frondIndex) => {
                frond.rotation.z = Math.sin(Date.now() * 0.001 + index + frondIndex) * 0.1;
            });
        });

        // Animate water surface
        if (this.waterPlane) {
            this.waterPlane.position.y = 5 + Math.sin(Date.now() * 0.0005) * 0.2;
        }
    }

    // Simple seabed height function
    getSeabedHeight(worldX, worldZ) {
        return -25; // Simple flat seabed at -25
    }
}

// Global ocean instance
let oceanEnvironment = null;

// Initialize ocean environment
function initOcean(scene) {
    oceanEnvironment = new Ocean(scene);
    console.log('Ocean module loaded and initialized');
    return oceanEnvironment;
}

// Update ocean environment
function updateOcean(deltaTime) {
    if (oceanEnvironment) {
        oceanEnvironment.update(deltaTime);
    }
}

// Export functions
window.initOcean = initOcean;
window.updateOcean = updateOcean;
