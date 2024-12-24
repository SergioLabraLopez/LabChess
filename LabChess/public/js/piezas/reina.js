import Pieza from "../pieza.js";

const letras = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7 };

class Reina extends Pieza {

    constructor(nombre, posicion) {
        super(nombre, posicion)
    }

    verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones) {
        console.log(letraOrigen, numeroOrigen, letraDestino, numeroDestino);

        const colInicio = letras[letraOrigen];
        const colFin = letras[letraDestino];
        numeroOrigen = parseInt(numeroOrigen);
        numeroDestino = parseInt(numeroDestino);

        // movimiento línea recta
        if (letraOrigen === letraDestino || numeroOrigen === numeroDestino) {
            if (this.comprobarSaltoLineaRecta(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones)) {
                return true;
            }
        }

        // movimiento diagonal
        if (Math.abs(colInicio - colFin) === Math.abs(numeroOrigen - numeroDestino)) {
            if (this.comprobarSaltoDiagonal(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones)) {
                return true;
            }
        }

        return false;
    }

    comprobarSaltoLineaRecta(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones) {
        const colInicio = letras[letraOrigen];
        const colFin = letras[letraDestino];

        if (colInicio === colFin) {
            const paso = numeroOrigen < numeroDestino ? 1 : -1;
            for (let i = numeroOrigen + paso; i !== numeroDestino; i += paso) {
                if (posiciones[i - 1][letraOrigen] !== null) {
                    return false;
                }
            }
        }

        if (numeroOrigen === numeroDestino) {
            const paso = colInicio < colFin ? 1 : -1;
            for (let i = colInicio + paso; i !== colFin; i += paso) {
                const letraActual = Object.keys(letras).find(key => letras[key] === i);
                if (posiciones[numeroOrigen - 1][letraActual] !== null) {
                    return false;
                }
            }
        }
        return true;
    }

    comprobarSaltoDiagonal(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones) {
        const colInicio = letras[letraOrigen];
        const colFin = letras[letraDestino];

        const pasoFila = numeroOrigen < numeroDestino ? 1 : -1;
        const pasoColumna = colInicio < colFin ? 1 : -1;

        let filaActual = numeroOrigen + pasoFila;
        let colActual = colInicio + pasoColumna;

        while (filaActual !== numeroDestino && colActual !== colFin) {
            const letraActual = Object.keys(letras).find(key => letras[key] === colActual);
            if (posiciones[filaActual - 1][letraActual] !== null) {
                return false;
            }
            filaActual += pasoFila;
            colActual += pasoColumna;
        }
        return true;
    }

    obtenerNotacionFEN() {
        return this.Nombre === "QB" ? "Q" : "q"; // Rey blanco o negro
    }
}

export default Reina;
