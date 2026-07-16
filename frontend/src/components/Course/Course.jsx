import React from 'react';

function Course({ onBack }) {
  // Current active courses dataset
  const courseData = [
    {
      id: 'robotics-iot',
      title: 'Robotics & IoT Training',
      subtitle: 'Build Tomorrow with Robotics & IoT',
      image: '/robotics.jpg',
      description: 'Comprehensive program covering hardware engineering, circuits, sensor arrays, and cloud automation infrastructure.',
      schedule: 'Duration: 5 Months'
    },
    {
      id: '3d-designing',
      title: '3-D Designing & CAD',
      subtitle: 'Precision Prototyping',
      image: '/CAD.jpg',
      description: 'Master specialized tools to design real-world assets, mechanical parts modeling, and rapid 3D printing concepts.',
      schedule: 'Duration: 3 Months'
    },
    {
      id: 'drone-tech',
      title: 'Drone Technology',
      subtitle: 'Unmanned Aerial Systems',
      image: '/Drone.jpg',
      description: 'A structural deep dive into multi-rotor assembly, drone programming, flight telemetry, and hands-on fabrication.',
      schedule: 'Duration: 3-5 Months'
    },
    {
      id: 'ai-prompt',
      title: 'Artificial Intelligence',
      subtitle: 'Prompt Engineering & Agents',
      image: '/AIntellegent.jpg',
      description: 'Harness Large Language Models (LLMs) to construct modern AI workflow automations and customized productivity agents.',
      schedule: 'Duration: 1-2 Months'
    },
    {
      id: 'ict-foundation',
      title: 'ICT Foundation Packages',
      subtitle: 'Business Automation Essentials',
      image: '/ICT.jpg',
      description: 'Develop essential workflow skills required to master professional documents, spreadsheet data analytics, and presentation design.',
      schedule: 'Duration: 1-3 Months'
    }
  ];

  // Tailored "Upcoming Tracks" dataset
  const upcomingCourses = [
    { title: "Advance Robotics", info: "FALL TRACK", icon: "🦾" },
    { title: "3D Printing - Bambu Lab / Fusion 360", info: "WINTER LAB", icon: "🏗️" },
    { title: "Web Design (Full Stack)", info: "NEXT COHORT", icon: "🌐" },
    { title: "Dzongkha Unicode Masterclass", info: "SPECIAL PROGRAM", icon: "📜" },
    { title: "Data Analytics & ML", info: "ENROLLING NOW", icon: "📊" },
    { title: "ECCD Facilitator Training", info: "SPRING START", icon: "👩‍🏫" },
  ];

  return (
    <div style={{ padding: '4rem 2rem', color: '#ffffff', backgroundColor: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
      
      {/* 🚀 Dynamic Ticker Animation */}
      <style>{`
        @keyframes slideTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* 🛠️ Main Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#00d2ff', margin: '0 0 0.6rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Explore Our Programs
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: 0, letterSpacing: '0.3px' }}>
            Select a technology track to see full curriculum modules and details.
          </p>
        </div>
        <button onClick={onBack} style={{ background: '#1e293b', color: '#00d2ff', border: '2px solid #00d2ff', padding: '0.6rem 1.4rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.target.style.background = '#00d2ff'; e.target.style.color = '#0f172a'; }} onMouseLeave={(e) => { e.target.style.background = '#1e293b'; e.target.style.color = '#00d2ff'; }}>
          ← Home
        </button>
      </div>

      {/* Directory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto 6rem' }}>
        {courseData.map((course) => (
          <div key={course.id} style={{ background: '#111827', borderRadius: '12px', border: '1px solid #1f2937', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s ease, border-color 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#00d2ff'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1f2937'; }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#1f2937' }}>
              <img src={course.image} alt={course.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <span style={{ color: '#00d2ff', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem', display: 'block' }}>
                {course.subtitle}
              </span>
              <h3 style={{ color: '#ffffff', fontSize: '1.15rem', margin: '0 0 0.75rem', fontWeight: '700' }}>
                {course.title}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 1.25rem', flexGrow: 1 }}>
                {course.description}
              </p>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem', borderTop: '1px solid #1f2937', paddingTop: '0.75rem', marginBottom: '1rem', fontWeight: '500' }}>
                📅 {course.schedule}
              </div>
              <button style={{ width: '100%', backgroundColor: 'transparent', color: '#ffffff', border: '1px solid #00d2ff', padding: '0.6rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#00d2ff'; e.target.style.color = '#0f172a'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ffffff'; }}>
                Learn More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 INNOVATIVE COMPACT "IT VIBE" TICKER TRACK (Downsized ~40% & Spanned to 1200px) 💻 */}
      <div style={{ maxWidth: '1200px', margin: '4rem auto 2rem auto' }}>
        
        {/* Creative Section Header: Slim header bar */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '0.4rem 1rem', background: '#001d3d', borderTop: '2px solid #0077b6', borderBottom: '2px solid #0077b6', boxShadow: '0 0 8px rgba(0, 119, 182, 0.3)', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ position: 'absolute', opacity: 0.08 }} width="100%" height="100%">
            <pattern id="pattern-hex" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse" viewBox="0 0 100 100">
              <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" fill="none" stroke="#caf0f8" strokeWidth="2"/>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-hex)"/>
          </svg>

          <h2 style={{ position: 'relative', fontSize: '0.95rem', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', color: '#caf0f8', margin: 0, textShadow: '0 0 6px #00b4d8' }}>
            ⚡ NEW TECH TRACKS (Upcoming)
          </h2>
        </div>

        {/* Outer Banner Wrapper: Ultra slim vertical tracking line */}
        <div style={{ 
          width: '100%', 
          overflow: 'hidden', 
          background: 'linear-gradient(90deg, #caf0f8 0%, #ffffff 50%, #caf0f8 100%)', 
          borderLeft: '4px solid #0077b6',
          borderRight: '4px solid #0077b6',
          padding: '0.6rem 0', // Compact padding
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#0077b6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(90deg, #caf0f8 0%, #ffffff 50%, #caf0f8 100%)';
        }}
        >
          {/* Inner Infinite Moving Ribbon Container */}
          <div style={{ 
            display: 'flex', 
            width: 'max-content',
            animation: 'slideTicker 25s linear infinite', 
            gap: '1.5rem', 
            willChange: 'transform'
          }}
          onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
          onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
          >
            <style>{`
              #ticker-track > div:hover {
                background: #ffffff !important;
                border-color: #00b4d8 !important;
                box-shadow: 0 0 10px rgba(0, 180, 216, 0.5) !important;
                transform: scale(1.02);
              }
              #ticker-track > div:hover span:nth-child(2) {
                color: #0077b6 !important;
              }
              #ticker-track > div:hover span:last-child {
                background-color: #00b4d8 !important;
                color: #ffffff !important;
              }
            `}</style>
            
            <div id="ticker-track" style={{ display: 'flex', gap: '1.5rem' }}>
              {[...upcomingCourses, ...upcomingCourses, ...upcomingCourses].map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #0077b6', 
                    padding: '0.35rem 0.9rem', // Leaner micro padding
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    gap: '0.6rem',
                    boxShadow: '0 2px 6px rgba(0, 119, 182, 0.08)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '0.95rem' }}>{item.icon}</span>

                  {/* Clean micro-scaled typography */}
                  <span style={{ fontWeight: '800', color: '#0077b6', fontSize: '0.78rem', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                    {item.title}
                  </span>

                  {/* Slim status chip */}
                  <span style={{ 
                    backgroundColor: 'rgba(0, 119, 182, 0.06)', 
                    color: '#0077b6', 
                    fontSize: '0.58rem', 
                    fontWeight: '800', 
                    padding: '0.15rem 0.4rem', 
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    border: '1px solid #0077b6',
                    letterSpacing: '0.3px'
                  }}>
                    {item.info}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Panel footer */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '0.3rem', background: '#001d3d', borderTop: '2px solid #0077b6', borderBottom: '2px solid #0077b6', boxShadow: '0 0 8px rgba(0, 119, 182, 0.3)', borderRadius: '0 0 6px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '0.65rem', fontStyle: 'italic', color: '#caf0f8', margin: 0 }}>
            * (Hover track to pause).
          </p>
        </div>

      </div>

    </div>
  );
}

export default Course;