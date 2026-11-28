import React from 'react';
import { PARTENAIRES, Partners, SECTIONS, spaLink } from '../shared';

function PartnerCard({ p }) {
  const inner = (
    <div className="prt-card">
      {p.logo
        ? <img src={p.logo} alt={p.nom} style={{width:64,height:64,objectFit:'contain',marginBottom:12}}/>
        : <div className="art-icon" style={{margin:'0 auto 14px'}}><svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>
      }
      <div className="art-name">{p.nom}</div>
    </div>
  );
  return p.site_web
    ? <a href={p.site_web} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>{inner}</a>
    : inner;
}

function PartnerInstitutionnel({ p }) {
  const inner = (
    <div className="prt-instit-item">
      {p.logo
        ? <img src={p.logo} alt={p.nom} className="prt-instit-logo"/>
        : <span className="prt-instit-name">{p.nom}</span>
      }
      {p.logo && <span className="prt-instit-name">{p.nom}</span>}
    </div>
  );
  return p.site_web
    ? <a href={p.site_web} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>{inner}</a>
    : inner;
}

export default function PagePartenaires({ navigate }) {
  const reguliers       = PARTENAIRES.filter(p => p.niveau !== 'Institutionnel');
  const institutionnels = PARTENAIRES.filter(p => p.niveau === 'Institutionnel');

  return (
    <>
      <div className="wrap" style={{paddingTop:164}}>
        <div className="sec-tag">Soutenir l'événement</div>
        <h1 className="sec-title">Devenir <em>Partenaire</em></h1>
        <div className="sec-rule"/>
        <div className="split" style={{marginBottom:52}}>
          <div>
            <p className="body">Aux <em>Õ</em>rigines est un événement ancré dans le territoire, porté par et pour les habitants de Sernhac et du Gard. En devenant partenaire, vous associez votre image à une journée sportive et culturelle d'exception, dans un cadre naturel unique.</p>
            <p className="body">Votre logo apparaîtra sur les supports de communication suivant : site web et affiches</p>
          </div>
          <div style={{background:'var(--paper)',padding:'clamp(20px,3vw,36px)',borderLeft:'4px solid var(--tc)'}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.4em',textTransform:'uppercase',color:'var(--tc2)',marginBottom:18}}>Niveaux de partenariat</div>
            <p className="body" style={{marginBottom:20}}>Associez votre image à une journée sportive et culturelle d'exception. Voici ce que votre partenariat apporte concrètement.</p>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.25em',textTransform:'uppercase',color:'var(--tc2)',marginBottom:10}}>Ce que vous gagnez</div>
            <ul style={{listStyle:'none',padding:0,margin:'0 0 24px',display:'flex',flexDirection:'column',gap:8}}>
              {[
                ['📣','Communication sur nos réseaux sociaux avant et pendant l\'événement'],
                ['🌐','Fiche partenaire sur ce site avec logo et lien vers votre structure'],
                ['🎙️','Mention orale par l\'animateur le jour J sur le village départ'],
              ].map(([icon,txt])=>(
                <li key={txt} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                  <span style={{fontSize:16,lineHeight:1.4,flexShrink:0}}>{icon}</span>
                  <span style={{fontSize:14,color:'var(--stone-texte)',lineHeight:1.55}}>{txt}</span>
                </li>
              ))}
            </ul>
            <a className="btn-primary" {...spaLink('contact', navigate)}>Nous contacter pour un partenariat</a>
          </div>
        </div>

        {!SECTIONS.partenaires
          ? <>
              <div className="sec-tag" style={{textAlign:'center',marginBottom:24}}>Nos partenaires</div>
              <p style={{textAlign:'center',fontFamily:"'EB Garamond',serif",fontStyle:'italic',fontSize:'clamp(15px,1.6vw,18px)',color:'oklch(45% .04 68)',margin:'0 0 8px'}}>Nos partenaires seront dévoilés prochainement.</p>
            </>
          : reguliers.length > 0 && <>
              <div className="sec-tag" style={{textAlign:'center',marginBottom:24}}>Nos partenaires</div>
              <div className="prt-grid">
                {reguliers.map(p => <PartnerCard key={p.id} p={p}/>)}
              </div>
            </>}

        {institutionnels.length > 0 && (
          <div className="prt-instit">
            <div className="prt-instit-title">Avec le soutien de</div>
            <div className="prt-instit-row">
              {institutionnels.map(p => <PartnerInstitutionnel key={p.id} p={p}/>)}
            </div>
          </div>
        )}
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}
