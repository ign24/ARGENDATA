document.addEventListener("DOMContentLoaded", function () {
    const dashboard = document.querySelector(".dashboard-container");

    if (!dashboard) return;

    dashboard.style.position = "relative";

    // 📌 Crear botón de redimensionamiento
    const resizeHandle = document.createElement("div");
    resizeHandle.style.width = "15px";
    resizeHandle.style.height = "15px";
    resizeHandle.style.background = "#00c8ff";
    resizeHandle.style.position = "absolute";
    resizeHandle.style.right = "5px";
    resizeHandle.style.bottom = "5px";
    resizeHandle.style.cursor = "nwse-resize";
    resizeHandle.style.borderRadius = "50%";
    resizeHandle.style.boxShadow = "0 0 5px rgba(0, 200, 255, 0.5)";
    
    dashboard.appendChild(resizeHandle);

    resizeHandle.addEventListener("mousedown", function (e) {
        e.preventDefault();
        e.stopPropagation(); // 🔹 Evita interferencias con Sortable.js

        let startX = e.clientX;
        let startY = e.clientY;
        let startWidth = parseInt(document.defaultView.getComputedStyle(dashboard).width, 10);
        let startHeight = parseInt(document.defaultView.getComputedStyle(dashboard).height, 10);

        function resize(e) {
            dashboard.style.width = startWidth + e.clientX - startX + "px";
            dashboard.style.height = startHeight + e.clientY - startY + "px";
        }

        function stopResize() {
            document.documentElement.removeEventListener("mousemove", resize);
            document.documentElement.removeEventListener("mouseup", stopResize);
        }

        document.documentElement.addEventListener("mousemove", resize);
        document.documentElement.addEventListener("mouseup", stopResize);
    });

    // 📌 Activar Drag & Drop con Sortable.js sin interferencias
    const contenedores = document.querySelectorAll(".ipc-container, .contenedor-graficos");

    contenedores.forEach(contenedor => {
        new Sortable(contenedor, {
            group: "tarjetas",
            animation: 200,
            ghostClass: "dragging",
            chosenClass: "seleccionada",
            dragClass: "drag-en-movimiento",
            handle: ".tarjeta-ipc, .tarjeta-dolar", // 🔹 Especifica un handle para evitar conflictos con resize
            onStart: function (evt) {
                document.querySelectorAll(".tarjeta-ipc").forEach(tarjeta => {
                    if (tarjeta !== evt.item) {
                        tarjeta.classList.remove("seleccionada");
                    }
                });
            },
            onEnd: function (evt) {
                console.log(`Tarjeta movida de posición ${evt.oldIndex} a ${evt.newIndex}`);
            }
        });
    });
});

