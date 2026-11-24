import './bootstrap';
import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import {
  SEO_BASE, EVENT_YEAR, RACES, PARTENAIRES, SITE_INFO, ANNOUNCE,
  INSCRIPTIONS, INSCRIPTIONS_OUVERTES,
  pageFromPath, CookieConsentCtx, Partners,
} from './shared';

/* ── Pages (lazy) ── */
const LazyPageAccueil      = React.lazy(() => import('./pages/PageAccueil'));
const LazyPageEvenement    = React.lazy(() => import('./pages/PageEvenement'));
// Page « Infos pratiques » désactivée (non terminée) : lien grisé + route retirée.
// Pour la réactiver : restaurer l'import lazy, la route ci-dessous, 'infos' dans PAGES
// (shared.jsx), le flag `true`/`disabled` du menu et du plan de site, et la redirection
// serveur dans routes/web.php.
// const LazyPageInfos     = React.lazy(() => import('./pages/PageInfos'));
const LazyPageCourses      = React.lazy(() => import('./pages/PageCourses'));
const LazyPageCourseDetail = React.lazy(() => import('./pages/PageCourseDetail'));
const LazyPageVallon       = React.lazy(() => import('./pages/PageVallon'));
const LazyPageArtisans     = React.lazy(() => import('./pages/PageArtisans'));
const LazyPageBenevoles    = React.lazy(() => import('./pages/PageBenevoles'));
const LazyPagePartenaires  = React.lazy(() => import('./pages/PagePartenaires'));
const LazyPageGalerie      = React.lazy(() => import('./pages/PageGalerie'));
const LazyPageActualites   = React.lazy(() => import('./pages/PageActualites'));
const LazyPageContact      = React.lazy(() => import('./pages/PageContact'));

/* ── Announce bar ──
   Bandeau d'info paramétrable depuis l'admin (Configuration › Bandeau d'annonce).
   Données injectées dans window.__ANNOUNCE → ANNOUNCE :
   { actif, message, lien_label, lien_url, ton, debut, fin, key }
   S'affiche si actif, message non vide, et (si renseignée) la période couvre maintenant. */
function activeAnnouncement(a = ANNOUNCE, now = new Date()) {
  if (!a || !a.actif || !a.message) return null;
  if (a.debut && now < new Date(a.debut)) return null;
  if (a.fin   && now > new Date(a.fin))   return null;
  return a;
}

function AnnounceBar({ announcement }) {
  const ref = useRef(null);
  const storageKey = 'oo_ann_' + (announcement.key || '0');
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(storageKey) === '1'
  );
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (dismissed) { root.style.setProperty('--ann-h', '0px'); return; }
    const set = () => root.style.setProperty('--ann-h', (ref.current?.offsetHeight ?? 0) + 'px');
    set();
    window.addEventListener('resize', set);
    return () => { window.removeEventListener('resize', set); root.style.setProperty('--ann-h', '0px'); };
  }, [dismissed, storageKey]);

  if (dismissed) return null;
  const close = () => { localStorage.setItem(storageKey, '1'); setDismissed(true); };
  const hasLink = announcement.lien_url && announcement.lien_label;
  return (
    <div ref={ref} className={`announce-bar announce-bar--${announcement.ton || 'tc'}`}>
      <span className="announce-bar__msg">{announcement.message}</span>
      {hasLink && (
        <a className="announce-bar__cta" href={announcement.lien_url} target="_blank" rel="noopener noreferrer">
          {announcement.lien_label} →
        </a>
      )}
      <button className="announce-bar__close" onClick={close} aria-label="Fermer le bandeau">×</button>
    </div>
  );
}

