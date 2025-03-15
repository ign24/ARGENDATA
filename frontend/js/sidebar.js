document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleBtn");
    document.body.style.paddingTop = document.querySelector("header").offsetHeight + "px";
    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
});