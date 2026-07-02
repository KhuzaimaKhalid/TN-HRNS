import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';

export default function Calendar() {
  const colors = {
    primary: '#007A7C',
    lightTeal: '#E8F5F5',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
  };

  const interviews = [
    { candidate: 'Sana Kareem', role: 'Frontend Developer', date: 'Wed, 25 Jun', time: '02:00 PM' },
    { candidate: 'Rana Aslam', role: 'AI Engineer', date: 'Wed, 25 Jun', time: '03:00 PM' },
    { candidate: 'Ali Hassan', role: 'Backend Developer', date: 'Thu, 26 Jun', time: '10:00 AM' },
  ];

  return (
    <HRLayout>
      <HRPageLayout title="Calendar">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'white', border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, marginBottom: '16px' }}>June 2026</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ fontWeight: 600, color: colors.textGray, padding: '8px 0' }}>{day}</div>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                <div key={day} style={{ padding: '8px 0', borderRadius: '8px', cursor: 'pointer', background: day === 25 ? colors.lightTeal : 'transparent', fontWeight: day === 25 ? 600 : 400 }}>
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, marginBottom: '16px' }}>Upcoming Interviews</h2>
            {interviews.map((item, idx) => (
              <div key={idx} style={{ padding: '12px 0', borderBottom: idx < interviews.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: colors.textDark }}>{item.candidate}</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.textGray }}>{item.role}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.primary }}>{item.date}</span>
                    <span style={{ fontSize: '12px', color: colors.textGray }}>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '16px' }}>
              <button style={{ backgroundColor: colors.primary, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', width: '100%', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                Schedule New Interview
              </button>
            </div>
          </div>
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}