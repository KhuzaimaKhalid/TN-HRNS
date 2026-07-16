// components/candidate/CandidateDetailView.js
import { useState, useEffect } from 'react';
import { taskAPI, applicationAPI, messageAPI } from '@/services/api';

export default function CandidateDetailView({ candidate, onBack }) {
  const [activeTab, setActiveTab] = useState('application');

  // ── Submitted Task tab state ────────────────────────────────
  const [submission, setSubmission] = useState(null);
  const [submissionLoading, setSubmissionLoading] = useState(true);
  const [submissionError, setSubmissionError] = useState('');

  // ── Reject / Team Lead action state ─────────────────────────
  const [rejecting, setRejecting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [showTeamLeadInput, setShowTeamLeadInput] = useState(false);
  const [teamLeadId, setTeamLeadId] = useState('');
  const [sendingToLead, setSendingToLead] = useState(false);

  // ── Assign Task form state ──────────────────────────────────
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [projectId, setProjectId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');

  // ── Fetch the candidate's real task submission ──────────────
  const candidateIdForSubmission = candidate?.candidate_id || candidate?.id;

  useEffect(() => {
    if (!candidateIdForSubmission) {
      setSubmissionLoading(false);
      return;
    }
    setSubmissionLoading(true);
    setSubmissionError('');
    taskAPI.getSubmission(candidateIdForSubmission)
      .then((res) => {
        if (res?.success && res.data) {
          setSubmission(res.data);
        } else {
          setSubmission(null);
        }
      })
      .catch((err) => {
        console.error('Error fetching candidate submission:', err);
        setSubmissionError(err.message || 'Failed to load submission.');
        setSubmission(null);
      })
      .finally(() => setSubmissionLoading(false));
  }, [candidateIdForSubmission]);

  // Dynamic profile object bound directly to the database data from the backend
  const info = {
    name: candidate?.fullName || 'Unknown Candidate',
    role: candidate?.position || 'Not Assigned',
    email: candidate?.email || 'No Email Provided',
    phone: candidate?.phone || 'No Phone Number Provided',
    appliedOn: candidate?.applied 
      ? new Date(candidate.applied).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }) 
      : 'Date Not Available',
    skills: candidate?.skills && candidate.skills.length > 0 
      ? candidate.skills 
      : [], 
    education: candidate?.education ? {
      degree: candidate.education,
      type: "Degree Profile",
      gpa: ''
    } : null, 
    experience: candidate?.experience ? [
      { title: candidate.experience, company: '', period: '' }
    ] : [], 
    documents: {
      resume: candidate?.resumeUrl ? candidate.resumeUrl.split('/').pop() : null,
      cnicFront: null,
      cnicBack: null,
    },
    submittedTask: submission ? {
      title: submission.submission_title || 'Task Submission',
      submittedOn: submission.task_submitted_date
        ? new Date(submission.task_submitted_date).toLocaleString()
        : 'Unknown date',
      figmaLink: submission.task_links?.[0]?.url || 'No link provided',
      notes: submission.task_comments || 'No notes provided.',
      files: (submission.task_attachments || []).map((att) => ({
        name: att.name || (att.url ? att.url.split('/').pop() : 'Attachment'),
        size: att.size || '',
      })),
    } : null,
  };

  const colors = {
    primary: '#007A7C',
    primaryDark: '#06504A',
    sidebar: '#008080',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    bg: '#effbfb',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
    success: '#2F8A4B',
    danger: '#dc3545',
    skillBg: '#DCEFEF',
    skillText: '#007A7C',
  };

  const tabs = [
    { key: 'application', label: 'Application' },
    { key: 'assign', label: 'Assign Task' },
    { key: 'submitted', label: 'Submitted Task' },
  ];

  const initials = info.name.split(' ').map(n => n[0]).join('');

  // ── Assign Task submit handler ──────────────────────────────
  const handleAssignTask = async () => {
    setAssignError('');
    setAssignSuccess('');

    if (!taskName.trim()) {
      setAssignError('Please enter a task name.');
      return;
    }
    if (!taskDescription.trim()) {
      setAssignError('Please enter a task description.');
      return;
    }
    if (!projectId.trim()) {
      setAssignError('Please enter a project ID.');
      return;
    }

    setAssigning(true);
    try {
      const formData = new FormData();
      // NOTE: backend field names confirmed from Postman: description, priority, project_id, attachment
      formData.append('title', taskName);
      formData.append('description', taskDescription);
      formData.append('priority', 'Medium');
      formData.append('project_id', projectId.trim());
      if (deadline) formData.append('due_date', deadline);
      if (attachment) formData.append('attachment', attachment);

      const res = await taskAPI.create(formData);

      if (res?.success) {
        setAssignSuccess('Task assigned successfully!');
        setTaskName('');
        setTaskDescription('');
        setDeadline('');
        setAttachment(null);
        setProjectId('');
      } else {
        setAssignError(res?.message || 'Failed to assign task.');
      }
    } catch (err) {
      console.error('Assign task error:', err);
      setAssignError(err.message || 'Failed to assign task. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  // ── Reject candidate ─────────────────────────────────────────
  const handleReject = async () => {
    if (!candidateIdForSubmission) return;
    if (!window.confirm(`Reject ${candidate?.fullName || 'this candidate'}? This will update their application status.`)) {
      return;
    }
    setRejecting(true);
    setActionMessage('');
    try {
      const res = await applicationAPI.updateStatus(candidateIdForSubmission, 'Rejected');
      if (res?.status === 'success' || res?.success) {
        setActionMessage('Candidate has been rejected.');
      } else {
        setActionMessage(res?.message || 'Failed to reject candidate.');
      }
    } catch (err) {
      console.error('Reject candidate error:', err);
      setActionMessage(err.message || 'Failed to reject candidate.');
    } finally {
      setRejecting(false);
    }
  };

  // ── Team lead selection + notification ──────────────────────
  // NOTE: there's no "team lead for a candidate" concept in the backend
  // schema yet (only project-level team lead assignment exists). Until
  // that's built, this collects a team lead's user ID and notifies them
  // via the existing messages endpoint, referencing the real submission.
  const handleChooseTeamLead = () => {
    setShowTeamLeadInput(true);
    setActionMessage('');
  };

  const handleSendToTeamLead = async () => {
    if (!teamLeadId.trim()) {
      setActionMessage('Enter a team lead user ID first.');
      return;
    }
    setSendingToLead(true);
    setActionMessage('');
    try {
      const subject = `Candidate submission: ${candidate?.fullName || 'Candidate'} (${candidate?.position || 'N/A'})`;
      const linkLine = info.submittedTask?.figmaLink ? `Repository/Link: ${info.submittedTask.figmaLink}\n` : '';
      const notesLine = info.submittedTask?.notes ? `Notes: ${info.submittedTask.notes}` : '';
      const body = `Please review the task submission for ${candidate?.fullName || 'this candidate'}, applying for ${candidate?.position || 'N/A'}.\n${linkLine}${notesLine}`;

      const res = await messageAPI.send(Number(teamLeadId), subject, body);
      if (res?.status === 'success' || res?.success) {
        setActionMessage('Sent to team lead successfully.');
        setShowTeamLeadInput(false);
        setTeamLeadId('');
      } else {
        setActionMessage(res?.message || 'Failed to send to team lead.');
      }
    } catch (err) {
      console.error('Send to team lead error:', err);
      setActionMessage(err.message || 'Failed to send to team lead.');
    } finally {
      setSendingToLead(false);
    }
  };

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

          {/* Candidate Avatar + Name */}
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

          {/* Sidebar Tabs */}
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

          {/* Create Project Button */}
          <button style={{
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
          }}>
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

            {/* Candidate Detail Card */}
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

              {/* ─── TAB CONTENT ─── */}

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
                      {info.skills.length > 0 ? (
                        info.skills.map((s) => (
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
                        ))
                      ) : (
                        <span style={{ fontSize: '13px', color: colors.textMuted }}>No skills specified</span>
                      )}
                    </div>
                  </div>

                  {/* Education & Experience */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: colors.primary, margin: '0 0 8px 0' }}>
                        Education
                      </h4>
                      {info.education ? (
                        <>
                          <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 500, color: colors.textDark }}>
                            {info.education.degree}
                          </p>
                          <p style={{ margin: '0 0 2px 0', fontSize: '13px', color: colors.textGray }}>
                            {info.education.type}
                          </p>
                        </>
                      ) : (
                        <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>Not Provided</p>
                      )}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: colors.primary, margin: '0 0 8px 0' }}>
                        Experience
                      </h4>
                      {info.experience.length > 0 ? (
                        info.experience.map((exp, idx) => (
                          <div key={idx} style={{ marginBottom: idx < info.experience.length - 1 ? '8px' : 0 }}>
                            <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 500, color: colors.textDark }}>
                              {exp.title}
                            </p>
                            {exp.company && (
                              <p style={{ margin: 0, fontSize: '13px', color: colors.textGray }}>
                                {exp.company} {exp.period && `• ${exp.period}`}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>Not Provided</p>
                      )}
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
                        {info.documents.resume ? (
                          <p style={{ fontSize: '14px', color: colors.primary, margin: '2px 0 0 0', cursor: 'pointer' }}>
                            📄 {info.documents.resume}
                          </p>
                        ) : (
                          <p style={{ fontSize: '13px', color: colors.textMuted, margin: '2px 0 0 0' }}>Not uploaded</p>
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: 0 }}>CNIC Front</p>
                        {info.documents.cnicFront ? (
                          <p style={{ fontSize: '14px', color: colors.primary, margin: '2px 0 0 0', cursor: 'pointer' }}>
                            📄 {info.documents.cnicFront}
                          </p>
                        ) : (
                          <p style={{ fontSize: '13px', color: colors.textMuted, margin: '2px 0 0 0' }}>Not uploaded</p>
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, margin: 0 }}>CNIC Back</p>
                        {info.documents.cnicBack ? (
                          <p style={{ fontSize: '14px', color: colors.primary, margin: '2px 0 0 0', cursor: 'pointer' }}>
                            📄 {info.documents.cnicBack}
                          </p>
                        ) : (
                          <p style={{ fontSize: '13px', color: colors.textMuted, margin: '2px 0 0 0' }}>Not uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Download buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button style={{
                      padding: '8px 20px',
                      background: info.documents.resume ? colors.lightTeal : '#f5f7f7',
                      color: info.documents.resume ? colors.primary : colors.textMuted,
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: info.documents.resume ? 'pointer' : 'not-allowed',
                      fontFamily: "'Poppins', sans-serif",
                    }} disabled={!info.documents.resume}>
                      ⬇ Download resume/CV
                    </button>
                    <button style={{
                      padding: '8px 20px',
                      background: '#f5f7f7',
                      color: colors.textMuted,
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'not-allowed',
                      fontFamily: "'Poppins', sans-serif",
                    }} disabled>
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
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
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
                        Project ID
                      </label>
                      <input
                        type="number"
                        placeholder="Enter project ID (e.g. 4)"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
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
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
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
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
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
                      <div
                        onClick={() => document.getElementById('assign-task-file-input').click()}
                        style={{
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
                        {attachment && (
                          <p style={{ margin: '8px 0 0 0', color: colors.primary, fontSize: '13px', fontWeight: 600 }}>
                            <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
                            {attachment.name}
                          </p>
                        )}
                        <input
                          id="assign-task-file-input"
                          type="file"
                          accept=".zip,.rar,.pdf"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files.length > 0) {
                              setAttachment(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {assignError && (
                      <p style={{ color: colors.danger, fontSize: '13px', margin: 0 }}>{assignError}</p>
                    )}
                    {assignSuccess && (
                      <p style={{ color: colors.success, fontSize: '13px', margin: 0 }}>{assignSuccess}</p>
                    )}
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                    <button style={{
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
                    }}>
                      <i className="fas fa-plus-circle" style={{ marginRight: '6px' }}></i>
                      Create Project
                    </button>
                    <button
                      onClick={handleAssignTask}
                      disabled={assigning}
                      style={{
                        flex: 2,
                        background: colors.primary,
                        color: '#fff',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: assigning ? 'not-allowed' : 'pointer',
                        opacity: assigning ? 0.7 : 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                      <i className={`fas ${assigning ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} style={{ marginRight: '6px' }}></i>
                      {assigning ? 'Assigning...' : 'Assign task & Notify candidate'}
                    </button>
                  </div>
                </div>
              )}

              {/* 3. SUBMITTED TASK */}
              {activeTab === 'submitted' && (
                <div>
                  {submissionLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.textMuted }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>Loading submission...</p>
                    </div>
                  ) : submissionError ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.danger }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>{submissionError}</p>
                    </div>
                  ) : info.submittedTask ? (
                    <>
                      <div style={{
                        background: colors.lightTeal,
                        borderRadius: '12px',
                        padding: '16px 20px',
                        marginBottom: '20px',
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

                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, margin: '0 0 4px 0' }}>
                          Additional notes
                        </p>
                        <p style={{ fontSize: '14px', color: colors.textGray, margin: 0, lineHeight: 1.6 }}>
                          {info.submittedTask.notes}
                        </p>
                      </div>

                      {info.submittedTask.files.map((file, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: '#f8f9fa',
                          borderRadius: '10px',
                          marginBottom: '8px',
                        }}>
                          <div>
                            <p style={{ margin: 0, fontSize: '14px', color: colors.textDark }}>
                              <i className="fas fa-file-pdf" style={{ marginRight: '8px', color: colors.danger }}></i>
                              {file.name}
                            </p>
                          </div>
                          <span style={{ fontSize: '12px', color: colors.textGray }}>{file.size}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.textMuted }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>No task has been submitted yet by this candidate.</p>
                    </div>
                  )}

                  {showTeamLeadInput && (
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        placeholder="Team lead user ID"
                        value={teamLeadId}
                        onChange={(e) => setTeamLeadId(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: `1.5px solid ${colors.border}`,
                          fontSize: '13px',
                          fontFamily: "'Poppins', sans-serif",
                          width: '160px',
                        }}
                      />
                    </div>
                  )}

                  {actionMessage && (
                    <p style={{ marginTop: '12px', fontSize: '13px', color: colors.textDark }}>{actionMessage}</p>
                  )}

                  <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={handleReject}
                      disabled={rejecting}
                      style={{
                        padding: '10px 24px',
                        background: colors.danger,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: rejecting ? 'not-allowed' : 'pointer',
                        opacity: rejecting ? 0.7 : 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                      <i className="fas fa-times" style={{ marginRight: '6px' }}></i>
                      {rejecting ? 'Rejecting...' : 'Reject'}
                    </button>
                    <button
                      onClick={handleChooseTeamLead}
                      style={{
                        padding: '10px 24px',
                        background: colors.primary,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                      <i className="fas fa-user-tie" style={{ marginRight: '6px' }}></i>
                      Choose team lead
                    </button>
                    <button
                      onClick={handleSendToTeamLead}
                      disabled={sendingToLead}
                      style={{
                        padding: '10px 24px',
                        background: colors.success,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: sendingToLead ? 'not-allowed' : 'pointer',
                        opacity: sendingToLead ? 0.7 : 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                      <i className="fas fa-paper-plane" style={{ marginRight: '6px' }}></i>
                      {sendingToLead ? 'Sending...' : 'Send to team lead'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}