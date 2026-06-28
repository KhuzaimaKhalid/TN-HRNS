import { useRouter } from 'next/router';

export default function InterviewDetails({ interview }) {
  const router = useRouter();

  // Mock data if not provided
  const defaultInterview = {
    date: '18 Jun 2026',
    day: 'Tuesday',
    time: '04:00 PM - 05:00 PM',
    meetLink: 'https://meet.google.com/abc-tgibc-nwl',
    interviewer: 'Mr. Ahmad',
    notes: 'Please have your portfolio ready.',
  };

  const data = interview || defaultInterview;

  return (
    <div className="auth-card track-card">
      <button className="auth-close" onClick={() => router.push('/track')}>
        <i className="fas fa-times"></i>
      </button>

      <h1 className="auth-welcome" style={{ fontSize: '1.5rem' }}>Interview Details</h1>
      <p className="auth-subtitle">Here are the details of your upcoming interview.</p>

      <div className="interview-details-card">
        <div className="interview-detail-row">
          <span className="detail-label">Date</span>
          <span className="detail-value">{data.date}</span>
        </div>
        <div className="interview-detail-row">
          <span className="detail-label">Day</span>
          <span className="detail-value">{data.day}</span>
        </div>
        <div className="interview-detail-row">
          <span className="detail-label">Time</span>
          <span className="detail-value">{data.time}</span>
        </div>
        <div className="interview-detail-row">
          <span className="detail-label">Interviewer</span>
          <span className="detail-value">{data.interviewer}</span>
        </div>
        <div className="interview-detail-row">
          <span className="detail-label">Meeting Link</span>
          <span className="detail-value">
            <a href={data.meetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
              {data.meetLink}
            </a>
          </span>
        </div>
        {data.notes && (
          <div className="interview-detail-row">
            <span className="detail-label">Additional Notes</span>
            <span className="detail-value">{data.notes}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => router.push('/track')}>
          <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Back to Status
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => window.open(data.meetLink, '_blank')}>
          <i className="fas fa-external-link-alt" style={{ marginRight: '8px' }}></i> Join Interview
        </button>
      </div>
    </div>
  );
}