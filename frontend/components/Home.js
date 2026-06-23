import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const features = [
    { icon: 'fa-solid fa-location-dot', cls: 'geo', title: 'Geo-Fencing', desc: 'Location-based attendance tracking with secure geo-fencing for accurate workforce management.' },
    { icon: 'fa-solid fa-comments', cls: 'comm', title: 'Internal Communication', desc: 'Seamless team messaging and announcements to keep everyone aligned and informed.' },
    { icon: 'fa-solid fa-pen-to-square', cls: 'digital', title: 'Digital Signature', desc: 'Secure e-signature workflows for approvals, contracts, and document sign-offs.' },
    { icon: 'fa-solid fa-calendar-days', cls: 'cal', title: 'Calendar & Events', desc: 'Centralized scheduling for meetings, deadlines, and company-wide events.' }
  ];

  const jobs = [
    { title: 'Frontend Developer', type: 'UI/UX Designer', location: 'Karachi, BUNK', desc: 'Build responsive, high-performance interfaces with modern frameworks and a pixel-perfect eye.' },
    { title: 'UI/UX Designer', type: 'Frontend Developer', location: 'Karachi, BUNK', desc: 'Design intuitive, user-centered experiences that drive engagement and delight users.' }
  ];

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Unified <span>Workforce</span> Management</h1>
          <p>TN-HRMS provides a centralized workspace for managing employees, projects, attendance, and daily operations, helping TrustNexus teams collaborate more effectively.</p>
          <div className="hero-buttons">
            <a className="btn btn-white" onClick={() => router.push('/login')}>
              <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>Login
            </a>
            <a className="btn btn-outline" onClick={() => router.push('/apply')}>
              <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>Apply for jobs
            </a>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Everything in one place</h2>
            <p>From recruitment and attendance to project management and collaboration, TN-HRMS brings every essential tool together in one secure and connected workspace.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className={`feature-icon ${f.cls}`}><i className={f.icon}></i></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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