import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <section className="about-section" id="about">
      <h2 className="about-main-title">ABOUT US</h2>
      
      <div className="about-container">
        {/* Left Side: Video Container */}
        <div className="about-video-side">
          <div className="video-wrapper">
            <video 
              src="video.mp4" 
              controls 
              className="about-video"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Right Side: Your Updated Custom Content */}
        <div className="about-text-side">
          <h3>Welcome to Robotics & IoT Training Institute</h3>
          
          <p className="about-intro-text">
            Where we believe in nurturing young minds and shaping bright futures as innovators and scientists. 
            With a deep passion for STEM-based Robotics & Internet of Things, our journey began with a vision 
            to prepare our youth with skills to grow, learn and thrive in the technological landscape.
          </p>
          
          <div className="details-grid">
            {/* Vision Section */}
            <div className="details-column vision-box">
              <h4>Our Vision</h4>
              <p className="quote-text">
                "To drive transformative advancements in technology and positively impact global communities by nurturing innovators in robotics and IoT"
              </p>
            </div>

            {/* Mission Section */}
            <div className="details-column mission-box">
              <h4>Our Mission</h4>
              <p className="quote-text">
                "Inspire, educate, and empower passionate learners, while preserving our national etiquettes and norms."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;