/* ── Top Bar ── */
function TopBar({ navigate }) {
  return (
    <div className="top-bar">
      <div className="top-bar-social">
        {SITE_INFO.facebook && <a href={SITE_INFO.facebook} target="_blank" rel="noopener noreferrer" className="top-bar-icon" aria-label="Facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>}
        {SITE_INFO.instagram && <a href={SITE_INFO.instagram} target="_blank" rel="noopener noreferrer" className="top-bar-icon" aria-label="Instagram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        </a>}
        <span className="top-bar-sep">|</span>
        <div className="top-bar-madein">
          <span className="top-bar-madein__text">made by</span>
          <a href="https://www.facebook.com/assoc.sms" target="_blank" rel="noopener noreferrer" aria-label="SMS">
            <img src="/images/logo/logo_sms_vectorized.svg" alt="SMS" className="top-bar-madein__logo"/>
          </a>
        </div>
      </div>
      <div className="top-bar-right">
        {INSCRIPTIONS_OUVERTES
          ? <a className="top-bar-cta" href={INSCRIPTIONS.url} target="_blank" rel="noopener noreferrer">Je m'inscris →</a>
          : <button className="top-bar-cta" onClick={()=>navigate('courses')}>Je m'inscris →</button>}
      </div>
    </div>
  );
}

/* ── Liens SPA ── */
// Vrai href (crawlable par Google, ctrl/cmd+clic = nouvel onglet) + navigation SPA au clic simple.
const pathOf = p => p==='accueil' ? '/' : '/'+p;
const spaLink = (p, go) => ({
  href: pathOf(p),
  onClick: e => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(p);
  },
});

/* ── Nav ── */
function Nav({ navigate, page, menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY>60);
    window.addEventListener('scroll',fn); return ()=>window.removeEventListener('scroll',fn);
  },[]);
  const go = p => { navigate(p); setMenuOpen(false); };
  const links = [
    ['accueil',"Accueil",null],
    ['evenement',"L'Événement",[['evenement',"L'Événement"],['infos',"Infos pratiques",true]]],
    ['courses',"Les Courses",[
      ['courses',"Toutes les courses"],
      ...RACES.map(r => [`course/${r.urlSlug}`, `${r.name} · ${r.distance}`]),
    ]],
    ['vallon',"Le Vallon",null],
    ['benevoles',"Bénévoles",null],
    ['artisans',"Artisans",null],
    ['partenaires',"Partenaires",null],
    ['galerie',"Galerie",null],
    ['actualites',"Actualités",null],
    ['contact',"Contact",null],
  ];
  const linksLeft  = links.slice(0,4);
  const linksRight = links.slice(4);
  const isActive = id => id==='courses' ? (page==='courses'||page.startsWith('course/')) : id==='evenement' ? (page==='evenement') : page===id;
  const renderLink = ([id,lbl,sub]) => (
    <li key={id} className={sub?'has-sub':''}>
      <a href={pathOf(id)} onClick={e=>{ e.preventDefault(); if(!sub) go(id); }} style={{...(sub?{cursor:'default'}:{}), ...(isActive(id)?{color:'var(--tc)'}:{})}}>{lbl}{sub&&<span className="nav-chevron">▾</span>}</a>
      {sub&&(
        <ul className="sub-nav">
          {sub.map(([sid,slbl,off])=>(
            <li key={sid}>
              {off
                ? <a className="is-disabled" title="Bientôt disponible" aria-disabled="true" onClick={e=>e.stopPropagation()}>{slbl}</a>
                : <a {...spaLink(sid, go)}>{slbl}</a>}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
  return (
    <>
      <nav className={scrolled?'scrolled':''}>
        <ul className="nav-links nav-links-left">{linksLeft.map(renderLink)}</ul>
        <div className="nav-logo" onClick={()=>go('accueil')}>
          <img src="/images/logo/logo-preview.png" alt="Aux õrigines" style={{height:80,width:'auto',display:'block',position:'relative',zIndex:1}}/>
        </div>
        <ul className="nav-links nav-links-right">{linksRight.map(renderLink)}</ul>
        <button className="hamburger" onClick={()=>setMenuOpen(o=>!o)}><span/><span/><span/></button>
      </nav>
      <div className={`mobile-menu ${menuOpen?'open':''}`}>
        {links.map(([id,lbl,sub])=>(
          <React.Fragment key={id}>
            <a {...spaLink(id, go)}>{lbl}</a>
            {sub&&sub.slice(1).map(([sid,slbl,off])=>(
              off
                ? <a key={sid} className="is-disabled" title="Bientôt disponible" aria-disabled="true" style={{fontSize:13,paddingLeft:24}}>↳ {slbl}</a>
                : <a key={sid} {...spaLink(sid, go)} style={{fontSize:13,opacity:.7,paddingLeft:24}}>↳ {slbl}</a>
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

/* ── Cookie banner ── */
function CookieBanner({ onAccept, onRefuse }) {
  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:9999,background:'var(--dark2)',borderTop:'2px solid var(--tc)',padding:'clamp(16px,2vw,24px) clamp(20px,4vw,48px)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:24,flexWrap:'wrap',boxShadow:'0 -4px 32px oklch(0% 0 0 / .4)'}}>
      <div style={{flex:'1 1 320px',minWidth:0}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--ocre)',marginBottom:6}}>Cookies & confidentialité</p>
        <p style={{fontFamily:"'EB Garamond',serif",fontSize:15,color:'oklch(95% 0.012 68)',lineHeight:1.6}}>
          <strong style={{color:'white',fontStyle:'normal'}}>Aux Õrigines ne collecte aucune information personnelle lors de votre visite.</strong>{' '}
          Ce site utilise uniquement des cookies techniques nécessaires et des cookies tiers optionnels via <strong style={{color:'white'}}>YouTube</strong> et <strong style={{color:'white'}}>Google Fonts</strong>. Vous pouvez les refuser sans aucun impact sur votre navigation.
        </p>
      </div>
      <div style={{display:'flex',gap:12,flexShrink:0,flexWrap:'wrap'}}>
        <button onClick={onRefuse} style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.25em',textTransform:'uppercase',background:'none',color:'oklch(95% 0.012 68)',border:'1px solid oklch(30% .03 38)',padding:'10px 18px',cursor:'pointer',transition:'border-color .2s,color .2s'}}
          onMouseEnter={e=>{e.target.style.borderColor='var(--stone)';e.target.style.color='white';}}
          onMouseLeave={e=>{e.target.style.borderColor='oklch(30% .03 38)';e.target.style.color='oklch(95% 0.012 68)';}}>
          Refuser
        </button>
        <button onClick={onAccept} style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.25em',textTransform:'uppercase',background:'var(--tc)',color:'white',border:'none',padding:'10px 18px',cursor:'pointer',transition:'background .2s'}}
          onMouseEnter={e=>{e.target.style.background='var(--ocre)';e.target.style.color='var(--dark)';}}
          onMouseLeave={e=>{e.target.style.background='var(--tc)';e.target.style.color='white';}}>
          Tout accepter
        </button>
      </div>
    </div>
  );
}

/* ── Footer ── */
const NAV_PLAN = [
  { label: 'Accueil',         page: 'accueil' },
  { label: 'Événement',       page: 'evenement' },
  { label: 'Infos pratiques', page: 'infos', disabled: true },
  { label: 'Les courses',     page: 'courses' },
  { label: 'Le Vallon',       page: 'vallon' },
  { label: 'Artisans',        page: 'artisans' },
  { label: 'Bénévoles',       page: 'benevoles' },
  { label: 'Galerie',         page: 'galerie' },
  { label: 'Partenaires',     page: 'partenaires' },
  { label: 'Actualités',      page: 'actualites' },
  { label: 'Contact',         page: 'contact' },
];

function IconFacebook() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
}
function IconInstagram() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}
function IconYoutube() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>;
}

function Footer({ navigate }) {
  const info = SITE_INFO;
  const copyright = info.copyright || `© ${new Date().getFullYear()} aux Õrigines · Sernhac · Gard · Tous droits réservés`;

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__col site-footer__col--brand">
          <div className="site-footer__logo" onClick={() => navigate('accueil')}>
            <span className="site-footer__logo-name">Aux</span>
            <span className="site-footer__logo-name"><span className="site-footer__logo-mark">õ</span>rigines</span>
          </div>
          <p className="site-footer__tagline">Trail nature · Tradition<br/>Revenir aux sources · Sernhac{' '}
            <a href={`/${window.__ADMIN_PATH||'gestion-origines'}`} aria-label="Administration" style={{display:'inline-flex',verticalAlign:'middle',opacity:0,transition:'opacity .2s',color:'inherit',cursor:'default'}} onMouseEnter={e=>e.currentTarget.style.opacity=.2} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </a>
          </p>
          {(info.adresse || info.email || info.telephone) && (
            <ul className="site-footer__infos">
              {info.adresse    && <li><span className="site-footer__info-icon">📍</span>{info.adresse}</li>}
              {info.email      && <li><span className="site-footer__info-icon">✉</span><a href={`mailto:${info.email}`}>{info.email}</a></li>}
              {info.telephone  && <li><span className="site-footer__info-icon">☎</span><a href={`tel:${info.telephone}`}>{info.telephone}</a></li>}
            </ul>
          )}
          {(info.facebook || info.instagram || info.youtube) && (
            <div className="site-footer__socials">
              {info.facebook  && <a href={info.facebook}  target="_blank" rel="noreferrer" aria-label="Facebook"  className="site-footer__social-btn"><IconFacebook/></a>}
              {info.instagram && <a href={info.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="site-footer__social-btn"><IconInstagram/></a>}
              {info.youtube   && <a href={info.youtube}   target="_blank" rel="noreferrer" aria-label="YouTube"   className="site-footer__social-btn"><IconYoutube/></a>}
            </div>
          )}
        </div>

        <div className="site-footer__col">
          <h4 className="site-footer__heading">Plan du site</h4>
          <ul className="site-footer__links">
            {NAV_PLAN.map(({ label, page, disabled }) => (
              <li key={page}>
                {disabled
                  ? <span className="site-footer__link site-footer__link--muted">{label}</span>
                  : <a className="site-footer__link" {...spaLink(page, navigate)}>{label}</a>
                }
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h4 className="site-footer__heading">Règlement</h4>
          <ul className="site-footer__links">
            {info.reglementUrl
              ? <li><a href={info.reglementUrl} target="_blank" rel="noreferrer" className="site-footer__link">Règlement général</a></li>
              : <li><span className="site-footer__link site-footer__link--muted">Bientôt disponible</span></li>
            }
            {info.reglementUrl
              ? <li><a href={info.reglementUrl} target="_blank" rel="noreferrer" className="site-footer__link">Règlement des courses</a></li>
              : <li><button className="site-footer__link" onClick={() => navigate('courses')}>Règlement des courses</button></li>
            }
            <li><a className="site-footer__link" {...spaLink('contact', navigate)}>Nous contacter</a></li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bar">
        <span>{copyright.split('õ').map((part, i) => i === 0 ? part : <React.Fragment key={i}><em>õ</em>{part}</React.Fragment>)}</span>
        <a href="https://www.facebook.com/assoc.sms" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',marginLeft:16,opacity:.7,transition:'opacity .2s'}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.7}>
          <img src="/images/logo/logo_sms_vectorized.svg" alt="SMS" className="site-footer__sms-logo"/>
        </a>
      </div>
    </footer>
  );
}

/* ── App ── */
function App() {
  const [page,setPage]=useState(pageFromPath);
  const [menuOpen,setMenuOpen]=useState(false);
  const navigate=(p, extra)=>{
    window.history.pushState({page:p, ...extra}, '', pathOf(p));
    setPage(p);
    setMenuOpen(false);
  };
  useEffect(()=>{
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return ()=>{ document.body.style.overflow = ''; };
  },[menuOpen]);
  useEffect(()=>{
    const titles = {
      accueil:     SEO_BASE.title || `Aux Õrigines – Trail Nature – Sernhac ${EVENT_YEAR}`,
      evenement:   `L'Événement – Aux Õrigines ${EVENT_YEAR}`,
      courses:     `Les Courses – Aux Õrigines ${EVENT_YEAR}`,
      vallon:      `Le Vallon de Sernhac – Aux Õrigines ${EVENT_YEAR}`,
      artisans:    `Marché d'Artisans – Aux Õrigines ${EVENT_YEAR}`,
      benevoles:   `Bénévoles – Aux Õrigines ${EVENT_YEAR}`,
      galerie:     `Galerie – Aux Õrigines ${EVENT_YEAR}`,
      partenaires: `Partenaires – Aux Õrigines ${EVENT_YEAR}`,
      actualites:  `Actualités – Aux Õrigines ${EVENT_YEAR}`,
      contact:     `Contact – Aux Õrigines ${EVENT_YEAR}`,
    };
    if (page.startsWith('course/')) {
      const slug = page.slice(7);
      const race = RACES.find(r => r.urlSlug === slug);
      document.title = race ? `${race.name} – Aux Õrigines ${EVENT_YEAR}` : titles.accueil;
    } else {
      document.title = titles[page] || titles.accueil;
    }
  },[page]);
  useEffect(()=>{
    const onPop=()=>setPage(pageFromPath());
    window.addEventListener('popstate',onPop);
    return ()=>window.removeEventListener('popstate',onPop);
  },[]);
  const [consent, setConsent] = useState(() => localStorage.getItem('oo_cookie_consent'));
  const accept = () => { localStorage.setItem('oo_cookie_consent','all');       setConsent('all'); };
  const refuse = () => { localStorage.setItem('oo_cookie_consent','essential'); setConsent('essential'); };

  const courseRace = page.startsWith('course/')
    ? RACES.find(r => r.urlSlug === page.slice(7)) ?? null
    : null;

  const announcement = activeAnnouncement();

  return (
    <CookieConsentCtx.Provider value={{consent, accept, refuse}}>
    <div className="site">
      {announcement && <AnnounceBar announcement={announcement}/>}
      <TopBar navigate={navigate}/>
      <Nav navigate={navigate} page={page} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      <AnimatePresence mode="wait" onExitComplete={()=>window.scrollTo({top:0,behavior:'instant'})}>
        <motion.div
          key={page}
          initial={{opacity:0, y:18}}
          animate={{opacity:1, y:0}}
          exit={{opacity:0, y:-10}}
          transition={{duration:0.32, ease:'easeOut'}}
        >
          <Suspense fallback={<div style={{minHeight:'60vh'}}/>}>
            {page==='accueil'          && <LazyPageAccueil     navigate={navigate}/>}
            {page==='evenement'        && <LazyPageEvenement   navigate={navigate}/>}
            {page==='courses'          && <LazyPageCourses     navigate={navigate}/>}
            {courseRace                && <LazyPageCourseDetail race={courseRace} navigate={navigate}/>}
            {page==='vallon'           && <LazyPageVallon      navigate={navigate}/>}
            {page==='artisans'         && <LazyPageArtisans    navigate={navigate}/>}
            {page==='benevoles'        && <LazyPageBenevoles   navigate={navigate}/>}
            {page==='partenaires'      && <LazyPagePartenaires navigate={navigate}/>}
            {page==='galerie'          && <LazyPageGalerie     navigate={navigate}/>}
            {page==='actualites'       && <LazyPageActualites  navigate={navigate}/>}
            {page==='contact'          && <LazyPageContact     navigate={navigate}/>}
          </Suspense>
          <Footer navigate={navigate}/>
        </motion.div>
      </AnimatePresence>
      {consent === null && <CookieBanner onAccept={accept} onRefuse={refuse}/>}
    </div>
    </CookieConsentCtx.Provider>
  );
}

createRoot(document.getElementById('root')).render(<App/>);
