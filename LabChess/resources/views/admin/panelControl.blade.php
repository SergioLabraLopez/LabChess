<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin</title>

    <link rel="stylesheet" href="{{ asset('css/estilos.css') }}">
    <script src="{{ asset('js/theme/theme-selector.js') }}" defer></script>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    @include('layouts.navigation')

    <div class="container">
        <div class="d-flex gap row">
            <h1>Admin</h1>

            @foreach ($usuarios as $usuario)
                <div class="col-md-4 mb-4">
                    <div class="card" data-user-id="{{ $usuario->id }}">
                        <div class="card-header bg-dark text-white">
                            {{ $usuario->name }}
                        </div>
                        <div class="card-body">
                            <p><strong>Email:</strong> {{ $usuario->email }}</p>
                            <p><strong>Rol:</strong> {{ $usuario->rol ?? 'No asignado' }}</p>
                        </div>
                        <div class="card-footer text-center">
                            <button class="btn btn-success perfil" data-user-id="{{ $usuario->id }}">
                                Perfil
                            </button>
                            <form action="{{ route('usuarios.destroy', $usuario->id) }}" method="POST"
                                class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger">Eliminar</button>
                            </form>
                            <button class="btn btn-info informacion" data-user-id="{{ $usuario->id }}">
                                Partidas
                            </button>
                        </div>
                    </div>
                </div>
            @endforeach

            <div class="">
                {{ $usuarios->links() }}
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalPartidas" tabindex="-1" aria-labelledby="modalPartidasLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalPartidasLabel">Partidas de Usuario</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="partidasContenido">
                    Cargando partidas...
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalSesiones" tabindex="-1" aria-labelledby="modalSesionesLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalSesionesLabel">Sesiones de la partida</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body" id="sesionesContenido">

                </div>
            </div>
        </div>
    </div>


    <script src="{{ asset('js/admin/admin.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
