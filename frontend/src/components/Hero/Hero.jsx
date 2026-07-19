import React, { useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    try {
      let foundAnnouncements = null;

      // 🕵️‍♂️ AUTO-DETECT: Scan all local storage keys to find where the dashboard saved the data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const rawValue = localStorage.getItem(key);
        
        try {
          const parsed = JSON.parse(rawValue);
          // If we find an array where the first item has a "title" property, this is our list!
          if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0].title || parsed[0].content)) {
            foundAnnouncements = parsed;
            console.log(`🎯 Auto-detected announcements key: "${key}"`);
            break;
          }
        } catch (e) {
          // Skip keys that aren't JSON arrays
        }
      }

      if (foundAnnouncements) {
        // Show the 3 most recent announcements
        setAnnouncements(foundAnnouncements.slice(0, 3));
      } else {
        // Fallback default announcement if nothing is found in local storage
        setAnnouncements([
          {
            _id: "default-1",
            category: "Event",
            title: "Welcome to Robotic & IoT",
            date: "Ongoing",
            content: "An integrated STEM-based Robotics & IoT curriculum for youth and adults. Join us to start building!"
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to parse announcements from localStorage", error);
    }
  }, []);

  return (
    <header className="hero-section" id="home">
      <div className="hero-content">
        <span className="hero-tagline">BUILD THE FUTURE WITH CODE & HARDWARE</span>
        <h1>Shape Your Future With <span className="highlight">Robotics & IoT</span></h1>
        <p className="hero-description">
          An integrated STEM based, Robotics & IOT curriculum for youths and adults for a better digital future. 
          STEM for young minds
        </p>
      </div>
      
      <div className="hero-image-container">
        <div className="news-glass-container">
          <h3 className="news-title">📢 News & Announcements</h3>
          
          <div className="news-cards-list">
            {announcements.map((item) => {
              const displayContent = item.content || item.description || "";
              const displayDate = item.publishDate || item.date || "Recent";

              return (
                <div 
                  key={item._id || item.id} 
                  className="glass-card"
                  onClick={() => setSelectedEvent(item)}
                >
                  <div className="card-header">
                    <span className={`category-tag ${(item.category || 'update').toLowerCase()}`}>
                      {item.category || 'Update'}
                    </span>
                    <span className="card-date">{displayDate}</span>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{displayContent ? displayContent.substring(0, 75) : ''}...</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= DETAILED SCALE-UP POP-UP MODAL ================= */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div 
            className="modal-content animate-scale-up" 
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal-btn" onClick={() => setSelectedEvent(null)}>×</button>
            
            <div className="modal-header-section">
              <span className={`modal-tag ${(selectedEvent.category || 'update').toLowerCase()}`}>
                {selectedEvent.category || 'Update'}
              </span>
              <span className="modal-date-tag">
                📅 {selectedEvent.publishDate || selectedEvent.date || 'Recent'}
              </span>
            </div>
            
            <h2 className="modal-title">{selectedEvent.title}</h2>
            <div className="modal-divider"></div>
            
            <p className="modal-description">
              {selectedEvent.content || selectedEvent.description}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Hero;