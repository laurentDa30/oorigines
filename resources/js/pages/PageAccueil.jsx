import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  GALERIE, ACTUALITES, ARTISAN_COUNT, RACES, RACES_KM,
  EVENT_DATE, EVENT_DATE_COURT, EVENT_DATE_CAP,
  INSCRIPTIONS, INSCRIPTIONS_OUVERTES, INSCRIPTIONS_TEXTE,
  Partners, CountdownRow, YoutubeEmbed,
} from '../shared';

function SectionVideo() {
  const video = GALERIE.find(g => g.video_accueil && g.url_video);
  if (!video) return null;
  return (
    <div style={{background:'var(--cream)',padding:'clamp(56px,8vw,96px) clamp(20px,4vw,48px)',textAlign:'center'}}>
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <div className="sec-tag" style={{color:'var(--ocre)'}}>Découvrir</div>
        <h2 className="sec-title" style={{color:'var(--dark2)',textAlign:'center'}}>Aux <em>õ</em>rigines en <em>vidéo</em></h2>
        <div className="sec-rule" style={{margin:'0 auto 40px'}}/>
        <div style={{position:'relative',paddingBottom:'56.25%',height:0,overflow:'hidden',border:'3px solid oklch(22% .05 38)',boxShadow:'0 8px 48px oklch(0% 0 0 / .6)'}}>
          <YoutubeEmbed url={video.url_video} title={video.titre||'aux õrigines – vidéo'}
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}/>
        </div>
      </div>
    </div>
  );
}

function PhotoCard({ src, alt, titre, position, isLoaded, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      style={{position:'absolute',top:0,left:0,zIndex:hovered?9999:(5-index)*10,cursor:'pointer'}}
      initial={{x:0,y:0,rotate:0}}
      animate={isLoaded?{x:position.x,y:position.y,rotate:position.rotate}:{x:0,y:0,rotate:0}}
      transition={{type:'spring',stiffness:65,damping:13,delay:0.13}}
      whileHover={{scale:1.14,rotate:0}}
      onHoverStart={()=>setHovered(true)}
      onHoverEnd={()=>setHovered(false)}
      onClick={onClick}
    >
      <div style={{
        width:200,height:200,overflow:'hidden',background:'var(--dark2)',
        boxShadow:hovered
          ?'0 22px 64px oklch(0% 0 0 / .65)'
          :'0 10px 48px oklch(0% 0 0 / .55)',
        userSelect:'none',transition:'box-shadow .25s',position:'relative',
      }}>
        {src
          ? <>
              <img src={src} alt={alt} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',userSelect:'none',pointerEvents:'none',draggable:false}}/>
              <div style={{
                position:'absolute',inset:0,
                background:'linear-gradient(to top, oklch(8% .03 38 / .78) 0%, transparent 52%)',
                display:'flex',alignItems:'flex-end',padding:'12px',
                opacity:hovered?1:0,transition:'opacity .22s',
              }}>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',color:'white',lineHeight:1.4}}>
                  {titre||'Galerie'}
                </span>
              </div>
            </>
          : <div style={{width:'100%',height:'100%',background:'oklch(22% .03 68)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:40,height:40,background:'oklch(38% .04 68)',clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)'}}/>
            </div>
        }
      </div>
    </motion.div>
  );
}

