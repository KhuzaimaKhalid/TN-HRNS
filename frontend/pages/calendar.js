// pages/calendar.js
import { useState, useEffect } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import ScheduleInterviewModal from '@/components/common/ScheduleInterviewModal';
import { applicationAPI, interviewAPI } from '@/services/api';

// ─── Mock data for testing ──────────────────────────────────────
const MOCK_INTERVIEWS = [
  {
    name: 'Sana Kareem',
    applied_position: 'UI/UX Designer',
    scheduled_date: '2026-06-25',
    scheduled_time: '14:00:00',
    interviewer: 'Ayesha I., Bilal R',
    interview_type: 'Video call',
  },
  {
    name: 'Hamza Khan',
    applied_position: 'Backend Dev',
    scheduled_date: '2026-06-25',
    scheduled_time: '16:30:00',
    interviewer: 'Bilal II',
    interview_type: 'In person',
  },
  {
    name: 'Talha Baig',
    applied_position: 'QA Engineer',
    scheduled_date: '2026-06-25',
    scheduled_time: '17:00:00',
    interviewer: 'Ayesha K',
    interview_type: 'Video call',
  },
  {
    name: 'Rabia Ali',
    applied_position: 'Frontend Dev Intern',
    scheduled_date: '2026-06-26',
    scheduled_time: '10:00:00',
    interviewer: 'Sara M.',
    interview_type: 'Video call',
  },
  {
    name: 'Usman Ahmed',
    applied_position: 'Data Analyst',
    scheduled_date: '2026-06-27',
    scheduled_time: '11:30:00',
    interviewer: 'Dr. Zafar',
    interview_type: 'In person',
  },
];

export default function Calendar() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null); // 👈 starts as null (no date selected)

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

  const fetchUpcomingInterviews = async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getUpcoming();
      let data = [];
      if (response.status === 'success' || response.interviews) {
        data = response.interviews || response.data || [];
      }
      // If API returns nothing, fallback to mock data
      if (data.length === 0) {
        console.warn('No interviews from API; using mock data.');
        data = MOCK_INTERVIEWS;
      }
      setInterviews(data);
      // 👇 REMOVED: no automatic default date selection
    } catch (error) {
      console.error('Error fetching upcoming interviews:', error);
      // Fallback to mock data on error
      setInterviews(MOCK_INTERVIEWS);
      // 👇 REMOVED: no automatic default date selection
    } finally {
      setLoading(false);
    }
  };

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

  // ─── Helpers ──────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    let timePart = '';
    if (timeStr) {
      const [h, m] = timeStr.slice(0, 5).split(':');
      const hour = parseInt(h);
      const ampm = hour >= 12 ? 'pm' : 'am';
      const hour12 = hour % 12 || 12;
      timePart = `${hour12}:${m}${ampm}`;
    }
    return `${datePart}, ${timePart}`;
  };

  // ─── Filter interviews for the selected date ────────────────
  const filteredInterviews = selectedDate
    ? interviews.filter(item => item.scheduled_date === selectedDate)
    : [];

  // ─── Click handler for calendar days ────────────────────────
  const handleDayClick = (day) => {
    const dateStr = `2026-06-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr); // 👈 data shows only after this click
  };

  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    bg: '#effbfb',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
    headerBg: '#f4f6f7',
  };

  return (
    <HRLayout>
      <HRPageLayout title="Calendar">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* ─── Calendar Grid ─── */}
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, marginBottom: '16px' }}>June 2026</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ fontWeight: 600, color: colors.textGray, padding: '8px 0' }}>{day}</div>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                const dateStr = `2026-06-${String(day).padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const hasInterviews = interviews.some(item => item.scheduled_date === dateStr);
                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    style={{
                      padding: '8px 0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isSelected ? colors.primary : (hasInterviews ? colors.lightTeal : 'transparent'),
                      color: isSelected ? '#fff' : colors.textDark,
                      fontWeight: isSelected ? 600 : (hasInterviews ? 600 : 400),
                      transition: 'all 0.15s',
                    }}
                  >
                    {day}
                    {hasInterviews && !isSelected && (
                      <span style={{ display: 'block', fontSize: '8px', color: colors.primary }}>●</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Interviews for selected date ─── */}
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, marginBottom: '16px' }}>
              {selectedDate ? formatDate(selectedDate) : 'Select a date'}
            </h2>

            {loading ? (
              <p style={{ color: colors.textGray, fontSize: '14px' }}>Loading interviews...</p>
            ) : !selectedDate ? (
              <p style={{ color: colors.textGray, fontSize: '14px' }}>Click a date to see interviews.</p>
            ) : filteredInterviews.length === 0 ? (
              <p style={{ color: colors.textGray, fontSize: '14px' }}>No interviews scheduled for this date.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: colors.headerBg, borderBottom: `2px solid ${colors.border}` }}>
                      <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: colors.textDark }}>CANDIDATE</th>
                      <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: colors.textDark }}>POSITION</th>
                      <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: colors.textDark }}>DATE &amp; TIME</th>
                      <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: colors.textDark }}>PANEL</th>
                      <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: colors.textDark }}>MODE</th>
                      <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: colors.textDark }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInterviews.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < filteredInterviews.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                        <td style={{ padding: '12px 8px', color: colors.textDark, fontWeight: 500 }}>
                          {item.name || 'N/A'}
                        </td>
                        <td style={{ padding: '12px 8px', color: colors.textGray }}>
                          {item.applied_position || item.interview_type || 'N/A'}
                        </td>
                        <td style={{ padding: '12px 8px', color: colors.textGray }}>
                          {formatDateTime(item.scheduled_date, item.scheduled_time)}
                        </td>
                        <td style={{ padding: '12px 8px', color: colors.textGray }}>
                          {item.interviewer || '—'}
                        </td>
                        <td style={{ padding: '12px 8px', color: colors.textGray }}>
                          {item.interview_type || '—'}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{
                            display: 'inline-block',
                            background: '#DFF6E5',
                            color: '#1E8E3E',
                            padding: '2px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}>
                            Scheduled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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