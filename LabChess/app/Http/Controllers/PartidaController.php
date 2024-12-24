<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Partida;
use App\Models\Sesion;
use App\Models\Movimiento;


class PartidaController extends Controller
{
    public function verPartidas(Request $request)
    {
        $usuario = Auth::user();

        if ($usuario) {
            $resultado = $request->get('resultado');
            $query = $usuario->partidas()->with('sesiones');
            if ($resultado) {
                $query->where('resultado', $resultado);
            }

            $partidas = $query->paginate(4);
        } else {
            $partidas = collect();
        }

        return view('historialPartidas.verPartidas', compact('partidas'));
    }

    public function eliminarPartida($id)
    {
        $usuario = Auth::user();

        if ($usuario) {
            $partida = $usuario->partidas()->where('id_partida', $id)->first();

            if ($partida) {
                $partida->sesiones()->delete();

                $partida->delete();

                return response()->json(['message' => 'Partida eliminada correctamente.']);
            }
        }

        return response()->json(['message' => 'No se encontró la partida o no tienes permiso para eliminarla.'], 404);
    }

    //admin
    public function eliminar($userId, $partidaId)
    {
        $partida = Partida::where('id_partida', $partidaId)
            ->where('id_jugador', $userId)
            ->first();

        if (!$partida) {
            return response()->json(['message' => 'Partida no encontrada o no autorizada para eliminar.'], 404);
        }
        $partida->delete();

        return response()->json(['message' => 'Partida eliminada exitosamente.']);
    }

    //admin
    public function sesiones($idUsuario, $idPartida)
    {

        $partida = Partida::where('id_partida', $idPartida)->where('id_jugador', $idUsuario)->first();

        if (!$partida) {
            return response()->json(['message' => 'Partida no encontrada'], 404);
        }

        $sesiones = Sesion::where('id_partida', $idPartida)
            ->with('movimientos')
            ->get();

        return response()->json($sesiones);
    }

    //admin
    public function eliminarSesion($idUsuario, $idPartida, $idSesion)
    {
        $partida = Partida::where('id_partida', $idPartida)->where('id_jugador', $idUsuario)->first();

        if (!$partida) {
            return response()->json(['message' => 'Partida no encontrada o no pertenece al usuario'], 404);
        }

        $sesion = Sesion::where('id_sesion', $idSesion)->where('id_partida', $idPartida)->first();

        if (!$sesion) {
            return response()->json(['message' => 'Sesión no encontrada'], 404);
        }
        $sesion->delete();
        return response()->json(['message' => 'Sesión eliminada correctamente']);
    }

    public function eliminarUltimaSesion($partidaId)
    {
        $usuario = Auth::user();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $partida = Partida::where('id_partida', $partidaId)
            ->where('id_jugador', $usuario->id)
            ->first();

        if (!$partida) {
            return response()->json(['message' => 'Partida no encontrada o no pertenece al usuario'], 404);
        }

        $ultimaSesion = $partida->sesiones()->orderBy('numero_sesion', 'desc')->first();

        if (!$ultimaSesion) {
            return response()->json(['message' => 'No hay sesiones para eliminar'], 404);
        }

        $ultimaSesion->delete();

        if ($partida->sesiones()->count() > 0) {
            $partida->resultado = 'enCurso';
            $partida->save();
        }

        return response()->json(['message' => 'Última sesión eliminada correctamente']);
    }


    public function obtenerIdUltimaPartida()
    {
        $usuario = Auth::user();
        if (!$usuario) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $ultimaPartida = Partida::where('id_jugador', $usuario->id)
            ->latest()
            ->first();
        if (!$ultimaPartida) {
            return response()->json(['error' => 'No se encontró ninguna partida'], 404);
        }
        return response()->json(['id_partida' => $ultimaPartida->id_partida], 200);
    }


    public function crearPartida(Request $request)
    {
        $color_jugador = $request->input('color');
        $resultado = $request->input('id');
        $dificultad = $request->input('dificultad');

        $partida = new Partida();
        $partida->color_jugador = $color_jugador;
        $partida->dificultad = $dificultad;
        $partida->id_jugador = auth()->id();
        $partida->resultado = $resultado;
        $partida->save();

        return response()->json([
            'id_partida' => $partida->id_partida,
            'color_jugador' => $partida->color_jugador,
            'id_jugador' => $partida->id_jugador,
            'resultado' => $partida->resultado
        ]);
    }


    public function guardarPartida(Request $request)
    {

        $id_partida = $request->input('id_partida');
        $resultado = $request->input('resultado');
        $color_jugador = $request->input('colorJugador');

        $partidaId = $request->input('partidaId');
        // $codigo_partida = $request->input('partidaId');
        $numero_sesion = $request->input('numero_sesion');
        $inicio_sesion = $request->input('inicio_sesion');
        $fin_sesion = $request->input('fin_sesion');
        $partida_terminada = $request->input('partida_terminada');

        $movimientos = $request->input('movimientos', []);



        $partida = Partida::find($id_partida);

        // if (!$partida) {
        //     $partida = new Partida();
        //     // $partida->id_partida = $partidaId;
        //     $partida->color_jugador = $color_jugador;
        //     $partida->resultado = $resultado;
        //     $partida->id_jugador = auth()->id();
        //     $partida->resultado = $request->input('resultado');
        //     $partida->save();
        // }

        $partida->resultado = $resultado;
        $partida->save();

        $sesion = new Sesion();
        $sesion->id_partida = $partida->id_partida;
        $sesion->codigo_partida = $partidaId;
        $sesion->numero_sesion = $numero_sesion;
        $sesion->inicio_sesion = $inicio_sesion;
        $sesion->fin_sesion = $fin_sesion;
        $sesion->partida_terminada = $partida_terminada;
        $sesion->save();

        foreach ($movimientos as $movimientoStr) {
            $movimiento = new Movimiento();
            $movimiento->id_sesion = $sesion->id_sesion;
            $movimiento->movimiento = $movimientoStr;
            $movimiento->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Partida y sesión guardadas exitosamente',
            'id_partida' => $partida->id_partida,
            'id_sesion' => $sesion->id_sesion
        ]);
    }

    public function obtenerMovimientosDePartida($idPartida)
    {
        $partida = Partida::with('sesiones.movimientos')->find($idPartida);

        if (!$partida) {
            return response()->json(['error' => 'Partida no encontrada'], 404);
        }

        $movimientos = $partida->sesiones
            ->flatMap(function ($sesion) {
                return $sesion->movimientos;
            })
            ->sortBy('created_at')
            ->values();

        return response()->json(['movimientos' => $movimientos]);
    }
}
