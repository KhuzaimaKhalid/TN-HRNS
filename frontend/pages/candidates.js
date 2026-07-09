import { useState, useEffect } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import { applicationAPI } from '@/services/api'; 
import Spinner from '@/components/common/Spinner';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const colors = {
    primary: '#007A7C',
    lightTeal: '#E8F5F5',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    green: '#2F8A4B',
    purple: '#c9b545',       
    infoBlue: '#17a2b8',     
    red: '#dc3545',
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await applicationAPI.getAllForHR();
        
        // Check your browser console (F12) to see exactly what the backend returns!
        console.log("API Response:", response);

        if (response && Array.isArray(response.data)) {
          setCandidates(response.data);
        } else if (Array.isArray(response)) {
          setCandidates(response);
        } else if (response && typeof response === 'object') {
          // Check common wrapper keys in case it's nested under another property
          const nestedArray = response.candidates || response.applications || response.results;
          if (Array.isArray(nestedArray)) {
            setCandidates(nestedArray);
          } else {
            setCandidates([]);
          }
        } else {
          setCandidates([]);
        }
      } catch (err) {
        console.error('Failed to load candidates:', err);
        setError('Failed to fetch real candidate data.');
        setCandidates([]); // Fallback to safe array structure
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

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

  const getTextColor = (status) => {
    const darkText = ['Submitted']; 
    return darkText.includes(status) ? colors.textDark : '#ffffff';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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

          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}><Spinner /></div>
          ) : error ? (
            <div style={{ color: colors.red, textAlign: 'center', padding: '20px' }}>{error}</div>
          ) : !Array.isArray(candidates) || candidates.length === 0 ? (
            <p style={{ color: colors.textGray, textAlign: 'center', padding: '20px' }}>No candidates found in the database.</p>
          ) : (
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
                  <tr key={c.user_id || c.id || idx} style={{ borderBottom: idx < candidates.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                    <td style={{ padding: '12px 8px', color: colors.textDark }}>{c.fullName || c.name || 'Anonymous'}</td>
                    <td style={{ padding: '12px 8px', color: colors.textDark }}>{c.position || 'N/A'}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        background: getStatusColor(c.status || 'Submitted'),
                        color: getTextColor(c.status || 'Submitted'),
                        padding: '2px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        display: 'inline-block'
                      }}>{c.status || 'Submitted'}</span>
                    </td>
                    <td style={{ padding: '12px 8px', color: colors.textDark }}>{formatDate(c.created_at || c.applied)}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <button style={{ background: 'transparent', border: `1px solid ${colors.primary}`, color: colors.primary, padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>View</button>
                      {' '}
                      <button style={{ background: colors.primary, border: 'none', color: 'white', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Schedule</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}