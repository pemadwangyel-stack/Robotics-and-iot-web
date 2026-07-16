import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <header className="hero-section" id="home">
      <div className="hero-content">
        {/* Updated tagline text (handled with CSS for the new blue color) */}
        <span className="hero-tagline">BUILD THE FUTURE WITH CODE & HARDWARE</span>
        
        <h1>Shape Your Future With <span className="highlight">Robotics & IoT</span></h1>
        
        {/* Replaced the old text with your new STEM sentence (handled with CSS for pure white color) */}
        <p className="hero-description">
          An integrated STEM based, Robotics & IOT curriculum for youths and adults for a better digital future. 
                                         STEM for young minds
        </p>
        
        {/* BUTTONS REMOVED FROM HERE TO PREVENT OVERLAPPING THE TEXT */}
      </div>
      
      <div className="hero-image-container">
        {/* Placeholder graphic section remains intact */}
        <div className="hero-graphic">
          <span className="graphic-icon">🦾</span>
          <div className="pulse-circle"></div>
        </div>
      </div>
    </header>
  );
}

export default Hero;