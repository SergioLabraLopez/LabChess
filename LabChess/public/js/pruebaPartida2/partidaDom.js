// Archivo: js/script.js
import Partida from "../partida.js";
import Pieza from "../pieza.js";

const tokenAcceso = window.apiToken;
const partida = new Partida();
const partidaId = JSON.parse(localStorage.getItem('partidaData')).id;
const partidaColor = JSON.parse(localStorage.getItem('partidaData')).color;
let estadoPartida = "";

document.addEventListener("DOMContentLoaded", function () {
    const themeSelector = document.getElementById('themeSelector');
    const tablero = document.getElementById('tablero');
    const body = document.body;

    console.log(tokenAcceso + " " + partidaColor + " " + partidaId);

    let partidaData = JSON.parse(localStorage.getItem('partidaData'));

    // Configuración de botones
    let startButtonBlack = document.getElementById("negras");
    let startButtonWhite = document.getElementById("blancas");
    let actualizarButton = document.getElementById("actualizar");

    startButtonBlack.addEventListener('click', () => {
        partida.colocarPiezasComienzoNegras();
        partida.colocarPiezas();
        startButtonWhite.disabled = true;
        startButtonBlack.disabled = true;
    });

    startButtonWhite.addEventListener('click', () => {
        partida.colocarPiezasComienzoBlancas();
        partida.colocarPiezas();
        startButtonWhite.disabled = true;
        startButtonBlack.disabled = true;
    });

    actualizarButton.addEventListener('click', () => {
        partida.eliminarPiezas();
        let colorPartida = partidaData.color;
        if (colorPartida === "white") {
            partida.colocarPiezasComienzoNegras();
        } else if (colorPartida === "black") {
            partida.colocarPiezasComienzoBlancas();
        }
        partida.colocarPiezas();
        actualizarTablero();
    });

    document.getElementById("clear").addEventListener('click', () => {
        partida.eliminarPiezas();
        startButtonBlack.disabled = false;
        startButtonWhite.disabled = false;
    });

    document.getElementById("moverUciButton").addEventListener('click', function () {
        const uciMove = document.getElementById("uciMove").value;
        if (uciMove.length === 4) {
            moverPiezaUCI(partida, uciMove);
        } else {
            console.log("Formato UCI inválido");
        }
    });

    // Ajuste del tema visual
    const themes = {
        'default-theme': '3d',
        'default-theme-black': 'paint',
        'theme1': 'theme1',
        'theme2': 'theme1',
        'theme3': '3d',
        'theme4': 'metal',
        'wood': 'metal',
        'ice': 'ice'
    };

    function changeTheme(theme) {
        Object.keys(themes).forEach(t => {
            body.classList.remove(t);
            tablero.classList.remove(t);
        });

        body.classList.add(theme);
        tablero.classList.add(theme);
        partida.Tema = `storage/${themes[theme]}/piezas`;
    }

    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        themeSelector.value = savedTheme;
        changeTheme(savedTheme);
    } else {
        changeTheme('default-theme');
    }

    themeSelector.addEventListener('change', function () {
        const selectedTheme = themeSelector.value;
        changeTheme(selectedTheme);
        localStorage.setItem('selectedTheme', selectedTheme);
    });

    esperarComienzoPartida(partidaData);
});

function esperarComienzoPartida(partidaData) {
    let interval = setInterval(() => {
        if (partidaData) {
            clearInterval(interval);
            comenzarPartida();
        }
    }, 100);
}

function comenzarPartida() {
    if (partidaColor === "white") {
        partida.colocarPiezasComienzoNegras();
        partida.colocarPiezas();
    } else if (partidaColor === "black") {
        partida.colocarPiezasComienzoBlancas();
        partida.colocarPiezas();
        esperarMovimientoBot();
    } else {
        console.log("error");
    }
}

async function esperarMovimientoBot() {
    console.log("Esperando movimiento del bot...");
    const url = `https://lichess.org/api/board/game/stream/${partidaId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tokenAcceso}`
        }
    });

    if (!response.ok) {
        console.error(`Error ${response.status}: No se pudo establecer la conexión con Lichess.`);
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line) {
                const data = JSON.parse(line);

                if (data.type === 'gameFull' || data.type === 'gameState') {
                    const estadoActual = data.state ? data.state.moves : null;
                    if (estadoActual && estadoActual !== estadoPartida) {
                        estadoPartida = estadoActual;
                        const movimientos = estadoActual.split(' ');
                        const movimientoBot = movimientos[movimientos.length - 1];
                        moverPiezaUCI(movimientoBot);
                    } else {
                        console.log("Estado no ha cambiado, esperando...");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
        }
        buffer = lines[lines.length - 1];
    }
}

function moverPiezaUCI(uci) {
    estadoPartida += " " + uci;
    const origen = uci.slice(-4, -2);  
    const destino = uci.slice(-2);

    let [colOrigen, filaOrigen] = [origen[0].charCodeAt(0) - 97, 8 - parseInt(origen[1])];
    let [colDestino, filaDestino] = [destino[0].charCodeAt(0) - 97, 8 - parseInt(destino[1])];

    partida.actualizarPosicion(filaOrigen, colOrigen, filaDestino, colDestino);

    let casillaOrigen = document.getElementById(`${origen}`);
    let casillaDestino = document.getElementById(`${destino}`);

    if (casillaDestino && casillaOrigen.innerHTML) {
        casillaDestino.innerHTML = casillaOrigen.innerHTML;
        casillaOrigen.innerHTML = "";
    } else {
        console.error("Error al mover la pieza: origen o destino no válido.");
    }
}

function actualizarTablero() {
    for (let fila = 0; fila < 8; fila++) {
        for (let columna = 0; columna < 8; columna++) {
            const cellId = `cell-${fila}-${columna}`;
            const celda = document.getElementById(cellId);
            const pieza = tableroArray[fila][columna];
            
            // Limpiar la celda antes de agregar una nueva pieza
            celda.innerHTML = '';

            if (pieza) {
                // Crear un nuevo elemento para la pieza y agregarlo a la celda
                const piezaElem = document.createElement("div");
                piezaElem.classList.add("pieza", pieza); // clase "pieza" más el código de la pieza, e.g., "pieza P" para peón
                piezaElem.setAttribute("draggable", true); // Hacerla arrastrable
                piezaElem.dataset.pieza = pieza; // Guardar el tipo de pieza en un atributo personalizado
                celda.appendChild(piezaElem);
            }
        }
    }
}

function clickEnCasilla(e, partida) {
    let casillaId = e.target.id;
    partida.buscarEnCasilla(casillaId);
}

function drop(event, filaDestino, columnaDestino) {
    event.preventDefault();

    // Obtener la pieza arrastrada desde el evento
    const pieza = event.dataTransfer.getData("pieza");
    const [filaOrigen, columnaOrigen] = event.dataTransfer.getData("origen").split('-').map(Number);

    // Actualizar el array bidimensional
    tableroArray[filaOrigen][columnaOrigen] = null; // Limpiar la posición original
    tableroArray[filaDestino][columnaDestino] = pieza; // Colocar la pieza en la nueva posición

    // Actualizar el tablero visual
    actualizarTablero(tableroArray);
}

