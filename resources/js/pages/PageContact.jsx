import React, { useState } from 'react';
import { SITE_INFO, EVENT_YEAR, CSRF, Partners } from '../shared';

export default function PageContact({ navigate }) {
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
      <div className="wrap" style={{paddingTop:164}}>
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
                <option value="artisan">Réserver un emplacement</option>
                <option value="partenaire">Devenir partenaire</option>
                <option value="groupe">Inscription groupe (entreprise, collectivité, association)</option>
                <option value="benevole">Devenir bénévole</option>
                <option value="probleme">Un problème ?</option>
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
              <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--tc)',marginBottom:20}}>Aux Õrigines – Sernhac {EVENT_YEAR}</div>
            </div>
            <img src="/images/logo/logo_sms_vectorized.svg" alt="Sernhac Multi Sports" style={{height:35,width:'auto',filter:'brightness(0)',opacity:.7,alignSelf:'flex-start'}}/>
            {[
              [<LocationIcon/>,'Lieu',   SITE_INFO.adresse   || 'Le Vallon · 30210 Sernhac, Gard'],
              [<MailIcon/>,   'Email',   SITE_INFO.email     || 'sernhacmultisports@gmail.com'],
            ].map(([icon,lbl,val])=>(
              <div key={lbl} className="ci-item"><div className="ci-dot">{icon}</div><div><div className="ci-label">{lbl}</div><div className="ci-val">{val}</div></div></div>
            ))}
            <div style={{borderTop:'1px solid var(--stone)',paddingTop:20}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:'.3em',textTransform:'uppercase',color:'var(--tc)',marginBottom:12}}>Réseaux sociaux</div>
              <div className="social-row">
                {SITE_INFO.facebook  && <a href={SITE_INFO.facebook}  target="_blank" rel="noreferrer" aria-label="Facebook"  style={{display:'flex',alignItems:'center',justifyContent:'center',width:44,height:44,background:'#1877F2',borderRadius:'50%'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>}
                {SITE_INFO.instagram && <a href={SITE_INFO.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" style={{display:'flex',alignItems:'center',justifyContent:'center',width:44,height:44,background:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',borderRadius:'50%'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>}
                {SITE_INFO.youtube   && <a href={SITE_INFO.youtube}   target="_blank" rel="noreferrer" aria-label="YouTube"   style={{display:'flex',alignItems:'center',justifyContent:'center',width:44,height:44,background:'#FF0000',borderRadius:'50%'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000"/></svg></a>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Partners navigate={navigate}/>
    </>
  );
}
