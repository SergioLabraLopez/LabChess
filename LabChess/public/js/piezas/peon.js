import Pieza from "../pieza.js"

const letras = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7 };

class Peon extends Pieza {

    constructor(nombre, posicion) {
        super(nombre, posicion)
    }

    verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino) {
        const direccion = this.Nombre[1] === 'N' ? 1 : -1; // Determinar la dirección según el color del peón
        // console.log(this.Nombre)

        if (letraOrigen === letraDestino && (parseInt(numeroDestino) - parseInt(numeroOrigen)) === direccion) {
            return true;
        }

        if (((parseInt(numeroOrigen) === 7 && parseInt(numeroDestino) === 5) || (parseInt(numeroOrigen) === 2 && parseInt(numeroDestino) === 4)) && letraOrigen === letraDestino) {
            return true;
        }

        return false;
    }

    // los peones solo comen hacia la izquierda

    verificarMovimientoComer(letraOrigen, numeroOrigen, letraDestino, numeroDestino) {
        // console.log(letraOrigen, numeroOrigen, letraDestino, numeroDestino)
        let resutltado = false
        if (this.Nombre[1] === 'N') {
            let letraAuxD = letras[letraOrigen] - 1
            let letraAuxI = letras[letraOrigen] + 1
            let numeroAux = parseInt(numeroOrigen) + 1
            letraDestino = letras[letraDestino]
            numeroDestino = parseInt(numeroDestino)
            // console.log(typeof(letraAux), typeof(letraDestino), typeof(numeroAux), typeof(numeroDestino))
            if ((letraAuxD === letraDestino || letraAuxI === letraDestino) && numeroAux === numeroDestino) {
                resutltado = true;
            }
        } else {
            let letraAuxD = letras[letraOrigen] - 1
            let letraAuxI = letras[letraOrigen] + 1
            let numeroAux = parseInt(numeroOrigen) - 1
            letraDestino = letras[letraDestino]
            numeroDestino = parseInt(numeroDestino)
            if ((letraAuxD === letraDestino || letraAuxI === letraDestino) && numeroAux === numeroDestino) {
                resutltado = true;
            }
        }
        return resutltado;
    }

    obtenerNotacionFEN() {
        console.log(this.Nombre)
        return this.Nombre.charAt(0) === "P" ? "P" : "p";
    }

} export default Peon