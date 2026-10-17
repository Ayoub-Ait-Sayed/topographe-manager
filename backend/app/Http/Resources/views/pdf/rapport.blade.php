<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.6;
        }

        h1 {
            text-align: center;
            margin-bottom: 30px;
        }

        .info {
            margin-bottom: 20px;
        }

        .content {
            white-space: pre-line;
        }
    </style>
</head>

<body>

    <h1>RAPPORT</h1>

    <div class="info">
        <strong>Titre :</strong>
        {{ $rapport->titre }}
    </div>

    <div class="info">
        <strong>Projet :</strong>
        {{ $rapport->projet->nom ?? '-' }}
    </div>

    <div class="info">
        <strong>Référence :</strong>
        {{ $rapport->projet->reference ?? '-' }}
    </div>

    <div class="info">
        <strong>Date :</strong>
        {{ $rapport->date?->format('d/m/Y') ?? '-' }}
    </div>

    <hr>

    <h3>Contenu</h3>

    <div class="content">
        {{ $rapport->contenu }}
    </div>

</body>
</html>