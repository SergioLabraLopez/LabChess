<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista</title>

    <link rel="stylesheet" href="{{ asset('css/lista/lista.css') }}">

    <script type="module" src="{{ asset('js/lista/lista.js') }}"></script>
    <script src="{{ asset('js/theme/theme-selector.js') }}" defer></script>

    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

</head>

<body>

    @include('layouts.navigation')

    <div class="contenedor">
        <div class="row">
            <div id="filtros" class="col-3">
                <div class="form-group">
                    <!-- Checkbox principal -->
                    <div class="form-check mb-3">
                        <input type="checkbox" id="ranking" class="form-check-input">
                        <label for="ranking" class="form-check-label">Ranking</label>
                    </div>

                    <div id="filtros-secundarios">
                        <div class="form-check">
                            <input type="checkbox" id="filtro-victorias" value="victorias" name="filtro"
                                class="form-check-input">
                            <label for="filtro-victorias" class="form-check-label">Ordenar por victorias</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" id="filtro-derrotas" value="derrotas" name="filtro"
                                class="form-check-input">
                            <label for="filtro-derrotas" class="form-check-label">Ordenar por derrotas</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" id="filtro-jugadas" value="jugadas" name="filtro"
                                class="form-check-input">
                            <label for="filtro-jugadas" class="form-check-label">Ordenar por Jugadas</label>
                        </div>
                    </div>

                    <div id="orden-filtros" class="mt-4">
                        <div class="form-check">
                            <input type="radio" id="orden-descendente" name="orden" class="form-check-input">
                            <label for="orden-descendente" class="form-check-label">Orden Descendente</label>
                        </div>
                        <div class="form-check">
                            <input type="radio" id="orden-ascendente" name="orden" class="form-check-input">
                            <label for="orden-ascendente" class="form-check-label">Orden Ascendente</label>
                        </div>

                    </div>
                </div>

                <button class="btn mt-3 w-100" id="buscar">Buscar</button>
            </div>


            <div class="col-9">
                <table id="tabla-usuarios">
                    <thead class="thead-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Victorias</th>
                            <th>Derrotas</th>
                            <th>Jugadas</th>
                            <th>Tiempo Jugado</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
