import Pieza from "../pieza.js";

const letras = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7 };

class Caballo extends Pieza {

    constructor(nombre, posicion) {
        super(nombre, posicion)
    }

    verificarMovimiento(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones) {
        console.log(letraOrigen, numeroOrigen, letraDestino, numeroDestino);

        const colInicio = letras[letraOrigen];
        const colFin = letras[letraDestino];
        numeroOrigen = parseInt(numeroOrigen);
        numeroDestino = parseInt(numeroDestino);

        const colDiff = Math.abs(colInicio - colFin);
        const rowDiff = Math.abs(numeroOrigen - numeroDestino);

        // El caballo se mueve en forma de "L"
        if ((colDiff === 2 && rowDiff === 1) || (colDiff === 1 && rowDiff === 2)) {
            return true;
        }

        // Movimiento no válido para el caballo
        return false;
    }

    // verificarMovimientoComer(letraOrigen, numeroOrigen, letraDestino, numeroDestino, posiciones){
    //     // console.log(letraOrigen, numeroOrigen, letraDestino, numeroDestino);

    //     const colInicio = letras[letraOrigen];
    //     const colFin = letras[letraDestino];
    //     numeroOrigen = parseInt(numeroOrigen);
    //     numeroDestino = parseInt(numeroDestino);

    //     const colDiff = Math.abs(colInicio - colFin);
    //     const rowDiff = Math.abs(numeroOrigen - numeroDestino);

    //     // El caballo se mueve en forma de "L"
    //     if ((colDiff === 2 && rowDiff === 1) || (colDiff === 1 && rowDiff === 2)) {
    //         return true;
    //     }

    //     // Movimiento no válido para el caballo
    //     return false;
    // }

    obtenerNotacionFEN() {
        // Si la torre es blanca, la notación es 'R', si es negra, 'r'
        return this.Nombre === "CNI" || this.Nombre === "CND" ? "N" : "n";
    }
}

export default Caballo;
