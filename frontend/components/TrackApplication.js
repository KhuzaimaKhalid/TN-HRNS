import { useState } from 'react';
import { useRouter } from 'next/router';

export default function TrackApplication({ onClose, onNavigate }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [tracked, setTracked] = useState(false);
  const [status, setStatus] = useState('submitted');
  const [showInterview, setShowInterview] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (email) {
      setTracked(true);
      const statuses = ['submitted', 'shortlisted', 'interview', 'selected', 'rejected'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setStatus(randomStatus);
      setShowInterview(randomStatus === 'interview');
    }
  };

  const handleReset = () => {
    setTracked(false);
    setEmail('');
    setShowInterview(false);
  };

  const statusData = {
    submitted: { title: 'Application submitted', date: '02 Jul 2026', desc: 'Application received and under review' },
    shortlisted: { title: 'Shortlisted', date: '06 Jun 2026', desc: 'Your profile matches our matching criteria' },
    interview: { title: 'Interview', date: '18 Jun 2026', desc: 'Interview scheduled' },
    selected: { title: 'Selected', date: '26 Jun 2026', desc: 'Congratulations! You have been selected for the position.' },
    rejected: { title: 'Rejected', date: '18 Jun 2026', desc: 'Thank you for your interest. We have decided to proceed with other candidates.' }
  };

  const getStatuses = () => {
    const allStatuses = ['submitted', 'shortlisted', 'interview', 'selected'];
    if (status === 'rejected') return ['submitted', 'shortlisted', 'rejected'];
    const idx = allStatuses.indexOf(status);
    return allStatuses.slice(0, idx + 1);
  };

  const getStatusClass = (s) => {
    if (status === 'rejected') {
      if (s === 'rejected') return 'active';
      if (s === 'submitted' || s === 'shortlisted') return 'completed';
      return '';
    }
    const all = ['submitted', 'shortlisted', 'interview', 'selected'];
    const idx = all.indexOf(s);
    const currentIdx = all.indexOf(status);
    if (idx < currentIdx) return 'completed';
    if (idx === currentIdx) return 'active';
    return '';
  };

  return (
    <div className="auth-card track-card" onClick={(e) => e.stopPropagation()}>
      <button className="auth-close" onClick={() => onClose ? onClose() : router.push('/')}>
        <i className="fas fa-times"></i>
      </button>

      <div className="track-header">
        <h1 className="auth-welcome" style={{ fontSize: '1.5rem' }}>Track your application</h1>
        <div className="track-actions">
          <button 
            className="btn-apply" 
            onClick={() => onNavigate ? onNavigate('apply') : router.push('/apply')}
          >
            Apply now
          </button>
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
              <div className="candidate-name">Ayesha Khan - AI Engineer Intern</div>
              <div className="applied-date"><i className="far fa-calendar-alt" style={{ marginRight: '4px' }}></i>Applied on 2nd June 2025</div>
            </div>
            <button className="btn-apply" style={{ background: 'transparent', border: '1px solid var(--border-color)' }} onClick={handleReset}>
              <i className="fas fa-redo"></i> Reset
            </button>
          </div>

          {showInterview && (
            <div className="interview-info-card">
              <h4><i className="fas fa-video" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Interview Information</h4>
              <p><strong>Your interview is scheduled for</strong></p>
              <div className="interview-details">
                <div><strong>Date:</strong> 18 Jun 2025</div>
                <div><strong>Day:</strong> Tuesday</div>
                <div><strong>Time:</strong> 04 - 08 pm</div>
              </div>
              <button className="interview-add-btn">
                <i className="fas fa-plus-circle" style={{ marginRight: '6px' }}></i> Add your interview using the group chat in the below
              </button>
            </div>
          )}

          <div className="timeline">
            {getStatuses().map((s) => {
              const data = statusData[s];
              if (!data) return null;
              const cls = getStatusClass(s);
              return (
                <div key={s} className={`timeline-item ${cls}`}>
                  <div className="tl-title">{data.title}</div>
                  <div className="tl-date">{data.date}</div>
                  <div className="tl-desc">{data.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}