import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const jobs = [
    { title: 'Frontend Developer', type: 'UI/UX Designer', location: 'Karachi, BUNK', desc: 'Build responsive, high-performance interfaces with modern frameworks and a pixel-perfect eye.' },
    { title: 'UI/UX Designer', type: 'Frontend Developer', location: 'Karachi, BUNK', desc: 'Design intuitive, user-centered experiences that drive engagement and delight users.' }
  ];

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="hero">
        <div className="container">
          <h1>Unified <span>Workforce</span> Management</h1>
          <p>TN-HRMS provides a centralized workspace for managing employees, projects, attendance, and daily operations, helping TrustNexus teams collaborate more effectively.</p>
          <div className="hero-buttons">
            <a className="btn btn-white" onClick={() => router.push('/login')}>
              <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>Login
            </a>
            <a className="btn btn-outline" onClick={() => router.push('/register')}>
              <i className="fas fa-user-plus" style={{ marginRight: '8px' }}></i>Sign Up
            </a>
          </div>
        </div>
      </section>

      {/* ─── Join Team Section ─── */}
      <section className="join-team">
        <div className="container">
          <div className="section-title">
            <h2>Join our team <span style={{ color: '#0ED1CD' }}>✨</span></h2>
            <p>Build The Future With TrustNexus</p>
          </div>
          <div className="jobs-grid">
            {jobs.map((job, i) => (
              <div className="job-card" key={i}>
                <div className="job-title">{job.title}</div>
                <div className="job-meta">
                  <span><i className="fas fa-briefcase"></i>{job.type}</span>
                  <span><i className="fas fa-location-dot"></i>{job.location}</span>
                </div>
                <div className="job-desc">{job.desc}</div>
                <a className="btn btn-primary" onClick={() => router.push('/apply')}>Apply now</a>
              </div>
            ))}
          </div>
          <div className="jobs-cta">
            <a className="btn btn-dark" onClick={() => router.push('/apply')}>
              <i className="fas fa-paper-plane" style={{ marginRight: '10px' }}></i>Apply for jobs
            </a>
          </div>
        </div>
      </section>
    </>
  );
}