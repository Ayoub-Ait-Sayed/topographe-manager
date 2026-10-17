<?php

namespace App\Policies;

use App\Models\User;

class InterventionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
            'technicien',
        ], true);
    }

    public function update(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
            'technicien',
        ], true);
    }

    public function delete(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
        ], true);
    }
}