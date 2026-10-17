<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projets', function (Blueprint $table) {
            $table->id();

            $table->string('reference')->unique();
            $table->string('nom');
            $table->text('description')->nullable();

            $table->foreignId('client_id')
                ->constrained('clients')
                ->cascadeOnDelete();

            $table->string('type_mission');

            $table->text('adresse')->nullable();
            $table->string('ville')->nullable();

            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();

            $table->enum('statut', [
                'en_attente',
                'en_cours',
                'termine',
                'annule'
            ])->default('en_attente');

            $table->decimal('montant', 12, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projets');
    }
};