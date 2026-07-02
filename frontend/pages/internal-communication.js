import { useState } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';

export default function InternalCommunication() {
  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    cardBg: '#FFFFFF',
  };

  const [task, setTask] = useState({
    space: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Task created successfully! (mock)');
    // In future: API call to create task
  };

  return (
    <HRLayout>
      <HRPageLayout title="Internal Communication">
        <div style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: colors.textDark, marginBottom: '20px' }}>
            <i className="fas fa-tasks" style={{ marginRight: '8px', color: colors.primary }}></i>
            Create Task
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Space */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Space</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., HR, Development"
                  value={task.space}
                  onChange={(e) => setTask({ ...task, space: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px' }}
                />
              </div>
              {/* Work type */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Work type</label>
                <select
                  className="form-select"
                  value={task.workType}
                  onChange={(e) => setTask({ ...task, workType: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px', background: 'white' }}
                >
                  <option value="">Select...</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Research">Research</option>
                </select>
              </div>
              {/* Status */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Status</label>
                <select
                  className="form-select"
                  value={task.status}
                  onChange={(e) => setTask({ ...task, status: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px', background: 'white' }}
                >
                  <option value="">Select...</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              {/* Priority */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Priority</label>
                <select
                  className="form-select"
                  value={task.priority}
                  onChange={(e) => setTask({ ...task, priority: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px', background: 'white' }}
                >
                  <option value="">Select...</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Summary</label>
              <input
                type="text"
                className="form-input"
                placeholder="Short summary of the task"
                value={task.summary}
                onChange={(e) => setTask({ ...task, summary: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px' }}
              />
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Description</label>
              <textarea
                className="form-input"
                rows="3"
                placeholder="Detailed description..."
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              {/* Assignee */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Assignee</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Assign to..."
                  value={task.assignee}
                  onChange={(e) => setTask({ ...task, assignee: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px' }}
                />
              </div>
              {/* Reporter */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Reporter</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={task.reporter}
                  onChange={(e) => setTask({ ...task, reporter: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              {/* Start date */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Start date</label>
                <input
                  type="date"
                  className="form-input"
                  value={task.startDate}
                  onChange={(e) => setTask({ ...task, startDate: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px' }}
                />
              </div>
              {/* Due date */}
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Due date</label>
                <input
                  type="date"
                  className="form-input"
                  value={task.dueDate}
                  onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Attachment */}
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Attachment</label>
              <div style={{
                border: `2px dashed ${colors.border}`,
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#fafafa'
              }}
              onClick={() => document.getElementById('file-upload').click()}
              >
                <i className="fas fa-cloud-upload-alt" style={{ fontSize: '24px', color: colors.textGray, display: 'block', marginBottom: '8px' }}></i>
                <p style={{ margin: 0, color: colors.textGray, fontSize: '14px' }}>Drag and drop your files here or click to browse files</p>
                <input
                  id="file-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => setTask({ ...task, attachment: e.target.files[0] })}
                />
                {task.attachment && <p style={{ marginTop: '8px', color: colors.primary, fontSize: '13px' }}>📎 {task.attachment.name}</p>}
              </div>
            </div>

            {/* Choose team */}
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: colors.textDark }}>Choose team</label>
              <select
                className="form-select"
                value={task.team}
                onChange={(e) => setTask({ ...task, team: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '14px', background: 'white' }}
              >
                <option value="">Select team...</option>
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '24px',
                width: '100%',
                background: colors.primary,
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              <i className="fas fa-plus-circle" style={{ marginRight: '8px' }}></i> Create Task
            </button>
          </form>
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}