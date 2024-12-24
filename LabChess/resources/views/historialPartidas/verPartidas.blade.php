<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>

    <link rel="stylesheet" href="{{ asset('css/estilos.css') }}">
    <link rel="stylesheet" href="{{ asset('css/usuario/paginaPerfil.css') }}">

    <script src="{{ asset('js/theme/theme-selector.js') }}" defer></script>
    <script src="{{ asset('js/verPartidas/verPartidas.js') }}" defer></script>

    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>

<body>
    @include('layouts.navigation')

    <div class="container mt-4">
        <h1>Historial de partidas</h1>

        <form method="GET" action="{{ route('verPartidas') }}" class="mb-4">
            <div class="form-group">
                <label for="resultado">Filtrar por resultado:</label>
                <select name="resultado" id="resultado" class="form-control" onchange="this.form.submit()">
                    <option value="">Todos</option>
                    <option value="enCurso" {{ request('resultado') == 'enCurso' ? 'selected' : '' }}>En curso
                    </option>
                    <option value="ganada" {{ request('resultado') == 'ganada' ? 'selected' : '' }}>Ganada</option>
                    <option value="perdida" {{ request('resultado') == 'perdida' ? 'selected' : '' }}>Perdida
                    </option>
                    <option value="empate" {{ request('resultado') == 'empate' ? 'selected' : '' }}>Empate</option>
                </select>
            </div>
        </form>

        @if ($partidas->isEmpty())
            <p>No tienes partidas registradas.</p>
        @else
            <div class="row">
                @foreach ($partidas as $partida)
                    <div class="col-sm-6 mb-3">
                        <div class="card" id="estilo2">
                            <div class="card-body">
                                <h5 class="card-title">ID: {{ $partida->id_partida }} Dificultad
                                    {{ $partida->dificultad }}</h5>
                                <p class="card-text">
                                    <strong>Resultado:</strong>
                                    {{ $partida->resultado === 'enCurso' ? 'En curso' : $partida->resultado ?? 'Pendiente' }}
                                </p>
                                <p class="card-text" id="cantidadSesiones">
                                    <strong>Cantidad de sesiones:</strong>
                                    {{ $partida->sesiones->count() }}
                                </p>
                                <p class="card-text">
                                    @if ($partida->sesiones->isNotEmpty())
                                        @php
                                            $ultimaSesion = $partida->sesiones->last();
                                            $inicio = \Carbon\Carbon::parse($ultimaSesion->inicio_sesion);
                                            $fin = $ultimaSesion->fin_sesion
                                                ? \Carbon\Carbon::parse($ultimaSesion->fin_sesion)
                                                : now();
                                            $diferencia = $inicio->diff($fin);
                                        @endphp
                                        <p class="card-text">
                                            <strong>Tiempo de la partida:</strong>
                                            <span class="tiempo-total"
                                                data-sesiones="{{ json_encode($partida->sesiones) }}"></span>
                                        </p>
                                    @else
                                        <span>No hay sesiones registradas.</span>
                                    @endif
                                </p>

                                <button class="btn btn-secondary btn-sm" data-toggle="modal"
                                    data-target="#modalSesiones-{{ $partida->id_partida }}">
                                    Ver más
                                </button>

                                @if ($partida->resultado === 'enCurso')
                                    <button class="btn btn-warning btn-sm" id="continuar"
                                        numero-sesion="{{ $ultimaSesion }}" datos-partida="{{ $partida }}"
                                        id-partida="{{ $partida->id_partida }}">
                                        Continuar
                                    </button>
                                @endif
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="modalSesiones-{{ $partida->id_partida }}" tabindex="-1"
                        aria-labelledby="modalSesionesLabel-{{ $partida->id_partida }}" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalSesionesLabel-{{ $partida->id_partida }}">
                                        Sesiones de la partida {{ $partida->id_partida }}
                                    </h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    @foreach ($partida->sesiones as $sesion)
                                        <div class="mb-3 col-12 row">
                                            <div class="col-6">
                                                <strong>Sesión ID:</strong>
                                                <button class="btn btn-outline-primary btn-sm copy-btn"
                                                    data-clipboard-text="{{ $sesion->codigo_partida }}">
                                                    {{ $sesion->codigo_partida }}
                                                </button>
                                                <br>
                                                @php
                                                    $inicio = \Carbon\Carbon::parse($sesion->inicio_sesion);
                                                    $fin = $sesion->fin_sesion
                                                        ? \Carbon\Carbon::parse($sesion->fin_sesion)
                                                        : now();
                                                    $diferencia = $inicio->diff($fin);
                                                @endphp
                                                Duración:
                                                @if ($diferencia->h > 0)
                                                    {{ $diferencia->h }} h
                                                @endif
                                                @if ($diferencia->i > 0)
                                                    {{ $diferencia->i }} min
                                                @endif
                                                @if ($diferencia->s > 0)
                                                    {{ $diferencia->s }} segundos
                                                @endif
                                            </div>

                                            @if ($sesion->movimientos->isNotEmpty())
                                                <div class="col-6 mt-2">
                                                    <strong>Movimientos realizados:</strong>
                                                    <ul>
                                                        @foreach ($sesion->movimientos as $movimiento)
                                                            <li>
                                                                {{ $movimiento->movimiento }}
                                                            </li>
                                                        @endforeach
                                                    </ul>
                                                </div>
                                            @else
                                                <p class="text-muted">No se realizaron movimientos en esta sesión.
                                                </p>
                                            @endif
                                        </div>
                                        <div>
                                            <hr class="dropdown-divider">
                                        </div>
                                    @endforeach
                                </div>
                                <div class="modal-footer">
                                    @if ($partida->sesiones->count() > 1)
                                        <button class="btn btn-warning"
                                            onclick="eliminarUltimaPartida('{{ $partida->id_partida }}')">
                                            Eliminar última sesión
                                        </button>
                                    @endif
                                    <button class="btn btn-danger"
                                        onclick="eliminarPartida('{{ $partida->id_partida }}')">
                                        Eliminar Partida
                                    </button>
                                    <button type="button" class="btn btn-secondary"
                                        data-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            <div class=" ">
                {{ $partidas->links() }}
            </div>
        @endif
    </div>

</body>
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>

</html>
