<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
        ], true);
    }

    public function view(User $user, Client $client): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
        ], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
        ], true);
    }

    public function update(User $user, Client $client): bool
    {
        return in_array($user->role, [
            'admin',
            'topographe',
        ], true);
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->role === 'admin';
    }
}