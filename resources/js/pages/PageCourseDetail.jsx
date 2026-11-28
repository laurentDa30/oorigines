import React from 'react';
import { Partners, INSCRIPTIONS, INSCRIPTIONS_OUVERTES, INSCRIPTIONS_TEXTE, spaLink } from '../shared';

function ProfilSVG({ points, color, denivele }) {
  const W=560,H=140,pad=20;
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  const maxX=Math.max(...xs),maxY=Math.max(...ys)||1;
  const toX=x=>pad+x/maxX*(W-pad*2), toY=y=>H-pad-y/maxY*(H-pad*2);
  const pts=points.map(p=>`${toX(p[0])},${toY(p[1])}`).join(' ');
  const fill=`${pts} ${toX(maxX)},${H-pad} ${toX(0)},${H-pad}`;
  const gId=`pg${color.replace(/[^a-z0-9]/gi,'_')}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:140,display:'block'}}>
      <defs><linearGradient id={gId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.35"/><stop offset="100%" stopColor={color} stopOpacity="0.04"/></linearGradient></defs>
      {[.25,.5,.75,1].map(f=><line key={f} x1={pad} y1={toY(maxY*f)} x2={W-pad} y2={toY(maxY*f)} stroke="oklch(50% .02 68 / .2)" strokeWidth="1" strokeDasharray="4,4"/>)}
      <polygon points={fill} fill={`url(#${gId})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      <text x={W-pad} y={pad+4} textAnchor="end" fontSize="11" fontFamily="'Cinzel',serif" fill={color} opacity=".9">
        {denivele ? `D+ ${String(denivele).replace(/^\+/, '').replace(/^(\d+)$/, '$1m')}` : ''}
      </text>
    </svg>
  );
}

function TraceSVG({ color }) {
  return (
    <div style={{background:'var(--paper)',border:'1px solid var(--stone)',height:260,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12}}>
      <svg width="220" height="160" viewBox="0 0 220 160" style={{opacity:.55}}>
        <path d="M20,140 C40,120 30,80 60,70 C90,60 80,30 110,20 C140,10 150,40 170,50 C195,62 200,90 200,110 C200,130 180,140 160,140 C130,140 100,145 70,140 Z" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="6,4"/>
        <circle cx="20" cy="140" r="5" fill={color}/><circle cx="200" cy="110" r="5" fill="none" stroke={color} strokeWidth="2"/>
        <text x="8" y="156" fontSize="9" fontFamily="'Cinzel',serif" fill={color}>D</text>
        <text x="194" y="105" fontSize="9" fontFamily="'Cinzel',serif" fill={color}>A</text>
      </svg>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--stone-texte)'}}>Trace surprise</div>
    </div>
  );
}

// Course enfants : boucle de 500 m, 1 à 3 tours selon l'âge, départ toutes les 15 min (plus petits d'abord).
// Écrit en dur volontairement : à mettre à jour ici si les tranches ou les horaires changent.
const KID_TRAIL_ID = 'trail500';
const KID_VAGUES = [
  { ages:'3 – 6 ans',   parcours:'1 tour · 500 m',   heure:'14h00' },
  { ages:'7 – 9 ans',   parcours:'2 tours · 1 km',   heure:'14h15' },
  { ages:'10 – 11 ans', parcours:'3 tours · 1,5 km', heure:'14h30' },
];

