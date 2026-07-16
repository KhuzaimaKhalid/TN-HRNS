// components/tracker/InterviewScheduleView.js
export default function InterviewScheduleView({ candidate, onBack }) {
  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  // Safe mapping of real backend interview keys
  const interview = {
    title: candidate?.interview?.title || 'Technical Interview',
    description: candidate?.interview?.notes || 'Please join via the link below at the scheduled time.',
    date: candidate?.interview?.date 
      ? new Date(candidate.interview.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
      : 'Date to be announced',
    time: candidate?.interview?.time || 'Scheduled Time',
    interviewer: candidate?.interview?.interviewer || 'HR Team',
    meetLink: candidate?.interview?.meetLink || 'https://meet.google.com',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: colors.lightTeal, borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-calendar-alt" style={{ color: colors.primary, fontSize: '20px' }}></i>
          </div>
          <div>
            <h3 style={{ margin: '0', fontSize: '18px', fontWeight: 700, color: colors.textDark }}>
              {interview.title}
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: colors.textGray }}>
              {interview.description}
            </p>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, margin: '20px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: '0 0 2px 0' }}>Date</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: 0 }}>{interview.date}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: '0 0 2px 0' }}>Time</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, margin: 0 }}>{interview.time}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: '0 0 2px 0' }}>Interviewer</p>
            <p style={{ fontSize: '14px', color: colors.textDark, margin: 0 }}>{interview.interviewer}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: '0 0 2px 0' }}>Meeting Link</p>
            <a
              href={interview.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '13px',
                color: colors.primary,
                textDecoration: 'none',
                wordBreak: 'break-all',
              }}
            >
              {interview.meetLink}
            </a>
          </div>
        </div>

        <button
          onClick={() => window.open(interview.meetLink, '_blank')}
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
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#046466')}
          onMouseLeave={(e) => (e.currentTarget.style.background = colors.primary)}
        >
          Join Interview Meeting
        </button>
      </div>
    </div>
  );
}