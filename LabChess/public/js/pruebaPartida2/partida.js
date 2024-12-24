import Alfil from "./piezas/alfil.js"
import Caballo from "./piezas/caballo.js"
import Peon from "./piezas/peon.js"
import Reina from "./piezas/reina.js"
import Rey from "./piezas/rey.js"
import Torre from "./piezas/torre.js"
// import ChessLibreria from "./chessLibreria.js"

const tablero = [{ "A": null, "B": null, "C": null, "D": null, "E": null, "F": null, "G": null, "H": null },
{ "A": null, "B": null, "C": null, "D": null, "E": null, "F": null, "G": null, "H": null },
{ "A": null, "B": null, "C": null, "D": null, "E": null, "F": null, "G": null, "H": null },
{ "A": null, "B": null, "C": null, "D": null, "E": null, "F": null, "G": null, "H": null },
{ "A": null, "B": null, "C": null, "D": null, "E": null, "F": null, "G": null, "H": null },
{ "A": null, "B": null, "C": null, "D": null, "E": null, "F": null, "G": null, "H": null },
{ "A": null, "B": null, "C": null, "D": null, "E": null, "F": null, "G": null, "H": null },
{ "A": null, "B": null, "C": null, "D": null, "E": null, "F": null, "G": null, "H": null }]

const letras = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7 }

class Partida {

    #posiciones
    #tema

    constructor() {
        // this.#posiciones = new Array();
        this.#posiciones = tablero
    }

    saberMovimientoEnUCI(data, idCasillaDestino) {

        // console.log(data[4], data[5], idCasillaDestino[0], idCasillaDestino[1]);
        let uci = data[4].toLowerCase() + data[5] + idCasillaDestino[0].toLowerCase() + idCasillaDestino[1];

        // console.log(uci);
        return uci;
    }

    // todavía no se va a implementar el método
    // cargarDesdeFEN(fen) {
    //     const [posicion] = fen.split(" ");
    //     const filas = posicion.split("/");

    //     filas.forEach((fila, y) => {
    //         let x = 0;

    //         for (const char of fila) {
    //             if (isNaN(char)) {
    //                 // Determinar el tipo de pieza y color
    //                 const color = char === char.toUpperCase() ? "blanco" : "negro";
    //                 const tipo = char.toLowerCase();
    //                 const columna = Object.keys(letras)[x];
    //                 const filaTablero = 7 - y; // Convertir la fila FEN al índice del tablero

    //                 // Colocar la pieza en el tablero
    //                 this.colocarPieza(tipo, color, columna, filaTablero);
    //                 x += 1;
    //             } else {
    //                 x += parseInt(char, 10); // Saltar las casillas vacías
    //             }
    //         }
    //     });
    // }

    // colocarPieza(tipo, color, columna, fila) {
    //     const posicion = `${columna}${fila + 1}`;
    //     let pieza;

    //     switch (tipo) {
    //         case 'p':
    //             pieza = new Peon(`P${color === "blanco" ? "B" : "N"}${fila}`, posicion);
    //             break;
    //         case 'r':
    //             pieza = new Torre(`T${color === "blanco" ? "B" : "N"}`, posicion);
    //             break;
    //         case 'n':
    //             pieza = new Caballo(`C${color === "blanco" ? "B" : "N"}`, posicion);
    //             break;
    //         case 'b':
    //             pieza = new Alfil(`A${color === "blanco" ? "B" : "N"}`, posicion);
    //             break;
    //         case 'q':
    //             pieza = new Reina(`Q${color === "blanco" ? "B" : "N"}`, posicion);
    //             break;
    //         case 'k':
    //             pieza = new Rey(`R${color === "blanco" ? "B" : "N"}`, posicion);
    //             break;
    //         default:
    //             console.log(`Tipo de pieza no válido: ${tipo}`);
    //             return;
    //     }

    //     this.#posiciones[fila][columna] = pieza;
    // }



