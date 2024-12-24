// Archivo: js/script.js
import Partida from "../partida.js";
import Pieza from "../pieza.js";

const tokenAcceso = window.apiToken;
const partida = new Partida();
const partidaId = JSON.parse(localStorage.getItem('partidaData')).id;
const partidaColor = JSON.parse(localStorage.getItem('partidaData')).color;
let estadoPartida = "";
let casillaSeleccionada = null;
let fecha = new Date();
const horaComiezoPartida = Date.now();
let numeroSesion = JSON.parse(localStorage.getItem('partidaData')).sesion;
let fen = "";
let idPartidaPrincipal;
if (JSON.parse(localStorage.getItem('partidaData')).sesion) {
    fen = JSON.parse(localStorage.getItem('partidaData')).fen;
    idPartidaPrincipal = JSON.parse(localStorage.getItem('partidaData')).idPartidaPrincipal;
}
let casillaDestinoGuardada = "";
let piezaDestinoGuardada = "";

document.addEventListener("DOMContentLoaded", function () {
    // console.log(JSON.parse(localStorage.getItem('partidaData')));
    const themeSelector = document.getElementById('themeSelector');
    const tablero = document.getElementById('tablero');
    const body = document.body;

    // console.log(tokenAcceso + " " + partidaColor + " " + partidaId + " " + idPartidaPrincipal);

    let partidaData = JSON.parse(localStorage.getItem('partidaData'));

    //botones de moitoreo ------------------------------->
    let guardarPartida = document.getElementById("guardarPartida");
    let verFen = document.getElementById("fen")
    // let cargarFen = document.getElementById("fen");


    if (guardarPartida) {
        guardarPartida.addEventListener('click', (e) => {
            let horaActual = Date.now();
            let fin_sesion = formatFechaISO(horaActual);
            let inicio_sesion = formatFechaISO(horaComiezoPartida);
            let agregarSesion = numeroSesion + 1;
            let movimientos = estadoPartida.split(" ");
            let resultado = "enCurso"

            if (movimientos.length % 2 !== 0) {
                const movimientosSinUltimo = movimientos.slice(0, movimientos.length - 1);
                movimientos = movimientosSinUltimo;
            }
            // console.log(movimientos, typeof (movimientos), movimientos.length, movimientos[movimientos.length - 1])
            gestionarGuardarPartida({
                partidaId,
                idPartidaPrincipal,
                resultado,
                agregarSesion,
                inicio_sesion,
                fin_sesion,
                movimientos,
                partidaColor
            });
        });
    }
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

    actualizacionTablero2s() //-------------------------------------------------------------

});

function formatFechaISO(timestamp) {
    return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
}

function gestionarGuardarPartida({
    partidaId,
    idPartidaPrincipal,
    resultado,
    agregarSesion,
    inicio_sesion,
    fin_sesion,
    movimientos,
    partidaColor
}) {
    if (resultado !== "enCurso") {
        if (idPartidaPrincipal) {
            guardarPartidaAxios({
                id_partida: idPartidaPrincipal,
                partidaId,
                resultado,
                agregarSesion,
                inicio_sesion,
                fin_sesion,
                movimientos,
                partidaColor
            });
        } else {
            axios.get('/ultima-partida')
                .then(response => {
                    const id_partida = response.data.id_partida;
                    guardarPartidaAxios({
                        id_partida,
                        partidaId,
                        resultado,
                        agregarSesion,
                        inicio_sesion,
                        fin_sesion,
                        movimientos,
                        partidaColor
                    });
                })
                .catch(error => {
                    console.error(error);
                    alert('Error al obtener la última partida');
                });
        }
    } else {
        axios.post(`/abandonar-partida/${partidaId}`)
            .then(() => {
                if (idPartidaPrincipal) {
                    guardarPartidaAxios({
                        id_partida: idPartidaPrincipal,
                        partidaId,
                        resultado,
                        agregarSesion,
                        inicio_sesion,
                        fin_sesion,
                        movimientos,
                        partidaColor
                    });
                } else {
                    axios.get('/ultima-partida')
                        .then(response => {
                            const id_partida = response.data.id_partida;
                            guardarPartidaAxios({
                                id_partida,
                                partidaId,
                                resultado,
                                agregarSesion,
                                inicio_sesion,
                                fin_sesion,
                                movimientos,
                                partidaColor
                            });
                        })
                        .catch(error => {
                            console.error(error);
                            alert('Error al obtener la última partida');
                        });
                }
            })
            .catch(error => {
                console.error('Error al abandonar la partida en Lichess:', error);
                alert('No se pudo abandonar la partida en Lichess');
            });
    }
}


