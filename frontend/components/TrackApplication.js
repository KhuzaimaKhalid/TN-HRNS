import { useState } from 'react';
import { useRouter } from 'next/router';

export default function TrackApplication({ candidate }) {
  const router = useRouter();

  // If no candidate prop provided, use mock data for demo
  const defaultCandidate = {
    name: 'Ayesha Khan',
    role: 'AI Engineer Intern',
    appliedDate: '2nd June 2026',
    statuses: [
      { stage: 'Submitted', date: '02 Jun 2026', description: 'Application received' },
      { stage: 'Under Review', date: '06 Jun 2026', description: 'Your profile is being reviewed' },
      { stage: 'Interview Scheduled', date: '10 Jun 2026', description: 'Interview scheduled for 18 Jun' },
      { stage: 'Selected', date: null, description: 'Decision pending' },
    ],
    interview: {
      date: '18 Jun 2026',
      day: 'Tuesday',
      time: '04:00 PM',
      meetLink: 'https://meet.google.com/abc-tgibc-nwl',
    },
    finalStatus: 'Interview Scheduled', // one of: Submitted, Under Review, Interview Scheduled, Selected, Rejected
  };

  const data = candidate || defaultCandidate;

  const [email, setEmail] = useState('');
  const [tracked, setTracked] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (email) {
      setTracked(true);
    }
  };

  const getStageClass = (stage, currentStatus) => {
    const stages = ['Submitted', 'Under Review', 'Interview Scheduled', 'Selected', 'Rejected'];
    const currentIndex = stages.indexOf(currentStatus);
    const stageIndex = stages.indexOf(stage);
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return '';
  };

  return (
    <div className="auth-card track-card">
      <button className="auth-close" onClick={() => router.push('/')}>
        <i className="fas fa-times"></i>
      </button>

      <div className="track-header">
        <h1 className="auth-welcome" style={{ fontSize: '1.5rem' }}>Track your application</h1>
        <div className="track-actions">
          <button className="btn-apply" onClick={() => router.push('/apply')}>Apply now</button>
          <button className="btn-apply" style={{ background: 'var(--primary)', color: 'var(--white)' }}>Track application</button>
        </div>
      </div>
      <p className="auth-subtitle">Enter the email you applied with to track your application status.</p>

      <form onSubmit={handleTrack}>
        <div className="track-search">
          <input
            type="email"
            className="auth-input"
            placeholder="ayeshaharsh@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px', padding: '13px 28px' }}>
            Track your application
          </button>
        </div>
      </form>

      {tracked && (
        <div className="track-result">
          <div className="candidate-header">
            <div>
              <div className="candidate-name">{data.name} - {data.role}</div>
              <div className="applied-date"><i className="far fa-calendar-alt" style={{ marginRight: '4px' }}></i>Applied on {data.appliedDate}</div>
            </div>
            <button className="btn-apply" style={{ background: 'transparent', border: '1px solid var(--border-color)' }} onClick={() => setTracked(false)}>
              <i className="fas fa-redo"></i> Reset
            </button>
          </div>

          {/* Show interview info if status is Interview Scheduled */}
          {data.finalStatus === 'Interview Scheduled' && data.interview && (
            <div className="interview-info-card">
              <h4><i className="fas fa-video" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Interview Information</h4>
              <p><strong>Your interview is scheduled for</strong></p>
              <div className="interview-details">
                <div><strong>Date:</strong> {data.interview.date}</div>
                <div><strong>Day:</strong> {data.interview.day}</div>
                <div><strong>Time:</strong> {data.interview.time}</div>
              </div>
              <button className="interview-add-btn" onClick={() => router.push('/interview')}>
                <i className="fas fa-plus-circle" style={{ marginRight: '6px' }}></i> View full interview details
              </button>
            </div>
          )}

          {/* Timeline */}
          <div className="timeline">
            {data.statuses.map((item, index) => {
              const stageClass = getStageClass(item.stage, data.finalStatus);
              return (
                <div key={index} className={`timeline-item ${stageClass}`}>
                  <div className="tl-title">{item.stage}</div>
                  <div className="tl-date">{item.date || 'Pending'}</div>
                  <div className="tl-desc">{item.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}