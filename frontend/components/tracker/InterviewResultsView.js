// components/tracker/InterviewResultsView.js
export default function InterviewResultsView({ candidate, onBack }) {
  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  const results = {
    status: 'Evaluated',
    date: '15 Jun 2026',
    scores: [
      { label: 'Technical Assessment', score: '8.5/10' },
      { label: 'Problem Solving', score: '9.0/10' },
      { label: 'Communication', score: '8.0/10' },
    ],
    notes: [
      {
        section: 'Technical Assessment',
        text: 'Demonstrated strong frontend development skills with a good understanding of HTML, CSS, JavaScript, and modern frameworks. Completed technical tasks effectively.',
      },
      {
        section: 'Behavioral & Communication',
        text: 'Displayed a positive attitude, adaptability, and professionalism. Showed willingness to learn and collaborate within a team. Communicated ideas clearly and confidently. Demonstrated good listening skills and the ability to explain technical concepts effectively.',
      },
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
          Interview Results
        </h3>
        <p style={{ fontSize: '14px', color: colors.textMuted, margin: '0 0 20px 0' }}>
          View your interview results below
        </p>

        <div style={{
          display: 'flex',
          gap: '24px',
          padding: '12px 0',
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: '20px',
        }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: '0 0 2px 0' }}>Status</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: 0 }}>{results.status}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: '0 0 2px 0' }}>Date</p>
            <p style={{ fontSize: '14px', color: colors.textDark, margin: 0 }}>{results.date}</p>
          </div>
        </div>

        {/* Scores */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: '0 0 12px 0' }}>
            Scores
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {results.scores.map((item, idx) => (
              <div key={idx} style={{
                background: colors.lightTeal,
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: colors.primary }}>{item.score}</div>
                <div style={{ fontSize: '12px', color: colors.textGray }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interviewer Notes */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: '0 0 12px 0' }}>
            Interviewer Notes
          </h4>
          {results.notes.map((note, idx) => (
            <div key={idx} style={{
              padding: '12px 16px',
              background: '#f8f9fa',
              borderRadius: '10px',
              marginBottom: '12px',
            }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, margin: '0 0 4px 0' }}>
                {note.section}
              </p>
              <p style={{ fontSize: '13px', color: colors.textGray, margin: 0, lineHeight: 1.6 }}>
                {note.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}