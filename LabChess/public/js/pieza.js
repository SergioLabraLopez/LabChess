class Pieza{

    #nombre
    #posicion;

    constructor(nombre, posicion){
        this.#nombre = nombre;
        this.#posicion = posicion;
    }

    get Nombre() {
        return this.#nombre;
    }

    get Posicion() {
        return this.#posicion;
    }

    set Nombre(value) {
        this.#nombre = value;
    }

    set Posicion(value) {
        this.#posicion = value;
    }


} export default Pieza