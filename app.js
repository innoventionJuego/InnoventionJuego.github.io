// == CÓDIGO COMPLETO Y CORREGIDO ==
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
    let brushSize = 10;
    let isErasing = false;
    let cursor = null;

    
    // === PARAMETROS DE URL ===
    const params = new URLSearchParams(window.location.search);
    const vocal = params.get("vocal");
    const letra = params.get("letra");
    const palabra = params.get("palabra");

    const canvas = document.getElementById("paintArea");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let painting = false;

        if (vocal || letra || palabra) {
            const seleccion = (palabra || vocal || letra).toLowerCase();
            const imgElement = document.getElementById("coloringImage");

            if (imgElement) {
                let nombreImagen = palabra ? `${seleccion}.png` : `${seleccion.toUpperCase()}${seleccion}.png`;
                imgElement.src = nombreImagen;

                if (palabra) imgElement.classList.add("palabra-img");
                else imgElement.classList.remove("palabra-img");

                imgElement.onload = function () {
                    canvas.width = imgElement.width;
                    canvas.height = imgElement.height;

                    const hiddenCanvas = document.createElement("canvas");
                    const hiddenCtx = hiddenCanvas.getContext("2d");
                    hiddenCanvas.width = imgElement.width;
                    hiddenCanvas.height = imgElement.height;
                    hiddenCtx.drawImage(imgElement, 0, 0);
                    function draw(e) {
                        if (!painting) return;
                    
                        const rect = canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const radius = brushSize / 2;
                    
                        const imageData = hiddenCtx.getImageData(
                            x - radius,
                            y - radius,
                            brushSize,
                            brushSize
                        );
                        const data = imageData.data;
                        const cx = brushSize / 2;
                        const cy = brushSize / 2;
                    
                        const tolerance = 90; // antes tenías 20

                        const shrinkFactor = 0.3;
                    
                        let canDraw = true;
                    
                        for (let i = 0; i < brushSize; i++) {
                            for (let j = 0; j < brushSize; j++) {
                                const dx = i - cx;
                                const dy = j - cy;
                                if (dx * dx + dy * dy <= (radius * shrinkFactor) ** 2) {
                                    const index = (j * brushSize + i) * 4;
                                    const r = data[index];
                                    const g = data[index + 1];
                                    const b = data[index + 2];
                    
                                    const isWhite =
                                        r >= 255 - tolerance &&
                                        g >= 255 - tolerance &&
                                        b >= 255 - tolerance;
                    
                                    if (!isWhite) {
                                        canDraw = false;
                                        break;
                                    }
                                }
                            }
                            if (!canDraw) break;
                        }
                    
                        if (!canDraw) return;
                    
                        if (isErasing) {
                            // Borrador que dibuja un cuadrado transparente
                            ctx.globalCompositeOperation = "destination-out";
                            ctx.beginPath();
                            ctx.rect(x - radius, y - radius, brushSize, brushSize); // Dibuja un cuadrado
                            ctx.fill();
                          } else {
                            // Pincel normal
                            ctx.globalCompositeOperation = "source-over";
                            ctx.beginPath();
                            ctx.arc(x, y, radius, 0, Math.PI * 2);
                            ctx.fillStyle = selectedColor;
                            ctx.fill();
                          }
                          ctx.restore();
                        }

                    canvas.addEventListener("mousedown", () => painting = true);
                    canvas.addEventListener("mouseup", () => painting = false);
                    canvas.addEventListener("mousemove", draw);
                };
            }
        }

        // Colores dinámicos
        const colorList = ['purple', 'teal'];
        const colorContainer = document.querySelector(".color-options");

        if (colorContainer) {
            colorList.forEach(color => {
                const btn = document.createElement("button");
                btn.className = "color-option";
                btn.style.backgroundColor = color;
                btn.dataset.color = color;
                colorContainer.appendChild(btn);
            });
        }

        // Pintura y cursor
        function paint(e) {
            if (!painting) return;
        
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
        
            const radius = brushSize / 2;
            const imageData = ctx.getImageData(x - radius, y - radius, brushSize, brushSize);
            const data = imageData.data;
        
            let allWhite = true;
        
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
        
                const isPixelWhite = r === 255 && g === 255 && b === 255 && a === 255;
                if (!isPixelWhite) {
                    allWhite = false;
                    break;
                }
            }
        
            if (allWhite || isErasing) {
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = isErasing ? "white" : selectedColor;
                ctx.fill();
            }
        }
        
        function moveCursor(e) {
            if (cursor) {
                cursor.style.left = `${e.pageX - brushSize /9}px`;
                cursor.style.top = `${e.pageY - brushSize / 9}px`;
            }
        }

        canvas.addEventListener("mousedown", () => painting = true);
        canvas.addEventListener("mouseup", () => painting = false);
        canvas.addEventListener("mousemove", (e) => {
            paint(e);
            moveCursor(e);
        });

        document.addEventListener("mousemove", moveCursor);

        // Botones y control de pincel
        document.getElementById("brush")?.addEventListener("click", () => {
            isErasing = false;
            updateCursor();
            document.getElementById("brush").classList.add("marked");
            document.getElementById("erase").classList.remove("marked");
        });
        
        document.getElementById("erase")?.addEventListener("click", () => {
            isErasing = true;
            updateCursor();
            document.getElementById("erase").classList.add("marked");
            document.getElementById("brush").classList.remove("marked");
        });
        
        

        document.getElementById("increaseBrush")?.addEventListener("click", () => {
            brushSize = Math.min(40, brushSize + 2);
            document.getElementById("brushSizeCounter").textContent = brushSize;
            updateCursor();
        });

        document.getElementById("decreaseBrush")?.addEventListener("click", () => {
            brushSize = Math.max(10, brushSize - 2);
            document.getElementById("brushSizeCounter").textContent = brushSize;
            updateCursor();
        });

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
    }

    // INICIO - Menú desde index.html
    if (startButton && portada) {
        startButton.addEventListener("click", function () {
            startButton.style.display = "none";
            const pintarBtn = createButton("Pintar", "pintar");
            const competirBtn = createButton("Competir", "competir");

            pintarBtn.addEventListener("click", () => {
                limpiarPortada();
                portada.appendChild(createButton("Vocales", "vocales", "vocales.html"));
                portada.appendChild(createButton("Consonantes", "abecedario", "abecedario.html"));
                portada.appendChild(createButton("Palabras", "palabras", "palabras.html"));
            });

            competirBtn.addEventListener("click", () => window.location.href = "juego.html");

            portada.appendChild(pintarBtn);
            portada.appendChild(competirBtn);
        });

        function limpiarPortada() {
            while (portada.firstChild) portada.removeChild(portada.firstChild);
        }

        function createButton(text, id, href = null) {
            const button = document.createElement("button");
            button.textContent = text;
            button.classList.add("option-btn");
            button.id = id;
            if (href) button.addEventListener("click", () => window.location.href = href);
            return button;
        }
    }

    // VOLVER AL INICIO
    volverBtn?.addEventListener("click", () => window.location.href = "index.html");

    // Navegación entre letras y vocales
    vocales.forEach(v => {
        v.addEventListener("click", () => {
            const letraSeleccionada = v.textContent.toLowerCase();
            window.location.href = `pintar.html?vocal=${letraSeleccionada}`;
        });
    });

    letras.forEach(l => {
        l.addEventListener("click", () => {
            const letraSeleccionada = l.textContent.toLowerCase();
            window.location.href = `pintar.html?letra=${letraSeleccionada}`;
        });
    });

    // COLOR PICKER toggle
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

    // TOOLBAR
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


    // RESET CANVAS (colores de vocales)
    resetCanvasBtn?.addEventListener("click", () => {
        vocales.forEach(vocal => {
            vocal.style.color = "white";
            vocal.style.textShadow = "none";
        });
    });
});
document.getElementById('start').addEventListener('click', function() {
    document.getElementById('instrucciones').style.display = 'none';
    document.querySelector('.seleccion').style.display = 'block';
});
