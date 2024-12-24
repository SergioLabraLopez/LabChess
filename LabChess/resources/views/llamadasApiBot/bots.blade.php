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
    <h1>Lista de Bots en Línea</h1>
    <button class="btn btn-success" id="cargarBots">Cargar Bots</button>
    <button class="btn btn-warning" id="cargarBotsCorrespondencia">Cargar Bots Correspondencia</button>

    <div id="resultado" class="table"></div>
</div>
    <script src="{{ asset('js/bots/listadoBots.js') }}"></script> <!-- Agrega esta línea -->
</body>
</html>