function guardarPartidaAxios({
    id_partida,
    partidaId,
    resultado,
    agregarSesion,
    inicio_sesion,
    fin_sesion,
    movimientos,
    partidaColor
}) {
    axios.post('/guardar-partida', {
        id_partida,
        partidaId,
        colorJugador: partidaColor,
        resultado: resultado,
        numero_sesion: agregarSesion,
        inicio_sesion,
        fin_sesion,
        partida_terminada: 0,
        movimientos
    })
        .then(response => {
            // console.log(response.data);
            alert('Partida guardada exitosamente: ' + partidaId);
            window.location.href = '/';
        })
        .catch(error => {
            console.error(error);
            alert('Error al guardar la partida: ' + partidaId);
        });
}

function actualizacionTablero2s() {
    setInterval(() => {
        esperarMovimientoBot();
    }, 10000);
}

function esperarComienzoPartida(partidaData) {
    let interval = setInterval(() => {
        if (partidaData) {
            clearInterval(interval);
            comenzarPartida(fen);
        }
    }, 100)
}

function comenzarPartida(fen) {
    // console.log(fen)
    if (fen) {
        console.log("hay un fen")
        if (partidaColor === "black") {
            partida.colocarPiezasComienzoNegrasFen(fen);
            partida.colocarPiezas();
        } else if (partidaColor === "white") {
            partida.colocarPiezasComienzoBlancasFen(fen);
            partida.colocarPiezas();

            setTimeout(() => {
                esperarMovimientoBot();
            }, 100);
        } else {
            console.log("error");
        }
    } else {
        // console.log("no hay fen")
        if (partidaColor === "black") {
            partida.colocarPiezasComienzoNegras();
            partida.colocarPiezas();
        } else if (partidaColor === "white") {
            partida.colocarPiezasComienzoBlancas();
            partida.colocarPiezas();

            setTimeout(() => {
                esperarMovimientoBot();
            }, 100);
        } else {
            console.log("error");
        }
    }
}

