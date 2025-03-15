particlesJS("particles-js", {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 700 } },
        color: { value: "#ffffff" },
        shape: {
            type: "edge",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 },
        },
        opacity: {
            value: 0.6,
            random: true,
            anim: { enable: true, speed: 0.2, opacity_min: 0.1, sync: false }
        },
        size: {
            value: 3,
            random: true,
            anim: { enable: true, speed: 3, size_min: 0.1, sync: false }
        },
        line_linked: {
            enable: true,
            distance: 100,
            color: "#ffffff",
            opacity: 0.7,
            width: 1
        },
        move: {
            enable: true,
            speed: 0.4,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },  // Las partículas se alejan del mouse
            onclick: { enable: true, mode: "bubble" },  // Al hacer clic, se agrandan
            resize: true
        },
        modes: {
            repulse: { distance: 200, duration: 0.4 },  // Distancia y tiempo del efecto de repulsión
            bubble: { distance: 400, size: 10, duration: 1 }  // Tamaño y tiempo del efecto al hacer clic
        }
    }    
    ,
    retina_detect: true
});
document.addEventListener("mousemove", (event) => {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    let particles = window.pJSDom[0].pJS.particles.array;
    
    particles.forEach(p => {
        let dx = p.x - mouseX;
        let dy = p.y - mouseY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) { // Si la partícula está cerca del mouse
            p.x -= dx * 0.01; // Ajusta su posición para acercarla al cursor
            p.y -= dy * 0.01;
        }
    });
});
