<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Devis extends Model
{
    protected $fillable = [
        'numero',
        'client_id',
        'projet_id',
        'date',
        'validite',
        'montant_ht',
        'tva',
        'montant_ttc',
        'statut',
    ];

    protected $casts = [
        'date' => 'date',
        'validite' => 'date',
        'montant_ht' => 'decimal:2',
        'tva' => 'decimal:2',
        'montant_ttc' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function projet(): BelongsTo
    {
        return $this->belongsTo(Projet::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(DevisItem::class);
    }
}