<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $usuarios = User::paginate(6);
        return view('admin.panelControl', compact('usuarios'));
    }

    public function destroy($id)
    {
        $usuario = User::findOrFail($id);
        $usuario->delete();
        return redirect()->route('admin.panelControl')->with('success', 'Usuario eliminado correctamente.');
    }

    public function partidas($id)
    {
        $usuario = User::findOrFail($id);
        $partidas = $usuario->partidas;

        return response()->json($partidas);
    }

    public function perfil($id)
    {
        $usuario = User::findOrFail($id);
        // $partidas = $usuario->partidas;

        return response()->json($usuario);
    }

    public function actualizarNombreEmail(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
        ]);
        $user = User::findOrFail($id);
        $user->update($request->only('name', 'email'));
        return response()->json(['success' => true, 'message' => 'Nombre y email actualizados correctamente']);
    }

    public function actualizarToken(Request $request, $id)
    {
        $request->validate(['api_token' => 'nullable|string']);
        $user = User::findOrFail($id);
        $user->update(['api_token' => $request->api_token]);
        return response()->json(['success' => true, 'message' => 'API Token actualizado correctamente']);
    }

    public function actualizarRol(Request $request, $id)
    {
        $request->validate(['rol' => 'required|in:user,admin']);
        $user = User::findOrFail($id);
        $user->update(['rol' => $request->rol]);
        return response()->json(['success' => true, 'message' => 'Rol actualizado correctamente']);
    }
}
