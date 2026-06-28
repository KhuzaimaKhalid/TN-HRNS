import Layout from '@/components/Layout';

export default function Contact() {
  const contactInfo = [
    { icon: 'fa-map-pin', label: 'Office', value: 'Karachi, Pakistan' },
    { icon: 'fa-envelope', label: 'Email', value: 'hrms@trustnexus.com', link: 'mailto:hrms@trustnexus.com' },
    { icon: 'fa-phone', label: 'Phone', value: '+92 21 1234567' },
    { icon: 'fa-clock', label: 'Hours', value: 'Mon–Fri, 9:00 AM – 6:00 PM' },
  ];

  return (
    <Layout>
      <div className="contact-page">
        <div className="container">
          <div className="contact-header">
            <h1 className="contact-title">Get in Touch</h1>
            <p className="contact-subtitle">
              We’d love to hear from you. Reach out with questions, feedback, or partnership ideas.
            </p>
          </div>

          <div className="contact-grid">
            {contactInfo.map((item, index) => (
              <div className="contact-card" key={index}>
                <div className="contact-icon-wrapper">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h4 className="contact-card-label">{item.label}</h4>
                {item.link ? (
                  <a href={item.link} className="contact-card-value" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    {item.value}
                  </a>
                ) : (
                  <p className="contact-card-value">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="contact-form-card">
            <h3>Send a Message</h3>
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input type="text" className="form-input" placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-input" placeholder="john@example.com" />
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-input" rows="4" placeholder="Your message..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-page {
          padding: 60px 0 80px;
          position: relative;
          z-index: 1;
        }

        .contact-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 48px;
        }

        .contact-title {
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .contact-subtitle {
          font-size: 1.1rem;
          color: var(--text-primary);
          line-height: 1.6;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .contact-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          border-radius: 20px;
          padding: 28px 20px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          transition: transform 0.25s ease;
        }

        .contact-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 66, 61, 0.08);
        }

        .contact-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
          color: #fff;
          font-size: 1.6rem;
          margin-bottom: 12px;
        }

        .contact-card-label {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .contact-card-value {
          font-size: 0.95rem;
          color: var(--text-dark);
        }

        .contact-form-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          border-radius: 24px;
          padding: 32px 36px;
          max-width: 700px;
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .contact-form-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 20px;
          text-align: center;
        }

        .contact-form-card .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .contact-form-card .form-group {
          margin-bottom: 16px;
        }

        .contact-form-card .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .contact-form-card .form-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          font-family: inherit;
          transition: border-color 0.25s ease;
        }

        .contact-form-card .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(0, 66, 61, 0.06);
        }

        @media (max-width: 768px) {
          .contact-title { font-size: 1.8rem; }
          .contact-grid { grid-template-columns: 1fr 1fr; }
          .contact-form-card { padding: 24px 18px; }
          .contact-form-card .form-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </Layout>
  );
}