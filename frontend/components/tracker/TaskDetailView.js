// components/tracker/TaskDetailView.js
import { useState } from 'react';

export default function TaskDetailView({ candidate, onBack, onSubmit }) {
  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  const [files, setFiles] = useState([]);
  const [link, setLink] = useState('');
  const [comments, setComments] = useState('');

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ files, link, comments });
    }
    onBack();
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: colors.textGray,
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: "'Poppins', sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0',
          marginBottom: '16px',
        }}
      >
        <i className="fas fa-arrow-left"></i> Back to Application Tracker
      </button>

      <div style={{
        background: colors.lightTeal,
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        borderLeft: `4px solid ${colors.primary}`,
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, margin: 0 }}>
          {candidate?.name || 'Ayesha Khan'} – {candidate?.role || 'AI Engineer Intern'}
        </h2>
        <p style={{ fontSize: '13px', color: colors.textGray, margin: '2px 0 0 0' }}>
          Applied on {candidate?.appliedDate || '2nd June 2026'}
        </p>
      </div>

      <div style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '28px',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, margin: '0 0 4px 0' }}>
          Submission Portal
        </h3>
        <p style={{ fontSize: '14px', color: colors.textMuted, margin: '0 0 20px 0' }}>
          {candidate?.taskStatus || 'Pending'}
        </p>

        {/* File Upload */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: colors.textDark, display: 'block', marginBottom: '8px' }}>
            Drag and drop your files here
          </label>
          <div
            style={{
              border: `2px dashed ${colors.border}`,
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#fafbfc',
              transition: 'all 0.2s',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '28px', color: colors.textMuted, display: 'block', marginBottom: '8px' }}></i>
            <p style={{ margin: 0, color: colors.textGray, fontSize: '14px' }}>or click to browse files</p>
            <p style={{ margin: '4px 0 0 0', color: colors.textMuted, fontSize: '12px' }}>
              Supported formats: .zip, .rar, .pdf (Max 50MB)
            </p>
            <input
              id="file-upload"
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>
          {files.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              {files.map((file, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '6px',
                }}>
                  <span style={{ fontSize: '13px', color: colors.textDark }}>
                    <i className="fas fa-file" style={{ marginRight: '8px', color: colors.primary }}></i>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Repository / Drive Link */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
            Repository / Drive Link
          </label>
          <input
            type="url"
            placeholder="https://github.com/username/repo"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              fontSize: '14px',
              fontFamily: "'Poppins', sans-serif",
              color: colors.textDark,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Additional Comments */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
            Additional Comments
          </label>
          <textarea
            placeholder="Any specific notes for the reviewers?"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows="3"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              fontSize: '14px',
              fontFamily: "'Poppins', sans-serif",
              color: colors.textDark,
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            background: colors.primary,
            color: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '15px',
            fontFamily: "'Poppins', sans-serif",
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#046466')}
          onMouseLeave={(e) => (e.currentTarget.style.background = colors.primary)}
        >
          Submit Work
        </button>
      </div>
    </div>
  );
}