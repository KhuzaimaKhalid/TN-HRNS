// components/tracker/TrackTimeline.js
export default function TrackTimeline({ candidate, onViewTask, onViewSubmission, onViewInterview, onViewResults, onBack }) {
  const colors = {
    primary: '#007A7C',
    primaryLight: '#E8F5F5',
    border: '#e3e8ea',
    borderDark: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    success: '#2F8A4B',
    warning: '#d4a017',
    danger: '#dc3545',
    cardBg: '#FFFFFF',
  };

  const stages = [
    {
      key: 'submitted',
      label: 'Application Submitted',
      date: candidate?.submittedDate || '02 Jun 2026',
      status: 'completed',
    },
    {
      key: 'task_assigned',
      label: 'Task Assigned',
      date: candidate?.taskAssignedDate || '05 Jun 2026',
      status: candidate?.taskAssigned ? 'completed' : 'pending',
      action: 'View Task',
      onAction: onViewTask,
    },
    {
      key: 'task_submitted',
      label: 'Task Submitted',
      date: candidate?.taskSubmittedDate || '08 Jun 2026',
      status: candidate?.taskSubmitted ? 'completed' : 'pending',
      action: candidate?.taskSubmitted ? 'View Submission' : null,
      onAction: candidate?.taskSubmitted ? onViewSubmission : null,
    },
    {
      key: 'interview_scheduled',
      label: 'Interview Scheduled',
      date: candidate?.interviewDate || '12 Jun 2026, 10:00 AM',
      status: candidate?.interviewScheduled ? 'completed' : 'pending',
      action: candidate?.interviewScheduled ? 'View Interview details' : null,
      onAction: candidate?.interviewScheduled ? onViewInterview : null,
    },
    {
      key: 'interview_cleared',
      label: 'Interview Cleared',
      date: candidate?.interviewClearedDate || '15 Jun 2026',
      status: candidate?.interviewCleared ? 'completed' : 'pending',
      action: candidate?.interviewCleared ? 'View interview results' : null,
      onAction: candidate?.interviewCleared ? onViewResults : null,
    },
    {
      key: 'final_decision',
      label: 'Final Decision',
      date: candidate?.decisionDate || null,
      status: candidate?.decision || 'pending',
      decision: candidate?.decision || null,
      reason: candidate?.decisionReason || null,
    },
  ];

  const getStatusIcon = (status) => {
    if (status === 'completed') return { icon: 'fas fa-check-circle', color: colors.success };
    if (status === 'pending') return { icon: 'fas fa-circle', color: '#e9ecef' };
    if (status === 'Selected') return { icon: 'fas fa-check-circle', color: colors.success };
    if (status === 'Rejected') return { icon: 'fas fa-times-circle', color: colors.danger };
    if (status === 'Waiting list') return { icon: 'fas fa-clock', color: colors.warning };
    return { icon: 'fas fa-circle', color: '#e9ecef' };
  };

  const getDecisionBadge = (decision) => {
    if (decision === 'Selected') return { bg: colors.success, color: '#fff', label: 'Selected' };
    if (decision === 'Rejected') return { bg: colors.danger, color: '#fff', label: 'Rejected' };
    if (decision === 'Waiting list') return { bg: colors.warning, color: '#fff', label: 'Waiting list' };
    return null;
  };

  const decisionBadge = getDecisionBadge(candidate?.decision);

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      {/* Back Button */}
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
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>

      {/* ─── Header ─── */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '28px',          // ✅ bigger
          fontWeight: 700,
          color: colors.textDark,
          margin: 0,
        }}>
          Track your application
        </h1>
        <p style={{
          fontSize: '14px',
          color: colors.textDark,     // ✅ darker (was textMuted)
          margin: '4px 0 0 0',
        }}>
          Your progress and next steps in the recruitment process.
        </p>
      </div>

      {/* ─── Card ─── */}
      <div style={{
        background: colors.cardBg,
        border: `1px solid ${colors.borderDark}`,
        borderRadius: '16px',
        padding: '24px 24px 18px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      }}>
        {/* Candidate Info */}
        <div style={{
          borderBottom: `1px solid ${colors.border}`,
          paddingBottom: '12px',
          marginBottom: '16px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: colors.textDark, margin: 0 }}>
            {candidate?.name || 'Ayesha Khan'} – {candidate?.role || 'AI Engineer Intern'}
          </h2>
          <p style={{ fontSize: '13px', color: colors.textGray, margin: '2px 0 0 0' }}>
            <i className="far fa-calendar-alt" style={{ marginRight: '6px' }}></i>
            Applied on {candidate?.appliedDate || '2nd June 2026'}
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {stages.map((stage, index) => {
            const isLast = index === stages.length - 1;
            const isCompleted = stage.status === 'completed';
            const statusIcon = getStatusIcon(stage.status);

            return (
              <div
                key={stage.key}
                style={{
                  position: 'relative',
                  paddingBottom: isLast ? '0' : '16px',
                  paddingLeft: '28px',
                }}
              >
                {/* Vertical Line */}
                {!isLast && (
                  <div style={{
                    position: 'absolute',
                    left: '8px',
                    top: '20px',
                    bottom: '0',
                    width: '2px',
                    background: isCompleted ? colors.primary : '#e9ecef',
                  }}></div>
                )}

                {/* Status Icon */}
                <div style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isCompleted ? colors.primary : '#ffffff',
                  border: `2px solid ${isCompleted ? colors.primary : colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: isCompleted ? '#ffffff' : statusIcon.color,
                }}>
                  <i className={statusIcon.icon}></i>
                </div>

                {/* Content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: colors.textDark,
                    }}>
                      {stage.label}
                    </span>
                    {stage.key === 'final_decision' && decisionBadge && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        background: decisionBadge.bg,
                        color: decisionBadge.color,
                        padding: '2px 12px',
                        borderRadius: '12px',
                      }}>
                        {decisionBadge.label}
                      </span>
                    )}
                    {stage.key === 'final_decision' && !candidate?.decision && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#856404',
                        background: '#fff3cd',
                        padding: '2px 10px',
                        borderRadius: '10px',
                      }}>
                        Pending
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '12.5px',
                    color: colors.textGray,
                    marginTop: '1px',
                  }}>
                    {stage.date || '—'}
                  </div>
                  {stage.action && stage.onAction && (
                    <button
                      onClick={stage.onAction}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.primary,
                        cursor: 'pointer',
                        fontSize: '12.5px',
                        fontWeight: 500,
                        fontFamily: "'Poppins', sans-serif",
                        padding: '2px 0 4px 0',
                        marginTop: '2px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#046466')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = colors.primary)}
                    >
                      {stage.action} <i className="fas fa-arrow-right" style={{ fontSize: '10px' }}></i>
                    </button>
                  )}
                  {stage.key === 'final_decision' && stage.reason && (
                    <p style={{
                      fontSize: '12.5px',
                      color: colors.textGray,
                      margin: '4px 0 0 0',
                      lineHeight: 1.5,
                      background: '#f8f9fa',
                      padding: '8px 12px',
                      borderRadius: '8px',
                    }}>
                      {stage.reason}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}