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
const attractionRadius = 40; // 📌 Radio de atracción más amplio para suavidad
const maxSpeed = 0.3; // 📌 Velocidad máxima permitida para las partículas
const releaseDamping = 0.1; // 📌 Factor de amortiguación al soltar

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
            // 📌 Aplicamos una inercia más natural con amortiguación progresiva
            p.vx *= releaseDamping;
            p.vy *= releaseDamping;
        }

        // 📌 Aplicamos la velocidad acumulada a la posición
        p.x += p.vx;
        p.y += p.vy;

        // 📌 Limitar la velocidad máxima de cada partícula
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

document.addEventListener("click", (event) => {
    let explosion = document.createElement("div");
    explosion.classList.add("explosion");
    explosion.style.left = `${event.clientX}px`;
    explosion.style.top = `${event.clientY}px`;
    document.body.appendChild(explosion);

    setTimeout(() => explosion.remove(), 1000); // 🔥 Desaparece tras 1 seg
});

// 📌 Explosión de partículas en direcciones aleatorias con inercia prolongada
document.addEventListener("click", (event) => {
    let particles = window.pJSDom[0].pJS.particles.array;

    particles.forEach(p => {
        let distanceToClick = Math.sqrt((p.x - event.clientX) ** 2 + (p.y - event.clientY) ** 2);
        
        if (distanceToClick < 120) { // 📌 Solo afecta partículas cercanas al click
            let randomAngle = Math.random() * Math.PI * 2; // 🔹 Ángulo completamente aleatorio (0 a 360°)
            let explosionForce = Math.random() * 6 + 5; // 🔹 Fuerza aleatoria entre 5 y 11

            p.vx += Math.cos(randomAngle) * explosionForce;
            p.vy += Math.sin(randomAngle) * explosionForce;

            // 📌 Aplica inercia prolongada para evitar que vuelvan al cursor
            p.exploded = true; // Marcamos la partícula como "explotada"
            setTimeout(() => {
                p.exploded = false; // Luego de un tiempo, vuelve a reaccionar al cursor
            }, 2000); // 🔹 2 segundos de inercia antes de volver a la atracción
        }
    });
});
// 📌 Explosión de partículas en direcciones aleatorias
document.addEventListener("click", (event) => {
    let particles = window.pJSDom[0].pJS.particles.array;

    particles.forEach(p => {
        let distanceToClick = Math.sqrt((p.x - event.clientX) ** 2 + (p.y - event.clientY) ** 2);
        
        if (distanceToClick < 120) { // 📌 Solo afecta partículas cercanas al click
            let randomAngle = Math.random() * Math.PI * 2; // 🔹 Ángulo completamente aleatorio (0 a 360°)
            let explosionForce = (Math.random() * 6) + 70; // 🔹 Velocidad aleatoria entre 2 y 8

            p.vx += Math.cos(randomAngle) * explosionForce;
            p.vy += Math.sin(randomAngle) * explosionForce;
        }
    });
});
