let scene, camera, renderer, controls;
let planets = [];
let isPaused = false;
let darkMode = true;
let clock = new THREE.Clock();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let labelElement = document.getElementById('planet-label');


const planetTextures = {
    sun: { color: 0xfdb813, emissive: 0xfdb813, emissiveIntensity: 1 },
    mercury: { color: 0xb5b5b5 },
    venus: { color: 0xe6c229 },
    earth: { color: 0x3498db },
    mars: { color: 0xe27b58 },
    jupiter: { color: 0xe3b78e },
    saturn: { color: 0xc7aa72 },
    uranus: { color: 0x7bc2d1 },
    neptune: { color: 0x4b70dd }
};


function init() {
  
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    scene.fog = new THREE.FogExp2(0x000033, 0.001);

   
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 30, 100);

   
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

   
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 30;
    controls.maxDistance = 500;

   
    createSun();
    createPlanets();
    createStars();
    createAsteroidBelt();

    
    setupControls();
    setupEventListeners();

    animate();
}


function createSun() {
   
    const geometry = new THREE.SphereGeometry(8, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        color: planetTextures.sun.color,
        emissive: planetTextures.sun.emissive,
        emissiveIntensity: planetTextures.sun.emissiveIntensity,
        specular: 0xffff00,
        shininess: 10
    });

    const sun = new THREE.Mesh(geometry, material);
    sun.castShadow = true;
    sun.receiveShadow = true;
    scene.add(sun);

   
    const pointLight = new THREE.PointLight(0xffffff, 2, 300);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    scene.add(pointLight);


    scene.add(new THREE.AmbientLight(0x555555));


    const glowGeometry = new THREE.SphereGeometry(8.5, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xfdb813,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(glow);
}


const planetsData = [
    { name: "Mercury", radius: 1.5, distance: 28, speed: 0.4, color: planetTextures.mercury.color },
    { name: "Venus", radius: 3.7, distance: 44, speed: 0.15, color: planetTextures.venus.color },
    { name: "Earth", radius: 3.9, distance: 62, speed: 0.1, color: planetTextures.earth.color },
    { name: "Mars", radius: 2.1, distance: 80, speed: 0.08, color: planetTextures.mars.color },
    { name: "Jupiter", radius: 12, distance: 140, speed: 0.02, color: planetTextures.jupiter.color },
    { name: "Saturn", radius: 10, distance: 180, speed: 0.009, color: planetTextures.saturn.color },
    { name: "Uranus", radius: 7, distance: 220, speed: 0.004, color: planetTextures.uranus.color },
    { name: "Neptune", radius: 6.8, distance: 260, speed: 0.001, color: planetTextures.neptune.color }
];


function createPlanets() {
    planetsData.forEach(data => {
        const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: data.color,
            specular: 0x111111,
            shininess: 5,
            transparent: false,   
            opacity: 1            
        });

        const planet = new THREE.Mesh(geometry, material);
        planet.castShadow = true;
        planet.receiveShadow = true;

        planet.position.x = data.distance;
        planet.userData = {
            name: data.name,
            originalSpeed: data.speed,
            currentSpeed: data.speed,
            distance: data.distance,
            angle: Math.random() * Math.PI * 2
        };

     
        if (data.name === "Saturn") {
            const ringGeometry = new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.2, 64);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: 0xc7aa72,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            const rings = new THREE.Mesh(ringGeometry, ringMaterial);
            rings.rotation.x = Math.PI / 2;
            planet.add(rings);
        }

        scene.add(planet);
        planets.push(planet);

       
        createOrbitPath(data.distance);
    });
}


function createOrbitPath(distance) {
    const orbitGeometry = new THREE.BufferGeometry();
    const points = [];
    const segments = 128;

    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
            Math.cos(theta) * distance,
            0,
            Math.sin(theta) * distance
        ));
    }

    orbitGeometry.setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x555555,
        transparent: true,
        opacity: 0.3
    });

    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbit);
}


function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        starsVertices.push(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}


function createAsteroidBelt() {
    const asteroidsGeometry = new THREE.BufferGeometry();
    const asteroidsMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.3
    });

    const asteroidsVertices = [];
    for (let i = 0; i < 2000; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 40;
        asteroidsVertices.push(
            Math.cos(angle) * distance,
            (Math.random() - 0.5) * 10,
            Math.sin(angle) * distance
        );
    }

    asteroidsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(asteroidsVertices, 3));
    const asteroids = new THREE.Points(asteroidsGeometry, asteroidsMaterial);
    scene.add(asteroids);
}


function setupControls() {
    const controlsContainer = document.getElementById('planet-controls');

    planets.forEach((planet, index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'planet-control';

        const label = document.createElement('label');
        label.textContent = `${planet.userData.name}:`;

        const input = document.createElement('input');
        input.type = 'range';
        input.min = '0';
        input.max = '2';
        input.step = '0.01';
        input.value = '1';

        const valueSpan = document.createElement('span');
        valueSpan.className = 'speed-value';
        valueSpan.textContent = '1x';

        input.addEventListener('input', () => {
            const multiplier = parseFloat(input.value);
            planet.userData.currentSpeed = planet.userData.originalSpeed * multiplier;
            valueSpan.textContent = `${multiplier.toFixed(2)}x`;
        });

        controlDiv.appendChild(label);
        controlDiv.appendChild(input);
        controlDiv.appendChild(valueSpan);
        controlsContainer.appendChild(controlDiv);
    });

    
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.style.display = 'block';
    pauseBtn.style.visibility = 'visible';
    pauseBtn.style.zIndex = '1000';
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
        pauseBtn.style.background = isPaused ? '#4CAF50' : '#ff3366';
    });


    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        darkMode = !darkMode;
        if (darkMode) {
            scene.background = new THREE.Color(0x000011);
            themeBtn.textContent = '☀️ Light Mode';
            themeBtn.style.background = '#333';
            themeBtn.style.color = '#fff';
        } else {
            scene.background = new THREE.Color(0x87CEEB);
            themeBtn.textContent = '🌙 Dark Mode';
            themeBtn.style.background = '#f0f0f0';
            themeBtn.style.color = '#333';
        }
    });
}


function setupEventListeners() {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planets);

        if (intersects.length > 0) {
            const planet = intersects[0].object;
            labelElement.textContent = planet.userData.name;
            labelElement.style.display = 'block';
            labelElement.style.left = `${event.clientX + 15}px`;
            labelElement.style.top = `${event.clientY + 15}px`;

            
            planet.material.emissive = new THREE.Color(0x333333);
            planet.material.needsUpdate = true;
        } else {
            labelElement.style.display = 'none';
            planets.forEach(p => {
                p.material.emissive = new THREE.Color(0x000000);
                p.material.needsUpdate = true;
            });
        }
    });
}


function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (!isPaused) {
        planets.forEach(planet => {
            planet.userData.angle += planet.userData.currentSpeed * delta;
            planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
            planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;

            
            planet.rotation.y += 0.01 * planet.userData.currentSpeed;
        });
    }

    controls.update();
    renderer.render(scene, camera);
}
init();