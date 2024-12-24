<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>

    <link rel="stylesheet" href="{{ asset('css/estilos.css') }}">

    <script type="module" src="{{ asset('js/home/home.js') }}"></script>
    <script src="{{ asset('js/theme/theme-selector.js') }}" defer></script>

    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

</head>

<body>

    @include('layouts.navigation')

    <div class="container mt-4">
        <h1>Bienvenido a la página de inicio</h1>

        @if (Auth::check())
            <p>Hola, {{ Auth::user()->name }}. Bienvenido de nuevo.</p>
        @else
            <p>¿Tienes una cuenta? <a href="{{ route('login') }}">Inicia sesión aquí</a>.</p>
        @endif

        <!-- Botón hacia el tablero -->
        <!--
        <a href="{{ route('tablero') }}" class="btn btn-primary mt-3">Ir al Tablero</a>
        -->
        <a href="{{ route('bots') }}" class="btn btn-success mt-3 disabled">Lista de bots</a>
        <a href="{{ route('crearPartida') }}" class="btn btn-success mt-3 disabled">Crear Partida</a>
        <a href="{{ route('lista') }}" class="btn btn-warning mt-3">Top list</a>
        @auth
            <a href="{{ route('crearPartidaDificultad') }}" class="btn btn-secondary mt-3">Jugar</a>
            <a href="{{ route('verPartidas') }}" class="btn btn-info mt-3">Ver Partidas</a>
        @endAuth
    </div>

    <!-- Modal -->
    <div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="infoModalLabel">Verifíca tu Cuenta</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Obten tu token de acceso en <a href="https://lichess.org/">Lichess</a>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