    colocarPiezasComienzoBlancas() {
        // Colocar reyes
        this.#posiciones[0]["E"] = new Rey("RN", "E1");
        this.#posiciones[7]["E"] = new Rey("RB", "E8");
        // Colocar reinas
        this.#posiciones[0]["D"] = new Reina("QN", "D1");
        this.#posiciones[7]["D"] = new Reina("QB", "D8");
        // Colocar torres
        this.#posiciones[0]["A"] = new Torre("TNI", "A1");
        this.#posiciones[0]["H"] = new Torre("TND", "H1");
        this.#posiciones[7]["A"] = new Torre("TBI", "A8");
        this.#posiciones[7]["H"] = new Torre("TBD", "H8");
        // Colocar caballos
        this.#posiciones[0]["B"] = new Caballo("CNI", "B1");
        this.#posiciones[0]["G"] = new Caballo("CND", "G1");
        this.#posiciones[7]["B"] = new Caballo("CBI", "B8");
        this.#posiciones[7]["G"] = new Caballo("CBD", "G8");
        // Colocar alfiles
        this.#posiciones[0]["C"] = new Alfil("ANI", "C1");
        this.#posiciones[0]["F"] = new Alfil("AND", "F1");
        this.#posiciones[7]["C"] = new Alfil("ABI", "C8");
        this.#posiciones[7]["F"] = new Alfil("ABD", "F8");
        // Colocar peones
        this.#posiciones[1]["A"] = new Peon("PN0", "A2");
        this.#posiciones[1]["B"] = new Peon("PN1", "B2");
        this.#posiciones[1]["C"] = new Peon("PN2", "C2");
        this.#posiciones[1]["D"] = new Peon("PN3", "D2");
        this.#posiciones[1]["E"] = new Peon("PN4", "E2");
        this.#posiciones[1]["F"] = new Peon("PN5", "F2");
        this.#posiciones[1]["G"] = new Peon("PN6", "G2");
        this.#posiciones[1]["H"] = new Peon("PN7", "H2");

        this.#posiciones[6]["A"] = new Peon("PB0", "A7");
        this.#posiciones[6]["B"] = new Peon("PB1", "B7");
        this.#posiciones[6]["C"] = new Peon("PB2", "C7");
        this.#posiciones[6]["D"] = new Peon("PB3", "D7");
        this.#posiciones[6]["E"] = new Peon("PB4", "E7");
        this.#posiciones[6]["F"] = new Peon("PB5", "F7");
        this.#posiciones[6]["G"] = new Peon("PB6", "G7");
        this.#posiciones[6]["H"] = new Peon("PB7", "H7");
    }

    colocarPiezasComienzoNegras() {
        // Colocar reyes
        this.#posiciones[0]["E"] = new Rey("RB", "E1");
        this.#posiciones[7]["E"] = new Rey("RN", "E8");
        // Colocar reinas
        this.#posiciones[0]["D"] = new Reina("QB", "D1");
        this.#posiciones[7]["D"] = new Reina("QN", "D8");
        // Colocar torres
        this.#posiciones[0]["A"] = new Torre("TBI", "A1");
        this.#posiciones[0]["H"] = new Torre("TBD", "H1");
        this.#posiciones[7]["A"] = new Torre("TNI", "A8");
        this.#posiciones[7]["H"] = new Torre("TND", "H8");
        // Colocar caballos
        this.#posiciones[0]["B"] = new Caballo("CBI", "B1");
        this.#posiciones[0]["G"] = new Caballo("CBD", "G1");
        this.#posiciones[7]["B"] = new Caballo("CNI", "B8");
        this.#posiciones[7]["G"] = new Caballo("CND", "G8");
        // Colocar alfiles
        this.#posiciones[0]["C"] = new Alfil("ABI", "C1");
        this.#posiciones[0]["F"] = new Alfil("ABD", "F1");
        this.#posiciones[7]["C"] = new Alfil("ANI", "C8");
        this.#posiciones[7]["F"] = new Alfil("AND", "F8");
        // Colocar peones
        this.#posiciones[1]["A"] = new Peon("PB0", "A2");
        this.#posiciones[1]["B"] = new Peon("PB1", "B2");
        this.#posiciones[1]["C"] = new Peon("PB2", "C2");
        this.#posiciones[1]["D"] = new Peon("PB3", "D2");
        this.#posiciones[1]["E"] = new Peon("PB4", "E2");
        this.#posiciones[1]["F"] = new Peon("PB5", "F2");
        this.#posiciones[1]["G"] = new Peon("PB6", "G2");
        this.#posiciones[1]["H"] = new Peon("PB7", "H2");

        this.#posiciones[6]["A"] = new Peon("PN0", "A7");
        this.#posiciones[6]["B"] = new Peon("PN1", "B7");
        this.#posiciones[6]["C"] = new Peon("PN2", "C7");
        this.#posiciones[6]["D"] = new Peon("PN3", "D7");
        this.#posiciones[6]["E"] = new Peon("PN4", "E7");
        this.#posiciones[6]["F"] = new Peon("PN5", "F7");
        this.#posiciones[6]["G"] = new Peon("PN6", "G7");
        this.#posiciones[6]["H"] = new Peon("PN7", "H7");
    }

