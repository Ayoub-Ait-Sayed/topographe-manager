<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">

    <style>
        @page {
            margin: 35px 38px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            color: #334155;
            line-height: 1.5;
        }

        .header {
            width: 100%;
            border-bottom: 3px solid #163b65;
            padding-bottom: 18px;
            margin-bottom: 25px;
        }

        .header-table,
        .info-table,
        .items-table,
        .bottom-table {
            width: 100%;
            border-collapse: collapse;
        }

        .brand {
            color: #163b65;
            font-size: 19px;
            font-weight: bold;
        }

        .brand-subtitle {
            color: #64748b;
            font-size: 9px;
        }

        .document-label {
            text-align: right;
            color: #163b65;
            font-size: 25px;
            font-weight: bold;
        }

        .document-number {
            text-align: right;
            font-size: 10px;
            color: #64748b;
        }

        .section-title {
            font-size: 10px;
            font-weight: bold;
            color: #163b65;
            text-transform: uppercase;
            margin-bottom: 8px;
        }

        .info-table {
            margin-bottom: 25px;
        }

        .info-table td {
            width: 50%;
            vertical-align: top;
            padding: 12px;
            background-color: #f4f7fb;
            border: 1px solid #e2e8f0;
        }

        .info-value {
            color: #1e293b;
            font-size: 11px;
            font-weight: bold;
        }

        .muted {
            color: #64748b;
        }

        .items-table {
            margin-top: 12px;
        }

        .items-table thead th {
            background-color: #163b65;
            color: #ffffff;
            text-align: left;
            font-size: 9px;
            padding: 11px 8px;
            border: 1px solid #163b65;
        }

        .items-table tbody td {
            padding: 10px 8px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
        }

        .items-table tbody tr:nth-child(even) {
            background-color: #f8fafc;
        }

        .center {
            text-align: center;
        }

        .right {
            text-align: right;
        }

        .totals-wrapper {
            width: 100%;
            margin-top: 20px;
        }

        .totals-table {
            width: 55%;
            margin-left: 45%;
            border-collapse: collapse;
        }

        .totals-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
        }

        .totals-table .grand-total td {
            background-color: #163b65;
            color: #ffffff;
            font-size: 12px;
            font-weight: bold;
            border-bottom: none;
            padding: 12px 10px;
        }

        .status {
            display: inline-block;
            padding: 5px 10px;
            background-color: #eff6ff;
            color: #1d4ed8;
            font-weight: bold;
            border-radius: 4px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 12px;
            border-top: 1px solid #cbd5e1;
            color: #64748b;
            font-size: 8px;
            text-align: center;
        }

        .payment-note {
            margin-top: 25px;
            padding: 12px;
            border-left: 3px solid #163b65;
            background-color: #f4f7fb;
        }
    </style>
</head>

<body>

    {{-- En-tête --}}
    <div class="header">
        <table class="header-table">
            <tr>
                <td style="vertical-align: top;">
                    <div class="brand">TOPOGRAPHE MANAGER</div>
                    <div class="brand-subtitle">
                        Gestion professionnelle des projets topographiques
                    </div>
                </td>

                <td style="vertical-align: top;">
                    <div class="document-label">FACTURE</div>
                    <div class="document-number">
                        N° :
                        {{ $facture->numero ?? ('FAC-' . $facture->id) }}
                    </div>
                    <div class="document-number">
                        Date :
                        {{ $facture->date ? \Carbon\Carbon::parse($facture->date)->format('d/m/Y') : $facture->created_at->format('d/m/Y') }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    {{-- Informations client et projet --}}
    <table class="info-table">
        <tr>
            <td>
                <div class="section-title">Facturé à</div>

                <div class="info-value">
                    {{ $facture->client->nom ?? 'Client non renseigné' }}
                </div>

                @if(!empty($facture->client->entreprise))
                    <div>{{ $facture->client->entreprise }}</div>
                @endif

                @if(!empty($facture->client->adresse))
                    <div>{{ $facture->client->adresse }}</div>
                @endif

                @if(!empty($facture->client->ville))
                    <div>{{ $facture->client->ville }}</div>
                @endif

                @if(!empty($facture->client->email))
                    <div>{{ $facture->client->email }}</div>
                @endif

                @if(!empty($facture->client->telephone))
                    <div>{{ $facture->client->telephone }}</div>
                @endif
            </td>

            <td>
                <div class="section-title">Informations du projet</div>

                <div class="info-value">
                    {{ $facture->projet->nom ?? $facture->projet->titre ?? 'Projet non renseigné' }}
                </div>

                <div style="margin-top: 8px;">
                    <span class="muted">Statut :</span>
                    <span class="status">
                        {{ ucfirst(str_replace('_', ' ', $facture->statut ?? 'non défini')) }}
                    </span>
                </div>
            </td>
        </tr>
    </table>

    {{-- Détail des prestations --}}
    <div class="section-title">Détail des prestations</div>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 43%;">Description</th>
                <th class="center" style="width: 15%;">Quantité</th>
                <th class="right" style="width: 20%;">Prix unitaire</th>
                <th class="right" style="width: 22%;">Total</th>
            </tr>
        </thead>

        <tbody>
            @forelse($facture->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>

                    <td class="center">
                        {{ number_format((float) $item->quantite, 2, ',', ' ') }}
                    </td>

                    <td class="right">
                        {{ number_format((float) $item->prix_unitaire, 2, ',', ' ') }}
                    </td>

                    <td class="right">
                        {{ number_format((float) $item->total, 2, ',', ' ') }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" class="center muted">
                        Aucune prestation renseignée.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    {{-- Totaux --}}
    <div class="totals-wrapper">
        <table class="totals-table">
            <tr>
                <td class="muted">Total hors taxes (HT)</td>
                <td class="right">
                    {{ number_format((float) $facture->montant_ht, 2, ',', ' ') }}
                </td>
            </tr>

            <tr>
                <td class="muted">TVA</td>
                <td class="right">
                    {{ number_format((float) $facture->tva, 2, ',', ' ') }}
                </td>
            </tr>

            <tr class="grand-total">
                <td>TOTAL TTC</td>
                <td class="right">
                    {{ number_format((float) $facture->montant_ttc, 2, ',', ' ') }}
                    MAD
                </td>
            </tr>
        </table>
    </div>

    {{-- Note --}}
    <div class="payment-note">
        <strong>Note :</strong>
        Merci pour votre confiance.
        Pour toute question concernant cette facture, veuillez contacter
        votre interlocuteur.
    </div>

    {{-- Pied de page --}}
    <div class="footer">
        <strong>TOPOGRAPHE MANAGER</strong>
        <br>
        Facture générée automatiquement par votre plateforme de gestion.
        <br>
        Document à conserver pour vos archives.
    </div>

</body>
</html>

