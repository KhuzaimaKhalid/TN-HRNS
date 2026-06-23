import { useState } from 'react';
import { useRouter } from 'next/router';

export default function JobApplication({ onClose, onNavigate }) {
  const router = useRouter();
  const [educations, setEducations] = useState([{ id: 1 }]);
  const [experiences, setExperiences] = useState([{ id: 1 }]);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const addEducation = () => {
    setEducations([...educations, { id: educations.length + 1 }]);
  };
  const addExperience = () => {
    setExperiences([...experiences, { id: experiences.length + 1 }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setTimeout(() => {
      setApplicationSubmitted(false);
      if (onClose) onClose();
      else router.push('/');
    }, 2500);
  };

  if (applicationSubmitted) {
    return (
      <div className="auth-card" style={{ textAlign: 'center', padding: '60px 36px' }}>
        <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: 'var(--bg-light)', marginBottom: '16px' }}></i>
        <h2 style={{ color: 'var(--text-primary)' }}>Application Submitted!</h2>
        <p style={{ color: 'var(--text-muted)' }}>We'll review your application and get back to you soon.</p>
        <button className="auth-submit" style={{ marginTop: '20px' }} onClick={() => router.push('/')}>Close</button>
      </div>
    );
  }

  return (
    <div className="auth-card job-app-card" onClick={(e) => e.stopPropagation()}>
      <button className="auth-close" onClick={() => onClose ? onClose() : router.push('/')}>
        <i className="fas fa-times"></i>
      </button>

      <div className="job-app-header">
        <h1 className="auth-welcome" style={{ fontSize: '1.6rem' }}>Job Application Form</h1>
        <div className="job-app-actions">
          <button className="btn-apply" onClick={() => onClose ? onClose() : router.push('/')}>Apply now</button>
          <button 
            className="btn-apply" 
            style={{ background: 'var(--primary)', color: 'var(--white)' }} 
            onClick={() => onNavigate ? onNavigate('track') : router.push('/track')}
          >
            Track application
          </button>
        </div>
      </div>
      <p className="auth-subtitle" style={{ marginBottom: '28px' }}>Complete the form below to submit your application.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Full name</label>
            <input type="text" className="form-input" placeholder="eg Ayisha Khan" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone number</label>
              <input type="tel" className="form-input" placeholder="+92-xxx xxxx" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-input" placeholder="abc@email.com" required />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Education</h3>
          {educations.map((edu, index) => (
            <div key={edu.id} className="edu-item">
              <div className="form-row">
                <div className="form-group">
                  <label>University</label>
                  <input type="text" className="form-input" placeholder="University" />
                </div>
                <div className="form-group">
                  <label>Area of study</label>
                  <input type="text" className="form-input" placeholder="Area of study" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>CGPA</label>
                  <input type="text" className="form-input" placeholder="CGPA" />
                </div>
                <div className="form-group">
                  <label>Graduated?</label>
                  <div className="radio-group">
                    <label><input type="radio" name={`grad-${edu.id}`} value="yes" /> Yes</label>
                    <label><input type="radio" name={`grad-${edu.id}`} value="no" /> No</label>
                  </div>
                </div>
              </div>
              {index < educations.length - 1 && <hr className="edu-divider" />}
            </div>
          ))}
          <button type="button" className="add-more-btn" onClick={addEducation}>
            <i className="fas fa-plus-circle"></i> Add more
          </button>
        </div>

        <div className="form-section">
          <h3>Experience</h3>
          {experiences.map((exp, index) => (
            <div key={exp.id} className="exp-item">
              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" className="form-input" placeholder="Company" />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input type="text" className="form-input" placeholder="Position" />
                </div>
              </div>
              {index < experiences.length - 1 && <hr className="exp-divider" />}
            </div>
          ))}
          <button type="button" className="add-more-btn" onClick={addExperience}>
            <i className="fas fa-plus-circle"></i> Add more
          </button>
        </div>

        <div className="form-section">
          <h3>Skills & Position</h3>
          <div className="form-group">
            <label>Skills</label>
            <input type="text" className="form-input" placeholder="eg HTML, CSS, Node.js etc" />
          </div>
          <div className="form-group">
            <label>Position applying for</label>
            <select className="form-select">
              <option value="">Select position</option>
              <option>AI Engineer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Project Manager</option>
              <option>UI/UX Designer</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Upload Documents</h3>
          {['Resume / CV', 'Transcript', 'CNIC'].map((doc) => (
            <div className="upload-group" key={doc}>
              <label style={{ fontWeight: 500, fontSize: '0.85rem' }}>{doc}</label>
              <div className="upload-area">
                <i className="fas fa-cloud-upload-alt upload-icon"></i>
                <p>Drag & drop or <strong>browse</strong></p>
                <span className="upload-hint">PDF, DOCX up to 5MB</span>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="auth-submit">Submit Application</button>
      </form>
    </div>
  );
}