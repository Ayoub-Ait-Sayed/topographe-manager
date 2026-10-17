<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Devis;
use App\Models\Facture;
use App\Models\Rapport;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    /**
     * Générer le PDF d'un rapport.
     */
    public function rapport($id)
    {
        $rapport = Rapport::with([
            'projet.client',
            'createur',
        ])->findOrFail($id);

        $pdf = Pdf::loadView(
            'pdf.rapport',
            [
                'rapport' => $rapport,
            ]
        );

        $pdf->setPaper('A4', 'portrait');

        return $pdf->download(
            'rapport-' . $rapport->id . '.pdf'
        );
    }

    /**
     * Générer le PDF d'un devis.
     */
    public function devis($id)
    {
        $devis = Devis::with([
            'client',
            'projet',
            'items',
        ])->findOrFail($id);

        $pdf = Pdf::loadView(
            'pdf.devis',
            [
                'devis' => $devis,
            ]
        );

        $pdf->setPaper('A4', 'portrait');

        return $pdf->download(
            'devis-' . $devis->numero . '.pdf'
        );
    }

    /**
     * Générer le PDF d'une facture.
     */
    public function facture($id)
    {
        $facture = Facture::with([
            'client',
            'projet',
            'items',
        ])->findOrFail($id);

        $pdf = Pdf::loadView(
            'pdf.facture',
            [
                'facture' => $facture,
            ]
        );

        $pdf->setPaper('A4', 'portrait');

        return $pdf->download(
            'facture-' . $facture->numero . '.pdf'
        );
    }
}