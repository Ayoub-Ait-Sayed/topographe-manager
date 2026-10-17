<?php

namespace App\Policies;

use App\Models\Rapport;
use App\Models\User;

class RapportPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function view(User $user, Rapport $rapport): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'topographe'], true);
    }

    public function update(User $user, Rapport $rapport): bool
    {
        return in_array($user->role, ['admin', 'topographe'], true);
    }

    public function delete(User $user, Rapport $rapport): bool
    {
        return $user->role === 'admin';
    }
}