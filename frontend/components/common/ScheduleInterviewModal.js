// components/common/ScheduleInterviewModal.js
import { useState, useEffect } from 'react';

export default function ScheduleInterviewModal({ isOpen, onClose, onSchedule, candidates = [] }) {
  const [form, setForm] = useState({
    candidate: '',
    date: '',
    time: '',
    mode: 'Video call',
    interviewer: '',
  });

  // 👈 Automatically default selection to the first candidate when the database items finish loading
  useEffect(() => {
    if (isOpen && candidates.length > 0 && !form.candidate) {
      setForm((prev) => ({ ...prev, candidate: '0' }));
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSchedule) {
      onSchedule(form);
    }
    // Optional: reset the candidate selection when closing so it refreshes next run
    setForm(prev => ({ ...prev, candidate: '' }));
    onClose();
  };

  if (!isOpen) return null;

  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    cardBg: '#FFFFFF',
    lightTeal: '#E8F5F5',
  };

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '18px',
          padding: '32px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(2,10,20,0.3)',
          fontFamily: "'Poppins', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: colors.textDark }}>Schedule Interview</h2>
          <button
            onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Candidate Dropdown Selection Field */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
                Candidate
              </label>
              {candidates.length > 0 ? (
                <select
                  value={form.candidate}
                  // ✅ Keep it simple: standard strings eliminate React selection bugs
                  onChange={(e) => setForm({ ...form, candidate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    color: colors.textDark,
                    background: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                >
                  <option value="">Select candidate</option>
                  <option value="">Select candidate</option>
                  {candidates.map((c, idx) => (
                    <option key={idx} value={idx}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Enter candidate name"
                  value={form.candidate}
                  onChange={(e) => setForm({ ...form, candidate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    color: colors.textDark,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              )}
            </div>

            {/* Date Input */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  fontSize: '14px',
                  fontFamily: "'Poppins', sans-serif",
                  color: colors.textDark,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            {/* Time Input */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
                Time
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  fontSize: '14px',
                  fontFamily: "'Poppins', sans-serif",
                  color: colors.textDark,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            {/* Mode Select */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
                Mode
              </label>
              <select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  fontSize: '14px',
                  fontFamily: "'Poppins', sans-serif",
                  color: colors.textDark,
                  background: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Video call">Video call</option>
                <option value="In person">In person</option>
                <option value="Phone">Phone</option>
              </select>
            </div>

            {/* Interviewer Name Text Input */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.textDark, display: 'block', marginBottom: '6px' }}>
                Interviewer
              </label>
              <input
                type="text"
                placeholder="Interviewer name"
                value={form.interviewer}
                onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  fontSize: '14px',
                  fontFamily: "'Poppins', sans-serif",
                  color: colors.textDark,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            <button
              type="submit"
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
              onMouseEnter={(e) => (e.currentTarget.style.background = '#046466')}
              onMouseLeave={(e) => (e.currentTarget.style.background = colors.primary)}
            >
              Schedule & add to application progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}