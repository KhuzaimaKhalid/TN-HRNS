// components/tracker/SubmissionView.js
import { useState, useEffect } from 'react';
import { taskAPI } from '../../services/api';

export default function SubmissionView({ candidate, onBack }) {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  const candidateId =
    candidate?.candidate_id ||
    candidate?.id ||
    candidate?.candidate?.id ||
    candidate?.candidate?.candidate_id ||
    candidate?.user_id;

  useEffect(() => {
    if (!candidateId) {
      setError('No candidate ID found. Make sure a candidate is selected.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    taskAPI.getSubmission(candidateId)
      .then((res) => {
        if (res?.success && res.data) {
          setSubmission(res.data);
        } else {
          setError(res?.message || 'No submission found for this candidate yet.');
        }
      })
      .catch((err) => {
        console.error('Error fetching submission details:', err);
        setError(err.message || 'Failed to fetch task submission details from server.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [candidateId]);

  const handleBack = () => {
    if (onBack) onBack();
  };

  // ── Normalize possibly-inconsistent backend shapes ──────────────
  // ⚠️ Backend DB columns (file_url, repository_link) are single strings,
  // but this UI shows a *list* of documents/links. Handling all shapes
  // (plain string / array of strings / array of objects) so this doesn't
  // silently break again if the controller's packaging changes.
  const normalizeToList = (value, fallbackLabel) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .filter(Boolean)
        .map((item, idx) =>
          typeof item === 'string'
            ? { url: item, label: fallbackLabel, name: item.split('/').pop() }
            : { url: item.url, label: item.label || fallbackLabel, name: item.name, size: item.size }
        );
    }
    if (typeof value === 'string') {
      return [{ url: value, label: fallbackLabel, name: value.split('/').pop() }];
    }
    return [];
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '700px', margin: '40px auto', textAlign: 'center', fontFamily: "'Poppins', sans-serif" }}>
        <p style={{ color: colors.textGray }}>Loading submission details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '700px', margin: '40px auto', fontFamily: "'Poppins', sans-serif" }}>
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            color: colors.textGray,
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0',
            marginBottom: '16px'
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Application Tracker
        </button>
        <div style={{
          background: '#FFF0F0',
          border: '1px solid #FFCACA',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          color: '#D9534F'
        }}>
          <p style={{ fontWeight: 600, margin: 0 }}>Error loading details</p>
          <p style={{ fontSize: '13px', margin: '8px 0 0 0' }}>{error}</p>
        </div>
      </div>
    );
  }

  const candidateName = candidate?.name || submission?.candidateName || 'Candidate';
  const positionName = candidate?.role || candidate?.position || submission?.position || 'AI Engineer';
  const appliedDate = candidate?.appliedDate || candidate?.applied || '—';

  const submissionTitle = submission?.submission_title || 'Assigned Assessment Task';

  const submittedOn = submission?.task_submitted_date || submission?.created_at
    ? new Date(submission.task_submitted_date || submission.created_at).toLocaleString()
    : 'Not yet submitted';

  const documents = normalizeToList(
    submission?.task_attachments?.length ? submission.task_attachments : submission?.file_url,
    'Attachment'
  );
  const links = normalizeToList(
    submission?.task_links?.length ? submission.task_links : submission?.repository_link,
    'Repository Link'
  );

  const rawComments = submission?.task_comments || submission?.comments || 'No notes provided.';
  const notes = [rawComments];

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      <button
        onClick={handleBack}
        style={{
          background: 'none',
          border: 'none',
          color: colors.textGray,
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0',
          marginBottom: '16px'
        }}
      >
        <i className="fas fa-arrow-left"></i> Back to Application Tracker
      </button>

      {/* Candidate Banner */}
      <div style={{
        background: colors.lightTeal,
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        borderLeft: `4px solid ${colors.primary}`,
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, margin: 0 }}>
          {candidateName} – {positionName}
        </h2>
        <p style={{ fontSize: '13px', color: colors.textGray, margin: '2px 0 0 0' }}>
          Applied on {appliedDate}
        </p>
      </div>

      {/* Submission Panel */}
      <div style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '28px',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, margin: '0 0 4px 0' }}>
          {submissionTitle}
        </h3>
        <p style={{ fontSize: '13px', color: colors.textMuted, margin: '0 0 24px 0' }}>
          Submitted on {submittedOn}
        </p>

        {/* Uploaded Documents */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: '0 0 12px 0' }}>
            <i className="fas fa-file-upload" style={{ marginRight: '8px', color: colors.primary }}></i>
            UPLOADED DOCUMENTS
          </h4>
          {documents.length > 0 ? (
            documents.map((doc, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '6px',
              }}>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: colors.primary, textDecoration: 'none' }}>
                  <i className="fas fa-file-pdf" style={{ marginRight: '8px', color: '#dc3545' }}></i>
                  {doc.name || `Attachment #${idx + 1}`}
                </a>
                <span style={{ fontSize: '12px', color: colors.textMuted }}>{doc.size || ''}</span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '13px', color: colors.textMuted, fontStyle: 'italic', margin: '4px 0 0 0' }}>
              No files were uploaded with this task submission.
            </p>
          )}
        </div>

        {/* Provided Links */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: '0 0 12px 0' }}>
            <i className="fas fa-link" style={{ marginRight: '8px', color: colors.primary }}></i>
            PROVIDED LINKS
          </h4>
          {links.length > 0 ? (
            links.map((link, idx) => (
              <div key={idx} style={{ padding: '6px 0' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>{link.label || 'Repository Link'}</span>
                <a
                  href={link.url?.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    color: colors.primary,
                    textDecoration: 'none',
                    marginTop: '2px',
                  }}
                >
                  {link.url}
                </a>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '13px', color: colors.textMuted, fontStyle: 'italic', margin: '4px 0 0 0' }}>
              No repository or external links were provided.
            </p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: '0 0 12px 0' }}>
            <i className="fas fa-comment" style={{ marginRight: '8px', color: colors.primary }}></i>
            ADDITIONAL NOTES
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {notes.map((note, idx) => (
              <li key={idx} style={{ fontSize: '14px', color: colors.textGray, marginBottom: '8px', lineHeight: 1.6 }}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}