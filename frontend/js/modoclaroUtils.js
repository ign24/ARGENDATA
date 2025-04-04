// 🌅 Aplicar modo claro con efectos visuales suaves
function aplicarModoClaro() {
    document.body.classList.add('modo-claro');
    document.body.classList.remove('modo-oscuro');

    cambiarParticulasModoClaro();
    actualizarTarjetasModoClaro();
    actualizarCommoditiesModoClaro();
}

// 🌙 Aplicar modo oscuro con efectos
function aplicarModoOscuro() {
    document.body.classList.remove('modo-claro');
    document.body.classList.add('modo-oscuro');

    cambiarParticulasModoOscuro();
}

// 🎇 Partículas celeste-dorado (modo claro)
function cambiarParticulasModoClaro() {
    if (window.pJSDom?.length > 0) {
        const p = window.pJSDom[0].pJS;
        p.particles.color.value = ["#56ccf2", "#f9d976", "#00aaff"];
        p.particles.line_linked.color = "#a0cfff";
        p.fn.particlesRefresh();
    }
}

// 🌌 Partículas azul celeste (modo oscuro)
function cambiarParticulasModoOscuro() {
    if (window.pJSDom?.length > 0) {
        const p = window.pJSDom[0].pJS;
        p.particles.color.value = "#00c8ff";
        p.particles.line_linked.color = "#00c8ff";
        p.fn.particlesRefresh();
    }
}

// 💡 Hover etéreo para tarjetas en modo claro
function actualizarTarjetasModoClaro() {
    const tarjetas = document.querySelectorAll('.tarjeta, .tarjeta-dolar');

    tarjetas.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const luz = `radial-gradient(circle at ${x}px ${y}px, rgba(135,206,250,0.3) 0%, transparent 60%)`;
            const fondo = `linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.15))`;
            card.style.backgroundImage = `${luz}, ${fondo}`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.backgroundImage = '';
            card.style.transform = '';
        });
    });
}

// 💫 Estilo aurora para la tarjeta de commodities
function actualizarCommoditiesModoClaro() {
    const card = document.querySelector('.commodities-card');
    if (!card) return;

    card.style.background = 'linear-gradient(to bottom right, #ffffff, #f5fbff, #d1ecf9)';
    card.style.color = '#222';
    card.style.border = '1px solid rgba(0, 0, 0, 0.1)';
    card.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.08)';
}

// 🎬 Transición profesional tipo "timelapse amanecer"
function animarTransicionAModoClaro(callback) {
    const velo = document.createElement("div");
    velo.id = "velo-transicion";
    velo.style.animation = "transicionAmanecer 2.8s ease-in-out";
    document.body.appendChild(velo);

    setTimeout(() => {
        velo.remove();
        if (callback) callback();
    }, 2800);
}

// 🎬 Transición profesional tipo "timelapse anochecer"
function animarTransicionAModoOscuro(callback) {
    const velo = document.createElement("div");
    velo.id = "velo-transicion";
    velo.style.animation = "transicionAnochecer 2.8s ease-in-out";
    document.body.appendChild(velo);

    setTimeout(() => {
        velo.remove();
        if (callback) callback();
    }, 2800);
}
