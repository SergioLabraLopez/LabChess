import Pieza from "../pieza.js"

const letras = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7 }
class Torre extends Pieza {

    constructor(nombre, posicion) {
        super(nombre, posicion)
    }

    verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones) {
        console.log(letraOrigen, numeroOrigen, letraDestino, numeroDestino)

        if (letraOrigen === letraDestino || numeroOrigen === numeroDestino) {
            if (this.comprobarSalto(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones)) {
                return true
            }
        }

        return false;
    }

    comprobarSalto(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones) {
        const colInicio = letras[letraOrigen];
        const colFin = letras[letraDestino];

        numeroOrigen = parseInt(numeroOrigen)
        numeroDestino = parseInt(numeroDestino)

        if (colInicio === colFin) {

            const paso = numeroOrigen < numeroDestino ? 1 : -1;
            for (let i = numeroOrigen + paso; i !== numeroDestino; i += paso) {
                // console.log(i)
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

    obtenerNotacionFEN() {
        return this.Nombre === "TNI" || this.Nombre === "TND" ? "R" : "r";
    }


} export default Torre