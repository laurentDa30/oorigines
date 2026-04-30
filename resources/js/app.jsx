import './bootstrap';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createRoot } from 'react-dom/client';

const SITE_OPEN      = new Date(window.__SITE_OPEN  || '2026-09-01T00:00:00');
const EVENT_DATE     = new Date(window.__EVENT_DATE || '2027-04-24T08:00:00');
const CSRF           = window.__CSRF_TOKEN || '';
const ARTISAN_COUNT  = window.__ARTISAN_COUNT || 0;
const PARTENAIRES    = window.__PARTENAIRES   || [];
const ARTISANS       = window.__ARTISANS      || [];
const GALERIE        = window.__GALERIE       || [];

const PAGES = ['accueil','evenement','infos','courses','vallon','artisans','galerie','partenaires','contact'];
function pageFromPath() {
  const p = window.location.pathname.replace(/^\//, '') || 'accueil';
  if(PAGES.includes(p)) return p;
  if(p.startsWith('course_')) return p;
  return 'accueil';
}

/* ── Utils ─────────────────────────────────────────── */
function getRemaining(target) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return { j: Math.floor(diff/86400000), h: Math.floor(diff%86400000/3600000), m: Math.floor(diff%3600000/60000), s: Math.floor(diff%60000/1000), done: diff===0 };
}
const pad = n => String(n).padStart(2,'0');

function useCountdown(target) {
  const [t, setT] = useState(() => getRemaining(target));
  useEffect(() => { const id = setInterval(()=>setT(getRemaining(target)),1000); return ()=>clearInterval(id); }, []);
  return t;
}

/* ── Shared ─── */
function Ornament() {
  return <div className="ornament"><div className="ornament-line"/><div className="ornament-diamond"/><div className="ornament-line r"/></div>;
}

function CountdownRow({ target, light }) {
  const t = useCountdown(target);
  const ns = light ? { color:'white', textShadow:'none', fontSize:'clamp(36px,6vw,80px)' } : {};
  const ls = light ? { color:'rgb(231,212,193)' } : {};
  return (
    <div className="cdown-row">
      {[['j',t.j,'Jours'],['h',t.h,'Heures'],['m',t.m,'Minutes'],['s',t.s,'Secondes']].map(([k,v,l],i) =>
        <React.Fragment key={k}>
          <div className="cdown-block">
            <div className="cdown-num" style={ns}>{pad(v)}</div>
            <div className="cdown-lbl" style={ls}>{l}</div>
          </div>
          {i<3 && <div className="cdown-sep">:</div>}
        </React.Fragment>
      )}
    </div>
  );
}

