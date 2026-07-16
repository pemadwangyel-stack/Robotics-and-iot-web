import React, { useState } from 'react';
import './StaffLogin.css';

function StaffLogin({ onLoginSuccess, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 🔒 Define secure admin credentials directly here
    const ADMIN_EMAIL = 'admin@riti.edu.bt';
    const ADMIN_PASS = 'Bhutan@2026';

    if (email.toLowerCase().trim() === ADMIN_EMAIL && password === ADMIN_PASS) {
      onLoginSuccess();
    } else {
      setErrorMessage('Access Denied: Invalid Email or Password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        
        {/* BRAND TITLE LOGO HEADER */}
        <div className="login-brand">
          <img src="/logo.jpg" alt="RITI Administrative Control" className="login-logo" />
          <h2 className="login-title">Staff Portal</h2>
          <div className="login-subtitle">Secure Gateway Access Hub</div>
        </div>

        {/* ALERTS MODULE */}
        {errorMessage && <div className="login-error-toast">{errorMessage}</div>}

        {/* SUBMISSION INTERFACE FORM */}
        <form className="login-form" onSubmit={handleLoginSubmit}>
          
          <div className="input-group">
            <label>Admin Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@riti.edu.bt"
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label>Secure Access Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-login-submit">
            Authenticate & Open Dashboard
          </button>

          <button type="button" className="btn-login-cancel" onClick={onCancel}>
            Return to Public Site
          </button>

        </form>

        <div className="login-footer-notice">
          Authorized personnel only. Secure network environment protocol.
        </div>

      </div>
    </div>
  );
}

export default StaffLogin;