<?php

namespace App\Policies;

use App\Models\Photo;
use App\Models\User;

class PhotoPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function view(User $user, Photo $photo): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function update(User $user, Photo $photo): bool
    {
        return in_array($user->role, ['admin', 'topographe'], true);
    }

    public function delete(User $user, Photo $photo): bool
    {
        return in_array($user->role, ['admin', 'topographe'], true);
    }
}