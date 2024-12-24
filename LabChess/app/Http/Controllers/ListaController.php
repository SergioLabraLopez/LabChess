<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ListaController extends Controller
{
    // public function filtrar()
    // {
    //     $usuarios = User::paginate(6);
    //     return response()->json($usuarios);
    // }

    public function filtrar(Request $request)
    {
        $ranking = $request->input('ranking');
        $filtro = $request->input('filtro');
        $orden = $request->input('orden', 'asc');

        $query = User::query();

        if ($ranking) {
            $query->select('users.*')
                ->withCount([
                    'partidas as victorias' => function ($query) {
                        $query->where('resultado', 'Ganada');
                    },
                    'partidas as derrotas' => function ($query) {
                        $query->where('resultado', 'Perdida');
                    },
                    'partidas as jugadas'
                ])
                ->with([
                    'partidas.sesiones' => function ($query) {
                        $query->select('id_partida', 'inicio_sesion', 'fin_sesion');
                    }
                ])
                ->orderByDesc('victorias')
                ->orderBy('derrotas');
        } else {
            $query->withCount([
                'partidas as victorias' => function ($query) {
                    $query->where('resultado', 'Ganada');
                },
                'partidas as derrotas' => function ($query) {
                    $query->where('resultado', 'Perdida');
                },
                'partidas as jugadas'
            ])
                ->with([
                    'partidas.sesiones' => function ($query) {
                        $query->select('id_partida', 'inicio_sesion', 'fin_sesion');
                    }
                ]);

            switch ($filtro) {
                case 'victorias':
                    $query->orderBy('victorias', $orden);
                    break;

                case 'derrotas':
                    $query->orderBy('derrotas', $orden);
                    break;
                case 'jugadas':
                    $query->orderBy('jugadas', $orden);
                    break;

                default:
                    $query->orderBy('name', $orden);
                    break;
            }
        }

        $jugadores = $query->get();

        $resultados = $jugadores->map(function ($jugador) {
            $tiempo_jugado = 0;

            foreach ($jugador->partidas as $partida) {
                foreach ($partida->sesiones as $sesion) {
                    if ($sesion->inicio_sesion && $sesion->fin_sesion) {
                        $inicio = \Carbon\Carbon::parse($sesion->inicio_sesion);
                        $fin = \Carbon\Carbon::parse($sesion->fin_sesion);
                        if ($fin->gt($inicio)) {
                            $tiempo_jugado += $inicio->diffInSeconds($fin);
                        }
                    }
                }
            }

            $horas = floor($tiempo_jugado / 3600);
            $minutos = floor(($tiempo_jugado % 3600) / 60);
            $segundos = $tiempo_jugado % 60;

            return [
                'nombre' => $jugador->name,
                'victorias' => $jugador->victorias ?? 0,
                'derrotas' => $jugador->derrotas ?? 0,
                'jugadas' => $jugador->jugadas ?? 0,
                'tiempo_jugado' => sprintf('%02d:%02d:%02d', $horas, $minutos, $segundos),
            ];
        });

        return response()->json(['data' => $resultados]);
    }
}
