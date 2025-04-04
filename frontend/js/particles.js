// 📌 Configuración inicial de partículas con movimiento suave y elegante
particlesJS("particles-js", {
    particles: {
        number: { value: 70, density: { enable: true, value_area: 700 } },
        color: { value: "#ffffff" },
        shape: {
            type: "triangle",
            stroke: { width: 0, color: "#000000" },
        },
        opacity: {
            value: 0.7,
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
            speed: 0.03,
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
        }
    },
    retina_detect: true
});

// 📌 Variables de control para el mouse y comportamiento de partículas
let mouse = { x: null, y: null };
const attractionRadius = 30; // 📌 Radio de atracción más amplio para suavidad
const maxSpeed = 0.1; // 📌 Velocidad máxima permitida para las partículas
const releaseDamping = 0.95; // 📌 Factor de amortiguación al soltar

// 📌 Escuchar movimiento del mouse
document.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// 📌 Escuchar cuando el mouse sale de la pantalla
document.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

// 📌 Simulación de atracción con inercia y velocidad máxima
function updateParticles() {
    let particles = window.pJSDom[0].pJS.particles.array;

    particles.forEach(p => {
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < attractionRadius) {
                let force = Math.min(4 / (distance * 0.1 + 10), 0.06);
                let accelerationX = dx * force;
                let accelerationY = dy * force;

                p.vx = (p.vx || 0) * 0.1 + accelerationX;
                p.vy = (p.vy || 0) * 0.1 + accelerationY;
            }
        } else {

            p.vx *= releaseDamping;
            p.vy *= releaseDamping;
        }

        p.x += p.vx;
        p.y += p.vy;

        let speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
        }
    });

    requestAnimationFrame(updateParticles);
}

// 📌 Iniciar la simulación
updateParticles();