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

  const interview = {
    title: 'Technical Interview',
    description: 'Please join via the link below at the scheduled time.',
    date: 'Friday, 12 Jun 2026',
    time: '10:00 AM – 11:00 AM',
    interviewer: 'xyz, HR',
    meetLink: 'https://meet.google.com/cyd-faee-mku',
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
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, margin: '0 0 8px 0' }}>
          {interview.title}
        </h3>
        <p style={{ fontSize: '14px', color: colors.textMuted, margin: '0 0 20px 0' }}>
          {interview.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: '0 0 2px 0' }}>Date</p>
            <p style={{ fontSize: '14px', color: colors.textDark, margin: 0 }}>{interview.date}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: '0 0 2px 0' }}>Time</p>
            <p style={{ fontSize: '14px', color: colors.textDark, margin: 0 }}>{interview.time}</p>
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
            fontFamily: "'Poppins', sans-serif",
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#046466')}
          onMouseLeave={(e) => (e.currentTarget.style.background = colors.primary)}
        >
          Join
        </button>
      </div>
    </div>
  );
}