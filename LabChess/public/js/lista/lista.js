document.addEventListener('DOMContentLoaded', function () {
    const rankingCheckbox = document.getElementById('ranking');
    const filtrosSecundarios = document.getElementById('filtros-secundarios');
    const filtros = filtrosSecundarios.querySelectorAll('input[name="filtro"]');
    const ordenAscendente = document.getElementById('orden-ascendente');
    const ordenDescendente = document.getElementById('orden-descendente');
    const ordenRadios = [ordenAscendente, ordenDescendente];

    const toggleFiltrosSecundarios = (habilitar) => {
        filtros.forEach((filtro) => {
            filtro.disabled = !habilitar;
            if (!habilitar) filtro.checked = false;
        });
    };

    const toggleOrdenRadios = (habilitar) => {
        ordenRadios.forEach((radio) => {
            radio.disabled = !habilitar;
            if (!habilitar) radio.checked = false;
        });
    };

    ordenDescendente.checked = true;
    rankingCheckbox.checked = true;
    toggleFiltrosSecundarios(false);
    toggleOrdenRadios(false);

    rankingCheckbox.addEventListener('change', () => {
        if (rankingCheckbox.checked) {
            toggleFiltrosSecundarios(false);
            toggleOrdenRadios(false);
        } else {
            toggleFiltrosSecundarios(true);
            toggleOrdenRadios(true);
        }
    });

    filtros.forEach((filtro) => {
        filtro.addEventListener('change', () => {
            if (filtro.checked) {
                filtros.forEach((otherFiltro) => {
                    if (otherFiltro !== filtro) otherFiltro.checked = false;
                });
            }
        });
    });

    ordenRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                ordenRadios.forEach((otherRadio) => {
                    if (otherRadio !== radio) otherRadio.checked = false;
                });
            }
        });
    });

    cargarUsuarios();

    document.getElementById('buscar').addEventListener('click', function () {
        cargarUsuarios();
    });
});

function construirParametros() {
    const rankingCheckbox = document.getElementById('ranking');
    const filtros = document.querySelectorAll('input[name="filtro"]:checked');
    const ordenAscendente = document.getElementById('orden-ascendente').checked;
    const ordenDescendente = document.getElementById('orden-descendente').checked;

    const parametros = {};

    if (rankingCheckbox.checked) {
        parametros.ranking = true;
    } else {
        if (filtros.length > 0) {
            parametros.filtro = filtros[0].value;
        }
        if (ordenAscendente) {
            parametros.orden = 'asc';
        } else if (ordenDescendente) {
            parametros.orden = 'desc';
        }
    }

    return parametros;
}

function cargarUsuarios() {
    const parametros = construirParametros();
    const queryString = new URLSearchParams(parametros).toString();
    const url = `/jugadores/filtrar?${queryString}`;

    // console.log(parametros)
    // console.log(queryString)

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            const tbody = document.getElementById('tabla-usuarios').querySelector('tbody');
            tbody.innerHTML = '';

            data.data.forEach(usuario => {
                const fila = `<tr>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.victorias}</td>
                    <td>${usuario.derrotas}</td>
                    <td>${usuario.jugadas}</td>
                    <td>${usuario.tiempo_jugado}</td>
                </tr>`;
                tbody.innerHTML += fila;
            });
        })
        .catch(error => {
            console.error('Error al cargar los usuarios:', error);
        });
}
