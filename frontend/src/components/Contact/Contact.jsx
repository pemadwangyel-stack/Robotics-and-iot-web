import React from 'react';

function Contact() {
  return (
    <footer 
      id="contact" // Keeps smooth scrolling active
      style={{
        backgroundColor: '#0f172a', // Deep tech slate midnight background
        color: '#cbd5e1', // Clean readable light-gray text
        padding: '3rem 2rem 1.5rem 2rem',
        fontFamily: 'sans-serif',
        borderTop: '2px solid #38bdf8' // Glowing cyan top border
      }}
    >
      
      {/* MAIN CONTAINER */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '2.5rem'
      }}>
        
        {/* COLUMN 1: BRAND & MISSION */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <img 
              src="/logo2.jpg" 
              alt="RITI Logo" 
              style={{ 
                height: '75px', 
                width: '75px', 
                borderRadius: '8px',
                objectFit: 'cover'
              }} 
            />
            <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.25rem', fontWeight: '800', letterSpacing: '1px' }}>
              RITI BHUTAN
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#94a3b8' }}>
            Empowering innovators through cutting-edge Robotics, IoT, and 3D printing engineering. Shaping the tech landscape of tomorrow.
          </p>
        </div>

        {/* COLUMN 2: OFFICIAL CONTACT DETAILS */}
        <div style={{ flex: '1 1 350px' }}>
          <h4 style={{ color: '#00d2ff', fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '1.2rem', letterSpacing: '1px' }}>
            Contact Us
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
            {/* 📍 REAL ADDRESS */}
            <li style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.1rem', marginTop: '2px' }}>📍</span> 
              <span>
                <strong>Address:</strong><br />
                Gepkha Lam, Opposite to old Zangtopelri Lhakhang,<br />
                Thimphu, Bhutan, 11001
              </span>
            </li>
            
            {/* 📞 REAL MOBILE */}
            <li style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.1rem' }}>📞</span> 
              <span>
                <strong>Mobile:</strong>{' '}
                <a href="tel:+97517906057" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  +975 17906057
                </a>
              </span>
            </li>

            {/* 📧 REAL EMAIL */}
            <li style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.1rem' }}>📧</span> 
              <span>
                <strong>Email:</strong>{' '}
                <a href="mailto:youthroboticsiot@gmail.com" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  youthroboticsiot@gmail.com
                </a>
              </span>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: SOCIAL MEDIA CONNECT */}
        <div style={{ flex: '1 1 250px' }}>
          <h4 style={{ color: '#00d2ff', fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '1.2rem', letterSpacing: '1px' }}>
            Follow Our Innovations
          </h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* Direct Facebook Link */}
            <a 
              href="https://www.facebook.com/profile.php?id=61561087015537" // Your official page link parsed from the site domain configuration!
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                color: '#38bdf8',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                border: '1px solid #334155'
              }}
            >
              f
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT LINE */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #1e293b',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        &copy; {new Date().getFullYear()} Robotics & IoT Training Institute (RITI). All Rights Reserved.
      </div>

    </footer>
  );
}

export default Contact;