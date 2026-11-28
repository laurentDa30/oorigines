import React from 'react';
import { EVENT_YEAR, EVENT_DATE_LONG, eventEve, Partners, spaLink } from '../shared';

export default function PageInfos({ navigate }) {
  const sections = [
    {
      icon:'🚗', titre:'Comment venir', couleur:'var(--tc)',
      items:[
        ['En voiture','Depuis Nîmes (A9) : sortie Nîmes-Ouest, direction Remoulins puis Sernhac. Compter 20 min depuis Nîmes, 45 min depuis Montpellier, 1h depuis Avignon'],
        ['GPS','Parking du Vallon · Chemin du Vallon d\'Escaunes, 30210 Sernhac · Coordonnées : 43.9177, 4.5546'],
        ['En train','Gare de Nîmes (TGV) à 18 km'],
        ['Covoiturage','Nous encourageons le covoiturage. Un espace de mise en relation sera disponible sur notre page Facebook avant l\'événement'],
      ]
    },
    {
      icon:'🅿️', titre:'Stationnement', couleur:'#1565c0',
      items:[
        ['Parking principal','Grands parkings gratuits sur site, capacité ~300 véhicules. Ouverture à 11h00 le jour J'],
        ['Parking débordement','En cas de saturation, un parking secondaire est prévu à 500m'],
        ['Motos & vélos','Espace dédié, accès libre'],
        ['Camping-cars','Accueil possible la veille au soir sur le parking principal. Renseignements par email'],
      ]
    },
    {
      icon:'📋', titre:'Retrait des dossards', couleur:'oklch(52% 0.13 160)',
      items:[
        ['Veille de l\'événement',`${eventEve()}, de 16h00 à 20h00 — Salle des associations, Parking de l'école`],
        ['Jour J','Dès 7h00 jusqu\'à 30 min avant le départ de chaque épreuve'],
        ['Documents requis','Pièce d\'identité + PPS valide ou licence sportive en cours de validité'],
        ['Retrait par un tiers','Possible avec copie de la pièce d\'identité du coureur'],
      ]
    },
    {
      icon:'🍽️', titre:'Restauration & Village', couleur:'var(--ocre)',
      items:[
        ['Restauration','Plusieurs foodtrucks sur le village départ, ouverts dès 12h00'],
        ['Buvette','Disponible toute la journée. L\'eau est également fournie aux points de ravitaillement sur les parcours'],
        ['Marché artisanal','Producteurs locaux, artisans présents de 11h00 à 18h00'],
        ['Animations','Histoire des tunnels, espace enfants, ambiance musicale dès 19h'],
      ]
    },
    {
      icon:'🏥', titre:'Sécurité & Médical', couleur:'#c62828',
      items:[
        ['Poste médical','Présent sur le village départ tout au long de la journée. Secouristes diplômés (PSE1/PSE2)'],
        ['Numéro d\'urgence','En cas d\'urgence sur les parcours : composez le 15 (SAMU) ou le 112. Indiquez votre position sur la trace'],
        ['Point de rendez-vous','En cas d\'incident, le point de rassemblement se trouve à l\'entrée du village départ, près de la tente organisation'],
        ['Abandon','Tout abandon doit être signalé à l\'organisation. Des points de récupération sont prévus sur chaque parcours'],
      ]
    },
    {
      icon:'♿', titre:'Accessibilité & Divers', couleur:'var(--stone)',
      items:[
        ['Accès PMR','Le village départ et les zones de remise des récompenses sont accessibles aux personnes à mobilité réduite'],
        ['Animaux','Les animaux sont acceptés sur le site dans les espaces extérieurs, tenus en laisse obligatoirement'],
        ['Consigne','Une consigne gratuite est disponible au village départ pour déposer vos affaires pendant la course'],
        ['Règlement complet','Prochainement disponible en téléchargement sur la page de chaque course. La participation implique l\'acceptation du règlement'],
      ]
    },
  ];

  return (
    <>
      {/* Hero */}
      <div style={{height:'clamp(200px,30vw,300px)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:"url('/images/vallon.jpg')",backgroundSize:'cover',backgroundPosition:'center 40%',filter:'brightness(.32) saturate(1.1)'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent,oklch(8% .03 38 / .45))'}}/>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',paddingTop:'calc(112px + var(--ann-h,0px))',gap:12}}>
          <div className="hero-eyebrow">Pratique</div>
          <h1 style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:'clamp(24px,4vw,48px)',color:'white',letterSpacing:'.06em',margin:0,textAlign:'center',textShadow:'0 2px 24px oklch(0% 0 0 / .5)'}}>
            Informations <em style={{color:'var(--tc)',fontStyle:'normal'}}>pratiques</em>
          </h1>
        </div>
      </div>

      {/* Bandeau date */}
      <div style={{background:'var(--dark2)',borderBottom:'1px solid oklch(20% .04 38)'}}>
        <div className="wrap" style={{paddingTop:20,paddingBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <span style={{fontSize:20}}>📅</span>
              <div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--tc)',marginBottom:3}}>Édition {EVENT_YEAR}</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700,color:'white'}}>{EVENT_DATE_LONG} · Vallon de Sernhac · Gard</div>
              </div>
            </div>
            <a className="btn-primary" {...spaLink('contact', navigate)}>Une question ? →</a>
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map((s, idx) => (
        <section key={s.titre} style={{background: idx % 2 === 0 ? 'white' : 'var(--cream)'}}>
          <div className="wrap" style={{paddingTop:'clamp(36px,4vw,52px)',paddingBottom:'clamp(36px,4vw,52px)'}}>

            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:28,paddingBottom:16,borderBottom:`2px solid ${s.couleur}`}}>
              <span style={{fontSize:24,lineHeight:1}}>{s.icon}</span>
              <h2 style={{fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--dark)',fontWeight:700,margin:0}}>{s.titre}</h2>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {s.items.map(([label, texte]) => (
                <div key={label} style={{display:'grid',gridTemplateColumns:'clamp(140px,17%,210px) 1fr',border:'1px solid oklch(87% .02 68)',overflow:'hidden'}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase',color:s.couleur,fontWeight:700,lineHeight:1.5,padding:'16px 20px',background:`color-mix(in oklch, ${s.couleur} 8%, white)`,borderRight:'1px solid oklch(87% .02 68)',display:'flex',alignItems:'center'}}>{label}</div>
                  <div style={{fontFamily:"'EB Garamond',serif",fontSize:17,color:'var(--dark)',lineHeight:1.75,padding:'14px 24px'}}>{texte}</div>
                </div>
              ))}
            </div>

          </div>
        </section>
      ))}

      {/* CTA bas */}
      <div style={{background:'var(--dark)',padding:'clamp(28px,4vw,40px) clamp(20px,4vw,48px)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:24}}>
        <div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.4em',textTransform:'uppercase',color:'#fff',marginBottom:10,fontWeight:'bold'}}>Encore des questions ?</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(15px,2vw,20px)',color:'white',fontWeight:700}}>L'organisation est disponible pour vous aider.</div>
        </div>
        <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
          <a className="btn-primary" {...spaLink('contact', navigate)}>Nous contacter</a>
          <a className="btn-ghost" {...spaLink('evenement', navigate)}>← Programme de la journée</a>
        </div>
      </div>

      <Partners navigate={navigate}/>
    </>
  );
}
