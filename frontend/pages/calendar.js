// pages/calendar.js
import { useState, useEffect } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import ScheduleInterviewModal from '@/components/common/ScheduleInterviewModal';
import { applicationAPI, interviewAPI } from '@/services/api';

export default function Calendar() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  // 👈 Added dynamic state for your live interviews array
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await interviewAPI.getCandidates();
        setCandidates(response.candidates || []);
      } catch (error) {
        console.error("Failed to fetch candidates for dropdown:", error);
      }
    };

    fetchCandidates();
  }, []);



  // 👈 Added function to fetch live data from Express backend
  const fetchUpcomingInterviews = async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getUpcoming();
      if (response.status === 'success' || response.interviews) {
        // Fallback checks depending on whether your controller responds with response.interviews or response.data
        setInterviews(response.interviews || response.data || []);
      }
    } catch (error) {
      console.error('Error fetching upcoming interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // 👈 Load live data on component mount
  useEffect(() => {
    fetchUpcomingInterviews();
  }, []);

  const handleSchedule = async (data) => {
    const selected = candidates[Number(data.candidate)];
    const realId = selected?.candidate_id;
  
    if (!realId) {
      alert('Could not resolve candidate ID — check API response shape.');
      return;
    }
  
    const payload = {
      candidateId: realId,
      scheduledDate: data.date,
      scheduledTime: data.time.length === 5 ? `${data.time}:00` : data.time,
      interviewType: data.mode,
      location: data.mode === 'In person' ? 'Main Office' : 'Remote',
      meetingLink: data.mode === 'Video call' ? 'https://meet.google.com/abc-demo' : null,
      interviewer: data.interviewer || null,
    };
  
    try {
      const resData = await interviewAPI.schedule(payload);
  
      if (resData.status === 'success') {
        alert('Interview scheduled successfully!');
        setShowScheduleModal(false);
        fetchUpcomingInterviews();
      } else {
        alert(`Failed to schedule: ${resData.message}`);
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Something went wrong.');
    }
  };
  // Helper formatting for your SQL date output strings
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    bg: '#effbfb',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  return (
    <HRLayout>
      <HRPageLayout title="Calendar">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Calendar Grid */}
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, marginBottom: '16px' }}>June 2026</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ fontWeight: 600, color: colors.textGray, padding: '8px 0' }}>{day}</div>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                <div key={day} style={{
                  padding: '8px 0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: day === 25 ? colors.lightTeal : 'transparent',
                  fontWeight: day === 25 ? 600 : 400,
                  color: colors.textDark,
                }}>
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, marginBottom: '16px' }}>Upcoming Interviews</h2>

            {loading ? (
              <p style={{ color: colors.textGray, fontSize: '14px' }}>Loading interviews...</p>
            ) : interviews.length === 0 ? (
              <p style={{ color: colors.textGray, fontSize: '14px' }}>No upcoming interviews found.</p>
            ) : (
              interviews.map((item, idx) => (
                <div key={idx} style={{ padding: '12px 0', borderBottom: idx < interviews.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {/* Displays the candidate name returned from your JOIN statement query */}
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: colors.textDark }}>{item.name}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.textGray }}>{item.applied_position || item.interview_type}</p>
                      {/* 👈 Dynamic UI showing the database interviewer you just assigned via Postman! */}
                      {item.interviewer && (
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: colors.primary, fontWeight: 500 }}>
                          Interviewer: {item.interviewer}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.primary }}>
                        {formatDate(item.scheduled_date)}
                      </span>
                      <span style={{ fontSize: '12px', color: colors.textGray }}>{item.scheduled_time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div style={{ marginTop: '16px' }}>
              <button
                style={{
                  background: colors.primary,
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  width: '100%',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                }}
                onClick={() => setShowScheduleModal(true)}
              >
                Schedule New Interview
              </button>
            </div>
          </div>
        </div>

        {/* ─── Schedule Interview Modal ─── */}
        <ScheduleInterviewModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleSchedule}
          candidates={candidates}
        />
      </HRPageLayout>
    </HRLayout>
  );
}