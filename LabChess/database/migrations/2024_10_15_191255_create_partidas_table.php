<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::create('partidas', function (Blueprint $table) {
            $table->id('id_partida');
            $table->string('resultado')->nullable();
            $table->string('dificultad');
            $table->string('color_jugador')->nullable();
            $table->foreignId('id_jugador')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partidas');
    }
};
