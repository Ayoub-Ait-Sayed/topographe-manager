<?php

namespace App\Policies;

use App\Models\User;

class PaiementPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
        ], true);
    }

    public function view(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
        ], true);
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user): bool
    {
        return $user->role === 'admin';
    }
}