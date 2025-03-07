import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextureLoader } from 'three';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load('textures/stars.jpg'); // Starfield background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Information Pop-up
const infoBox = document.createElement('div');
infoBox.style.position = 'absolute';
infoBox.style.top = '20px';
infoBox.style.left = '20px';
infoBox.style.padding = '10px';
infoBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
infoBox.style.color = 'white';
infoBox.style.display = 'none';
document.body.appendChild(infoBox);

// Create a Planet Function with Moons
function createPlanet(size, texture, distance, speed, info, moons = []) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: textureLoader.load(texture) });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    scene.add(planet);
    planet.info = info;
    planet.moons = [];
    
    // Add moons if available
    moons.forEach(moon => {
        const moonGeometry = new THREE.SphereGeometry(moon.size, 16, 16);
        const moonMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load(moon.texture) });
        const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
        moonMesh.position.set(distance + moon.distance, 0, 0);
        scene.add(moonMesh);
        planet.moons.push({ mesh: moonMesh, distance: moon.distance, speed: moon.speed, angle: Math.random() * Math.PI * 2 });
    });

    return { planet, distance, speed, angle: Math.random() * Math.PI * 2, moons: planet.moons };
}

// Create Sun (Sai Kumar P - Central Star)
const sun = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), new THREE.MeshBasicMaterial({ map: textureLoader.load('textures/sun.jpg') }));
sun.info = "Sai Kumar P\nData Analyst\n(940) 536-9375 | saikumarp@gmail.com\nlinkedin.com/in/saikumarpa";
scene.add(sun);

// Planets with Textures and Moons
const planets = [
    createPlanet(1, 'textures/earth.jpg', 8, 0.002, "Education\nBelhaven University (MS IT & Management, GPA: 3.8)\nJNTU Hyderabad (BTech, GPA: 3.1)", [{ size: 0.3, texture: 'textures/moon.jpg', distance: 1.5, speed: 0.005 }]),
    createPlanet(2, 'textures/jupiter.jpg', 14, 0.0015, "Experience\nSoftPoint, Hyderabad (2020-2022)\n- Improved efficiency by 40% using SQL & Python\n- Built Power BI dashboards (30% accuracy gain)\n- Optimized ETL reducing processing time by 50%", [{ size: 0.6, texture: 'textures/europa.jpg', distance: 3, speed: 0.004 }]),
    createPlanet(1.5, 'textures/saturn.jpg', 20, 0.001, "Projects\n1. Sales Dashboard (Power BI, SQL)\n2. Customer Segmentation (Python, ML)\n3. Predictive Maintenance (TensorFlow, Python)")
];

// Saturn's Rings
const ringGeometry = new THREE.RingGeometry(1.8, 2.5, 32);
const ringMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load('textures/saturn_rings.png'), side: THREE.DoubleSide });
const saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);
saturnRings.rotation.x = Math.PI / 2;
planets[2].planet.add(saturnRings);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 10, 35);
controls.update();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    sun.rotation.y += 0.002;
    
    planets.forEach(p => {
        p.angle += p.speed;
        p.planet.position.x = Math.cos(p.angle) * p.distance;
        p.planet.position.z = Math.sin(p.angle) * p.distance;
        
        p.moons.forEach(moon => {
            moon.angle += moon.speed;
            moon.mesh.position.x = p.planet.position.x + Math.cos(moon.angle) * moon.distance;
            moon.mesh.position.z = p.planet.position.z + Math.sin(moon.angle) * moon.distance;
        });
    });
    
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Click Event for Info Display with Camera Focus
window.addEventListener('click', (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.info) {
            infoBox.innerText = object.info;
            infoBox.style.display = 'block';
        }
    } else {
        infoBox.style.display = 'none';
    }
});

// Resize Handler
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
