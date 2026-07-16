import React from 'react';
import './Navbar.css';

function Navbar({ onPortalClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-img-css"></div>
        <span className="logo-text">
          ROBOTIC & IOT <span className="logo-sub">TRAINING INSTITUTE</span>
        </span>
      </div>
      
      <ul className="navbar-links">
        <li><a href="#home" className="active">Home</a></li>
        <li><a href="#about">About Us</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      
      <div className="navbar-actions">
        <button className="btn-portal" onClick={onPortalClick}>Staff Portal</button>
        <div className="navbar-flag-holder">
          <img src="/Bhutanflag.png" alt="Bhutan Flag" className="navbar-flag-img" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;