import React, { useState } from 'react';
import './Admission.css';

function Admission({ onBack }) {
  // Input fields tracking state
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    citizenshipStatus: 'Bhutanese',
    cidNumber: '',
    passportNumber: '',
    schoolName: '',
    className: '',
    mobileNumber: '',
    isWhatsAppSame: true,
    whatsAppNumber: '',
    emailAddress: '',
    guardianName: '',
    relationship: '',
    courseTrack: 'Robotics and IOT', 
    safetyConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For checkbox inputs, use 'checked' value, for others use 'value'
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Check if safetyConsent is being captured
    console.log('Safety Consent Value:', formData.safetyConsent);
    
    // Check safety consent
    if (formData.safetyConsent !== true) {
      alert('Please check the Laboratory Safety Consent to proceed.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Prepare data for storage - ADMISSIONS ONLY
      const admissionData = {
        id: 'admission-' + Date.now(),
        _id: 'admission-' + Date.now(),
        fullName: formData.fullName,
        name: formData.fullName,
        dob: formData.dob,
        gender: formData.gender,
        citizenshipStatus: formData.citizenshipStatus,
        cidNumber: formData.cidNumber || '',
        passportNumber: formData.passportNumber || '',
        school: formData.schoolName,
        schoolName: formData.schoolName,
        className: formData.className,
        class: formData.className,
        courseTrack: formData.courseTrack,
        mobileNumber: formData.mobileNumber,
        phone: formData.mobileNumber,
        whatsAppNumber: formData.isWhatsAppSame ? formData.mobileNumber : formData.whatsAppNumber,
        emailAddress: formData.emailAddress,
        email: formData.emailAddress,
        guardianName: formData.guardianName,
        guardian: formData.guardianName,
        relationship: formData.relationship,
        status: 'Pending',  // Default status: Pending
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        totalFee: 7500,
        paidFee: 0,
        safetyConsent: formData.safetyConsent,
        enrollYear: new Date().getFullYear().toString()
      };

      console.log('Submitting Admission Data:', admissionData);

      // Get existing admissions from localStorage
      const existingAdmissions = JSON.parse(localStorage.getItem('dashboard_admissions') || '[]');
      
      // Add new admission
      const updatedAdmissions = [admissionData, ...existingAdmissions];
      
      // Save to localStorage - ADMISSIONS ONLY
      localStorage.setItem('dashboard_admissions', JSON.stringify(updatedAdmissions));

      console.log('✅ Admission saved! Total:', updatedAdmissions.length);

      // Show success message
      setSubmitMessage('✅ Application submitted successfully! The admin will review your details.');
      
      // Clear the form
      setFormData({
        fullName: '',
        dob: '',
        gender: '',
        citizenshipStatus: 'Bhutanese',
        cidNumber: '',
        passportNumber: '',
        schoolName: '',
        className: '',
        mobileNumber: '',
        isWhatsAppSame: true,
        whatsAppNumber: '',
        emailAddress: '',
        guardianName: '',
        relationship: '',
        courseTrack: 'Robotics and IOT', 
        safetyConsent: false
      });

      alert('🎉 Application submitted successfully! The admin will review your details.');

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('❌ Submission failed. Please try again.');
      alert('❌ Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admission-page">
      <div className="admission-container">
        
        {/* HEADER */}
        <header className="admission-header">
          <div className="admission-brand">
            <img src="/logo2.jpg" alt="RITI Emblem" className="admission-logo-img" />
            <div className="admission-brand-text">
              ROBOTIC & IOT
              <span className="admission-brand-sub">TRAINING INSTITUTE</span>
            </div>
          </div>
          <button className="btn-back-home" type="button" onClick={onBack}>
            ← Back to Home
          </button>
        </header>

        <h1 className="admission-main-title">Admission Form: Student Enrollment</h1>

        {submitMessage && (
          <div style={{
            padding: '1rem',
            backgroundColor: submitMessage.includes('✅') ? '#dcfce7' : '#fee2e2',
            color: submitMessage.includes('✅') ? '#16a34a' : '#dc2626',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* SECTION 1: PERSONAL & IDENTITY */}
          <section className="form-section">
            <h2 className="section-title"><span>1</span> Personal & Identity Details</h2>
            <div className="form-grid">
              
              <div className="form-field">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="fullName" 
                  required 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  placeholder="Enter your full name" 
                />
              </div>

              <div className="form-field">
                <label>Date of Birth *</label>
                <input 
                  type="date" 
                  name="dob" 
                  required 
                  value={formData.dob} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-field">
                <label>Gender *</label>
                <select 
                  name="gender" 
                  required 
                  value={formData.gender} 
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label>Citizenship Status *</label>
                <select 
                  name="citizenshipStatus" 
                  value={formData.citizenshipStatus} 
                  onChange={handleInputChange}
                >
                  <option value="Bhutanese">Bhutanese</option>
                  <option value="Foreigner">Foreigner</option>
                </select>
              </div>

              <div className="form-field">
                <label>Name of the School *</label>
                <input 
                  type="text" 
                  name="schoolName" 
                  required 
                  value={formData.schoolName} 
                  onChange={handleInputChange} 
                  placeholder="Enter your school name" 
                />
              </div>

              <div className="form-field">
                <label>Class *</label>
                <input 
                  type="text" 
                  name="className" 
                  required 
                  value={formData.className} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Class 10, B.Sc, etc." 
                />
              </div>

              {/* Conditional Field */}
              <div className="conditional-field-wrapper" style={{ gridColumn: '1 / -1' }}>
                {formData.citizenshipStatus === 'Bhutanese' ? (
                  <div className="form-field">
                    <label>CID Number (Optional)</label>
                    <input 
                      type="text" 
                      name="cidNumber" 
                      value={formData.cidNumber} 
                      onChange={handleInputChange} 
                      placeholder="Enter 11-digit Citizenship ID Number" 
                      maxLength="11" 
                    />
                  </div>
                ) : (
                  <div className="form-field">
                    <label>Passport Number / Visa Status *</label>
                    <input 
                      type="text" 
                      name="passportNumber" 
                      required 
                      value={formData.passportNumber} 
                      onChange={handleInputChange} 
                      placeholder="Enter Passport or Work Permit ID" 
                    />
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* SECTION 2: COMMUNICATIONS & GUARDIANS */}
          <section className="form-section">
            <h2 className="section-title"><span>2</span> Communications & Guardian Details</h2>
            <div className="form-grid">
              
              <div className="form-field">
                <label>Mobile Number *</label>
                <input 
                  type="tel" 
                  name="mobileNumber" 
                  required 
                  value={formData.mobileNumber} 
                  onChange={handleInputChange} 
                  placeholder="Enter primary contact number" 
                />
                
                <div className="checkbox-field">
                  <input 
                    type="checkbox" 
                    id="isWhatsAppSame" 
                    name="isWhatsAppSame" 
                    checked={formData.isWhatsAppSame} 
                    onChange={handleInputChange} 
                  />
                  <label htmlFor="isWhatsAppSame">This number is active on WhatsApp</label>
                </div>
              </div>

              {!formData.isWhatsAppSame && (
                <div className="form-field">
                  <label>WhatsApp Number *</label>
                  <input 
                    type="tel" 
                    name="whatsAppNumber" 
                    required 
                    value={formData.whatsAppNumber} 
                    onChange={handleInputChange} 
                    placeholder="Enter active WhatsApp number" 
                  />
                </div>
              )}

              <div className="form-field">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="emailAddress" 
                  required 
                  value={formData.emailAddress} 
                  onChange={handleInputChange} 
                  placeholder="username@domain.com" 
                />
              </div>

              <div className="form-field">
                <label>Parent / Guardian Name</label>
                <input 
                  type="text" 
                  name="guardianName" 
                  value={formData.guardianName} 
                  onChange={handleInputChange} 
                  placeholder="Full name of guardian" 
                />
              </div>

              <div className="form-field">
                <label>Relationship to Student</label>
                <input 
                  type="text" 
                  name="relationship" 
                  value={formData.relationship} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Mother, Father, Uncle" 
                />
              </div>

            </div>
          </section>

          {/* SECTION 3: COURSE SELECTION */}
          <section className="form-section">
            <h2 className="section-title"><span>3</span> Course Track Selection</h2>
            <div className="form-grid">
              
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Select Preferred Tech Track *</label>
                <select 
                  name="courseTrack" 
                  value={formData.courseTrack} 
                  onChange={handleInputChange}
                >
                  <option value="Robotics and IOT">Robotics and IOT</option>
                  <option value="3-d Designing">3-d Designing</option>
                  <option value="Drone Technology">Drone Technology</option>
                  <option value="ICT foundation">ICT foundation</option>
                  <option value="Artificial intelligence">Artificial intelligence</option>
                  <option value="Python programming">Python programming</option>
                  <option value="Winter Robotics camp">Winter Robotics camp</option>
                  <option value="Summer Robotics camp">Summer Robotics camp</option>
                </select>
              </div>

            </div>
          </section>

          {/* DECLARATION & SAFETY CONSENT */}
          <div className="submit-container">
            <div className="checkbox-field" style={{ marginBottom: '1.5rem' }}>
              <input 
                type="checkbox" 
                id="safetyConsent" 
                name="safetyConsent" 
                checked={formData.safetyConsent} 
                onChange={handleInputChange} 
                required
              />
              <label htmlFor="safetyConsent">
                <strong>Laboratory Safety Consent:</strong> I acknowledge that RITI Bhutan engineering hubs involve handling components and prototyping equipment safely, and I agree to strictly adhere to the designated safety protocols.
              </label>
            </div>

            <button 
              type="submit" 
              className="btn-submit-admission" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application & Send Details'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Admission;