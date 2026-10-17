<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
        }

        h1 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 8px;
        }

        th {
            background: #eee;
        }

        .total {
            text-align: right;
            margin-top: 20px;
        }
    </style>
</head>

<body>

<h1>FACTURE</h1>

<p>
    <strong>N° :</strong>
    {{ $facture->numero }}
</p>

<p>
    <strong>Client :</strong>
    {{ $facture->client->nom ?? '-' }}
</p>

<p>
    <strong>Projet :</strong>
    {{ $facture->projet->nom ?? '-' }}
</p>

<table>

    <thead>
        <tr>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix</th>
            <th>Total</th>
        </tr>
    </thead>

    <tbody>

        @foreach($facture->items as $item)

            <tr>
                <td>{{ $item->description }}</td>
                <td>{{ $item->quantite }}</td>
                <td>{{ number_format($item->prix_unitaire, 2) }}</td>
                <td>{{ number_format($item->total, 2) }}</td>
            </tr>

        @endforeach

    </tbody>

</table>

<div class="total">

    <p>
        <strong>HT :</strong>
        {{ number_format($facture->montant_ht, 2) }}
    </p>

    <p>
        <strong>TVA :</strong>
        {{ number_format($facture->tva, 2) }}
    </p>

    <p>
        <strong>TTC :</strong>
        {{ number_format($facture->montant_ttc, 2) }}
    </p>

</div>

</body>
</html>