<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Nouveau message</title></head>
<body style="font-family:Georgia,serif;color:#1a1208;background:#faf8f4;padding:40px 24px;max-width:600px;margin:0 auto">
  <h2 style="font-family:serif;color:#8b3a1a;border-bottom:2px solid #8b3a1a;padding-bottom:8px">Nouveau message – <em>õ origines</em></h2>
  <table style="width:100%;margin-top:24px;border-collapse:collapse">
    <tr><td style="padding:8px 0;font-weight:bold;width:120px">Nom</td><td>{{ $data['nom'] }}</td></tr>
    <tr><td style="padding:8px 0;font-weight:bold">Email</td><td>{{ $data['email'] }}</td></tr>
    <tr><td style="padding:8px 0;font-weight:bold">Sujet</td><td>{{ $data['sujet'] }}</td></tr>
    <tr><td style="padding:8px 0;font-weight:bold">Objet</td><td>{{ $data['objet'] ?? '—' }}</td></tr>
  </table>
  <div style="margin-top:24px;padding:20px;background:#f0ebe0;border-left:4px solid #8b3a1a">
    <strong>Message :</strong><br><br>
    {!! nl2br(e($data['message'])) !!}
  </div>
  <p style="margin-top:32px;font-size:12px;color:#888">õ origines · Sernhac · Gard</p>
</body>
</html>
