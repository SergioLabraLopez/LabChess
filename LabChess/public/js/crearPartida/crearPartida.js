document.addEventListener('DOMContentLoaded', function () {
    const botonCrearPartida = document.getElementById('crearPartida');
    const formulario = document.querySelector('form');

    botonCrearPartida.addEventListener('click', function(event) {
        event.preventDefault();

        const oponente = document.getElementById('oponente').value;

        const days = document.getElementById('days').value;
        const rated = document.getElementById('rated').value;
        const color = document.getElementById('color').value;
        
        jugarContraBot(oponente, days, rated, color);
    });

    function jugarContraBot(username, days, rated, color) {
        axios.post('/crear-partida', {
            oponente: username,
            days: days,
            rated: rated,
            color: color
        })
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
});
