// pages/create-project.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';

export default function CreateProject() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('details'); // for bottom tabs

  const colors = {
    primary: '#007A7C',
    lightTeal: '#E8F5F5',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
    cardBg: '#FFFFFF',
    greenIcon: '#2F8A4B',
  };

  // Bottom tabs (as per image)
  const bottomTabs = [
    { key: 'save', label: 'Save As/Add' },
    { key: 'approve', label: 'Approve' },
    { key: 'manage', label: 'Manage Tasks' },
    { key: 'submittal', label: 'Submittal Tasks' },
    { key: 'review', label: 'Review' },
  ];

  return (
    <HRLayout>
      <HRPageLayout title="Create Project">
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '32px 28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          {/* ─── Form ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Project Name */}
            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: 600,
                color: colors.textDark,
                display: 'block',
                marginBottom: '6px',
              }}>
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

            {/* Description */}
            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: 600,
                color: colors.textDark,
                display: 'block',
                marginBottom: '6px',
              }}>
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

            {/* Form Team */}
            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: 600,
                color: colors.textDark,
                display: 'block',
                marginBottom: '6px',
              }}>
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

            {/* Target Timeline */}
            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: 600,
                color: colors.textDark,
                display: 'block',
                marginBottom: '6px',
              }}>
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

            {/* Create Project Button */}
            <button style={{
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
            onMouseEnter={(e) => e.currentTarget.style.background = '#06504A'}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.primary}
            >
              Create project
            </button>
          </div>

          {/* ─── Bottom Tabs ─── */}
          <div style={{
            marginTop: '32px',
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
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '14px',
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  color: activeTab === tab.key ? colors.primary : colors.textGray,
                  borderBottom: activeTab === tab.key ? `3px solid ${colors.primary}` : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}