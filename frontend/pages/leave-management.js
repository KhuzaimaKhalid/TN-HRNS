import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';

export default function LeaveManagement() {
  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    green: '#2F8A4B',
    danger: '#dc3545',
  };

  const leaves = [
    { name: 'Usman Farooq', type: 'Annual leave', days: 5, period: 'Jul 1-5', status: 'Pending' },
    { name: 'Zara Hashmi', type: 'Sick leave', days: 2, period: 'Jun 27-28', status: 'Pending' },
    { name: 'Ali Ahmed', type: 'Casual leave', days: 1, period: 'Jun 30', status: 'Approved' },
  ];

  return (
    <HRLayout>
      <HRPageLayout title="Leave Management">
        <div style={{ background: 'white', border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, margin: 0 }}>Pending Leave Requests</h2>
            <button style={{ backgroundColor: colors.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
              + New Request
            </button>
          </div>
          {leaves.filter(l => l.status === 'Pending').map((item, idx) => (
            <div key={idx} style={{ padding: '16px 0', borderBottom: idx < leaves.filter(l => l.status === 'Pending').length - 1 ? `1px solid ${colors.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: colors.textDark }}>{item.name}</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.textGray }}>{item.type} • {item.days} days • {item.period}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: colors.green, border: 'none', color: 'white', padding: '4px 16px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Approve</button>
                <button style={{ background: colors.danger, border: 'none', color: 'white', padding: '4px 16px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Reject</button>
              </div>
            </div>
          ))}
          {leaves.filter(l => l.status === 'Pending').length === 0 && (
            <p style={{ textAlign: 'center', color: colors.textGray, padding: '20px 0' }}>No pending requests</p>
          )}
          <div style={{ marginTop: '16px', borderTop: `1px solid ${colors.border}`, paddingTop: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.textDark, marginBottom: '12px' }}>Approved / History</h3>
            {leaves.filter(l => l.status === 'Approved').map((item, idx) => (
              <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name} – {item.type}</span>
                <span style={{ color: colors.textGray }}>{item.period}</span>
              </div>
            ))}
          </div>
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}