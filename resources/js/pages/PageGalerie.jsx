import React, { useState, useEffect, useRef } from 'react';
import { GALERIE, EVENT_YEAR, YoutubeEmbed, Partners, getYouTubeEmbedUrl } from '../shared';

export default function PageGalerie({ navigate }) {
  const [lightbox, setLightbox] = useState(null);
  const photos = GALERIE.filter(g => g.image);
  const touchStartX = useRef(null);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

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
      <div className="wrap" style={{paddingTop:164}}>
        <div className="sec-tag">Souvenirs</div>
        <h2 className="sec-title">La <em>Galerie</em></h2>
        <div className="sec-rule"/>
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
                    ) : g.url_video && getYouTubeEmbedUrl(g.url_video) ? (
                      <YoutubeEmbed url={g.url_video} title={g.titre}
                        style={{position:'absolute',inset:0,width:'100%',height:'100%',border:'none'}}/>
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
        <div
          className="lightbox"
          onClick={() => setLightbox(null)}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) < 40) return;
            if (dx < 0) setLightbox(i => (i + 1) % photos.length);
            else        setLightbox(i => (i - 1 + photos.length) % photos.length);
          }}
        >
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
