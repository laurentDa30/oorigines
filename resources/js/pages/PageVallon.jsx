import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       '/images/leaflet/marker-icon.png',
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  shadowUrl:     '/images/leaflet/marker-shadow.png',
});

export default function PageVallon() {
  const mapRef=useRef(null), mapInstRef=useRef(null), polylinesRef=useRef({});
  const [activeTrail,setActiveTrail]=useState(null);
  const TRAILS=[
    {id:'eau',name:"Au fil de l'eau",color:'#4a90d9',icon:'💧',desc:"Suivez le parcours de l'eau romaine et visualisez le passage de l'eau dans le vallon afin de comprendre la prouesse technique dans le creusement des galeries des tunnels de Perrotte à Cantarelles",dist:'<1 km',diff:'Facile',duree:'1h',coords:[[43.91753,4.55269],[43.91773,4.55272],[43.91786,4.55277],[43.91791,4.55271],[43.91794,4.55271],[43.91799,4.55265],[43.91787,4.55254],[43.91776,4.5525],[43.91765,4.5524],[43.91755,4.55225],[43.91737,4.55189],[43.91725,4.55156],[43.91723,4.55154],[43.91716,4.55158],[43.91712,4.55147],[43.917,4.55126],[43.91697,4.55087],[43.91692,4.55075],[43.91695,4.55062],[43.91687,4.55046],[43.91683,4.55052],[43.91678,4.55057],[43.91669,4.5506],[43.91664,4.55113],[43.9166,4.55131],[43.91655,4.55144],[43.9164,4.55169],[43.91635,4.55172],[43.91638,4.5518],[43.91631,4.55188],[43.91623,4.55201],[43.91624,4.55211],[43.91621,4.55219],[43.91632,4.55232],[43.91646,4.55212],[43.91649,4.55201],[43.91669,4.5518],[43.91684,4.55176],[43.91697,4.55192],[43.9172,4.55229],[43.91737,4.55216],[43.91747,4.55242],[43.91755,4.5525]]},
    {id:'hommes',name:'Au fil des hommes',color:'#c8793a',icon:'🏺',desc:"Accédez au sommet du rocher « La Perrotte » qui domine le site offrant une vue magnifique sur les terrasses des terrasses d'oliviers cultivées par les familles bénévoles aux capitelles en pierre sèche.",dist:'~1,2 km',diff:'Modéré',duree:'1h30',coords:[[43.91751,4.5527],[43.91754,4.55269],[43.91773,4.55272],[43.91786,4.55277],[43.91791,4.55271],[43.91794,4.55271],[43.91812,4.55254],[43.91815,4.55253],[43.91822,4.55256],[43.91826,4.55256],[43.91831,4.55262],[43.91837,4.55265],[43.9184,4.55262],[43.91841,4.55257],[43.91853,4.55256],[43.91865,4.55266],[43.91883,4.55275],[43.91892,4.55283],[43.919,4.55284],[43.91904,4.55287],[43.91911,4.55287],[43.91918,4.55274],[43.91927,4.55263],[43.91934,4.55267],[43.91939,4.55262],[43.91938,4.55252],[43.91932,4.5524],[43.91932,4.55233],[43.91944,4.55222],[43.91946,4.55213],[43.9195,4.5521],[43.91949,4.55201],[43.91951,4.55194],[43.91964,4.55187],[43.91966,4.55177],[43.91965,4.55168],[43.91968,4.55158],[43.91989,4.55154],[43.92009,4.5514],[43.92014,4.55141],[43.92032,4.55111],[43.92027,4.55084],[43.92031,4.55051],[43.92,4.55057],[43.91998,4.55058],[43.91993,4.55064],[43.91986,4.55064],[43.91968,4.5506],[43.91958,4.55054],[43.91955,4.55056],[43.91942,4.55048],[43.91936,4.55046],[43.91929,4.55049],[43.91927,4.55042],[43.91921,4.55038],[43.91911,4.55037],[43.91906,4.55033],[43.91907,4.55025],[43.91904,4.5502],[43.91897,4.55022],[43.91892,4.55021],[43.9189,4.55015],[43.91902,4.55005],[43.91904,4.54998],[43.91916,4.54986],[43.9192,4.54974],[43.91921,4.54965],[43.91915,4.54959],[43.91912,4.54961],[43.91916,4.5494],[43.91911,4.54923],[43.9191,4.54922],[43.91904,4.54919],[43.91893,4.54922],[43.91856,4.5491],[43.91829,4.54896],[43.91825,4.54892],[43.91824,4.54891],[43.91803,4.5493],[43.91786,4.5498],[43.9178,4.5499],[43.91757,4.54995],[43.91748,4.55004],[43.91738,4.55025],[43.91753,4.55033],[43.91756,4.55056],[43.91772,4.55113],[43.91782,4.55144],[43.91795,4.55146],[43.91795,4.55154],[43.91788,4.55177],[43.91796,4.55208],[43.91795,4.55243],[43.91798,4.5525],[43.91799,4.55265],[43.91794,4.55271],[43.91791,4.55271],[43.91786,4.55277],[43.91773,4.55272],[43.91753,4.55269]]},
    {id:'temps',name:'Au fil du temps',color:'#7a6a3a',icon:'⏳',desc:"Découvrez les capitales (Carrière, la Communale, les Sources) récemment restaurées le rocher emblématique du vallon.",dist:'~1,4 km',diff:'Facile',duree:'1h',coords:[[43.91753,4.55269],[43.91773,4.55272],[43.91786,4.55277],[43.91791,4.55271],[43.91794,4.55271],[43.91799,4.55265],[43.91787,4.55254],[43.91776,4.5525],[43.91768,4.55242],[43.91771,4.55252],[43.9177,4.55256],[43.91757,4.55252],[43.91747,4.55242],[43.91736,4.55213],[43.91735,4.55197],[43.91742,4.55174],[43.9175,4.55169],[43.91749,4.55155],[43.91745,4.5514],[43.91732,4.55118],[43.91724,4.55057],[43.91731,4.55048],[43.9174,4.55021],[43.91748,4.55004],[43.91757,4.54995],[43.91757,4.54989],[43.91752,4.54981],[43.91735,4.54984],[43.91698,4.54967],[43.91697,4.54966],[43.91695,4.54943],[43.91696,4.54918],[43.91706,4.54903],[43.91692,4.54877],[43.9168,4.5482],[43.91694,4.54783],[43.91689,4.5475],[43.917,4.54714],[43.91697,4.54706],[43.9168,4.54707],[43.91673,4.54713],[43.9165,4.54758],[43.91641,4.54765],[43.91627,4.54763],[43.91619,4.54774],[43.91611,4.54822],[43.91601,4.54836],[43.91567,4.54871],[43.91562,4.54886],[43.91551,4.54895],[43.91522,4.54913],[43.91538,4.54928],[43.9154,4.54932],[43.91538,4.54937],[43.91539,4.54945],[43.91552,4.54963],[43.91574,4.55004],[43.91583,4.55017],[43.91588,4.55011],[43.91599,4.55016],[43.91606,4.55029],[43.91615,4.55029],[43.91619,4.55038],[43.91621,4.55057],[43.91634,4.55078],[43.91642,4.55098],[43.91652,4.55102],[43.91656,4.55108],[43.91647,4.55132],[43.9164,4.55138],[43.91639,4.55141],[43.91642,4.55156],[43.91641,4.55162],[43.91638,4.55167],[43.91634,4.5517],[43.91638,4.5518],[43.91631,4.55188],[43.91623,4.55201],[43.91624,4.55211],[43.91621,4.55219],[43.91632,4.55232],[43.91646,4.55212],[43.91649,4.55201],[43.91669,4.5518],[43.9167,4.55171],[43.91684,4.55175],[43.91695,4.55186],[43.91728,4.5524],[43.91751,4.55257]]},
  ];

  useEffect(()=>{
    if(mapInstRef.current) return;
    const map=L.map(mapRef.current,{zoomControl:true,scrollWheelZoom:false}).setView([43.9175,4.5527],16);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'Tiles © Esri',maxZoom:19}).addTo(map);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,opacity:.7}).addTo(map);
    const parkingIcon=L.divIcon({className:'',html:'<div style="background:#1565c0;color:white;width:30px;height:30px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4);font-family:Arial,sans-serif">P</div>',iconSize:[30,30],iconAnchor:[15,15]});
    L.marker([43.917666187591585,4.554630323068647],{icon:parkingIcon}).addTo(map).bindPopup('<b>Parking du Vallon</b>');
    const departIcon=L.divIcon({className:'',html:'<div style="background:#2a2318;color:#c8973a;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid #c8973a;box-shadow:0 2px 6px rgba(0,0,0,.5);font-family:Arial,sans-serif">D</div>',iconSize:[20,20],iconAnchor:[10,10]});
    L.marker([43.91753,4.55269],{icon:departIcon}).addTo(map).bindPopup('<b>Départ des parcours</b>');
    TRAILS.forEach(t=>{
      const pl=L.polyline(t.coords,{color:t.color,weight:4,opacity:0}).addTo(map);
      pl.bindPopup(`<b>${t.name}</b><br>${t.dist} · ${t.diff}`);
      polylinesRef.current[t.id]=pl;
    });
    mapInstRef.current=map;
  },[]);

  useEffect(()=>{
    if(!mapInstRef.current) return;
    TRAILS.forEach(t=>{
      const pl=polylinesRef.current[t.id];
      if(!pl) return;
      if(!activeTrail)              pl.setStyle({opacity:0,   weight:4});
      else if(activeTrail===t.id)   pl.setStyle({opacity:1,   weight:6});
      else                          pl.setStyle({opacity:0,   weight:3});
    });
    mapInstRef.current.invalidateSize();
  },[activeTrail]);

  return (
    <>
      <div style={{height:300,position:'relative',overflow:'hidden'}}>
        <div className="hero-bg" style={{backgroundImage:"url('/images/depart.jpg')",position:'absolute',inset:0,filter:'brightness(.38) saturate(1.1)'}}/>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',paddingTop:'calc(112px + var(--ann-h,0px))'}}>
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
            <p className="body">Le Vallon d'Escaunes à Cantarelles est un site naturel remarquable de Sernhac (Gard), réputé pour ses <strong>galeries romaines</strong>, prolongement du Pont du Gard qui alimentaient Nîmes en eau depuis Uzès.</p>
            <p className="body">Ses terrasses méditerranéennes plantées d'oliviers centenaires, son exceptionnelle biodiversité et ses tunnels taillés dans la roche en font un lieu unique en Occitanie.</p>
            <p className="body">Le site est entretenu et animé par l'association bénévole <strong>« Le Vallon d'Escaunes à Cantarelles »</strong>, partenaire naturel de notre événement.</p>
          </div>
          <div style={{position:'sticky',top:110,alignSelf:'flex-start',display:'flex',flexDirection:'column',gap:16}}>
            {[['Tunnels romains','Deux tunnels creusés par les légions romaines au Ier siècle, visibles et praticables'],['Oliviers centenaires','Des terrasses entretenues par des familles bénévoles depuis des générations'],['Biodiversité exceptionnelle','Orchidées sauvages, faune endémique, végétation méditerranéenne préservée'],['Guide audio',"Parcours sonore \"La Perrotte\" : QR code à scanner à l'entrée du parking"]].map(([t,d])=>(
              <div key={t} style={{background:'var(--paper)',padding:'18px 22px',borderLeft:'3px solid var(--tc)'}}>
                <div style={{fontFamily:'var(--ff)',fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--tc)',marginBottom:4}}>{t}</div>
                <div style={{fontSize:15,color:'var(--dark)',lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sec-tag">Parcours balisés</div>
        <h2 className="sec-title">3 itinéraires à <em>découvrir</em> seul ou en famille</h2>
        <div className="sec-rule" style={{marginBottom:32}}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20,marginBottom:40}}>
          {TRAILS.map(t=>(
            <div key={t.id} onClick={()=>{const next=t.id===activeTrail?null:t.id;setActiveTrail(next);if(mapInstRef.current){if(next)mapInstRef.current.fitBounds(L.latLngBounds(t.coords),{padding:[30,30]});else mapInstRef.current.setView([43.9175,4.5527],16);}}}
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
            <div ref={mapRef} className="map-container"/>
            {!activeTrail&&(
              <div style={{position:'absolute',inset:0,zIndex:1000,background:'oklch(8% .03 38 / .68)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,pointerEvents:'none'}}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="oklch(70% .04 68)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/><path d="M9 4v13M15 7v13"/></svg>
                <div style={{fontFamily:'var(--ff)',fontSize:11,letterSpacing:'.25em',textTransform:'uppercase',color:'oklch(95% 0.012 68)',textAlign:'center',lineHeight:1.8}}>Cliquez sur un parcours<br/>pour afficher sa trace</div>
              </div>
            )}
          </div>
          <div style={{display:'flex',gap:20,marginTop:12,flexWrap:'wrap',position:'relative',zIndex:1}}>
            {TRAILS.map(t=><div key={t.id} style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}><div style={{width:24,height:3,background:t.color,borderRadius:2}}/>{t.name}</div>)}
            <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}><div style={{width:16,height:16,background:'#2a2318',borderRadius:'50%',border:'2px solid #c8973a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'#c8973a'}}>D</div>Départ</div>
          </div>
          <p style={{fontSize:13,color:'oklch(55% .03 68)',marginTop:8,fontStyle:'italic'}}>Les tracés sont indicatifs. Retrouver les parcours officiels et balisés sur le site de l'association</p>
        </div>
        <div style={{background:'var(--dark)',padding:'clamp(28px,4vw,48px)',marginBottom:64,display:'flex',gap:40,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:240}}>
            <div style={{fontFamily:'var(--ff)',fontSize:10,letterSpacing:'.4em',textTransform:'uppercase',color:'var(--tc)',marginBottom:16}}>Partenaire du site</div>
            <h3 style={{fontFamily:'var(--ff)',fontSize:'clamp(18px,2.5vw,28px)',color:'white',marginBottom:16,lineHeight:1.2}}>Le Vallon d'Escaunes<br/><em style={{color:'var(--tc)',fontStyle:'normal'}}>à Cantarelles</em></h3>
            <p style={{color:'oklch(95% 0.012 68)',fontSize:15,lineHeight:1.7,marginBottom:24}}>Association loi 1901 dont la mission est de restaurer, préserver, promouvoir et animer le Vallon de Sernhac.</p>
            <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
              <a href="https://vallondesernhac.fr" target="_blank" rel="noopener noreferrer" style={{fontFamily:'var(--ff)',fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',background:'var(--tc)',color:'white',padding:'12px 28px',textDecoration:'none',display:'inline-block'}}>Visiter le site →</a>
              <a href="https://www.facebook.com/LeVallondEscaunesaCantarelles" target="_blank" rel="noopener noreferrer" style={{fontFamily:'var(--ff)',fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',background:'none',color:'white',border:'1px solid oklch(40% .04 38)',padding:'12px 28px',textDecoration:'none',display:'inline-block'}}>Facebook</a>
            </div>
          </div>
          <div className="vallon-assoc">
            {[['Restaurer','Remettre en état les terrasses'],['Préserver','Protéger la biodiversité'],['Animer','Fête du Vallon, visites guidées'],['Impliquer','Bénévolat, scolaires, familles']].map(([m,d])=>(
              <div key={m} style={{background:'oklch(14% .04 38)',padding:'16px',minWidth:140}}>
                <div style={{fontFamily:'var(--ff)',fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--tc)',marginBottom:6}}>{m}</div>
                <div style={{fontSize:13,color:'oklch(95% 0.012 68)',lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
