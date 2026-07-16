// components/tracker/InterviewResultsView.js
export default function InterviewResultsView({ candidate, onBack }) {
  const colors = {
    primary: '#007A7C',
    border: '#e3e8ea',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  // Map scores dynamically from backend candidate record or provide structured fallbacks
  const results = {
    status: candidate?.interviewResults?.status || 'Evaluated',
    date: candidate?.interviewResults?.date 
      ? new Date(candidate.interviewResults.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Evaluated recently',
    scores: candidate?.interviewResults?.scores || [
      { label: 'Technical Assessment', score: candidate?.interviewResults?.techScore || 'Pending/10' },
      { label: 'Problem Solving', score: candidate?.interviewResults?.problemSolvingScore || 'Pending/10' },
      { label: 'Communication', score: candidate?.interviewResults?.communicationScore || 'Pending/10' },
    ],
    notes: candidate?.interviewResults?.notes || [
      {
        section: 'General Assessment Summary',
        text: candidate?.interviewResults?.summary || 'Evaluation details are under internal processing.',
      }
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
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '20px'
        }}
      >
        <i className="fas fa-arrow-left"></i> Back to Timeline
      </button>

      <div style={{ background: colors.cardBg, borderRadius: '12px', padding: '24px', border: `1px solid ${colors.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: '0', fontSize: '18px', fontWeight: 700, color: colors.textDark }}>
              Interview Performance Results
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: colors.textMuted }}>
              Evaluated on {results.date}
            </p>
          </div>
          <span style={{
            background: '#d4edda',
            color: '#155724',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600
          }}>
            {results.status}
          </span>
        </div>

        {/* Scores Panel */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: '0 0 12px 0' }}>
            Score Breakdowns
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {results.scores.map((item, idx) => (
              <div key={idx} style={{
                background: colors.lightTeal,
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: colors.primary }}>{item.score}</div>
                <div style={{ fontSize: '12px', color: colors.textGray }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Panel */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: '0 0 12px 0' }}>
            Evaluator Notes & Feedback
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
              <p style={{ fontSize: '13px', color: colors.textGray, margin: 0, lineHeight: 1.5 }}>
                {note.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}