function SectionGalerieHome({ navigate }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const sectionRef = useRef(null);
  const photos = GALERIE.filter(g => g.image).slice(0, 5);

  const POSITIONS = [
    { x: -300, y:  18, rotate: -4   },
    { x: -150, y:  32, rotate: -2   },
    { x:    0, y:   6, rotate:  1   },
    { x:  150, y:  24, rotate:  3   },
    { x:  300, y:  44, rotate: -2.5 },
  ];

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsLoaded(true); obs.disconnect(); }
    }, { threshold: 0.55, rootMargin: '0px 0px -10% 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{background:'oklch(17% 0.05 55)',padding:'clamp(56px,8vw,96px) clamp(20px,4vw,48px)',overflow:'hidden',borderTop:'3px solid var(--tc)',boxShadow:'inset 0 8px 32px oklch(0% 0 0 / .3)'}}>
      <div style={{maxWidth:1160,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:isMobile?32:52}}>
          <div className="sec-tag" style={{color:'var(--ocre)'}}>Galerie</div>
          <h2 className="sec-title" style={{color:'var(--cream)',textAlign:'center'}}>Quelques <em>instants</em></h2>
          <div className="sec-rule" style={{margin:'0 auto 0'}}/>
        </div>
        {isMobile ? (
          <>
            <div className="galerie-carousel" style={{display:'flex',overflowX:'auto',scrollSnapType:'x mandatory',gap:12,scrollbarWidth:'none',WebkitOverflowScrolling:'touch',marginBottom:32}}>
              {photos.map((photo, i) => (
                <div key={i} onClick={()=>navigate('galerie')} style={{flex:'0 0 85%',scrollSnapAlign:'center',height:240,overflow:'hidden',background:'var(--dark2)',boxShadow:'0 10px 32px oklch(0% 0 0 / .5)',cursor:'pointer',position:'relative',flexShrink:0}}>
                  {photo.image
                    ? <img src={photo.image} alt={photo.titre||''} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',pointerEvents:'none'}}/>
                    : <div style={{width:'100%',height:'100%',background:'oklch(22% .03 68)'}}/>
                  }
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,oklch(8% .03 38 / .7) 0%,transparent 50%)',display:'flex',alignItems:'flex-end',padding:12}}>
                    {photo.titre&&<span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',color:'white',lineHeight:1.4}}>{photo.titre}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center'}}>
              <button className="btn-primary" onClick={()=>navigate('galerie')}>Voir toute la galerie →</button>
            </div>
          </>
        ) : (
          <>
            <div style={{position:'relative',height:360,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:52}}>
              <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(oklch(55% .02 68 / .09) 1px,transparent 1px),linear-gradient(90deg,oklch(55% .02 68 / .09) 1px,transparent 1px)',backgroundSize:'48px 48px',maskImage:'radial-gradient(ellipse 90% 70% at 50% 50%,black 30%,transparent 100%)',WebkitMaskImage:'radial-gradient(ellipse 90% 70% at 50% 50%,black 30%,transparent 100%)'}}/>
              <div style={{position:'relative',width:200,height:200}}>
                {POSITIONS.map((pos, i) => (
                  <PhotoCard key={i} index={i} src={photos[i]?.image} alt={photos[i]?.titre||''} titre={photos[i]?.titre} position={pos} isLoaded={isLoaded} onClick={()=>navigate('galerie')}/>
                ))}
              </div>
            </div>
            <div style={{textAlign:'center'}}>
              <button className="btn-primary" onClick={()=>navigate('galerie')}>Voir toute la galerie →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ActuCard({ a, onClick }) {
  return (
    <div className="home-actu-card" onClick={onClick} style={{cursor:onClick?'pointer':'default'}}>
      {a.image && <img className="home-actu-img" src={a.image} alt="" loading="lazy"/>}
      <div className="home-actu-meta">
        <span className="home-actu-cat">{a.categorie}</span>
        {a.date_label && <span className="home-actu-date">{a.date_label}</span>}
      </div>
      <h3 className="home-actu-title">{a.titre}</h3>
      <div className="home-actu-rule"/>
      <p className="home-actu-excerpt">{a.extrait}</p>
      <div className="home-actu-read">
        Lire la suite
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
      </div>
    </div>
  );
}

function SectionActualites({ navigate }) {
  if (!ACTUALITES.length) return null;
  const preview = ACTUALITES.slice(0, 3);
  return (
    <div style={{background:'var(--cream)',padding:'clamp(56px,8vw,96px) clamp(20px,4vw,48px)',borderTop:'1px solid var(--stone)'}}>
      <div style={{maxWidth:1160,margin:'0 auto'}}>
        <div className="sec-tag">Actualités</div>
        <h2 className="sec-title">Les dernières <em>nouvelles</em></h2>
        <div className="sec-rule"/>
        <div className="home-actu-grid">
          {preview.map(a => (
            <ActuCard key={a.id} a={a} onClick={navigate ? () => navigate('actualites', {actuId:a.id}) : null}/>
          ))}
        </div>
        {ACTUALITES.length > 0 && navigate && (
          <div style={{textAlign:'center',marginTop:40}}>
            <button className="btn-primary" onClick={()=>navigate('actualites')}>
              Toutes les actualités →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionParallaxCTA({ navigate }) {
  return (
    <div className="parallax-bg" style={{backgroundImage:"url('/images/depart.jpg')",backgroundAttachment:'fixed',backgroundSize:'cover',backgroundPosition:'center',minHeight:460,padding:'clamp(60px,8vw,100px) clamp(20px,4vw,48px)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
      <div style={{position:'absolute',inset:0,background:'oklch(8% .03 38 / .72)'}}/>
      <div style={{position:'relative',textAlign:'center',maxWidth:720,width:'100%'}}>
        <div className="hero-rule" style={{marginBottom:24}}>
          <div className="hero-rule-line"/>
          <div className="hero-rule-ornament">✦</div>
          <div className="hero-rule-line r"/>
        </div>
        <h2 style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(28px,4.5vw,56px)',fontWeight:900,color:'white',lineHeight:1.1,marginBottom:20,letterSpacing:'.02em'}}>
          Prêt à fouler <em style={{color:'var(--tc)'}}>notre terrain de jeu</em> ?
        </h2>
        <p style={{fontSize:'clamp(16px,1.4vw,19px)',lineHeight:1.8,color:'oklch(95% 0.012 68)',marginBottom:40,fontFamily:"'EB Garamond',serif"}}>
          Rejoignez des coureurs et familles pour une journée au cœur du Vallon de Sernhac.
        </p>
        {INSCRIPTIONS_OUVERTES ? (
          <a className="btn-primary" href={INSCRIPTIONS.url} target="_blank" rel="noopener noreferrer"
             style={{padding:'18px 56px',fontSize:12,letterSpacing:'.35em',display:'inline-block',textDecoration:'none'}}>
            Je m'inscris →
          </a>
        ) : (
          <>
            <button className="btn-primary" disabled style={{padding:'18px 56px',fontSize:12,letterSpacing:'.35em',opacity:.5,cursor:'not-allowed'}}>
              Je m'inscris →
            </button>
            <p style={{marginTop:20,marginBottom:0,fontSize:14,letterSpacing:'.06em',color:'oklch(95% 0.012 68)',fontFamily:"'EB Garamond',serif"}}>
              {INSCRIPTIONS_TEXTE}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function PageAccueil({ navigate }) {
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

  const IMG="url('/images/hero.jpg')"; const BG_POS='center 65%'; const BG_FILTER='brightness(.62) saturate(1.1)';
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
          <div style={titleStyle}><h1 className="hero-title" style={{fontSize:'clamp(48px,9vw,120px)',whiteSpace:'nowrap'}}>Aux <em>õ</em>rigines</h1></div>
        </div>
        <motion.div
          initial={{opacity:0,y:16}}
          animate={revealed?{opacity:1,y:0}:{opacity:0,y:16}}
          transition={{duration:0.9,delay:0.9,ease:'easeOut'}}
          style={{position:'absolute',bottom:'clamp(140px, 18vh, 220px)',left:0,right:0,display:'flex',flexDirection:'column',alignItems:'center',zIndex:7}}
        >
          <div className="hero-latin" style={{color:'rgb(255,223,190)'}}>· RETOUR AUX SOURCES ·</div>
          <div className="hero-date-block">
            <div className="hero-date-item"><span className="hero-date-val">{EVENT_DATE_CAP}</span><span className="hero-date-lbl">Date</span></div>
            <div className="hero-date-sep"/>
            <div className="hero-date-item"><span className="hero-date-val">Sernhac</span><span className="hero-date-lbl">Le Vallon · Gard</span></div>
            <div className="hero-date-sep"/>
            <div className="hero-date-item"><span className="hero-date-val">Trail / Marche</span><span className="hero-date-lbl">{RACES_KM.join(' - ')}</span></div>
          </div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={()=>navigate('courses')}>Découvrir les courses</button>
            <button className="btn-ghost"   onClick={()=>navigate('evenement')}>Découvrir l'événement</button>
          </div>
        </motion.div>
        <div className="hero-scroll" style={{zIndex:8}}><div className="scroll-arrow"/><span>Défiler</span></div>
      </div>

      <div className="cstrip">
        <div className="cstrip-label" style={{color:'rgb(185,153,97)'}}>Compte à rebours – Rendez-vous le {EVENT_DATE_CAP}</div>
        <CountdownRow target={EVENT_DATE} light/>
      </div>

      <div className="wrap">
        <div className="split">
          <div>
            <div className="sec-tag">L'Événement</div>
            <h2 className="sec-title">Retournez aux <em>õ</em>rigines</h2>
            <div className="sec-rule"/>
            <p className="body">Le {EVENT_DATE_COURT}, Sernhac ouvre les portes d'une expérience unique au cœur du Vallon. Dans un décor naturel exceptionnel, aux accents de l'époque romaine, coureurs et familles se retrouvent pour célébrer le sport, le terroir et l'artisanat local.</p>
            <p className="body">Une journée hors du temps, entre effort et convivialité, dans l'un des plus beaux sites naturels du Gard.</p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:8}}>
              <button className="btn-primary" onClick={()=>navigate('evenement')}>En savoir plus</button>
            </div>
          </div>
          <div className="image-frame"><img src="/images/vallon.jpg" alt="Le Vallon de Sernhac" loading="lazy"/></div>
        </div>
      </div>

      <SectionVideo/>
      <SectionGalerieHome navigate={navigate}/>
      <SectionActualites navigate={navigate}/>
      <SectionParallaxCTA navigate={navigate}/>

      <div style={{background:'var(--paper)',padding:'clamp(40px,6vw,72px) clamp(20px,4vw,48px)'}}>
        <div className="stats-grid">
          {(()=>{
            const types = [...new Set(RACES.map(r=>r.type).filter(Boolean))];
            const eprDesc = types.length ? types.join(' · ') : 'Trail, Marche & Marche Nordique';
            return [
              [RACES.length||'–', 'Épreuves', eprDesc],
              [ARTISAN_COUNT||'–', 'Artisans', 'Marché de créateurs et producteurs locaux'],
              ['1', 'Journée', 'Un événement convivial, festif et authentique'],
            ];
          })().map(([n,t,d])=>(
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
