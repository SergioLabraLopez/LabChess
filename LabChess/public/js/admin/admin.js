document.addEventListener("DOMContentLoaded", function () {
    const botonesVer = document.querySelectorAll('.informacion');
    const botonesPerfil = document.querySelectorAll('.perfil');

    const modalElement = document.getElementById('modalPartidas');
    const container = document.getElementById('partidasContenido');
    const modalSesionesElement = document.getElementById('modalSesiones');
    const modalSesiones = new bootstrap.Modal(modalSesionesElement);
    const modal = new bootstrap.Modal(modalElement);
    const containerSesiones = document.getElementById('sesionesContenido');


    botonesVer.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const usuarioId = boton.getAttribute('data-user-id');

            fetch(`/usuarios/${usuarioId}/partidas`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la API.');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.length > 0) {
                        container.innerHTML = `<ul>${data.map(partida => `
                            <li><div class="p-2">
                                Dificultad: ${partida.dificultad} - Resultado: ${partida.resultado} - Color: ${partida.color_jugador}
                                <button class="btn btn-dark sesiones" data-partida-id="${partida.id_partida}" data-user-id="${usuarioId}">Sesiones</button>
                                <button class="btn btn-danger eliminar" data-partida-id="${partida.id_partida}" data-user-id="${usuarioId}">Eliminar</button>
                            </div></li>`).join('')}</ul>`;

                        const botonesEliminar = document.querySelectorAll('.eliminar');
                        botonesEliminar.forEach(function (botonEliminar) {
                            botonEliminar.addEventListener('click', function () {
                                const partidaId = botonEliminar.getAttribute('data-partida-id');
                                const userId = botonEliminar.getAttribute('data-user-id');
                                eliminarPartida(partidaId, userId);
                            });
                        });

                        const botonesSesiones = document.querySelectorAll('.sesiones');
                        botonesSesiones.forEach(function (botonSesion) {
                            botonSesion.addEventListener('click', function () {
                                const partidaId = botonSesion.getAttribute('data-partida-id');
                                const userId = botonSesion.getAttribute('data-user-id');

                                fetch(`/usuarios/${userId}/partida/${partidaId}/sesiones`)
                                    .then(response => response.json())
                                    .then(data => {
                                        // console.log(data)
                                        if (data.length > 0) {
                                            const ultimaSesion = data[data.length - 1];
                                            const ultimaSesionId = ultimaSesion.id_sesion;

                                            containerSesiones.innerHTML = `<ul>${data.map(sesion => `
                                                <li><div class="p-2">
                                                    ${sesion.numero_sesion} - Id: ${sesion.id_sesion} - Codigo: ${sesion.codigo_partida}
                                                    ${sesion.movimientos.map(mov => `
                                                    <li>${mov.movimiento}</li>
                                                `).join('')}
                                                </div></li>`).join('')}</ul>
                                                <button class="btn btn-danger eliminar" data-partida-id="${partidaId}" data-user-id="${userId}" data-sesion-id="${ultimaSesionId}">Eliminar última sesión</button>
                                            `;
                                        } else {
                                            containerSesiones.innerHTML = 'No se encontraron sesiones.';
                                        }
                                        const botonesEliminar = document.querySelectorAll('.eliminar');
                                        botonesEliminar.forEach(function (botonEliminar) {
                                            botonEliminar.addEventListener('click', function () {
                                                const partidaId = botonEliminar.getAttribute('data-partida-id');
                                                const userId = botonEliminar.getAttribute('data-user-id');
                                                const sesionId = botonEliminar.getAttribute('data-sesion-id');
                                                eliminarSesion(partidaId, userId, sesionId);
                                            });
                                        });

                                        modalSesiones.show();
                                    })
                                    .catch(error => {
                                        console.error('Error al cargar las sesiones:', error);
                                        containerSesiones.innerHTML = 'Hubo un error al cargar las sesiones.';
                                    });
                            });
                        });

                    } else {
                        container.innerHTML = 'No se encontraron partidas.';
                    }
                })
                .catch(error => {
                    console.error('Error al cargar las partidas:', error);
                    container.innerHTML = 'Hubo un error al cargar las partidas.';
                });

            modal.show();
        });
    });

    botonesPerfil.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const usuarioId = boton.getAttribute('data-user-id');

            fetch(`/usuarios/${usuarioId}/perfil`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la API.');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data) {
                        const user = data;

                        container.innerHTML = `
                            <div id="perfilEdicion">
    <form id="actualizarNombreForm" class="mb-4">
        <div class="mb-3">
            <label for="name" class="form-label">Nombre:</label>
            <input type="text" class="form-control" id="nameEmail" name="name" value="${user.name || ''}" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" class="form-control" id="email" name="email" value="${user.email || ''}" required>
        </div>
        <button type="submit" class="btn btn-warning">Actualizar Nombre y Email</button>
    </form>

    <form id="actualizarTokenForm" class="mb-4">
        <div class="mb-3">
            <label for="api_token" class="form-label">API Token:</label>
            <input type="text" class="form-control" id="api_token" name="api_token" value="${user.api_token || ''}">
        </div>
        <button type="submit" class="btn btn-warning">Actualizar Token</button>
    </form>

    <form id="actualizarRolForm" class="mb-4">
        <div class="mb-3">
            <label for="rol" class="form-label">Rol:</label>
            <select class="form-select" id="rol" name="rol">
                <option value="user" ${user.rol === 'user' ? 'selected' : ''}>Usuario</option>
                <option value="admin" ${user.rol === 'admin' ? 'selected' : ''}>Administrador</option>
            </select>
        </div>
        <button type="submit" class="btn btn-warning">Actualizar Rol</button>
    </form>
</div>

                        `;

                        const forms = {
                            actualizarNombreForm: "/usuarios/{userId}/actualizar-nombre",
                            actualizarTokenForm: "/usuarios/{userId}/actualizar-token",
                            actualizarRolForm: "/usuarios/{userId}/actualizar-rol"
                        };

                        Object.keys(forms).forEach(formId => {
                            const form = document.getElementById(formId);
                            form.addEventListener("submit", function (event) {
                                event.preventDefault();
                                const formData = new FormData(form);
                                const data = {};
                                formData.forEach((value, key) => (data[key] = value));
                                const url = forms[formId].replace("{userId}", usuarioId);

                                axios.post(url, data, {
                                    headers: { "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content }
                                })
                                    .then(response => alert("Actualización exitosa"))
                                    .catch(error => alert("Error al actualizar el perfil"));
                            });
                        });

                    } else {
                        container.innerHTML = '<p>No se encontraron datos del usuario.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error al cargar los datos del perfil:', error);
                    container.innerHTML = '<p>Hubo un error al cargar los datos del perfil.</p>';
                });

            modal.show();
        });
    });
});

function eliminarPartida(idPartida, idUsuario) {
    if (confirm("¿Estás seguro de que deseas eliminar esta partida? Esta acción no se puede deshacer.")) {
        axios
            .delete(`/usuarios/${idUsuario}/partida/${idPartida}/delete`)
            .then(response => {
                alert(response.data.message);
                location.reload();
            })
            .catch(error => {
                console.error(error);
                alert(error.response.data.message || "Ocurrió un error al eliminar la partida.");
            });
    }
}

function eliminarSesion(idPartida, idUsuario, idSesion) {
    // console.log(`Eliminar sesión con ID: ${idSesion} de la partida ${idPartida} para el usuario ${idUsuario}`);

    if (confirm("¿Estás seguro de que deseas eliminar esta sesión? Esta acción no se puede deshacer.")) {
        axios
            .delete(`/usuarios/${idUsuario}/partida/${idPartida}/sesion/${idSesion}/delete`)
            .then(response => {
                alert(response.data.message);
                location.reload();
            })
            .catch(error => {
                console.error(error);
                alert(error.response.data.message || "Ocurrió un error al eliminar la sesión.");
            });
    }
}
