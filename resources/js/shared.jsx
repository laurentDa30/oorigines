import React, { useState, useEffect } from 'react';

/* ── Globals ── */
export const EVENT_DATE    = new Date(window.__EVENT_DATE  || '2027-04-24T08:00:00');
export const CSRF          = window.__CSRF_TOKEN   || '';
export const ARTISAN_COUNT = window.__ARTISAN_COUNT || 0;
export const PARTENAIRES   = window.__PARTENAIRES   || [];
export const ARTISANS      = window.__ARTISANS      || [];
export const GALERIE       = window.__GALERIE       || [];
export const SITE_INFO     = window.__SITE_INFO     || {};
export const COURSES       = window.__COURSES       || [];
export const ACTUALITES    = window.__ACTUALITES    || [];
export const SEO_BASE      = window.__SEO_BASE      || {};
export const ANNOUNCE      = window.__ANNOUNCE      || {};
export const PROGRAMME     = window.__PROGRAMME     || [];
export const SECTIONS      = window.__SECTIONS      || {};
export const INSCRIPTIONS  = window.__INSCRIPTIONS  || {};

/* ── Inscriptions ── */
export const INSCRIPTIONS_OUVERTES = !!(INSCRIPTIONS.actif && INSCRIPTIONS.url);
export const INSCRIPTIONS_TEXTE = INSCRIPTIONS.date_label
  ? `Les inscriptions ouvriront le ${INSCRIPTIONS.date_label}.`
  : 'Les inscriptions ouvriront prochainement.';

/* ── Helpers date ── */
// Toujours formater dans le fuseau de l'événement : sinon un navigateur hors de France (Googlebot rend
// les pages en heure de Californie) affiche la veille (« 9 avril » pour un départ le 10 à 8h00 à Paris).
export function fmtDate(date, opts) { return date.toLocaleDateString('fr-FR', { ...opts, timeZone: 'Europe/Paris' }); }
export const EVENT_YEAR       = Number(fmtDate(EVENT_DATE, {year:'numeric'}));
export const EVENT_DATE_COURT = fmtDate(EVENT_DATE, {day:'numeric', month:'long', year:'numeric'});
export const EVENT_DATE_CAP   = EVENT_DATE_COURT.replace(/(\d+\s)(\w)/, (_, d, l) => d + l.toUpperCase());
export const EVENT_DATE_LONG  = fmtDate(EVENT_DATE, {weekday:'long', day:'numeric', month:'long', year:'numeric'}).replace(/^\w/, l => l.toUpperCase());
export function eventEve() {
  const d = new Date(EVENT_DATE.getTime() - 86400000);
  return fmtDate(d, {weekday:'long', day:'numeric', month:'long', year:'numeric'}).replace(/^\w/, l => l.toUpperCase());
}

/* ── Utils ── */
export function toUrlSlug(str) {
  return (str || '').toLowerCase()
    .replace(/[àâä]/g,'a').replace(/[éèêë]/g,'e').replace(/[îï]/g,'i')
    .replace(/[ôö]/g,'o').replace(/[ùûü]/g,'u').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

/* ── Liens internes : vrais <a href> (suivables par Google), navigation SPA au clic simple ── */
export const pathOf = p => p==='accueil' ? '/' : '/'+p;
export const spaLink = (p, go) => ({
  href: pathOf(p),
  onClick: e => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(p);
  },
});

export const PAGES = ['accueil','evenement','courses','vallon','artisans','benevoles','galerie','partenaires','contact','actualites'];
export function pageFromPath() {
  const p = window.location.pathname.replace(/^\//, '') || 'accueil';
  if (PAGES.includes(p)) return p;
  if (p.startsWith('course/')) return p;
  return 'accueil';
}

export function getRemaining(target) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return { j: Math.floor(diff/86400000), h: Math.floor(diff%86400000/3600000), m: Math.floor(diff%3600000/60000), s: Math.floor(diff%60000/1000), done: diff===0 };
}
export const pad = n => String(n).padStart(2,'0');

