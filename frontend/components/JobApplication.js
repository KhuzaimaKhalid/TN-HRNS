// components/JobApplication.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { applicationAPI } from '@/services/api';
export default function JobApplication() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);   // 👈 add this
  const [submitError, setSubmitError] = useState('');    // 👈 add this
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [educations, setEducations] = useState([{ id: 1 }]);
  const [experiences, setExperiences] = useState([{ id: 1 }]);
  const [skills, setSkills] = useState('');
  const [position, setPosition] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  const addEducation = () => {
    setEducations([...educations, { id: educations.length + 1 }]);
  };
  const addExperience = () => {
    setExperiences([...experiences, { id: experiences.length + 1 }]);
  };

  const validate = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Full name is required';
    if (!phone) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[0-9\- \(\)]{7,15}$/.test(phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!position) newErrors.position = 'Please select a position';
    return newErrors;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      // Actually create the application row in the backend
      await applicationAPI.submit(position);

      // Keep personal info around for the upload step
      localStorage.setItem('applicationData', JSON.stringify({
        fullName, phone, email, skills, position
      }));

      router.push('/upload');
    } catch (err) {
      console.error('Application submit error:', err);
      setSubmitError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card job-app-card">
      {/* Header with Title + Track Application button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '4px',
      }}>
        <h1 className="auth-welcome" style={{ fontSize: '1.6rem', margin: 0 }}>
          Job Application Form
        </h1>
        <button
          onClick={() => router.push('/track')}
          style={{
            background: 'transparent',
            color: '#00423D',
            border: '1.5px solid #00423D',
            padding: '8px 20px',
            borderRadius: '30px',
            fontWeight: 600,
            fontSize: '0.85rem',
            fontFamily: "'Poppins', sans-serif",
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00423D';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#00423D';
          }}
        >
          Track Application
        </button>
      </div>
      <p className="auth-subtitle" style={{ marginBottom: '28px' }}>Complete the form below to submit your application.</p>

      <form onSubmit={handleNext}>
        {/* Personal Information */}
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="eg Ayisha Khan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone number</label>
              <input
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+92-xxx xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="abc@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>
        </div>

        {/* Education */}
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

        {/* Experience */}
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

        {/* Skills & Position */}
        <div className="form-section">
          <h3>Skills & Position</h3>
          <div className="form-group">
            <label>Skills</label>
            <input
              type="text"
              className="form-input"
              placeholder="eg HTML, CSS, Node.js etc"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Position applying for</label>
            <select
              className={`form-select ${errors.position ? 'error' : ''}`}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="">Select position</option>
              <option>AI Engineer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Project Manager</option>
              <option>UI/UX Designer</option>
            </select>
            {errors.position && <span className="error-message">{errors.position}</span>}
          </div>
        </div>

        {/* Next Button */}
        <button type="submit" className="auth-submit">
          Next: Upload Documents <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
        </button>
      </form>
    </div>
  );
}