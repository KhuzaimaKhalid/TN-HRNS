import { useRouter } from 'next/router';
import JobApplication from '@/components/JobApplication';

export default function Apply() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#effbfb',
      display: 'flex',
      justifyContent: 'center',
      padding: '32px 24px 20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
      }}>
        <JobApplication />
      </div>
    </div>
  );
}