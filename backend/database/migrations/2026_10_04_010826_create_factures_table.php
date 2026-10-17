<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('factures', function (Blueprint $table) {
            $table->id();

            $table->string('numero')->unique();

            $table->foreignId('client_id')
                ->constrained('clients')
                ->cascadeOnDelete();

            $table->foreignId('projet_id')
                ->nullable()
                ->constrained('projets')
                ->nullOnDelete();

            $table->date('date');

            $table->decimal('montant_ht', 12, 2)->default(0);
            $table->decimal('tva', 12, 2)->default(0);
            $table->decimal('montant_ttc', 12, 2)->default(0);

            $table->enum('statut', [
                'impayee',
                'partiellement_payee',
                'payee',
                'annulee'
            ])->default('impayee');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};