import React from 'react';

function Facilities({ onBack }) {
  const technologyHubs = [
    {
      id: 1,
      name: 'INNOVATION & DESIGN STUDIO',
      icon: '🧠',
      facilities: [
        { name: 'Testing room', desc: 'Dedicated space for building innovative projects.' },
        { name: 'DIY Lab', desc: 'Student access for conducting hands-on sessions & engineering projects.' },
        { name: '3D Printers', desc: 'Precision manufacturing layer printers available for major projects.' }
      ]
    },
    {
      id: 2,
      name: 'SMART DIGITAL LEARNING',
      icon: '📡',
      facilities: [
        { name: 'Interactive Classrooms', desc: 'Equipped with Interactive Television, Projectors, White boards, etc.' },
        { name: 'Field Trips', desc: 'Organized visits to various STEM Labs and relevant institutions.' },
        { name: 'STEM Kits', desc: 'Specialized modular kits available for hands-on sessions and experiments.' }
      ]
    },
    {
      id: 3,
      name: 'PROTOTYPING & HARDWARE',
      icon: '🦾',
      facilities: [
        { name: 'Robotics & IoT boards', desc: 'Advanced microcontrollers, hardware sensors, and actuator modules.' },
        { name: 'Practical Materials', desc: 'Full inventory of electrical components available for physical projects.' }
      ]
    },
    {
      id: 4,
      name: 'ACCREDITATION & DEVELOPMENT',
      icon: '🏆',
      facilities: [
        { name: 'BQPCA, MoESD Accredited', desc: 'Official government accreditation and certification provided on graduation.' },
        { name: 'STEM Competitions', desc: 'Support for Inter-Schools, National, and International events.' },
        { name: 'Safety First', desc: 'Fully equipped with First aid kits and professional fire safety equipment.' }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '4rem 2rem', fontFamily: 'sans-serif', color: '#cbd5e1' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <button 
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '2px solid #38bdf8',
            color: '#38bdf8',
            padding: '0.6rem 1.4rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '700',
            marginBottom: '2.5rem',
            transition: 'all 0.2s',
            fontSize: '0.9rem'
          }}
        >
          ← EXIT FACILITIES MODULE
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3.5rem', borderBottom: '2px solid #1e293b', paddingBottom: '1.5rem' }}>
          <img src="/logo2.jpg" alt="RITI" style={{ height: '70px', width: '70px', objectFit: 'cover', borderRadius: '8px' }} />
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              INSTITUTE INFRASTRUCTURE
            </h1>
            <p style={{ color: '#00d2ff', fontSize: '1.1rem', margin: '0.2rem 0 0 0', fontWeight: '600' }}>
              Official Certified Technology Resources & Learning Environment
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {technologyHubs.map((hub) => (
            <div 
              key={hub.id}
              style={{
                backgroundColor: '#1e293b',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #334155',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', backgroundColor: '#0f172a', padding: '0.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
                  {hub.icon}
                </span>
                <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.25rem', fontWeight: '900', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {hub.name}
                </h3>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {hub.facilities.map((facility, index) => (
                  <div key={index} style={{ borderBottom: index < hub.facilities.length - 1 ? '1px solid #334155' : 'none', paddingBottom: '1rem' }}>
                    <h4 style={{ color: '#00d2ff', margin: '0 0 0.4rem 0', fontSize: '1rem', fontWeight: '700' }}>
                      {facility.name}
                    </h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
                      {facility.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', padding: '2rem', textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
            RITI IS FULLY ACCREDITED BY
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: '800', backgroundColor: '#0f172a', padding: '0.5rem 1.5rem', borderRadius: '6px' }}>BQPCA</span>
            <span style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: '800', backgroundColor: '#0f172a', padding: '0.5rem 1.5rem', borderRadius: '6px' }}>MoESD Bhutan</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Facilities; // 👈 Fixed Export!n