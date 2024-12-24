<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\ListaController;
use App\Http\Controllers\PartidaController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\RolMiddleware;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/tablero', function () {
    return view('tablero');
})->name('tablero');

Route::get('/partida', function () {
    return view('partida/partida');
})->name('partida');

Route::get('/partidaAltaDuracion', function () {
    return view('partidaAltaDuracion/partidaAltaDuracion');
})->name('partidaAltaDuracion');

Route::get('/bots', function () {
    return view('/llamadasApiBot/bots');
})->name('bots');

Route::get('/crearpartida', function () {
    return view('/crearPartida/crear');
})->name('crearPartida');

Route::get('/crear-partida', [ApiController::class, 'crearPartida']);
Route::post('/abandonar-partida/{gameId}', [ApiController::class, 'abandonarPartida']);

Route::get('/crearpartidaDificultad', function () {
    return view('/crearPartida/crearDificultad');
})->name('crearPartidaDificultad');
Route::post('/challenge-ai', [ApiController::class, 'challengeAi']);

Route::get('/lista', function () {
    return view('/lista/lista');
})->name('lista');
Route::get('/jugadores/filtrar', [ListaController::class, 'filtrar']);


Route::middleware(RolMiddleware::class . ':admin')->group(function () {
    Route::get('/admin', [UserController::class, 'index'])->name('admin.panelControl');

    Route::delete('/usuarios/{id}', [UserController::class, 'destroy'])->name('usuarios.destroy');

    Route::get('/usuarios/{id}/partidas', [UserController::class, 'partidas'])->name('usuarios.partidas');
    Route::get('/usuarios/{id}/perfil', [UserController::class, 'perfil'])->name('usuarios.perfil');
    Route::post('/usuarios/{id}/perfil', [ProfileController::class, 'update'])->name('perfil.update');
    Route::post('/usuarios/{id}/actualizar-nombre', [UserController::class, 'actualizarNombreEmail']);
    Route::post('/usuarios/{id}/actualizar-token', [UserController::class, 'actualizarToken']);
    Route::post('/usuarios/{id}/actualizar-rol', [UserController::class, 'actualizarRol']);
    Route::delete('/usuarios/{idUsuario}/partida/{idPartida}/delete', [PartidaController::class, 'eliminar'])->name('partida.eliminar');
    Route::get('/usuarios/{idUsuario}/partida/{idPartida}/sesiones', [PartidaController::class, 'sesiones'])->name('sesiones');
    Route::delete('/usuarios/{idUsuario}/partida/{idPartida}/sesion/{idSesion}/delete', [PartidaController::class, 'eliminarSesion'])->name('sesion.eliminar');
});

Route::get('/partidas', [PartidaController::class, 'verPartidas'])->name('verPartidas');

Route::get('/partida/{idPartida}/movimientos', [PartidaController::class, 'obtenerMovimientosDePartida']);
Route::get('/ultima-partida', [PartidaController::class, 'obtenerIdUltimaPartida']);
Route::get('/partida/{idPartida}', [PartidaController::class, 'obtenerPartidaPorId']);
Route::delete('/partida/{id}', [PartidaController::class, 'eliminarPartida'])->name('eliminarPartida');
Route::delete('/partida/{paridaId}/sesion', [PartidaController::class, 'eliminarUltimaSesion'])->name('eliminarUltimaSesion');
Route::post('/crear-partida', [PartidaController::class, 'crearPartida']);
Route::post('/guardar-partida', [PartidaController::class, 'guardarPartida'])->name('guardar.partida');

Route::get('/api/obtener-bots-online', [ApiController::class, 'obtenerBotsLichess']);

Route::get('/api/obtener-bots-correspondencia', [ApiController::class, 'obtenerBotsCorrespondencia']);

Route::post('/conseguir-partida/{id}', [ApiController::class, 'conseguirIdPartida'])->name('conseguir.partida');

// Route::get('/api/esperar-movimiento-bot/{id}', [ApiController::class, 'esperarMovimientoBot']);
// Route::get('/stream-game/{gameId}', [ApiController::class, 'streamGame']);
// Route::get('/api/realizar-movimiento-bot/{id}', [ApiController::class, 'realizarMovimientoBot']);


// Rutas de Breeze de inicio de sesion

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/token', [ProfileController::class, 'updateToken'])->name('profile.update.token');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
