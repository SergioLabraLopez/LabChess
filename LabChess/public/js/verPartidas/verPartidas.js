document.addEventListener('DOMContentLoaded', () => {
    const tiempoTotalElements = document.querySelectorAll('.tiempo-total');

    tiempoTotalElements.forEach(element => {
        const sesiones = JSON.parse(element.getAttribute('data-sesiones'));

        let totalHoras = 0, totalMinutos = 0, totalSegundos = 0;

        sesiones.forEach(sesion => {
            const inicio = new Date(sesion.inicio_sesion);
            const fin = sesion.fin_sesion ? new Date(sesion.fin_sesion) : new Date();
            const diferencia = Math.floor((fin - inicio) / 1000);

            totalSegundos += diferencia;
        });

        totalMinutos += Math.floor(totalSegundos / 60);
        totalSegundos = totalSegundos % 60;

        totalHoras += Math.floor(totalMinutos / 60);
        totalMinutos = totalMinutos % 60;

        let tiempoTotal = '';
        if (totalHoras > 0) tiempoTotal += `${totalHoras} h `;
        if (totalMinutos > 0) tiempoTotal += `${totalMinutos} min `;
        if (totalSegundos > 0) tiempoTotal += `${totalSegundos} segundos`;

        element.textContent = tiempoTotal;
    });

    // Funcionalidad de los botones de copia
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.getAttribute('data-clipboard-text');
            navigator.clipboard.writeText(textToCopy).then(() => {
                button.innerText = "¡Copiado!";
                setTimeout(() => {
                    button.innerText = textToCopy;
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar al portapapeles:', err);
            });
        });
    });
});

document.querySelectorAll("#continuar").forEach(button => {
    button.addEventListener("click", (e) => {
        let datosPartida = JSON.parse(button.getAttribute("datos-partida"))
        // console.log(datosPartida)
        let sesion = JSON.parse(button.getAttribute("numero-sesion"))
        let ultimaSesion = sesion.numero_sesion;
        let dificultad = datosPartida.dificultad
        let id = button.getAttribute("id-partida");
        // console.log(ultimaSesion, dificultad, id)
        playGame(id, dificultad, ultimaSesion);
    });
});

async function playGame(idPartida, difficulty, numero_sesion) {

    try {

        let movimientos = await obtenerMovimientos(idPartida);

        // console.log(movimientos)

        let fen = uciToFen(movimientos.join(" "));

        axios.post('/challenge-ai', {
            difficulty: difficulty,
            timeLimit: 10800,
            increment: 5,
            variant: "standard",
            fen: fen
        })
            .then(response => {
                // console.log(response)
                // console.log("Id: " + response.data.id + " Color: " + response.data.color + " sesion: ")
                if (response.data.status) {
                    let partidaData = {
                        id: response.data.id,
                        color: response.data.color,
                        sesion: numero_sesion,
                        fen: fen,
                        idPartidaPrincipal: idPartida
                    };
                    localStorage.setItem('partidaData', JSON.stringify(partidaData));

                    // alert("Id: " + response.data.id + " - " + response)

                    window.location.href = '/partidaAltaDuracion?id=' + partidaData.id;
                } else {
                    console.error('Error al crear la partida:', response.data.error);
                }
            })
            .catch(error => {
                console.error('Error al crear el desafío', error);
                alert('Hubo un error al crear el desafío.');
            });

    } catch (error) {
        console.error('Error al obtener los movimientos:', error);
    }


}

function uciToFen(moveString) {
    let board = [
        "rnbqkbnr",
        "pppppppp",
        "........",
        "........",
        "........",
        "........",
        "PPPPPPPP",
        "RNBQKBNR"
    ];
    let turn = "w";
    let castlingRights = "KQkq";

    const replaceChar = (str, index, char) => str.substring(0, index) + char + str.substring(index + 1);

    for (const move of moveString.split(" ")) {
        const fromFile = move.charCodeAt(0) - 97;
        const fromRank = 8 - parseInt(move[1]);
        const toFile = move.charCodeAt(2) - 97;
        const toRank = 8 - parseInt(move[3]);

        const piece = board[fromRank][fromFile];

        if (piece.toLowerCase() === "k" && Math.abs(fromFile - toFile) === 2) {
            if (turn === "w") {
                if (toFile > fromFile) {
                    board[7] = replaceChar(board[7], 4, ".");
                    board[7] = replaceChar(board[7], 6, "K");
                    board[7] = replaceChar(board[7], 7, ".");
                    board[7] = replaceChar(board[7], 5, "R");
                } else {
                    board[7] = replaceChar(board[7], 4, ".");
                    board[7] = replaceChar(board[7], 2, "K");
                    board[7] = replaceChar(board[7], 0, ".");
                    board[7] = replaceChar(board[7], 3, "R");
                }
                castlingRights = castlingRights.replace("K", "").replace("Q", "");
            } else {
                if (toFile > fromFile) { 
                    board[0] = replaceChar(board[0], 4, ".");
                    board[0] = replaceChar(board[0], 6, "k");
                    board[0] = replaceChar(board[0], 7, ".");
                    board[0] = replaceChar(board[0], 5, "r");
                } else { 
                    board[0] = replaceChar(board[0], 4, "."); 
                    board[0] = replaceChar(board[0], 2, "k");
                    board[0] = replaceChar(board[0], 0, "."); 
                    board[0] = replaceChar(board[0], 3, "r");
                }
                castlingRights = castlingRights.replace("k", "").replace("q", "");
            }
        } else {
            board[fromRank] = replaceChar(board[fromRank], fromFile, ".");
            board[toRank] = replaceChar(board[toRank], toFile, piece);

            
            if (piece === "K") castlingRights = castlingRights.replace("K", "").replace("Q", "");
            if (piece === "k") castlingRights = castlingRights.replace("k", "").replace("q", "");
            if (piece === "R") {
                if (fromFile === 0 && fromRank === 7) castlingRights = castlingRights.replace("Q", "");
                if (fromFile === 7 && fromRank === 7) castlingRights = castlingRights.replace("K", "");
            }
            if (piece === "r") {
                if (fromFile === 0 && fromRank === 0) castlingRights = castlingRights.replace("q", "");
                if (fromFile === 7 && fromRank === 0) castlingRights = castlingRights.replace("k", "");
            }
        }

        turn = turn === "w" ? "b" : "w";
    }

    if (castlingRights === "") castlingRights = "-";

    const fenPosition = board
        .map(row => row.replace(/\.{1,}/g, match => match.length))
        .join("/");

    return `${fenPosition} ${turn} ${castlingRights} - 0 1`;
}


function obtenerMovimientos(idPartida) {
    return fetch(`/partida/${idPartida}/movimientos`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.movimientos) {
                const movimientos = data.movimientos.map(mov => mov.movimiento);
                return movimientos;
            } else {
                console.error('No se encontraron movimientos en la respuesta:', data);
                return [];
            }
        })
        .catch(error => {
            console.error('Error al obtener los movimientos:', error);
            return [];
        });
}

function eliminarPartida(idPartida) {
    if (confirm("¿Estás seguro de que deseas eliminar esta partida? Esta acción no se puede deshacer.")) {
        axios
            .delete(`/partida/${idPartida}`)
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

function eliminarUltimaPartida(idPartida){
    if (confirm("¿Estás seguro de que deseas eliminar la última sesion? Esta acción no se puede deshacer.")) {
        axios
            .delete(`/partida/${idPartida}/sesion`)
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