export default function PageCourseDetail({ race, navigate }) {
  const isKid = race.id === KID_TRAIL_ID;
  const stats = isKid
    ? [['Distance','500 m / tour'],['Tours','1 à 3'],['Départs','14h00 – 14h30'],['Tarif',race.tarif],['Limite',race.limite]]
    : [['Distance',race.distance],['Dénivelé',race.denivele],['Départ',race.depart],['Arrivée estimée',race.arrivee],['Tarif',race.tarif],['Limite',race.limite]];
  const CheckIcon = ()=><svg width="14" height="14" viewBox="0 0 24 24" style={{flexShrink:0,marginTop:2}} fill={race.color}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
  const DotIcon   = ()=><svg width="10" height="10" viewBox="0 0 10 10" style={{flexShrink:0,marginTop:4}} fill={race.color}><circle cx="5" cy="5" r="4"/></svg>;
  return (
    <>
      <div style={{background:'var(--dark2)',paddingTop:'calc(112px + var(--ann-h,0px))',paddingBottom:0,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:"url('/images/hero.jpg')",backgroundSize:'cover',backgroundPosition:'center 40%',opacity:.18}}/>
        <div style={{position:'relative',maxWidth:1160,margin:'0 auto',padding:'clamp(28px,4vw,48px) clamp(20px,4vw,48px) 0'}}>
          <a {...spaLink('courses', navigate)} style={{textDecoration:'none',width:'fit-content',fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.3em',textTransform:'uppercase',color:'oklch(95% 0.012 68)',cursor:'pointer',marginBottom:24,display:'flex',alignItems:'center',gap:8}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            Toutes les courses
          </a>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:24,paddingBottom:48}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12,flexWrap:'wrap'}}>
                {race.type&&<span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.25em',textTransform:'uppercase',background:race.color,color:'white',padding:'4px 10px'}}>{race.type}</span>}
                <span style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:'.45em',textTransform:'uppercase',color:race.color}}>{race.cat}</span>
              </div>
              <h1 style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:'clamp(34px,6vw,72px)',color:'white',lineHeight:1,marginBottom:8}}>{race.name}</h1>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(13px,1.4vw,16px)',color:'oklch(95% 0.012 68)',letterSpacing:'.15em'}}>{race.tagline}</div>
            </div>
            {race.dist&&<div style={{textAlign:'right'}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:'clamp(60px,9vw,110px)',color:race.color,lineHeight:1}}>{race.dist}<span style={{fontSize:'0.4em',verticalAlign:'super'}}>{race.unit}</span></div></div>}
          </div>
        </div>
        <div style={{background:'oklch(12% .03 38 / .85)',borderTop:'1px solid oklch(25% .04 38)'}}>
          <div style={{maxWidth:1160,margin:'0 auto',padding:'0 clamp(20px,4vw,48px)',display:'flex',flexWrap:'wrap'}}>
            {stats.filter(([,v])=>v).map(([l,v])=>(
              <div key={l} style={{padding:'18px 28px 18px 0',marginRight:28,borderRight:'1px solid oklch(25% .04 38)',display:'flex',flexDirection:'column',gap:4}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',color:'white'}}>{l}</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:15,fontWeight:700,color:'white'}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:1160,margin:'0 auto',padding:'clamp(32px,5vw,56px) clamp(20px,4vw,48px)'}}>
        <div className="detail-grid">
          <div>
            <div className="sec-tag">Description</div>
            <h2 className="sec-title" style={{fontSize:'clamp(22px,3vw,34px)'}}>Le <em>parcours</em></h2>
            <div className="sec-rule"/>
            <p className="body">{race.desc}</p>
            {race.ravito.length>0&&(
              <div style={{background:'white',borderLeft:'4px solid '+race.color,padding:'20px 24px',marginTop:20}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.35em',textTransform:'uppercase',color:race.color,marginBottom:14}}>Points de ravitaillement</div>
                {race.ravito.map((r,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,fontFamily:"'EB Garamond',serif",fontSize:16,color:'oklch(22% .04 38)'}}><DotIcon/>{r}</div>)}
              </div>
            )}
            {!isKid&&<div style={{marginTop:32}}>
              <div className="sec-tag">Profil</div>
              <div style={{background:'white',border:'1px solid var(--stone)',padding:'16px 16px 8px'}}>
                <ProfilSVG points={race.profil} color={race.color} denivele={race.denivele}/>
                <div style={{display:'flex',justifyContent:'space-between',paddingTop:4}}>
                  <span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.2em',color:'var(--stone-texte)'}}>Départ</span>
                  <span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.2em',color:'var(--stone-texte)'}}>Arrivée</span>
                </div>
              </div>
            </div>}
          </div>
          <div>
            {isKid ? (
              <>
                <div className="sec-tag">Selon l'âge</div>
                <div style={{background:'white',borderTop:'3px solid '+race.color,padding:'4px 24px'}}>
                  {KID_VAGUES.map((v,i)=>(
                    <div key={v.ages} style={{display:'grid',gridTemplateColumns:'1.2fr 1.4fr auto',gap:12,alignItems:'baseline',padding:'14px 0',borderTop:i?'1px solid var(--stone)':'none'}}>
                      <span style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700,letterSpacing:'.06em',color:'oklch(22% .04 38)'}}>{v.ages}</span>
                      <span style={{fontFamily:"'EB Garamond',serif",fontSize:16,color:'oklch(30% .04 38)'}}>{v.parcours}</span>
                      <span style={{fontFamily:"'Cinzel',serif",fontSize:14,fontWeight:700,color:race.color}}>{v.heure}</span>
                    </div>
                  ))}
                </div>
                <p style={{fontFamily:"'EB Garamond',serif",fontSize:15,fontStyle:'italic',color:'oklch(42% .04 38)',marginTop:10}}>Un départ toutes les 15 minutes, des plus petits aux plus grands.</p>
              </>
            ) : (
              <>
                <div className="sec-tag">Trace du parcours</div>
                <div style={{background:'white',border:'1px solid var(--stone)',padding:8}}><TraceSVG color={race.color}/></div>
              </>
            )}
            <div style={{marginTop:36}}>
              <div className="sec-tag">Équipement obligatoire</div>
              <div style={{background:'white',borderTop:'3px solid '+race.color,padding:'20px 24px',marginBottom:16}}>
                {race.obligatoire.map((item,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10,fontFamily:"'EB Garamond',serif",fontSize:16,color:'oklch(22% .04 38)'}}><CheckIcon/><span>{item}</span></div>)}
              </div>
              {race.conseille.length>0&&(
                <>
                  <div className="sec-tag">Équipement conseillé</div>
                  <div style={{background:'white',borderTop:'3px solid var(--stone)',padding:'20px 24px'}}>
                    {race.conseille.map((item,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10,fontFamily:"'EB Garamond',serif",fontSize:16,color:'oklch(38% .04 38)'}}><DotIcon/><span>{item}</span></div>)}
                  </div>
                </>
              )}
              {race.interdit.length>0&&(
                <>
                  <div className="sec-tag" style={{marginTop:16}}>Matériel interdit</div>
                  <div style={{background:'oklch(98% .01 20)',borderTop:'3px solid oklch(55% .18 25)',padding:'20px 24px'}}>
                    {race.interdit.map((item,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10,fontFamily:"'EB Garamond',serif",fontSize:16,color:'oklch(30% .08 25)'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" style={{flexShrink:0,marginTop:2}} fill="oklch(55% .18 25)"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                      <span>{item}</span>
                    </div>)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="reg-block" style={{marginTop:48}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:'.45em',textTransform:'uppercase',color:'var(--ocre)',marginBottom:16}}>Inscriptions</div>
          <h3>Prêt à relever <em>le défi ?</em></h3>
          <p>{INSCRIPTIONS_OUVERTES
            ? 'Les inscriptions sont ouvertes. Réservez votre dossard dès maintenant.'
            : `${INSCRIPTIONS_TEXTE} Contactez-nous pour être parmi les premiers informés.`}</p>
          <div className="reg-btns">
            {INSCRIPTIONS_OUVERTES ? (
              <a className="btn-primary" href={INSCRIPTIONS.url} target="_blank" rel="noopener noreferrer"
                 style={{display:'inline-block',textDecoration:'none'}}>S'inscrire →</a>
            ) : (
              <button className="btn-primary" disabled style={{opacity:.6,cursor:'not-allowed'}}>Inscriptions bientôt disponibles</button>
            )}
            <a className="btn-ghost" {...spaLink('contact', navigate)}>Être notifié</a>
          </div>
        </div>
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}
