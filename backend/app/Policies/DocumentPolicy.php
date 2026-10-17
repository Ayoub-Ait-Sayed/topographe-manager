<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function view(User $user, Document $document): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function update(User $user, Document $document): bool
    {
        return in_array($user->role, ['admin', 'topographe'], true);
    }

    public function delete(User $user, Document $document): bool
    {
        return in_array($user->role, ['admin', 'topographe'], true);
    }
}