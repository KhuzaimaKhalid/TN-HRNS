// pages/candidates.js
import { useState } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import CandidateDetailView from '@/components/candidate/CandidateDetailView';

// Fixed demo data
const DEMO_CANDIDATES = [
  { id: 1, fullName: 'Sana Kareem', position: 'UI/UX Designer', skills: ['Figma', 'Prototyping'], applied: '2026-06-19', status: 'Selected' },
  { id: 2, fullName: 'Hamza Khan', position: 'Backend Dev', skills: ['Node.js', 'PostgreSQL'], applied: '2026-06-09', status: 'Rejected' },
  { id: 3, fullName: 'Talha Baig', position: 'QA Engineer', skills: ['Manual QA', 'Automation'], applied: '2026-06-25', status: 'Applied' },
  { id: 4, fullName: 'Rabia Ali', position: 'Frontend Dev Intern', skills: ['React', 'Tailwind'], applied: '2026-06-18', status: 'Waiting list' },
];

export default function Candidates() {
  const [candidates] = useState(DEMO_CANDIDATES);
  const [selected, setSelected] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // ─── Create Project Modal State ───
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectActiveTab, setProjectActiveTab] = useState('save');

  // ─── Filter states ───
  const [openFilter, setOpenFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [positionFilter, setPositionFilter] = useState(null);
  const [skillsFilter, setSkillsFilter] = useState(null);

  const statusOptions = [...new Set(DEMO_CANDIDATES.map(c => c.status || 'Applied'))];
  const positionOptions = [...new Set(DEMO_CANDIDATES.map((c) => c.position))];
  const skillsOptions = [...new Set(DEMO_CANDIDATES.flatMap((c) => c.skills))];

  const colors = {
    primary: '#007A7C',
    primaryDark: '#06504A',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    bg: '#effbfb',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
    skillBg: '#DCEFEF',
    skillText: '#007A7C',
    headerBg: '#8A8F95',
    danger: '#dc3545',
  };

  const statusStyles = (status) => {
    const map = {
      Selected: { bg: '#DFF6E5', color: '#1E8E3E' },
      Rejected: { bg: '#FDE2E4', color: '#D32F2F' },
      Applied: { bg: '#E3F2FD', color: '#1565C0' },
      'Waiting list': { bg: '#FFF3D6', color: '#B8860B' },
      Interviewing: { bg: '#EDE7FB', color: '#6B3FD4' },
      Shortlisted: { bg: '#FFF3D6', color: '#B8860B' },
      Submitted: { bg: '#E3F2FD', color: '#1565C0' },
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
    if (selected.length === filteredCandidates.length) {
      setSelected([]);
    } else {
      setSelected(filteredCandidates.map((c, idx) => c.id || idx));
    }
  };

  const getSkills = (c) => {
    if (Array.isArray(c.skills)) return c.skills;
    if (typeof c.skills === 'string') return c.skills.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const bottomTabs = [
    { key: 'save', label: 'Save As/Add' },
    { key: 'approve', label: 'Approve' },
    { key: 'manage', label: 'Manage Tasks' },
    { key: 'submittal', label: 'Submittal Tasks' },
    { key: 'review', label: 'Review' },
  ];

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

  // Apply filters
  const filteredCandidates = candidates.filter((c) => {
    const status = c.status || 'Applied';
    const matchesStatus = !statusFilter || status === statusFilter;
    const matchesPosition = !positionFilter || c.position === positionFilter;
    const matchesSkills = !skillsFilter || getSkills(c).includes(skillsFilter);
    return matchesStatus && matchesPosition && matchesSkills;
  });

  // Filter dropdown component
  const FilterDropdown = ({ label, filterKey, options, value, onChange }) => (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpenFilter(openFilter === filterKey ? null : filterKey)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
          background: 'white', border: `1px solid ${colors.border}`, borderRadius: '10px',
          padding: '8px 10px 8px 16px', fontFamily: "'Poppins', sans-serif", fontSize: '13px',
          color: colors.textDark, cursor: 'pointer', justifyContent: 'space-between'
        }}
      >
        {value ? `${label}: ${value}` : label}
        <span style={{
          width: '20px', height: '20px', borderRadius: '50%', background: colors.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <i className="fas fa-chevron-down" style={{ fontSize: '9px', color: 'white' }}></i>
        </span>
      </button>
      {openFilter === filterKey && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 10,
          background: 'white', border: `1px solid ${colors.border}`, borderRadius: '10px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)', overflow: 'hidden'
        }}>
          {value && (
            <div
              onClick={() => { onChange(null); setOpenFilter(null); }}
              style={{ padding: '9px 16px', fontSize: '13px', color: colors.textGray, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}
            >
              Clear filter
            </div>
          )}
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpenFilter(null); }}
              style={{
                padding: '9px 16px', fontSize: '13px', cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                background: value === opt ? colors.primary : 'white',
                color: value === opt ? 'white' : colors.textDark,
              }}
              onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = '#F2F4F5'; }}
              onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = 'white'; }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── Main render ──────────────────────────────────────────────
  return (
    <HRLayout>
      <HRPageLayout title="Candidates">
        {/* ─── Filters + Create Project Button ─── */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '16px',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
            flex: 1,
            minWidth: '300px',
          }}>
            <FilterDropdown
              label="Filter by status"
              filterKey="status"
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="Filter by position"
              filterKey="position"
              options={positionOptions}
              value={positionFilter}
              onChange={setPositionFilter}
            />
            <FilterDropdown
              label="Filter by skills"
              filterKey="skills"
              options={skillsOptions}
              value={skillsFilter}
              onChange={setSkillsFilter}
            />
          </div>

          {/* ─── CREATE PROJECT BUTTON ─── */}
          <button
            style={{
              background: colors.primary,
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.primaryDark}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.primary}
            onClick={() => {
              console.log('Create Project clicked');
              setShowProjectModal(true);
            }}
          >
            <i className="fas fa-folder-plus"></i> Create Project
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
                      checked={filteredCandidates.length > 0 && selected.length === filteredCandidates.length}
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
                {filteredCandidates.map((c, idx) => {
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

      {/* ─── CREATE PROJECT MODAL ─── */}
      {showProjectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px',
        }}
        onClick={() => setShowProjectModal(false)}
        >
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '580px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px 32px 28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowProjectModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: colors.textGray,
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1,
              }}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '22px',
              fontWeight: 700,
              color: colors.textDark,
              margin: '0 0 24px 0',
            }}>
              Create Project
            </h2>

            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
                  Project name
                </label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `1.5px solid ${colors.border}`,
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    background: '#fafcfc',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  placeholder="Enter project description"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `1.5px solid ${colors.border}`,
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    background: '#fafcfc',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
                  Form team
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  border: `1.5px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: '#fafcfc',
                  cursor: 'pointer',
                }}>
                  <span style={{ color: colors.textGray, fontSize: '14px' }}>@ Add member</span>
                  <i className="fas fa-plus-circle" style={{ color: colors.primary, fontSize: '18px' }}></i>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
                  Target timeline
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  border: `1.5px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: '#fafcfc',
                  cursor: 'pointer',
                }}>
                  <span style={{ color: colors.textGray, fontSize: '14px' }}>Assign project manager</span>
                  <i className="fas fa-chevron-down" style={{ color: colors.textGray, fontSize: '14px' }}></i>
                </div>
              </div>

              <button
                style={{
                  background: colors.primary,
                  color: '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  width: '100%',
                  marginTop: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.primaryDark}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.primary}
                onClick={() => {
                  alert('Project created successfully!');
                  setShowProjectModal(false);
                }}
              >
                Create project
              </button>
            </div>

            {/* Bottom tabs */}
            <div style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: `2px solid ${colors.border}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'space-between',
            }}>
              {bottomTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setProjectActiveTab(tab.key)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '6px 12px',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '14px',
                    fontWeight: projectActiveTab === tab.key ? 600 : 400,
                    color: projectActiveTab === tab.key ? colors.primary : colors.textGray,
                    borderBottom: projectActiveTab === tab.key ? `3px solid ${colors.primary}` : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </HRLayout>
  );
}