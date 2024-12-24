<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// class Partida extends Model
// {
//     use HasFactory;
// }

class Partida extends Model
{
    use HasFactory;

    protected $table = 'partidas'; 
    protected $primaryKey = 'id_partida'; 
    public $incrementing = false; 
    protected $keyType = 'string'; 

    protected $fillable = [
        'id_partida',
        'resultado',
        'dificultad',
        'color_jugador',
        'id_jugador',
    ];

    public function jugador()
    {
        return $this->belongsTo(User::class, 'id');
    }
    

    public function sesiones()
    {
        return $this->hasMany(Sesion::class, 'id_partida');
    }
}

