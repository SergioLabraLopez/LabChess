// Archivo: js/script.js
import Partida from "../js/partida.js";

document.addEventListener("DOMContentLoaded", function () {
    const themeSelector = document.getElementById('themeSelector');
    const tablero = document.getElementById('tablero');
    const body = document.body;

    const partida = new Partida();

    partida.colocarPiezasComienzoNegras();

    console.table(partida);
    console.log(partida.Posicines);

    let startButtonBlack = document.getElementById("negras");
    let startButtonWhite = document.getElementById("blancas");

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

    document.getElementById("clear").addEventListener('click', (e) => {
        partida.eliminarPiezas();
        startButtonBlack.disabled = false;
        startButtonWhite.disabled = false;
    });

    document.getElementById("posiciones").addEventListener('click', (e) => {
        partida.verPosiciones();
    });

    let casillas = document.getElementsByClassName("casilla");

    for (let casilla of casillas) {
        casilla.addEventListener('click', function (e) {
            clickEnCasilla(e, partida);
        });
        casilla.addEventListener('dragover', dragOver);
        casilla.addEventListener('drop', function (e) {
            drop(e, partida);
        });
    };

    const themes = {
        'default-theme': '3d',
        'default-theme-black': 'paint',
        'theme1': 'theme1',
        'theme2': 'theme1',
        'theme3': 'theme3',
        'theme4': 'theme4',
        'wood': 'metal',
        'ice': 'metal'
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

    document.getElementById("moverUciButton").addEventListener('click', function () {
        const uciMove = document.getElementById("uciMove").value;
        if (uciMove.length === 4) {  // Asegúrate de que el formato UCI sea correcto
            moverPiezaUCI(partida, uciMove);
        } else {
            console.log("Formato UCI inválido");
        }
    });


    let partidaData = JSON.parse(localStorage.getItem('partidaData'));

    if (partidaData) {
        let partidaId = partidaData.id;
        let colorPartida = partidaData.color;

        console.log('ID de la partida:', partidaId);
        console.log('Color de la partida:', colorPartida);
    } else {
        console.log('No se encontraron datos de la partida en localStorage.');
    }
    localStorage.removeItem('partidaData');
});

function clickEnCasilla(e, partida) {
    let casillaId = e.target.id;
    partida.buscarEnCasilla(casillaId);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e, partida) {

    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const [piezaId, origenId] = data.split(',');
    const pieza = document.getElementById(piezaId);



    //continuar con la casilla de destino
    const casillaDestino = e.target.closest('.casilla');
    console.log(casillaDestino)

    if (e.target.classList.contains("casilla")) {

        // console.log("pieza sin comer")
        const [letraOrigen, numeroOrigen] = origenId.split(/(\d+)/).filter(Boolean);
        const [letraDestino, numeroDestino] = e.target.id.split(/(\d+)/).filter(Boolean);
        console.log(letraDestino, numeroDestino)

        partida.saberMovimientoEnUCI(data, letraDestino, numeroDestino);

        if (partida.verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino)) {
            e.target.appendChild(pieza);
            partida.actualizarPosicion(letraOrigen, numeroOrigen, letraDestino, numeroDestino, false);
        } else {
            console.log(`Movimiento inválido para la pieza ${pieza.id}`);
        }
    } else {
        // console.log("pieza comer")
        const [letraOrigen, numeroOrigen] = origenId.split(/(\d+)/).filter(Boolean);
        const [letraDestino, numeroDestino] = casillaDestino.id.split(/(\d+)/).filter(Boolean);
        // console.log(letraOrigen, numeroOrigen, letraDestino, numeroDestino)
        if (partida.comerOtraPieza(letraOrigen, numeroOrigen, letraDestino, numeroDestino)) {
            partida.actualizarPosicion(letraOrigen, numeroOrigen, letraDestino, numeroDestino, true);

        } else {
            // console.log("no actualizo")
        }
    }
}

function moverPiezaUCI(partida, uci) {
    // console.log(uci)
    const origen = uci.slice(0, 2);  // Los primeros dos caracteres son la casilla de origen
    const destino = uci.slice(2, 4); // Los últimos dos son la casilla de destino
    // console.log(origen + " - " + destino)
    let [letraOrigen, numeroOrigen] = origen.split(/(\d+)/).filter(Boolean);
    let [letraDestino, numeroDestino] = destino.split(/(\d+)/).filter(Boolean);
    letraOrigen = letraOrigen.toUpperCase();
    letraDestino = letraDestino.toUpperCase();

    // console.log(letraOrigen + " - " + numeroOrigen);
    // console.log(letraDestino + " - " + numeroDestino);

    let casillaOrigen = document.getElementById(letraOrigen + numeroOrigen);
    let casillaDestino = document.getElementById(letraDestino + numeroDestino);

// console.log(casillaOrigen + " - " + casillaDestino)

    casillaDestino.innerHTML = casillaOrigen.innerHTML;
    casillaOrigen.innerHTML = "";

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
