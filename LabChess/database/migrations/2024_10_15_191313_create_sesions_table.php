<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::create('sesiones', function (Blueprint $table) {
            $table->id('id_sesion');
            $table->unsignedBigInteger('id_partida');
            $table->string('codigo_partida')->nullable();
            $table->integer('numero_sesion');
            $table->timestamp('inicio_sesion');
            $table->timestamp('fin_sesion')->nullable();
            $table->boolean('partida_terminada')->default(false);
            $table->timestamps();

            // Foreign key
            $table->foreign('id_partida')->references('id_partida')->on('partidas')->onDelete('cascade');

            $table->unique(['id_partida', 'numero_sesion']);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sesiones');
    }
};
