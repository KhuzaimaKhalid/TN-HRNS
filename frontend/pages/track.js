import { useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer';
import {
  TrackTimeline,
  TaskDetailView,
  SubmissionView,
  InterviewScheduleView,
  InterviewResultsView,
  FinalDecisionView,
} from '@/components/tracker';

export default function Track() {
  const router = useRouter();
  const [view, setView] = useState('timeline');
  const [email, setEmail] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [candidate] = useState({
    name: 'Ayesha Khan',
    role: 'AI Engineer Intern',
    appliedDate: '2nd June 2026',
    submittedDate: '02 Jun 2026',
    taskAssignedDate: '05 Jun 2026',
    taskAssigned: true,
    taskSubmittedDate: '08 Jun 2026',
    taskSubmitted: true,
    interviewDate: '12 Jun 2026, 10:00 AM',
    interviewScheduled: true,
    interviewClearedDate: '15 Jun 2026',
    interviewCleared: true,
    decision: 'Selected',
    decisionReason: null,
  });

  const handleTrack = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setIsSearched(true);
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setIsSearched(false);
    setEmail('');
    setView('timeline');
  };

  const renderView = () => {
    switch (view) {
      case 'timeline':
        return (
          <TrackTimeline
            candidate={candidate}
            onViewTask={() => setView('task')}
            onViewSubmission={() => setView('submission')}
            onViewInterview={() => setView('interview')}
            onViewResults={() => setView('results')}
            onBack={() => router.push('/dashboard')}
          />
        );
      case 'task':
        return (
          <TaskDetailView
            candidate={candidate}
            onBack={() => setView('timeline')}
            onSubmit={(data) => {
              console.log('Task submitted:', data);
              alert('Task submitted successfully!');
              setView('timeline');
            }}
          />
        );
      case 'submission':
        return <SubmissionView candidate={candidate} onBack={() => setView('timeline')} />;
      case 'interview':
        return <InterviewScheduleView candidate={candidate} onBack={() => setView('timeline')} />;
      case 'results':
        return <InterviewResultsView candidate={candidate} onBack={() => setView('timeline')} />;
      case 'decision':
        return <FinalDecisionView candidate={candidate} onBack={() => setView('timeline')} />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#effbfb',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        padding: '32px 24px 20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '780px',
        }}>
          {!isSearched ? (
            <div style={{
              maxWidth: '520px',
              margin: '60px auto',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '40px 36px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
              border: '1px solid #e0eae8',
            }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '4px' }}>
                Track your application
              </h1>
              <p style={{ fontSize: '14px', color: '#76777D', marginBottom: '24px' }}>
                Enter the email you applied with to track your application status.
              </p>
              <form onSubmit={handleTrack}>
                <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #dce5e4',
                      fontSize: '0.95rem',
                      fontFamily: "'Poppins', sans-serif",
                      background: '#fafcfa',
                      color: '#1A1A1A',
                      outline: 'none',
                      transition: 'border-color 0.25s ease',
                    }}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#00423D',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      fontFamily: "'Poppins', sans-serif",
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 4px 14px rgba(0,66,61,0.25)',
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Track your application'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {renderView()}
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  onClick={handleReset}
                  style={{
                    background: 'transparent',
                    border: '1px solid #dce5e4',
                    padding: '8px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    color: '#76777D',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f5f9f8'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <i className="fas fa-undo" style={{ marginRight: '6px' }}></i>
                  Search Another Email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}