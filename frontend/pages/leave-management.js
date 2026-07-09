import { useEffect, useState } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import { leaveAPI } from '@/services/api';

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    green: '#2F8A4B',
    danger: '#dc3545',
  };

  // Fetch real leaves data from database
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await leaveAPI.getAllForHR();
      if (res && res.data) {
        setLeaves(res.data);
      }
    } catch (err) {
      console.error("Failed to load leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Approve / Reject actions
  const handleStatusUpdate = async (id, status) => {
    try {
      await leaveAPI.updateStatus(id, status);
      fetchLeaves(); // Dynamic list reload after action
    } catch (err) {
      console.error(`Failed to update leave to ${status}:`, err);
    }
  };

  // Turns timestamps into clean UI periods like "Jul 1 - Jul 5"
  const formatPeriod = (start, end) => {
    const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${s} - ${e}`;
  };

  return (
    <HRLayout>
      <HRPageLayout title="Leave Management">
        <div style={{ background: 'white', border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, margin: 0 }}>Pending Leave Requests</h2>
          </div>

          {loading && <p style={{ color: colors.textGray }}>Loading leaves...</p>}

          {/* Pending items from database */}
          {!loading && leaves.filter(l => l.status === 'Pending').map((item, index) => ( // <-- Added index here
            <div key={item.leave_id} style={{ padding: '16px 0', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: colors.textDark }}>
                  {index + 1}. {item.name} {/* <-- Added Sr. No. rendering here */}
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.textGray }}>
                  {item.leave_type} • {item.days} days • {formatPeriod(item.start_date, item.end_date)}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleStatusUpdate(item.leave_id, 'Approved')}
                  style={{ background: colors.green, border: 'none', color: 'white', padding: '4px 16px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(item.leave_id, 'Rejected')}
                  style={{ background: colors.danger, border: 'none', color: 'white', padding: '4px 16px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
                  Reject
                </button>
              </div>
            </div>
          ))}

          {!loading && leaves.filter(l => l.status === 'Pending').length === 0 && (
            <p style={{ textAlign: 'center', color: colors.textGray, padding: '20px 0' }}>No pending requests</p>
          )}

          {/* History Management */}
          <div style={{ marginTop: '32px', borderTop: `1px solid ${colors.border}`, paddingTop: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.textDark, marginBottom: '12px' }}>Approved / History</h3>

            {!loading && leaves.filter(l => l.status !== 'Pending').map((item, index) => ( // <-- Added index here
              <div key={item.leave_id} style={{ padding: '12px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: colors.textDark, fontSize: '14px' }}>
                  <strong>{index + 1}. {item.name}</strong> – {item.leave_type} ({item.days} days) {/* <-- Added Sr. No. here */}
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: item.status === 'Approved' ? colors.green : colors.danger
                }}>
                  {item.status}
                </span>
              </div>
            ))}

            {!loading && leaves.filter(l => l.status !== 'Pending').length === 0 && (
              <p style={{ color: colors.textGray, fontSize: '13px' }}>No historic applications found.</p>
            )}
          </div>

        </div>
      </HRPageLayout>
    </HRLayout>
  );
}