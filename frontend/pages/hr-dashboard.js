import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import { hrAPI } from '@/services/api';

// Backend returns SQL TIME as "14:00:00" — convert to "02:00 PM"
function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(displayHour).padStart(2, '0')}:${minuteStr} ${period}`;
}

export default function HRDashboard() {
  const router = useRouter();

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await hrAPI.getDashboardMetrics();
        if (isMounted) {
          if (res.success) {
            setMetrics(res.data);
            setError(null);
          } else {
            setError(res.message || 'Failed to load dashboard data');
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load dashboard data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMetrics();
    return () => { isMounted = false; };
  }, []);

  const stats = metrics?.stats;
  const todaysInterviews = metrics?.todaysInterviews || [];
  const pipelineBreakdown = metrics?.pipelineBreakdown || {};
  const pendingLeaveList = metrics?.pendingLeaveList || [];
  const recentActivities = metrics?.recentActivities || [];

  const colors = {
    primary: '#007A7C',
    lightTeal: '#E8F5F5',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    cardBg: '#FFFFFF',
    greenIcon: '#2F8A4B',
  };

  const cardStyle = {
    background: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderRadius: '16px',
    padding: 'clamp(16px, 2.5vw, 24px)',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    width: '100%',
    boxSizing: 'border-box'
  };

  const statCardStyle = {
    background: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: 'clamp(12px, 1.5vw, 24px) 12px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    minWidth: '80px'
  };

  const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'clamp(10px, 1.5vw, 16px) 0',
    borderBottom: `1px solid ${colors.border}`,
    flexWrap: 'wrap',
    gap: '8px'
  };

  const linkActionStyle = {
    color: colors.primary,
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap'
  };

  return (
    <HRLayout>
      <HRPageLayout title="Dashboard">
        {/* ─── Top Stats Row ─── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'clamp(12px, 2vw, 20px)',
          marginBottom: '30px'
        }}>
          {[
            { icon: 'fa-briefcase', num: loading ? '—' : (stats?.openPositions ?? 0), label: 'Open positions' },
            { icon: 'fa-user-plus', num: loading ? '—' : (stats?.pipelineTotal ?? 0), label: 'Candidates in pipeline' },
            { icon: 'fa-clock', num: loading ? '—' : (stats?.pendingLeaves ?? 0), label: 'Leave request pending' },
            { icon: 'fa-calendar-check', num: loading ? '—' : (stats?.interviewsThisWeek ?? 0), label: 'Interviews this week' },
            { icon: 'fa-project-diagram', num: loading ? '—' : (stats?.activeProjects ?? 0), label: 'Active projects' }
          ].map((stat, idx) => (
            <div key={idx} style={statCardStyle}>
              <div style={{ color: colors.primary, fontSize: 'clamp(18px, 2vw, 20px)', marginBottom: '8px', background: colors.lightTeal, width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 700, color: colors.textDark, lineHeight: 1.2 }}>{stat.num}</div>
              <div style={{ fontSize: 'clamp(10px, 1.2vw, 12px)', color: colors.textGray, marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Recruitment Pipeline ─── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 600, margin: 0, color: colors.textDark }}>Recruitment pipeline</h2>
            <a href="#" style={linkActionStyle}>View all candidates <i className="fas fa-arrow-right"></i></a>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'clamp(8px, 1.5vw, 16px)',
            position: 'relative',
            marginTop: 'clamp(20px, 3vw, 40px)',
            padding: '0 10px'
          }}>
            <div style={{ position: 'absolute', top: '10px', left: '30px', right: '30px', height: '2px', backgroundColor: colors.primary, zIndex: 1 }}></div>
            
            {[
              { num: loading ? '—' : (pipelineBreakdown.applied ?? 0), text: 'Applied' },
              { num: loading ? '—' : (pipelineBreakdown.taskSubmitted ?? 0), text: 'Task submitted' },
              { num: loading ? '—' : (pipelineBreakdown.interviewScheduled ?? 0), text: 'Interview scheduled' },
              { num: loading ? '—' : (pipelineBreakdown.interviewed ?? 0), text: 'Interviewed' },
              { num: loading ? '—' : (pipelineBreakdown.selected ?? 0), text: 'Selected' },
              { num: loading ? '—' : (pipelineBreakdown.onboarded ?? 0), text: 'Onboarded' }
            ].map((step, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
                background: colors.cardBg,
                padding: '0 6px',
                flex: '0 1 auto',
                minWidth: '50px'
              }}>
                <div style={{ width: 'clamp(16px, 2vw, 20px)', height: 'clamp(16px, 2vw, 20px)', borderRadius: '50%', border: `3px solid ${colors.primary}`, background: 'white', marginBottom: '8px' }}></div>
                <div style={{ fontSize: 'clamp(18px, 2vw, 22px)', fontWeight: 700, color: colors.textDark }}>{step.num}</div>
                <div style={{ fontSize: 'clamp(10px, 1vw, 12px)', color: colors.textGray, marginTop: '2px', textAlign: 'center' }}>{step.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bottom Grid ─── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(16px, 2vw, 24px)'
        }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 600, margin: 0, color: colors.textDark }}>Today's Interviews</h2>
                  <p style={{ fontSize: '13px', color: colors.textGray, margin: '4px 0 0 0' }}>Wed, 25 Jun</p>
                </div>
                <a href="#" style={linkActionStyle}>Open calendar <i className="fas fa-arrow-right"></i></a>
              </div>
              
              {loading ? (
                <p style={{ fontSize: '13px', color: colors.textGray, padding: '12px 0' }}>Loading interviews…</p>
              ) : error ? (
                <p style={{ fontSize: '13px', color: '#c0392b', padding: '12px 0' }}>Could not load interviews.</p>
              ) : todaysInterviews.length === 0 ? (
                <p style={{ fontSize: '13px', color: colors.textGray, padding: '12px 0' }}>No interviews scheduled today.</p>
              ) : (
                todaysInterviews.map((candidate, idx) => (
                  <div key={candidate.interview_id ?? idx} style={listItemStyle}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 'clamp(14px, 1.5vw, 15px)', fontWeight: 500, color: colors.textDark, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        {candidate.name}
                        <span style={{ background: colors.lightTeal, color: colors.primary, fontSize: '11px', padding: '2px 8px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          <i className="fas fa-circle" style={{ fontSize: '6px' }}></i> {formatTime(candidate.time)}
                        </span>
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: colors.textGray }}>{candidate.role}</p>
                    </div>
                    <button style={{ background: 'transparent', border: `1px solid ${colors.border}`, padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: colors.textDark, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}>View</button>
                  </div>
                ))
              )}
            </div>

            {/* ─── Dynamic Recent Activities ─── */}
            <div style={{ ...cardStyle, marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h2 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 600, margin: 0, color: colors.textDark }}>Recent activities</h2>
              </div>
              
              {loading ? (
                <p style={{ fontSize: '13px', color: colors.textGray, padding: '12px 0' }}>Loading activities…</p>
              ) : recentActivities.length === 0 ? (
                <p style={{ fontSize: '13px', color: colors.textGray, padding: '12px 0' }}>No recent activities logged.</p>
              ) : (
                recentActivities.map((activity, idx) => (
                  <div key={activity.id ?? idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px 0', borderBottom: idx === recentActivities.length - 1 ? 'none' : `1px solid ${colors.border}` }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: colors.primary, borderRadius: '50%', marginTop: '6px', flexShrink: 0 }}></div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 500, color: colors.textDark }}>{activity.title}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: colors.textGray }}>{activity.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          {/* ─── Dynamic Pending Leave Approvals ─── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 600, margin: 0, color: colors.textDark }}>Pending leave approvals</h2>
                <a href="#" style={linkActionStyle}>View all <i className="fas fa-arrow-right"></i></a>
              </div>
              
              {loading ? (
                <p style={{ fontSize: '13px', color: colors.textGray, padding: '12px 0' }}>Loading leaves…</p>
              ) : pendingLeaveList.length === 0 ? (
                <p style={{ fontSize: '13px', color: colors.textGray, padding: '12px 0' }}>No pending leave approvals found.</p>
              ) : (
                pendingLeaveList.map((leave, idx) => (
                  <div key={leave.id ?? idx} style={listItemStyle}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 500, color: colors.textDark }}>{leave.name}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: colors.textGray }}>{leave.desc}</p>
                    </div>
                    <button style={{ background: 'transparent', border: `1px solid ${colors.border}`, padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: colors.textDark, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}>View</button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </HRPageLayout>
    </HRLayout>
  );
}