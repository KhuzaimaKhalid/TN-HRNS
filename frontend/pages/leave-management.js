// pages/leave-management.js
import { useState, useEffect } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import { leaveAPI, authAPI } from '@/services/api';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Maps every possible backend status to a display label
function displayStatus(backendStatus) {
  switch (backendStatus) {
    case 'Pending': return 'Newly Added';
    case 'Rejected': return 'Declined by HR';
    case 'Forwarded to Team Lead': return 'Sent to Team Lead';
    case 'Forwarded': return 'Forwarded to CFO';
    case 'Approved': return 'Approved by Team Lead';
    case 'Approved by CFO': return 'Approved by CFO';
    case 'Rejected by CFO': return 'Declined by CFO';
    default: return backendStatus;
  }
}

function mapLeaveFromBackend(row) {
  return {
    id: row.leave_id,
    employee: row.name || 'Unknown',
    role: row.role || 'Employee',
    type: row.leave_type,
    dates: `${formatDate(row.start_date)} - ${formatDate(row.end_date)}`,
    duration: `${row.days} day${row.days === 1 ? '' : 's'}`,
    status: displayStatus(row.status),
    rawStatus: row.status,
    note: row.note || 'No additional notes provided.',
  };
}

export default function LeaveManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerRole, setViewerRole] = useState(null); // 'HR' | 'TeamLead' | 'CFO'
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // ─── Step 1: figure out who's logged in, then load the right queue ───
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const profileRes = await authAPI.getProfile();
        const user = profileRes.user || {};

        // IMPORTANT: check user.role first (source of truth for HR / CFO).
        // Only fall back to isTeamLead for accounts that are neither HR nor CFO.
        let role = 'HR';
        if (user.role === 'CFO') role = 'CFO';
        else if (user.role === 'HR') role = 'HR';
        else if (user.role === 'Team Lead') role = 'TeamLead';
        else role = 'HR';

        if (!isMounted) return;
        setViewerRole(role);

        let res;
        if (role === 'CFO') res = await leaveAPI.getForCFO();
        else if (role === 'TeamLead') res = await leaveAPI.getForTeamLead();
        else res = await leaveAPI.getAllForHR();

        if (!isMounted) return;
        if (res.success) setLeaves(res.data.map(mapLeaveFromBackend));
        else setError(res.message || 'Failed to load leaves');
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load leaves');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();
    return () => { isMounted = false; };
  }, []);

  const filteredLeaves = leaves.filter((leave) =>
    leave.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLeave = leaves.find((l) => l.id === selectedLeaveId) || null;

  const getStatusBadge = (status) => {
    if (status.toLowerCase().includes('approved')) {
      return { bg: '#d4edda', color: '#1e7e34', label: status };
    }
    if (status.toLowerCase().includes('forwarded') || status.toLowerCase().includes('sent')) {
      return { bg: '#fff3cd', color: '#856404', label: status };
    }
    if (status.toLowerCase().includes('declined')) {
      return { bg: '#f8d7da', color: '#c0392b', label: status };
    }
    if (status.toLowerCase().includes('newly added')) {
      return { bg: '#ffe8cc', color: '#c2660c', label: status };
    }
    return { bg: '#e9ecef', color: '#495057', label: status };
  };

  // ─── Generic action runner ───
  const runAction = async (id, apiCall, optimisticStatusLabel, removeFromList) => {
    setActionLoadingId(id);
    setError(null);
    try {
      const res = await apiCall();
      if (res.success) {
        if (removeFromList) {
          setLeaves((prev) => prev.filter((l) => l.id !== id));
          if (selectedLeaveId === id) setSelectedLeaveId(null);
        } else {
          setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: optimisticStatusLabel } : l)));
        }
      } else {
        setError(res.message || 'Action failed');
      }
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  // ─── HR actions ───
  const hrDecline = (id) => runAction(id, () => leaveAPI.updateStatus(id, 'Rejected'), 'Declined by HR', false);
  const hrSendToTeamLead = (id) => runAction(id, () => leaveAPI.updateStatus(id, 'Forwarded to Team Lead'), 'Sent to Team Lead', false);
  const hrForwardToCFO = (id) => runAction(id, () => leaveAPI.updateStatus(id, 'Forwarded'), 'Forwarded to CFO', false);

  // ─── Team Lead actions ───
  const tlApprove = (id) => runAction(id, () => leaveAPI.teamLeadUpdateStatus(id, 'Approved'), null, true);
  const tlReject = (id) => runAction(id, () => leaveAPI.teamLeadUpdateStatus(id, 'Rejected'), null, true);
  const tlForwardToCFO = (id) => runAction(id, () => leaveAPI.teamLeadUpdateStatus(id, 'Forwarded'), null, true);

  // ─── CFO actions ───
  const cfoApprove = (id) => runAction(id, () => leaveAPI.cfoUpdateStatus(id, 'Approved by CFO'), null, true);
  const cfoReject = (id) => runAction(id, () => leaveAPI.cfoUpdateStatus(id, 'Rejected by CFO'), null, true);

  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    bg: '#effbfb',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  const pageTitle =
    viewerRole === 'CFO' ? 'Leave Management — CFO Review' :
      viewerRole === 'TeamLead' ? 'Leave Management — Team Lead Review' :
        'Leave management';

  // ─── Renders the right action buttons for the side panel, per role ───
  const renderActions = () => {
    if (!selectedLeave) return null;
    const busy = actionLoadingId === selectedLeave.id;
    const btnStyle = (bg) => ({
      width: '100%', background: bg, color: 'white', border: 'none',
      borderRadius: '8px', padding: '10px 0', fontSize: '13px', fontWeight: 500,
      cursor: busy ? 'not-allowed' : 'pointer', marginBottom: '10px', opacity: busy ? 0.6 : 1,
    });

    if (viewerRole === 'CFO') {
      if (selectedLeave.rawStatus !== 'Forwarded') {
        return <p style={{ fontSize: '12.5px', color: colors.textGray }}>Already resolved.</p>;
      }
      return (
        <>
          <button disabled={busy} onClick={() => cfoReject(selectedLeave.id)} style={btnStyle('#e74c3c')}>Reject</button>
          <button disabled={busy} onClick={() => cfoApprove(selectedLeave.id)} style={btnStyle(colors.primary)}>Approve</button>
        </>
      );
    }

    if (viewerRole === 'TeamLead') {
      if (selectedLeave.rawStatus !== 'Forwarded to Team Lead') {
        return <p style={{ fontSize: '12.5px', color: colors.textGray }}>Already resolved.</p>;
      }
      return (
        <>
          <button disabled={busy} onClick={() => tlReject(selectedLeave.id)} style={btnStyle('#e74c3c')}>Reject</button>
          <button disabled={busy} onClick={() => tlForwardToCFO(selectedLeave.id)} style={btnStyle('#f0ad4e')}>Forward to CFO</button>
          <button disabled={busy} onClick={() => tlApprove(selectedLeave.id)} style={btnStyle(colors.primary)}>Approve</button>
        </>
      );
    }

    // HR (default)
    if (selectedLeave.rawStatus !== 'Pending') {
      return <p style={{ fontSize: '12.5px', color: colors.textGray }}>Already processed. No further action available.</p>;
    }
    return (
      <>
        <button disabled={busy} onClick={() => hrDecline(selectedLeave.id)} style={btnStyle('#e74c3c')}>Decline</button>
        <button disabled={busy} onClick={() => hrSendToTeamLead(selectedLeave.id)} style={btnStyle('#f0ad4e')}>Forward to Team Lead</button>
        <button disabled={busy} onClick={() => hrForwardToCFO(selectedLeave.id)} style={btnStyle(colors.primary)}>Forward to CFO</button>
      </>
    );
  };

  return (
    <HRLayout>
      <HRPageLayout title={pageTitle}>
        {/* ─── Search Bar ────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '4px 4px 4px 16px',
          marginBottom: '24px',
          maxWidth: '500px',
        }}>
          <i className="fas fa-search" style={{ color: colors.textGray, fontSize: '14px', marginRight: '8px' }}></i>
          <input
            type="text"
            placeholder="Search projects, tasks, or clients."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              padding: '10px 12px',
              flex: 1,
              fontFamily: "'Poppins', sans-serif",
              fontSize: '14px',
              color: colors.textDark,
              background: 'transparent',
            }}
          />
          <button
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '6px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Search
          </button>
        </div>

        {error && (
          <div style={{
            background: '#f8d7da', color: '#c0392b', padding: '12px 16px',
            borderRadius: '8px', marginBottom: '16px',
            fontFamily: "'Poppins', sans-serif", fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        {/* ─── Main Content: Table + Side Panel ─────────────── */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
            flex: 1,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Poppins', sans-serif" }}>
                <thead>
                  <tr style={{ background: '#e9edf0' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: colors.textDark, fontSize: '14px' }}>Employee</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: colors.textDark, fontSize: '14px' }}>Type</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: colors.textDark, fontSize: '14px' }}>Dates</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: colors.textDark, fontSize: '14px' }}>Duration</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: colors.textDark, fontSize: '14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '48px 20px', textAlign: 'center', color: colors.textGray, fontSize: '15px' }}>
                        Loading leave requests...
                      </td>
                    </tr>
                  ) : filteredLeaves.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '48px 20px', textAlign: 'center', color: colors.textDark, fontSize: '15px' }}>
                        There are no leaves here yet
                      </td>
                    </tr>
                  ) : (
                    filteredLeaves.map((leave, index) => {
                      const statusInfo = getStatusBadge(leave.status);
                      const isSelected = leave.id === selectedLeaveId;
                      return (
                        <tr
                          key={leave.id}
                          onClick={() => setSelectedLeaveId((prev) => (prev === leave.id ? null : leave.id))}
                          style={{
                            borderBottom: index < filteredLeaves.length - 1 ? `1px solid #eee` : 'none',
                            background: isSelected ? colors.lightTeal : 'transparent',
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f8f9fa'; }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <td style={{ padding: '12px 16px', color: colors.textDark, fontSize: '14px', fontWeight: 500 }}>{leave.employee}</td>
                          <td style={{ padding: '12px 16px', color: colors.textDark, fontSize: '14px' }}>{leave.type}</td>
                          <td style={{ padding: '12px 16px', color: colors.textDark, fontSize: '14px' }}>{leave.dates}</td>
                          <td style={{ padding: '12px 16px', color: colors.textDark, fontSize: '14px' }}>{leave.duration}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              background: statusInfo.bg, color: statusInfo.color, padding: '4px 14px',
                              borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                              display: 'inline-block', whiteSpace: 'nowrap',
                            }}>
                              {statusInfo.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedLeave && (
            <div style={{
              width: '260px', flexShrink: 0, background: colors.cardBg,
              border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '20px',
              fontFamily: "'Poppins', sans-serif", display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center',
            }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%', background: colors.lightTeal,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
                fontSize: '24px', fontWeight: 600, color: colors.primary,
              }}>
                {selectedLeave.employee.split(' ').map((n) => n[0]).join('')}
              </div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: colors.textDark }}>{selectedLeave.employee}</div>
              <div style={{ fontSize: '13px', color: colors.textGray, marginBottom: '12px' }}>{selectedLeave.role}</div>
              <p style={{ fontSize: '12.5px', color: colors.textGray, lineHeight: 1.5, marginBottom: '20px' }}>
                {selectedLeave.note}
              </p>
              {renderActions()}
            </div>
          )}
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}