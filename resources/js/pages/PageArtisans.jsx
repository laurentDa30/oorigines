import React from 'react';
import { ARTISANS, EVENT_YEAR, Partners, SECTIONS } from '../shared';

export default function PageArtisans({ navigate }) {
  return (
    <>
      <div className="wrap" style={{paddingTop:164}}>
        <div className="sec-tag">Le Marché</div>
        <h2 className="sec-title">Les <em>Artisans</em></h2>
        <div className="sec-rule"/>
        <div className="split" style={{marginBottom:52}}>
          <div>
            <p className="body">Aux <em>Õ</em>rigines accueille un marché d'artisans locaux au cœur du Vallon. Tous partagent un même attachement au savoir-faire authentique et à la création manuelle.</p>
            <p className="body">Dans l'esprit de la tradition artisane, les artisans proposeront leurs créations dans un cadre évocateur, au centre du vallon entre les oliviers et les falaises calcaires.</p>
          </div>
          <div style={{background:'var(--paper)',padding:'clamp(20px,3vw,36px)',borderLeft:'4px solid var(--tc)'}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.4em',textTransform:'uppercase',color:'var(--tc)',marginBottom:18}}>Vous êtes artisan ?</div>
            <p className="body" style={{marginBottom:16}}>Rejoignez le marché de l'édition {EVENT_YEAR}. L'emplacement est <strong>gratuit</strong> pour les artisans Sernhacois, et une participation de <strong>5 €</strong> est demandée pour les autres exposants.</p>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.25em',textTransform:'uppercase',color:'var(--tc)',marginBottom:10}}>Ce que vous gagnez</div>
            <ul style={{listStyle:'none',padding:0,margin:'0 0 24px',display:'flex',flexDirection:'column',gap:8}}>
              {[
                ['📣','Mise en avant sur nos réseaux sociaux avant et pendant l\'événement'],
                ['🌐','Fiche dédiée sur ce site avec votre nom, catégorie et liens'],
                ['🎙️','Présentation orale de votre stand lors des annonces sur le site'],
              ].map(([icon, txt]) => (
                <li key={txt} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                  <span style={{fontSize:16,lineHeight:1.4,flexShrink:0}}>{icon}</span>
                  <span style={{fontSize:14,color:'oklch(55% .04 68)',lineHeight:1.55}}>{txt}</span>
                </li>
              ))}
            </ul>
            <button className="btn-primary" onClick={()=>navigate('contact')}>Réserver un emplacement</button>
          </div>
        </div>
        {!SECTIONS.artisans
          ? <>
              <div className="sec-tag" style={{textAlign:'center',marginBottom:24}}>Créateurs présents</div>
              <p style={{textAlign:'center',fontFamily:"'EB Garamond',serif",fontStyle:'italic',fontSize:'clamp(15px,1.6vw,18px)',color:'oklch(45% .04 68)',margin:'0 0 8px'}}>Les artisans seront dévoilés prochainement.</p>
            </>
          : ARTISANS.length > 0 && <>
          <div className="sec-tag" style={{textAlign:'center',marginBottom:24}}>Créateurs présents</div>
          <div className="art-grid">
            {ARTISANS.map(a=>(
              <div key={a.id} className="art-card">
                {a.logo
                  ? <img src={a.logo} alt={a.nom} style={{width:56,height:56,objectFit:'contain',marginBottom:10,borderRadius:4}}/>
                  : <div className="art-icon"><svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>
                }
                <div className="art-name">{a.nom}</div>
                {a.categorie && <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--stone)',marginTop:4}}>{a.categorie}</div>}
                {a.description && <p style={{fontSize:13,color:'oklch(38% .04 38)',lineHeight:1.5,margin:'8px 0 0',textAlign:'center'}}>{a.description}</p>}
                {(a.site_web||a.instagram) && (
                  <div style={{display:'flex',gap:10,marginTop:10,justifyContent:'center'}}>
                    {a.site_web && <a href={a.site_web} target="_blank" rel="noopener" style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.2em',color:'var(--ocre)',textDecoration:'none'}}>Site web</a>}
                    {a.instagram && <a href={`https://instagram.com/${a.instagram.replace('@','')}`} target="_blank" rel="noopener" style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.2em',color:'var(--ocre)',textDecoration:'none'}}>Instagram</a>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>}
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}
