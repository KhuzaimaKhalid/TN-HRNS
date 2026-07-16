// pages/internal-communication.js
import { useState, useEffect, useRef } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import { taskAPI } from '@/services/api';

// Converts a raw task row from the backend into the shape this page's table expects
function mapTaskFromBackend(t) {
  return {
    id: t.task_id,
    work: t.title,
    assignee: t.assigned_user_name || t.assignee_name || 'Unassigned',
    reporter: t.reporter || 'Unknown',
    priority: t.priority || 'Medium',
    status: t.status || 'To do',
    resolution: t.status && t.status.toLowerCase().includes('done') ? 'Resolved' : 'Unresolved',
    created: t.created_at
      ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
    updated: t.updated_at
      ? new Date(t.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
    dueDate: t.due_date || '',
  };
}

export default function InternalCommunication() {
  const [activeTab, setActiveTab] = useState('Summary');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({
    project: '',
    workType: '',
    status: '',
    summary: '',
    description: '',
    assignee: '',
    reporter: '',
    priority: '',
    startDate: '',
    dueDate: '',
    attachment: null,
    team: '',
  });
  const [statusChange, setStatusChange] = useState('');
  const fileInputRef = useRef(null);

  const tabs = ['Summary', 'Board', 'List', 'Calendar', 'Timeline', 'Approvals', 'Forms', 'Docs', 'Attachments'];

  const colors = {
    primary: '#007A7C',
    primaryDark: '#046466',
    border: '#e3e8ea',
    borderDark: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    textMuted: '#8a8f98',
    bg: '#effbfb',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  // ─── Load real tasks from the backend on mount ─────────────
  useEffect(() => {
    let isMounted = true;
    async function fetchTasks() {
      try {
        const res = await taskAPI.getAll();
        if (!isMounted) return;
        if (res.success) {
          setWorkItems(res.data.map(mapTaskFromBackend));
        } else {
          setError(res.message || 'Failed to load tasks');
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load tasks');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchTasks();
    return () => { isMounted = false; };
  }, []);

  const handleSelectAll = () => {
    if (selectedItems.length === workItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(workItems.map((item) => item.id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ─── Delete: now actually calls the backend ─────────────
  const handleDelete = async () => {
    if (selectedItems.length === 0) return;
    setError(null);
    try {
      const res = await taskAPI.bulkDelete(selectedItems);
      if (res.success) {
        setWorkItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
        setSelectedItems([]);
      } else {
        setError(res.message || 'Failed to delete tasks');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete tasks');
    }
  };

  // work = workType (primary) → summary (fallback) → 'New Task'
  const handleCreate = async () => {
    const formData = new FormData();
    formData.append('title', newItem.workType || newItem.summary || 'New Task');
    formData.append('description', newItem.description);
    formData.append('project_name', newItem.project);
    formData.append('assignee_name', newItem.assignee);
    formData.append('reporter', newItem.reporter);
    formData.append('priority', newItem.priority);
    formData.append('start_date', newItem.startDate);
    formData.append('due_date', newItem.dueDate);
    formData.append('team', newItem.team);
    formData.append('status', newItem.status || 'To do');
    if (newItem.attachment) formData.append('attachment', newItem.attachment);

    try {
      const res = await taskAPI.create(formData);
      if (res.success) {
        const t = res.data;
        setWorkItems((prev) => [...prev, {
          id: t.task_id,
          work: t.title,
          assignee: t.assignee_name || 'Unassigned',
          reporter: t.reporter || 'abc',
          priority: t.priority || 'Medium',
          status: t.status || 'To do',
          resolution: 'Unresolved',
          created: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          updated: new Date(t.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          dueDate: t.due_date,
        }]);
        setShowCreateModal(false);
        setNewItem({ project: '', workType: '', status: '', summary: '', description: '', assignee: '', reporter: '', priority: '', startDate: '', dueDate: '', attachment: null, team: '' });
      } else {
        alert(res.message || 'Failed to create task.');
      }
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Something went wrong creating the task.');
    }
  };

  // ─── Status change: now actually calls the backend ─────────────
  const handleStatusChange = async () => {
    if (!statusChange || selectedItems.length === 0) return;
    setError(null);
    try {
      const results = await Promise.all(
        selectedItems.map((id) => taskAPI.updateStatus(id, statusChange))
      );
      const allOk = results.every((r) => r.success);
      if (allOk) {
        setWorkItems((prev) =>
          prev.map((item) =>
            selectedItems.includes(item.id) ? { ...item, status: statusChange } : item
          )
        );
      } else {
        setError('Some tasks failed to update.');
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setSelectedItems([]);
      setShowStatusModal(false);
      setStatusChange('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setNewItem({ ...newItem, attachment: e.target.files[0] });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setNewItem({ ...newItem, attachment: e.dataTransfer.files[0] });
    }
  };

  // ─── Badge helpers ─────────────────────────────────────────
  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s.includes('done')) return { bg: '#d4edda', color: '#1e7e34' };
    if (s.includes('progress')) return { bg: '#cfe8ff', color: '#0b5ed7' };
    if (s.includes('to do')) return { bg: '#ffe8cc', color: '#c2660c' };
    return { bg: '#e9ecef', color: '#495057' };
  };

  const getPriorityBadge = (priority) => {
    const p = priority.toLowerCase();
    if (p.includes('highest')) return { bg: '#f8d7da', color: '#c0392b' };
    if (p.includes('high')) return { bg: '#ffe3cf', color: '#d1650f' };
    if (p.includes('medium')) return { bg: '#fff3cd', color: '#856404' };
    if (p.includes('low')) return { bg: '#e2f0d9', color: '#4c7a2e' };
    return { bg: '#e9ecef', color: '#495057' };
  };

  const getInitials = (name) =>
    name === 'Unassigned'
      ? '—'
      : name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

  const actionButtonStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.25)',
    color: '#ffffff',
    padding: '7px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.2s',
  };

  const fieldLabelStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: colors.textDark,
    display: 'block',
    marginBottom: '6px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
    color: colors.textDark,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  const tableColumns = [
    'Work',
    'Assignee',
    'Reporter',
    'Priority',
    'Status',
    'Resolution',
    'Created',
    'Updated',
    'Due date',
  ];

  return (
    <HRLayout>
      <HRPageLayout title="Internal Communication">
        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.borderDark}`,
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(2,10,20,0.05)',
            overflow: 'hidden',
            maxWidth: '100%',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {/* Title */}
          <div
            style={{
              padding: '20px 26px 16px',
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  background: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                TN
              </div>
              <h1 style={{ margin: 0, fontSize: '19px', fontWeight: 700, color: colors.textDark }}>
                TN-HRMS
              </h1>
            </div>
            <span
              style={{
                fontSize: '12.5px',
                fontWeight: 500,
                color: colors.textMuted,
                background: '#f4f6f7',
                padding: '5px 12px',
                borderRadius: '20px',
              }}
            >
              {workItems.length} {workItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '8px 20px 0',
              borderBottom: `1px solid ${colors.border}`,
              overflowX: 'auto',
            }}
          >
            {tabs.map((tab) => (
              <span
                key={tab}
                style={{
                  fontSize: '13.5px',
                  color: activeTab === tab ? colors.primary : colors.textMuted,
                  fontWeight: activeTab === tab ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  padding: '8px 12px',
                  borderBottom: activeTab === tab ? `2.5px solid ${colors.primary}` : '2.5px solid transparent',
                  transition: 'color 0.15s',
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* ─── Error banner ────────────────────────────────── */}
          {error && (
            <div style={{
              background: '#f8d7da', color: '#c0392b', padding: '12px 16px',
              margin: '16px 26px', borderRadius: '8px', fontSize: '13px',
              fontFamily: "'Poppins', sans-serif",
            }}>
              {error}
            </div>
          )}

          {/* ─── Table ────────────────────────────────────────── */}
          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: colors.textMuted, fontSize: '14px' }}>
              Loading tasks...
            </div>
          ) : workItems.length === 0 ? (
            <>
              <div style={{ borderBottom: `1px solid ${colors.borderDark}` }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#eceff1', borderBottom: `1px solid ${colors.borderDark}` }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', width: '44px' }}>
                        <input type="checkbox" disabled style={{ cursor: 'not-allowed' }} />
                      </th>
                      {tableColumns.slice(3).map((col) => (
                        <th
                          key={col}
                          style={{
                            padding: '14px 16px',
                            textAlign: 'left',
                            color: colors.textDark,
                            fontWeight: 600,
                            fontSize: '14px',
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: colors.textDark }}>
                  There are no work items here yet
                </p>
                <p style={{ margin: 0, fontSize: 13.5, color: colors.textMuted, lineHeight: 1.5 }}>
                  You either don't have any work items or your existing ones don't match your current filters.
                </p>
              </div>
            </>
          ) : (
            // ─── Table container ──────
            <div
              style={{
                width: '100%',
                overflowX: 'auto',
                borderBottom: `1px solid ${colors.borderDark}`,
              }}
            >
              <table
                style={{
                  width: '100%',
                  minWidth: '760px',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr style={{ background: '#eceff1', borderBottom: `1px solid ${colors.borderDark}` }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', width: '44px' }}>
                      <input
                        type="checkbox"
                        checked={selectedItems.length === workItems.length}
                        onChange={handleSelectAll}
                        style={{ cursor: 'pointer', accentColor: colors.primary }}
                      />
                    </th>
                    {tableColumns.map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: '14px 16px',
                          textAlign: 'left',
                          color: colors.textDark,
                          fontWeight: 600,
                          fontSize: '14px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {workItems.map((item, idx) => {
                    const statusInfo = getStatusBadge(item.status);
                    const priorityInfo = getPriorityBadge(item.priority);
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: idx < workItems.length - 1 ? `1px solid ${colors.borderDark}` : 'none',
                          background: isSelected ? colors.lightTeal : 'transparent',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#fafbfc'; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '16px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectItem(item.id)}
                            style={{ cursor: 'pointer', accentColor: colors.primary }}
                          />
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            color: colors.textDark,
                            fontSize: '14px',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.work}
                        </td>
                        <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: item.assignee === 'Unassigned' ? '#e9ecef' : colors.lightTeal,
                                color: item.assignee === 'Unassigned' ? colors.textMuted : colors.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {getInitials(item.assignee)}
                            </div>
                            <span style={{ fontSize: '14px', color: colors.textDark }}>{item.assignee}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px', color: colors.textDark, fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {item.reporter}
                        </td>
                        <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              background: priorityInfo.bg,
                              color: priorityInfo.color,
                              padding: '5px 14px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 600,
                              display: 'inline-block',
                            }}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              background: statusInfo.bg,
                              color: statusInfo.color,
                              padding: '5px 14px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 600,
                              display: 'inline-block',
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px', color: colors.textDark, fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {item.resolution || 'Unresolved'}
                        </td>
                        <td style={{ padding: '16px', color: colors.textDark, fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {item.created}
                        </td>
                        <td style={{ padding: '16px', color: colors.textDark, fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {item.updated}
                        </td>
                        <td style={{ padding: '16px', color: colors.textDark, fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {item.dueDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── Footer: + Create ────────────────────────────────── */}
          <div style={{ padding: '12px 26px' }}>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
                color: colors.primary,
                cursor: 'pointer',
                padding: '4px 0',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700 }}>+</span> Create
            </button>
          </div>
        </div>

        {/* ─── Bulk Actions Bar ──────────────────────────────────── */}
        {workItems.length > 0 && selectedItems.length > 0 && (
          <div
            style={{
              marginTop: '20px',
              padding: '14px 22px',
              background: 'linear-gradient(135deg, #0f2027 0%, #203a43 60%, #2c5364 100%)',
              color: '#ffffff',
              borderRadius: '14px',
              boxShadow: '0 6px 18px rgba(2,10,20,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{selectedItems.length} Selected</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <button
                style={actionButtonStyle}
                onClick={handleSelectAll}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                Select all
              </button>
              <button
                style={actionButtonStyle}
                onClick={() => setShowStatusModal(true)}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                Change status
              </button>
              <button
                style={{
                  ...actionButtonStyle,
                  background: '#e74c3c',
                  border: 'none',
                }}
                onClick={handleDelete}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#c0392b')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#e74c3c')}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* ─── Create Task Modal ────────────────────────────────── */}
        {showCreateModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(2,10,20,0.55)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: '18px',
                padding: '30px 32px',
                maxWidth: '560px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(2,10,20,0.3)',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: colors.textDark }}>Create Task</h2>
                  <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: colors.textMuted }}>
                    Add a new work item to the board
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    background: '#f4f6f7',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: colors.textGray,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {/* Project */}
                <div>
                  <label style={fieldLabelStyle}>Project</label>
                  <input
                    type="text"
                    placeholder="e.g., HR, Development"
                    value={newItem.project}
                    onChange={(e) => setNewItem({ ...newItem, project: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Work type & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Work type</label>
                    <input
                      type="text"
                      placeholder="e.g., Design, Development"
                      value={newItem.workType}
                      onChange={(e) => setNewItem({ ...newItem, workType: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Status</label>
                    <select
                      value={newItem.status}
                      onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                      style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }}
                    >
                      <option value="">Select...</option>
                      <option value="To do">To do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label style={fieldLabelStyle}>Summary</label>
                  <input
                    type="text"
                    placeholder="Short summary of the task"
                    value={newItem.summary}
                    onChange={(e) => setNewItem({ ...newItem, summary: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={fieldLabelStyle}>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Detailed description..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Assignee & Reporter */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Assignee</label>
                    <input
                      type="text"
                      placeholder="Assignee"
                      value={newItem.assignee}
                      onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Reporter</label>
                    <input
                      type="text"
                      placeholder="Reporter"
                      value={newItem.reporter}
                      onChange={(e) => setNewItem({ ...newItem, reporter: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label style={fieldLabelStyle}>Priority</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                    style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }}
                  >
                    <option value="">Select...</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Highest">Highest</option>
                  </select>
                </div>

                {/* Start Date & Due Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Start date</label>
                    <input
                      type="date"
                      value={newItem.startDate}
                      onChange={(e) => setNewItem({ ...newItem, startDate: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Due date</label>
                    <input
                      type="date"
                      value={newItem.dueDate}
                      onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Attachment */}
                <div>
                  <label style={fieldLabelStyle}>Attachment</label>
                  <div
                    style={{
                      border: `2px dashed ${colors.border}`,
                      borderRadius: '12px',
                      padding: '26px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: '#fafbfc',
                      transition: 'all 0.2s',
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.border)}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: colors.lightTeal,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px',
                      }}
                    >
                      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '18px', color: colors.primary }}></i>
                    </div>
                    <p style={{ margin: 0, color: colors.textGray, fontSize: '13.5px' }}>
                      Drag and drop your files here or click to browse files
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    {newItem.attachment && (
                      <p style={{ marginTop: '10px', color: colors.primary, fontSize: '13px', fontWeight: 500 }}>
                        📎 {newItem.attachment.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Choose team */}
                <div>
                  <label style={fieldLabelStyle}>Choose team</label>
                  <select
                    value={newItem.team}
                    onChange={(e) => setNewItem({ ...newItem, team: e.target.value })}
                    style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }}
                  >
                    <option value="">Select team...</option>
                    <option value="Design">Design</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>

                <button
                  style={{
                    background: colors.primary,
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '15px',
                    marginTop: '6px',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'background 0.15s',
                  }}
                  onClick={handleCreate}
                  onMouseEnter={(e) => (e.currentTarget.style.background = colors.primaryDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = colors.primary)}
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Change Status Modal ────────────────────────────────── */}
        {showStatusModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(2,10,20,0.55)',
              backdropFilter: 'blur(4px)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '26px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 20px 50px rgba(2,10,20,0.3)',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: '16px', color: colors.textDark, fontSize: '17px', fontWeight: 700 }}>
                Change status
              </h3>
              <select
                value={statusChange}
                onChange={(e) => setStatusChange(e.target.value)}
                style={{ ...inputStyle, background: '#fff', cursor: 'pointer', marginBottom: '18px' }}
              >
                <option value="">Select Status</option>
                <option value="To do">To do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  style={{
                    background: 'transparent',
                    border: `1px solid ${colors.border}`,
                    padding: '9px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '13.5px',
                    color: colors.textDark,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusChange('');
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    background: colors.primary,
                    color: '#fff',
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onClick={handleStatusChange}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </HRPageLayout>
    </HRLayout>
  );
}