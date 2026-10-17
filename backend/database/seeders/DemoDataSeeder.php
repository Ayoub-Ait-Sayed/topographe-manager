<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Devis;
use App\Models\Facture;
use App\Models\Intervention;
use App\Models\Mission;
use App\Models\Projet;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Users
        |--------------------------------------------------------------------------
        */

        $admin = User::updateOrCreate(
            [
                'email' => 'admin@topographe.test',
            ],
            [
                'name' => 'Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        $topographe = User::updateOrCreate(
            [
                'email' => 'topographe@topographe.test',
            ],
            [
                'name' => 'Topographe',
                'password' => Hash::make('password123'),
                'role' => 'topographe',
            ]
        );

        $technicien = User::updateOrCreate(
            [
                'email' => 'technicien@topographe.test',
            ],
            [
                'name' => 'Technicien',
                'password' => Hash::make('password123'),
                'role' => 'technicien',
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Clients
        |--------------------------------------------------------------------------
        */

        $client1 = Client::updateOrCreate(
            [
                'email' => 'client1@test.com',
            ],
            [
                'nom' => 'Ahmed El Amrani',
                'entreprise' => 'Entreprise El Amrani',
                'telephone' => '0600000001',
                'adresse' => 'Agadir',
                'ville' => 'Agadir',
                'notes' => 'Client de démonstration',
            ]
        );

        $client2 = Client::updateOrCreate(
            [
                'email' => 'client2@test.com',
            ],
            [
                'nom' => 'Mohamed Alaoui',
                'entreprise' => 'Alaoui Construction',
                'telephone' => '0600000002',
                'adresse' => 'Inezgane',
                'ville' => 'Inezgane',
                'notes' => 'Deuxième client de démonstration',
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Projets
        |--------------------------------------------------------------------------
        */

        $projet1 = Projet::updateOrCreate(
            [
                'reference' => 'PROJ-2026-001',
            ],
            [
                'nom' => 'Projet Topographique Agadir',
                'description' => 'Levée topographique et étude du terrain.',
                'client_id' => $client1->id,
                'type_mission' => 'Levée topographique',
                'adresse' => 'Hay Salam',
                'ville' => 'Agadir',
                'latitude' => 30.4278,
                'longitude' => -9.5981,
                'date_debut' => now()->toDateString(),
                'date_fin' => now()->addDays(15)->toDateString(),
                'statut' => 'en_cours',
                'montant' => 15000,
            ]
        );

        $projet2 = Projet::updateOrCreate(
            [
                'reference' => 'PROJ-2026-002',
            ],
            [
                'nom' => 'Étude terrain Inezgane',
                'description' => 'Étude et relevé du terrain.',
                'client_id' => $client2->id,
                'type_mission' => 'Étude topographique',
                'adresse' => 'Centre Inezgane',
                'ville' => 'Inezgane',
                'latitude' => 30.3550,
                'longitude' => -9.5360,
                'date_debut' => now()->toDateString(),
                'date_fin' => now()->addDays(20)->toDateString(),
                'statut' => 'en_attente',
                'montant' => 12000,
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Missions
        |--------------------------------------------------------------------------
        */

        $mission1 = Mission::updateOrCreate(
            [
                'projet_id' => $projet1->id,
                'titre' => 'Levée topographique',
            ],
            [
                'description' => 'Réalisation de la levée topographique.',
                'date_debut' => now()->toDateString(),
                'date_fin' => now()->addDays(5)->toDateString(),
                'statut' => 'en_cours',
            ]
        );

        $mission2 = Mission::updateOrCreate(
            [
                'projet_id' => $projet2->id,
                'titre' => 'Étude du terrain',
            ],
            [
                'description' => 'Étude topographique du terrain.',
                'date_debut' => now()->addDays(2)->toDateString(),
                'date_fin' => now()->addDays(10)->toDateString(),
                'statut' => 'en_attente',
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Interventions
        |--------------------------------------------------------------------------
        */

        Intervention::updateOrCreate(
            [
                'projet_id' => $projet1->id,
                'technicien_id' => $technicien->id,
                'date' => now()->toDateString(),
            ],
            [
                'heure_debut' => '08:00',
                'heure_fin' => '16:00',
                'description' => 'Intervention terrain.',
                'statut' => 'terminee',
            ]
        );


        /*
        |--------------------------------------------------------------------------
        | Information
        |--------------------------------------------------------------------------
        */

        echo PHP_EOL;
        echo "=============================================" . PHP_EOL;
        echo "     DEMO DATA CREATED SUCCESSFULLY" . PHP_EOL;
        echo "=============================================" . PHP_EOL;
        echo "Admin      : admin@topographe.test" . PHP_EOL;
        echo "Topographe : topographe@topographe.test" . PHP_EOL;
        echo "Technicien : technicien@topographe.test" . PHP_EOL;
        echo "Password   : password123" . PHP_EOL;
        echo "=============================================" . PHP_EOL;
    }
}