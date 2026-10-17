<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Projet;
use App\Models\Intervention;
use App\Models\Rapport;
use App\Models\Devis;
use App\Models\Facture;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        /*
        |--------------------------------------------------------------------------
        | Statistiques générales
        |--------------------------------------------------------------------------
        */

        $totalClients = Client::count();
        $totalProjets = Projet::count();
        $totalInterventions = Intervention::count();
        $totalRapports = Rapport::count();
        $totalDevis = Devis::count();
        $totalFactures = Facture::count();

        /*
        |--------------------------------------------------------------------------
        | Montants financiers
        |--------------------------------------------------------------------------
        */

        $montantTotalDevis = Devis::sum('montant_ttc');
        $montantTotalFactures = Facture::sum('montant_ttc');

        /*
        |--------------------------------------------------------------------------
        | Factures par statut
        |--------------------------------------------------------------------------
        */

        $facturesPayees = Facture::where('statut', 'payee')->count();
        $facturesImpayees = Facture::where('statut', 'impayee')->count();

        $facturesPartiellementPayees = Facture::where(
            'statut',
            'partiellement_payee'
        )->count();

        /*
        |--------------------------------------------------------------------------
        | Projets par statut
        |--------------------------------------------------------------------------
        */

        $projetsEnAttente = Projet::where('statut', 'en_attente')->count();
        $projetsEnCours = Projet::where('statut', 'en_cours')->count();
        $projetsTermines = Projet::where('statut', 'termine')->count();
        $projetsAnnules = Projet::where('statut', 'annule')->count();

        /*
        |--------------------------------------------------------------------------
        | Interventions par statut
        |--------------------------------------------------------------------------
        */

        $interventionsPlanifiees = Intervention::where(
            'statut',
            'planifiee'
        )->count();

        $interventionsEnCours = Intervention::where(
            'statut',
            'en_cours'
        )->count();

        $interventionsTerminees = Intervention::where(
            'statut',
            'terminee'
        )->count();

        $interventionsAnnulees = Intervention::where(
            'statut',
            'annulee'
        )->count();

        /*
        |--------------------------------------------------------------------------
        | Graphiques : 12 derniers mois
        |--------------------------------------------------------------------------
        */

        $labels = [];
        $clientsParMois = [];
        $devisParMois = [];
        $facturesParMois = [];
        $projetsParMois = [];
        $interventionsParMois = [];
        $rapportsParMois = [];

        $moisFrancais = [
            1 => 'Jan',
            2 => 'Fév',
            3 => 'Mar',
            4 => 'Avr',
            5 => 'Mai',
            6 => 'Juin',
            7 => 'Juil',
            8 => 'Août',
            9 => 'Sep',
            10 => 'Oct',
            11 => 'Nov',
            12 => 'Déc',
        ];

        $debut = Carbon::now()->startOfMonth()->subMonths(11);

        for ($i = 0; $i < 12; $i++) {
            $mois = $debut->copy()->addMonths($i);

            $dateDebut = $mois->copy()->startOfMonth();
            $dateFin = $mois->copy()->endOfMonth();

            $labels[] = $moisFrancais[$mois->month];

            // Nombre de clients créés pendant le mois
            $clientsParMois[] = Client::whereBetween(
                'created_at',
                [$dateDebut, $dateFin]
            )->count();

            // Montant total des devis du mois
            $devisParMois[] = (float) Devis::whereBetween(
                'date',
                [
                    $dateDebut->toDateString(),
                    $dateFin->toDateString(),
                ]
            )->sum('montant_ttc');

            // Montant total des factures du mois
            $facturesParMois[] = (float) Facture::whereBetween(
                'date',
                [
                    $dateDebut->toDateString(),
                    $dateFin->toDateString(),
                ]
            )->sum('montant_ttc');
            
            $projetsParMois[] = Projet::whereBetween(
                'created_at',
                [$dateDebut, $dateFin]
            )->count();

            $interventionsParMois[] = Intervention::whereBetween(
                'created_at',
                [$dateDebut, $dateFin]
            )->count();

            $rapportsParMois[] = Rapport::whereBetween(
                'created_at',
                [$dateDebut, $dateFin]
            )->count();
        }

        /*
        |--------------------------------------------------------------------------
        | Derniers projets
        |--------------------------------------------------------------------------
        */

        $projetsRecents = Projet::with('client')
            ->latest()
            ->limit(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Dernières interventions
        |--------------------------------------------------------------------------
        */

        $interventionsRecentes = Intervention::with([
            'projet',
            'technicien',
        ])
            ->latest()
            ->limit(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Derniers devis
        |--------------------------------------------------------------------------
        */

        $devisRecents = Devis::with([
            'client',
            'projet',
        ])
            ->latest('date')
            ->limit(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Dernières factures
        |--------------------------------------------------------------------------
        */

        $facturesRecentes = Facture::with([
            'client',
            'projet',
        ])
            ->latest('date')
            ->limit(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Réponse API
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,

            'data' => [

                'statistiques' => [
                    'clients' => $totalClients,
                    'projets' => $totalProjets,
                    'interventions' => $totalInterventions,
                    'rapports' => $totalRapports,
                    'devis' => $totalDevis,
                    'factures' => $totalFactures,
                ],

                'finances' => [
                    'montant_total_devis' => $montantTotalDevis,
                    'montant_total_factures' => $montantTotalFactures,
                ],

                'factures' => [
                    'payees' => $facturesPayees,
                    'impayees' => $facturesImpayees,
                    'partiellement_payees' => $facturesPartiellementPayees,
                ],

                'projets' => [
                    'en_attente' => $projetsEnAttente,
                    'en_cours' => $projetsEnCours,
                    'termines' => $projetsTermines,
                    'annules' => $projetsAnnules,
                ],

                'interventions' => [
                    'planifiees' => $interventionsPlanifiees,
                    'en_cours' => $interventionsEnCours,
                    'terminees' => $interventionsTerminees,
                    'annulees' => $interventionsAnnulees,
                ],

                // Données utilisées par les graphiques React
                'charts' => [
                    'labels' => $labels,
                    'clients' => $clientsParMois,
                    'projets' => $projetsParMois,
                    'interventions' => $interventionsParMois,
                    'rapports' => $rapportsParMois,
                    'devis' => $devisParMois,
                    'factures' => $facturesParMois,
                ],

                'projets_recents' => $projetsRecents,

                'interventions_recentes' => $interventionsRecentes,

                'devis_recents' => $devisRecents,

                'factures_recentes' => $facturesRecentes,
            ],
        ]);
    }
}