import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextureLoader } from 'three';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
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

// Create a Planet Function
function createPlanet(size, texture, distance, speed, info) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: textureLoader.load(texture) });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    scene.add(planet);
    planet.info = info;
    return { planet, distance, speed, angle: Math.random() * Math.PI * 2 };
}

// Create Sun (Sai Kumar P - Central Star)
const sun = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), new THREE.MeshBasicMaterial({ color: 0xFDB813 }));
sun.info = "Sai Kumar P\nData Analyst\n(940) 536-9375 | saikumarp@gmail.com\nlinkedin.com/in/saikumarpa";
scene.add(sun);

// Planets
const planets = [
    createPlanet(1, 'textures/earth.jpg', 8, 0.002, "Education\nBelhaven University (MS IT & Management, GPA: 3.8)\nJNTU Hyderabad (BTech, GPA: 3.1)"),
    createPlanet(2, 'textures/jupiter.jpg', 14, 0.0015, "Experience\nSoftPoint, Hyderabad (2020-2022)\n- Improved efficiency by 40% using SQL & Python\n- Built Power BI dashboards (30% accuracy gain)\n- Optimized ETL reducing processing time by 50%"),
    createPlanet(1.5, 'textures/saturn.jpg', 20, 0.001, "Projects\n1. Sales Dashboard (Power BI, SQL)\n2. Customer Segmentation (Python, ML)\n3. Predictive Maintenance (TensorFlow, Python)")
];

// Saturn's Rings
const ringGeometry = new THREE.RingGeometry(1.8, 2.5, 32);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xC2B280, side: THREE.DoubleSide });
const saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);
saturnRings.rotation.x = Math.PI / 2;
planets[2].planet.add(saturnRings);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 10, 25);
controls.update();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    sun.rotation.y += 0.002;
    
    planets.forEach(p => {
        p.angle += p.speed;
        p.planet.position.x = Math.cos(p.angle) * p.distance;
        p.planet.position.z = Math.sin(p.angle) * p.distance;
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
            
            // Smoothly move camera to focus on the selected planet
            new TWEEN.Tween(camera.position)
                .to({ x: object.position.x, y: object.position.y + 3, z: object.position.z + 5 }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
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
