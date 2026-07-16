import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import AboutUs from './components/AboutUs/AboutUs';
import Gallery from './components/Gallery/Gallery'; 
import Course from './components/Course/Course'; 
import Contact from './components/Contact/Contact'; 
import Facilities from './components/Facilities/Facilities'; 
import Admission from './components/Admission/Admission'; 
import StaffLogin from './components/StaffLogin/StaffLogin';
import StaffDashboard from './components/Dashboard/StaffDashboard';
import './App.css'; 

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Check if we're on dashboard or login
  const isDashboard = currentPage === 'staff-dashboard';
  const isLogin = currentPage === 'staff-login';

  return (
    <div className="app-container" style={{ 
      backgroundColor: isDashboard || isLogin ? '#f0f4f8' : '#0f172a', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      <div style={{ flex: 1 }}>
        {currentPage === 'home' ? (
          // PUBLIC WEBSITE
          <>
            <Navbar onPortalClick={() => setCurrentPage('staff-login')} />
            <Hero />
            
            <div className="floating-actions-container">
              <button 
                className="action-btn facilities-btn"
                onClick={() => setCurrentPage('facilities')}
              >
                Our Facilities
              </button>
              
              <button 
                className="action-btn explore-btn" 
                onClick={() => setCurrentPage('courses')}
              >
                Explore Courses
              </button>
              
              <button 
                className="action-btn admission-btn"
                onClick={() => setCurrentPage('admission')}
              >
                Admission Form
              </button>
            </div>

            <AboutUs />
            <Gallery /> 
          </>
        ) : currentPage === 'courses' ? (
          <Course onBack={() => setCurrentPage('home')} />
        ) : currentPage === 'facilities' ? (
          <Facilities onBack={() => setCurrentPage('home')} />
        ) : currentPage === 'admission' ? (
          <Admission onBack={() => setCurrentPage('home')} />
        ) : currentPage === 'staff-login' ? (
          <StaffLogin 
            onLoginSuccess={() => setCurrentPage('staff-dashboard')} 
            onCancel={() => setCurrentPage('home')} 
          />
        ) : (
          // DASHBOARD - Render ONLY the dashboard
          <StaffDashboard onLogout={() => setCurrentPage('home')} />
        )}
      </div>

      {/* Contact - Only show on home page */}
      {currentPage === 'home' && <Contact />}
      
    </div>
  );
}

export default App;