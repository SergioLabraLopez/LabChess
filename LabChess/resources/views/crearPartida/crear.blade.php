<!-- resources/views/crearPartida.blade.php -->

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prueba API Lichess</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

    @include('layouts.navigation')
</head>

<body>

    <div class="container">
        <h2>Crear Partida de Correspondencia</h2>
        <form action="{{ route('crearPartida') }}" method="POST">
            @csrf
            <!-- Usuario Oponente -->
            <div class="form-group">
                <label for="oponente">Usuario Oponente</label>
                <input type="text" id="oponente" name="oponente" class="form-control"
                    placeholder="Completa solo si quieres un bot en expecifico">
            </div>

            <!-- Tiempo por Movimiento (días) -->
            <div class="form-group">
                <label for="days">Días por Movimiento</label>
                <input type="number" id="days" name="days" class="form-control" value="7" min="1"
                    max="30" required>
            </div>

            <!-- Puntuación -->
            <div class="form-group">
                <label for="rated">¿Partida de Puntuación?</label>
                <select id="rated" name="rated" class="form-control" required>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                </select>
            </div>

            <!-- Color -->
            <div class="form-group">
                <label for="color">Color de tus Piezas</label>
                <select id="color" name="color" class="form-control" required>
                    <option value="random">Aleatorio</option>
                    <option value="white">Blancas</option>
                    <option value="black">Negras</option>
                </select>
            </div>

            <!-- Tipo de Juego
        <div class="form-group">
            <label for="variant">Tipo de Juego</label>
            <select id="variant" name="variant" class="form-control" required>
                <option value="standard">Estándar</option>
                <option value="chess960">Chess960</option>
                <option value="kingOfTheHill">Rey de la Colina</option>
                <option value="threeCheck">Tres Jaques</option>
            </select>
    </div>
    -->

            <button type="submit" class="btn btn-success" id="crearPartida">Crear Partida</button>
        </form>
    </div>

    <script src="{{ asset('js/crearPartida/crearPartida.js') }}"></script>
</body>

</html>
