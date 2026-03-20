/**
 * Elite-inspired procedural submarine hulls — long axis +X, geometric solids, smoothed shapes.
 * Pick hull with: window.SUB_HULL_VARIANT = 0..5 (before initSubmarine), or URL ?hull=3
 */
(function () {
    const cyl = THREE.CylinderGeometry;
    const box = THREE.BoxGeometry;
    const sph = THREE.SphereGeometry;
    const cone = THREE.ConeGeometry;

    /** 0: cigar + twin outrigger pods */
    function hull0(M) {
        const g = new THREE.Group();
        const hullG = new cyl(2.2, 2.8, 22, 16, 4);
        hullG.rotateZ(Math.PI / 2);
        g.add(new THREE.Mesh(hullG, M));
        const podG = new cyl(1.1, 1.1, 5, 10);
        podG.rotateZ(Math.PI / 2);
        const pL = new THREE.Mesh(podG, M);
        pL.position.set(-2, -2.8, 4);
        const pR = pL.clone();
        pR.position.z = -4;
        g.add(pL, pR);
        const nose = new THREE.Mesh(new cone(2.3, 5, 12), M);
        nose.rotateZ(-Math.PI / 2);
        nose.position.set(13.5, 0, 0);
        g.add(nose);
        return g;
    }

    /** 1: flat wedge hull + sail + wing pods */
    function hull1(M) {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new box(24, 4.5, 7, 1, 1, 1), M);
        body.position.set(0, 0, 0);
        g.add(body);
        const sail = new THREE.Mesh(new box(4, 3.5, 2.5), M);
        sail.position.set(2, 3.2, 0);
        g.add(sail);
        const pod = new THREE.Mesh(new box(6, 2, 2.5), M);
        const pl = pod.clone();
        pl.position.set(-4, -1.5, 5);
        const pr = pod.clone();
        pr.position.set(-4, -1.5, -5);
        g.add(pl, pr);
        return g;
    }

    /** 2: blunt sphere bow + cylinder + tail */
    function hull2(M) {
        const g = new THREE.Group();
        const bow = new THREE.Mesh(new sph(3.2, 12, 10), M);
        bow.scale.set(1.1, 0.85, 0.9);
        bow.position.set(10, 0, 0);
        g.add(bow);
        const mid = new cyl(2.6, 3, 14, 14);
        mid.rotateZ(Math.PI / 2);
        g.add(new THREE.Mesh(mid, M));
        const tail = new THREE.Mesh(new cone(2.5, 4, 10), M);
        tail.rotateZ(Math.PI / 2);
        tail.position.set(-11, 0, 0);
        g.add(tail);
        return g;
    }

    /** 3: elongated octagonal prism feel — stacked tapered boxes */
    function hull3(M) {
        const g = new THREE.Group();
        for (let i = 0; i < 5; i++) {
            const w = 5.5 - i * 0.7;
            const h = 4 - i * 0.35;
            const m = new THREE.Mesh(new box(5, h, w, 1, 1, 1), M);
            m.position.set(4 - i * 4.2, 0, 0);
            g.add(m);
        }
        const pod = new THREE.Mesh(new cyl(1.2, 1.2, 6, 8), M);
        pod.rotateZ(Math.PI / 2);
        pod.position.set(-2, -2.5, 5);
        const pod2 = pod.clone();
        pod2.position.set(-2, -2.5, -5);
        g.add(pod, pod2);
        return g;
    }

    /** 4: delta “lifting body” + twin aft pods */
    function hull4(M) {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new box(20, 3.2, 12, 1, 1, 1), M);
        body.rotation.y = Math.PI / 10;
        g.add(body);
        const n = new THREE.Mesh(new cone(5, 7, 4), M);
        n.rotateZ(-Math.PI / 2);
        n.position.set(14, 0, 0);
        g.add(n);
        for (let z of [-5, 5]) {
            const p = new THREE.Mesh(new cyl(1.4, 1.8, 8, 10), M);
            p.rotateZ(Math.PI / 2);
            p.position.set(-8, -2.2, z);
            g.add(p);
        }
        return g;
    }

    /** 5: needle nose + fat mid + X-stern */
    function hull5(M) {
        const g = new THREE.Group();
        const nose = new THREE.Mesh(new cone(1.8, 10, 8), M);
        nose.rotateZ(-Math.PI / 2);
        nose.position.set(15, 0, 0);
        g.add(nose);
        const mid = new cyl(3.5, 4.5, 12, 12);
        mid.rotateZ(Math.PI / 2);
        g.add(new THREE.Mesh(mid, M));
        const st = new THREE.Mesh(new box(3, 2, 10), M);
        st.position.set(-10, 0, 0);
        g.add(st);
        return g;
    }

    const builders = [hull0, hull1, hull2, hull3, hull4, hull5];

    /** Unique registry for HUD / save-games (index matches builders). */
    window.HULL_VARIANT_CATALOG = [
        { id: 'SWH-01', code: 'CIGR', name: 'Cigar & twin pods' },
        { id: 'SWH-02', code: 'WEDG', name: 'Wedge, sail & wing pods' },
        { id: 'SWH-03', code: 'BLOB', name: 'Blunt bow, cylinder, tail cone' },
        { id: 'SWH-04', code: 'LADD', name: 'Ladder stack & lateral pods' },
        { id: 'SWH-05', code: 'DLTA', name: 'Delta lifting-body' },
        { id: 'SWH-06', code: 'NDLE', name: 'Needle nose & X-stern' }
    ];

    window.getHullVariantCatalogEntry = function (index) {
        const c = window.HULL_VARIANT_CATALOG[index];
        return c || { id: 'SWH-??', code: '----', name: 'Unknown hull' };
    };

    window.getHullVariantDisplayLabel = function (index) {
        const e = window.getHullVariantCatalogEntry(index);
        return `${e.id} · ${e.code} — ${e.name}`;
    };

    window.normalizeHullVariantIndex = function (index) {
        const n = builders.length;
        let i = Math.floor(index) % n;
        if (i < 0) i += n;
        return i;
    };

    function resolveVariant() {
        const q = typeof window !== 'undefined' && window.location && window.location.search
            ? new URLSearchParams(window.location.search).get('hull')
            : null;
        if (q !== null && q !== '') {
            const n = parseInt(q, 10);
            if (!Number.isNaN(n)) return Math.max(0, Math.min(builders.length - 1, n));
        }
        if (typeof window !== 'undefined' && typeof window.SUB_HULL_VARIANT === 'number') {
            return Math.max(0, Math.min(builders.length - 1, window.SUB_HULL_VARIANT));
        }
        return 0;
    }

    window.buildProceduralEliteHull = function (material, variantIndex) {
        const v = variantIndex === undefined || variantIndex === null ? resolveVariant() : variantIndex;
        const M = material || new THREE.MeshBasicMaterial({ color: 0x55ccdd, side: THREE.DoubleSide });
        const fn = builders[v] || hull0;
        const g = fn(M);
        const cat = window.getHullVariantCatalogEntry(v);
        g.name = `proceduralHull_${v}`;
        g.userData.proceduralVariant = v;
        g.userData.hullId = cat.id;
        g.userData.hullCode = cat.code;
        console.log(`🛸 Procedural hull ${cat.id} (${cat.code}) — [ ] to cycle`);
        return g;
    };

    window.PROCEDURAL_HULL_COUNT = builders.length;
}());
