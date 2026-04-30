<?php

namespace App\Http\Controllers;

use App\Models\Artisan;
use App\Models\Galerie;
use App\Models\Partenaire;
use App\Models\Setting;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index(Request $request)
    {
        $settings     = Setting::first() ?? new Setting();
        $siteOpen     = $settings->date_ouverture_site ?? now()->addYears(1);
        $artisanCount = Artisan::count();

        $partenaires = Partenaire::visible()->get(['id','nom','niveau','logo','site_web'])
            ->map(fn($p) => [
                'id'      => $p->id,
                'nom'     => $p->nom,
                'niveau'  => $p->niveau,
                'logo'    => $p->logo ? '/storage/'.$p->logo : null,
                'site_web'=> $p->site_web,
            ]);

        $artisans = Artisan::visible()->get(['id','nom','description','categorie','logo','site_web','instagram'])
            ->map(fn($a) => [
                'id'          => $a->id,
                'nom'         => $a->nom,
                'description' => $a->description,
                'categorie'   => $a->categorie,
                'logo'        => $a->logo ? '/storage/'.$a->logo : null,
                'site_web'    => $a->site_web,
                'instagram'   => $a->instagram,
            ]);

        $galerie = Galerie::orderByDesc('featured')->orderBy('ordre')->get(['id','titre','annee','type','image','url_video','featured'])
            ->map(fn($g) => [
                'id'        => $g->id,
                'titre'     => $g->titre,
                'annee'     => $g->annee,
                'type'      => $g->type,
                'image'     => $g->image ? '/storage/'.$g->image : null,
                'url_video' => $g->url_video,
                'featured'  => $g->featured,
            ]);

        return view('app', compact('settings', 'siteOpen', 'artisanCount', 'partenaires', 'artisans', 'galerie'));
    }
}
