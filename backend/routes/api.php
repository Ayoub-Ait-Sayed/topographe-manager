<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ProjetController;
use App\Http\Controllers\Api\MissionController;
use App\Http\Controllers\Api\InterventionController;
use App\Http\Controllers\Api\RapportController;
use App\Http\Controllers\Api\DevisController;
use App\Http\Controllers\Api\FactureController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\PhotoController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PdfController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/logout', [AuthController::class, 'logout']);


    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [DashboardController::class, 'index']);


    /*
    |--------------------------------------------------------------------------
    | Clients
    |--------------------------------------------------------------------------
    */

    Route::apiResource('clients', ClientController::class);


    /*
    |--------------------------------------------------------------------------
    | Projets
    |--------------------------------------------------------------------------
    */

    Route::apiResource('projets', ProjetController::class);


    /*
    |--------------------------------------------------------------------------
    | Missions
    |--------------------------------------------------------------------------
    */

    Route::apiResource('missions', MissionController::class);


    /*
    |--------------------------------------------------------------------------
    | Interventions
    |--------------------------------------------------------------------------
    */

    Route::apiResource('interventions', InterventionController::class);


    /*
    |--------------------------------------------------------------------------
    | Documents
    |--------------------------------------------------------------------------
    */

Route::get('/documents/{document}/download', [DocumentController::class, 'download']);

Route::apiResource('documents', DocumentController::class);

    /*
    |--------------------------------------------------------------------------
    | Photos
    |--------------------------------------------------------------------------
    */

Route::get('/photos/{photo}/download', [PhotoController::class, 'download']);
Route::apiResource('photos', PhotoController::class);

    /*
    |--------------------------------------------------------------------------
    | Notes
    |--------------------------------------------------------------------------
    */

    Route::apiResource('notes', NoteController::class);


    /*
    |--------------------------------------------------------------------------
    | Rapports
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/rapports/{rapport}/pdf',
        [PdfController::class, 'rapport']
    );

Route::get('/rapports/{rapport}/download', [RapportController::class, 'download']);
Route::apiResource('rapports', RapportController::class);

    /*
    |--------------------------------------------------------------------------
    | Devis
    |--------------------------------------------------------------------------
    |
    | PDF avant apiResource pour éviter que "pdf"
    | soit interprété comme un ID de devis.
    |
    */

    Route::get(
        '/devis/{devis}/pdf',
        [PdfController::class, 'devis']
    );

    Route::apiResource('devis', DevisController::class);


    /*
    |--------------------------------------------------------------------------
    | Factures
    |--------------------------------------------------------------------------
    |
    | PDF avant apiResource pour éviter les conflits de routes.
    |
    */

    Route::get(
        '/factures/{facture}/pdf',
        [PdfController::class, 'facture']
    );
    Route::get('/factures/{facture}/pdf', [PdfController::class, 'facture']);
    Route::apiResource('factures', FactureController::class);


    /*
    |--------------------------------------------------------------------------
    | Paiements
    |--------------------------------------------------------------------------
    */

    Route::apiResource('paiements', PaiementController::class);


    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/notifications',
        [NotificationController::class, 'index']
    );

    Route::get(
        '/notifications/unread',
        [NotificationController::class, 'unread']
    );

    Route::patch(
        '/notifications/{id}/read',
        [NotificationController::class, 'read']
    );

    Route::patch(
        '/notifications/read-all',
        [NotificationController::class, 'readAll']
    );

    Route::delete(
        '/notifications/{id}',
        [NotificationController::class, 'destroy']
    );
});


/*
|--------------------------------------------------------------------------
| Role Test Routes
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:admin',
])->get('/test-admin', function () {

    return response()->json([
        'success' => true,
        'message' => 'Admin access granted.',
    ]);
});


/*
|--------------------------------------------------------------------------
| Topographe
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:topographe',
])->get('/test-topographe', function () {

    return response()->json([
        'success' => true,
        'message' => 'Topographe access granted.',
    ]);
});


/*
|--------------------------------------------------------------------------
| Technicien
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:technicien',
])->get('/test-technicien', function () {

    return response()->json([
        'success' => true,
        'message' => 'Technicien access granted.',
    ]);
});