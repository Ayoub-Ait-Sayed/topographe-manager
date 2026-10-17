<?php

namespace App\Policies;

use App\Models\Projet;
use App\Models\User;

class ProjetPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
            'technicien',
        ], true);
    }

    public function view(User $user, Projet $projet): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
            'technicien',
        ], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
        ], true);
    }

    public function update(User $user, Projet $projet): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
        ], true);
    }

    public function delete(User $user, Projet $projet): bool
    {
        return $user->role === 'admin';
    }
}