const selectedNumberDisplay = document.getElementById('selectedNumber');
let selectedButton = null;

const numberButtonsContainer = document.querySelector('.number-buttons');
for (let i = 1; i <= 8; i++) {
    const button = document.createElement('button');
    button.className = 'number-button';
    
    if (i <= 3) {
        button.classList.add('btn-success');
    } else if (i <= 6) {
        button.classList.add('btn-warning');
    } else {
        button.classList.add('btn-danger');
    }
    
    button.textContent = i;
    button.onclick = () => selectNumber(button, i);
    numberButtonsContainer.appendChild(button);
}


function selectNumber(button, number) {
    if (selectedButton) {
        selectedButton.classList.remove('selected');
    }
    button.classList.add('selected');
    selectedButton = button;
    selectedNumberDisplay.textContent = number;
}

function playGame() {
    if (selectedButton) {
        const selectedNumber = selectedButton.textContent;

        axios.post('/challenge-ai', {
            difficulty: selectedNumber,
            timeLimit: 10800,
            increment: 5,
            variant: "standard",
            // fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        })
            .then(response => {
                // console.log(response)
                if (response.data.status) {
                    let partidaData = {
                        id: response.data.id,
                        color: response.data.color,
                        sesion: 0
                    };
                    localStorage.setItem('partidaData', JSON.stringify(partidaData));

                    axios.post('/crear-partida', {
                        id: response.data.id,
                        dificultad: selectedNumber,
                        color: response.data.color,
                    })
                        .then(partidaResponse => {
                            // console.log(partidaResponse);

                            window.location.href = '/partidaAltaDuracion?id=' + partidaResponse.data.resultado;
                        })
                        .catch(error => {
                            console.error('Error al crear la partida:', error);
                            alert('Hubo un error al crear la partida.');
                        });
                    window.location.href = '/partidaAltaDuracion?id=' + response.data.id;
                } else {
                    console.error('Error al crear la partida:', response.data.error);
                }
            })
            .catch(error => {
                console.error('Error al crear el desafío', error);
                alert('Hubo un error al crear el desafío.');
            });
    } else {
        alert('Por favor, selecciona un número antes de jugar.');
    }
}

document.getElementById('botonDesafiar').addEventListener('click', playGame);