function Partners({ navigate }) {
  if (!PARTENAIRES.length && !navigate) return null;
  return (
    <div className="partners">
      <div className="partners-lbl">Nos partenaires</div>
      <div className="partners-row">
        {PARTENAIRES.map(p => (
          <div key={p.id} className="partner-box">
            {p.logo
              ? <img src={p.logo} alt={p.nom} style={{maxHeight:44,maxWidth:110,objectFit:'contain'}}/>
              : <span style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:'.15em',textTransform:'uppercase'}}>{p.nom}</span>
            }
          </div>
        ))}
        {navigate && (
          <div className="partner-box partner-box--join" onClick={()=>navigate('partenaires')}>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--ocre)',whiteSpace:'nowrap'}}>Nous rejoindre →</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Intro ─── */
function IntroScreen({ onEnter }) {
  return (
    <div className="intro">
      <div className="intro-inner">
        <div className="intro-loc">Sernhac · Le Vallon · Gard · 24 Avril 2027</div>
        <div className="intro-brand"><em>õ</em> origines</div>
        <div className="intro-tag">Trail · Nature · Tradition · Époque Romaine</div>
        <Ornament/>
        <div className="intro-msg">Ouverture du site dans</div>
        <CountdownRow target={SITE_OPEN}/>
        <button className="btn-enter" onClick={onEnter}>Découvrir l'événement →</button>
      </div>
    </div>
  );
}

/* ── Nav ─── */
function Nav({ navigate, menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY>60);
    window.addEventListener('scroll',fn); return ()=>window.removeEventListener('scroll',fn);
  },[]);
  const go = p => { navigate(p); setMenuOpen(false); };
  const links = [
    ['accueil',"Accueil",null],
    ['evenement',"L'Événement",[['evenement',"L'Événement"],['infos',"Infos essentielles"]]],
    ['courses',"Les Courses",[
      ['courses',"Toutes les courses"],
      ['course_trail20',"Trail des Légions · 20 km"],
      ['course_trail8',"Foulée des Origines · 8 km"],
      ['course_marche',"Marche du Vallon · 8 km"],
      ['course_enfants',"Course Enfants · 1 km"],
    ]],
    ['vallon',"Le Vallon",null],
    ['artisans',"Artisans",null],
    ['galerie',"Galerie",null],
    ['partenaires',"Partenaires",null],
    ['contact',"Contact",null],
  ];
  return (
    <>
      <nav className={scrolled?'scrolled':''}>
        <div className="nav-logo" onClick={()=>go('accueil')}><em>õ</em> origines</div>
        <ul className="nav-links">
          {links.map(([id,lbl,sub])=>(
            <li key={id} className={sub?'has-sub':''}>
              <a onClick={()=>go(id)}>{lbl}{sub&&<span className="nav-chevron">▾</span>}</a>
              {sub&&(
                <ul className="sub-nav">
                  {sub.map(([sid,slbl])=>(
                    <li key={sid}><a onClick={e=>{e.stopPropagation();go(sid);}}>{slbl}</a></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <button className="nav-cta" onClick={()=>go('courses')}>S'inscrire</button>
        <button className="hamburger" onClick={()=>setMenuOpen(o=>!o)}><span/><span/><span/></button>
      </nav>
      <div className={`mobile-menu ${menuOpen?'open':''}`}>
        {links.map(([id,lbl,sub])=>(
          <React.Fragment key={id}>
            <a onClick={()=>go(id)}>{lbl}</a>
            {sub&&sub.slice(1).map(([sid,slbl])=>(
              <a key={sid} onClick={()=>go(sid)} style={{fontSize:13,opacity:.7,paddingLeft:24}}>↳ {slbl}</a>
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

/* ── Page Accueil ─── */
function PageAccueil({ navigate }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(()=>{
    if(revealed) return;
    let fired=false;
    const reveal=()=>{if(!fired){fired=true;setRevealed(true);}};
    const onScroll=()=>{if(window.scrollY>12)reveal();};
    window.addEventListener('scroll',onScroll,{passive:true});
    const t=setTimeout(reveal,400);
    return ()=>{window.removeEventListener('scroll',onScroll);clearTimeout(t);};
  },[revealed]);

  const IMG="url('/images/hero.jpg')"; const BG_POS='center 65%'; const BG_FILTER='brightness(.42) saturate(1.1)';
  const titleStyle={ willChange:'transform, opacity', transform:revealed?'translateY(0)':'translateY(clamp(160px, 26vh, 280px))', opacity:revealed?1:0, transition:revealed?'transform 1.5s cubic-bezier(0.16,1,0.3,1), opacity 1.2s ease-out':'none' };

  return (
    <>
      <div className="hero" style={{overflow:'hidden'}}>
        <div className="hero-bg" style={{backgroundImage:IMG,backgroundPosition:BG_POS,filter:BG_FILTER}}/>
        <div className="hero-overlay"/>
        <div className="hero-inner">
          <motion.div
            initial={{opacity:0,y:16}}
            animate={revealed?{opacity:1,y:0}:{opacity:0,y:16}}
            transition={{duration:0.9,delay:0.3,ease:'easeOut'}}
          >
            <div className="hero-eyebrow" style={{color:'white'}}>Sernhac · Le Vallon · Gard · MMXXVII</div>
            <div className="hero-rule"><div className="hero-rule-line"/><div className="hero-rule-ornament">✦</div><div className="hero-rule-line r"/></div>
          </motion.div>
          <div style={titleStyle}><h1 className="hero-title" style={{fontSize:'clamp(48px,9vw,120px)',whiteSpace:'nowrap'}}><em>õ</em> origines</h1></div>
        </div>
        <motion.div
          initial={{opacity:0,y:16}}
          animate={revealed?{opacity:1,y:0}:{opacity:0,y:16}}
          transition={{duration:0.9,delay:0.9,ease:'easeOut'}}
          style={{position:'absolute',bottom:'clamp(140px, 18vh, 220px)',left:0,right:0,display:'flex',flexDirection:'column',alignItems:'center',zIndex:7}}
        >
          <div className="hero-latin" style={{color:'rgb(255,223,190)'}}>· RETOUR AUX SOURCES ·</div>
          <div className="hero-date-block">
            <div className="hero-date-item"><span className="hero-date-val">24 Avril 2027</span><span className="hero-date-lbl">Date</span></div>
            <div className="hero-date-sep"/>
            <div className="hero-date-item"><span className="hero-date-val">Sernhac</span><span className="hero-date-lbl">Le Vallon · Gard</span></div>
            <div className="hero-date-sep"/>
            <div className="hero-date-item"><span className="hero-date-val">Trail</span><span className="hero-date-lbl">COURSES NATURE</span></div>
          </div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={()=>navigate('courses')}>S'inscrire aux courses</button>
            <button className="btn-ghost"   onClick={()=>navigate('evenement')}>Découvrir l'événement</button>
          </div>
        </motion.div>
        <div className="hero-scroll" style={{zIndex:8}}><div className="scroll-arrow"/><span>Défiler</span></div>
      </div>

      <div className="cstrip">
        <div className="cstrip-label" style={{color:'rgb(185,153,97)'}}>Compte à rebours – Rendez-vous le 24 Avril 2027</div>
        <CountdownRow target={EVENT_DATE} light/>
      </div>

      <div className="wrap">
        <div className="split">
          <div>
            <div className="sec-tag">L'Événement</div>
            <h2 className="sec-title">Retournez aux <em>origines</em></h2>
            <div className="sec-rule"/>
            <p className="body">Le 24 avril 2027, Sernhac ouvre les portes d'une expérience unique au cœur du Vallon. Dans un décor naturel exceptionnel, aux accents de l'époque romaine, coureurs et familles se retrouvent pour célébrer le sport, le terroir et l'artisanat local.</p>
            <p className="body">Une journée hors du temps, entre effort et convivialité, dans l'un des plus beaux sites naturels du Gard.</p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:8}}>
              <button className="btn-primary" onClick={()=>navigate('evenement')}>En savoir plus</button>
            </div>
          </div>
          <div><img src="/images/vallon.jpg" alt="Le Vallon de Sernhac" loading="lazy"/></div>
        </div>
      </div>

      <div style={{background:'var(--paper)',padding:'72px 48px'}}>
        <div style={{maxWidth:1160,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:32,textAlign:'center'}}>
          {[['4','Épreuves','Du trail 20km à la course enfants'],[ARTISAN_COUNT||'–','Artisans','Marché de créateurs et producteurs locaux'],['1','Journée','Un événement convivial, festif et authentique']].map(([n,t,d])=>(
            <div key={t} style={{padding:'32px 24px',borderTop:'3px solid var(--tc)'}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(40px,5vw,64px)',fontWeight:900,color:'var(--tc)',lineHeight:1,marginBottom:8}}>{n}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:14,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--dark)',marginBottom:12}}>{t}</div>
              <p style={{fontSize:15,color:'oklch(42% .04 38)',lineHeight:1.7,margin:0}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}

/* ── Page Événement ─── */
function PageEvenement({ navigate }) {
  const PROGRAMME = [
    ['10h00',"Ouverture du site · Accueil des participants",false],
    ['14h30',"Départ Trail 20km – Les Légions de Sernhac",false],
    ['15h00',"Départ 8km – La Foulée des Origines",false],
    ['15h30',"Départ marche",false],
    ['15h45',"Estimation - premiers finishers 8km",true],
    ['16h00',"Départ course enfants",false],
    ['16h15',"Estimation - premiers finishers Trail 20km",true],
    ['18h00',"Remise des récompenses – Trail 20km",false],
    ['21h00',"Concert, clôture de l'édition 2027",false],
  ];
  return (
    <>
      <div style={{height:320,position:'relative',overflow:'hidden'}}>
        <div className="hero-bg" style={{backgroundImage:"url('/images/vallon.jpg')",position:'absolute',inset:0,filter:'brightness(.42)'}}/>
        <div className="hero-overlay" style={{position:'absolute',inset:0}}/>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',paddingTop:68}}>
          <div className="hero-eyebrow">L'Événement</div>
          <h1 className="hero-title" style={{fontSize:'clamp(40px,7vw,90px)'}}><em>õ</em> origines</h1>
        </div>
      </div>
      <div className="wrap">
        <div className="split" style={{marginBottom:60}}>
          <div>
            <div className="sec-tag">Le Site</div>
            <h2 className="sec-title">Un cadre <em>exceptionnel</em></h2>
            <div className="sec-rule"/>
            <p className="body">Le Vallon de Sernhac est un site naturel préservé, marqué par des siècles d'histoire. Ses falaises calcaires, ses oliviers centenaires et ses vestiges antiques forment un écrin unique pour un événement sportif et culturel d'exception.</p>
            <p className="body">L'événement puise son inspiration dans l'époque romaine qui a profondément marqué cette région. Les coureurs traverseront des paysages que les légions romaines ont foulés il y a deux millénaires.</p>
          </div>
          <div>
            <div className="sec-tag">L'Esprit</div>
            <h2 className="sec-title">Une fête <em>populaire</em></h2>
            <div className="sec-rule"/>
            <p className="body">Porté par les habitants de Sernhac et les associations locales, õ origines est avant tout une fête populaire. L'objectif : rassembler sportifs, familles et amoureux du patrimoine autour d'une journée festive et authentique.</p>
            <p className="body">Marché d'artisans, animations d'époque, restauration sur place et ambiance chaleureuse garantie tout au long de la journée.</p>
          </div>
        </div>
        <div className="prog-block">
          <div className="prog-tag">Programme de la journée – 24 Avril 2027</div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:24,padding:'10px 16px',background:'oklch(92% .04 80 / .35)',borderRadius:4}}>
            <span style={{color:'var(--tc)',fontSize:16}}>☀</span>
            <span style={{fontFamily:'var(--ff)',fontSize:14,color:'oklch(38% .06 38)',fontStyle:'italic'}}>Restauration · Animations tout au long de la journée</span>
          </div>
          {PROGRAMME.map(([h,e,muted])=>(
            <div key={h} className="prog-row" style={muted?{opacity:0.6}:{}}>
              <span className="prog-time" style={muted?{fontWeight:400,fontStyle:'italic'}:{}}>{h}</span>
              <span className="prog-ev"   style={muted?{fontStyle:'italic'}:{}}>{e}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:'var(--dark)',padding:'72px 48px'}}>
        <div style={{maxWidth:1160,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
          <img src="/images/depart.jpg" alt="Départ de course" style={{width:'100%',height:380,objectFit:'cover'}} loading="lazy"/>
          <div>
            <div className="sec-tag">L'Atmosphère</div>
            <h2 className="sec-title" style={{color:'var(--cream)'}}>Là où l'histoire <em>se court</em></h2>
            <div className="sec-rule"/>
            <p style={{fontSize:'clamp(16px,1.4vw,19px)',lineHeight:1.85,color:'oklch(68% .03 68)',marginBottom:18}}>Chaque kilomètre parcouru sur les sentiers du Vallon est une plongée dans l'histoire. Les pierres calcaires, les terrasses romaines et les oliviers millénaires témoignent d'un passé vivant.</p>
            <p style={{fontSize:'clamp(16px,1.4vw,19px)',lineHeight:1.85,color:'oklch(68% .03 68)'}}>Venir à õ origines, c'est bien plus que courir — c'est appartenir à quelque chose de plus grand.</p>
          </div>
        </div>
      </div>
      <div style={{background:'var(--paper)',borderTop:'1px solid var(--stone)',padding:'40px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:24}}>
        <div>
          <div className="sec-tag">Préparez votre venue</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(16px,2vw,22px)',fontWeight:700,color:'var(--dark)'}}>Accès · Parking · Dossards · Infos pratiques</div>
        </div>
        <button className="btn-primary" onClick={()=>navigate('infos')}>Informations essentielles →</button>
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}

/* ── Données courses ─── */
const RACES = [
  { id:'trail20',dist:'20',unit:'km',color:'var(--tc)',name:'Trail des Légions',cat:'+18 ans',tagline:'Le défi phare du Vallon',
    desc:"Le parcours technique et engagé de l'édition. À travers garrigues, falaises calcaires et sentiers romains, ce trail met à l'épreuve l'endurance et la technicité des coureurs dans un cadre d'exception.",
    depart:'8h00',arrivee:'09h45',denivele:'+700m',distance:'20 km',
    profil:[[0,0],[2,80],[4,200],[6,320],[8,420],[10,500],[12,580],[14,520],[16,440],[18,280],[20,0]],
    obligatoire:['Sac / gilet de trail','Eau – 500ml minimum','Couverture de survie','Téléphone chargé','Dossard visible','Cardigan ou coupe-vent'],
    conseille:['Bâtons de trail','Crème solaire','Ravitaillement solide','Guêtres basses','Lampe frontale (départ tôt)'],
    ravito:['Km 6 – à définir','Km 13 – ç définir'],tarif:'18 €',limite:'200 participants' },
  { id:'trail8',dist:'8',unit:'km',color:'oklch(52% 0.13 160)',name:'Foulée des Origines',cat:'+18 ans',tagline:'Accessible, engagé, inoubliable',
    desc:"Un tracé accessible pour découvrir le Vallon à votre rythme. Idéal pour les coureurs débutants ou ceux souhaitant partager la course en famille. Le parcours emprunte les plus beaux sentiers du site.",
    depart:'8h30',arrivee:'9h30',denivele:'+500m',distance:'8 km',
    profil:[[0,0],[1.5,60],[3,150],[4.5,200],[6,140],[8,0]],
    obligatoire:['Dossard visible','Eau – 500ml minimum','Téléphone chargé'],
    conseille:['Chaussures de trail','Crème solaire','Casquette'],
    ravito:['Km 4 – à définir'],tarif:'12 €',limite:'300 participants' },
  { id:'marche',dist:8,unit:'km',color:'var(--ocre)',name:'Marche du Vallon',cat:'Tout public',tagline:"Une balade guidée dans l'histoire",
    desc:"Une promenade guidée à travers les sentiers historiques du Vallon. Ouverte à tous, sans condition physique particulière. Un guide local accompagne les participants et partage l'histoire romaine du site.",
    depart:'9h00',arrivee:'~12h00',denivele:'+300m',distance:'~6 km',
    profil:[[0,0],[1,20],[2,50],[3,70],[4,60],[5,30],[6,0]],
    obligatoire:['Eau','Chaussures fermées'],conseille:['Chapeau','Crème solaire','Appareil photo'],
    ravito:[],tarif:'Gratuit',limite:'Illimité' },
  { id:'enfants',dist:1,unit:'km',color:'oklch(60% 0.14 55)',name:'Course Enfants',cat:"Enfants",tagline:'Les petits gladiateurs du Vallon !',
    desc:"Un parcours ludique, sécurisé et encadré pour les plus petits. Déguisements romains fortement encouragés ! Chaque enfant repart avec sa médaille de finisher.",
    depart:'9h15',arrivee:'~9h25',denivele:'Plat / très faible',distance:'~1 km',
    profil:[[0,0],[0.3,5],[0.6,8],[0.9,5],[1,0]],
    obligatoire:['Accompagnement adulte requis pour les – 6 ans'],conseille:['Déguisement romain','Eau'],
    ravito:[],tarif:'Gratuit',limite:'Illimité' },
];

function ProfilSVG({ points, color }) {
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
        {points[points.length-1]?.[1]>0?`D+ ${Math.max(...ys)}m`:''}
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
      <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--stone)'}}>Trace surprise</div>
    </div>
  );
}

function PageCourseDetail({ race, navigate }) {
  const CheckIcon = ()=><svg width="14" height="14" viewBox="0 0 24 24" style={{flexShrink:0,marginTop:2}} fill={race.color}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
  const DotIcon   = ()=><svg width="10" height="10" viewBox="0 0 10 10" style={{flexShrink:0,marginTop:4}} fill={race.color}><circle cx="5" cy="5" r="4"/></svg>;
  return (
    <>
      <div style={{background:'var(--dark2)',paddingTop:68,paddingBottom:0,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:"url('/images/hero.jpg')",backgroundSize:'cover',backgroundPosition:'center 40%',opacity:.18}}/>
        <div style={{position:'relative',maxWidth:1160,margin:'0 auto',padding:'48px 48px 0'}}>
          <button onClick={()=>navigate('courses')} style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--stone)',background:'none',border:'none',cursor:'pointer',marginBottom:24,display:'flex',alignItems:'center',gap:8}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            Toutes les courses
          </button>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:24,paddingBottom:48}}>
            <div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:'.45em',textTransform:'uppercase',color:race.color,marginBottom:12}}>{race.cat}</div>
              <h1 style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:'clamp(34px,6vw,72px)',color:'white',lineHeight:1,marginBottom:8}}>{race.name}</h1>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(13px,1.4vw,16px)',color:'oklch(65% .03 68)',letterSpacing:'.15em'}}>{race.tagline}</div>
            </div>
            {race.dist&&<div style={{textAlign:'right'}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:'clamp(60px,9vw,110px)',color:race.color,lineHeight:1}}>{race.dist}<span style={{fontSize:'0.4em',verticalAlign:'super'}}>{race.unit}</span></div></div>}
          </div>
        </div>
        <div style={{background:'oklch(12% .03 38 / .85)',borderTop:'1px solid oklch(25% .04 38)'}}>
          <div style={{maxWidth:1160,margin:'0 auto',padding:'0 48px',display:'flex',flexWrap:'wrap'}}>
            {[['Distance',race.distance],['Dénivelé',race.denivele],['Départ',race.depart],['Arrivée estimée',race.arrivee],['Tarif',race.tarif],['Limite',race.limite]].map(([l,v])=>(
              <div key={l} style={{padding:'18px 28px 18px 0',marginRight:28,borderRight:'1px solid oklch(25% .04 38)',display:'flex',flexDirection:'column',gap:4}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',color:'oklch(50% .03 68)'}}>{l}</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:15,fontWeight:700,color:'white'}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:1160,margin:'0 auto',padding:'56px 48px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:52,alignItems:'start'}}>
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
            <div style={{marginTop:32}}>
              <div className="sec-tag">Profil altimétrique</div>
              <div style={{background:'white',border:'1px solid var(--stone)',padding:'16px 16px 8px'}}>
                <ProfilSVG points={race.profil} color={race.color}/>
                <div style={{display:'flex',justifyContent:'space-between',paddingTop:4}}>
                  <span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.2em',color:'var(--stone)'}}>Départ</span>
                  <span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.2em',color:'var(--stone)'}}>Arrivée</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="sec-tag">Trace du parcours</div>
            <div style={{background:'white',border:'1px solid var(--stone)',padding:8}}><TraceSVG color={race.color}/></div>
            <div style={{marginTop:12}}>
              <button style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.25em',textTransform:'uppercase',background:race.color,color:'white',border:'none',padding:'12px 24px',cursor:'not-allowed',opacity:.65}}>
                Télécharger GPX (bientôt)
              </button>
            </div>
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
            </div>
          </div>
        </div>
        <div className="reg-block" style={{marginTop:48}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:'.45em',textTransform:'uppercase',color:'var(--ocre)',marginBottom:16}}>Inscriptions</div>
          <h3>Prêt à relever <em>le défi ?</em></h3>
          <p>Les inscriptions ouvriront prochainement. Contactez-nous pour être parmi les premiers informés.</p>
          <div className="reg-btns">
            <button className="btn-primary" style={{opacity:.6,cursor:'default'}}>Inscriptions bientôt disponibles</button>
            <button className="btn-ghost" onClick={()=>navigate('contact')}>Être notifié</button>
          </div>
        </div>
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}

function PageCourses({ navigate }) {
  return (
    <>
      <div className="wrap" style={{paddingTop:120}}>
        <div className="sec-tag">Les Épreuves</div>
        <h2 className="sec-title">Les <em>Courses</em></h2>
        <div className="sec-rule"/>
        <p className="body" style={{maxWidth:580}}>Quatre épreuves pour tous les niveaux, dans un cadre naturel exceptionnel marqué par l'histoire romaine du Vallon de Sernhac. Cliquez sur une course pour voir le détail.</p>
        <div className="race-grid">
          {RACES.map(r=>(
            <div key={r.id} className="race-card" onClick={()=>navigate('course_'+r.id)} style={{cursor:'pointer'}}>
              <div style={{position:'absolute',top:0,left:0,width:3,height:'100%',background:r.color}}/>
              {r.dist?<div className="race-dist" style={{color:r.color}}>{r.dist}<sup>{r.unit}</sup></div>:<div className="race-bar" style={{background:r.color}}/>}
              <div className="race-name">{r.name}</div>
              <div className="race-cat" style={{color:r.color}}>{r.cat}</div>
              <div className="race-desc">{r.desc.substring(0,120)}…</div>
              <div className="race-footer" style={{color:r.color,marginTop:'auto'}}>{r.depart} · {r.distance} · {r.denivele}</div>
              <div style={{marginTop:12,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.25em',textTransform:'uppercase',color:r.color,display:'flex',alignItems:'center',gap:6}}>
                Voir le détail <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}

function PagePartenaires({ navigate }) {
  return (
    <>
      <div className="wrap" style={{paddingTop:120}}>
        <div className="sec-tag">Soutenir l'événement</div>
        <h2 className="sec-title">Devenir <em>Partenaire</em></h2>
        <div className="sec-rule"/>
        <div className="split" style={{marginBottom:52}}>
          <div>
            <p className="body">õ origines est un événement ancré dans le territoire, porté par et pour les habitants de Sernhac et du Gard. En devenant partenaire, vous associez votre image à une journée sportive et culturelle d'exception, dans un cadre naturel unique.</p>
            <p className="body">Votre logo apparaît sur tous les supports de communication : site web, affiches, dossards, et le jour J sur les banderoles et le village départ.</p>
            <button className="btn-primary" onClick={()=>navigate('contact')} style={{marginTop:8}}>Nous contacter pour un partenariat</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {[{tier:'Or',color:'#c49a2a',desc:'Plusieurs choix ?'},{tier:'Argent',color:'#9e9e9e',desc:'Plusieurs choix ?'},{tier:'Bronze',color:'#b5451b',desc:'Plusieurs choix ?'}].map(({tier,color,desc})=>(
              <div key={tier} style={{background:'var(--paper)',borderLeft:`4px solid ${color}`,padding:'20px 24px',display:'flex',gap:16,alignItems:'center'}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:900,color,minWidth:72}}>{tier}</div>
                <div style={{fontFamily:"'EB Garamond',serif",fontSize:15,color:'oklch(30% .04 38)',lineHeight:1.6}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}

function PageVallon() {
  const mapRef=useRef(null), mapInstRef=useRef(null), polylinesRef=useRef({});
  const [activeTrail,setActiveTrail]=useState(null);
  const TRAILS=[
    {id:'eau',name:"Au fil de l'eau",color:'#4a90d9',icon:'💧',desc:"Suivez le parcours de l'eau romaine et visualisez le passage de l’eau dans le vallon afin de comprendre la prouesse technique dans le creusement des galeries des tunnels de Perrotte à Cantarelles",dist:'<1 km',diff:'Facile',duree:'1h',coords:[[43.91753,4.55269],[43.91773,4.55272],[43.91786,4.55277],[43.91791,4.55271],[43.91794,4.55271],[43.91799,4.55265],[43.91787,4.55254],[43.91776,4.5525],[43.91765,4.5524],[43.91755,4.55225],[43.91737,4.55189],[43.91725,4.55156],[43.91723,4.55154],[43.91716,4.55158],[43.91712,4.55147],[43.917,4.55126],[43.91697,4.55087],[43.91692,4.55075],[43.91695,4.55062],[43.91687,4.55046],[43.91683,4.55052],[43.91678,4.55057],[43.91669,4.5506],[43.91664,4.55113],[43.9166,4.55131],[43.91655,4.55144],[43.9164,4.55169],[43.91635,4.55172],[43.91638,4.5518],[43.91631,4.55188],[43.91623,4.55201],[43.91624,4.55211],[43.91621,4.55219],[43.91632,4.55232],[43.91646,4.55212],[43.91649,4.55201],[43.91669,4.5518],[43.91684,4.55176],[43.91697,4.55192],[43.9172,4.55229],[43.91737,4.55216],[43.91747,4.55242],[43.91755,4.5525]]},
    {id:'hommes',name:'Au fil des hommes',color:'#c8793a',icon:'🏺',desc:"Accédez au sommet du rocher « La Perrotte » qui domine le site offrant une vue magnifique sur les terrasses des terrasses d'oliviers cultivées par les familles bénévoles aux capitelles en pierre sèche.",dist:'~1,2 km',diff:'Modéré',duree:'1h30',coords:[[43.91751,4.5527],[43.91754,4.55269],[43.91773,4.55272],[43.91786,4.55277],[43.91791,4.55271],[43.91794,4.55271],[43.91812,4.55254],[43.91815,4.55253],[43.91822,4.55256],[43.91826,4.55256],[43.91831,4.55262],[43.91837,4.55265],[43.9184,4.55262],[43.91841,4.55257],[43.91853,4.55256],[43.91865,4.55266],[43.91883,4.55275],[43.91892,4.55283],[43.919,4.55284],[43.91904,4.55287],[43.91911,4.55287],[43.91918,4.55274],[43.91927,4.55263],[43.91934,4.55267],[43.91939,4.55262],[43.91938,4.55252],[43.91932,4.5524],[43.91932,4.55233],[43.91944,4.55222],[43.91946,4.55213],[43.9195,4.5521],[43.91949,4.55201],[43.91951,4.55194],[43.91964,4.55187],[43.91966,4.55177],[43.91965,4.55168],[43.91968,4.55158],[43.91989,4.55154],[43.92009,4.5514],[43.92014,4.55141],[43.92032,4.55111],[43.92027,4.55084],[43.92031,4.55051],[43.92,4.55057],[43.91998,4.55058],[43.91993,4.55064],[43.91986,4.55064],[43.91968,4.5506],[43.91958,4.55054],[43.91955,4.55056],[43.91942,4.55048],[43.91936,4.55046],[43.91929,4.55049],[43.91927,4.55042],[43.91921,4.55038],[43.91911,4.55037],[43.91906,4.55033],[43.91907,4.55025],[43.91904,4.5502],[43.91897,4.55022],[43.91892,4.55021],[43.9189,4.55015],[43.91902,4.55005],[43.91904,4.54998],[43.91916,4.54986],[43.9192,4.54974],[43.91921,4.54965],[43.91915,4.54959],[43.91912,4.54961],[43.91916,4.5494],[43.91911,4.54923],[43.9191,4.54922],[43.91904,4.54919],[43.91893,4.54922],[43.91856,4.5491],[43.91829,4.54896],[43.91825,4.54892],[43.91824,4.54891],[43.91803,4.5493],[43.91786,4.5498],[43.9178,4.5499],[43.91757,4.54995],[43.91748,4.55004],[43.91738,4.55025],[43.91753,4.55033],[43.91756,4.55056],[43.91772,4.55113],[43.91782,4.55144],[43.91795,4.55146],[43.91795,4.55154],[43.91788,4.55177],[43.91796,4.55208],[43.91795,4.55243],[43.91798,4.5525],[43.91799,4.55265],[43.91794,4.55271],[43.91791,4.55271],[43.91786,4.55277],[43.91773,4.55272],[43.91753,4.55269]]},
    {id:'temps',name:'Au fil du temps',color:'#7a6a3a',icon:'⏳',desc:"Découvrez les capitales (Carrière, la Communale, les Sources) récemment restaurées le rocher emblématique du vallon.",dist:'~1,4 km',diff:'Facile',duree:'1h',coords:[[43.91753,4.55269],[43.91773,4.55272],[43.91786,4.55277],[43.91791,4.55271],[43.91794,4.55271],[43.91799,4.55265],[43.91787,4.55254],[43.91776,4.5525],[43.91768,4.55242],[43.91771,4.55252],[43.9177,4.55256],[43.91757,4.55252],[43.91747,4.55242],[43.91736,4.55213],[43.91735,4.55197],[43.91742,4.55174],[43.9175,4.55169],[43.91749,4.55155],[43.91745,4.5514],[43.91732,4.55118],[43.91724,4.55057],[43.91731,4.55048],[43.9174,4.55021],[43.91748,4.55004],[43.91757,4.54995],[43.91757,4.54989],[43.91752,4.54981],[43.91735,4.54984],[43.91698,4.54967],[43.91697,4.54966],[43.91695,4.54943],[43.91696,4.54918],[43.91706,4.54903],[43.91692,4.54877],[43.9168,4.5482],[43.91694,4.54783],[43.91689,4.5475],[43.917,4.54714],[43.91697,4.54706],[43.9168,4.54707],[43.91673,4.54713],[43.9165,4.54758],[43.91641,4.54765],[43.91627,4.54763],[43.91619,4.54774],[43.91611,4.54822],[43.91601,4.54836],[43.91567,4.54871],[43.91562,4.54886],[43.91551,4.54895],[43.91522,4.54913],[43.91538,4.54928],[43.9154,4.54932],[43.91538,4.54937],[43.91539,4.54945],[43.91552,4.54963],[43.91574,4.55004],[43.91583,4.55017],[43.91588,4.55011],[43.91599,4.55016],[43.91606,4.55029],[43.91615,4.55029],[43.91619,4.55038],[43.91621,4.55057],[43.91634,4.55078],[43.91642,4.55098],[43.91652,4.55102],[43.91656,4.55108],[43.91647,4.55132],[43.9164,4.55138],[43.91639,4.55141],[43.91642,4.55156],[43.91641,4.55162],[43.91638,4.55167],[43.91634,4.5517],[43.91638,4.5518],[43.91631,4.55188],[43.91623,4.55201],[43.91624,4.55211],[43.91621,4.55219],[43.91632,4.55232],[43.91646,4.55212],[43.91649,4.55201],[43.91669,4.5518],[43.9167,4.55171],[43.91684,4.55175],[43.91695,4.55186],[43.91728,4.5524],[43.91751,4.55257]]},
  ];
  useEffect(()=>{
    if(mapInstRef.current) return;
    if(!window.L) return;
    const map=L.map(mapRef.current,{zoomControl:true,scrollWheelZoom:false}).setView([43.9175,4.5527],16);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'Tiles © Esri',maxZoom:19}).addTo(map);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,opacity:.7}).addTo(map);
    const parkingIcon=L.divIcon({className:'',html:'<div style="background:#1565c0;color:white;width:30px;height:30px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4);font-family:Arial,sans-serif">P</div>',iconSize:[30,30],iconAnchor:[15,15]});
    L.marker([43.917666187591585,4.554630323068647],{icon:parkingIcon}).addTo(map).bindPopup('<b>Parking du Vallon</b><br>Point de départ des parcours');
    TRAILS.forEach(t=>{
      const pl=L.polyline(t.coords,{color:t.color,weight:4,opacity:.85}).addTo(map);
      pl.bindPopup(`<b>${t.name}</b><br>${t.dist} · ${t.diff}`);
      polylinesRef.current[t.id]=pl;
      const last=t.coords[t.coords.length-1];
      L.marker(last,{icon:L.divIcon({className:'',html:`<div style="background:${t.color};color:white;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;border:2px solid white">${t.icon}</div>`,iconSize:[26,26],iconAnchor:[13,13]})}).addTo(map).bindPopup(`<b>${t.name}</b>`);
    });
    mapInstRef.current=map;
  },[]);
  useEffect(()=>{
    if(!mapInstRef.current) return;
    TRAILS.forEach(t=>{
      const pl=polylinesRef.current[t.id];
      if(!pl) return;
      if(!activeTrail)              pl.setStyle({opacity:.85,weight:4});
      else if(activeTrail===t.id)   pl.setStyle({opacity:1,  weight:6});
      else                          pl.setStyle({opacity:.15, weight:3});
    });
    mapInstRef.current.invalidateSize();
  },[activeTrail]);
  return (
    <>
      <div style={{height:300,position:'relative',overflow:'hidden'}}>
        <div className="hero-bg" style={{backgroundImage:"url('/images/depart.jpg')",position:'absolute',inset:0,filter:'brightness(.38) saturate(1.1)'}}/>
        <div className="hero-overlay" style={{position:'absolute',inset:0}}/>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',paddingTop:68}}>
          <div className="hero-eyebrow">Notre terrain de jeu</div>
          <h1 className="hero-title" style={{fontSize:'clamp(36px,6vw,80px)'}}>Le <em>Vallon</em> de Sernhac</h1>
        </div>
      </div>
      <div className="wrap">
        <div className="split" style={{marginBottom:64,alignItems:'flex-start'}}>
          <div>
            <div className="sec-tag">Le Site</div>
            <h2 className="sec-title">Un cadre <em>d'exception</em></h2>
            <div className="sec-rule"/>
            <p className="body">Le Vallon d'Escaunes à Cantarelles est un site naturel remarquable de Sernhac (Gard), réputé pour ses <strong>galeries romaines</strong> — prolongement du Pont du Gard — qui alimentaient Nîmes en eau depuis Uzès.</p>
            <p className="body">Ses terrasses méditerranéennes plantées d'oliviers centenaires, son exceptionnelle biodiversité et ses tunnels taillés dans la roche en font un lieu unique en Occitanie.</p>
            <p className="body">Le site est entretenu et animé par l'association bénévole <strong>« Le Vallon d'Escaunes à Cantarelles »</strong>, partenaire naturel de notre événement.</p>
          </div>
          <div style={{position:'sticky',top:88,alignSelf:'flex-start',display:'flex',flexDirection:'column',gap:16}}>
            {[['Tunnels romains','Deux tunnels creusés par les légions romaines au Ier siècle, visibles et praticables'],['Oliviers centenaires','Des terrasses entretenues par des familles bénévoles depuis des générations'],['Biodiversité exceptionnelle','Orchidées sauvages, faune endémique, végétation méditerranéenne préservée'],['Guide audio',"Parcours sonore \"La Perrotte\" : QR code à scanner à l'entrée du parking"]].map(([t,d])=>(
              <div key={t} style={{background:'var(--paper)',padding:'18px 22px',borderLeft:'3px solid var(--tc)'}}>
                <div style={{fontFamily:'var(--ff)',fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--tc)',marginBottom:4}}>{t}</div>
                <div style={{fontSize:15,color:'var(--dark)',lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sec-tag">Parcours balisés</div>
        <h2 className="sec-title">3 itinéraires à <em>découvrir</em> — seul ou en famille</h2>
        <div className="sec-rule" style={{marginBottom:32}}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20,marginBottom:40}}>
          {TRAILS.map(t=>(
            <div key={t.id} onClick={()=>{setActiveTrail(t.id===activeTrail?null:t.id);if(mapInstRef.current)mapInstRef.current.fitBounds(L.latLngBounds(t.coords),{padding:[30,30]});}}
              style={{background:activeTrail===t.id?t.color:'var(--paper)',color:activeTrail===t.id?'white':'var(--dark)',padding:'24px 22px',cursor:'pointer',borderLeft:`4px solid ${t.color}`,transition:'all .25s'}}>
              <div style={{fontSize:22,marginBottom:10}}>{t.icon}</div>
              <div style={{fontFamily:'var(--ff)',fontSize:12,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:8,opacity:.85}}>{t.name}</div>
              <p style={{fontSize:14,lineHeight:1.6,marginBottom:14,opacity:.9}}>{t.desc}</p>
              <div style={{display:'flex',gap:16,fontSize:12,opacity:.75}}><span>📍 {t.dist}</span><span>⏱ {t.duree}</span><span>🏃 {t.diff}</span></div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:64}}>
          <div style={{position:'relative',zIndex:0,isolation:'isolate'}}>
            <div ref={mapRef} style={{width:'100%',height:460,border:'1px solid var(--stone)'}}/>
          </div>
          <div style={{display:'flex',gap:20,marginTop:12,flexWrap:'wrap'}}>
            {TRAILS.map(t=><div key={t.id} style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}><div style={{width:24,height:3,background:t.color,borderRadius:2}}/>{t.name}</div>)}
            <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}><div style={{width:16,height:16,background:'#2a2318',borderRadius:'50%',border:'2px solid #c8973a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'#c8973a'}}>P</div>Départ</div>
          </div>
          <p style={{fontSize:13,color:'oklch(55% .03 68)',marginTop:8,fontStyle:'italic'}}>Les tracés sont indicatifs. Retrouver les parcours officiels et balisés sur le site de l'association</p>
        </div>
        <div style={{background:'var(--dark)',padding:'48px',marginBottom:64,display:'flex',gap:40,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:240}}>
            <div style={{fontFamily:'var(--ff)',fontSize:10,letterSpacing:'.4em',textTransform:'uppercase',color:'var(--tc)',marginBottom:16}}>Partenaire du site</div>
            <h3 style={{fontFamily:'var(--ff)',fontSize:'clamp(18px,2.5vw,28px)',color:'white',marginBottom:16,lineHeight:1.2}}>Le Vallon d'Escaunes<br/><em style={{color:'var(--tc)',fontStyle:'normal'}}>à Cantarelles</em></h3>
            <p style={{color:'oklch(72% .04 68)',fontSize:15,lineHeight:1.7,marginBottom:24}}>Association loi 1901 dont la mission est de restaurer, préserver, promouvoir et animer le Vallon de Sernhac.</p>
            <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
              <a href="https://vallondesernhac.fr" target="_blank" rel="noopener noreferrer" style={{fontFamily:'var(--ff)',fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',background:'var(--tc)',color:'white',padding:'12px 28px',textDecoration:'none',display:'inline-block'}}>Visiter le site →</a>
              <a href="https://www.facebook.com/LeVallondEscaunesaCantarelles" target="_blank" rel="noopener noreferrer" style={{fontFamily:'var(--ff)',fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',background:'none',color:'white',border:'1px solid oklch(40% .04 38)',padding:'12px 28px',textDecoration:'none',display:'inline-block'}}>Facebook</a>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,flex:'0 0 auto'}}>
            {[['Restaurer','Remettre en état les terrasses'],['Préserver','Protéger la biodiversité'],['Animer','Fête du Vallon, visites guidées'],['Impliquer','Bénévolat, scolaires, familles']].map(([m,d])=>(
              <div key={m} style={{background:'oklch(14% .04 38)',padding:'16px',minWidth:140}}>
                <div style={{fontFamily:'var(--ff)',fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--tc)',marginBottom:6}}>{m}</div>
                <div style={{fontSize:13,color:'oklch(65% .03 68)',lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PageArtisans({ navigate }) {
  return (
    <>
      <div className="wrap" style={{paddingTop:120}}>
        <div className="sec-tag">Le Marché</div>
        <h2 className="sec-title">Les <em>Artisans</em></h2>
        <div className="sec-rule"/>
        <div className="split" style={{marginBottom:52}}>
          <div>
            <p className="body">õ origines accueille un marché d'artisans locaux au cœur du Vallon. Potiers, tisserands, producteurs du terroir... Tous partagent un même attachement au savoir-faire authentique et à la création manuelle.</p>
            <p className="body">Dans l'esprit de la tradition romaine, les artisans proposeront leurs créations dans un cadre évocateur, entre les oliviers et les falaises calcaires.</p>
          </div>
          <div style={{background:'var(--paper)',padding:'36px',borderLeft:'4px solid var(--tc)'}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.4em',textTransform:'uppercase',color:'var(--tc)',marginBottom:18}}>Vous êtes artisan ?</div>
            <p className="body" style={{marginBottom:20}}>Les emplacements sont gratuits pour les artisans de la région gardoise. Rejoignez l'édition 2027.</p>
            <button className="btn-primary" onClick={()=>navigate('contact')}>Réserver un emplacement</button>
          </div>
        </div>
        {ARTISANS.length > 0 && <>
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

function PageGalerie({ navigate }) {
  const [lightbox, setLightbox] = useState(null); // index dans photos
  const photos = GALERIE.filter(g => g.image);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = e => {
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, photos.length]);

  return (
    <>
      <div className="wrap" style={{paddingTop:120}}>
        <div className="sec-tag">Souvenirs</div>
        <h2 className="sec-title">La <em>Galerie</em></h2>
        <div className="sec-rule"/>
        <p className="body">Les photos du Vallon et des éditions passées. Les clichés de l'édition 2027 seront ajoutés après l'événement.</p>
        <div className="gal-grid">
          {photos.length > 0
            ? GALERIE.map((g, i) => {
                const photoIdx = photos.indexOf(g);
                return (
                  <div
                    key={g.id}
                    className={`gal-item${g.featured ? ' gal-item--featured' : ''}`}
                    onClick={() => g.image && setLightbox(photoIdx)}
                  >
                    {g.image ? (
                      <>
                        <img src={g.image} alt={g.titre} loading="lazy"/>
                        <div className="gal-item-caption"><span>{g.titre} · {g.annee}</span></div>
                      </>
                    ) : g.url_video ? (
                      <div style={{position:'relative',width:'100%',height:'100%',background:'var(--dark)'}}>
                        <iframe src={g.url_video} style={{position:'absolute',inset:0,width:'100%',height:'100%',border:'none'}} allowFullScreen title={g.titre}/>
                      </div>
                    ) : (
                      <div className="gal-placeholder"><div className="gal-placeholder-icon"/><span className="gal-placeholder-lbl">À venir · {g.annee||2027}</span></div>
                    )}
                  </div>
                );
              })
            : [0,1,2,3,4,5].map(i=>(
                <div key={i} className="gal-item">
                  <div className="gal-placeholder"><div className="gal-placeholder-icon"/><span className="gal-placeholder-lbl">À venir · 2027</span></div>
                </div>
              ))
          }
        </div>
      </div>

      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>×</button>
          {photos.length > 1 && <>
            <button className="lightbox-nav lightbox-nav--prev" onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + photos.length) % photos.length); }}>‹</button>
            <button className="lightbox-nav lightbox-nav--next" onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % photos.length); }}>›</button>
          </>}
          <img
            className="lightbox-img"
            src={photos[lightbox]?.image}
            alt={photos[lightbox]?.titre}
            onClick={e => e.stopPropagation()}
          />
          <div className="lightbox-caption">{photos[lightbox]?.titre} · {photos[lightbox]?.annee}</div>
        </div>
      )}

      <Partners navigate={navigate}/>
    </>
  );
}

function PageContact({ navigate }) {
  const [form,setForm]=useState({nom:'',email:'',sujet:'contact',objet:'',message:''});
  const [errors,setErrors]=useState({});
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);

  const validate=()=>{
    const e={};
    if(!form.nom.trim()) e.nom='Requis';
    if(!form.email.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Email invalide';
    if(!form.objet.trim()) e.objet='Requis';
    if(!form.message.trim()) e.message='Requis';
    return e;
  };

  const handleSubmit=async()=>{
    const e=validate(); if(Object.keys(e).length){setErrors(e);return;}
    setLoading(true);
    try {
      const res=await fetch('/contact',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':CSRF,'Accept':'application/json'},body:JSON.stringify(form)});
      if(res.ok) setSent(true); else { const d=await res.json(); setErrors(d.errors||{}); }
    } catch(err){ setErrors({message:'Erreur réseau. Réessayez.'}); }
    setLoading(false);
  };

  const field=(key,placeholder,type='input')=>(
    <>
      {type==='input'?
        <input type={key==='email'?'email':'text'} placeholder={placeholder} className={errors[key]?'field-error':''} value={form[key]} onChange={ev=>setForm(f=>({...f,[key]:ev.target.value}))}/>:
        <textarea placeholder={placeholder} className={errors[key]?'field-error':''} value={form[key]} onChange={ev=>setForm(f=>({...f,[key]:ev.target.value}))}/>
      }
      {errors[key]&&<span className="error-msg">{errors[key]}</span>}
    </>
  );

  const LocationIcon=()=><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
  const MailIcon=()=><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
  const PhoneIcon=()=><svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;

  return (
    <>
      <div className="wrap" style={{paddingTop:120}}>
        <div className="sec-tag">Nous écrire</div>
        <h2 className="sec-title">Nous <em>Contacter</em></h2>
        <div className="sec-rule"/>
        <div className="contact-grid">
          {sent?(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'var(--paper)',padding:40,textAlign:'center'}}>
              <div style={{width:56,height:56,background:'var(--tc)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:14,letterSpacing:'.2em',color:'var(--dark)'}}>Message envoyé</div>
              <p className="body" style={{marginTop:8}}>Nous reviendrons vers vous dans les meilleurs délais.</p>
            </div>
          ):(
            <div className="cf">
              {field('nom','Votre nom')}
              {field('email','Votre adresse email')}
              <select value={form.sujet} onChange={ev=>setForm(f=>({...f,sujet:ev.target.value}))} style={{width:'100%',padding:'13px 16px',border:'1px solid var(--stone)',background:'white',fontFamily:"'EB Garamond',serif",fontSize:16,color:'var(--dark)',marginBottom:14,outline:'none',appearance:'none'}}>
                <option value="contact">Contact général</option>
                <option value="artisan">Je suis artisan – Réserver un emplacement</option>
                <option value="partenaire">Devenir partenaire</option>
              </select>
              {field('objet','Objet de votre message')}
              {field('message','Votre message...','textarea')}
              <button className="btn-primary" style={{width:'100%',padding:'15px',opacity:loading?.7:1}} onClick={handleSubmit} disabled={loading}>
                {loading?'Envoi…':'Envoyer le message'}
              </button>
            </div>
          )}
          <div className="ci">
            <div>
              <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:20,marginBottom:6}}>Organisation</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--tc)',marginBottom:20}}>õ origines – Sernhac 2027</div>
            </div>
            {[[<LocationIcon/>,'Lieu','Le Vallon · 30210 Sernhac, Gard'],[<MailIcon/>,'Email','contact@oorigines-sernhac.fr'],[<PhoneIcon/>,'Téléphone','+33 (0)6 12 34 56 78']].map(([icon,lbl,val])=>(
              <div key={lbl} className="ci-item"><div className="ci-dot">{icon}</div><div><div className="ci-label">{lbl}</div><div className="ci-val">{val}</div></div></div>
            ))}
            <div style={{borderTop:'1px solid var(--stone)',paddingTop:20}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--tc)',marginBottom:12}}>Réseaux sociaux</div>
              <div className="social-row">
                <a href="https://www.facebook.com/LeVallondEscaunesaCantarelles" aria-label="Facebook" style={{display:'flex',alignItems:'center',justifyContent:'center',width:44,height:44,background:'#1877F2',borderRadius:'50%'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}

/* ── Page Informations essentielles ─── */
function PageInfos({ navigate }) {
  const sections = [
    {
      icon:'🚗', titre:'Comment venir', couleur:'var(--tc)',
      items:[
        ['En voiture','Depuis Nîmes (A9) : sortie Nîmes-Ouest, direction Remoulins puis Sernhac. Compter 20 min depuis Nîmes, 45 min depuis Montpellier, 1h depuis Avignon.'],
        ['GPS','Parking du Vallon · Chemin du Vallon d\'Escaunes, 30210 Sernhac · Coordonnées : 43.9177, 4.5546'],
        ['En train','Gare de Nîmes (TGV) à 18 km. Navette possible depuis Nîmes le jour J — détails à confirmer.'],
        ['Covoiturage','Nous encourageons le covoiturage. Un espace de mise en relation sera disponible sur notre page Facebook avant l\'événement.'],
      ]
    },
    {
      icon:'🅿️', titre:'Stationnement', couleur:'#1565c0',
      items:[
        ['Parking principal','Grand parking gratuit sur site, capacité ~300 véhicules. Ouverture à 7h00 le jour J.'],
        ['Parking débordement','En cas de saturation, un parking secondaire est prévu à 500m. Navette piétonne disponible.'],
        ['Motos & vélos','Espace dédié à l\'entrée du parking principal, accès libre.'],
        ['Camping-cars','Accueil possible la veille au soir sur le parking principal. Renseignements par email.'],
      ]
    },
    {
      icon:'📋', titre:'Retrait des dossards', couleur:'oklch(52% 0.13 160)',
      items:[
        ['Veille de l\'événement','Samedi 23 avril 2027, de 15h00 à 19h00 — Village départ, Parking du Vallon.'],
        ['Jour J','Dès 7h00 jusqu\'à 30 min avant le départ de chaque épreuve.'],
        ['Documents requis','Pièce d\'identité + certificat médical de non contre-indication à la pratique du trail (moins d\'un an) ou licence sportive en cours de validité.'],
        ['Retrait par un tiers','Possible avec procuration écrite + copie de la pièce d\'identité du coureur.'],
      ]
    },
    {
      icon:'🍽️', titre:'Restauration & Village', couleur:'var(--ocre)',
      items:[
        ['Restauration','Plusieurs stands de restauration locale sur le village départ, ouverts dès 9h00. Options végétariennes disponibles.'],
        ['Buvette','Eau, boissons, café disponibles toute la journée. L\'eau est également fournie aux points de ravitaillement sur les parcours.'],
        ['Marché artisanal','Producteurs locaux, artisans gardois présents de 10h00 à 18h00.'],
        ['Animations','Reconstitution historique romaine, espace enfants, concert en soirée dès 18h30.'],
      ]
    },
    {
      icon:'🏥', titre:'Sécurité & Médical', couleur:'#c62828',
      items:[
        ['Poste médical','Présent sur le village départ tout au long de la journée. Secouristes diplômés (PSE1/PSE2).'],
        ['Numéro d\'urgence','En cas d\'urgence sur les parcours : composez le 15 (SAMU) ou le 112. Indiquez votre position sur la trace.'],
        ['Point de rendez-vous','En cas d\'incident, le point de rassemblement se trouve à l\'entrée du village départ, près de la tente organisation.'],
        ['Abandon','Tout abandon doit être signalé à l\'organisation. Des points de récupération sont prévus sur chaque parcours.'],
      ]
    },
    {
      icon:'♿', titre:'Accessibilité & Divers', couleur:'var(--stone)',
      items:[
        ['Accès PMR','Le village départ et les zones de remise des récompenses sont accessibles aux personnes à mobilité réduite.'],
        ['Animaux','Les animaux sont acceptés sur le site dans les espaces extérieurs, tenus en laisse.'],
        ['Consigne','Une consigne gratuite est disponible au village départ pour déposer vos affaires pendant la course.'],
        ['Règlement complet','Disponible en téléchargement sur la page de chaque course. La participation implique l\'acceptation du règlement.'],
      ]
    },
  ];

  return (
    <>
      <div style={{height:280,position:'relative',overflow:'hidden'}}>
        <div className="hero-bg" style={{backgroundImage:"url('/images/vallon.jpg')",position:'absolute',inset:0,filter:'brightness(.35) saturate(1.1)',backgroundAttachment:'fixed'}}/>
        <div className="hero-overlay" style={{position:'absolute',inset:0}}/>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',paddingTop:68}}>
          <div className="hero-eyebrow">Pratique</div>
          <h1 className="hero-title" style={{fontSize:'clamp(28px,5vw,64px)'}}>Informations <em>essentielles</em></h1>
        </div>
      </div>

      <div className="wrap">
        <div style={{background:'var(--paper)',borderLeft:'4px solid var(--tc)',padding:'20px 28px',marginBottom:52,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <span style={{fontSize:22}}>📅</span>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--tc)',marginBottom:4}}>Édition 2027</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:15,fontWeight:700,color:'var(--dark)'}}>Samedi 24 avril 2027 · Vallon de Sernhac · 30210 Sernhac (Gard)</div>
          </div>
          <button className="btn-primary" style={{marginLeft:'auto'}} onClick={()=>navigate('contact')}>Une question ? →</button>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {sections.map(s=>(
            <section key={s.titre} style={{borderLeft:`4px solid ${s.couleur}`,background:'white',marginBottom:24,overflow:'hidden'}}>
              <div style={{padding:'16px 28px',borderBottom:'1px solid var(--paper)',display:'flex',alignItems:'center',gap:12,background:'oklch(98% .005 38)'}}>
                <span style={{fontSize:18,lineHeight:1}}>{s.icon}</span>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:'.28em',textTransform:'uppercase',color:'var(--dark)',fontWeight:700}}>{s.titre}</span>
              </div>
              {s.items.map(([label,texte],i)=>(
                <div key={label} style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:'12px 32px',padding:'16px 28px',borderBottom:i<s.items.length-1?'1px solid oklch(95% .005 38)':'none',alignItems:'baseline'}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:s.couleur,lineHeight:1.5,paddingTop:2}}>{label}</div>
                  <div style={{fontFamily:"'EB Garamond',serif",fontSize:16.5,color:'oklch(28% .04 38)',lineHeight:1.7}}>{texte}</div>
                </div>
              ))}
            </section>
          ))}
        </div>

        <div style={{marginTop:52,background:'var(--dark)',padding:'40px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:24}}>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.4em',textTransform:'uppercase',color:'var(--tc)',marginBottom:10}}>Encore des questions ?</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(16px,2vw,22px)',color:'white',fontWeight:700}}>L'organisation est disponible pour vous aider.</div>
          </div>
          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            <button className="btn-primary" onClick={()=>navigate('contact')}>Nous contacter</button>
            <button className="btn-ghost" onClick={()=>navigate('evenement')}>← Programme de la journée</button>
          </div>
        </div>
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}

/* ── App ─── */
function App() {
  const [showIntro,setShowIntro]=useState(()=>{ if(localStorage.getItem('oo_site_entered')) return false; return Date.now()<SITE_OPEN.getTime(); });
  const [page,setPage]=useState(pageFromPath);
  const [menuOpen,setMenuOpen]=useState(false);
  const navigate=p=>{
    const url = p==='accueil' ? '/' : '/'+p;
    window.history.pushState({page:p}, '', url);
    setPage(p);
    setMenuOpen(false);
  };
  useEffect(()=>{ window.scrollTo({top:0,behavior:'instant'}); },[page]);
  useEffect(()=>{
    const onPop=()=>setPage(pageFromPath());
    window.addEventListener('popstate',onPop);
    return ()=>window.removeEventListener('popstate',onPop);
  },[]);
  const enterSite=()=>{ localStorage.setItem('oo_site_entered','1'); setShowIntro(false); };
  if(showIntro) return <IntroScreen onEnter={enterSite}/>;
  return (
    <div className="site">
      <Nav navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      {page==='accueil'     && <PageAccueil     navigate={navigate}/>}
      {page==='evenement'   && <PageEvenement   navigate={navigate}/>}
      {page==='infos'       && <PageInfos       navigate={navigate}/>}
      {page==='courses'     && <PageCourses     navigate={navigate}/>}
      {RACES.map(r=>page==='course_'+r.id && <PageCourseDetail key={r.id} race={r} navigate={navigate}/>)}
      {page==='vallon'      && <PageVallon      navigate={navigate}/>}
      {page==='artisans'    && <PageArtisans    navigate={navigate}/>}
      {page==='partenaires' && <PagePartenaires navigate={navigate}/>}
      {page==='galerie'     && <PageGalerie     navigate={navigate}/>}
      {page==='contact'     && <PageContact     navigate={navigate}/>}
      <footer>© 2027 <em>õ</em> origines · Sernhac · Gard · Tous droits réservés</footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App/>);
