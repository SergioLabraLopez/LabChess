import Pieza from "../pieza.js"

const letras = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7 }

class Alfil extends Pieza{

    constructor(nombre, posicion) {
        super(nombre, posicion)
    }

    verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones) {
        console.log(letraOrigen, numeroOrigen, letraDestino, numeroDestino)

        const colInicio = letras[letraOrigen];
        const colFin = letras[letraDestino];

        if (Math.abs(colInicio - colFin) === Math.abs(numeroOrigen - numeroDestino)) {
            if (this.comprobarSalto(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones)) {
                return true
            }
        }

        // Movimiento inválido
        return false;
    }

    comprobarSalto(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones) {
        const colInicio = letras[letraOrigen];
        const colFin = letras[letraDestino];

        numeroOrigen = parseInt(numeroOrigen);
        numeroDestino = parseInt(numeroDestino);

        const pasoCol = colInicio < colFin ? 1 : -1;
        const pasoNum = numeroOrigen < numeroDestino ? 1 : -1;

        let colActual = colInicio + pasoCol;
        let numActual = numeroOrigen + pasoNum;

        while (colActual !== colFin && numActual !== numeroDestino) {
            const letraActual = Object.keys(letras).find(key => letras[key] === colActual);
            if (posiciones[numActual - 1][letraActual] !== null) {
                return false; 
            }
            colActual += pasoCol;
            numActual += pasoNum;
        }

        // No hay piezas en el camino
        return true;
    }

    verificarMovimientoComer(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones) {
        const colInicio = letras[letraOrigen];
        const colFin = letras[letraDestino];
    
        // Verifica si el movimiento es diagonal
        if (Math.abs(colInicio - colFin) === Math.abs(numeroOrigen - numeroDestino)) {
            // Asegurarse de que no hay piezas en el camino
            if (!this.comprobarSalto(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones)) {
                return false;
            }
    
            // Obtener la pieza en la casilla destino
            const piezaDestino = posiciones[numeroDestino - 1][letraDestino];
            
            // Verificar si hay una pieza en la casilla destino y si es de diferente color
            if (piezaDestino !== null && piezaDestino.Nombre[1] !== this.Nombre[1]) {
                return true; // Puede comer la pieza
            }
        }
    
        // Si no es un movimiento diagonal válido o no puede comer, retorna false
        return false;
    }

    obtenerNotacionFEN() {
        return this.Nombre === "ANI" || this.Nombre === "AND" ? "B" : "b";
    }
    
} export default Alfil