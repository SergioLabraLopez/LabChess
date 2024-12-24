import Pieza from "../pieza.js"

const letras = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7 }
class Rey extends Pieza {

    constructor(nombre, posicion) {
        super(nombre, posicion)
    }

    verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino) {
        console.log(letraOrigen, numeroOrigen, letraDestino, numeroDestino)

        // El rey puede moverse solo una casilla en cualquier dirección
        if (this.calcularMovimientoLetra(letraOrigen, letraDestino) && this.calcularMovimientoNumero(numeroOrigen, numeroDestino)) {
            return true;
        }

        // Movimiento inválido para el rey
        return false;
    }

    calcularMovimientoNumero(numeroOrigen, numeroDestino) {
        numeroDestino = parseInt(numeroDestino)
        numeroOrigen = parseInt(numeroOrigen)
        console.log(typeof parseInt(numeroDestino))
        let max = parseInt(numeroOrigen) + 1
        let min = parseInt(numeroOrigen) - 1
        if (numeroDestino === numeroOrigen || numeroDestino === max || numeroDestino === min) {
            return true
        } else {
            return false
        }
    }

    calcularMovimientoLetra(letraOrigen, letraDestino) {
        let origen = letras[letraOrigen]
        let destino = letras[letraDestino]
        let letraMax = origen + 1
        let letraMin = origen - 1

        console.log(origen, destino, letraMax, letraMin)

        if(origen === origen || origen === letraMax || origen == letraMin){
            return true
        } else{
            return false
        }
    }

    obtenerNotacionFEN() {
        return this.Nombre === "RB" ? "K" : "k";
    }

} export default Rey