import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';

export default function Candidates() {
  const colors = {
    primary: '#007A7C',
    lightTeal: '#E8F5F5',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    green: '#2F8A4B',
    purple: '#c9b545',       // for Interview
    infoBlue: '#17a2b8',     // for Submitted
    red: '#dc3545',
  };

  const candidates = [
    { name: 'Ayesha Khan', position: 'AI Engineer', status: 'Interview', applied: '02 Jun 2026' },
    { name: 'Bilal Ahmed', position: 'Frontend Developer', status: 'Submitted', applied: '10 Jun 2026' },
    { name: 'Sana Alawari', position: 'UI/UX Designer', status: 'Shortlisted', applied: '15 Jun 2026' },
    { name: 'Usman Ali', position: 'Backend Engineer', status: 'Rejected', applied: '20 Jun 2026' },
  ];

  const getStatusColor = (status) => {
    const map = {
      'Interview': colors.purple,
      'Submitted': colors.infoBlue,
      'Shortlisted': colors.green,
      'Selected': colors.green,
      'Rejected': colors.red,
    };
    return map[status] || '#666';
  };

  // For text color contrast (white on dark, dark on light)
  const getTextColor = (status) => {
    const darkText = ['Submitted']; // these have light bg, so dark text
    return darkText.includes(status) ? colors.textDark : '#ffffff';
  };

  return (
    <HRLayout>
      <HRPageLayout title="Candidates">
        <div style={{ background: 'white', border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, margin: 0 }}>All Candidates</h2>
            <button style={{ backgroundColor: colors.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
              + Add Candidate
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: colors.textDark, fontWeight: 600 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: colors.textDark, fontWeight: 600 }}>Position</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: colors.textDark, fontWeight: 600 }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: colors.textDark, fontWeight: 600 }}>Applied</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: colors.textDark, fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: idx < candidates.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                  <td style={{ padding: '12px 8px', color: colors.textDark }}>{c.name}</td>
                  <td style={{ padding: '12px 8px', color: colors.textDark }}>{c.position}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      background: getStatusColor(c.status),
                      color: getTextColor(c.status),
                      padding: '2px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 500,
                      display: 'inline-block'
                    }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '12px 8px', color: colors.textDark }}>{c.applied}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <button style={{ background: 'transparent', border: `1px solid ${colors.primary}`, color: colors.primary, padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>View</button>
                    {' '}
                    <button style={{ background: colors.primary, border: 'none', color: 'white', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Schedule</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}