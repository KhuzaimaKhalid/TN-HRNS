import { useRouter } from 'next/router';
import Footer from '@/components/Footer';
import JobApplication from '@/components/JobApplication';

export default function Apply() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#effbfb',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Content area – centered with padding */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        padding: '32px 24px 20px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '720px',
        }}>
          <JobApplication />
        </div>
      </div>

      {/* Footer – full width, no padding from parent */}
      <Footer />
    </div>
  );
}