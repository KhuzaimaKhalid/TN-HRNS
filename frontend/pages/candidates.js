// pages/candidates.js
import { useState } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import CandidateDetailView from '@/components/candidate/CandidateDetailView';

// Fixed demo data
const DEMO_CANDIDATES = [
  { id: 1, fullName: 'Sana Kareem', position: 'UI/UX Designer', skills: ['Figma', 'Prototyping'], applied: '2026-06-19', status: 'Interviewing' },
  { id: 2, fullName: 'Hamza Khan', position: 'Backend Dev', skills: ['Node.js', 'PostgreSQL'], applied: '2026-06-09', status: 'Shortlisted' },
  { id: 3, fullName: 'Talha Baig', position: 'QA Engineer', skills: ['Manual QA', 'Automation'], applied: '2026-06-25', status: 'Rejected' },
  { id: 4, fullName: 'Rabia Ali', position: 'Frontend Dev Intern', skills: ['React', 'Tailwind'], applied: '2026-06-18', status: 'Applied' },
];

export default function Candidates() {
  const [candidates] = useState(DEMO_CANDIDATES);
  const [selected, setSelected] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const colors = {
    primary: '#007A7C',
    border: '#E5E9EB',
    headerBg: '#8A8F95',
    textDark: '#1A1A1A',
    textGray: '#666666',
    skillBg: '#D6EDEC',
    skillText: '#007A7C',
  };

  const statusStyles = (status) => {
    const map = {
      Interviewing: { bg: '#EDE7FB', color: '#6B3FD4' },
      Shortlisted:  { bg: '#FFF3D6', color: '#B8860B' },
      Selected:     { bg: '#DFF6E5', color: '#1E8E3E' },
      Applied:      { bg: '#E3F2FD', color: '#1565C0' },
      Submitted:    { bg: '#E3F2FD', color: '#1565C0' },
      Rejected:     { bg: '#FDE2E4', color: '#D32F2F' },
    };
    return map[status] || { bg: '#EEEEEE', color: '#555555' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selected.length === candidates.length) {
      setSelected([]);
    } else {
      setSelected(candidates.map((c, idx) => c.id || idx));
    }
  };

  const getSkills = (c) => {
    if (Array.isArray(c.skills)) return c.skills;
    if (typeof c.skills === 'string') return c.skills.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
  };

  // ─── If a candidate is selected, show detail view ────────────
  if (selectedCandidate) {
    return (
      <HRLayout>
        <HRPageLayout title="Candidates">
          <CandidateDetailView
            candidate={selectedCandidate}
            onBack={() => setSelectedCandidate(null)}
          />
        </HRPageLayout>
      </HRLayout>
    );
  }

  // ─── Otherwise show the table ──────────────────────────────────
  return (
    <HRLayout>
      <HRPageLayout title="Candidates">
        {/* Filter by skills */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'white', border: `1px solid ${colors.border}`, borderRadius: '10px',
            padding: '8px 10px 8px 16px', fontFamily: "'Poppins', sans-serif", fontSize: '13px',
            color: colors.textDark, cursor: 'pointer'
          }}>
            Filter by skills
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%', background: colors.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <i className="fas fa-chevron-down" style={{ fontSize: '9px', color: 'white' }}></i>
            </span>
          </button>
        </div>

        {/* Table card */}
        <div style={{ background: 'white', border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '18px' }}>
            <button style={{
              background: 'white', color: colors.primary, border: `1.5px solid ${colors.primary}`,
              padding: '7px 20px', borderRadius: '20px', cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: '13px'
            }}>
              Shortlist selected
            </button>
          </div>

          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.headerBg }}>
                  <th style={{ padding: '10px 8px', width: '32px' }}>
                    <input
                      type="checkbox"
                      checked={candidates.length > 0 && selected.length === candidates.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: 'white', fontWeight: 600, fontSize: '11px' }}>CANDIDATE</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: 'white', fontWeight: 600, fontSize: '11px' }}>POSITION</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: 'white', fontWeight: 600, fontSize: '11px' }}>SKILLS</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: 'white', fontWeight: 600, fontSize: '11px' }}>APPLIED</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: 'white', fontWeight: 600, fontSize: '11px' }}>STATUS</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: 'white', fontWeight: 600, fontSize: '11px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, idx) => {
                  const id = c.id || idx;
                  const status = c.status || 'Applied';
                  const style = statusStyles(status);
                  const skills = getSkills(c);

                  return (
                    <tr
                      key={id}
                      style={{ borderBottom: `1px solid ${colors.border}`, cursor: 'pointer' }}
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <td style={{ padding: '12px 8px' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.includes(id)}
                          onChange={() => toggleSelect(id)}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', color: colors.textDark, fontSize: '13px' }}>
                        {c.fullName || c.name || 'Anonymous'}
                      </td>
                      <td style={{ padding: '12px 8px', color: colors.textDark, fontSize: '13px' }}>
                        {c.position || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {skills.length > 0 ? skills.map((skill, i) => (
                            <span key={i} style={{
                              background: colors.skillBg, color: colors.skillText,
                              padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 500,
                              whiteSpace: 'nowrap'
                            }}>
                              {skill}
                            </span>
                          )) : <span style={{ color: colors.textGray, fontSize: '12px' }}>—</span>}
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', color: colors.textDark, fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {formatDate(c.created_at || c.applied)}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          background: style.bg, color: style.color,
                          padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 500
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.color, display: 'inline-block' }} />
                          {status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <button style={{
                          background: 'white', border: `1px solid ${colors.border}`, color: colors.textDark,
                          padding: '5px 16px', borderRadius: '8px', cursor: 'pointer',
                          fontFamily: "'Poppins', sans-serif", fontSize: '12px'
                        }} onClick={(e) => e.stopPropagation()}>
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}