document.addEventListener("DOMContentLoaded", function () {
    const vocalMayuscula = document.getElementById("vocalMayuscula");
    const vocalMinuscula = document.getElementById("vocalMinuscula");
    const startButton = document.getElementById("start");
    const portada = document.querySelector(".portada");
    const volverBtn = document.getElementById("volver");
    const colorButton = document.querySelector(".color-button");
    const colorOptions = document.querySelector(".color-options");
    const toolbar = document.querySelector(".toolbar");
    const toggleToolbarBtn = document.getElementById("toggleToolbar");
    const resetCanvasBtn = document.getElementById("resetCanvas");
    const vocales = document.querySelectorAll(".vocal");
    const letras = document.querySelectorAll(".letra");
    const showToolbarBtn = document.getElementById("showToolbar");

    let selectedColor = "black";

    // === PARAMETROS DE URL ===
    const params = new URLSearchParams(window.location.search);
    const vocal = params.get("vocal");
    const letra = params.get("letra");

    if (vocal || letra) {
        const letraParaMostrar = vocal || letra;
        if (vocalMayuscula && vocalMinuscula) {
            vocalMayuscula.textContent = letraParaMostrar.toUpperCase();
            vocalMinuscula.textContent = letraParaMostrar.toLowerCase();
            vocalMayuscula.classList.add("vocal", `letra-${letraParaMostrar.toUpperCase()}`);
            vocalMinuscula.classList.add("vocal", `letra-${letraParaMostrar.toUpperCase()}`);
            vocalMayuscula.style.pointerEvents = "none";
            vocalMinuscula.style.pointerEvents = "none";
        }
    }

    // === INICIO EN index.html ===
    if (startButton && portada) {
        startButton.addEventListener("click", function () {
            startButton.style.display = "none";
            const pintarBtn = createButton("Pintar", "pintar");
            const competirBtn = createButton("Competir", "competir");

            pintarBtn.addEventListener("click", () => {
                limpiarPortada();
                const vocalesBtn = createButton("Vocales", "vocales");
                const abecedarioBtn = createButton("Consonantes", "abecedario");
                const palabrasBtn = createButton("Palabras", "palabras");

                vocalesBtn.addEventListener("click", () => window.location.href = "vocales.html");
                abecedarioBtn.addEventListener("click", () => window.location.href = "abecedario.html");
                palabrasBtn.addEventListener("click", () => window.location.href = "palabras.html");

                portada.appendChild(vocalesBtn);
                portada.appendChild(abecedarioBtn);
                portada.appendChild(palabrasBtn);
            });

            competirBtn.addEventListener("click", () => {
                window.location.href = "juego.html";
            });

            portada.appendChild(pintarBtn);
            portada.appendChild(competirBtn);
        });

        function limpiarPortada() {
            while (portada.firstChild) portada.removeChild(portada.firstChild);
        }

        function createButton(text, id) {
            const button = document.createElement("button");
            button.textContent = text;
            button.classList.add("option-btn");
            button.id = id;
            return button;
        }
    }

    // === VOLVER AL INICIO ===
    if (volverBtn) {
        volverBtn.addEventListener("click", () => window.location.href = "index.html");
    }

    // === NAVEGACIÓN ENTRE LETRAS Y VOCALES ===
    vocales.forEach(v => {
        v.addEventListener("click", function () {
            const letraSeleccionada = this.textContent.toLowerCase();
            window.location.href = `pintar.html?vocal=${letraSeleccionada}`;
        });
    });

    letras.forEach(l => {
        l.addEventListener("click", function () {
            const letraSeleccionada = this.textContent.toLowerCase();
            window.location.href = `pintar.html?letra=${letraSeleccionada}`;
        });
    });

    // === COLOR PICKER ===
    if (colorButton && colorOptions) {
        colorOptions.style.display = "none";

        colorButton.addEventListener("click", () => {
            colorOptions.style.display = colorOptions.style.display === "none" ? "flex" : "none";
        });

        document.querySelectorAll(".color-option").forEach(button => {
            button.addEventListener("click", () => {
                selectedColor = button.getAttribute("data-color");
                colorButton.style.background = selectedColor;
                colorOptions.style.display = "none";
            });
        });
    }

    // === TOOLBAR ===
    if (toggleToolbarBtn && showToolbarBtn && toolbar) {
        toggleToolbarBtn.addEventListener("click", () => {
            toolbar.style.display = "none";
            showToolbarBtn.style.display = "block";
        });

        showToolbarBtn.addEventListener("click", () => {
            toolbar.style.display = "flex";
            showToolbarBtn.style.display = "none";
        });
    }

    // === RESET CANVAS ===
    if (resetCanvasBtn) {
        resetCanvasBtn.addEventListener("click", () => {
            vocales.forEach(vocal => {
                vocal.style.color = "white";
                vocal.style.textShadow = "none";
            });
        });
    }

    // === PINTURA SOBRE CANVAS ===
    const canvas = document.getElementById("paintArea");
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");

        const colorList = ['purple', 'pink', 'black', 'blue', 'darkblue', 'yellow', 'red', 'orange', 'green', 'cyan', 'magenta', 'lime', 'brown', 'gray', 'gold', 'navy', 'teal'];
        const colorContainer = document.querySelector(".color-options");

        if (colorContainer) {
            colorList.forEach(color => {
                const btn = document.createElement("button");
                btn.className = "color-option";
                btn.style.backgroundColor = color;
                btn.dataset.color = color;
                colorContainer.appendChild(btn);
            });

            colorContainer.addEventListener("click", e => {
                if (e.target.classList.contains("color-option")) {
                    selectedColor = e.target.dataset.color;
                }
            });
        }

        let isPainting = false;
        let isErasing = false;
        let brushSize = 10;
        let cursor = null;

        const brushBtn = document.getElementById("brush");
        const eraseBtn = document.getElementById("erase");
        const increaseBtn = document.getElementById("increaseBrush");
        const decreaseBtn = document.getElementById("decreaseBrush");
        const sizeCounter = document.getElementById("brushSizeCounter");

        function updateCursor() {
            if (!cursor) {
                cursor = document.createElement("div");
                document.body.appendChild(cursor);
            }
            cursor.className = isErasing ? "cursor-x" : "cursor-circular";
            cursor.style.width = `${brushSize}px`;
            cursor.style.height = `${brushSize}px`;
            document.body.style.cursor = "none";
        }

        function paint(e) {
            if (!isPainting) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.beginPath();
            ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = isErasing ? "white" : selectedColor;
            ctx.fill();
        }

        function moveCursor(e) {
            if (cursor) {
                cursor.style.left = `${e.pageX - brushSize / 2}px`;
                cursor.style.top = `${e.pageY - brushSize / 2}px`;
            }
        }

        canvas.addEventListener("mousedown", () => isPainting = true);
        canvas.addEventListener("mouseup", () => isPainting = false);
        canvas.addEventListener("mousemove", (e) => {
            paint(e);
            moveCursor(e);
        });

        brushBtn?.addEventListener("click", () => {
            isErasing = false;
            updateCursor();
        });

        eraseBtn?.addEventListener("click", () => {
            isErasing = true;
            updateCursor();
        });

        increaseBtn?.addEventListener("click", () => {
            brushSize = Math.min(40, brushSize + 2);
            sizeCounter.textContent = brushSize;
            updateCursor();
        });

        decreaseBtn?.addEventListener("click", () => {
            brushSize = Math.max(10, brushSize - 2);
            sizeCounter.textContent = brushSize;
            updateCursor();
        });

        document.addEventListener("mousemove", moveCursor);
    }
});
