import Layout from '@/components/Layout';

export default function Careers() {
  const openings = [
    { title: 'Frontend Developer', location: 'Karachi, Pakistan', type: 'Full‑time' },
    { title: 'UI/UX Designer', location: 'Karachi, Pakistan', type: 'Full‑time' },
    { title: 'Backend Engineer', location: 'Remote', type: 'Full‑time' },
    { title: 'Project Manager', location: 'Karachi, Pakistan', type: 'Full‑time' },
    { title: 'DevOps Engineer', location: 'Karachi, Pakistan', type: 'Full‑time' },
  ];

  return (
    <Layout>
      <div className="careers-page">
        <div className="container">
          <div className="careers-header">
            <h1 className="careers-title">Join Our Team</h1>
            <p className="careers-subtitle">
              At Trust Nexus, we believe in building the future together. Explore our open positions and become part of a dynamic, purpose‑driven team.
            </p>
          </div>

          <div className="careers-grid">
            {openings.map((job, index) => (
              <div className="career-card" key={index}>
                <h3 className="career-title">{job.title}</h3>
                <div className="career-meta">
                  <span><i className="fas fa-map-pin"></i> {job.location}</span>
                  <span><i className="fas fa-briefcase"></i> {job.type}</span>
                </div>
                <button className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }}>
                  Apply Now
                </button>
              </div>
            ))}
          </div>

          {/* ✅ Minimal fix: added inline styles for visibility */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(4px)',
                color: 'var(--text-dark)',
                fontSize: '1rem',
                margin: '0 auto',
              }}
            >
              Don't see the right role? Send your CV to{' '}
              <a
                href="mailto:hr@trustnexus.com"
                style={{
                  color: 'var(--primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                hr@trustnexus.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .careers-page {
          padding: 60px 0 80px;
          position: relative;
          z-index: 1;
        }

        .careers-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 48px;
        }

        .careers-title {
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .careers-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .careers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .career-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          border-radius: 20px;
          padding: 28px 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .career-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0, 66, 61, 0.08);
          border-color: var(--bg-light);
          background: rgba(255, 255, 255, 0.95);
        }

        .career-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .career-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .career-meta i {
          margin-right: 4px;
          color: var(--primary);
        }

        @media (max-width: 768px) {
          .careers-title { font-size: 1.8rem; }
          .careers-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .careers-grid { grid-template-columns: 1fr; }
          .career-card { padding: 20px 16px; }
        }
      `}</style>
    </Layout>
  );
}