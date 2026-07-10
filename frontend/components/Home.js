// components/Home.js
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#effbfb',
      padding: '40px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '1200px',
        width: '100%',
        gap: '60px',
      }}>
        {/* Left Column */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          textAlign: 'left',
          padding: '0 20px',
        }}>
          <h1 style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            color: '#1a1a1a',
            marginBottom: '20px',
            lineHeight: 1.1,
          }}>
            Unified <span style={{ color: '#06504A' }}>Workforce</span> Management
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
            color: '#4a5a5a',
            maxWidth: '550px',
            lineHeight: 1.7,
          }}>
            TN-HRMS provides a centralized workspace for managing employees,
            projects, attendance, and daily operations, helping TrustNexus teams
            collaborate more effectively.
          </p>
        </div>

        {/* Right Column */}
        <div style={{
          flex: 1,
          minWidth: '250px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Logo */}
          <div style={{
            width: '160px',
            height: '160px',
            background: 'linear-gradient(135deg, #0ED1CD, #00423D)',
            borderRadius: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(0,66,61,0.2)',
            marginBottom: '80px',
          }}>
            <span style={{
              fontSize: '4rem',
              fontWeight: 800,
              color: '#ffffff',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '-2px',
            }}>TN</span>
          </div>

          {/* Buttons – gap now 40px */}
          <div style={{
            display: 'flex',
            gap: '40px', // Increased from 28px to 40px
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <button
              onClick={() => router.push('/login')}
              style={{
                background: '#00423D',
                color: '#ffffff',
                border: 'none',
                padding: '14px 40px',
                borderRadius: '40px',
                fontWeight: 600,
                fontSize: '1rem',
                fontFamily: "'Poppins', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 14px rgba(0,66,61,0.25)',
              }}
              onMouseEnter={(e) => e.target.style.background = '#00332e'}
              onMouseLeave={(e) => e.target.style.background = '#00423D'}
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              style={{
                background: '#0ED1CD',
                color: '#00423D',
                border: 'none',
                padding: '14px 40px',
                borderRadius: '40px',
                fontWeight: 600,
                fontSize: '1rem',
                fontFamily: "'Poppins', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 14px rgba(14,209,205,0.3)',
              }}
              onMouseEnter={(e) => e.target.style.background = '#0bb5b1'}
              onMouseLeave={(e) => e.target.style.background = '#0ED1CD'}
            >
              + Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}