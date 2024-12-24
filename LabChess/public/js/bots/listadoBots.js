document.getElementById('cargarBots').addEventListener('click', function () {
    axios.get('/api/obtener-bots-online')
        .then(function (response) {
            let resultado = document.getElementById('resultado');

            resultado.innerHTML = '';

            const bots = response.data;
            console.log(bots);

            if (bots.length > 0) {
                bots.forEach(bot => {
                    resultado.innerHTML += `<h3>Bot: ${bot.username}</h3>`;
                    resultado.innerHTML += `<p><strong>Rating Blitz:</strong> ${bot.perfs && bot.perfs.blitz ? bot.perfs.blitz.rating : 'No disponible'}</p>`;
                    resultado.innerHTML += `<p><strong>Creado:</strong> ${new Date(bot.createdAt).toLocaleDateString()}</p>`;
                    resultado.innerHTML += `
                    <button class="btn btn-primary" onclick="jugarContraBot('${bot.username}')">Jugar</button>
                `;
                    resultado.innerHTML += `<hr>`;
                });
            } else {
                resultado.innerHTML = 'No hay bots en línea actualmente.';
            }
        })
        .catch(function (error) {
            console.error(error);
            document.getElementById('resultado').innerHTML = 'Error al obtener los datos de la API';
        });

});

document.getElementById('cargarBotsCorrespondencia').addEventListener('click', function () {
    axios.get('/api/obtener-bots-correspondencia')
        .then(function (response) {
            let resultado = document.getElementById('resultado');
            resultado.innerHTML = '';

            const bots = response.data;
            console.log(bots)

            if (bots.length > 0) {
                bots.forEach(bot => {
                    resultado.innerHTML += `<h3>Bot: ${bot.username}</h3>`;
                    resultado.innerHTML += `<p><strong>Rating Blitz:</strong> ${bot.perfs && bot.perfs.blitz ? bot.perfs.blitz.rating : 'No disponible'}</p>`;
                    resultado.innerHTML += `<p><strong>Creado:</strong> ${new Date(bot.createdAt).toLocaleDateString()}</p>`;
                    resultado.innerHTML += `
                        <button class="btn btn-primary" onclick="jugarContraBot('${bot.username}')">Jugar</button>
                    `;
                    resultado.innerHTML += `<hr>`;
                });
            } else {
                resultado.innerHTML = 'No hay bots que acepten partidas de correspondencia actualmente.';
            }
        })
        .catch(function (error) {
            console.error(error);
            document.getElementById('resultado').innerHTML = 'Error al obtener los datos de la API';
        });
});


function jugarContraBot(username) {
    axios.post('/conseguir-partida/' + username)
        .then(response => {
            let partidaData = {
                id: response.data.id,
                color: response.data.finalColor
            };
            localStorage.setItem('partidaData', JSON.stringify(partidaData));
            window.location.href = '/partida?id=' + response.data.id;
        })
        .catch(error => {
            console.error(error);
            alert('Error al iniciar la partida.');
        });
}