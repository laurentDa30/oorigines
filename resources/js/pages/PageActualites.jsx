import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { ACTUALITES, Partners } from '../shared';

export default function PageActualites({ navigate }) {
  const [selected, setSelected] = useState(() => {
    const i = ACTUALITES.findIndex(a => a.id === window.history.state?.actuId);
    return i >= 0 ? i : null;
  });

  useEffect(() => {
    window.scrollTo({top:0,behavior:'instant'});
  }, [selected]);

  if (selected !== null) {
    const a    = ACTUALITES[selected];
    const prev = selected > 0                     ? ACTUALITES[selected - 1] : null;
    const next = selected < ACTUALITES.length - 1 ? ACTUALITES[selected + 1] : null;
    const navBtn = {fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.28em',textTransform:'uppercase',background:'none',border:'1px solid var(--stone)',borderRadius:2,cursor:'pointer',padding:'10px 20px',display:'flex',alignItems:'center',gap:8,color:'var(--dark)',transition:'border-color .18s,color .18s'};
    return (
      <>
        <div className="wrap" style={{paddingTop:164}}>
          <button onClick={()=>setSelected(null)} style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--stone-texte)',background:'none',border:'none',cursor:'pointer',marginBottom:36,display:'flex',alignItems:'center',gap:8,padding:0}}>
            ← Toutes les actualités
          </button>

          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.25em',textTransform:'uppercase',color:'white',background:'var(--tc)',padding:'4px 12px',borderRadius:2}}>{a.categorie}</span>
            {a.date_label && <span style={{fontFamily:"'EB Garamond',serif",fontSize:15,color:'var(--stone-texte)',fontStyle:'italic'}}>{a.date_label}</span>}
          </div>
          <h1 style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(22px,3.5vw,40px)',fontWeight:900,color:'var(--dark)',lineHeight:1.2,marginBottom:20}}>{a.titre}</h1>
          <div className="sec-rule" style={{marginBottom:28}}/>

          <div style={{maxWidth:780}}>
            {a.image && <img src={a.image} alt={a.titre} style={{width:'100%',height:'auto',maxHeight:480,objectFit:'cover',borderRadius:4,marginBottom:28,display:'block'}}/>}
            {a.extrait && <p style={{fontFamily:"'EB Garamond',serif",fontSize:'clamp(17px,1.3vw,20px)',lineHeight:1.8,color:'oklch(35% .04 38)',marginBottom:28,fontStyle:'italic'}}>{a.extrait}</p>}
            {a.contenu
              ? <div className="actu-body" dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(a.contenu)}}/>
              : <p style={{fontFamily:"'EB Garamond',serif",fontSize:17,color:'var(--stone-texte)',fontStyle:'italic'}}>Contenu complet à venir…</p>
            }
          </div>

          <div style={{borderTop:'1px solid var(--stone)',marginTop:56,paddingTop:32,display:'flex',justifyContent:'space-between',alignItems:'stretch',gap:16,flexWrap:'wrap'}}>
            {prev ? (
              <button style={{...navBtn,flex:'1 1 200px',justifyContent:'flex-start'}} onClick={()=>setSelected(selected-1)}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--tc)';e.currentTarget.style.color='var(--tc)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--stone)';e.currentTarget.style.color='var(--dark)';}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span style={{textAlign:'left'}}>
                  <span style={{display:'block',fontSize:8,opacity:.6,marginBottom:2}}>Article précédent</span>
                  {prev.titre}
                </span>
              </button>
            ) : <div style={{flex:'1 1 200px'}}/>}

            <button onClick={()=>setSelected(null)} style={{...navBtn,alignSelf:'center',flexShrink:0}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--tc)';e.currentTarget.style.color='var(--tc)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--stone)';e.currentTarget.style.color='var(--dark)';}}>
              Toutes les actualités
            </button>

            {next ? (
              <button style={{...navBtn,flex:'1 1 200px',justifyContent:'flex-end',textAlign:'right'}} onClick={()=>setSelected(selected+1)}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--tc)';e.currentTarget.style.color='var(--tc)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--stone)';e.currentTarget.style.color='var(--dark)';}}>
                <span style={{textAlign:'right'}}>
                  <span style={{display:'block',fontSize:8,opacity:.6,marginBottom:2}}>Article suivant</span>
                  {next.titre}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </button>
            ) : <div style={{flex:'1 1 200px'}}/>}
          </div>
        </div>
        <Partners navigate={navigate}/>
      </>
    );
  }

  return (
    <>
      <div className="wrap" style={{paddingTop:164}}>
        <div className="sec-tag">Dernières nouvelles</div>
        <h1 className="sec-title">Toutes les <em>Actualités</em></h1>
        <div className="sec-rule"/>
        {!ACTUALITES.length && (
          <p style={{fontFamily:"'EB Garamond',serif",fontSize:18,color:'var(--stone-texte)',fontStyle:'italic',padding:'48px 0'}}>
            Aucune actualité pour le moment. Revenez bientôt !
          </p>
        )}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:28,marginTop:8}}>
          {ACTUALITES.map((a,i) => (
            <div key={a.id} onClick={()=>setSelected(i)} style={{background:'white',borderRadius:4,padding:28,cursor:'pointer',boxShadow:'0 2px 12px oklch(0% 0 0 / .06)',borderTop:'3px solid var(--tc)',transition:'box-shadow .2s,transform .2s',overflow:'hidden'}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 32px oklch(0% 0 0 / .12)';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 2px 12px oklch(0% 0 0 / .06)';e.currentTarget.style.transform='translateY(0)';}}
            >
              {a.image && <img src={a.image} alt="" loading="lazy" style={{display:'block',width:'calc(100% + 56px)',margin:'-28px -28px 20px',height:180,objectFit:'cover'}}/>}
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'.25em',textTransform:'uppercase',color:'white',background:'var(--tc)',padding:'3px 10px',borderRadius:2}}>{a.categorie}</span>
                {a.date_label && <span style={{fontFamily:"'EB Garamond',serif",fontSize:14,color:'var(--stone-texte)',fontStyle:'italic'}}>{a.date_label}</span>}
              </div>
              <h3 style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(15px,1.5vw,18px)',fontWeight:700,color:'var(--dark)',lineHeight:1.35,marginBottom:12}}>{a.titre}</h3>
              <div style={{height:1,background:'var(--stone)',margin:'12px 0',opacity:.4}}/>
              <p style={{fontFamily:"'EB Garamond',serif",fontSize:16,lineHeight:1.7,color:'oklch(38% .04 38)',margin:0}}>{a.extrait}</p>
              <div style={{marginTop:18,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.25em',textTransform:'uppercase',color:'var(--tc)',display:'flex',alignItems:'center',gap:6}}>
                Lire la suite
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}
