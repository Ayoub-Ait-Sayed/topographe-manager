<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'nom',
        'entreprise',
        'telephone',
        'email',
        'adresse',
        'ville',
        'notes',
    ];

    public function projets(): HasMany
    {
        return $this->hasMany(Projet::class);
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