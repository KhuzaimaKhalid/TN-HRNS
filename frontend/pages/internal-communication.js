// pages/internal-communication.js
import { useState, useRef } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';

export default function InternalCommunication() {
  const [activeTab, setActiveTab] = useState('Summary');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [workItems, setWorkItems] = useState([
    {
      id: 1,
      work: 'Work on screens (wireframe)',
      assignee: 'Unassigned',
      reporter: 'abc',
      priority: 'Highest',
      status: 'To do',
      resolution: 'Unresolved',
      created: 'Jul 7, 2026',
      updated: 'Jul 7, 2026',
      dueDate: '2026-07-14',
    },
  ]);
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

  const handleDelete = () => {
    setWorkItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  // ✅ FIX: work = workType (primary) → summary (fallback) → 'New Task'
  const handleCreate = () => {
    const newWorkItem = {
      id: Date.now(),
      work: newItem.workType || newItem.summary || 'New Task',
      assignee: newItem.assignee || 'Unassigned',
      reporter: newItem.reporter || 'abc',
      priority: newItem.priority || 'Medium',
      status: newItem.status || 'To do',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: newItem.dueDate || 'TBD',
      startDate: newItem.startDate || 'TBD',
      team: newItem.team || 'Unassigned',
      attachment: newItem.attachment ? newItem.attachment.name : null,
      resolution: 'Unresolved',
    };
    setWorkItems((prev) => [...prev, newWorkItem]);
    setShowCreateModal(false);
    setNewItem({
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
  };

  const handleStatusChange = () => {
    if (!statusChange) return;
    setWorkItems((prev) =>
      prev.map((item) =>
        selectedItems.includes(item.id) ? { ...item, status: statusChange } : item
      )
    );
    setSelectedItems([]);
    setShowStatusModal(false);
    setStatusChange('');
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

  const actionButtonStyle = {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.2s',
  };

  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    bg: '#effbfb',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
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
            background: '#ffffff',
            border: `1px solid ${colors.border}`,
            borderRadius: '18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
        >
          {/* Title */}
          <div style={{ padding: '18px 24px 14px', borderBottom: `1px solid ${colors.border}` }}>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#17181a' }}>TN-HRMS</h1>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '26px',
              padding: '12px 24px',
              borderBottom: `1px solid ${colors.border}`,
              overflowX: 'auto',
            }}
          >
            {tabs.map((tab) => (
              <span
                key={tab}
                style={{
                  fontSize: '13.5px',
                  color: activeTab === tab ? '#17181a' : '#8a8f98',
                  fontWeight: activeTab === tab ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  paddingBottom: 2,
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* ─── Table ────────────────────────────────────────── */}
          {workItems.length === 0 ? (
            <div style={{ position: 'relative', minHeight: 220, borderBottom: `1px solid ${colors.border}` }}>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  padding: '0 40px',
                  maxWidth: 460,
                }}
              >
                <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#17181a' }}>
                  There are no work items here yet
                </p>
                <p style={{ margin: 0, fontSize: 13.5, color: '#8a8f98', lineHeight: 1.5 }}>
                  You either don't have any work items or your existing ones don't match your current filters.
                </p>
              </div>
              {/* Fake vertical scrollbar (decorative) */}
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 6,
                  bottom: 10,
                  width: 6,
                  background: '#eceef0',
                  borderRadius: 4,
                }}
              >
                <div style={{ width: '100%', height: '55%', background: '#b9bcc2', borderRadius: 4 }} />
              </div>
            </div>
          ) : (
            // ─── Table container with horizontal & vertical scroll ──────
            <div
              style={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: '400px',
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <table
                style={{
                  width: '1300px',
                  minWidth: '1300px',
                  borderCollapse: 'collapse',
                  tableLayout: 'fixed',
                }}
              >
                <colgroup>
                  <col style={{ width: '50px' }} />
                  <col style={{ width: '180px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '140px' }} />
                  <col style={{ width: '140px' }} />
                  <col style={{ width: '140px' }} />
                </colgroup>
                <thead
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    background: '#ffffff',
                  }}
                >
                  <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                    <th style={{ padding: '10px 8px', textAlign: 'left' }}>
                      <input
                        type="checkbox"
                        checked={selectedItems.length === workItems.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {tableColumns.map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: '10px 8px',
                          textAlign: 'left',
                          color: '#17181a',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          background: '#ffffff',
                          position: 'sticky',
                          top: 0,
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {workItems.map((item) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '10px 8px' }}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td style={{ padding: '10px 8px', color: '#17181a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.work}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#17181a', whiteSpace: 'nowrap' }}>
                        {item.assignee}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#17181a', whiteSpace: 'nowrap' }}>
                        {item.reporter}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#17181a', whiteSpace: 'nowrap' }}>
                        {item.priority}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#17181a', whiteSpace: 'nowrap' }}>
                        {item.status}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#17181a', whiteSpace: 'nowrap' }}>
                        {item.resolution || 'Unresolved'}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#17181a', whiteSpace: 'nowrap' }}>
                        {item.created}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#17181a', whiteSpace: 'nowrap' }}>
                        {item.updated}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#17181a', whiteSpace: 'nowrap' }}>
                        {item.dueDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── Footer: + Create ────────────────────────────────── */}
          <div style={{ padding: '10px 24px' }}>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#45484d',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600 }}>+</span> Create
            </button>
          </div>
        </div>

        {/* ─── Bulk Actions Bar ──────────────────────────────────── */}
        {workItems.length > 0 && selectedItems.length > 0 && (
          <div
            style={{
              marginTop: '24px',
              padding: '12px 20px',
              background: '#1e293b',
              color: '#ffffff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{selectedItems.length} Selected</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <button style={actionButtonStyle} onClick={handleSelectAll}>
                Select all
              </button>
              <button style={actionButtonStyle}>Edit fields</button>
              <button style={actionButtonStyle} onClick={() => setShowStatusModal(true)}>
                Change status
              </button>
              <button
                style={{
                  ...actionButtonStyle,
                  background: 'rgba(220,53,69,0.8)',
                  border: 'none',
                }}
                onClick={handleDelete}
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
              background: 'rgba(0,0,0,0.5)',
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
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '560px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}>Create Task</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {/* Project */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                    Project
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., HR, Development"
                    value={newItem.project}
                    onChange={(e) => setNewItem({ ...newItem, project: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`,
                    }}
                  />
                </div>

                {/* Work type & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                      Work type
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Design, Development"
                      value={newItem.workType}
                      onChange={(e) => setNewItem({ ...newItem, workType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border}`,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                      Status
                    </label>
                    <select
                      className="form-select"
                      value={newItem.status}
                      onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border}`,
                        background: '#fff',
                      }}
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
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                    Summary
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Short summary of the task"
                    value={newItem.summary}
                    onChange={(e) => setNewItem({ ...newItem, summary: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`,
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                    Description
                  </label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Detailed description..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  />
                </div>

                {/* Assignee & Reporter */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                      Assignee
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Assignee"
                      value={newItem.assignee}
                      onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border}`,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                      Reporter
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Reporter"
                      value={newItem.reporter}
                      onChange={(e) => setNewItem({ ...newItem, reporter: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border}`,
                      }}
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                    Priority
                  </label>
                  <select
                    className="form-select"
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`,
                      background: '#fff',
                    }}
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
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                      Start date
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={newItem.startDate}
                      onChange={(e) => setNewItem({ ...newItem, startDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border}`,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                      Due date
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={newItem.dueDate}
                      onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border}`,
                      }}
                    />
                  </div>
                </div>

                {/* Attachment */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                    Attachment
                  </label>
                  <div
                    style={{
                      border: `2px dashed ${colors.border}`,
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: '#fafafa',
                      transition: 'all 0.2s',
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    onMouseEnter={(e) => (e.target.style.borderColor = '#007A7C')}
                    onMouseLeave={(e) => (e.target.style.borderColor = colors.border)}
                  >
                    <i
                      className="fas fa-cloud-upload-alt"
                      style={{ fontSize: '28px', color: '#666', display: 'block', marginBottom: '8px' }}
                    ></i>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      Drag and drop your files here or click to browse files
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    {newItem.attachment && (
                      <p style={{ marginTop: '8px', color: '#007A7C', fontSize: '13px' }}>
                        📎 {newItem.attachment.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Choose team */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                    Choose team
                  </label>
                  <select
                    className="form-select"
                    value={newItem.team}
                    onChange={(e) => setNewItem({ ...newItem, team: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`,
                      background: '#fff',
                    }}
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
                    background: '#007A7C',
                    color: '#fff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '16px',
                    marginTop: '8px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onClick={handleCreate}
                >
                  Create Project
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
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '100%' }}>
              <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1A1A1A' }}>Change status</h3>
              <select
                className="form-select"
                value={statusChange}
                onChange={(e) => setStatusChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  background: '#fff',
                  marginBottom: '16px',
                }}
              >
                <option value="">Select Status</option>
                <option value="To do">To do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  style={{
                    background: 'transparent',
                    border: `1px solid ${colors.border}`,
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
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
                    background: '#007A7C',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
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