<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiController extends Controller
{
    public function getApiToken()
    {
        $user = auth()->user();
        $defaultToken = config('services.lichess.default_token');

        return $user && $user->api_token ? $user->api_token : $defaultToken;
    }

    public function obtenerBotsLichess()
    {
        $response = Http::get('https://lichess.org/api/bot/online?nb=5'); // Agrega el parámetro nb

        // Procesar la respuesta NDJSON
        $bots = [];
        foreach (explode("\n", $response->body()) as $line) {
            if ($line) { // Asegúrate de que la línea no esté vacía
                $bots[] = json_decode($line, true); // Convierte cada línea a un array asociativo
            }
        }

        return response()->json($bots); // Devuelve los bots como un JSON estándar
    }

    //bots
    public function conseguirIdPartida($id)
    {
        $url = "https://lichess.org/api/challenge/{$id}";

        $data = [
            'rated' => false,
            'clock' => [
                'limit' => 300,
                'increment' => 0
            ],
            'color' => 'black'
        ];

        $lichessToken = $this->getApiToken();

        $response = Http::withToken($lichessToken)->post($url, $data);

        if ($response->successful()) {
            return response()->json($response->json(), 200);
        } else {
            return response()->json(['error' => 'No se pudo iniciar la partida'], $response->status());
        }
    }

    //bots
    public function crearPartida(Request $request)
    {
        $token = $this->getApiToken();

        $url = 'https://lichess.org/api/challenge';

        $response = Http::withToken($token)->post($url, [
            'clock.limit' => 0,
            'clock.increment' => 0,
            'days' => $request->days,
            'rated' => filter_var($request->rated, FILTER_VALIDATE_BOOLEAN),
            'color' => $request->color,
            'variant' => "standard",
        ]);

        if ($response->successful()) {
            $partidaData = $response->json();
            return redirect()->route('partida', ['id' => $partidaData['id']]);
        } else {
            return response()->json(['error' => 'No se pudo iniciar la partida'], $response->status());
        }
    }

    //bots
    public function obtenerBotsCorrespondencia()
    {
        $response = Http::get('https://lichess.org/api/bot/online?nb=20');

        $botsCorrespondencia = [];

        foreach (explode("\n", $response->body()) as $line) {
            if ($line) {
                $bot = json_decode($line, true);
                $username = $bot['id'];

                $challengeResponse = Http::withToken($this->getApiToken())
                    ->post("https://lichess.org/api/challenge/{$username}", [
                        'timeControl' => 'correspondence'
                    ]);

                if ($challengeResponse->successful()) {
                    $botsCorrespondencia[] = $bot;
                }
            }
        }

        return response()->json($botsCorrespondencia);
    }

    public function challengeAi(Request $request)
    {
        $token = $this->getApiToken();

        $url = 'https://lichess.org/api/challenge/ai';

        $response = Http::withToken($token)->post($url, [
            'level' => $request->difficulty,
            'clock.limit' => $request->timeLimit,
            'clock.increment' => $request->increment,
            'color' => 'white',
            'variant' => $request->variant,
            'fen' => $request->fen,
        ]);

        // return $response->json();

        // if ($response->successful()) {
        //     $partidaData = $response->json();
        //     return response()->json([
        //         'success' => true,
        //         'id' => $partidaData['id'],
        //     ]);
        // } else {
        //     return response()->json(['error' => 'No se pudo iniciar el desafío'], $response->status());
        // }

        if ($response->successful()) {
            $responseData = $response->json();
            $partidaId = $responseData['id'];
            $partida = $this->getPartidaDetails($partidaId);
            return response()->json($partida);
        } else {
            return response()->json(['error' => 'No se pudo crear el desafío'], $response->status());
        }
    }

    public function abandonarPartida($gameId)
    {
        $token = $this->getApiToken();
        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
        ])->post("https://lichess.org/api/board/game/$gameId/resign");

        if ($response->successful()) {
            return response()->json(['message' => 'Partida abandonada exitosamente'], 200);
        }

        return response()->json(['error' => 'No se pudo abandonar la partida'], $response->status());
    }

    public function getPartidaDetails($partidaId)
    {
        $url = 'https://lichess.org/api/game/' . $partidaId;

        $response = Http::get($url);

        if ($response->successful()) {
            $partidaData = $response->json();
            return [
                'id' => $partidaData['id'],
                'color' => $partidaData['color'],
                'status' => $partidaData['status'],
            ];
        } else {
            return response()->json(['error' => 'No se pudo obtener detalles de la partida'], $response->status());
        }
    }

    // public function realizarMovimiento(Request $request, $partidaId)
    // {
    //     $token = $this->getApiToken();
    //     $movimiento = $request->input('movimiento'); // Formato UCI

    //     $url = "https://lichess.org/api/board/game/{$partidaId}/move/{$movimiento}";

    //     $response = Http::withToken($token)->post($url);

    //     return $request + $partidaId;
    //     // if ($response->successful()) {
    //     //     return response()->json(['success' => true, 'message' => 'Movimiento realizado con éxito']);
    //     // } else {
    //     //     return response()->json(['error' => 'Error al realizar el movimiento'], $response->status());
    //     // }
    // }

    // public function esperarMovimientoBot($partidaId)
    // {
    //     $token = $this->getApiToken();

    //     $url = "https://lichess.org/api/board/game/stream/{$partidaId}";

    //     $response = Http::withToken($token)->get($url);

    //     if ($response->successful()) {

    //         $movimientos = [];
    //         foreach (explode("\n", $response->body()) as $linea) {
    //             if ($linea) {
    //                 $evento = json_decode($linea, true);
    //                 if (isset($evento['type']) && $evento['type'] == 'gameFull' || $evento['type'] == 'gameState') {
    //                     $movimientos[] = $evento['moves'];
    //                 }
    //             }
    //         }

    //         return response()->json(['success' => true, 'movimientos' => end($movimientos)]);
    //     } else {
    //         return response()->json(['error' => 'Error al obtener el movimiento de la IA'], $response->status());
    //     }
    // }


    public function moverPieza(Request $request)
    {
        $uci = $request->input('uci');

        return response()->json(['success' => true, 'message' => 'Movimiento registrado.', 'uci' => $uci]);
    }
}
