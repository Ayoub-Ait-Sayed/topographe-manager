<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Devis {{ $devis->numero }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #1f2937; padding: 30px; }
        h2 { color: #2563eb; }
        .section-title { background: #2563eb; color: white; padding: 8px 10px; font-weight: bold; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0 20px 0; }
        th { background: #1f2937; color: white; padding: 9px; text-align: left; }
        td { padding: 8px; border: 1px solid #d1d5db; }
        .label { font-weight: bold; background: #f3f4f6; width: 25%; }
        .right { text-align: right; }
        .totals { width: 40%; margin-left: auto; }
        .totals td { border-bottom: 1px solid #e5e7eb; }
        .ttc { font-weight: bold; font-size: 15px; background: #eff6ff; color: #1d4ed8; }
    </style>
</head>
<body>

    <h2>DEVIS N {{ $devis->numero }}</h2>
    <p>
        Date : {{ optional($devis->date)->format("d/m/Y") }}
        | Validite : {{ optional($devis->validite)->format("d/m/Y") }}
        | Statut : {{ $devis->statut }}
    </p>

    <div class="section-title">CLIENT</div>
    <table>
        <tr><td class="label">Nom</td><td>{{ $devis->client->nom ?? "-" }}</td></tr>
        <tr><td class="label">Entreprise</td><td>{{ $devis->client->entreprise ?? "-" }}</td></tr>
        <tr><td class="label">Telephone</td><td>{{ $devis->client->telephone ?? "-" }}</td></tr>
        <tr><td class="label">Email</td><td>{{ $devis->client->email ?? "-" }}</td></tr>
        <tr><td class="label">Ville</td><td>{{ $devis->client->ville ?? "-" }}</td></tr>
    </table>

    <div class="section-title">PROJET</div>
    <table>
        <tr><td class="label">Reference</td><td>{{ $devis->projet->reference ?? "-" }}</td></tr>
        <tr><td class="label">Nom</td><td>{{ $devis->projet->nom ?? "-" }}</td></tr>
        <tr><td class="label">Type de mission</td><td>{{ $devis->projet->type_mission ?? "-" }}</td></tr>
        <tr><td class="label">Adresse</td><td>{{ $devis->projet->adresse ?? "-" }}</td></tr>
        <tr><td class="label">Ville</td><td>{{ $devis->projet->ville ?? "-" }}</td></tr>
    </table>

    <div class="section-title">PRESTATIONS</div>
    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th style="width: 12%;">Qte</th>
                <th style="width: 20%;" class="right">Prix unitaire</th>
                <th style="width: 20%;" class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($devis->items as $item)
            <tr>
                <td>{{ $item->description }}</td>
                <td>{{ number_format($item->quantite, 2, ",", " ") }}</td>
                <td class="right">{{ number_format($item->prix_unitaire, 2, ",", " ") }} DH</td>
                <td class="right">{{ number_format($item->total, 2, ",", " ") }} DH</td>
            </tr>
            @empty
            <tr><td colspan="4" style="text-align:center;">Aucun article.</td></tr>
            @endforelse
        </tbody>
    </table>

    <table class="totals">
        <tr><td>Montant HT</td><td class="right">{{ number_format($devis->montant_ht ?? 0, 2, ",", " ") }} DH</td></tr>
        <tr><td>TVA</td><td class="right">{{ number_format($devis->tva ?? 0, 2, ",", " ") }} DH</td></tr>
        <tr class="ttc"><td>TOTAL TTC</td><td class="right">{{ number_format($devis->montant_ttc ?? 0, 2, ",", " ") }} DH</td></tr>
    </table>

</body>
</html>