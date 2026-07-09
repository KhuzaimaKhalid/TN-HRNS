// components/tracker/SubmissionView.js
export default function SubmissionView({ candidate, onBack }) {
  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  const submission = {
    title: 'Build a Responsive React Component',
    submittedOn: '08 Jun, 2026 at 08:30 pm',
    documents: [
      { name: 'architecture_diagram.pdf', size: '2.4 MB' },
      { name: 'source_code_final.zip', size: '1.1 MB' },
    ],
    links: [
      { label: 'Github Repository', url: 'github.com/candidate/in-react-component' },
    ],
    notes: [
      'We implemented the component according to the design specifications using Tailwind CSS and React Context for state management.',
      'One thing to note: I added an extra accessibility feature for keyboard navigation within the dropdown menu that wasn\'t explicitly requested but felt necessary for production quality.',
      'Let me know if you need any clarification on the architectural choices!',
    ],
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
          {submission.title}
        </h3>
        <p style={{ fontSize: '13px', color: colors.textMuted, margin: '0 0 24px 0' }}>
          Submitted on {submission.submittedOn}
        </p>

        {/* Uploaded Documents */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: '0 0 12px 0' }}>
            <i className="fas fa-file-upload" style={{ marginRight: '8px', color: colors.primary }}></i>
            UPLOADED DOCUMENTS
          </h4>
          {submission.documents.map((doc, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '6px',
            }}>
              <span style={{ fontSize: '14px', color: colors.textDark }}>
                <i className="fas fa-file-pdf" style={{ marginRight: '8px', color: '#dc3545' }}></i>
                {doc.name}
              </span>
              <span style={{ fontSize: '12px', color: colors.textMuted }}>{doc.size}</span>
            </div>
          ))}
        </div>

        {/* Provided Links */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: '0 0 12px 0' }}>
            <i className="fas fa-link" style={{ marginRight: '8px', color: colors.primary }}></i>
            PROVIDED LINKS
          </h4>
          {submission.links.map((link, idx) => (
            <div key={idx} style={{ padding: '6px 0' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>{link.label}</span>
              <a
                href={`https://${link.url}`}
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
          ))}
        </div>

        {/* Additional Notes */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: '0 0 12px 0' }}>
            <i className="fas fa-comment" style={{ marginRight: '8px', color: colors.primary }}></i>
            ADDITIONAL NOTES
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {submission.notes.map((note, idx) => (
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