    // colocarPiezasComienzoNegras() {
    //     // Colocar reyes
    //     this.#posiciones[7]["E"] = new Rey("RN", "E8");
    //     this.#posiciones[0]["E"] = new Rey("RB", "E1");
    //     // Colocar reinas
    //     this.#posiciones[7]["D"] = new Reina("QN", "D8");
    //     this.#posiciones[0]["D"] = new Reina("QB", "D1");
    //     // Colocar torres
    //     this.#posiciones[7]["A"] = new Torre("TNI", "A8");
    //     this.#posiciones[7]["H"] = new Torre("TND", "H8");
    //     this.#posiciones[0]["A"] = new Torre("TBI", "A1");
    //     this.#posiciones[0]["H"] = new Torre("TBD", "H1");
    //     // Colocar caballos
    //     this.#posiciones[7]["B"] = new Caballo("CNI", "B8");
    //     this.#posiciones[7]["G"] = new Caballo("CND", "G8");
    //     this.#posiciones[0]["B"] = new Caballo("CBI", "B1");
    //     this.#posiciones[0]["G"] = new Caballo("CBD", "G1");
    //     // Colocar alfiles
    //     this.#posiciones[7]["C"] = new Alfil("ANI", "C8");
    //     this.#posiciones[7]["F"] = new Alfil("AND", "F8");
    //     this.#posiciones[0]["C"] = new Alfil("ABI", "C1");
    //     this.#posiciones[0]["F"] = new Alfil("ABD", "F1");
    //     // Colocar peones
    //     this.#posiciones[6]["A"] = new Peon("PN0", "A7");
    //     this.#posiciones[6]["B"] = new Peon("PN1", "B7");
    //     this.#posiciones[6]["C"] = new Peon("PN2", "C7");
    //     this.#posiciones[6]["D"] = new Peon("PN3", "D7");
    //     this.#posiciones[6]["E"] = new Peon("PN4", "E7");
    //     this.#posiciones[6]["F"] = new Peon("PN5", "F7");
    //     this.#posiciones[6]["G"] = new Peon("PN6", "G7");
    //     this.#posiciones[6]["H"] = new Peon("PN7", "H7");

    //     this.#posiciones[1]["A"] = new Peon("PB0", "A2");
    //     this.#posiciones[1]["B"] = new Peon("PB1", "B2");
    //     this.#posiciones[1]["C"] = new Peon("PB2", "C2");
    //     this.#posiciones[1]["D"] = new Peon("PB3", "D2");
    //     this.#posiciones[1]["E"] = new Peon("PB4", "E2");
    //     this.#posiciones[1]["F"] = new Peon("PB5", "F2");
    //     this.#posiciones[1]["G"] = new Peon("PB6", "G2");
    //     this.#posiciones[1]["H"] = new Peon("PB7", "H2");
    // }

