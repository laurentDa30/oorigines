import React from 'react';
import { RACES, Partners, spaLink } from '../shared';

export default function PageCourses({ navigate }) {
  return (
    <>
      <div className="wrap" style={{paddingTop:164}}>
        <div className="sec-tag">Les Épreuves</div>
        <h1 className="sec-title">Les <em>Courses</em></h1>
        <div className="sec-rule"/>
        <p className="body" style={{maxWidth:580}}>{RACES.length > 0 ? `${['Une','Deux','Trois','Quatre','Cinq','Six'][RACES.length-1]||RACES.length} épreuve${RACES.length>1?'s':''}` : 'Des épreuves'} pour tous les niveaux, dans un cadre naturel exceptionnel marqué par l'histoire romaine du Vallon de Sernhac. Cliquez sur une course pour voir le détail.</p>
        <div className="race-grid">
          {RACES.map(r=>(
            <a key={r.id} className="race-card" {...spaLink('course/'+r.urlSlug, navigate)}>
              <div style={{position:'absolute',top:0,left:0,width:3,height:'100%',background:r.color}}/>
              {r.dist?<div className="race-dist" style={{color:r.color}}>{r.dist}<sup>{r.unit}</sup></div>:<div className="race-bar" style={{background:r.color}}/>}
              <div className="race-name">{r.name}</div>
              <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:14}}>
                {r.type&&<span style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',background:r.color,color:'white',padding:'3px 8px'}}>{r.type}</span>}
                <div className="race-cat" style={{color:r.color,marginBottom:0}}>{r.cat}</div>
              </div>
              <div className="race-desc">{r.desc.substring(0,120)}…</div>
              <div className="race-footer" style={{color:r.color,marginTop:'auto'}}>{r.depart} · {r.distance} · {r.denivele}</div>
              <div style={{marginTop:12,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.25em',textTransform:'uppercase',color:r.color,display:'flex',alignItems:'center',gap:6}}>
                Voir le détail <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="wrap" style={{paddingTop:8,paddingBottom:8}}>
        <div style={{background:'var(--paper)',borderLeft:'4px solid var(--tc)',padding:'clamp(24px,4vw,44px)'}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.4em',textTransform:'uppercase',color:'var(--tc2)',marginBottom:14}}>Entreprises, collectivités &amp; associations</div>
          <h3 style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:'clamp(22px,3vw,32px)',color:'var(--dark2)',lineHeight:1.1,marginBottom:18}}>Faites courir <em>vos équipes</em></h3>
          <div className="split" style={{marginBottom:28}}>
            <div>
              <p className="body">Fédérez vos collaborateurs autour d'un trail nature au cœur du Vallon de Sernhac. Nous facilitons la venue des groupes : un seul interlocuteur, une inscription centralisée et un tarif adapté à l'effectif.</p>
            </div>
            <div>
              <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:12}}>
                {[
                  ['💶','Tarif de groupe dégressif selon l\'effectif (à partir de 10 personnes)'],
                  ['🏅','Une récompense pour le groupe le plus nombreux'],
                  ['🎽','Dossards préparés et remis groupés le jour J'],
                ].map(([icon,txt])=>(
                  <li key={txt} style={{display:'flex',gap:10,alignItems:'flex-start',fontFamily:"'EB Garamond',serif",fontSize:16,color:'oklch(22% .04 38)'}}>
                    <span style={{fontSize:16,lineHeight:1.4,flexShrink:0}}>{icon}</span>
                    <span>{txt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <a className="btn-primary" {...spaLink('contact', navigate)}>Nous contacter →</a>
        </div>
      </div>

      <Partners navigate={navigate}/>
    </>
  );
}
