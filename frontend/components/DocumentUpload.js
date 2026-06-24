import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DocumentUpload() {
  const router = useRouter();
  const [files, setFiles] = useState({ resume: null, cnicFront: null, cnicBack: null });
  const [errors, setErrors] = useState({});

  const handleFileChange = (type, file) => {
    setFiles({ ...files, [type]: file });
    if (errors[type]) {
      setErrors({ ...errors, [type]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!files.resume) newErrors.resume = 'Resume/CV is required';
    if (!files.cnicFront) newErrors.cnicFront = 'CNIC Front is required';
    if (!files.cnicBack) newErrors.cnicBack = 'CNIC Back is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    alert('Application submitted successfully!');
    router.push('/dashboard');
  };

  return (
    <div className="auth-card job-app-card">
      <h1 className="auth-welcome" style={{ fontSize: '1.6rem' }}>Upload Documents</h1>
      <p className="auth-subtitle" style={{ marginBottom: '28px' }}>
        Please upload the required documents. <br />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          PDF, DOCX up to 5MB
        </span>
      </p>

      <form onSubmit={handleSubmit}>
        {/* Resume / CV */}
        <div className="upload-group">
          <label style={{ fontWeight: 500, fontSize: '0.85rem' }}>Resume / CV</label>
          <div className={`upload-area ${errors.resume ? 'error' : ''}`}>
            <i className="fas fa-cloud-upload-alt upload-icon"></i>
            <p>
              Drag & drop or{' '}
              <strong
                onClick={() => document.getElementById('resume-input').click()}
                style={{ cursor: 'pointer' }}
              >
                browse
              </strong>
            </p>
            <span className="upload-hint">PDF, DOCX up to 5MB</span>
            <input
              id="resume-input"
              type="file"
              accept=".pdf,.docx"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  handleFileChange('resume', e.target.files[0]);
                }
              }}
            />
            {files.resume && (
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--primary)' }}>
                <i className="fas fa-check-circle"></i> {files.resume.name}
              </div>
            )}
            {errors.resume && <span className="error-message">{errors.resume}</span>}
          </div>
        </div>

        {/* CNIC Front */}
        <div className="upload-group">
          <label style={{ fontWeight: 500, fontSize: '0.85rem' }}>CNIC Front</label>
          <div className={`upload-area ${errors.cnicFront ? 'error' : ''}`}>
            <i className="fas fa-cloud-upload-alt upload-icon"></i>
            <p>
              Drag & drop or{' '}
              <strong
                onClick={() => document.getElementById('cnicFront-input').click()}
                style={{ cursor: 'pointer' }}
              >
                browse
              </strong>
            </p>
            <span className="upload-hint">PDF, DOCX up to 5MB</span>
            <input
              id="cnicFront-input"
              type="file"
              accept=".pdf,.docx"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  handleFileChange('cnicFront', e.target.files[0]);
                }
              }}
            />
            {files.cnicFront && (
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--primary)' }}>
                <i className="fas fa-check-circle"></i> {files.cnicFront.name}
              </div>
            )}
            {errors.cnicFront && <span className="error-message">{errors.cnicFront}</span>}
          </div>
        </div>

        {/* CNIC Back */}
        <div className="upload-group">
          <label style={{ fontWeight: 500, fontSize: '0.85rem' }}>CNIC Back</label>
          <div className={`upload-area ${errors.cnicBack ? 'error' : ''}`}>
            <i className="fas fa-cloud-upload-alt upload-icon"></i>
            <p>
              Drag & drop or{' '}
              <strong
                onClick={() => document.getElementById('cnicBack-input').click()}
                style={{ cursor: 'pointer' }}
              >
                browse
              </strong>
            </p>
            <span className="upload-hint">PDF, DOCX up to 5MB</span>
            <input
              id="cnicBack-input"
              type="file"
              accept=".pdf,.docx"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  handleFileChange('cnicBack', e.target.files[0]);
                }
              }}
            />
            {files.cnicBack && (
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--primary)' }}>
                <i className="fas fa-check-circle"></i> {files.cnicBack.name}
              </div>
            )}
            {errors.cnicBack && <span className="error-message">{errors.cnicBack}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => router.push('/apply')}>
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Back
          </button>
          <button type="submit" className="auth-submit" style={{ flex: 2 }}>
            Submit Application <i className="fas fa-paper-plane" style={{ marginLeft: '8px' }}></i>
          </button>
        </div>
      </form>
    </div>
  );
}