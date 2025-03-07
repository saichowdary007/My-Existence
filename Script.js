const planets = document.querySelectorAll('.planet');
const infoBox = document.getElementById('info');

const resumeDetails = {
    education: `
        <strong>Education</strong><br>
        - B.S. in Computer Science, [Your University], [Year]<br>
        - Relevant Courses: Data Structures, Algorithms, Web Development
    `,
    experience: `
        <strong>Experience</strong><br>
        - Software Engineer, [Company Name], [Dates]<br>
          &nbsp;&nbsp;• Developed web applications using React and Node.js<br>
        - Intern, [Another Company], [Dates]<br>
          &nbsp;&nbsp;• Assisted in debugging and testing software
    `,
    projects: `
        <strong>Projects</strong><br>
        - [Project Name 1]: A web app for [purpose], built with [tech stack]<br>
        - [Project Name 2]: A [type] project using [tech stack]
    `
};

planets.forEach(planet => {
    planet.addEventListener('click', () => {
        const id = planet.id;
        infoBox.innerHTML = resumeDetails[id] || 'Click a planet to see details!';
    });
});
