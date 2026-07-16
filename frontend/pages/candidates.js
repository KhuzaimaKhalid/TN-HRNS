// pages/candidates.js
import { useState, useEffect } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import CandidateDetailView from '@/components/candidate/CandidateDetailView';
import { apiCall } from '@/services/api'; 

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Fetch candidate list from the backend database on page load
// Fetch candidate list from the backend database on page load
useEffect(() => {
  let isMounted = true;
  async function fetchCandidates() {
    try {
      const res = await apiCall('/candidate/hr/all'); 
      
      if (!isMounted) return;

      if (res.status === "success" || res.success) {
        // Normalizes database fields into your detailed UI properties
        const mappedCandidates = res.data.map((c) => ({
          id: c.candidate_id || c.id,
          fullName: c.name || 'Unknown Candidate',
          email: c.email || '',
          phone: c.phone || '', // Pulled directly from database
          position: c.applied_position || 'Not Assigned',
          skills: [], // Safe empty defaults
          resumeUrl: null,
          experience: '',
          education: '',
          applied: c.created_at || new Date().toISOString(),
          status: c.status || 'Applied'
        }));
        setCandidates(mappedCandidates);
      } else {
        setError(res.message || 'Failed to fetch candidates from server');
      }
    } catch (err) {
      if (isMounted) setError(err.message || 'Connection to backend failed');
    } finally {
      if (isMounted) setLoading(false);
    }
  }

  fetchCandidates();
  return () => { isMounted = false; };
}, []);

  const colors = {
    primary: '#007A7C',
    border: '#E2E8F0',
    textDark: '#1A1A1A',
    textGray: '#718096',
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'shortlisted': return { bg: '#E6FFFA', color: '#319795' };
      case 'interviewing':
      case 'interview': return { bg: '#EBF8FF', color: '#3182CE' };
      case 'rejected': return { bg: '#FFF5F5', color: '#E53E3E' };
      default: return { bg: '#EDF2F7', color: '#4A5568' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (selectedCandidate) {
    return (
      <HRLayout>
        <CandidateDetailView 
          candidate={selectedCandidate} 
          onBack={() => setSelectedCandidate(null)} 
        />
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <HRPageLayout title="Candidates">
        <div style={{ background: 'white', border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden' }}>
          
          {error && (
            <div style={{ background: '#FFF5F5', color: '#E53E3E', padding: '12px 16px', margin: '16px', borderRadius: '8px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Poppins', sans-serif" }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: `1px solid ${colors.border}` }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: colors.textDark, fontSize: '14px' }}>Name</th>
                  <th style={{ padding: '14px 8px', textAlign: 'left', fontWeight: 600, color: colors.textDark, fontSize: '14px' }}>Position</th>
                  <th style={{ padding: '14px 8px', textAlign: 'left', fontWeight: 600, color: colors.textDark, fontSize: '14px' }}>Applied Date</th>
                  <th style={{ padding: '14px 8px', textAlign: 'left', fontWeight: 600, color: colors.textDark, fontSize: '14px' }}>Status</th>
                  <th style={{ padding: '14px 8px', textAlign: 'left', fontWeight: 600, color: colors.textDark, fontSize: '14px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '48px 20px', textAlign: 'center', color: colors.textGray, fontSize: '15px' }}>
                      Loading candidates...
                    </td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '48px 20px', textAlign: 'center', color: colors.textDark, fontSize: '15px' }}>
                      No live candidate accounts found in database.
                    </td>
                  </tr>
                ) : (
                  candidates.map((c) => {
                    const style = getStatusStyle(c.status);
                    return (
                      <tr 
                        key={c.id} 
                        onClick={() => setSelectedCandidate(c)}
                        style={{ borderBottom: `1px solid ${colors.border}`, cursor: 'pointer', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px', color: colors.textDark, fontSize: '14px', fontWeight: 500 }}>
                          {c.fullName}
                        </td>
                        <td style={{ padding: '12px 8px', color: colors.textDark, fontSize: '13px' }}>
                          {c.position}
                        </td>
                        <td style={{ padding: '12px 8px', color: colors.textGray, fontSize: '13px', whiteSpace: 'nowrap' }}>
                          {formatDate(c.applied)}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: style.bg, color: style.color,
                            padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 500
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.color, display: 'inline-block' }} />
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <button style={{
                            background: 'white', border: `1px solid ${colors.border}`, color: colors.textDark,
                            padding: '5px 16px', borderRadius: '8px', cursor: 'pointer',
                            fontFamily: "'Poppins', sans-serif", fontSize: '12px'
                          }} onClick={(e) => { e.stopPropagation(); setSelectedCandidate(c); }}>
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}