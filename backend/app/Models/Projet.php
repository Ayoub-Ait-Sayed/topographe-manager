<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Projet extends Model
{
    protected $fillable = [
        'reference',
        'nom',
        'description',
        'client_id',
        'type_mission',
        'adresse',
        'ville',
        'latitude',
        'longitude',
        'date_debut',
        'date_fin',
        'statut',
        'montant',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'montant' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class);
    }

    public function interventions(): HasMany
    {
        return $this->hasMany(Intervention::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function rapports(): HasMany
    {
        return $this->hasMany(Rapport::class);
    }

    public function devis(): HasMany
    {
        return $this->hasMany(Devis::class);
    }

    public function factures(): HasMany
    {
        return $this->hasMany(Facture::class);
    }






}