<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Sesion extends Model
{
    use HasFactory;

    protected $table = 'sesiones';
    protected $primaryKey = 'id_sesion';

    protected $fillable = [
        'id_sesion',
        'id_partida',
        'codigo_partida',
        'numero_sesion',
        'inicio_sesion',
        'fin_sesion',
        'partida_terminada',
    ];

    public function partida()
    {
        return $this->belongsTo(Partida::class, 'id_partida');
    }

    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_sesion');
    }
}
