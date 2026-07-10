import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const jobs = [
    { title: 'Frontend Developer', type: 'UI/UX Designer', location: 'Karachi, BUNK' },
    { title: 'UI/UX Designer', type: 'Frontend Developer', location: 'Karachi, BUNK' },
    { title: 'Backend Engineer', type: 'Node.js / Python', location: 'Remote' },
    { title: 'Project Manager', type: 'Agile / Scrum', location: 'Karachi, BUNK' },
  ];

  // Duplicate jobs for seamless looping
  const scrollingJobs = [...jobs, ...jobs, ...jobs];

  return (
    <section className="hero" style={{
      height: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 20px',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
    }}>
      <div className="container" style={{
        width: '100%',
        maxWidth: '100%',
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
          fontWeight: 800,
          letterSpacing: '-1px',
          marginBottom: '20px',
          color: '#1a1a1a',
          wordWrap: 'break-word',
        }}>
          Unified <span style={{ color: '#06504A' }}>Workforce</span> Management
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.35rem)',
          maxWidth: '700px',
          margin: '0 auto 32px',
          color: '#1a1a1a',
          lineHeight: 1.8,
          padding: '0 10px',
        }}>
          TN-HRMS provides a centralized workspace for managing employees, projects, attendance, and daily operations, helping TrustNexus teams collaborate more effectively.
        </p>
        <div className="hero-buttons" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '14px',
          padding: '0 10px',
          marginBottom: '24px',
        }}>
          <a className="btn btn-login" onClick={() => router.push('/login')} style={{
            background: '#00423D',
            color: '#ffffff',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '40px',
            fontWeight: 600,
            fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
            fontFamily: "'Poppins', sans-serif",
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 14px rgba(0,66,61,0.25)',
            textDecoration: 'none',
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}>
            <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>Login
          </a>
          <a className="btn btn-signup" onClick={() => router.push('/register')} style={{
            background: '#00423D',
            color: '#ffffff',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '40px',
            fontWeight: 600,
            fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
            fontFamily: "'Poppins', sans-serif",
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 14px rgba(0,66,61,0.25)',
            textDecoration: 'none',
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}>
            <i className="fas fa-user-plus" style={{ marginRight: '8px' }}></i>Sign Up
          </a>
        </div>

        {/* ─── Horizontal Moving Line (Marquee) ─── */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          overflow: 'hidden',
          padding: '12px 0',
          borderTop: '1px solid rgba(0,66,61,0.1)',
          borderBottom: '1px solid rgba(0,66,61,0.1)',
        }}>
          <div style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            animation: 'marqueeScroll 25s linear infinite',
            gap: '40px',
          }}>
            {scrollingJobs.map((job, index) => (
              <div key={index} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
                color: '#1a1a1a',
              }}>
                <span style={{ fontWeight: 600, color: '#00423D' }}>{job.title}</span>
                <span style={{ color: '#666' }}>•</span>
                <span style={{ color: '#666' }}>{job.type}</span>
                <span style={{ color: '#666' }}>•</span>
                <span style={{ color: '#666' }}>{job.location}</span>
                <span style={{
                  display: 'inline-block',
                  background: '#00423D',
                  color: '#fff',
                  padding: '2px 12px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  marginLeft: '4px',
                  cursor: 'pointer',
                }} onClick={() => router.push('/apply')}>
                  Apply
                </span>
                <span style={{ color: '#0ED1CD', marginLeft: '4px' }}>|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add keyframe animation via style tag */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
}