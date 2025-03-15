document.addEventListener("DOMContentLoaded", function () {
    const noticias = [
        { titulo: "El dólar blue sube 2%", fecha: "14/03/2025" },
        { titulo: "El IPC de febrero se mantiene estable", fecha: "14/03/2025" },
        { titulo: "Argentina cierra nuevo acuerdo comercial con Brasil", fecha: "14/03/2025" }
    ];

    const listaNoticias = document.getElementById("lista-noticias");
    
    noticias.forEach(noticia => {
        const li = document.createElement("li");
        li.classList.add("noticia-item");
        li.innerHTML = `<strong>${noticia.fecha}:</strong> ${noticia.titulo}`;
        listaNoticias.appendChild(li);
    });
});