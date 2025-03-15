document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-button");
    const contentContainer = document.querySelector(".tab-content-container");
    const contents = document.querySelectorAll(".tab-content");

    // 🔹 Asegura que solo se muestre la primera pestaña al cargar
    contents.forEach((content, index) => {
        content.style.display = index === 0 ? "block" : "none";
    });

    function activateTab(tabIndex) {
        // 🔹 Ocultar todas las pestañas y mostrar solo la seleccionada
        contents.forEach((content, index) => {
            content.style.display = index === tabIndex ? "block" : "none";
        });

        // 🔹 Marcar el botón activo
        tabs.forEach((tab, index) => {
            tab.classList.toggle("active", index === tabIndex);
        });

        // 🔹 Forzar el desplazamiento horizontal dentro del contenedor
        contentContainer.scrollTo({
            left: tabIndex * contentContainer.clientWidth,
            behavior: "smooth"
        });
    }

    // 🔹 Agregar evento de clic a cada pestaña
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(index));
    });

    // 🔹 Activar la primera pestaña por defecto
    activateTab(0);
});