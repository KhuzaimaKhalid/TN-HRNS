import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DocumentUpload() {
  const router = useRouter();
  const [files, setFiles] = useState({ resume: null, transcript: null, cnic: null });
  const [errors, setErrors] = useState({});

  const handleFileChange = (type, file) => {
    setFiles({ ...files, [type]: file });
    // Clear error for that field
    if (errors[type]) {
      setErrors({ ...errors, [type]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!files.resume) newErrors.resume = 'Resume/CV is required';
    if (!files.transcript) newErrors.transcript = 'Transcript is required';
    if (!files.cnic) newErrors.cnic = 'CNIC is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Mock submission – navigate to dashboard
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
        {['resume', 'transcript', 'cnic'].map((type) => {
          const label = type === 'resume' ? 'Resume / CV' : type === 'transcript' ? 'Transcript' : 'CNIC';
          return (
            <div className="upload-group" key={type}>
              <label style={{ fontWeight: 500, fontSize: '0.85rem' }}>{label}</label>
              <div className={`upload-area ${errors[type] ? 'error' : ''}`}>
                <i className="fas fa-cloud-upload-alt upload-icon"></i>
                <p>
                  Drag & drop or{' '}
                  <strong
                    onClick={() => document.getElementById(`${type}-input`).click()}
                    style={{ cursor: 'pointer' }}
                  >
                    browse
                  </strong>
                </p>
                <span className="upload-hint">PDF, DOCX up to 5MB</span>
                <input
                  id={`${type}-input`}
                  type="file"
                  accept=".pdf,.docx"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      handleFileChange(type, e.target.files[0]);
                    }
                  }}
                />
                {files[type] && (
                  <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--primary)' }}>
                    <i className="fas fa-check-circle"></i> {files[type].name}
                  </div>
                )}
                {errors[type] && <span className="error-message">{errors[type]}</span>}
              </div>
            </div>
          );
        })}

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