async function enviarMovimientoJugador(movimientoUCI) {
    // console.log("-------------------- Método del jugador --------------------");
    const url = `https://lichess.org/api/board/game/${partidaId}/move/${movimientoUCI}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenAcceso}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`Error ${response.status}: Movimiento incorrecto.`);
            const errorMessage = await response.text();
            console.error('Mensaje de error:', errorMessage);

            const movimientoInvertido = invertirMovimientoUCI(movimientoUCI);
            // console.log("Movimiento incorrecto. Revirtiendo con:", movimientoInvertido);

            if (movimientoInvertido) {
                moverPiezaUCI(movimientoInvertido);
                colocarPiezaAnteriorComer(movimientoInvertido);
            }
            return false;
        }

        partida.actualizarPosicion(movimientoUCI[0], movimientoUCI[1], movimientoUCI[2], movimientoUCI[3], false);
        // console.log("Movimiento enviado con éxito:", movimientoUCI);
        estadoPartida = estadoPartida + " " + movimientoUCI + " ";
        // console.log("Se ha actualizado el estado de la partida: " + estadoPartida);
        bloquearMovimientoJugador(true)
        deshabilitarBotonGuardar(true)
        esperarMovimientoBot();
        return true;
    } catch (error) {
        console.error("Error al enviar el movimiento del jugador:", error);
        return false;
    }
}

function invertirMovimientoUCI(movimientoUCI) {
    const origen = movimientoUCI.slice(0, 2);
    const destino = movimientoUCI.slice(2, 4);
    // console.log(origen + destino)
    if (origen !== destino) {
        return destino + origen;
    } else {
        return undefined;
    }
}

function colocarPiezaAnteriorComer(uci) {
    // console.log(uci, casillaDestinoGuardada.id, piezaDestinoGuardada)
    const origen = uci.slice(0, 2);
    const destino = uci.slice(2, 4);
    let casilla = document.getElementById(casillaDestinoGuardada.id);
    // console.log(casilla)
    casilla.appendChild(piezaDestinoGuardada);
    // console.log(casilla)
}

function bloquearMovimientoJugador(bloquear) {
    const overlay = document.getElementById('turn-overlay');
    overlay.style.display = bloquear ? 'block' : 'none';
}

function quitarSelecionPiezas() {
    let casillas = document.getElementsByClassName("casilla");
    for (let casilla of casillas) {
        if (casilla.firstChild) {
            casilla.firstChild.classList.remove("seleccionada");
        }
    };
}

function esperarMovimientoBot() {

    quitarSelecionPiezas();
    // console.log("<<< Movimiento del bot >>>");
    axios.get(`https://lichess.org/api/board/game/stream/${partidaId}`, {
        headers: {
            'Authorization': `Bearer ${tokenAcceso}`
        }
    })
        .then(response => {
            const lines = response.data.split("\n");
            lines.forEach(line => {
                if (line.trim() === "") return;

                try {
                    const event = JSON.parse(line);
                    if (event.type === "gameState") {
                        const movimientos = event.moves;
                        // console.log("Movimientos actuales:", movimientos);

                        if (comprobarCambiosPartida(movimientos)) {
                            // console.log("-------------------El estado ha cambiado-------------------");
                            moverPiezaUCI(movimientos);
                            estadoPartida = movimientos;
                        } else {
                            // console.log("-------------------El estado no ha cambiado-------------------");
                        }
                        if (event.status === "mate" || event.status === "draw") {
                            console.log("La partida ha terminado.");
                            finalizarPartida(event.status, event.winner);
                            if (event.winner) {
                                console.log(`Ganador: ${event.winner === "white" ? "Blancas" : "Negras"}`);
                            } else {
                                console.log("La partida terminó en tablas.");
                            }

                        } else {
                            // console.log("la partida sigue en curso");
                        }
                    }
                } catch (e) {
                    console.error("Error procesando línea del stream:", e);
                }
            });
        })
        .catch(error => {
            // console.log("No hay cambios")
            // console.error("Error al obtener el estado del juego:", error);
        });
}

function finalizarPartida(estado, ganador) {
    let horaActual = Date.now();
    let fin_sesion = formatFechaISO(horaActual);
    let inicio_sesion = formatFechaISO(horaComiezoPartida);
    let agregarSesion = numeroSesion + 1;
    let movimientos = estadoPartida.split(" ");
    let resultado = ""
    if (partidaColor == ganador) {
        resultado = "Ganada"
    } else if (partidaColor != ganador) {
        resultado = "Perdida"
    } else {
        resultado = "Empate"
    }


    gestionarGuardarPartida({
        partidaId,
        idPartidaPrincipal,
        resultado,
        agregarSesion,
        inicio_sesion,
        fin_sesion,
        movimientos,
        partidaColor
    });
    alert("La partida ha finalizado, resultado: " + estado)
}

function comprobarCambiosPartida(moves) {

    if (estadoPartida !== moves) {
        return true;
    } else {
        return false;
    }
}

function cambiarPeonReina(destino, pieza) {
    // console.log(destino, pieza)
    // console.log(destino.id)
    // console.log(pieza.id)
    if (true) {
        return true;
    } else {
        return false;
    }
}


function moverPiezaUCI(uci) {
    esEnroque(uci);
    // esCambioPeonReina(uci)

    estadoPartida += " " + uci;

    const origen = uci.slice(-4, -2);
    const destino = uci.slice(-2);

    let [letraOrigen, numeroOrigen] = origen.split(/(\d+)/).filter(Boolean);
    let [letraDestino, numeroDestino] = destino.split(/(\d+)/).filter(Boolean);
    letraOrigen = letraOrigen.toUpperCase();
    letraDestino = letraDestino.toUpperCase();

    let casillaOrigen = document.getElementById(letraOrigen + numeroOrigen);
    let casillaDestino = document.getElementById(letraDestino + numeroDestino);

    if (casillaDestino && casillaOrigen.innerHTML) {
        casillaDestino.innerHTML = casillaOrigen.innerHTML;
        casillaOrigen.innerHTML = "";
        bloquearMovimientoJugador(false);
        deshabilitarBotonGuardar(false)
    } else {
        // console.log("esperando... por casillas disponibles")
    }
}

