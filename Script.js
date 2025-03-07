// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Sun (Your Name)
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffeb3b });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x2196f3 });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.userData = { id: 'education' };
scene.add(earth);

const jupiterGeometry = new THREE.SphereGeometry(2, 32, 32);
const jupiterMaterial = new THREE.MeshBasicMaterial({ color: 0xff5722 });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiter.userData = { id: 'experience' };
scene.add(jupiter);

const saturnGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const saturnMaterial = new THREE.MeshBasicMaterial({ color: 0xffc107 });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
saturn.userData = { id: 'projects' };
scene.add(saturn);

// Saturn's Rings
const ringGeometry = new THREE.RingGeometry(2, 3, 32);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const rings = new THREE.Mesh(ringGeometry, ringMaterial);
rings.rotation.x = Math.PI / 3; // Tilt the rings
saturn.add(rings); // Attach rings to Saturn

// Camera Position
camera.position.z = 20;

// Orbit Parameters
let earthAngle = 0, jupiterAngle = 0, saturnAngle = 0;
const earthOrbitRadius = 10, jupiterOrbitRadius = 15, saturnOrbitRadius = 20;

// Resume Details
const resumeDetails = {
    education: `
        <strong>Education</strong><br>
        - B.S. in Computer Science, [Your University], [Year]<br>
        - Relevant Courses: Data Structures, Algorithms, Web Development
    `,
    experience: `
        <strong>Experience</strong><br>
        - Software Engineer, [Company Name], [Dates]<br>
            • Developed web apps with React and Node.js<br>
        - Intern, [Another Company], [Dates]<br>
            • Assisted in debugging and testing
    `,
    projects: `
        <strong>Projects</strong><br>
        - [Project Name 1]: A web app for [purpose], built with [tech stack]<br>
        - [Project Name 2]: A [type] project using [tech stack]
    `
};

const infoBox = document.getElementById('info');

// Raycaster for Clicking
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([earth, jupiter, saturn]);
    if (intersects.length > 0) {
        const id = intersects[0].object.userData.id;
        infoBox.innerHTML = resumeDetails[id] || 'Click a planet to see details!';
    }
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Orbit Animation
    earthAngle += 0.02;
    jupiterAngle += 0.015;
    saturnAngle += 0.01;
    earth.position.set(Math.cos(earthAngle) * earthOrbitRadius, 0, Math.sin(earthAngle) * earthOrbitRadius);
    jupiter.position.set(Math.cos(jupiterAngle) * jupiterOrbitRadius, 0, Math.sin(jupiterAngle) * jupiterOrbitRadius);
    saturn.position.set(Math.cos(saturnAngle) * saturnOrbitRadius, 0, Math.sin(saturnAngle) * saturnOrbitRadius);

    // Rotate Planets
    earth.rotation.y += 0.01;
    jupiter.rotation.y += 0.01;
    saturn.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
