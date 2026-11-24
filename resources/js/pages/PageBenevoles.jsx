import React, { useState } from 'react';
import { EVENT_YEAR, EVENT_DATE_CAP, CSRF, SITE_INFO, Partners } from '../shared';

const CRENEAUX = [
  { id: 'matin',   label: 'Matin',           detail: '7h – 13h',  desc: 'Accueil, installation, départ des coureurs' },
  { id: 'aprem',   label: 'Après-midi',       detail: '13h – 18h', desc: 'Ravitaillement, arrivées, animations' },
  { id: 'cloture', label: 'Clôture',          detail: '18h – 20h', desc: 'Remise des récompenses et rangement' },
  { id: 'journee', label: 'Journée complète', detail: '7h – 20h',  desc: 'Présent·e de bout en bout' },
];

const CalIcon  = () => <svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>;
const PinIcon  = () => <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
const TeamIcon = () => <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;

export default function PageBenevoles({ navigate }) {
  const [form, setForm]     = useState({ nom: '', email: '', tel: '', creneaux: [], mission: '', vehicule: false, message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCreneau = id => setForm(f => ({
    ...f,
    creneaux: f.creneaux.includes(id) ? f.creneaux.filter(c => c !== id) : [...f.creneaux, id],
  }));

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = 'Requis';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (form.creneaux.length === 0) e.creneaux = 'Choisissez au moins un créneau';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const creneauxStr = form.creneaux
      .map(id => { const c = CRENEAUX.find(x => x.id === id); return c ? `${c.label} (${c.detail})` : id; })
      .join(', ');
    const fullMessage = [
      `Disponibilités : ${creneauxStr}`,
      form.mission ? `Mission souhaitée : ${form.mission}` : null,
      `Véhiculé·e : ${form.vehicule ? 'Oui' : 'Non'}`,
      form.tel.trim() ? `Téléphone : ${form.tel.trim()}` : null,
      form.message.trim() || null,
    ].filter(Boolean).join('\n');
    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF, 'Accept': 'application/json' },
        body: JSON.stringify({ nom: form.nom, email: form.email, sujet: 'benevole', objet: 'Candidature bénévole', message: fullMessage }),
      });
      if (res.ok) setSent(true);
      else { const d = await res.json(); setErrors(d.errors || {}); }
    } catch { setErrors({ message: 'Erreur réseau. Réessayez.' }); }
    setLoading(false);
  };

  return (
    <>
      <div className="wrap" style={{ paddingTop: 164 }}>
        <div className="sec-tag">Rejoignez l'équipe</div>
        <h2 className="sec-title">Devenir <em>Bénévole</em></h2>
        <div className="sec-rule" />

        <div className="split" style={{ marginBottom: 48, alignItems: 'center' }}>
          <div>
            <p className="body">
              Aux <em>Õ</em>rigines, ce ne sont pas seulement des coureurs, c'est avant tout une équipe de bénévoles qui donne vie à l'événement. Sans eux, il n'y a pas de balisage, pas d'accueil, pas de ravitaillement, pas de cérémonie.
            </p>
            <p className="body">
              Être bénévole ici, c'est appartenir à une famille. Une famille qui se retrouve chaque année au cœur du Vallon, partage la fatigue de la préparation et la fierté du soir venu. On ne demande aucune expérience particulière, juste l'envie d'être là et de contribuer à quelque chose d'authentique.
            </p>
            <button className="btn-primary" style={{ marginTop: 8 }}
              onClick={() => document.getElementById('benv-form')?.scrollIntoView({ behavior: 'smooth' })}>
              Je veux participer →
            </button>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <img src="/images/nom_origines_bois.jpg" alt="Le Vallon de Sernhac"
              style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }} />
          </div>
        </div>

        <div className="benv-values">
          {[
            ['🤝', 'Un esprit de famille',   "On se retrouve, on se soutient, on rit ensemble. Chaque édition tisse des liens qui durent au-delà de la journée"],
            ['🌿', 'Utile et valorisant',     "Votre présence est concrète : chaque poste est indispensable. Sans vous, l'événement ne peut tout simplement pas exister"],
            ['🎉', 'Un jour hors du commun',  "Vivre l'événement de l'intérieur, c'est une expérience unique, aux premières loges de tout ce qui se passe sur le site !"],
          ].map(([icon, titre, texte]) => (
            <div key={titre} style={{ background: 'var(--paper)', padding: 'clamp(20px,2.5vw,32px)', borderTop: '3px solid var(--tc)' }}>
              <div style={{ fontSize: 26, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 13, letterSpacing: '.1em', color: 'var(--dark)', marginBottom: 10 }}>{titre}</div>
              <p style={{ fontSize: 15, color: 'oklch(42% .04 38)', lineHeight: 1.65, margin: 0 }}>{texte}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="parallax-bg" style={{ backgroundImage: "url('/images/depart.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 380, padding: 'clamp(40px,6vw,80px) clamp(20px,4vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'oklch(8% .03 38 / .65)' }} />
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 600 }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(10px,1.1vw,12px)', letterSpacing: '.45em', textTransform: 'uppercase', color: 'var(--ocre)', marginBottom: 18 }}>Édition {EVENT_YEAR}</div>
          <p style={{ fontFamily: "'EB Garamond',serif", fontStyle: 'italic', fontSize: 'clamp(20px,2.6vw,30px)', lineHeight: 1.6, color: 'var(--cream)', margin: 0 }}>
            "On ne fait pas Aux Õrigines pour les médailles.
            On le fait pour ce moment du soir où on se regarde
            et on sait qu'on a construit quelque chose ensemble"
          </p>
          <div style={{ marginTop: 18, fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: '.3em', color: 'oklch(95% 0.012 68)', textTransform: 'uppercase' }}>
            L'équipe d'organisation
          </div>
        </div>
      </div>

      <div className="wrap" id="benv-form" style={{ paddingTop: 64, paddingBottom: 24 }}>
        <div className="sec-tag">Inscription</div>
        <h2 className="sec-title">Je <em>m'inscris</em></h2>
        <div className="sec-rule" />
        <p className="body" style={{ marginBottom: 36 }}>
          Remplissez ce formulaire et indiquez vos disponibilités. Nous organisons les postes en fonction de ce que chacun peut apporter et nous reviendrons vers vous pour confirmer votre rôle.
        </p>

        <div className="contact-grid">
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', padding: 40, textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, background: 'var(--tc)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
              </div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, letterSpacing: '.2em', color: 'var(--dark)' }}>Inscription envoyée !</div>
              <p className="body" style={{ marginTop: 8 }}>Merci de rejoindre l'équipe. Nous reviendrons vers vous très vite pour confirmer votre poste.</p>
            </div>
          ) : (
            <div className="cf">
              <input type="text" placeholder="Votre nom et prénom" className={errors.nom ? 'field-error' : ''} value={form.nom} onChange={ev => setForm(f => ({ ...f, nom: ev.target.value }))} />
              {errors.nom && <span className="error-msg">{errors.nom}</span>}

              <input type="email" placeholder="Votre adresse email" className={errors.email ? 'field-error' : ''} value={form.email} onChange={ev => setForm(f => ({ ...f, email: ev.target.value }))} />
              {errors.email && <span className="error-msg">{errors.email}</span>}

              <input type="tel" placeholder="Téléphone (optionnel)" value={form.tel} onChange={ev => setForm(f => ({ ...f, tel: ev.target.value }))} />

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--tc)', marginBottom: 12 }}>Vos disponibilités *</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {CRENEAUX.map(c => {
                    const checked = form.creneaux.includes(c.id);
                    return (
                      <label key={c.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '12px 14px', background: checked ? 'oklch(95% .05 75 / .4)' : 'var(--paper)', border: `1px solid ${checked ? 'var(--tc)' : 'var(--stone)'}`, transition: 'background .15s,border-color .15s' }}>
                        <input type="checkbox" checked={checked} onChange={() => toggleCreneau(c.id)} style={{ marginTop: 4, accentColor: 'var(--tc)', flexShrink: 0 }} />
                        <div>
                          <span style={{ fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--dark)' }}>{c.label}</span>
                          <span style={{ fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: '.1em', color: 'var(--tc)', marginLeft: 8 }}>{c.detail}</span>
                          <div style={{ fontSize: 13, color: 'oklch(50% .04 68)', marginTop: 2 }}>{c.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.creneaux && <span className="error-msg" style={{ marginTop: 6, display: 'block' }}>{errors.creneaux}</span>}
              </div>

              <select value={form.mission} onChange={ev => setForm(f => ({ ...f, mission: ev.target.value }))} style={{ marginBottom: 14 }}>
                <option value="">Préférence de mission (optionnel)</option>
                <option value="Accueil & enregistrement">Accueil & enregistrement (dossards, inscriptions)</option>
                <option value="Balisage & signalisation">Balisage & signalisation</option>
                <option value="Ravitaillement">Ravitaillement (postes sur le parcours)</option>
                <option value="Sécurité & secours">Sécurité & secours</option>
                <option value="Animations & village">Animations & village départ</option>
                <option value="Logistique & matériel">Logistique & matériel</option>
                <option value="Pas de préférence">Pas de préférence particulière</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '12px 14px', background: form.vehicule ? 'oklch(95% .05 75 / .4)' : 'var(--paper)', border: `1px solid ${form.vehicule ? 'var(--tc)' : 'var(--stone)'}`, marginBottom: 14, transition: 'background .15s,border-color .15s' }}>
                <input type="checkbox" checked={form.vehicule} onChange={() => setForm(f => ({ ...f, vehicule: !f.vehicule }))} style={{ accentColor: 'var(--tc)', flexShrink: 0 }} />
                <div>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--dark)' }}>Je suis véhiculé·e</span>
                  <div style={{ fontSize: 13, color: 'oklch(50% .04 68)', marginTop: 2 }}>Je peux aider pour les transports de matériel ou de personnes</div>
                </div>
              </label>

              <textarea placeholder="Un mot sur vous, une compétence particulière, une question... (optionnel)" value={form.message} onChange={ev => setForm(f => ({ ...f, message: ev.target.value }))} />
              {errors.message && <span className="error-msg">{errors.message}</span>}

              <button className="btn-primary" style={{ width: '100%', padding: 15, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Envoi…' : 'Envoyer ma candidature'}
              </button>
            </div>
          )}

          <div className="ci">
            <div>
              <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Infos pratiques</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 10, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--tc)', marginBottom: 20 }}>Bénévoles · Édition {EVENT_YEAR}</div>
            </div>
            {[
              [<CalIcon />,  'Date',   EVENT_DATE_CAP],
              [<PinIcon />,  'Lieu',   'Le Vallon de Sernhac · 30210 Sernhac, Gard'],
              [<TeamIcon />, 'Profil', 'Ouvert à tous, sans expérience requise'],
              [<MailIcon />, 'Email',  SITE_INFO.email || 'sernhacmultisports@gmail.com'],
            ].map(([icon, lbl, val]) => (
              <div key={lbl} className="ci-item">
                <div className="ci-dot">{icon}</div>
                <div><div className="ci-label">{lbl}</div><div className="ci-val">{val}</div></div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--stone)', paddingTop: 20, marginTop: 4 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 10, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--tc)', marginBottom: 12 }}>Ce que vous gagnez</div>
              <p style={{ fontSize: 14, color: 'oklch(45% .04 68)', lineHeight: 1.7, margin: '0 0 8px' }}>
                Repas offert sur place, dossard souvenir de l'édition et la fierté d'avoir contribué à quelque chose d'unique
              </p>
              <p style={{ fontSize: 13, color: 'oklch(55% .04 68)', fontStyle: 'italic', margin: 0 }}>
                D'autres surprises en cours de préparation, à révéler prochainement !
              </p>
            </div>
          </div>
        </div>
      </div>

      <Partners navigate={navigate} />
    </>
  );
}
