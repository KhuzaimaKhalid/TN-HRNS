// components/tracker/FinalDecisionView.js
export default function FinalDecisionView({ candidate, onBack }) {
  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  const decision = candidate?.decision || 'Selected';
  const reason = candidate?.decisionReason || null;

  const getDecisionStyle = (dec) => {
    if (dec === 'Selected') return { bg: '#d4edda', color: '#1e7e34', icon: 'fa-check-circle', label: 'Selected' };
    if (dec === 'Rejected') return { bg: '#f8d7da', color: '#c0392b', icon: 'fa-times-circle', label: 'Rejected' };
    if (dec === 'Waiting list') return { bg: '#fff3cd', color: '#856404', icon: 'fa-clock', label: 'Waiting list' };
    return { bg: '#e9ecef', color: '#495057', icon: 'fa-circle', label: 'Pending' };
  };

  const style = getDecisionStyle(decision);

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
        padding: '32px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: style.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <i className={`fas ${style.icon}`} style={{ fontSize: '36px', color: style.color }}></i>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: style.color, margin: '0' }}>
          {style.label}
        </h2>
        {reason && (
          <p style={{
            fontSize: '14px',
            color: colors.textGray,
            lineHeight: 1.6,
            maxWidth: '500px',
            margin: '12px auto 0',
          }}>
            {reason}
          </p>
        )}
        {decision === 'Selected' && (
          <p style={{
            fontSize: '14px',
            color: colors.textGray,
            marginTop: '12px',
          }}>
            🎉 Congratulations! We are pleased to inform you that you have been selected for the position.
          </p>
        )}
        {decision === 'Waiting list' && (
          <p style={{
            fontSize: '14px',
            color: colors.textGray,
            marginTop: '12px',
          }}>
            You have been placed on the waiting list. We will notify you if a position becomes available.
          </p>
        )}
        {decision === 'Rejected' && (
          <p style={{
            fontSize: '14px',
            color: colors.textGray,
            marginTop: '12px',
          }}>
            We appreciate your interest but we regret to inform you that we have decided to move forward with other candidates.
          </p>
        )}
      </div>
    </div>
  );
}