    colocarPiezas() {
        for (let fila = 0; fila < 8; fila++) {
            for (let columna in this.#posiciones[fila]) {
                let pieza = this.#posiciones[fila][columna];
                if (pieza !== null) {
                    let rutaPieza = "";
                    switch (pieza.constructor.name) {
                        case "Torre":
                        case "Caballo":
                        case "Alfil":
                        case "Peon":
                            rutaPieza = pieza.Nombre.slice(0, -1);
                            break;
                        default:
                            rutaPieza = pieza.Nombre;
                    }

                    const divPieza = document.createElement('div');
                    divPieza.classList.add("pieza");
                    divPieza.id = pieza.Nombre;
                    // console.log(` asset(${this.#tema}/${rutaPieza}.png)`);
                    divPieza.style.backgroundImage = ` url(${this.#tema}/${rutaPieza}.png) `;

                    divPieza.draggable = true;
                    divPieza.addEventListener('dragstart', function (e) {
                        e.dataTransfer.setData("text", e.target.id);
                    });

                    let casilla = document.getElementById(`${columna}${8 - fila}`);
                    casilla.appendChild(divPieza);
                }
            }
        }
    }

    eliminarPiezas() {
        let piezas = document.querySelectorAll('.pieza');
        piezas.forEach(pieza => pieza.remove());

        for (let fila = 0; fila < 8; fila++) {
            for (let columna in this.#posiciones[fila]) {
                this.#posiciones[fila][columna] = null;
            }
        }
    }

    // actualizarPosicion(letraOrigen, numeroOrigen, letraDestino, numeroDestino) {
    //     console.log(numeroOrigen + " - " + letraOrigen)
    //     console.log(numeroDestino + " - " + letraDestino)
    //     const pieza = this.#posiciones[numeroOrigen][letraOrigen];
    //     this.#posiciones[numeroOrigen][letraOrigen] = null;
    //     this.#posiciones[numeroDestino][letraDestino] = pieza;

    //     if (pieza) {
    //         pieza.Posicion = letraDestino + numeroDestino;
    //     }
    // }


    buscarEnCasilla(id) {
        let [letra, numero] = id.split(/(\d+)/).filter(Boolean);
        return this.#posiciones[8 - parseInt(numero)][letra];
    }

    verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino) {

        // agregar una confirmacion al comer una pieza para que el metodo de verificar movieminto tambien mueva las piezas o duplicar el 
        // el metodo de verificar movimiento y que elimine y modifique las piezas

        let pieza = this.#posiciones[numeroOrigen - 1][letraOrigen]
        // console.log(pieza.constructor.name)
        // switch (pieza.constructor.name) {
        //     case "Peon":
        //         // return pieza.verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino);
        //         return true;
        //     case "Torre":
        //         return pieza.verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino, this.#posiciones)
        //     case "Alfil":
        //         return pieza.verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino, this.#posiciones)
        //     case "Caballo":
        //         return pieza.verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino, this.#posiciones)
        //     case "Reina":
        //         return pieza.verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino, this.#posiciones)
        //     case "Rey":
        //         return pieza.verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino);
        //     // Añadir más casos para otras piezas aquí
        //     default:
        //         return false;
        // }

        return true;
    }

    comerOtraPieza(letraOrigen, numeroOrigen, letraDestino, numeroDestino) {
        let pieza = this.#posiciones[numeroOrigen - 1][letraOrigen]
        // let piezaAComer = this.#posiciones[numeroDestino - 1][letraDestino]

        // console.log(pieza.constructor.name)
        // console.log(letraOrigen, numeroOrigen, letraDestino, numeroDestino)
        switch (pieza.constructor.name) {
            case "Peon":
                return pieza.verificarMovimientoComer(letraOrigen, numeroOrigen, letraDestino, numeroDestino);
            case "Torre":
                return pieza.verificarMovimientoComer(letraOrigen, numeroOrigen, letraDestino, numeroDestino, this.#posiciones)
            case "Alfil":
                return pieza.verificarMovimientoComer(letraOrigen, numeroOrigen, letraDestino, numeroDestino, this.#posiciones)
            case "Caballo":
                return pieza.verificarMovimientoComer(letraOrigen, numeroOrigen, letraDestino, numeroDestino, this.#posiciones)
            case "Reina":
                return pieza.verificarMovimientoComer(letraOrigen, numeroOrigen, letraDestino, numeroDestino, this.#posiciones)
            case "Rey":
                return pieza.verificarMovimientoComer(letraOrigen, numeroOrigen, letraDestino, numeroDestino);
            // Añadir más casos para otras piezas aquí
            default:
                return false; // Por defecto, no permitir movimientos no definidos
        }
    }

    // verificarMovimientoPeon(pieza, letraOrigen, numeroOrigen, letraDestino, numeroDestino) {

    //     const direccion = pieza.Nombre[1] === 'N' ? 1 : -1; // Determinar la dirección según el color del peón
    //     console.log(direccion)
    //     // Verificar movimiento hacia adelante
    //     if (letraOrigen === letraDestino && (parseInt(numeroDestino) - parseInt(numeroOrigen)) === direccion) {
    //         return true;
    //     }
    //     // Aquí puedes añadir más lógica para capturas, el primer movimiento del peón, etc.
    //     return false;
    // }

    actualizarPosicion(letraOrigen, numeroOrigen, letraDestino, numeroDestino, piezaAComer) {
        // console.log(letraOrigen, numeroOrigen, letraDestino, numeroDestino, piezaAComer);
    
        // Verificar si la posición de origen contiene una pieza
        const pieza = this.#posiciones[numeroOrigen - 1]?.[letraOrigen];
        if (!pieza) {
            console.error(`No se encontró una pieza en la posición ${letraOrigen}${numeroOrigen}`);
            return; // Termina la función si no hay pieza en la posición de origen
        }
        
        // console.log(pieza);
    
        // Verificar si el destino tiene una pieza
        const destinoOcupado = this.#posiciones[numeroDestino - 1]?.[letraDestino] !== null;
        
        if (destinoOcupado) {
            // Movimiento sin captura
            this.#posiciones[numeroDestino - 1][letraDestino] = pieza;
            this.#posiciones[numeroOrigen - 1][letraOrigen] = null;
            pieza.Posicion = letraDestino + numeroDestino;
        } else if (this.verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino)) {
            // Movimiento con captura
            this.#posiciones[numeroDestino - 1][letraDestino] = pieza;
            this.#posiciones[numeroOrigen - 1][letraOrigen] = null;
            pieza.Posicion = letraDestino + numeroDestino;
            // console.log("pieza comida");
        }
    
        // Actualizar la interfaz si hay una pieza para capturar
        if (piezaAComer) {
            const casillaDestino = document.getElementById(`${letraDestino}${numeroDestino}`);
            const casillaOrigen = document.getElementById(`${letraOrigen}${numeroOrigen}`);
    
            if (casillaOrigen && casillaOrigen.firstChild) {
                casillaDestino.innerHTML = "";
                casillaDestino.appendChild(casillaOrigen.firstChild);
            } else {
                // console.error(`No se pudo mover la pieza visualmente: ${letraOrigen}${numeroOrigen} a ${letraDestino}${numeroDestino}`);
            }
    
            this.#posiciones[numeroDestino - 1][letraDestino] = pieza;
            this.#posiciones[numeroOrigen - 1][letraOrigen] = null;
            pieza.Posicion = letraDestino + numeroDestino;
        } else {
            // console.log(`Movimiento inválido o sin captura: ${pieza.Nombre} de ${letraOrigen}${numeroOrigen} a ${letraDestino}${numeroDestino}`);
        }
    }
    

    verPosiciones() {
        console.log(this.#posiciones);
    }

    get Posicines() {
        return this.#posiciones;
    }

    set Tema(value) {
        this.#tema = value;
    }
}

export default Partida;