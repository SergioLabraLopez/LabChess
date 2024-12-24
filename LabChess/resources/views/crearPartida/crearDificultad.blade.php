<!-- resources/views/crearPartida.blade.php -->

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prueba API Lichess</title>
    <link rel="stylesheet" href="{{ asset('css/estilos.css') }}">
    <link rel="stylesheet" href="{{ asset('css/crearPartida/estilosFormularioCrearPartida.css') }}">
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

    @include('layouts.navigation')
</head>

<body>

    <div class="container">
        <h2>Crear Partida por Dificultad</h2>
        <p>Cuanto mayor sea el número mayor será la dificultad<br>
        Has seleccionado la Dificultad: <span id="selectedNumber" class="selected-number">5</span></p>

        <div class="number-buttons">
        </div>
        
        <button class="btn btn-danger" id="botonDesafiar">Jugar</button>
    </div>

    <script src="{{ asset('js/crearPartida/crearPartidaDificultad.js') }}"></script>
</body>

</html>
