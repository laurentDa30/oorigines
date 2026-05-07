<?php

// Point d'entrée pour hébergement mutualisé (OVH Pro)
// Redirige vers public/index.php sans exposer la structure interne

$_SERVER['SCRIPT_FILENAME'] = __DIR__.'/public/index.php';
require __DIR__.'/public/index.php';
