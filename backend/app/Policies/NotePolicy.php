<?php

namespace App\Policies;

use App\Models\Note;
use App\Models\User;

class NotePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function view(User $user, Note $note): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function update(User $user, Note $note): bool
    {
        return in_array($user->role, ['admin', 'topographe', 'technicien'], true);
    }

    public function delete(User $user, Note $note): bool
    {
        return $user->role === 'admin';
    }
}