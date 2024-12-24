// Archivo: js/script.js
import Partida from "../partida.js";
import Pieza from "../pieza.js";

const tokenAcceso = window.apiToken;
const partida = new Partida();
const partidaId = JSON.parse(localStorage.getItem('partidaData')).id;
const partidaColor = JSON.parse(localStorage.getItem('partidaData')).color;
let estadoPartida = "";
let casillaSeleccionada = null;

document.addEventListener("DOMContentLoaded", function () {
    console.log(JSON.parse(localStorage.getItem('partidaData')));
    const themeSelector = document.getElementById('themeSelector');
    const tablero = document.getElementById('tablero');
    const body = document.body;

    console.log(tokenAcceso + " " + partidaColor + " " + partidaId);

    let partidaData = JSON.parse(localStorage.getItem('partidaData'));

    //botones de moitoreo ------------------------------->
    let startButtonBlack = document.getElementById("negras");
    let startButtonWhite = document.getElementById("blancas");
    let actualizarButton = document.getElementById("actualizar");
    // let cargarFen = document.getElementById("fen");

    startButtonBlack.addEventListener('click', (e) => {
        partida.colocarPiezasComienzoNegras();
        partida.colocarPiezas();
        startButtonWhite.disabled = true;
        startButtonBlack.disabled = true;
    });

    startButtonWhite.addEventListener('click', (e) => {
        partida.colocarPiezasComienzoBlancas();
        partida.colocarPiezas();
        startButtonWhite.disabled = true;
        startButtonBlack.disabled = true;
    });

    actualizarButton.addEventListener('click', (e) => {
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

    // cargarFen.addEventListener('click', (e) => {
    //     let fen = pedirFenApi();
    // });

    document.getElementById("clear").addEventListener('click', (e) => {
        partida.eliminarPiezas();
        startButtonBlack.disabled = false;
        startButtonWhite.disabled = false;
    });

    document.getElementById("posiciones").addEventListener('click', (e) => {
        partida.verPosiciones();
    });

    document.getElementById("moverUciButton").addEventListener('click', function () {
        const uciMove = document.getElementById("uciMove").value;
        if (uciMove.length === 4) {
            moverPiezaUCI(partida, uciMove);
        } else {
            console.log("Formato UCI inválido");
        }
    });
    // ------------------------------->

    // colocacion de casillas ------------------------------->
    let casillas = document.getElementsByClassName("casilla");

    for (let casilla of casillas) {
        casilla.addEventListener('click', function (e) {
            clickEnCasilla(e);
        });
        casilla.addEventListener('dragover', dragOver);
        casilla.addEventListener('drop', function (e) {
            drop(e, partida);
        });
    };
    // ------------------------------->

    // ajuste de los posibles temas de la app ------------------------------->
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

        // partida.Tema = `/proyecto/tableroAjedrez/img/${themes[theme]}/piezas`; hay veces que no funciona la ruta de las imagenes de las piezas

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
    // ------------------------------->

    esperarComienzoPartida(partidaData);

});

function esperarComienzoPartida(partidaData) {
    let interval = setInterval(() => {
        if (partidaData) {
            clearInterval(interval);
            comenzarPartida();
        }
    }, 100)
}

function comenzarPartida() {
    if (partidaColor === "white") {
        // Si el jugador es blanco
        partida.colocarPiezasComienzoNegras();
        partida.colocarPiezas();

    } else if (partidaColor === "black") {
        // Si el jugador es negro
        partida.colocarPiezasComienzoBlancas();
        partida.colocarPiezas();
        esperarMovimientoBot();
    } else {
        console.log("error");
    }
}

async function esperarMovimientoBot() {
    console.log("-------------------- Metodo del bot --------------------");
    console.log(tokenAcceso)
    const url = `https://lichess.org/api/board/game/stream/${partidaId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tokenAcceso}`
        }
    });

    if (!response.ok) {
        // suele llegar a esta parte cuando el bot está ocupado y la partida tiene que esperar
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
                console.log("Datos recibidos:", data);
                console.log("Datos partida guardados: " + estadoPartida);

                if (data.type === 'gameFull' || data.type === 'gameState') {
                    const estadoActual = data.state ? data.state.moves : null;

                    console.log(estadoPartida + " - " + estadoActual)

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




async function enviarMovimientoJugador(movimientoUCI) {
    console.log("-------------------- Metodo del jugador --------------------")
    const url = `https://lichess.org/api/board/game/${partidaId}/move/${movimientoUCI}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${tokenAcceso}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        console.error(`Error ${response.status}: No se pudo enviar el movimiento.`);
        const errorMessage = await response.text();
        console.error('Mensaje de error:', errorMessage);
        return false;
    }

    console.log("Movimiento enviado con éxito:", movimientoUCI);
    const result = await response.json();
    console.log(result)
    // estadoPartida += " " + movimientoUCI;
    console.log(estadoPartida)
    esperarMovimientoBot();
    return result;
}

function moverPiezaUCI(uci, metodoActualizar) {

    if (metodoActualizar) {
        console.log(uci)
        console.log(estadoPartida)
    }

    estadoPartida += " " + uci;


    const origen = uci.slice(-4, -2);  // Los dos caracteres antes del final son la casilla de origen
    const destino = uci.slice(-2);     // Los últimos dos son la casilla de destino

    // console.log(origen + " - " + destino)

    let [letraOrigen, numeroOrigen] = origen.split(/(\d+)/).filter(Boolean);
    let [letraDestino, numeroDestino] = destino.split(/(\d+)/).filter(Boolean);
    letraOrigen = letraOrigen.toUpperCase();
    letraDestino = letraDestino.toUpperCase();

    partida.actualizarPosicion(letraOrigen, numeroOrigen, letraDestino, numeroDestino);

    let casillaOrigen = document.getElementById(letraOrigen + numeroOrigen);
    let casillaDestino = document.getElementById(letraDestino + numeroDestino);

    if (casillaDestino && casillaOrigen.innerHTML) {
        casillaDestino.innerHTML = casillaOrigen.innerHTML;
        casillaOrigen.innerHTML = "";
    } else {
        console.error("Error al mover la pieza: origen o destino no válido.");
    }
}

async function actualizarTablero() {
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
                console.log("Datos recibidos:", data);

                if (data.type === 'gameFull' || data.type === 'gameState') {
                    const movimientos = data.state.moves.split(' ');

                    for (let movimiento of movimientos) {
                        await moverPiezaUCI(movimiento, false);
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
            }
        }

        buffer = lines[lines.length - 1];
    }
}


function clickEnCasilla(event) {
    const casilla = event.target.closest(".casilla");
    const pieza = casilla.querySelector(".pieza");

    if (casillaSeleccionada) {
        const origenId = casillaSeleccionada.id;
        const destinoId = casilla.id;

        if (moverPiezaClick(origenId, destinoId)) {
            let uci = origenId.toLowerCase() + destinoId.toLowerCase();
            console.log(uci)
            enviarMovimientoJugador(uci);
        }

        const piezaSeleccionada = casillaSeleccionada.querySelector(".pieza");
        if (piezaSeleccionada) {
            piezaSeleccionada.classList.remove("seleccionada");
        }
        casillaSeleccionada = null;
    } else if (pieza) {
        casillaSeleccionada = casilla;
        pieza.classList.add("seleccionada");
        console.log(pieza)
    }
}

function moverPiezaClick(origenId, destinoId) {
    const [letraOrigen, numeroOrigen] = origenId.split(/(\d+)/).filter(Boolean);
    const [letraDestino, numeroDestino] = destinoId.split(/(\d+)/).filter(Boolean);

    const casillaOrigen = document.getElementById(origenId);
    const casillaDestino = document.getElementById(destinoId);
    const pieza = casillaOrigen.querySelector(".pieza");

    console.log(casillaDestino)

    if (pieza && casillaDestino) {
        let piezaDestino = casillaDestino.querySelector(".pieza");
        if (piezaDestino) {
            casillaDestino.removeChild(piezaDestino);
            casillaDestino.appendChild(pieza)
        } else {
            casillaDestino.appendChild(pieza);
        }

        partida.actualizarPosicion(letraOrigen, numeroOrigen, letraDestino, numeroDestino);
        pieza.classList = "pieza";
        return true;
    } else {
        console.error("Movimiento inválido: origen o destino no válido.");
        return false;
    }
}

// funciones para mover las piezas
function dragOver(e) {
    e.preventDefault();
}

function drop(e, partida) {

    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const [piezaId, origenId] = data.split(',');
    const pieza = document.getElementById(piezaId);

    const casillaDestino = e.target.closest('.casilla');

    const [letraOrigen, numeroOrigen] = origenId.split(/(\d+)/).filter(Boolean);
    const [letraDestino, numeroDestino] = e.target.id.split(/(\d+)/).filter(Boolean);

    if (enviarMovimientoJugador(partida.saberMovimientoEnUCI(data, casillaDestino.id))) {
        let piezaDestino = casillaDestino.querySelector(".pieza");
        if (piezaDestino) {
            casillaDestino.removeChild(piezaDestino);
            casillaDestino.appendChild(pieza)
        } else {
            casillaDestino.appendChild(pieza);
        }
        partida.actualizarPosicion(letraOrigen, numeroOrigen, letraDestino, numeroDestino);
        // actualizarTablero();
    } else {
        console.log("hola")
    }

}

// async function pedirFenApi() {
//     const token = 'TU_TOKEN_DE_LICHESS'; // Inserta tu token de Lichess aquí
//     const url = `https://lichess.org/api/stream/game/${partidaId}`;

//     try {
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         console.log(response)

//         if (!response.ok) {
//             throw new Error('Error al obtener el estado del juego');
//         }

//         const data = await response.json();
//         console.log("FEN:", data.fen); // Aquí puedes manipular el FEN recibido

//     } catch (error) {
//         console.error("Hubo un error:", error);
//     }
// }

// Inicializa todas las piezas para que se puedan mover
document.addEventListener('dragstart', function (e) {
    if (e.target.classList.contains('pieza')) {
        const origenId = e.target.parentElement.id;
        e.dataTransfer.setData("text", `${e.target.id},${origenId}`);
    }
});

function reload() {
    window.location.reload();
}
