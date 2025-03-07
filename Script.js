const planets = document.querySelectorAll('.planet');
const infoBox = document.getElementById('info');

const projectDetails = {
    project1: 'Project 1: A cool web app built with React.',
    project2: 'Project 2: A machine learning model for image recognition.',
    project3: 'Project 3: A game built with Unity.'
};

planets.forEach(planet => {
    planet.addEventListener('click', () => {
        const id = planet.id;
        infoBox.textContent = projectDetails[id] || 'Click a planet to see details!';
    });
});