export function useCountdown(target) {
  const [t, setT] = useState(() => getRemaining(target));
  useEffect(() => { const id = setInterval(()=>setT(getRemaining(target)),1000); return ()=>clearInterval(id); }, []);
  return t;
}

/* ── RACES (nécessaire dans Nav et les pages courses) ── */
export const RACES = COURSES.map(c => ({
  id:          c.slug,
  urlSlug:     toUrlSlug(c.nom),
  dist:        c.distance_val,
  unit:        c.distance_unit,
  color:       c.couleur || 'var(--tc)',
  name:        c.nom,
  type:        c.type_course || null,
  cat:         c.categorie,
  tagline:     c.tagline,
  desc:        c.description,
  depart:      c.heure_depart,
  arrivee:     c.heure_arrivee,
  denivele:    c.denivele,
  distance:    c.distance_affichee,
  profil:      c.profil || [],
  obligatoire: c.equipement_obligatoire || [],
  conseille:   c.equipement_conseille || [],
  interdit:    c.materiel_interdit || [],
  ravito:      c.ravitaillement || [],
  tarif:       c.tarif,
  limite:      c.limite,
}));

/* Distances en km distinctes, de la plus longue à la plus courte (formats en mètres exclus) : ['22km', '10km'] */
export const RACES_KM = [...new Set(RACES.filter(r => r.unit === 'km' && r.dist).map(r => Number(r.dist)))]
  .sort((a, b) => b - a)
  .map(d => `${d}km`);

/* ── Composants partagés ── */
export function Ornament() {
  return <div className="ornament"><div className="ornament-line"/><div className="ornament-diamond"/><div className="ornament-line r"/></div>;
}

export function CountdownRow({ target, light }) {
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

export function Partners({ navigate }) {
  if (!PARTENAIRES.length && !navigate) return null;
  return (
    <div className="partners">
      <div className="partners-lbl">Nos partenaires</div>
      <div className="partners-row">
        {PARTENAIRES.map(p => {
          const inner = p.logo
            ? <img src={p.logo} alt={p.nom} style={{maxHeight:44,maxWidth:110,objectFit:'contain'}}/>
            : <span style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:'.15em',textTransform:'uppercase'}}>{p.nom}</span>;
          return p.site_web
            ? <a key={p.id} href={p.site_web} target="_blank" rel="noopener noreferrer" className="partner-box" style={{textDecoration:'none'}}>{inner}</a>
            : <div key={p.id} className="partner-box">{inner}</div>;
        })}
        {navigate && (
          <a className="partner-box partner-box--join" {...spaLink('partenaires', navigate)}>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--ocre-texte)',whiteSpace:'nowrap'}}>Nous rejoindre →</span>
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Cookie consent ── */
export const CookieConsentCtx = React.createContext({ consent: null, accept: ()=>{}, refuse: ()=>{} });

export function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\s?/]+)/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&modestbranding=1&color=white` : null;
}

export function YoutubeEmbed({ url, title, style }) {
  const embedUrl = getYouTubeEmbedUrl(url);
  const { consent, accept } = React.useContext(CookieConsentCtx);
  if (!embedUrl) return null;
  if (consent === 'all') {
    return <iframe src={embedUrl} title={title||'Vidéo'} frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen style={style}/>;
  }
  return (
    <div style={{...style, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'oklch(12% .03 38)', gap:16, padding:24}}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="oklch(50% .04 38)"><path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.3 5 12 5 12 5s-4.3 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.9C6.8 19 12 19 12 19s4.3 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l5.2 3L10 15z"/></svg>
      <p style={{fontFamily:"'EB Garamond',serif",fontSize:15,color:'oklch(95% 0.012 68)',textAlign:'center',maxWidth:280,lineHeight:1.6}}>
        Cette vidéo est hébergée par YouTube.<br/>Son chargement dépose des cookies.
      </p>
      <button onClick={accept} style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.25em',textTransform:'uppercase',background:'var(--tc)',color:'white',border:'none',padding:'10px 20px',cursor:'pointer'}}>
        Accepter et lire la vidéo
      </button>
    </div>
  );
}
