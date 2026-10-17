<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function interventions(): HasMany
    {
        return $this->hasMany(
            Intervention::class,
            'technicien_id'
        );
    }

    public function documents(): HasMany
    {
        return $this->hasMany(
            Document::class,
            'uploaded_by'
        );
    }

    public function photos(): HasMany
    {
        return $this->hasMany(
            Photo::class,
            'uploaded_by'
        );
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function rapports(): HasMany
    {
        return $this->hasMany(
            Rapport::class,
            'created_by'
        );
    }
  

}