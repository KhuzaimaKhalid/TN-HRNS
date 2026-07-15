// components/candidate/CandidateDetailView.js
import { useState } from 'react';

export default function CandidateDetailView({ candidate, onBack }) {
  const [activeTab, setActiveTab] = useState('application');

  // ─── Create Project Modal State ───
  const [showProjectModal, setShowProjectModal] = useState(false);

  const info = {
    name: candidate?.fullName || 'Sana Kareem',
    role: candidate?.position || 'UI/UX Designer',
    email: candidate?.email || 'sarakareem@gmail.com',
    phone: candidate?.phone || '+92 300 1234567',
    appliedOn: candidate?.appliedOn || '18 Jun 2026',
    skills: candidate?.skills || ['Figma', 'Prototyping'],
    education: {
      degree: 'BS Software Engineering',
      type: "Bachelor's degree - graduate (yes)",
      gpa: '3.5 GPA',
    },
    experience: [
      { title: 'Product Designer', company: 'Lumen Labs', period: '2023 - Present' },
      { title: 'UI Intern', company: 'FoLoU', period: '2022 - 2023' },
    ],
    documents: {
      resume: 'Sara_resume.pdf',
      cnicFront: 'scan.pdf',
      cnicBack: 'scan.pdf',
    },
    submittedTask: {
      title: 'Design DevConnect web design',
      submittedOn: '16 Jun, 2026 at 06:00 PM',
      figmaLink: 'figno.com/sara/devconnect',
      notes: "I've implemented the component according to the design specifications using Tailwind CSS and React Context for state management.",
      files: [{ name: 'Design document.pdf', size: '1.1 MB' }],
    },
    review: {
      title: 'Technical Assessment',
      description: 'Demonstrated strong frontend development skills with a good understanding of HTML, CSS, JavaScript, and modern frameworks. Completed technical tasks effectively.',
      rating: '8.5 ⭐'
    }
  };

  const colors = {
    primary: '#007A7C',
    primaryDark: '#06504A',
    sidebar: '#008080',
    border: '#e2e8e8',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    bg: '#effbfb',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
    success: '#2F8A4B',
    danger: '#dc3545',
    warning: '#f2a900',
    skillBg: '#DCEFEF',
    skillText: '#007A7C',
  };

  const tabs = [
    { key: 'application', label: 'Application' },
    { key: 'assign', label: 'Assign Task' },
    { key: 'submitted', label: 'Submitted Task' },
  ];

  const initials = info.name.split(' ').map(n => n[0]).join('');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      background: colors.bg,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* ─── Sidebar ─── */}
        <aside style={{
          width: '200px',
          flexShrink: 0,
          background: `linear-gradient(180deg, ${colors.sidebar} 0%, ${colors.primaryDark} 100%)`,
          color: '#ffffff',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflowY: 'auto',
        }}>
          {/* Logo / Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '16px',
            }}>
              TN
            </div>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>HRMS</span>
          </div>

          {/* Back Button - Circular */}
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              fontSize: '13px',
              marginBottom: '20px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {/* Candidate Avatar + Name - Centered */}
          <div style={{
            textAlign: 'center',
            padding: '4px 0 16px 0',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 700,
              color: colors.primary,
              margin: '0 auto 10px auto',
            }}>
              {initials}
            </div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, lineHeight: 1.3 }}>
              {info.name}
            </p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
              {info.role}
            </p>
          </div>

          {/* ─── TABS IN SIDEBAR ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '13px',
                  fontWeight: activeTab === tab.key ? 600 : 500,
                  background: activeTab === tab.key ? '#ffffff' : 'transparent',
                  color: activeTab === tab.key ? colors.primaryDark : 'rgba(255,255,255,0.85)',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── Sidebar Create Project Button ─── */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              borderRadius: '10px',
              padding: '12px 14px',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              width: '100%',
            }}
            onClick={() => setShowProjectModal(true)}
          >
            <i className="fas fa-plus-circle"></i> Create Project
          </button>
        </aside>

        {/* ─── Main Content ─── */}
        <main style={{
          flex: 1,
          padding: '24px 32px 40px',
          background: colors.bg,
          overflowY: 'auto',
          height: '100vh',
        }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            fontFamily: "'Poppins', sans-serif",
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: colors.textDark }}>
                Candidates
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  color: colors.textMuted,
                  background: '#fff',
                  minWidth: '240px',
                }}>
                  Search projects, tasks or clients...
                  <span style={{
                    marginLeft: 'auto',
                    background: colors.primary,
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}>
                    Search
                  </span>
                </div>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}>
                  🔔
                </div>
              </div>
            </div>

            {/* ─── Candidate Detail Card ─── */}
            <div style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: '20px',
              padding: '28px 32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}>
              {/* Header: Avatar + Name + Role */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: `1px solid ${colors.border}`,
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: colors.lightTeal,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: colors.primary,
                  flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: colors.textDark }}>
                    {info.name}
                  </h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: colors.textGray }}>
                    {info.role} applicant
                  </p>
                </div>
              </div>

              {/* ─── TAB CONTENT ──────────────────────────────────── */}

              {/* 1. APPLICATION */}
              {activeTab === 'application' && (
                <div>
                  {/* Candidate Info Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px',
                    marginBottom: '24px',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                  }}>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: 0 }}>Email</p>
                      <p style={{ fontSize: '14px', color: colors.textDark, margin: '2px 0 0 0' }}>{info.email}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: 0 }}>Phone</p>
                      <p style={{ fontSize: '14px', color: colors.textDark, margin: '2px 0 0 0' }}>{info.phone}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: 0 }}>Applied</p>
                      <p style={{ fontSize: '14px', color: colors.textDark, margin: '2px 0 0 0' }}>{info.appliedOn}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: colors.textMuted, margin: '0 0 8px 0' }}>
                      SKILLS
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {info.skills.map((s) => (
                        <span key={s} style={{
                          background: colors.skillBg,
                          color: colors.skillText,
                          padding: '4px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education & Experience */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: colors.primary, margin: '0 0 8px 0' }}>
                        Education
                      </h4>
                      <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 500, color: colors.textDark }}>
                        {info.education.degree}
                      </p>
                      <p style={{ margin: '0 0 2px 0', fontSize: '13px', color: colors.textGray }}>
                        {info.education.type}
                      </p>
                      <p style={{ margin: 0, fontSize: '13px', color: colors.textGray }}>
                        {info.education.gpa}
                      </p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: colors.primary, margin: '0 0 8px 0' }}>
                        Experience
                      </h4>
                      {info.experience.map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: idx < info.experience.length - 1 ? '8px' : 0 }}>
                          <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 500, color: colors.textDark }}>
                            {exp.title}
                          </p>
                          <p style={{ margin: 0, fontSize: '13px', color: colors.textGray }}>
                            {exp.company} {exp.period && `• ${exp.period}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: colors.primary, margin: '0 0 12px 0' }}>
                      Documents
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: 0 }}>Resume/CV</p>
                        <p style={{ fontSize: '14px', color: colors.primary, margin: '2px 0 0 0', cursor: 'pointer' }}>
                          📄 {info.documents.resume}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: 0 }}>CNIC Front</p>
                        <p style={{ fontSize: '14px', color: colors.primary, margin: '2px 0 0 0', cursor: 'pointer' }}>
                          📄 {info.documents.cnicFront}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: 0 }}>CNIC Back</p>
                        <p style={{ fontSize: '14px', color: colors.primary, margin: '2px 0 0 0', cursor: 'pointer' }}>
                          📄 {info.documents.cnicBack}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Download buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button style={{
                      padding: '8px 20px',
                      background: colors.lightTeal,
                      color: colors.primary,
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      ⬇ Download resume/CV
                    </button>
                    <button style={{
                      padding: '8px 20px',
                      background: '#f5f7f7',
                      color: colors.textGray,
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      🪪 View CNIC
                    </button>
                  </div>
                </div>
              )}

              {/* 2. ASSIGN TASK */}
              {activeTab === 'assign' && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '20px',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: colors.lightTeal,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: colors.primary,
                      flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.textDark }}>
                        {info.name}
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: colors.textGray }}>
                        {info.role}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '4px' }}>
                        Task name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter task name"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: `1.5px solid ${colors.border}`,
                          fontSize: '14px',
                          fontFamily: "'Poppins', sans-serif",
                          color: colors.textDark,
                          background: '#fafcfa',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '4px' }}>
                        Task description
                      </label>
                      <textarea
                        placeholder="Enter the task instruction"
                        rows="3"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: `1.5px solid ${colors.border}`,
                          fontSize: '14px',
                          fontFamily: "'Poppins', sans-serif",
                          color: colors.textDark,
                          background: '#fafcfa',
                          outline: 'none',
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '4px' }}>
                        Deadline
                      </label>
                      <input
                        type="date"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: `1.5px solid ${colors.border}`,
                          fontSize: '14px',
                          fontFamily: "'Poppins', sans-serif",
                          color: colors.textDark,
                          background: '#fafcfa',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '4px' }}>
                        New task
                      </label>
                      <div style={{
                        border: `2px dashed ${colors.border}`,
                        borderRadius: '12px',
                        padding: '24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#fafcfa',
                        transition: 'all 0.2s',
                      }}>
                        <i className="fas fa-cloud-upload-alt" style={{ fontSize: '24px', color: colors.textGray, display: 'block', marginBottom: '8px' }}></i>
                        <p style={{ margin: 0, color: colors.textGray, fontSize: '14px' }}>
                          Drag and drop your files here or click to browse files
                        </p>
                        <p style={{ margin: '4px 0 0 0', color: colors.textMuted, fontSize: '12px' }}>
                          Supported formats: .zip, .rar, .pdf (Max 50MB)
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <div style={{ flex: 1, height: '1px', background: colors.border }}></div>
                      <span style={{ color: colors.textMuted, fontSize: '13px', fontWeight: 500 }}>OR</span>
                      <div style={{ flex: 1, height: '1px', background: colors.border }}></div>
                    </div>

                    <div style={{
                      background: '#f8f9fa',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: colors.textDark }}>
                          Task_brief_frontend.pdf
                        </p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: colors.textGray }}>
                          12 MB
                        </p>
                      </div>
                      <i className="fas fa-file-pdf" style={{ fontSize: '20px', color: colors.danger }}></i>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                    {/* ─── Create Project button inside Assign Task ─── */}
                    <button
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: `1.5px solid ${colors.border}`,
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        color: colors.textDark,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                      onClick={() => setShowProjectModal(true)}
                    >
                      <i className="fas fa-plus-circle" style={{ marginRight: '6px' }}></i>
                      Create Project
                    </button>
                    <button style={{
                      flex: 2,
                      background: colors.primary,
                      color: '#fff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      <i className="fas fa-paper-plane" style={{ marginRight: '6px' }}></i>
                      Assign task & Notify candidate
                    </button>
                  </div>
                </div>
              )}

              {/* 3. SUBMITTED TASK */}
              {activeTab === 'submitted' && (
                <div>
                  <div style={{
                    background: colors.lightTeal,
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '24px',
                    borderLeft: `4px solid ${colors.primary}`,
                  }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.textDark }}>
                      {info.submittedTask.title}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.textGray }}>
                      <i className="far fa-calendar-alt" style={{ marginRight: '6px' }}></i>
                      Submission: {info.submittedTask.submittedOn}
                    </p>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, margin: '0 0 4px 0' }}>
                      <i className="fas fa-link" style={{ marginRight: '6px', color: colors.primary }}></i>
                      Figma link
                    </p>
                    <a href="#" style={{ color: colors.primary, textDecoration: 'none', fontSize: '14px' }}>
                      {info.submittedTask.figmaLink}
                    </a>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, margin: '0 0 4px 0' }}>
                      Additional notes
                    </p>
                    <p style={{ fontSize: '14px', color: colors.textGray, margin: 0, lineHeight: 1.6 }}>
                      {info.submittedTask.notes}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    marginBottom: '28px',
                    border: `1px solid ${colors.border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fas fa-file-pdf" style={{ fontSize: '18px', color: colors.danger }}></i>
                      <span style={{ fontSize: '14px', color: colors.textDark }}>Design document.pdf</span>
                    </div>
                    <span style={{ fontSize: '12px', color: colors.textGray }}>1.1 MB</span>
                  </div>

                  <div style={{
                    borderTop: `2px solid ${colors.border}`,
                    marginBottom: '24px',
                  }}></div>

                  <div>
                    <h4 style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: colors.textMuted,
                      letterSpacing: '0.5px',
                      margin: '0 0 16px 0',
                    }}>
                      REVIEWS BY TEAM LEAD
                    </h4>

                    <div style={{
                      background: '#f8f9fa',
                      borderRadius: '12px',
                      padding: '18px 20px',
                      border: `1px solid ${colors.border}`,
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}>
                        <h5 style={{
                          margin: 0,
                          fontSize: '14px',
                          fontWeight: 600,
                          color: colors.textDark,
                        }}>
                          &lt; {info.review.title}
                        </h5>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: colors.warning,
                        }}>
                          {info.review.rating}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: colors.textGray,
                        lineHeight: 1.6,
                      }}>
                        {info.review.description}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginTop: '28px',
                    paddingTop: '8px',
                  }}>
                    <button style={{
                      padding: '10px 28px',
                      background: '#fff',
                      color: colors.danger,
                      border: `1.5px solid ${colors.danger}`,
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'all 0.2s',
                    }}>
                      <i className="fas fa-times" style={{ marginRight: '6px' }}></i>
                      Reject
                    </button>
                    <button style={{
                      padding: '10px 28px',
                      background: '#fff',
                      color: colors.warning,
                      border: `1.5px solid ${colors.warning}`,
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'all 0.2s',
                    }}>
                      <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                      Waiting list
                    </button>
                    <button style={{
                      padding: '10px 28px',
                      background: colors.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'all 0.2s',
                    }}>
                      <i className="fas fa-calendar-plus" style={{ marginRight: '6px' }}></i>
                      Schedule interview
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ─── CREATE PROJECT MODAL (SIMPLE FORM) ─── */}
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
            maxWidth: '540px',
            width: '100%',
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
                  <span style={{ color: colors.textGray, fontSize: '14px' }}>Add member</span>
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
          </div>
        </div>
      )}
    </div>
  );
}