function esEnroque(uci) {
    const origen = uci.slice(-4, -2);
    const destino = uci.slice(-2);
    let nuevoUci = origen + destino;

    switch (nuevoUci) {
        case 'e1g1':
            moverPiezaUCI("h1f1");
            bloquearMovimientoJugador(true);
            break;
        case 'e8g8':
            moverPiezaUCI("h8f8");
            bloquearMovimientoJugador(true);
            break;
        case 'e1c1':
            moverPiezaUCI("a1d1");
            bloquearMovimientoJugador(true);
            break;
        case 'e8c8':
            moverPiezaUCI("a8d8");
            bloquearMovimientoJugador(true);
            break;
        default:
        // console.log("no es enroque")
    }
}

function deshabilitarBotonGuardar(e) {
    const boton = document.getElementById('guardarPartida');
    if (boton) {
        // console.log("boton")
        if (e) {
            boton.disabled = true;
            boton.classList.add('disabled');
        } else {
            boton.disabled = false;
            boton.classList.remove('disabled');
        }
    }
}


function clickEnCasilla(event) {
    const casilla = event.target.closest(".casilla");
    const pieza = casilla.querySelector(".pieza");

    // console.log(pieza)
    if (pieza) {
        if (pieza.id[1] == "N") {
            if (!casillaSeleccionada) {
                // console.log("Negro")
                return
            }
        } else {
            // console.log("Blanco")
        }
    }

    if (casillaSeleccionada) {
        const origenId = casillaSeleccionada.id;
        const destinoId = casilla.id;

        if (moverPiezaClick(origenId, destinoId)) {
            let uci = origenId.toLowerCase() + destinoId.toLowerCase();
            // console.log(uci, destinoId)
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
    }
}

function moverPiezaClick(origenId, destinoId) {
    const [letraOrigen, numeroOrigen] = origenId.split(/(\d+)/).filter(Boolean);
    const [letraDestino, numeroDestino] = destinoId.split(/(\d+)/).filter(Boolean);

    const casillaOrigen = document.getElementById(origenId);
    const casillaDestino = document.getElementById(destinoId);
    const pieza = casillaOrigen.querySelector(".pieza");

    casillaDestinoGuardada = casillaDestino;
    piezaDestinoGuardada = casillaDestino.querySelector(".pieza");

    if (pieza && casillaDestino) {
        let piezaDestino = casillaDestino.querySelector(".pieza");

        if (cambiarPeonReina(casillaDestino, pieza)) {

            if (piezaDestino) {
                casillaDestino.removeChild(piezaDestino);
                casillaDestino.appendChild(pieza)
            } else {
                casillaDestino.appendChild(pieza);
            }
        }

        pieza.classList = "pieza";
        return true;
    } else {
        console.error("Movimiento inválido: origen o destino no válido.");
        return false;
    }
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e, partida) {

    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const [piezaId, origenId] = data.split(',');
    const pieza = document.getElementById(piezaId);

    const casillaDestino = e.target.closest('.casilla');
    

    // const [letraOrigen, numeroOrigen] = origenId.split(/(\d+)/).filter(Boolean);
    // const [letraDestino, numeroDestino] = e.target.id.split(/(\d+)/).filter(Boolean);

    if (enviarMovimientoJugador(partida.saberMovimientoEnUCI(data, casillaDestino.id))) {
        let piezaDestino = casillaDestino.querySelector(".pieza");
        if (piezaDestino) {
            casillaDestino.removeChild(piezaDestino);
            casillaDestino.appendChild(pieza)
        } else {
            casillaDestino.appendChild(pieza);
        }
        // actualizarTablero();
    } else {
        // console.log("hola")
    }

}

document.addEventListener('dragstart', function (e) {
    if (e.target.classList.contains('pieza')) {
        const origenId = e.target.parentElement.id;
        e.dataTransfer.setData("text", `${e.target.id},${origenId}`);
    }
});

function reload() {
    window.location.reload();
}
