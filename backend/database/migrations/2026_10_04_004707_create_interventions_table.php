<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interventions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('projet_id')
                ->constrained('projets')
                ->cascadeOnDelete();

            $table->foreignId('technicien_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->date('date');

            $table->time('heure_debut')->nullable();
            $table->time('heure_fin')->nullable();

            $table->text('description')->nullable();

            $table->enum('statut', [
                'planifiee',
                'en_cours',
                'terminee',
                'annulee'
            ])->default('planifiee');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interventions');
    }
};