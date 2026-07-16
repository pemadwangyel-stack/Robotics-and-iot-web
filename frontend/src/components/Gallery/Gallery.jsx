import React, { useState } from 'react';

function Gallery() {
  const images = [
    { id: 1, src: '/A.jpg', tag: 'CAMPUS LIFE' },
    { id: 2, src: '/B.jpg', tag: 'PROJECT INNOVATION' },
    { id: 3, src: '/C.jpg', tag: 'STUDENT PROJECT' },
    { id: 4, src: '/D.jpg', tag: 'LAB EXPERIMENT' },
    { id: 5, src: '/E.jpg', tag: 'ACHIEVEMENT WINNERS' },
    { id: 6, src: '/F.jpg', tag: 'HARDWARE FABRICATION' },
    { id: 7, src: '/G.jpg', tag: 'ACCOMPLISHED MISSIONS' },
    { id: 8, src: '/robotics.jpg', tag: 'ROBOTICS BUILD' },
    { id: 9, src: '/Drone.jpg', tag: 'UAV TELEMETRY' }
  ];

  const [current, setCurrent] = useState(4);
  const [tab, setTab] = useState('all');

  const next = () => setCurrent((p) => (p === images.length - 1 ? 0 : p + 1));
  const prev = () => setCurrent((p) => (p === 0 ? images.length - 1 : p - 1));

  const getStyle = (idx) => {
    if (idx === current) {
      return { transform: 'scale(1) translateX(0)', zIndex: 5, opacity: 1, border: '4px solid #00d2ff', boxShadow: '0 0 25px rgba(0,210,255,0.5)' };
    }
    const isLeft = idx === current - 1 || (current === 0 && idx === images.length - 1);
    if (isLeft) return { transform: 'scale(0.8) translateX(-140px)', zIndex: 3, opacity: 0.4, cursor: 'pointer' };
    
    const isRight = idx === current + 1 || (current === images.length - 1 && idx === 0);
    if (isRight) return { transform: 'scale(0.8) translateX(140px)', zIndex: 3, opacity: 0.4, cursor: 'pointer' };
    
    return { display: 'none' };
  };

  const tabs = [
    { id: 'all', name: '✨ View All' },
    { id: 'robotics', name: '🤖 Robotics' },
    { id: '3d-printing', name: '🛠️ 3D Printing' },
    { id: 'drones', name: '🛸 Drones' },
    { id: 'achievements', name: '🏆 Achievements' }
  ];

  return (
    <div style={{ backgroundColor: '#e0f2fe', padding: '4rem 2rem', color: '#0f172a', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 0.5rem 0' }}>GALLERY</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <img src="/logo2.jpg" alt="RITI" style={{ height: '75px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Campus Life & Project Innovations</h2>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '800px', margin: '0 auto 2.5rem auto' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? '#0284c7' : '#bae6fd', color: tab === t.id ? '#ffffff' : '#0369a1', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
            {t.name}
          </button>
        ))}
      </div>

      {/* CAROUSEL CONTROLLER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', maxWidth: '1200px', margin: '0 auto', height: '360px' }}>
        <button onClick={prev} style={{ position: 'absolute', left: '1.5rem', zIndex: 10, background: '#ffffff', color: '#0284c7', border: '2px solid #bae6fd', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', fontWeight: '900', fontSize: '1.4rem' }}>‹</button>

        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {images.map((img, idx) => (
            <div key={img.id} onClick={() => idx !== current && setCurrent(idx)} style={{ position: 'absolute', width: '570px', height: '330px', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.4s ease-in-out', backgroundColor: '#0f172a', boxSizing: 'border-box', ...getStyle(idx) }}>
              <img src={img.src} alt={img.tag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', boxSizing: 'border-box' }}>
                <span style={{ color: '#00d2ff', fontSize: '0.8rem', fontWeight: '800' }}>[TAG] {img.tag}</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={next} style={{ position: 'absolute', right: '1.5rem', zIndex: 10, background: '#ffffff', color: '#0284c7', border: '2px solid #bae6fd', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', fontWeight: '900', fontSize: '1.4rem' }}>›</button>
      </div>

      {/* TRACKING DOTS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '1.5rem' }}>
        {images.map((_, dot) => (
          <div key={dot} onClick={() => setCurrentPage(dot)} style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: current === dot ? '#0284c7' : '#bae6fd', cursor: 'pointer' }} />
        ))}
      </div>

    </div>
  );
}

export default Gallery;