import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';

export default function Messages() {
  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
  };

  const messages = [
    { from: 'Hamza Jamali', subject: 'Onboarding document approved', time: '1 hr ago', unread: true },
    { from: 'Noman Tariq', subject: 'Leave forwarded to CEO', time: '2 days ago', unread: false },
    { from: 'Sara Afzal', subject: 'Team meeting reminder', time: '3 days ago', unread: false },
  ];

  return (
    <HRLayout>
      <HRPageLayout title="Messages">
        <div style={{ background: 'white', border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, marginBottom: '16px' }}>Inbox</h2>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ padding: '16px 0', borderBottom: idx < messages.length - 1 ? `1px solid ${colors.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {msg.unread && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.primary }}></div>}
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: msg.unread ? 600 : 400, color: colors.textDark }}>{msg.from}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.textGray }}>{msg.subject}</p>
                </div>
              </div>
              <span style={{ fontSize: '12px', color: colors.textGray }}>{msg.time}</span>
            </div>
          ))}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button style={{ background: 'transparent', border: `1px solid ${colors.border}`, padding: '8px 24px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", color: colors.textDark }}>
              View All Messages
            </button>
          </div>
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}