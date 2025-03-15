document.addEventListener("readystatechange", function () {
    if (document.readyState === "complete") { 
        setTimeout(() => {
            const loader = document.getElementById("loader");
            loader.classList.add("loader-exit");

            setTimeout(() => {
                loader.style.display = "none";
                document.body.style.opacity = "1";
            }, 1000); // ⏳ Se espera que la animación termine
        }, 4000); // ⏳ Se mantiene el loader al menos 3s antes de desaparecer
    }
});