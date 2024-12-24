<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movimiento extends Model
{
    use HasFactory;

    protected $table = 'movimientos';
    protected $primaryKey = 'id_movimiento';

    protected $fillable = [
        'id_movimiento',
        'id_sesion',
        'movimiento',
    ];

    public function sesion()
    {
        return $this->belongsTo(Sesion::class, 'id_sesion');
    }
}
