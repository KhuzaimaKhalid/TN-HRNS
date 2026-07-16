// components/tracker/TaskDetailView.js
import { useState } from 'react';

export default function TaskDetailView({ candidate, onBack, onSubmit }) {
  const colors = {
    primary: '#007A7C',
    border: '#cbd5e1', 
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  const [files, setFiles] = useState([]);
  const [link, setLink] = useState('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      // NOTE: backend's submitCandidateTask derives candidate_id/application_id
      // itself from the logged-in user's token (req.user.user_id) — it ignores
      // candidate_id/application_id even if sent, so we don't need them here.
      const formData = new FormData();
      formData.append('repository_link', link || '');
      formData.append('comments', comments || 'N/A');

      // Route is upload.array('attachments') — EVERY file must be appended
      // under the SAME field name 'attachments' (not 'attachments[0]' etc).
      // multerConfig only accepts pdf/doc/docx/jpg/jpeg/png, max 4.5MB each.
      files.forEach((file) => {
        formData.append('attachments', file);
      });

      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError(err.message || 'Failed to submit task. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '20px'
        }}
      >
        <i className="fas fa-arrow-left"></i> Back to Timeline
      </button>

      <div style={{ background: colors.cardBg, borderRadius: '12px', padding: '24px', border: `1px solid ${colors.border}` }}>
        <h3 style={{ margin: '0 0 8px 0', color: colors.textDark, fontSize: '20px' }}>Submit Task Assessment</h3>
        <p style={{ color: colors.textGray, fontSize: '14px', margin: '0 0 20px 0' }}>
          Please upload your deliverables and reference links for <strong>{candidate?.position || candidate?.role || 'Assigned Task'}</strong>.
        </p>

        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          style={{
            border: `2px dashed ${colors.primary}`,
            borderRadius: '10px',
            padding: '30px',
            textAlign: 'center',
            background: colors.lightTeal,
            cursor: 'pointer',
            marginBottom: '20px',
          }}
          onClick={() => document.getElementById('task-file-input').click()}
        >
          <input
            id="task-file-input"
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '32px', color: colors.primary, marginBottom: '10px' }}></i>
          <p style={{ margin: '0', fontSize: '14px', fontWeight: 600, color: colors.textDark }}>
            Drag & Drop files here or click to browse
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: colors.textMuted }}>
            PDF, ZIP, DOCX up to 10MB
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, margin: '0 0 8px 0' }}>Selected Files</h4>
            {files.map((file, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '8px 12px', borderRadius: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: colors.textDark }}>{file.name}</span>
                <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Links input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
            Project/Repository Link
          </label>
          <input
            type="text"
            placeholder="https://github.com/yourproject"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              fontSize: '14px',
              color: colors.textDark,
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Comments */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
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
              color: colors.textDark,
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        {submitError && (
          <p style={{ color: '#dc3545', fontSize: '13px', marginBottom: '12px' }}>{submitError}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            background: submitting ? colors.textMuted : colors.primary,
            color: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: '10px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '15px',
            transition: 'background 0.15s',
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
      </div>
    </div>
  );
}