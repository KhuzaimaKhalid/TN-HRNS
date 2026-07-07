import { useRouter } from 'next/router';

export default function HRPageLayout({ title, children }) {
  const router = useRouter();

  const colors = {
    primary: '#007A7C',        // new teal
    lightTeal: '#E8F5F5',
    bg: '#FAFBFC',
    textDark: '#1A1A1A',
    textGray: '#666666',
    border: '#020a14',
    cardBg: '#FFFFFF',
    greenIcon: '#2F8A4B',
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#effbfb',
      minHeight: '100vh',
      padding: 'clamp(16px, 4vw, 40px)',
      boxSizing: 'border-box'
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* ─── Top Header ─── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 700, color: colors.textDark, margin: 0 }}>{title}</h1>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            width: '100%',
            maxWidth: '500px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '4px',
              flex: 1,
              minWidth: '180px'
            }}>
              <i className="fas fa-search" style={{ color: colors.textGray, fontSize: '14px', paddingLeft: '8px' }}></i>
              <input 
                type="text" 
                placeholder="Search projects, tasks, or clients..." 
                style={{
                  border: 'none',
                  outline: 'none',
                  padding: '8px 12px',
                  flex: 1,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '14px',
                  minWidth: '80px'
                }}
              />
              <button style={{
                backgroundColor: colors.primary,
                color: 'white',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                whiteSpace: 'nowrap'
              }}>
                Search
              </button>
            </div>
            <button style={{
              backgroundColor: colors.greenIcon,
              color: 'white',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}>
              <i className="fas fa-wifi"></i>
            </button>
          </div>
        </div>
        
        <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, marginBottom: 'clamp(16px, 3vw, 30px)' }} />

        {/* ─── Page Content ─── */}
        <div>{children}</div>

      </div>
    </div>
  );
}